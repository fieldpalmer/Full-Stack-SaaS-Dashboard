import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

export default function App() {
   return (
      <Routes>
         <Route path='/login' element={<Login />} />
         <Route path='/register' element={<Register />} />
         <Route
            path='/dashboard'
            element={
               <ProtectedRoute>
                  <Dashboard />
               </ProtectedRoute>
            }
         />
      </Routes>
   );
}
