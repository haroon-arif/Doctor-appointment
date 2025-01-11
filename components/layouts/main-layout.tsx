"use client"
import { ReactNode } from 'react';
import Header from '../pages/site/homepage/components/Header';
import Footer from '../pages/site/components/footer/Footer';

type MainLayoutProps = {
  children: ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
    <Header/>
        {children}
        <Footer/>
    </>
  );
};