import React from 'react';
import Image from 'next/image';

const Footer: React.FC = () => {
  const treatments = [
    'Mommy Makeover',
    'Juvederm',
    'Vampire Facial',
    'Rhinoplasty',
    'Rhinoplasty Revision',
    'Breast Reduction',
    'Hair Transplantation',
    'Liposuction',
  ];

  return (
    <footer className="bg-900 text-white py-[65px]">
      <div className="max-w-laptop mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          <div className="mb-6 sm:mb-0">
            <h2 className="text-xl font-bold mb-2">Cosmediate.</h2>
            <p className="font-medium leading-[16.8px] text-[#F1F2F3] text-[12px]">
              The online platform that makes cosmetic <br /> treatments transparent, safe, and accessible
            </p>
            <p className="text-xs mt-2">© 2024 All rights reserved</p>
            <div className="mt-4">
              <Image
                src="/logo/logo3.svg"
                alt="Kijk uit. Jezelf mooier maken kan lelijk uitpakken."
                width={247}
                height={79}
                className="object-contain"
              />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-0 sm:col-span-2 md:col-span-1 relative left-24">
            {['Treatments', 'Knowledge'].map((section, index) => (
              <div key={index} className="mb-6 md:mb-0">
                <h3 className="text-lg font-semibold mb-2">{section}</h3>
                <ul className="list-none">
                  {section === 'Treatments'
                    ? treatments.map((treatment, idx) => (
                        <li key={idx} className="text-[12px] leading-[26.8px] font-normal mb-2 text-[#E3E5EC]">{treatment}</li>
                      ))
                    : section === 'Knowledge' && <li className="text-[12px] leading-[26.8px] font-normal mb-2 text-[#E3E5EC]">Blog</li>}
                </ul>
              </div>
            ))}
          </div>

          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-lg font-semibold mb-2">About Us</h3>
              <ul className="list-none">
                {treatments.map((treatment, idx) => (
                  <li key={idx} className="text-[12px] leading-[26.8px] font-normal mb-2 text-[#E3E5EC]">{treatment}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
