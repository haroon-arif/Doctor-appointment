import React from 'react';
import Image from 'next/image';

const Testiminials = () => {
  return (
    <div className="flex justify-between gap-[32px] items-center bg-white pt-8 pb-[90px] max-w-laptop mx-auto">

      <div className="w-1/2">
        <div className="bg-background-2324 h-[552px] flex flex-col !justify-center items-start w-[505px] p-6 rounded-lg">
          <Image
            src="/logo/logo2.svg"
            alt="Karin Aarts"
            width={128}
            height={128}
          />
          <h2 className="text-[27px] leading-[32px] text-800 font-semibold mt-[20px] mb-4">Cosmediate makes the difference</h2>
          <p className="text-gray-500">
            We aim to become your go-to platform for everything related to the cosmetic market.
          </p>
          <br />
          <p className="text-gray-500">
            This can be informative articles about cosmetic treatments, comparing prices and clinics, but also real experiences of customers and the doctors behind the cosmetic treatments.
          </p>
          <button className="bg-background-white text-accent font-bold leading-[17px] px-[24px] border-2 border-background-secondary py-4 rounded-[12px] mt-4">
            Register now
          </button>
        </div>
      </div>
      <div className="testimonila-bg p-6 w-full h-[552px] flex flex-col !justify-center items-start rounded-lg">
        <span className='mb-8'><svg width="54" height="33" viewBox="0 0 54 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5665 10.6956C20.2167 11.2174 24.2069 15.913 24.2069 21.7826C24.2069 28.0435 19.5517 33 12.3695 33C4.65517 33 0 27.2609 0 20.7391V19.6956C0 11.6087 5.58621 4.04347 13.6995 0L13.5665 10.6956ZM29.7931 20.7391V19.6956C29.7931 11.6087 35.3793 4.04347 43.4926 0L43.3596 10.6956C50.0098 11.2174 54 15.913 54 21.7826C54 28.0435 49.3448 33 42.1626 33C34.4483 33 29.7931 27.2609 29.7931 20.7391Z" fill="#6968EC" />
        </svg>
        </span>
        <blockquote className="text-white">
          <p className='text-[41px] text-700 leading-[57.4px] font-normal'>
            By easily comparing clinics, after much hesitation I dare to take the first step to book a consultation at the right clinic.
          </p>
        </blockquote>
        <div className="flex gap-4 items-center w-full justify-end relative top-[40px] px-10 py-2 mt-4">
          <span className='space-y-2'>
            <p className="text-800 leading-[27px] text-[27px] font-semibold">Karin Aarts</p>
            <h6 className="text-600 leading-[18px] text-[14px] font-normal">Cosmediate visitor</h6>
          </span>
          <Image
            src="/home/testimonials/karin.png"
            alt="Karin Aarts"
            width={100}
            height={100}
            quality={100}
            className="rounded-full ml-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Testiminials;