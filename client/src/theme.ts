import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
      contrastText: '#FFFFFF'
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626'
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706'
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB'
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669'
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B'
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em'
    }
  },
  shape: {
    borderRadius: 16
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(99, 102, 241, 0.1)',
    '0px 4px 8px rgba(99, 102, 241, 0.15)',
    '0px 8px 16px rgba(99, 102, 241, 0.2)',
    '0px 12px 24px rgba(99, 102, 241, 0.25)',
    '0px 16px 32px rgba(99, 102, 241, 0.3)',
    '0px 20px 40px rgba(99, 102, 241, 0.35)',
    '0px 2px 4px rgba(0, 0, 0, 0.2)',
    '0px 4px 8px rgba(0, 0, 0, 0.2)',
    '0px 8px 16px rgba(0, 0, 0, 0.2)',
    '0px 12px 24px rgba(0, 0, 0, 0.2)',
    '0px 16px 32px rgba(0, 0, 0, 0.2)',
    '0px 20px 40px rgba(0, 0, 0, 0.2)',
    '0px 2px 4px rgba(0, 0, 0, 0.2)',
    '0px 4px 8px rgba(0, 0, 0, 0.2)',
    '0px 8px 16px rgba(0, 0, 0, 0.2)',
    '0px 12px 24px rgba(0, 0, 0, 0.2)',
    '0px 16px 32px rgba(0, 0, 0, 0.2)',
    '0px 20px 40px rgba(0, 0, 0, 0.2)',
    '0px 2px 4px rgba(0, 0, 0, 0.2)',
    '0px 4px 8px rgba(0, 0, 0, 0.2)',
    '0px 8px 16px rgba(0, 0, 0, 0.2)',
    '0px 12px 24px rgba(0, 0, 0, 0.2)',
    '0px 16px 32px rgba(0, 0, 0, 0.2)',
    '0px 20px 40px rgba(0, 0, 0, 0.2)'
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#6366F1 #1E293B',
          '&::-webkit-scrollbar': {
            width: '10px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#1E293B'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #6366F1 0%, #EC4899 100%)',
            borderRadius: '10px',
            '&:hover': {
              background: 'linear-gradient(180deg, #818CF8 0%, #F472B6 100%)'
            }
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '1rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
          },
          '&:active': {
            transform: 'translateY(0)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)'
          }
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#6366F1',
          '&:hover': {
            borderWidth: '2px',
            borderColor: '#818CF8',
            background: 'rgba(99, 102, 241, 0.08)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 48px rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 0.3)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
        },
        elevation2: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
        },
        elevation3: {
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            background: 'rgba(255, 255, 255, 0.03)',
            '& fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.2)',
              borderWidth: '2px'
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.4)'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366F1',
              borderWidth: '2px',
              boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
            }
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6366F1'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }
        },
        filled: {
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: '#FFFFFF'
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#6366F1'
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
          fontWeight: 700
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
          background: 'rgba(99, 102, 241, 0.1)'
        },
        bar: {
          borderRadius: 10,
          background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
          fontWeight: 500
        },
        standardSuccess: {
          background: 'rgba(102, 187, 106, 0.15)',
          borderColor: 'rgba(102, 187, 106, 0.3)'
        },
        standardError: {
          background: 'rgba(255, 82, 82, 0.15)',
          borderColor: 'rgba(255, 82, 82, 0.3)'
        },
        standardWarning: {
          background: 'rgba(255, 167, 38, 0.15)',
          borderColor: 'rgba(255, 167, 38, 0.3)'
        },
        standardInfo: {
          background: 'rgba(41, 182, 246, 0.15)',
          borderColor: 'rgba(41, 182, 246, 0.3)'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(148, 163, 184, 0.15)'
        }
      }
    }
  }
});

export default theme;
