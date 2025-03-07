import styles from '../style';
import { Billing, Business, CardDeal, Clients, CTA, Footer, Navbar, Stats, Testimonials, Hero } from '../components';

const App = () => (
   <div className='w-screen bg-gradient-to-br from-blue-950 to-green-950 overflow-hidden'>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
         <div className={`${styles.boxWidth}`}>
            <Navbar />
         </div>
      </div>

      <div className={`${styles.flexStart}`}>
         <div className={`${styles.boxWidth}`}>
            <Hero />
         </div>
      </div>

      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
         <div className={`${styles.boxWidth}`}>
            <Stats />
            <Business />
            <Billing />
            <CardDeal />
            {/* <Clients /> */}
            {/* <Testimonials /> */}
            <CTA />
            <Footer />
         </div>
      </div>
   </div>
);

export default App;
