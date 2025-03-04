import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router';

export default function Register() {
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await axios.post('http://localhost:5001/register', { name, email, password });
         alert('Registration successful! Please log in.');
         navigate('/login');
      } catch (err: unknown) {
         if (axios.isAxiosError(err) && err.response) {
            alert(err.response.data.error);
         }
      }
   };

   return (
      <div className='flex justify-center items-center h-screen w-screen bg-gray-900 text-white'>
         <form onSubmit={handleSubmit} className='bg-gray-800 p-6 shadow-md rounded w-96'>
            <h2 className='text-2xl mb-4 text-center'>Register</h2>
            <input
               type='text'
               placeholder='Name'
               value={name}
               onChange={(e) => setName(e.target.value)}
               className='block border p-2 mb-2 w-full bg-gray-700 text-white'
               required
            />
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
            <button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full'>
               Register
            </button>
            <hr className='my-3' />
            <p>
               Already have an account? Sign in <Link to='/login'>here</Link>
            </p>
         </form>
      </div>
   );
}
