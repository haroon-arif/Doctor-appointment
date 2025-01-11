"use client";
import React, { forwardRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

// Icons
import { GrAppsRounded } from "react-icons/gr";
import { CalendarDays, LogOut } from "lucide-react";
import { BiUserPin } from "react-icons/bi";
import { LuMail } from "react-icons/lu";
import { Settings } from "lucide-react";

// Images
import bottomRound from "@/public/specialist/admin-menu/bottom-round.svg";
import topRound from "@/public/specialist/admin-menu/top-round.svg";

// Hooks
import { useAppHook } from "@/components/utilis/hooks/AppHook";
// Define types
interface props {
  activeAdminMenu: string;
  setActiveAdminMenu: any;
}

// Menu items
const items = [
  { label: "Dashboard", icon: <GrAppsRounded /> },
  { label: "Inbox", icon: <LuMail /> },
  { label: "Schedule", icon: <CalendarDays /> },
  { label: "Reviews", icon: <BiUserPin /> },
  { label: "Settings", icon: <Settings /> },
];

/**
 * Admin menu side navbar
 *
 * @param {Object} props - The component props
 * @param {string} props.DBActiveMenu - The currently active dashboard menu item
 * @param {function} props.setActiveAdminMenu - A function to update the active dashboard menu item
 *
 * @returns {JSX.Element} - Renders the admin menu with selectable dashboard items
 */
const AdminMenu = ({ activeAdminMenu, setActiveAdminMenu }: props) => {
  // Hooks
  const { dispatch } = useAppHook();
  const router = useRouter();
  // functions
  const handleLogout = () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    localStorage.clear();
    router.push("/");
  };
  return (
    <div
      className={clsx(
        "w-[7dvw] h-[87%]",
        "flex flex-col items-center justify-center gap-2",
        "fixed lg:left-0 lg:top-20",
        "max-lg:w-full max-lg:h-[104px] max-lg:flex-row max-lg:bottom-[0px] max-lg:z-[11] max-lg:overflow-hidden max-lg:top-auto max-lg:border max-lg:bg-background-primary",
        "max-md:h-[72px]"
      )}
    >
      {/* Nav items */}
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            setActiveAdminMenu(item.label);
            localStorage.setItem("active_db_menu", item.label);
          }}
          className={clsx(
            "relative h-[88px] group ",
            "flex flex-col items-center justify-center self-stretch gap-3",
            "cursor-pointer ",
            " max-lg:!w-[96px] max-lg:my-auto max-lg:overflow-hidden",
            "max-md:h-[100%] max-md:!w-14"
          )}
        >
          <div
            className={clsx(
              "z-10 text-[24px] opacity-40",
              "group-hover:text-accent group-hover:opacity-100",
              "transition-all duration-300",
              `${activeAdminMenu == item.label && "text-accent opacity-100 "}`
            )}
          >
            {item.icon}
          </div>
          <div
            className={clsx(
              "z-10 text-400 text-[9px] font-medium leading-[9px] uppercase",
              "group-hover:text-accent group-hover:opacity-100",
              "transition-all duration-300",
              `${activeAdminMenu == item.label && "text-accent opacity-100"}`,
              "max-md:hidden"
            )}
          >
            {item.label}
          </div>

          {/* Sliding background animation */}
          <span
            className={clsx(
              "w-full absolute inset-0 bg-white rounded-l-xl transition-all duration-300 ease-in-out max-lg:h-[88px] max-lg:w-[88px] max-md:h-14 max-md:w-14",
              activeAdminMenu === item.label
                ? "lg:left-2  max-lg:rounded-2xl max-lg:left-1/2 max-lg:top-1/2 max-lg:transform max-lg:-translate-x-1/2 max-lg:-translate-y-1/2 "
                : "lg:left-full max-lg:-top-full max-lg:left-1/2 max-lg:transform max-lg:-translate-x-1/2"
            )}
          ></span>

          {activeAdminMenu == item.label && index != 0 && (
            <Image
              className={clsx(
                "w-[16px] absolute -top-4 right-0",
                "max-lg:hidden"
              )}
              src={topRound}
              height={200}
              width={200}
              alt="topRound"
            />
          )}
          {activeAdminMenu == item.label && (
            <Image
              className={clsx(
                "w-[16px] absolute -bottom-4 right-0",
                "max-lg:hidden"
              )}
              src={bottomRound}
              height={200}
              width={200}
              alt="topRound"
            />
          )}
        </div>
      ))}
      {/* logout button */}
      <div
        className={clsx(
          "relative h-[88px] group lg:mt-auto cursor-pointer ",
          "flex flex-col items-center justify-center self-stretch gap-3",
          "max-lg:w-[16%] max-lg:ml-auto max-lg:h-full",
          "max-md:h-[100%] "
        )}
        onClick={handleLogout}
      >
        <LogOut className=" text-400 group-hover:text-error/80" />
        <div
          className={clsx(
            "z-10 text-400 text-[9px] font-medium leading-[9px] uppercase group-hover:text-error/80",
            "transition-all duration-300",
            "max-md:hidden"
          )}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
