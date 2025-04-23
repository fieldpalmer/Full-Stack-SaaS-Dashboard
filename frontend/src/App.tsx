import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';

function AppContent() {
   const { user, loading } = useAuth();

   useEffect(() => {
      if (!loading && !user) {
         // Only create guest if explicitly needed
         // createGuest();
      }
   }, [loading, user]);

   if (loading) {
      return <div>Loading...</div>;
   }

   return (
      <>
         <Navbar />
         <ScrollToTop />
         <Routes>
            <Route path="/*" element={<Dashboard />} />
            {/* <Route path='/login' element={<Login />} /> */}
            {/* <Route path='/register' element={<Register />} /> */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
         </Routes>
         <Footer />
      </>
   );
}

export default function App() {
   return <AppContent />;
}
