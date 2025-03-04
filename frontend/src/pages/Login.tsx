import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router';

export default function Login() {
   const { login } = useContext(AuthContext)!;
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      login(email, password);
   };

   return (
      <div className='flex justify-center items-center h-screen bg-gray-900 text-white'>
         <form onSubmit={handleSubmit} className='bg-gray-800 p-6 shadow-md rounded w-96'>
            <h2 className='text-2xl mb-4 text-center'>Login</h2>
            <input
               type='email'
               placeholder='Email'
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className='block border p-2 mb-2 w-full bg-gray-700 text-white'
               required
            />
            <input
               type='password'
               placeholder='Password'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className='block border p-2 mb-2 w-full bg-gray-700 text-white'
               required
            />
            <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full'>
               Login
            </button>
            <p>
               Don't have an account yet? Sign up <Link to='/register'>here</Link>
            </p>
         </form>
      </div>
   );
}
