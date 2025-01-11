import Image from 'next/image';
import React from 'react';
import { FaSearch, FaThumbsUp, FaCalendarCheck } from 'react-icons/fa'; 

interface StepProps {
  icon: React.ElementType; 
  title: string;
  description: string;
  subDescription: string;
  src:string;
}

const BannerSteps: React.FC = () => {
  const steps: StepProps[] = [
    {
      icon: FaSearch,  
      title: 'Search',
      src:'/home/banner/search.svg',
      description: 'by location or treatment',
      subDescription: 'Find all clinics and doctors near you',
    },
    {
      icon: FaThumbsUp, 
      title: 'Read',
      src:'/home/banner/like.svg',
      description: 'honest reviews',
      subDescription: 'Honest information about the treatments and clinics',
    },
    {
      icon: FaCalendarCheck,  
      title: 'Book',
      src:'/home/banner/book.svg',
      description: 'a treatment now',
      subDescription: 'Choose the treatment, doctor, or clinic that suits you',
    },
  ];

  return (
    <div className="flex flex-wrap gap-10 justify-center relative bg-white rounded-[16px] py-[50px] max-w-[1221px] mx-auto z-50 items-center space-x-8">
      {steps.map((step, index) => {
        const Icon = step.icon; 
        return (
          <div key={index} className="flex flex-col items-center">
            <Image src={step.src} alt={step.title} height={48} width={48} className="w-12 h-12 text-blue-500" />  {/* Icon styling */}
            <h3 className="text-[34px] leading-[41px] text-800  font-bold mt-[6px]">{step.title}</h3>
            <p className="text-[18ox] leading-[22px] font-bold text-700 mt-[6px]">{step.description}</p>
            <p className="leading-[16.8px] text-[12px] font-medium text-600 mt-[6px]">{step.subDescription}</p>
          </div>
        );
      })}
    </div>
  );
};

export default BannerSteps;
