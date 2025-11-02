from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables for model and preprocessor
model = None
label_encoder = None
symptom_list = []
feature_columns = []
# Track where models were loaded from for diagnostics
model_load_details = {
    'model_path': None,
    'preprocessor_path': None,
}

# Base directory for this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def _resolve_model_path(filename: str):
    """Resolve a model file path from several likely locations.

    Priority order:
    1) Environment variable AAROGYA_ML_MODELS_DIR
    2) ml-service directory (alongside this app.py)
    3) project root (parent of ml-service)
    4) current working directory
    """
    candidates = []

    # 1) Env override
    env_dir = os.environ.get('AAROGYA_ML_MODELS_DIR')
    if env_dir:
        candidates.append(os.path.join(env_dir, filename))

    # 2) ml-service directory
    candidates.append(os.path.join(BASE_DIR, filename))

    # 3) project root (parent of ml-service)
    candidates.append(os.path.abspath(os.path.join(BASE_DIR, os.pardir, filename)))

    # 4) current working directory
    candidates.append(os.path.join(os.getcwd(), filename))

    for path in candidates:
        if os.path.exists(path):
            logger.info(f'Resolved path for {filename}: {path}')
            return path

    # If none found, log what we tried
    logger.error(f'Could not find {filename}. Tried: ' + "; ".join(candidates))
    raise FileNotFoundError(filename)

def load_models():
    """Load PKL files at startup"""
    global model, label_encoder, symptom_list, feature_columns, model_load_details
    
    try:
        # Resolve and load disease predictor model
        model_path = _resolve_model_path('disease_predictor_v2.pkl')
        logger.info(f'Loading model from {model_path}')

        with open(model_path, 'rb') as f:
            loaded = pickle.load(f)

        # Support both tuple (model, label_encoder) and dict formats
        if isinstance(loaded, tuple) and len(loaded) == 2:
            model, label_encoder = loaded
        elif isinstance(loaded, dict):
            model = loaded.get('model')
            label_encoder = loaded.get('label_encoder') or loaded.get('le')
        else:
            raise ValueError('Unsupported model file format. Expected tuple(model, label_encoder) or dict with keys.')
        
        logger.info('Model loaded successfully')
        logger.info(f'Model type: {type(model).__name__}')
        try:
            logger.info(f'Number of classes: {len(label_encoder.classes_)}')
        except Exception:
            logger.info('Label encoder classes could not be determined during logging.')
        
        # Resolve and load preprocessor info
        preprocessor_path = _resolve_model_path('processed_data_info.pkl')
        logger.info(f'Loading preprocessor from {preprocessor_path}')

        with open(preprocessor_path, 'rb') as f:
            processed_info = pickle.load(f)
        
        # Extract fields from processed info
        if isinstance(processed_info, dict):
            mlb = processed_info.get('mlb')
            if mlb is not None and hasattr(mlb, 'classes_'):
                symptom_list = list(mlb.classes_)
            else:
                # Fallbacks for possible key names
                symptoms = processed_info.get('symptoms') or processed_info.get('symptom_list')
                if symptoms:
                    symptom_list = list(symptoms)
                else:
                    logger.warning('No symptom list found in processed_data_info.pkl; symptom endpoints may be limited.')
                    symptom_list = []

            feature_columns = processed_info.get('feature_columns') or processed_info.get('columns') or []
        else:
            raise ValueError('Unsupported processed_data_info format. Expected dict with keys.')
        
        logger.info(f'Loaded {len(symptom_list)} symptoms')
        logger.info(f'Feature columns: {len(feature_columns)}')
        model_load_details['model_path'] = model_path
        model_load_details['preprocessor_path'] = preprocessor_path
        
        return True
        
    except FileNotFoundError as e:
        logger.error(f'Model file not found: {e}')
        return False
    except Exception as e:
        logger.error(f'Error loading models: {e}')
        return False

def preprocess_input(symptoms, age, gender):
    """
    Convert input symptoms, age, gender to feature vector matching training data
    """
    try:
        # Create DataFrame with all feature columns initialized to 0
        feature_dict = {col: 0 for col in feature_columns}
        
        # Set symptom columns to 1 for present symptoms
        for symptom in symptoms:
            symptom_lower = symptom.lower().strip()
            # Try to find matching feature column
            for col in feature_columns:
                if symptom_lower in col.lower():
                    feature_dict[col] = 1
                    break
        
        # Set age
        if 'age' in feature_dict:
            feature_dict['age'] = age
        
        # Set gender (assuming gender_Male column exists)
        if 'gender_Male' in feature_dict:
            feature_dict['gender_Male'] = 1 if gender == 'Male' else 0
        
        # Create DataFrame with correct column order
        df = pd.DataFrame([feature_dict], columns=feature_columns)
        
        logger.info(f'Preprocessed features: {df.shape}')
        logger.info(f'Active features: {df.sum(axis=1).values[0]}')
        
        return df
        
    except Exception as e:
        logger.error(f'Preprocessing error: {e}')
        raise

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'model_path': model_load_details.get('model_path'),
        'preprocessor_path': model_load_details.get('preprocessor_path'),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/ml/predict', methods=['POST'])
def predict():
    """
    Disease prediction endpoint
    
    Request Body:
    {
        "symptoms": ["fever", "cough", "fatigue"],
        "age": 30,
        "gender": "Male"
    }
    
    Response:
    {
        "predictions": [
            {"disease": "Influenza", "probability": 0.997313},
            {"disease": "Common Cold", "probability": 0.002145}
        ],
        "confidence": 0.997313,
        "method": "XGBoost Classifier",
        "model_version": "v2"
    }
    """
    try:
        # Validate request
        if not request.json:
            return jsonify({'error': 'Request body must be JSON'}), 400
        
        data = request.json
        symptoms = data.get('symptoms', [])
        age = data.get('age')
        gender = data.get('gender')
        
        # Validate inputs
        if not symptoms or len(symptoms) == 0:
            return jsonify({'error': 'At least one symptom is required'}), 400
        
        if not age or age < 1 or age > 120:
            return jsonify({'error': 'Valid age (1-120) is required'}), 400
        
        if gender not in ['Male', 'Female', 'Other']:
            return jsonify({'error': 'Gender must be Male, Female, or Other'}), 400
        
        logger.info(f'Prediction request: {len(symptoms)} symptoms, age={age}, gender={gender}')
        
        # Check if model is loaded
        if model is None or label_encoder is None:
            logger.error('Model not loaded')
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Preprocess input
        features = preprocess_input(symptoms, age, gender)
        
        # Make prediction
        probabilities = model.predict_proba(features)[0]
        
        # Get top 5 predictions
        top_indices = np.argsort(probabilities)[::-1][:5]
        
        predictions = []
        for idx in top_indices:
            disease_name = label_encoder.inverse_transform([idx])[0]
            probability = float(probabilities[idx])
            
            predictions.append({
                'disease': disease_name,
                'probability': probability
            })
        
        response = {
            'predictions': predictions,
            'confidence': predictions[0]['probability'],
            'method': 'XGBoost Classifier',
            'model_version': 'v2',
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f'Prediction successful: {predictions[0]["disease"]} ({predictions[0]["probability"]:.4f})')
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f'Prediction error: {e}', exc_info=True)
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500

@app.route('/api/ml/symptoms', methods=['GET'])
def get_symptoms():
    """Get list of available symptoms"""
    return jsonify({
        'symptoms': symptom_list,
        'count': len(symptom_list)
    })

if __name__ == '__main__':
    logger.info('Starting Flask ML service...')
    
    # Load models at startup
    if not load_models():
        logger.error('Failed to load models. Please check PKL files exist.')
        exit(1)
    
    # Start Flask server
    port = int(os.environ.get('PORT', 5001))
    logger.info(f'Starting server on port {port}')
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.environ.get('FLASK_ENV') == 'development'
    )
