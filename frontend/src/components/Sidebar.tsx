import { NavLink, useLocation } from 'react-router-dom';
import { sidebarLinks } from '../constants';
import type { SidebarLink } from '../constants';

const Sidebar = () => {
     const location = useLocation();

     return (
          <div className='max-h-screen w-64 bg-gray-900 text-white p-4'>
               <h2 className='text-2xl font-bold mb-6'>Movies</h2>
               <nav className='flex flex-col space-y-2'>
                    {sidebarLinks.map((link: SidebarLink) => {
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
