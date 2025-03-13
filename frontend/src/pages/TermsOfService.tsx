import { termsOfService } from '../constants';
import type { TermsOfService } from '../constants';
const TermsOfService = () => {
     return (
          <div>
               <div className='flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-950 to-green-950 text-white p-6'>
                    <section className='w-full flex flex-col items-center justify-center'>
                         <div className='w-full mx-auto text-white'>
                              <h1 className='text-4xl font-bold mb-6'>Terms & Services</h1>
                              <p className='mb-4 text-gray-300'>
                                   Welcome to AIC. By accessing our platform, you agree to comply with the following terms and
                                   conditions.
                              </p>
                              {termsOfService.map((term: TermsOfService, index: number) => (
                                   <div key={index}>
                                        <h2 className='text-2xl font-semibold mb-2'>{term.title}</h2>
                                        <p className='mb-4 text-gray-400'>{term.description}</p>
                                   </div>
                              ))}
                         </div>
                    </section>
               </div>
          </div>
     );
};

export default TermsOfService;
