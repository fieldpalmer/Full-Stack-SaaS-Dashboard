import { features } from '../constants';
import styles, { layout } from '../style';
import Button from './Button';

type FeatureCardProps = {
   icon: string;
   title: string;
   content: string;
   index: number;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, content, index }) => (
   <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? 'mb-6' : 'mb-0'} feature-card`}>
      <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
         <img src={icon} alt='star' className='w-[50%] h-[50%] object-contain' />
      </div>
      <div className='flex-1 flex flex-col ml-3'>
         <strong className='text-white mb-1'>{title}</strong>
         <p className='font-poppins font-normal text-dimWhite text-[16px] leading-[24px]'>{content}</p>
      </div>
   </div>
);

type Feature = {
   id: string;
   icon: string;
   title: string;
   content: string;
};

const Business: React.FC = () => (
   <section id='features' className={layout.section}>
      <div className={`${layout.sectionInfo} text-gradient`}>
         <h2 className={styles.heading2}>Intuitive and scalable analytics solutions</h2>
         <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
            The ability to organize analytics then schedule their auto-refreshing deployment and notifications allows for
            near-instant responsiveness with a complete data-backed contextualization of the situation.
         </p>

         <Button styles={`mt-10`} />
      </div>

      <div className={`${layout.sectionImg} flex-col`}>
         {features.map((feature: Feature, index: number) => (
            <FeatureCard key={feature.id} {...feature} index={index} />
         ))}
      </div>
   </section>
);

export default Business;
