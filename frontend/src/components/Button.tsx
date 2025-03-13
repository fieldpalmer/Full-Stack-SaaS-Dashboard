import React from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
     styles?: string;
};

const Button: React.FC<ButtonProps> = ({ styles }) => (
     <Link
          type='button'
          className={`py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-white outline-none ${styles} rounded-[10px]`}
          to='/dashboard'
     >
          Get Started
     </Link>
);

export default Button;
