import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiX } from 'react-icons/fi';
import { AxiosError } from 'axios';

interface AuthModalsProps {
     isOpen: boolean;
     onClose: () => void;
     initialMode: 'login' | 'register';
}

const AuthModals = ({ isOpen, onClose, initialMode }: AuthModalsProps) => {
     const [mode, setMode] = useState<'login' | 'register'>(initialMode);
     const [formData, setFormData] = useState({
          email: '',
          password: '',
          name: ''
     });
     const [error, setError] = useState<string>('');
     const [loading, setLoading] = useState(false);
     const { login, register } = useAuth();

     // Update mode when initialMode changes
     useEffect(() => {
          setMode(initialMode);
     }, [initialMode]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError('');
          setLoading(true);

          try {
               if (mode === 'login') {
                    await login(formData.email, formData.password);
               } else {
                    await register(formData.name, formData.email, formData.password);
               }
               // Clear form fields
               setFormData({
                    email: '',
                    password: '',
                    name: ''
               });
               onClose();
          } catch (error) {
               const axiosError = error as AxiosError<{ error: string }>;
               if (axiosError.response?.data?.error) {
                    setError(axiosError.response.data.error);
               } else {
                    setError('An error occurred. Please try again.');
               }
          } finally {
               setLoading(false);
          }
     };

     if (!isOpen) return null;

     return (
          <div className='fixed inset-0 z-50 flex items-center justify-center'>
               {/* Dark overlay */}
               <div className='fixed inset-0 bg-gray-900/80 backdrop-blur-sm' onClick={onClose} />

               {/* Modal content */}
               <div className='relative bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 w-full max-w-md mx-4'>
                    <button onClick={onClose} className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'>
                         <FiX size={24} />
                    </button>

                    <h2 className='text-2xl font-bold mb-6 text-white'>{mode === 'login' ? 'Login' : 'Register'}</h2>

                    {error && <div className='mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md text-red-200'>{error}</div>}

                    <form onSubmit={handleSubmit} className='space-y-4'>
                         {mode === 'register' && (
                              <div>
                                   <label htmlFor='name' className='block text-sm font-medium text-gray-300 mb-1'>
                                        Name
                                   </label>
                                   <input
                                        type='text'
                                        id='name'
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        required
                                   />
                              </div>
                         )}

                         <div>
                              <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-1'>
                                   Email
                              </label>
                              <input
                                   type='email'
                                   id='email'
                                   value={formData.email}
                                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                   className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                                   required
                              />
                         </div>

                         <div>
                              <label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-1'>
                                   Password
                              </label>
                              <input
                                   type='password'
                                   id='password'
                                   value={formData.password}
                                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                   className='w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                                   required
                              />
                         </div>

                         <button
                              type='submit'
                              disabled={loading}
                              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                         >
                              {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
                         </button>
                    </form>

                    <div className='mt-4 text-center'>
                         <button
                              onClick={() => {
                                   setMode(mode === 'login' ? 'register' : 'login');
                                   setError('');
                              }}
                              className='text-blue-400 hover:text-blue-300 transition-colors'
                         >
                              {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default AuthModals;
