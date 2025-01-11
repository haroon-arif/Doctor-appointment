import React from 'react';
import Image from 'next/image';
import { BLOGS } from '../constants';

export interface BlogPost {
  date: string;
  title: string;
  description: string;
  imageUrl: string;
}


const BlogSection = () => {
  return (
    <div className="flex justify-start max-w-laptop mx-auto border-b-[1px] pb-[72px] border-[#E3E5EC]">
      <div className="flex w-[32%] flex-col justify-start">
      <h2 className="text-[58px] font-bold leading-[69.6px] text-700 mb-4">Our Blog</h2>
      <p className="text-700 font-bold text-[12px] leading-[16.8px] mb-6">Saving money for cosmetic surgery? <br /> Check your healthcare costs!</p>
        <a href="#" className="text-accent font-bold text-[12px] leading-[16.8px] hover:underline">
          Read all posts <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[32px]">
        {BLOGS.map((post) => (
          <div key={post.title} className="bg-white rounded-[16px] overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={250}
              height={200}
              objectFit="cover"
              quality={100}
              className="w-full h-[229px]"
            />
            <div className="py-4">
              <p className="text-400 text-[12px] leading-[16.8px] font-medium">{post.date}</p>
              <h3 className="text-700 font-bold text-[18px] leading-[22px] mt-2">{post.title}</h3>
              <p className="text-700 leading-[16.8px] font-medium text-[12px] mt-2">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;