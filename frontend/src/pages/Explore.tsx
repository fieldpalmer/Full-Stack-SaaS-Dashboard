import { exploreFeatures } from '../constants';
import type { ExploreFeature } from '../constants';

const Explore = () => {
     return (
          <div>
               <div className='flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-950 to-green-950 text-white p-6'>
                    <section className='w-full flex flex-col items-center justify-center'>
                         <div className='w-full mx-auto text-white'>
                              <h1 className='text-4xl font-bold mb-6'>Explore Analytics & Insights</h1>
                              <p className='text-lg text-gray-300 mb-8'>
                                   Discover how AIC transforms data into actionable intelligence. Our tools help you visualize,
                                   understand, and leverage your data like never before.
                              </p>

                              <div className='grid md:grid-cols-3 gap-8 border-t-1 pt-8'>
                                   {exploreFeatures.map((feature: ExploreFeature, index: number) => {
                                        // const Icon = feature.icon;
                                        return (
                                             <div
                                                  key={index}
                                                  className='bg-gray-950 p-6 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1'
                                             >
                                                  {/* <div className='flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full'>
                                                       <Icon size={32} className='text-white' />
                                                  </div> */}
                                                  <h2 className='text-2xl font-semibold text-white border-b-1 pb-6'>
                                                       {feature.title}
                                                  </h2>
                                                  <p className='text-gray-400 whitespace-pre-line'>{feature.description}</p>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>
                    </section>
               </div>
          </div>
     );
};

export default Explore;
