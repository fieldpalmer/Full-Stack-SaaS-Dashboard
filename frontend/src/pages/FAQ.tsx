import { useState } from 'react';
import { faqData } from '../constants';
import type { FaqData } from '../constants';

const FAQ = () => {
     const [openIndex, setOpenIndex] = useState<number | null>(null);

     const toggleFAQ = (index: number) => {
          setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
     };

     return (
          <div>
               <div className='flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-950 to-green-950 text-white p-6'>
                    <section className='w-full flex flex-col items-center justify-center'>
                         <div className='w-full mx-auto text-white'>
                              <h1 className='text-4xl font-bold mb-6 border-b-2 border-gray-700 text-white pb-6'>F.A.Q.</h1>
                              {faqData.map((faq: FaqData, index: number) => (
                                   <div key={index} className='mb-4 border-b border-gray-700'>
                                        <button
                                             onClick={() => toggleFAQ(index)}
                                             className='w-full text-left text-xl font-semibold bg-gray-950 py-4 focus:outline-none flex justify-between'
                                        >
                                             {faq.question}
                                             <span>{openIndex === index ? '-' : '+'}</span>
                                        </button>
                                        {openIndex === index && <p className='p-4 text-gray-100'>{faq.answer}</p>}
                                   </div>
                              ))}
                         </div>
                    </section>
               </div>
          </div>
     );
};

export default FAQ;
