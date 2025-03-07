import { bill } from '../assets';
import styles, { layout } from '../style';
import { socialMedia } from '../constants';

type SocialMediaItem = {
   id: string;
   icon: string;
   link: string;
};

const Billing: React.FC = () => (
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
            Elit enim sed massa etiam. Mauris eu adipiscing ultrices ametodio aenean neque. Fusce ipsum orci rhoncus aliporttitor
            integer platea placerat.
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
);

export default Billing;
