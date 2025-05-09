import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from 'styled-components';
import  GlobalStyles  from './styles/GlobalStyles';
import App from './App';

const root = createRoot(document.getElementById('root'));
const theme = {
  colors: {
    primary: '#4361ee',
    // ... other theme colors
  }
};


root.render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider theme={theme}>
    <GlobalStyles />
      <App />
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);