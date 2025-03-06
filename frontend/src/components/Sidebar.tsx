import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
   const location = useLocation();

   const links = [
      { name: 'Overview', path: '/dashboard' },
      { name: 'Movies', path: '/dashboard/movies-table' },
      { name: 'Actors', path: '/dashboard/actors' },
      { name: 'Directors', path: '/dashboard/directors' },
      { name: 'Genres', path: '/dashboard/genres' },
      { name: 'My Movies', path: '/dashboard/my-movies' }
   ];

   return (
      <div className='h-screen w-64 bg-gray-900 text-white p-4'>
         <h2 className='text-2xl font-bold mb-6'>Movies</h2>
         <nav className='flex flex-col space-y-2'>
            {links.map((link) => {
               const isActive = location.pathname === link.path;
               return (
                  <NavLink
                     key={link.path}
                     to={link.path}
                     className={`px-4 py-2 rounded-lg transition duration-300 ${
                        isActive ? 'bg-purple-500 text-white font-bold' : 'hover:bg-gray-700'
                     }`}
                  >
                     {link.name}
                  </NavLink>
               );
            })}
         </nav>
      </div>
   );
};

export default Sidebar;
