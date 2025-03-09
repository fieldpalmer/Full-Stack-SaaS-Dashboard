import React, { useState } from 'react';
import styles, { layout } from '../style';
import { robot, close, logo, menu, bill, card } from '../assets';
import {
   features,
   navLinks,
   stats,
   socialMedia,
   // clients,
   // feedback,
   footerLinks
} from '../constants';

import Signup from '../components/Signup';
import Button from '../components/Button';
import { IconType } from 'react-icons';
// import FeedbackCard from '../components/FeedbackCard';

type FeatureCardProps = {
   icon: string;
   title: string;
   subtitle: string;
   content: string;
   index: number;
};

type Feature = {
   id: string;
   icon: string;
   title: string;
   content: string;
};

type SocialMediaItem = {
   id: string;
   icon: IconType;
   link: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, subtitle, content, index }) => (
   <div
      className={`flex flex-row p-2 rounded-[20px] ${
         index !== features.length - 1 ? 'mb-6' : 'mb-0'
      } feature-card`}
   >
      <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
         <img src={icon} alt='star' className='w-[50%] h-[50%] object-contain' />
      </div>
      <div className='flex-1 flex flex-col ml-3'>
         <h4 className='font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1'>
            <strong>{title}</strong> - {subtitle}
         </h4>
         <p className='font-poppins font-normal text-dimWhite text-[16px] leading-[24px]'>
            {content}
         </p>
      </div>
   </div>
);
const LandingPage: React.FC = () => {
   const [active, setActive] = useState<string>('Home');
   const [toggle, setToggle] = useState<boolean>(false);

   return (
      <>
         <div className='w-screen bg-gradient-to-br from-blue-950 to-green-950 overflow-hidden'>
            <div className={`${styles.paddingX} ${styles.flexCenter}`}>
               <div className={`${styles.boxWidth}`}>
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
                              <a href={`#${nav.id}`}>{nav.title}</a>
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

            <div className={`bg-primary ${styles.flexStart}`}>
               <div className={`${styles.boxWidth}`}>
                  {/* ================== */}
                  {/* <Hero /> */}
                  {/* ================== */}
                  <section id='home' className={`flex md:flex-row flex-col ${styles.paddingY}`}>
                     <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
                        <div className='flex flex-row justify-between items-center w-full'>
                           <h1 className='flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]'>
                              <span className='text-gradient'>
                                 From Data to Discovery: Track Your Media Life.
                              </span>{' '}
                           </h1>
                        </div>
                        <p className={`${styles.paragraph} max-w-full mt-5`}>
                           This isn’t just a media tracker. It’s your personal analytics dashboard.
                           Dive into rich insights that show you what you read, watch, and listen to
                           the most. Find patterns in your habits, discover trends in your tastes,
                           and get data-backed recommendations tailored to your unique vibe. Whether
                           you’re curious about your concert attendance streak or want to relive
                           your most active binge month—our dashboard turns your media life into
                           meaningful insights.
                        </p>
                        <Signup />
                     </div>
                     <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
                        <img
                           src={robot}
                           alt='billing'
                           className='w-[100%] h-[100%] relative z-[5]'
                        />
                     </div>
                  </section>
               </div>
            </div>

            <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
               <div className={`${styles.boxWidth}`}>
                  {/* ===================== */}
                  {/* <Stats /> */}
                  {/* ===================== */}
                  <section className={`${styles.flexCenter} flex-row flex-wrap sm:mb-20 mb-6`}>
                     {stats.map((stat) => (
                        <div
                           key={stat.id}
                           className={`flex-1 flex justify-start items-center flex-row m-3`}
                        >
                           <h4 className='font-poppins font-semibold xs:text-[40.89px] text-[30.89px] xs:leading-[53.16px] leading-[43.16px] text-white'>
                              {stat.value}
                           </h4>
                           <p className='font-poppins font-normal xs:text-[20.45px] text-[15.45px] xs:leading-[26.58px] leading-[21.58px] text-gradient uppercase ml-3'>
                              {stat.title}
                           </p>
                        </div>
                     ))}
                  </section>

                  {/* ===================== */}
                  {/* <CardDeal /> */}
                  {/* ===================== */}
                  <section className={layout.section}>
                     <div className={layout.sectionInfo}>
                        <h2 className={styles.heading2}>
                           More Than Tracking—It’s Your Media Story in Motion
                        </h2>
                        <p className={`${styles.paragraph} max-w-full mt-5`}>
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

                     <div className={layout.sectionImg}>
                        <img src={card} alt='billing' className='w-[100%] h-[100%]' />
                     </div>
                  </section>

                  {/* ===================== */}
                  {/* <Business /> */}
                  {/* ===================== */}
                  <section id='features' className={layout.section}>
                     <div className={layout.sectionInfo}>
                        <h2 className={styles.heading2}>Data-Driven. Experience-Focused.</h2>
                        {/* <h2 className={styles.heading2}>More Than a Memory—An Insight.</h2> */}
                        <p className={`${styles.paragraph} max-w-full mt-5`}>
                           From stats to stories, see the patterns in your playlists, page-turners,
                           and movie marathons. What you stream, read, and see paints a picture. We
                           make it crystal clear.
                        </p>

                        {/* <Button styles={`mt-10`} /> */}
                     </div>

                     <div className={`${layout.sectionImg} flex-col`}>
                        {features.map((feature: Feature, index: number) => (
                           <FeatureCard subtitle={''} key={feature.id} {...feature} index={index} />
                        ))}
                     </div>
                  </section>

                  {/* ===================== */}
                  {/* <Billing /> */}
                  {/* ===================== */}
                  <section id='product' className={layout.sectionReverse}>
                     <div className={layout.sectionImgReverse}>
                        <img
                           src={bill}
                           alt='billing'
                           className='w-[100%] h-[100%] relative z-[5]'
                        />
                     </div>
                     <div className={layout.sectionInfo}>
                        <h2 className={styles.heading2}>
                           Your Media Life—Organized, Visualized, Amplified
                        </h2>
                        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
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
                  <section
                     className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
                  >
                     <div className='flex-1 flex flex-col'>
                        <h2 className={styles.heading2}>Turn Your Experiences Into Insights</h2>
                        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
                           Sign up now and transform your concerts, books, shows, and movies into a
                           personalized media timeline.
                        </p>
                     </div>

                     <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
                        <Button />
                     </div>
                  </section>

                  {/* ===================== */}
                  {/* <Footer /> */}
                  {/* ===================== */}
                  <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
                     <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
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
                        <p className='font-poppins font-normal text-center text-[18px] leading-[27px] text-white'>
                           Copyright Ⓒ 2025. All Rights Reserved.
                        </p>

                        <div className='flex flex-row md:mt-0 mt-6'>
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
                        </div>
                     </div>
                  </section>
               </div>
            </div>
         </div>
      </>
   );
};

export default LandingPage;
