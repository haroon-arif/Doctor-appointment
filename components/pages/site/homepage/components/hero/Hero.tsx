import Image from 'next/image'
import React from 'react'
import Tabs from './SearchTab';
import { HERO_ITEMS } from '../../constants';

const Hero = () => {

    return (
        <div className='bg-background-gradiant h-[632px] mx-[8px] rounded-tl-[16px] rounded-tr-[16px]'>
            <section className='grid place-items-center h-full max-width-full px-laptop'>
                <div className='flex max-w-laptop mx-auto'>
                    <div className='w-[50%] space-y-[36px]'>
                        <h1 className='text-[64px] leading-[76px] font-bold'>Care for confidence</h1>
                        <h2 className='text-700 text-[20px] leading-[30px] font-medium'>The online platform that makes cosmetic treatments transparent, safe, and accessible</h2>

                        <ul className="space-y-6">
                            {HERO_ITEMS.map((item, index) => (
                                <li key={index} className="flex items-center space-x-3">
                                    <Image
                                        src={item.icon}
                                        alt={`Icon for ${item.text}`}
                                        width={32}
                                        height={32}
                                    />
                                    <span className="text-lg">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='w-full center'>
                        <Image
                            src="/home/hero/hero.png"
                            alt="Hero Image"
                            width={580}
                            height={580}
                            objectFit="cover"
                            quality={100}
                            className="relative z-10"
                        />
                        <div className='relative z-20 right-20 hero-search w-[526px] rounded-[8px] p-[0px] h-[328px]'>
                            <div className=' rounded-[16px] p-[8px] h-full'>
                                <Tabs />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Hero;
