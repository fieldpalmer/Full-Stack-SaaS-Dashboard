import React, { useState } from 'react';

const Signup: React.FC = () => {
   const [email, setEmail] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         const response = await fetch('http://localhost:5001/api/send-email', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
         });

         if (response.ok) {
            alert('Email sent successfully!');
         } else {
            alert('Failed to send email.');
         }
      } catch (error) {
         console.error('Error sending email:', error);
      }
   };

   return (
      <div className='items-center mt-10'>
         <form className='relative' onSubmit={handleSubmit}>
            {/* <div className='absolute top-4 left-3'>
               <i className='fa fa-envelope text-gray-400 z-20 hover:text-gray-500' />
            </div> */}
            <input
               type='email'
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               className='h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none'
               placeholder='Sign up for a demo'
            />
            <div className='absolute top-2 right-2'>
               <button
                  type='submit'
                  className='py-2 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none'
               >
                  Submit
               </button>
            </div>
         </form>
      </div>
   );
};

export default Signup;
