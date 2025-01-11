import { Montserrat } from "next/font/google";
import type { Metadata } from "next";

import AppContextProvider from "@/components/utilis/hooks/AppHook";
import Loader from "@/components/UI/loader/Loader";

import "./globals.css";
import Head from "next/head";
import { MainLayout } from "@/components/layouts/main-layout";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "400", "700", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cosmediate",
  description: "Cosmediate specialist dashbaord",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased overflowY`}>
        <AppContextProvider>
          <MainLayout>
          <Loader />
          {children}
          </MainLayout>
        </AppContextProvider>
      </body>
    </html>
  );
}
