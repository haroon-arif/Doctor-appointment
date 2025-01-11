import React, { useState } from 'react';

const MissionSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Email submitted:', email);
    setEmail(''); 
  };

  return (
    <div className="flex justify-between items-center py-12 max-w-laptop mx-auto">
      <div className='w-[60%] border-r-[1px] border-[#E3E5EC] pr-52'>
        <h2 className="text-[82px] leading-[98.4px] font-bold mb-4">Our mission</h2>
        <p className="font-semibold text-700 text-[42px] relative left-24">
          is to provide a <span className="text-[#7B7AFC]">safe</span>, <span className="text-[#7B7AFC]">honest  </span> &{' '}
          <span className="text-[#7B7AFC]">transparent</span> choice when booking cosmetic treatments
        </p>
      </div>
      <div className='w-[40%] p-28'>
        <h3 className="text-[30px] text-700 leading-[36px] font-bold mb-1.5">Stay in touch</h3>
        <p className="text-[12px] leading-[16.8px] font-normal text-500 mb-5">Receive updates and Cosmediate news</p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border-[1px] rounded-[12px] focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-accent text-white px-[24px] font-bold text-[14px] leading-[17px] py-2 rounded-[12px]"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MissionSection;