import styles from '../style';
import { robot } from '../assets';
import Signup from '../components/Signup';
import React from 'react';

const Hero: React.FC = () => {
   return (
      <section id='home' className={`flex md:flex-row flex-col ${styles.paddingY}`}>
         <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
            <div className='flex flex-row justify-between items-center w-full'>
               <h1 className='flex-1'>
                  <strong className='text-gradient'>Data Automation Solutions Integrated with AI</strong>{' '}
               </h1>
            </div>
            <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
               Streamline your data management systems. Set it and forget it! Take advantge of plug-and-play solutions for
               automated data analytics and visualization systems that save time and unlock greater insights.
            </p>
            <Signup />
         </div>
         <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
            <img src={robot} alt='robot-hand' className='w-[100%] h-[100%] relative z-[5]' />
         </div>
      </section>
   );
};

export default Hero;
