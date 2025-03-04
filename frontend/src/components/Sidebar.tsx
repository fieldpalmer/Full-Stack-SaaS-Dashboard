import { Link } from 'react-router-dom';

export default function Sidebar() {
   return (
      <nav className='w-64 bg-gray-800 h-full p-5 shadow-lg'>
         <h1 className='text-2xl font-bold text-white mb-6'>Movies</h1>
         <ul>
            <li className='mb-4'>
               <Link to='/dashboard' className='block p-3 bg-gray-700 rounded hover:bg-gray-600'>
                  Overview
               </Link>
            </li>
            <li className='mb-4'>
               <Link
                  to='/dashboard/actors'
                  className='block p-3 bg-gray-700 rounded hover:bg-gray-600'
               >
                  Actors
               </Link>
            </li>
            <li className='mb-4'>
               <Link
                  to='/dashboard/directors'
                  className='block p-3 bg-gray-700 rounded hover:bg-gray-600'
               >
                  Directors
               </Link>
            </li>
            <li className='mb-4'>
               <Link
                  to='/dashboard/genres'
                  className='block p-3 bg-gray-700 rounded hover:bg-gray-600'
               >
                  Genres
               </Link>
            </li>
         </ul>
      </nav>
   );
}
