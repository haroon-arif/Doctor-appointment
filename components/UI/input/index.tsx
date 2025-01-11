import React from 'react';
import Image from 'next/image';

interface InputProps {
  id: string;
  type: string;
  placeholder: string;
  icon: string;
}

const Input: React.FC<InputProps> = ({ id, type, placeholder, icon }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <Image src={icon} width={22} height={22} alt="input-icon" />
      </div>
      <input
        type={type}
        id={id}
        className="border border-stroke py-[16px] text-gray-900 text-sm rounded-[12px] block w-full ps-10 p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default Input;
