import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
     <Router basename='/Full-Stack-SaaS-Dashboard'>
          <AuthProvider>
               <App />
          </AuthProvider>
     </Router>
);
