import React from 'react';
import { bill, card, dashboard } from '../assets';
import { features, stats } from '../constants';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';

const LandingPage: React.FC = () => {
     return (
          <div className='w-full bg-gradient-to-br from-blue-950 to-green-950 overflow-hidden'>
               <section id='home' className='flex md:flex-row flex-col p-6 md:p-10'>
                    <div className='flex-1 flex justify-center items-start flex-col'>
                         <div className='flex flex-row justify-between items-center w-full'>
                              <p className='text-5xl text-gradient flex-1 font-poppins font-semibold text-white'>
                                   From Data to Discovery: Track Your Media Life.
                              </p>
                         </div>
                         <p className='font-poppins font-normal text-gray-100 max-w-200 mt-5'>
                              This isn’t just a media tracker. It’s your personal analytics dashboard. Dive into rich insights that
                              show you what you read, watch, and listen to the most. Find patterns in your habits, discover trends
                              in your tastes, and get data-backed recommendations tailored to your unique vibe. Whether you’re
                              curious about your concert attendance streak or want to relive your most active binge month—our
                              dashboard turns your media life into meaningful insights.
                         </p>
                         {/* <Signup /> */}
                    </div>
                    <div className={`flex-1 flex justify-center items-center my-10 relative`}>
                         <img src={dashboard} alt='billing' className='w-[100%] h-[100%] relative z-[5]' />
                    </div>
               </section>

               <div className='bg-primary flex justify-center items-center'>
                    <div className='xl:max-w-[1280px] w-full'>
                         <section className='flex justify-center items-center flex-row flex-wrap p-6'>
                              {stats.map((stat) => (
                                   <div key={stat.id} className={`flex-1 flex justify-start items-center flex-row my-3`}>
                                        <h1 className='font-poppins font-semibold text-white'>{stat.value}</h1>
                                        <p className='font-poppins text-gradient uppercase ml-3'>{stat.title}</p>
                                   </div>
                              ))}
                         </section>

                         <section id='product' className='flex md:flex-row flex-col-reverse p-6 md:my-10'>
                              <div className='flex-1 flex justify-center items-center md:mr-10 mr-0 md:mt-0 mt-10 relative'>
                                   <img src={bill} alt='billing' className='w-[100%] h-[100%] relative z-[5]' />
                              </div>
                              <div className='flex-1 flex justify-center items-start flex-col'>
                                   <p className='text-3xl font-poppins font-semibold text-white w-full'>
                                        More Than Tracking—Your Media Story in Motion
                                   </p>
                                   <p className='font-poppins font-normal text-gray-100 mt-5'>
                                        Imagine a single space where every book you’ve devoured, every concert you’ve attended, and
                                        every movie you’ve marathoned comes together to tell your story. This isn’t just about
                                        keeping track—it’s about making sense of the experiences that shape you. Our platform
                                        doesn’t just store data; it transforms it into a personalized narrative, backed by rich
                                        insights and beautiful visualizations. See which genres dominate your playlists, track how
                                        your tastes evolve over time, and celebrate your milestones—like your 100th concert or your
                                        50th finished novel. Your media life, like you’ve never seen it before.
                                   </p>
                                   <Button styles={`mt-10`} />
                              </div>
                         </section>

                         <section id='features' className='flex md:flex-row flex-col p-6 md:my-10'>
                              <div className='flex-1 flex justify-center items-start flex-col'>
                                   <p className='text-3xl font-poppins font-semibold text-white w-full'>
                                        Data-Driven. Experience-Focused.
                                   </p>
                                   <p className='font-poppins font-normal text-gray-100 max-w-full mt-5'>
                                        From stats to stories, see the patterns in your playlists, page-turners, and movie
                                        marathons. What you stream, read, and see paints a picture. We make it crystal clear.
                                   </p>

                                   {/* <Button styles={`mt-10`} /> */}
                              </div>

                              <div className='flex-1 flex justify-center items-center md:ml-10 ml-0 md:mt-0 mt-10 relative flex-col'>
                                   {features.map((feature, index) => (
                                        <FeatureCard key={feature.id} {...feature} index={index} />
                                   ))}
                              </div>
                         </section>

                         <section className='flex md:flex-row flex-col p-6 md:my-10'>
                              <div className='flex-1 flex justify-center items-start flex-col'>
                                   <p className='text-3xl font-poppins font-semibold text-white w-full'>
                                        Your Media Life—Organized, Visualized, Amplified
                                   </p>
                                   <p className='font-poppins font-normal text-gray-100 max-w-full mt-5'>
                                        You’ve read the books, heard the albums, seen the shows, and lived through those
                                        unforgettable concert nights. But where does it all go? Scattered memories and
                                        half-finished lists? Not anymore. Our dashboard is your personal media HQ—built to track,
                                        organize, and visualize everything you consume, and with smart insights, you’ll see
                                        patterns, trends, and stats that make your media life more meaningful. What gets tracked,
                                        gets remembered.
                                   </p>

                                   <Button styles={`mt-10`} />
                              </div>

                              <div className='flex-1 flex justify-center items-center md:ml-10 ml-0 md:mt-0 mt-10 relative'>
                                   <img src={card} alt='billing' className='w-[100%] h-[100%]' />
                              </div>
                         </section>

                         <section className='flex justify-center items-center sm:my-16 m-6 p-6 sm:py-12 py-4 sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow'>
                              <div className='flex-1 flex flex-col'>
                                   <p className='text-3xl font-poppins font-xl font-semibold text-white w-full'>
                                        Turn Your Experiences Into Insights
                                   </p>
                                   <p className='font-poppins font-normal text-gray-100 max-w-[90%] mt-5'>
                                        Sign up now and transform your concerts, books, shows, and movies into a personalized media
                                        timeline.
                                   </p>
                              </div>

                              <div className='flex justify-center items-center sm:ml-10 ml-0 sm:mt-0 mt-10'>
                                   <Button />
                              </div>
                         </section>
                    </div>
               </div>
          </div>
     );
};

export default LandingPage;
