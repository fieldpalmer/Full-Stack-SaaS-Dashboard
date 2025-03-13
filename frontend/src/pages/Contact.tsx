import React, { useState, FormEvent, JSX } from 'react';
import emailjs from 'emailjs-com';

interface SubmitStatus {
     type: 'success' | 'error';
     message: string;
}

export default function Contact(): JSX.Element {
     const [name, setName] = useState<string>('');
     const [email, setEmail] = useState<string>('');
     const [message, setMessage] = useState<string>('');
     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
     const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

     const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
          setIsSubmitting(true);

          const templateParams = {
               name,
               email,
               message
          };

          emailjs
               .send('service_xpf5k9l', 'template_iudd27p', templateParams, 'VxxKBcLVNAdzXvHA5')
               .then(
                    (response) => {
                         console.log('SUCCESS!', response.status, response.text);
                         setSubmitStatus({
                              type: 'success',
                              message: 'Message sent successfully!'
                         });
                         setName('');
                         setEmail('');
                         setMessage('');
                    },
                    (error) => {
                         console.error('FAILED...', error);
                         setSubmitStatus({
                              type: 'error',
                              message: 'Failed to send message. Please try again.'
                         });
                    }
               )
               .finally(() => {
                    setIsSubmitting(false);
               });
     };

     return (
          <div>
               <div className='flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-blue-950 to-green-950 text-white p-6'>
                    <form onSubmit={handleSubmit} className='bg-black/75 p-6 shadow-md rounded w-full max-w-lg'>
                         <h2 className='text-3xl mb-6 text-center'>Contact Us</h2>

                         <div className='mb-4'>
                              <label className='block text-sm font-medium mb-2'>Name</label>
                              <input
                                   type='text'
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   className='block w-full p-3 bg-gray-700 border rounded'
                                   required
                              />
                         </div>

                         <div className='mb-4'>
                              <label className='block text-sm font-medium mb-2'>Email</label>
                              <input
                                   type='email'
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className='block w-full p-3 bg-gray-700 border rounded'
                                   required
                              />
                         </div>

                         <div className='mb-6'>
                              <label className='block text-sm font-medium mb-2'>Message</label>
                              <textarea
                                   value={message}
                                   onChange={(e) => setMessage(e.target.value)}
                                   className='block w-full p-3 bg-gray-700 border rounded h-32'
                                   required
                              />
                         </div>

                         <button
                              type='submit'
                              className='w-full py-3 px-4 bg-blue-gradient font-medium text-lg text-primary rounded'
                              disabled={isSubmitting}
                         >
                              {isSubmitting ? 'Sending...' : 'Send Message'}
                         </button>

                         {submitStatus && (
                              <p
                                   className={`mt-4 text-center ${
                                        submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                                   }`}
                              >
                                   {submitStatus.message}
                              </p>
                         )}
                    </form>
               </div>
          </div>
     );
}
