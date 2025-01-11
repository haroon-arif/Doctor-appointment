import React, { useState } from 'react';
import Treatment from './Treatment';
import { TABS_CONSTANT } from '../../constants';
import Image from 'next/image';

export interface Tab {
  id: string;
  name: string;
  icon: string;
}

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'home':
      return <Treatment/>;
    case 'profile':
      return <div className="p-4 bg-background-white h-[75%] rounded-bl-[8px] rounded-br-[8px]">This is the Profile Tab content</div>;
    case 'settings':
      return <div className="p-4 bg-background-white h-[75%] rounded-bl-[8px] rounded-br-[8px]">This is the Settings Tab content</div>;
    default:
      return null;
  }
};

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home'); 


  return (
    <div className='h-full'>
      <div className="flex space-x-4 bg-transparent">
        {TABS_CONSTANT.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer p-[27px] leading-[16.8px] text-[12px] font-bold  flex items-center space-x-2 rounded-tl-[8px] rounded-tr-[8px] ${
              activeTab === tab.id
                ? 'bg-background-white text-accent'
                : 'hover:bg-gray-200 text-600'
            }`}
          >
           <Image
                src={tab.icon}
                alt={tab.name}
                width={24}
                height={24}
                className="object-contain"
              />
            <span>{tab.name}</span>
          </div>
        ))}
      </div>

      <TabContent activeTab={activeTab} />
    </div>
  );
};

export default Tabs;
