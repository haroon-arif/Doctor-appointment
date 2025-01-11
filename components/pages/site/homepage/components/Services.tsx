import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsArrowUpRight } from "react-icons/bs"
import { SERVICES } from '../constants';

export interface Service {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

const Services: React.FC = () => {
  return (
    <div className='max-w-laptop mx-auto pt-[123px] relative bottom-[185px] border-[#E3E5EC] border-b-[1px]'>
      <div className='flex flex-wrap justify-between items-center'>
        {SERVICES.map((service, index) => (
          <div key={service.id} className={`relative ${index === 1 ? 'top-[-60px]' : ''}`}>
            <Image
              src={service.imageUrl}
              alt={service.name}
              width={450}
              height={450}
              quality={100}
              layout="intrinsic"
            />
            <div className='bg-white pt-[20px] px-[24px] w-[370px] relative bottom-[65px] rounded-[16px]'>
              <h3 className='text-[18px] font-bold leading-[22px] text-[#333] mb-[8px]'>
                {service.name}
              </h3>
              <h1 className='font-semibold text-accent leading-[50.4px] text-[25px] mb-[22px]'>
                {service.description}
              </h1>
              <Link
                className='flex justify-start items-center gap-4 text-accent text-[12px] leading-[16.5px] font-bold'
                href='#'
              >
                Find <BsArrowUpRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
