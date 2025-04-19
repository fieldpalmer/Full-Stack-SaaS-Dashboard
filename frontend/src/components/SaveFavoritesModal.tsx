import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SaveFavoritesModalProps {
     isOpen: boolean;
     onClose: () => void;
}

const SaveFavoritesModal = ({ isOpen, onClose }: SaveFavoritesModalProps) => {
     const { convertGuestToUser } = useAuth();
     const navigate = useNavigate();
     const [formData, setFormData] = useState({
          name: '',
          email: '',
          password: ''
     });
     const [error, setError] = useState('');

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
               await convertGuestToUser(formData.name, formData.email, formData.password);
               onClose();
               navigate('/dashboard');
          } catch {
               setError('Failed to create account. Please try again.');
          }
     };

     if (!isOpen) return null;

     return (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
               <div className='bg-gray-800 rounded-lg p-6 max-w-md w-full'>
                    <h2 className='text-xl font-bold text-white mb-4'>Save Your Favorites</h2>
                    <p className='text-gray-300 mb-4'>Create an account to save your favorites and access them from any device.</p>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                         <div>
                              <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                                   Name
                              </label>
                              <input
                                   type='text'
                                   id='name'
                                   value={formData.name}
                                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                   className='mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white'
                                   required
                              />
                         </div>
                         <div>
                              <label htmlFor='email' className='block text-sm font-medium text-gray-300'>
                                   Email
                              </label>
                              <input
                                   type='email'
                                   id='email'
                                   value={formData.email}
                                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                   className='mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white'
                                   required
                              />
                         </div>
                         <div>
                              <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
                                   Password
                              </label>
                              <input
                                   type='password'
                                   id='password'
                                   value={formData.password}
                                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                   className='mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white'
                                   required
                              />
                         </div>
                         {error && <p className='text-red-500 text-sm'>{error}</p>}
                         <div className='flex justify-end space-x-3'>
                              <button
                                   type='button'
                                   onClick={onClose}
                                   className='px-4 py-2 text-sm font-medium text-gray-300 hover:text-white'
                              >
                                   Cancel
                              </button>
                              <button
                                   type='submit'
                                   className='px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700'
                              >
                                   Create Account
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default SaveFavoritesModal;
