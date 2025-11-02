const mongoose = require('mongoose');
const Symptom = require('../models/Symptom');
require('dotenv').config();

const symptoms = [
  {
    name: 'Fever',
    category: 'General',
    severity: 'Moderate',
    translations: {
      hi: 'बुखार',
      or: 'ଜ୍ୱର',
      ta: 'காய்ச்சல்',
      kn: 'ಜ್ವರ',
      ml: 'പനി',
      mr: 'ताप'
    },
    commonDiseases: ['Influenza', 'Malaria', 'Dengue', 'COVID-19', 'Typhoid'],
    description: 'Elevated body temperature above normal'
  },
  {
    name: 'Cough',
    category: 'Respiratory',
    severity: 'Mild',
    translations: {
      hi: 'खांसी',
      or: 'କାଶ',
      ta: 'இருமல்',
      kn: 'ಕೆಮ್ಮು',
      ml: 'ചുമ',
      mr: 'खोकला'
    },
    commonDiseases: ['Common Cold', 'Bronchitis', 'Pneumonia', 'Asthma', 'COVID-19'],
    description: 'Sudden expulsion of air from the lungs'
  },
  {
    name: 'Headache',
    category: 'Neurological',
    severity: 'Moderate',
    translations: {
      hi: 'सिरदर्द',
      or: 'ମୁଣ୍ଡବ୍ୟଥା',
      ta: 'தலைவலி',
      kn: 'ತಲೆನೋವು',
      ml: 'തലവേദന',
      mr: 'डोकेदुखी'
    },
    commonDiseases: ['Migraine', 'Tension Headache', 'Sinusitis', 'Dengue'],
    description: 'Pain in the head or upper neck'
  },
  {
    name: 'Chest Pain',
    category: 'Cardiovascular',
    severity: 'Severe',
    translations: {
      hi: 'सीने में दर्द',
      or: 'ଛାତିରେ ଯନ୍ତ୍ରଣା',
      ta: 'மார்பு வலி',
      kn: 'ಎದೆ ನೋವು',
      ml: 'നെഞ്ചുവേദന',
      mr: 'छातीत वेदना'
    },
    commonDiseases: ['Heart Attack', 'Angina', 'Pneumonia', 'GERD'],
    description: 'Pain or discomfort in the chest area'
  },
  {
    name: 'Breathlessness',
    category: 'Respiratory',
    severity: 'Severe',
    translations: {
      hi: 'सांस फूलना',
      or: 'ଶ୍ୱାସ କଷ୍ଟ',
      ta: 'மூச்சுத்திணறல்',
      kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ',
      ml: 'ശ്വാസതടസ്സം',
      mr: 'श्वास लागणे'
    },
    commonDiseases: ['Asthma', 'Pneumonia', 'Heart Failure', 'COVID-19'],
    description: 'Difficulty in breathing or shortness of breath'
  },
  {
    name: 'Abdominal Pain',
    category: 'Gastrointestinal',
    severity: 'Moderate',
    translations: {
      hi: 'पेट दर्द',
      or: 'ପେଟ ଯନ୍ତ୍ରଣା',
      ta: 'வயிற்று வலி',
      kn: 'ಹೊಟ್ಟೆ ನೋವು',
      ml: 'വയറുവേദന',
      mr: 'ओटीपोटात दुखणे'
    },
    commonDiseases: ['Gastritis', 'Appendicitis', 'Food Poisoning', 'IBS'],
    description: 'Pain in the stomach or abdomen area'
  },
  {
    name: 'Vomiting',
    category: 'Gastrointestinal',
    severity: 'Moderate',
    translations: {
      hi: 'उल्टी',
      or: 'ବାନ୍ତି',
      ta: 'வாந்தி',
      kn: 'ವಾಂತಿ',
      ml: 'ഛർദ്ദി',
      mr: 'उलट्या'
    },
    commonDiseases: ['Food Poisoning', 'Gastroenteritis', 'Migraine', 'Pregnancy'],
    description: 'Forceful expulsion of stomach contents'
  },
  {
    name: 'Diarrhea',
    category: 'Gastrointestinal',
    severity: 'Moderate',
    translations: {
      hi: 'दस्त',
      or: 'ଝାଡା',
      ta: 'வயிற்றுப்போக்கு',
      kn: 'ಅತಿಸಾರ',
      ml: 'വയറിളക്കം',
      mr: 'अतिसार'
    },
    commonDiseases: ['Food Poisoning', 'Cholera', 'Dysentery', 'IBS'],
    description: 'Frequent loose or watery bowel movements'
  },
  {
    name: 'Fatigue',
    category: 'General',
    severity: 'Mild',
    translations: {
      hi: 'थकान',
      or: 'କ୍ଳାନ୍ତି',
      ta: 'சோர்வு',
      kn: 'ಆಯಾಸ',
      ml: 'ക്ഷീണം',
      mr: 'थकवा'
    },
    commonDiseases: ['Anemia', 'Diabetes', 'Thyroid Disorders', 'Depression'],
    description: 'Extreme tiredness or lack of energy'
  },
  {
    name: 'Body Ache',
    category: 'Musculoskeletal',
    severity: 'Mild',
    translations: {
      hi: 'शरीर दर्द',
      or: 'ଶରୀର ଯନ୍ତ୍ରଣା',
      ta: 'உடல் வலி',
      kn: 'ದೇಹ ನೋವು',
      ml: 'ശരീരവേദന',
      mr: 'शरीरदुखी'
    },
    commonDiseases: ['Influenza', 'Dengue', 'Chikungunya', 'Fibromyalgia'],
    description: 'Pain throughout the body'
  },
  {
    name: 'Rash',
    category: 'Dermatological',
    severity: 'Mild',
    translations: {
      hi: 'दाने',
      or: 'ଫୁସ୍କୁଡି',
      ta: 'சொறி',
      kn: 'ರ್ಯಾಶ್',
      ml: 'ചുണങ്ങ്',
      mr: 'पुरळ'
    },
    commonDiseases: ['Allergy', 'Dengue', 'Measles', 'Chickenpox'],
    description: 'Red, itchy, or inflamed skin'
  },
  {
    name: 'Dizziness',
    category: 'Neurological',
    severity: 'Moderate',
    translations: {
      hi: 'चक्कर आना',
      or: 'ମୁଣ୍ଡ ଘୁରିବା',
      ta: 'தலைச்சுற்றல்',
      kn: 'ತಲೆತಿರುಗುವುದು',
      ml: 'തലകറക്കം',
      mr: 'चक्कर येणे'
    },
    commonDiseases: ['Vertigo', 'Low Blood Pressure', 'Anemia', 'Dehydration'],
    description: 'Feeling lightheaded or unsteady'
  },
  {
    name: 'Runny Nose',
    category: 'Respiratory',
    severity: 'Mild',
    translations: {
      hi: 'नाक बहना',
      or: 'ନାକରୁ ପାଣି',
      ta: 'மூக்கு ஒழுகுதல்',
      kn: 'ಮೂಗು ಸೋರುವಿಕೆ',
      ml: 'മൂക്കൊലിപ്പ്',
      mr: 'नाक वाहणे'
    },
    commonDiseases: ['Common Cold', 'Allergic Rhinitis', 'Sinusitis'],
    description: 'Nasal discharge or congestion'
  },
  {
    name: 'Sneezing',
    category: 'Respiratory',
    severity: 'Mild',
    translations: {
      hi: 'छींक आना',
      or: 'ହଛିନାହୋବା',
      ta: 'தும்மல்',
      kn: 'ಸೀನು',
      ml: 'തുമ്മൽ',
      mr: 'शिंका'
    },
    commonDiseases: ['Common Cold', 'Allergic Rhinitis', 'Influenza'],
    description: 'Sudden involuntary expulsion of air from nose and mouth'
  },
  {
    name: 'Blurred Vision',
    category: 'Neurological',
    severity: 'Moderate',
    translations: {
      hi: 'धुंधली दृष्टि',
      or: 'ଦୃଷ୍ଟି ଝାପସା',
      ta: 'மங்கலான பார்வை',
      kn: 'ಮಂದ ದೃಷ್ಟಿ',
      ml: 'മങ്ങിയ കാഴ്ച',
      mr: 'अंधुक दृष्टी'
    },
    commonDiseases: ['Migraine', 'Diabetes', 'Hypertension', 'Cataract'],
    description: 'Loss of sharpness in eyesight'
  }
];

async function seedSymptoms() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aarogya-sahayak');
    console.log('Connected to MongoDB');

    // Clear existing symptoms
    await Symptom.deleteMany({});
    console.log('Cleared existing symptoms');

    // Insert new symptoms
    const result = await Symptom.insertMany(symptoms);
    console.log(`✅ Inserted ${result.length} symptoms`);

    mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding symptoms:', error);
    process.exit(1);
  }
}

seedSymptoms();
