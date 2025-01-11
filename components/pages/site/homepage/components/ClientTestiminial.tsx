import Image from 'next/image';
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Import arrow icons
import { CLIENTS } from '../constants';


interface Clinic {
  name: string;
  logo: string;
  rating: number;
  reviews: number;
  address: string;
}

interface ClinicCardProps {
  clinic: Clinic;
}
const ClinicCard = ({ clinic }:ClinicCardProps) => {
  return (
    <div className="flex flex-col items-start justify-center space-y-2">
      <Image
        src={clinic.logo}
        alt={clinic.name}
        width={80}
        height={80}
        quality={100}
      />
      <h3 className="text-[14px] leading-[17px] pt-[16px] font-bold text-700">{clinic.name}</h3>
      <p className="text-[11px] leading-[17px] font-medium text-400">{clinic.address}</p>
      <div className="flex items-center space-x-1 gap-1.5">
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.8632 7.82858C19.6927 7.286 19.3521 6.81267 18.8919 6.47861C18.4316 6.14454 17.876 5.96747 17.3073 5.97358H13.6665L12.5607 2.52691C12.3868 1.98438 12.0451 1.51109 11.5848 1.1753C11.1246 0.839511 10.5696 0.658569 9.99983 0.658569C9.43011 0.658569 8.8751 0.839511 8.41485 1.1753C7.95461 1.51109 7.61289 1.98438 7.439 2.52691L6.33316 5.97358H2.69233C2.12545 5.97439 1.57332 6.15432 1.11481 6.48767C0.656302 6.82102 0.314863 7.29074 0.139263 7.82974C-0.0363361 8.36873 -0.0371133 8.94944 0.137043 9.48891C0.311199 10.0284 0.65138 10.499 1.109 10.8336L4.07233 13.0002L2.94566 16.4894C2.76359 17.0306 2.76128 17.6161 2.93909 18.1587C3.11689 18.7012 3.46528 19.1718 3.93233 19.5002C4.39137 19.8392 4.94766 20.0208 5.51829 20.018C6.08892 20.0151 6.64336 19.828 7.099 19.4844L9.99983 17.3494L12.9015 19.4819C13.3597 19.819 13.913 20.002 14.4818 20.0048C15.0506 20.0076 15.6057 19.8299 16.0671 19.4973C16.5286 19.1648 16.8727 18.6945 17.0501 18.154C17.2274 17.6135 17.2288 17.0307 17.054 16.4894L15.9273 13.0002L18.894 10.8336C19.3568 10.5032 19.701 10.0326 19.8756 9.49137C20.0501 8.95016 20.0458 8.36713 19.8632 7.82858ZM17.9107 9.48775L14.4573 12.0119C14.3155 12.1154 14.2099 12.261 14.1558 12.428C14.1016 12.595 14.1016 12.7749 14.1557 12.9419L15.4682 17.0002C15.5346 17.2061 15.534 17.4277 15.4665 17.6332C15.3991 17.8387 15.2682 18.0175 15.0927 18.1439C14.9172 18.2703 14.7061 18.3378 14.4898 18.3367C14.2736 18.3356 14.0632 18.2659 13.889 18.1377L10.4932 15.6377C10.3501 15.5327 10.1773 15.476 9.99983 15.476C9.82236 15.476 9.64952 15.5327 9.5065 15.6377L6.11066 18.1377C5.93656 18.2677 5.72561 18.3388 5.50838 18.3408C5.29116 18.3427 5.07895 18.2755 4.90252 18.1487C4.72609 18.022 4.59462 17.8423 4.52716 17.6358C4.4597 17.4293 4.45976 17.2067 4.52733 17.0002L5.844 12.9419C5.89809 12.7749 5.89805 12.595 5.84388 12.428C5.78971 12.261 5.68417 12.1154 5.54233 12.0119L2.089 9.48775C1.91508 9.36041 1.78586 9.18137 1.71978 8.9762C1.6537 8.77103 1.65415 8.55023 1.72107 8.34533C1.78798 8.14043 1.91793 7.96192 2.09236 7.83529C2.26679 7.70866 2.47678 7.6404 2.69233 7.64025H6.94233C7.11876 7.64024 7.29063 7.58424 7.4332 7.48031C7.57577 7.37638 7.68167 7.22988 7.73566 7.06191L9.02733 3.03608C9.09363 2.83007 9.22359 2.65041 9.3985 2.52295C9.57341 2.3955 9.78424 2.32683 10.0007 2.32683C10.2171 2.32683 10.4279 2.3955 10.6028 2.52295C10.7777 2.65041 10.9077 2.83007 10.974 3.03608L12.2657 7.06191C12.3196 7.22988 12.4256 7.37638 12.5681 7.48031C12.7107 7.58424 12.8826 7.64024 13.059 7.64025H17.309C17.5245 7.6404 17.7345 7.70866 17.909 7.83529C18.0834 7.96192 18.2133 8.14043 18.2803 8.34533C18.3472 8.55023 18.3476 8.77103 18.2815 8.9762C18.2155 9.18137 18.0862 9.36041 17.9123 9.48775H17.9107Z" fill="#7289D3" />
        </svg>

        <span className="text-[14px] leading-[21px] font-medium text-500">{clinic.rating}</span>
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 13.8331V17.9998C20 18.6628 19.7366 19.2987 19.2678 19.7676C18.7989 20.2364 18.163 20.4998 17.5 20.4998H13.3333C12.1642 20.4986 11.016 20.19 10.0039 19.6049C8.99171 19.0199 8.1512 18.1789 7.56666 17.1665C8.19488 17.162 8.82097 17.0927 9.43499 16.9598C9.90262 17.5445 10.4958 18.0165 11.1706 18.3408C11.8455 18.665 12.5846 18.8333 13.3333 18.8331H17.5C17.721 18.8331 17.933 18.7453 18.0892 18.589C18.2455 18.4328 18.3333 18.2208 18.3333 17.9998V13.8331C18.3331 13.0841 18.1643 12.3448 17.8395 11.67C17.5146 10.9951 17.042 10.4021 16.4567 9.93479C16.5907 9.32088 16.6611 8.69479 16.6667 8.06645C17.6791 8.651 18.5201 9.4915 19.1051 10.5037C19.6902 11.5158 19.9988 12.664 20 13.8331ZM14.9808 8.54229C15.0588 7.46865 14.9047 6.39082 14.529 5.38203C14.1534 4.37324 13.565 3.45714 12.8038 2.69597C12.0426 1.9348 11.1265 1.3464 10.1177 0.97075C9.10896 0.595103 8.03113 0.441014 6.95749 0.518952C5.05492 0.736229 3.29743 1.6416 2.01597 3.06457C0.734514 4.48754 0.017515 6.32993 -7.62939e-06 8.24479L-7.62939e-06 12.4448C-7.62939e-06 14.5548 1.25583 15.4998 2.49999 15.4998H7.24999C9.16566 15.4833 11.0092 14.7668 12.4331 13.4852C13.8571 12.2037 14.7633 10.4456 14.9808 8.54229ZM11.625 3.87562C12.2166 4.46854 12.674 5.18162 12.9661 5.96661C13.2582 6.7516 13.3784 7.59018 13.3183 8.42562C13.1405 9.91202 12.4254 11.2821 11.3078 12.2781C10.1901 13.274 8.74698 13.8271 7.24999 13.8331H2.49999C1.72666 13.8331 1.66666 12.7706 1.66666 12.4448V8.24479C1.67361 6.74843 2.2272 5.30621 3.22326 4.18952C4.21931 3.07283 5.58915 2.35868 7.07499 2.18145C7.21333 2.17145 7.35166 2.16645 7.48999 2.16645C8.25772 2.16574 9.01806 2.31632 9.72756 2.60958C10.4371 2.90285 11.0818 3.33306 11.625 3.87562Z" fill="#D9C560" />
        </svg>

        <span className="text-[14px] leading-[21px] font-medium text-500">{clinic.reviews}</span>
      </div>
    </div>
  );
};

const PopularClinics = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex === 0 ? CLIENTS.length - 1 : currentIndex - 1);
  };

  const handleNextClick = () => {
    setCurrentIndex((currentIndex + 1) % CLIENTS.length);
  };

  return (
    <section className="mx-[8px] !max-width-laptop px-auto">
      <div className="p-4 rounded-lg h-[442px] bg-background-2324 relative">
    <div className='flex items-end justify-end max-w-laptop w-full mx-auto'>
    <button
          onClick={handlePrevClick}
          className=" text-2xl text-gray-600"
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={handleNextClick}
          className="  text-2xl text-gray-600"
        >
          <FiChevronRight />
        </button>
    </div>

        <div className="max-w-laptop mx-auto">
          <h2 className="text-[20px] font-bold leading-[24px] mb-[24px] text-700">
            Popular Clinics
          </h2>
          <div className="flex overflow-x-auto scroll-smooth">
            <div className="flex space-x-14 w-full justify-between">
              {CLIENTS.slice(currentIndex, currentIndex + 5).map((clinic) => (
                <ClinicCard key={clinic.name} clinic={clinic} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularClinics;
