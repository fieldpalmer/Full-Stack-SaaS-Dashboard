import { teamMembers } from '../constants';
import type { TeamMember } from '../constants';
export default function About() {
     return (
          <div>
               <div className='flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-950 to-green-950 text-white p-6'>
                    <section className='w-full flex flex-col items-center justify-center'>
                         <h1 className='text-4xl font-bold text-white'>Who We Are</h1>

                         <p className='my-6 text-xl border-t-[1px] pt-6'>
                              Analysis & Insights Consulting specializes in upgrading organizations with cutting-edge AI solutions,
                              data management strategies, and streamlined operational automations. Our mission is to help you
                              transform internal processes into agile, scalable models—enabling consistent quality control,
                              improved customer satisfaction (NPS), and reduced human touchpoints without sacrificing a personal
                              touch. We bring a wealth of experience—ranging from high-growth startup environments like Trilogy
                              Education to large-scale corporate contexts at 2U. Our expertise includes analyzing over 20,000
                              transcripts, building robust automations, managing risk factors, improving quality metrics, and
                              delivering NPS-driven results from launch to scale.
                         </p>

                         <h1 className='text-4xl font-bold text-white pb-6'>The Team</h1>

                         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 border-t-[1px] p-6'>
                              {teamMembers.map((person: TeamMember, index: number) => (
                                   <div
                                        key={index}
                                        className='bg-gradient-to-br from-blue-900 to-green-900 p-6 rounded-lg shadow-lg'
                                   >
                                        <h2 className='text-2xl font-bold text-white mb-2'>{person.name}</h2>
                                        <p className='text-gray-300'>{person.role}</p>
                                        <p className='mt-4 text-gray-300'>{person.description}</p>
                                   </div>
                              ))}
                         </div>
                    </section>
               </div>
          </div>
     );
}
