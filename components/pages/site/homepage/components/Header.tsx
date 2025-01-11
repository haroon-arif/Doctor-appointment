import Image from 'next/image'
import React from 'react'

const Header = () => {
    const menuItems = ['Treatments', 'Clients', 'Specialist'];

    return (
      <div className='max-w-laptop mx-auto'>
          <div className='bg-background-white h-[88px] flex justify-between items-center py-[32px] flex-1'>
            <h1>
                <Image src='/logo/logo.png' width={150} height={23} quality={100} alt='home-logo' />
            </h1>
            <div>
                <ul className='flex'>
                    {menuItems.map((item, index) => (
                        <li key={index} className='pr-[56px] text-400 font-semibold leading-[15px]'>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <h3 className='text-accent font-semibold leading-[15px] text-[15px]'>
                Sign in
            </h3>
        </div>
      </div>
    )
}

export default Header;
