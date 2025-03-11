import React, { useState } from 'react';
// import { robot, close, logo, menu, bill, card, dashboard } from '../assets';
import { close, logo, menu, bill, card, dashboard } from '../assets';
import { features, navLinks, stats, footerLinks } from '../constants';
// import Signup from '../components/Signup';
import Button from '../components/Button';
// import { IconType } from 'react-icons';
import FeatureCard from '../components/FeatureCard';

type Feature = {
   id: string;
   icon: string;
   title: string;
   content: string;
};

const LandingPage: React.FC = () => {
   const [active, setActive] = useState<string>('Home');
   const [toggle, setToggle] = useState<boolean>(false);

   return (
      <>
         <div className='w-screen bg-gradient-to-br from-blue-950 to-green-950 overflow-hidden'>
            <div className='px-6 flex justify-center items-center'>
               <div className='w-full'>
                  {/* ================== */}
                  {/* <Navbar /> */}
                  {/* ================== */}
                  <nav className='w-full flex py-6 justify-between items-center navbar'>
                     <img src={logo} alt='hoobank' className='w-[124px] h-[32px]' />

                     <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
                        {navLinks.map((nav, index) => (
                           <li
                              key={nav.id}
                              className={`font-poppins font-normal cursor-pointer text-[16px] ${
                                 active === nav.title ? 'text-white' : 'text-dimWhite'
                              } ${index === navLinks.length - 1 ? 'mr-0' : 'mr-10'}`}
                              onClick={() => setActive(nav.title)}
                           >
                              <a href={`${nav.id}`}>{nav.title}</a>
                           </li>
                        ))}
                     </ul>

                     <div className='sm:hidden flex flex-1 justify-end items-center'>
                        <img
                           src={toggle ? close : menu}
                           alt='menu'
                           className='w-[28px] h-[28px] object-contain'
                           onClick={() => setToggle(!toggle)}
                        />

                        <div
                           className={`${
                              !toggle ? 'hidden' : 'flex'
                           } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
                        >
                           <ul className='list-none flex justify-end items-start flex-1 flex-col'>
                              {navLinks.map((nav, index) => (
                                 <li
                                    key={nav.id}
                                    className={`font-poppins font-medium cursor-pointer text-[16px] ${
                                       active === nav.title ? 'text-white' : 'text-dimWhite'
                                    } ${index === navLinks.length - 1 ? 'mb-0' : 'mb-4'}`}
                                    onClick={() => setActive(nav.title)}
                                 >
                                    <a href={`#${nav.id}`}>{nav.title}</a>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </nav>
               </div>
            </div>

            <div className='bg-primary flex justify-center items-start'>
               <div className='xl:max-w-[1280px] w-full'>
                  {/* ================== */}
                  {/* <Hero /> */}
                  {/* ================== */}
                  <section id='home' className='flex md:flex-row flex-col sm:py-16 py-6'>
                     <div className='flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6'>
                        <div className='flex flex-row justify-between items-center w-full'>
                           <h1 className='flex-1 font-poppins font-semibold text-white'>
                              <span className='text-gradient'>
                                 From Data to Discovery: Track Your Media Life.
                              </span>{' '}
                           </h1>
                        </div>
                        <p className='font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-140 mt-5'>
                           This isn’t just a media tracker. It’s your personal analytics dashboard.
                           Dive into rich insights that show you what you read, watch, and listen to
                           the most. Find patterns in your habits, discover trends in your tastes,
                           and get data-backed recommendations tailored to your unique vibe. Whether
                           you’re curious about your concert attendance streak or want to relive
                           your most active binge month—our dashboard turns your media life into
                           meaningful insights.
                        </p>
                     </div>
                     <div className={`flex-1 flex justify-center items-center my-10 relative`}>
                        <img
                           // src={robot}
                           src={dashboard}
                           alt='billing'
                           className='w-[100%] h-[100%] relative z-[5]'
                        />
                     </div>
                  </section>
               </div>
            </div>

            <div className='bg-primary sm:px-16 px-6 flex justify-center items-center'>
               <div className='xl:max-w-[1280px] w-full'>
                  {/* ===================== */}
                  {/* <Stats /> */}
                  {/* ===================== */}
                  <section className='flex justify-center items-center flex-row flex-wrap mb-6 md:mb-10'>
                     {stats.map((stat) => (
                        <div
                           key={stat.id}
                           className={`flex-1 flex justify-start items-center flex-row m-3`}
                        >
                           <h1 className='font-poppins font-semibold text-white'>{stat.value}</h1>
                           <p className='font-poppins text-gradient uppercase ml-3'>{stat.title}</p>
                        </div>
                     ))}
                  </section>

                  {/* ===================== */}
                  {/* <CardDeal /> */}
                  {/* ===================== */}
                  <section className='flex md:flex-row flex-col sm:py-16 py-6'>
                     <div className='flex-1 flex justify-center items-start flex-col'>
                        <h2 className='font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full'>
                           More Than Tracking—Your Media Story in Motion
                        </h2>
                        <p className='font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-full mt-5'>
                           Imagine a single space where every book you’ve devoured, every concert
                           you’ve attended, and every movie you’ve marathoned comes together to tell
                           your story. This isn’t just about keeping track—it’s about making sense
                           of the experiences that shape you. Our platform doesn’t just store data;
                           it transforms it into a personalized narrative, backed by rich insights
                           and beautiful visualizations. See which genres dominate your playlists,
                           track how your tastes evolve over time, and celebrate your
                           milestones—like your 100th concert or your 50th finished novel. Your
                           media life, like you’ve never seen it before.
                        </p>

                        <Button styles={`mt-10`} />
                     </div>

                     <div className='flex-1 flex justify-center items-center md:ml-10 ml-0 md:mt-0 mt-10 relative'>
                        <img src={card} alt='billing' className='w-[100%] h-[100%]' />
                     </div>
                  </section>

                  {/* ===================== */}
                  {/* <Business /> */}
                  {/* ===================== */}
                  <section id='features' className='flex md:flex-row flex-col sm:py-16 py-6'>
                     <div className='flex-1 flex justify-center items-start flex-col'>
                        <h2 className='font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full'>
                           Data-Driven. Experience-Focused.
                        </h2>
                        {/* <h2 className={font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full',}>More Than a Memory—An Insight.</h2> */}
                        <p className='font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-full mt-5'>
                           From stats to stories, see the patterns in your playlists, page-turners,
                           and movie marathons. What you stream, read, and see paints a picture. We
                           make it crystal clear.
                        </p>

                        {/* <Button styles={`mt-10`} /> */}
                     </div>

                     <div className='flex-1 flex justify-center items-center md:ml-10 ml-0 md:mt-0 mt-10 relative flex-col'>
                        {features.map((feature: Feature, index: number) => (
                           <FeatureCard subtitle={''} key={feature.id} {...feature} index={index} />
                        ))}
                     </div>
                  </section>

                  {/* ===================== */}
                  {/* <Billing /> */}
                  {/* ===================== */}
                  <section id='product' className='flex md:flex-row flex-col-reverse sm:py-16 py-6'>
                     <div className='flex-1 flex justify-center items-center md:mr-10 mr-0 md:mt-0 mt-10 relative'>
                        <img
                           src={bill}
                           alt='billing'
                           className='w-[100%] h-[100%] relative z-[5]'
                        />
                     </div>
                     <div className='flex-1 flex justify-center items-start flex-col'>
                        <h2 className='font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full'>
                           Your Media Life—Organized, Visualized, Amplified
                        </h2>
                        <p className='font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-[470px] mt-5'>
                           You’ve read the books, heard the albums, seen the shows, and lived
                           through those unforgettable concert nights. But where does it all go?
                           Scattered memories and half-finished lists? Not anymore. Our dashboard is
                           your personal media HQ—built to track, organize, and visualize everything
                           you consume, and with smart insights, you’ll see patterns, trends, and
                           stats that make your media life more meaningful. What gets tracked, gets
                           remembered.
                        </p>
                        {/* <div className='flex flex-row mt-10'>
                           {socialMedia.map((social: SocialMediaItem, index: number) => {
                              const Icon = social.icon;
                              return (
                                 <div
                                    key={social.id}
                                    className={`cursor-pointer ${
                                       index !== socialMedia.length - 1 ? 'mr-8' : 'mr-0'
                                    }`}
                                    onClick={() => window.open(social.link)}
                                 >
                                    <Icon size={47} className='object-contain' />{' '}
                                 </div>
                              );
                           })}
                        </div> */}
                     </div>
                  </section>

                  {/* ===================== */}
                  {/* <CTA /> */}
                  {/* ===================== */}
                  <section className='flex justify-center items-center sm:my-16 my-6 sm:px-16 px-6 sm:py-12 py-4 sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow'>
                     <div className='flex-1 flex flex-col'>
                        <h2 className='font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full'>
                           Turn Your Experiences Into Insights
                        </h2>
                        <p className='font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px] max-w-[470px] mt-5'>
                           Sign up now and transform your concerts, books, shows, and movies into a
                           personalized media timeline.
                        </p>
                     </div>

                     <div className='flex justify-center items-center sm:ml-10 ml-0 sm:mt-0 mt-10'>
                        <Button />
                     </div>
                  </section>

                  {/* ===================== */}
                  {/* <Footer /> */}
                  {/* ===================== */}
                  <section className='flex justify-center items-center sm:py-16 py-6 flex-col'>
                     <div className='flex justify-center items-start md:flex-row flex-col mb-8 w-full'>
                        <div className='flex-[1] flex flex-col justify-start mr-10'>
                           <img
                              src={logo}
                              alt='hoobank'
                              className='w-[266px] h-[72.14px] object-contain'
                           />
                        </div>
                        <div className='flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10'>
                           {footerLinks.map((footerlink) => (
                              <div
                                 key={footerlink.title}
                                 className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}
                              >
                                 <h4 className='font-poppins font-medium text-[18px] leading-[27px] text-white'>
                                    {footerlink.title}
                                 </h4>
                                 <ul className='list-none mt-4'>
                                    {footerlink.links.map((link, index) => (
                                       <li
                                          key={link.name}
                                          className={`font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer ${
                                             index !== footerlink.links.length - 1 ? 'mb-4' : 'mb-0'
                                          }`}
                                       >
                                          {link.name}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className='w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]'>
                        <small className='font-poppins font-normal text-center text-white'>
                           Copyright Ⓒ 2025. All Rights Reserved.
                        </small>
                     </div>
                  </section>
               </div>
            </div>
         </div>
      </>
   );
};

export default LandingPage;
