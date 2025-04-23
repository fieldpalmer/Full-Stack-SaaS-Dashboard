import { useState, useEffect } from 'react';
import { FiX, FiUser, FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface WelcomeModalProps {
   isOpen: boolean;
   onClose: () => void;
}

const WelcomeModal = ({ isOpen, onClose }: WelcomeModalProps) => {
   const [showModal, setShowModal] = useState(false);

   useEffect(() => {
      // Check if user has seen the welcome modal before
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
         setShowModal(true);
         localStorage.setItem('hasSeenWelcome', 'true');
      }
   }, []);

   if (!isOpen || !showModal) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* Dark overlay */}
         <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose} />

         {/* Modal content */}
         <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 w-full max-w-md mx-4">
            <button
               onClick={onClose}
               className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
               <FiX size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white">Welcome to TasteIQ!</h2>

            <div className="space-y-4 text-gray-300">
               <p>
                  TasteIQ is your personal dashboard for tracking and analyzing your favorite
                  movies, books, and music.
               </p>
               <p>Key features include:</p>
               <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Track your favorite media across all categories</li>
                  <li>View detailed statistics and insights about your preferences</li>
                  <li>Compare your favorites with overall trends</li>
                  <li>Save your data for future visits</li>
               </ul>
               <p className="pt-4">
                  You can continue as a guest, but to save your data between visits, please sign in
                  or create an account.
               </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
               <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
               >
                  <FiLogIn className="text-xl sm:text-2xl text-white" />
                  <span className="text-base font-medium text-white">Login</span>
               </Link>
               <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-green-600 text-white shadow-lg shadow-green-500/20 hover:bg-green-700"
               >
                  <FiUser className="text-xl sm:text-2xl text-white" />
                  <span className="text-base font-medium text-white">Register</span>
               </Link>
               <button
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors bg-gray-700 text-white shadow-lg shadow-gray-500/20 hover:bg-gray-600"
               >
                  <span className="text-base font-medium text-white">Continue as Guest</span>
               </button>
            </div>
         </div>
      </div>
   );
};

export default WelcomeModal;
