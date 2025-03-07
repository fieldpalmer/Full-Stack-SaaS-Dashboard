import React, { useState } from 'react';
import styles, { layout } from '../style';
import { robot, close, logo, menu, bill, card } from '../assets';
import { features, navLinks, stats, socialMedia, clients, feedback, footerLinks } from '../constants';

import Signup from '../components/Signup';
import Button from '../components/Button';
import FeedbackCard from '../components/FeedbackCard';

type FeatureCardProps = {
   icon: string;
   title: string;
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
   icon: string;
   link: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, content, index }) => (
   <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? 'mb-6' : 'mb-0'} feature-card`}>
      <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
         <img src={icon} alt='star' className='w-[50%] h-[50%] object-contain' />
      </div>
      <div className='flex-1 flex flex-col ml-3'>
         <h4 className='font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1'>{title}</h4>
         <p className='font-poppins font-normal text-dimWhite text-[16px] leading-[24px]'>{content}</p>
      </div>
   </div>
);
const LandingPage: React.FC = () => {
   const [active, setActive] = useState<string>('Home');
   const [toggle, setToggle] = useState<boolean>(false);

   return (
      <>
         <div className='bg-primary w-screen overflow-hidden'>
            <div className={`${styles.paddingX} ${styles.flexCenter}`}>
               <div className={`${styles.boxWidth}`}>
                  {/* <Navbar /> */}
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
                  {/* <Hero /> */}
                  <section id='home' className={`flex md:flex-row flex-col ${styles.paddingY}`}>
                     <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
                        <div className='flex flex-row justify-between items-center w-full'>
                           <h1 className='flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]'>
                              <span className='text-gradient'>An Attention-Grabbing Headline!</span>{' '}
                           </h1>
                        </div>
                        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
                           A brief, informative value proposition to set us apart and draw people in while steering them towards
                           our CTA, which is the email signup right below.
                        </p>
                        <Signup />
                     </div>
                     <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
                        <img src={robot} alt='billing' className='w-[100%] h-[100%] relative z-[5]' />
                        <div className='absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient' />
                        <div className='absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40' />
                        <div className='absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient' />
                     </div>
                  </section>
               </div>
            </div>

            <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
               <div className={`${styles.boxWidth}`}>
                  {/* <Stats /> */}
                  <section className={`${styles.flexCenter} flex-row flex-wrap sm:mb-20 mb-6`}>
                     {stats.map((stat) => (
                        <div key={stat.id} className={`flex-1 flex justify-start items-center flex-row m-3`}>
                           <h4 className='font-poppins font-semibold xs:text-[40.89px] text-[30.89px] xs:leading-[53.16px] leading-[43.16px] text-white'>
                              {stat.value}
                           </h4>
                           <p className='font-poppins font-normal xs:text-[20.45px] text-[15.45px] xs:leading-[26.58px] leading-[21.58px] text-gradient uppercase ml-3'>
                              {stat.title}
                           </p>
                        </div>
                     ))}
                  </section>
                  {/* <Business /> */}
                  <section id='features' className={layout.section}>
                     <div className={layout.sectionInfo}>
                        <h2 className={styles.heading2}>
                           If you build it, <br className='sm:block hidden' /> they will come.
                        </h2>
                        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
                           With a good product and effective promotion success is inevitable. The details of your initiative can
                           fit here with ease, and the buttons and highlights keep directing to our CTA.
                        </p>

                        <Button styles={`mt-10`} />
                     </div>

                     <div className={`${layout.sectionImg} flex-col`}>
                        {features.map((feature: Feature, index: number) => (
                           <FeatureCard key={feature.id} {...feature} index={index} />
                        ))}
                     </div>
                  </section>
                  {/* <Billing /> */}
                  <section id='product' className={layout.sectionReverse}>
                     <div className={layout.sectionImgReverse}>
                        <img src={bill} alt='billing' className='w-[100%] h-[100%] relative z-[5]' />
                        <div className='absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient' />
                        <div className='absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient' />
                     </div>
                     <div className={layout.sectionInfo}>
                        <h2 className={styles.heading2}>
                           Give 'em a peek
                           <br className='sm:block hidden' />
                           at whatcha got.
                        </h2>
                        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
                           Elit enim sed massa etiam. Mauris eu adipiscing ultrices ametodio aenean neque. Fusce ipsum orci rhoncus
                           aliporttitor integer platea placerat.
                        </p>
                        <div className='flex flex-row mt-10'>
                           {socialMedia.map((social: SocialMediaItem, index: number) => (
                              <img
                                 key={social.id}
                                 src={social.icon}
                                 alt={social.id}
                                 className={`w-[47px] h-[47px] object-contain cursor-pointer ${
                                    index !== socialMedia.length - 1 ? 'mr-6' : 'mr-0'
                                 }`}
                                 onClick={() => window.open(social.link)}
                              />
                           ))}
                        </div>
                     </div>
                  </section>
                  {/* <CardDeal /> */}
                  <section className={layout.section}>
                     <div className={layout.sectionInfo}>
                        <h2 className={styles.heading2}>
                           Tell people why
                           <br className='sm:block hidden' />
                           they should care.
                        </h2>
                        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
                           Arcu tortor, purus in mattis at sed integer faucibus. Aliquet quis aliquet eget mauris tortor.ç Aliquet
                           ultrices ac, ametau.
                        </p>

                        <Button styles={`mt-10`} />
                     </div>

                     <div className={layout.sectionImg}>
                        <img src={card} alt='billing' className='w-[100%] h-[100%]' />
                     </div>
                  </section>
                  {/* <Clients /> */}
                  <section className={`${styles.flexCenter} my-4`}>
                     <div className={`${styles.flexCenter} flex-wrap w-full`}>
                        {clients.map((client) => (
                           <div key={client.id} className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-w-[120px] m-5`}>
                              <img src={client.logo} alt='client_logo' className='sm:w-[192px] w-[100px] object-contain' />
                           </div>
                        ))}
                     </div>
                  </section>
                  {/* <Testimonials /> */}
                  <section id='clients' className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
                     <div className='absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient bottom-40' />

                     <div className='w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]'>
                        <h2 className={styles.heading2}>
                           Show some form
                           <br className='sm:block hidden' />
                           of testimonials or reviews.
                        </h2>
                     </div>

                     <div className='flex flex-wrap sm:justify-start justify-center w-full feedback-container relative z-[1]'>
                        {feedback.map((card) => (
                           <FeedbackCard key={card.id} {...card} />
                        ))}
                     </div>
                  </section>
                  {/* <CTA /> */}
                  <section
                     className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
                  >
                     <div className='flex-1 flex flex-col'>
                        <h2 className={styles.heading2}>Final call to action!</h2>
                        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
                           This is the last opportunity to engage with the viewer on the landing page. Make sure they convert!
                        </p>
                     </div>

                     <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
                        <Button />
                     </div>
                  </section>
                  {/* <Footer /> */}
                  <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
                     <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
                        <div className='flex-[1] flex flex-col justify-start mr-10'>
                           <img src={logo} alt='hoobank' className='w-[266px] h-[72.14px] object-contain' />
                        </div>
                        <div className='flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10'>
                           {footerLinks.map((footerlink) => (
                              <div key={footerlink.title} className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}>
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
                           {socialMedia.map((social, index) => (
                              <img
                                 key={social.id}
                                 src={social.icon}
                                 alt={social.id}
                                 className={`w-[21px] h-[21px] object-contain cursor-pointer ${
                                    index !== socialMedia.length - 1 ? 'mr-6' : 'mr-0'
                                 }`}
                                 onClick={() => window.open(social.link)}
                              />
                           ))}
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
