import React from 'react';
import { footerLinks } from '../constants';
import type { FooterLink, FooterSection } from '../constants';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
     return (
          <div className='bg-gray-950'>
               <section className='flex justify-center items-center sm:py-16 p-6 flex-col'>
                    <div className='flex justify-center items-start md:flex-row flex-col mb-8 w-full'>
                         <div className='flex-[1] flex flex-col justify-start mr-10'>
                              <Link
                                   to='/'
                                   className='text-gradient text-center md:text-left text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent'
                              >
                                   GFP Media Tracker
                              </Link>
                         </div>

                         <div className='flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10'>
                              {footerLinks.map((footerlink: FooterSection) => (
                                   <div key={footerlink.title} className='flex flex-col ss:my-0 my-4 min-w-[150px]'>
                                        <h4 className='font-poppins font-medium text-[18px] leading-[27px] text-white underline'>
                                             {footerlink.title}
                                        </h4>
                                        <ul className='list-none mt-4'>
                                             {footerlink.links.map((link: FooterLink, index: number) => (
                                                  <li
                                                       key={link.name}
                                                       className={`font-poppins font-normal text-[16px] text-gray-100 leading-[24px] hover:text-blue-600 cursor-pointer ${
                                                            index !== footerlink.links.length - 1 ? 'mb-4' : 'mb-0'
                                                       }`}
                                                  >
                                                       <Link className='text-gray-100 hover:text-blue-600' to={link.link}>
                                                            {link.name}
                                                       </Link>
                                                  </li>
                                             ))}
                                        </ul>
                                   </div>
                              ))}
                         </div>
                    </div>

                    <div className='w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-gray-400'>
                         <small className='font-poppins font-normal text-center text-gray-300'>
                              Copyright Ⓒ 2025. All Rights Reserved.
                         </small>
                    </div>
               </section>
          </div>
     );
};

export default Footer;
