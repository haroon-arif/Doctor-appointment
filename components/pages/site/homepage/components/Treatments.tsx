import Image from 'next/image';
import React from 'react';
import { TREATMENTS } from '../constants';

export interface Treatment {
  id: number;
  title: string;
  description: string;
  name:string;
  price:string;
  imageUrl: string;
}

const Treatments: React.FC = () => {
  return (
    <div className="max-w-laptop mx-auto">
      <h2 className="text-[42px] font-semibold leading-[50.4px] text-700 text-center relative bottom-[85px]">
        Popular searched treatments
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[29.3px] gap-y-[52px]">
        {TREATMENTS.map((treatment) => (
          <div key={treatment.id} className="relative bg-white rounded-lg overflow-hidden">
            <div className="relative">
           <div>
           <Image
                src={treatment.imageUrl}
                alt={treatment.title}
                className="w-[415px] h-[167px] object-cover"
                width={415}
                height={167}
                quality={100}
              />
           </div>
              <div className="absolute top-2  right-3 text-700 leading-[17px] text-[11px] font-medium bg-background-white  py-[4px] px-[12px] rounded-[8px]">
                {treatment.name}
              </div>
              <div className="absolute bottom-[-12px] font-bold right-[18px] text-900 leading-[17px] book-btn text-[11px]  py-1 px-3 rounded-lg">
               {treatment.price}
              </div>
            </div>
            <div className="pt-6 pb-4">
              <h3 className="text-[18px] leading-[22px] font-bold mb-3 text-700">{treatment.title}</h3>
              <p className="text-[11px] leading-[17px] font-medium text-600">{treatment.description}</p>
            </div>
            <button className="py-[12px] px-[24px] rounded-[12px] border-2 text-accent leading-[17px] font-bold text-[14px] border-background-secondary">
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Treatments;
