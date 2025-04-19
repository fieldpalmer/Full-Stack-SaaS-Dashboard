import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiChevronUp, FiUser, FiSettings, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AuthModals from './AuthModals';

interface NavLink {
     id: string;
     title: string;
}

const Navbar = () => {
     const [active, setActive] = useState<string>('/');
     const [toggle, setToggle] = useState<boolean>(false);
     const [userDropdown, setUserDropdown] = useState<boolean>(false);
     const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
     const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
     const { user, logout } = useAuth();

     const navLinks: NavLink[] = [
          { id: '/dashboard', title: 'Home' },
          { id: 'contact', title: 'Contact' }
     ];

     const handleAuthClick = (mode: 'login' | 'register') => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
          setUserDropdown(false);
          setToggle(false);
     };

     return (
          <div className='bg-gray-950'>
               <nav className='w-full flex p-6 justify-between items-center navbar'>
                    <Link
                         to='/'
                         className='text-gradient text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'
                    >
                         MT
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
                         {navLinks.map((nav: NavLink) => (
                              <li key={nav.id} onClick={() => setActive(nav.title)}>
                                   <Link
                                        to={`${nav.id}`}
                                        className={`font-poppins font-normal cursor-pointer text-[16px] ${
                                             active === nav.title ? 'text-blue-400' : 'text-gray-100'
                                        } mr-10 hover:text-blue-400`}
                                   >
                                        {nav.title}
                                   </Link>
                              </li>
                         ))}
                         <div className='relative'>
                              <button
                                   onClick={() => setUserDropdown(!userDropdown)}
                                   className='flex items-center gap-2 text-gray-100 hover:text-blue-400 transition-colors'
                              >
                                   <FiUser className='text-xl' />
                                   <span>Welcome, {user?.name || 'Guest'}</span>
                                   {userDropdown ? <FiChevronUp /> : <FiChevronDown />}
                              </button>
                              {userDropdown && (
                                   <div className='absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50'>
                                        {user && !user.isGuest ? (
                                             <>
                                                  <Link
                                                       to='/settings'
                                                       className='flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700'
                                                  >
                                                       <FiSettings />
                                                       Settings
                                                  </Link>
                                                  <button
                                                       onClick={logout}
                                                       className='w-full text-left flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700'
                                                  >
                                                       <FiLogIn className='transform rotate-180' />
                                                       Logout
                                                  </button>
                                             </>
                                        ) : (
                                             <>
                                                  <button
                                                       onClick={() => handleAuthClick('login')}
                                                       className='w-full text-left flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700'
                                                  >
                                                       <FiLogIn />
                                                       Login
                                                  </button>
                                                  <button
                                                       onClick={() => handleAuthClick('register')}
                                                       className='w-full text-left flex items-center gap-2 px-4 py-2 text-gray-100 hover:bg-gray-700'
                                                  >
                                                       <FiUser />
                                                       Register
                                                  </button>
                                             </>
                                        )}
                                   </div>
                              )}
                         </div>
                    </ul>

                    {/* Mobile Navigation */}
                    <div className='sm:hidden flex flex-1 justify-end items-center'>
                         <button onClick={() => setToggle(!toggle)} className='text-white text-2xl'>
                              {toggle ? <FiX /> : <FiMenu />}
                         </button>

                         <div
                              className={`${
                                   toggle ? 'flex' : 'hidden'
                              } p-6 bg-gray-900 absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
                         >
                              <ul className='list-none flex flex-col justify-end items-center flex-1'>
                                   {navLinks.map((nav: NavLink, index: number) => (
                                        <li
                                             key={nav.id}
                                             onClick={() => {
                                                  setActive(nav.title);
                                                  setToggle(false);
                                             }}
                                             className={`font-poppins font-normal cursor-pointer text-[16px] ${
                                                  active === nav.title ? 'text-blue-400' : 'text-gray-100'
                                             } ${index === navLinks.length - 1 ? 'mb-0' : 'mb-4'}`}
                                        >
                                             <Link to={`${nav.id}`}>{nav.title}</Link>
                                        </li>
                                   ))}
                                   <div className='mt-4'>
                                        <div className='text-gray-100 mb-2'>Welcome, {user?.name || 'Guest'}</div>
                                        {user ? (
                                             <div className='flex flex-col gap-2'>
                                                  <Link
                                                       to='/settings'
                                                       className='flex items-center gap-2 text-gray-100 hover:text-blue-400'
                                                  >
                                                       <FiSettings />
                                                       Settings
                                                  </Link>
                                                  <button
                                                       onClick={logout}
                                                       className='flex items-center gap-2 text-gray-100 hover:text-blue-400'
                                                  >
                                                       <FiLogIn className='transform rotate-180' />
                                                       Logout
                                                  </button>
                                             </div>
                                        ) : (
                                             <div className='flex flex-col gap-2'>
                                                  <button
                                                       onClick={() => handleAuthClick('login')}
                                                       className='flex items-center gap-2 text-gray-100 hover:text-blue-400'
                                                  >
                                                       <FiLogIn />
                                                       Login
                                                  </button>
                                                  <button
                                                       onClick={() => handleAuthClick('register')}
                                                       className='flex items-center gap-2 text-gray-100 hover:text-blue-400'
                                                  >
                                                       <FiUser />
                                                       Register
                                                  </button>
                                             </div>
                                        )}
                                   </div>
                              </ul>
                         </div>
                    </div>
               </nav>

               {/* Auth Modals */}
               <AuthModals isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authModalMode} />
          </div>
     );
};

export default Navbar;
