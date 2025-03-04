import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function Dashboard() {
   const { user, logout } = useContext(AuthContext)!;

   return (
      <div className='p-6'>
         <h2 className='text-3xl text-white'>Welcome, {user?.name}!</h2>
         <button onClick={logout} className='bg-red-500 text-white px-4 py-2 rounded mt-4'>
            Logout
         </button>
      </div>
   );
}
