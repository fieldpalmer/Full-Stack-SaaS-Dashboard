import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '../constants';
import type { NavLink } from '../constants';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
     const [active, setActive] = useState<string>('/');
     const [toggle, setToggle] = useState<boolean>(false);

     return (
          <div className='bg-gray-950'>
               <div className='w-full'>
                    <nav className='w-full flex p-6 justify-between items-center navbar'>
                         <Link
                              to='/'
                              className='text-gradient text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'
                         >
                              MT
                         </Link>

                         {/* Desktop Navigation */}
                         <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
                              {navLinks.map((nav: NavLink, index: number) => (
                                   <li key={nav.id} onClick={() => setActive(nav.title)}>
                                        <Link
                                             to={`${nav.id}`}
                                             className={`font-poppins font-normal cursor-pointer text-[16px] ${
                                                  active === nav.title ? 'text-blue-400' : 'text-gray-100'
                                             } ${index === navLinks.length - 1 ? 'mr-0' : 'mr-10'} hover:text-blue-400`}
                                        >
                                             {nav.title}
                                        </Link>
                                   </li>
                              ))}
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
                                   </ul>
                              </div>
                         </div>
                    </nav>
               </div>
          </div>
     );
};

export default Navbar;
