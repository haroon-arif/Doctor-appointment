import Input from '@/components/UI/input';
import React from 'react';

const Treatment = () => {
  return (
    <div className="p-4 bg-background-white h-[75%] center rounded-bl-[8px] rounded-br-[8px]">
      <form className="flex flex-col gap-[12px] items-center w-full">
        <Input
          id="treatment-search"
          type="text"
          placeholder="Find your treatment"
          icon="/home/hero/search/search.svg"
        />
        
        <Input
          id="clinic-search"
          type="text"
          placeholder="Any time and date"
          icon="/home/hero/search/calander.svg"
        />
        
        <div className="flex justify-between gap-2 w-full">
          <Input
            id="city-search"
            type="text"
            placeholder="City / postal"
            icon="/home/hero/search/map.svg"
          />
          
          <button className="bg-accent py-[16px] px-[24px] rounded-[12px] text-background-white text-[14px] leading-[21px] font-medium">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Treatment;
