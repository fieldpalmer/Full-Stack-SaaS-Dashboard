import React from 'react';

type ButtonProps = {
   styles?: string;
};

const Button: React.FC<ButtonProps> = ({ styles }) => (
   <button
      type='button'
      className={`py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary outline-none ${styles} rounded-[10px]`}
   >
      Get Started
   </button>
);

export default Button;
