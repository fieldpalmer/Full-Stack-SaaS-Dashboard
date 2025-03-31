import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import { sidebarLinks } from '../constants';
import type { SidebarLink } from '../constants';
import { FaUserCircle } from 'react-icons/fa';

const Sidebar = () => {
     const location = useLocation();
     const { user } = useContext(AuthContext)!;

     return (
          <div className='w-64 bg-gray-900 text-white p-4 flex flex-col'>
               <div className='flex-1'>
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

               <div className='mt-auto pt-4 border-t border-gray-700'>
                    <div className='flex items-center space-x-3 mb-4'>
                         <FaUserCircle className='text-2xl text-gray-400' />
                         <div>
                              <p className='text-sm font-medium'>Welcome, {user?.name}</p>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default Sidebar;
