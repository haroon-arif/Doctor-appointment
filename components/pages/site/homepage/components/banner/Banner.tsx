import Image from 'next/image';
import React from 'react';
import BannerSteps from './BannerContent';

const Banner: React.FC = () => {
    return (
 <>
        <div className="mt-[80px] relative w-full h-[420px] mb-[300px] max-w-[1600px] mx-auto">
            <div className="relative w-full h-full mb-20">
                <Image
                    src='/home/treatments/banner.png'
                    alt='banner'
                    height={500}
                    width={500}
                    className="h-full w-full object-cover"
                    quality={100}
                    layout="intrinsic"
                />

                <div className="absolute top-[356px] left-0 w-full h-[110%] rounded-[16px] banner-overlay"></div>
            </div>

            <div className="absolute bottom-[-250px] left-0 right-0 mx-auto text-center px-4 w-full">
                <h1 className="text-[58px] leading-[69.6px] font-bold text-background-white mb-6">
                    Cosmediate cares <br />
                    about the cosmetic industry
                </h1>
                <div className="flex justify-center gap-4 relative">
                    <button className="px-[24px] py-[18px] center gap-4 rounded-lg bg-[#FFFFFF1A] text-white text-lg font-semibold">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5 18L9.5 17M9.5 17L3.5 20V7L9.5 4M9.5 17V4M9.5 4L15.5 7M15.5 7L21.5 4V14M15.5 7V12M19 19.5L21.5 22M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Explore clinics
                    </button>
                    <button className="px-[24px] py-[18px] center gap-4 rounded-lg bg-[#FFFFFF1A] text-white text-lg font-semibold">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.5 11V8C19.5 7.46957 19.2893 6.96086 18.9142 6.58579C18.5391 6.21071 18.0304 6 17.5 6H5.5C4.96957 6 4.46086 6.21071 4.08579 6.58579C3.71071 6.96086 3.5 7.46957 3.5 8V13C3.5 13.5304 3.71071 14.0391 4.08579 14.4142C4.46086 14.7893 4.96957 15 5.5 15H10.5M18 17.5L20.5 20M18.5 15.5C18.5 16.8807 17.3807 18 16 18C14.6193 18 13.5 16.8807 13.5 15.5C13.5 14.1193 14.6193 13 16 13C17.3807 13 18.5 14.1193 18.5 15.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Find treatments
                    </button>
                </div>
            </div>
        </div>
<BannerSteps/>
 </>
    );
};

export default Banner;
