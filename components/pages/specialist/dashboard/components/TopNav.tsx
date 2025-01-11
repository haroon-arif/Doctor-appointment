"use client";

import { IoIosSearch } from "react-icons/io";
import React, { useEffect, useState } from "react";
import clsx from "clsx";

// Images
import avatar from "@/public/specialist/settings/general/profile-avatar.webp";
import logo from "@/public/logo/logo.png";

// Import components and utilites
import NotificationUi from "./notification/NotificationUi";
import ProfileCard from "./profileCard/ProfileCard";
import Image from "next/image";
import { useAppHook } from "@/components/utilis/hooks/AppHook";

// Define types
interface User {
  profileImage: string;
  name: string;
  about: string;
  location: string;
  qualityMarks: [];
  workingAt: {
    name: string;
    location: string;
  };
  [key: string]: any;
}

const USER: User = {
  profileImage: "",
  name: "",
  about: "",
  location: "",
  qualityMarks: [],
  workingAt: {
    name: "",
    location: "",
  },
};

/**
 * Specialist dashboard top navbar
 *
 * @returns {JSX.Element} - Renders the settings menu component
 */
const TopNav = () => {
  // React states
  const [newNotifications, setNewNotifications] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState<User>(USER);

  const { state, dispatch } = useAppHook();

  /**
   * Function to handle search
   * @param e
   */
  const handleSearch = (e: any) => {
    if (e.key == "Enter") {
      console.log("searchText", searchText);
    }
  };

  /**
   * Function to handle get profile
   * @param e
   */
  const handleGetProfile = () => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);

      if (session) {
        setUser(session.user);
      }
    }
  };

  // useEffect hook to get specialist data
  useEffect(() => {
    handleGetProfile();
  }, []);

  // useEffect hook to get specialist data
  useEffect(() => {
    if (state.profileUpdated) {
      handleGetProfile();
      dispatch({ type: "SET_PROFILE_UPDATED", payload: false });
    }
  }, [state.profileUpdated]);

  return (
    <div
      className={clsx(
        "w-full fixed top-0 bg-background-primary px-[35px] py-[14px]",
        "flex items-center justify-between",
        state.showAddApt || state.showEditWorkDays ? "z-0" : "z-[20]",
        "max-md:flex-col-reverse max-md:p-4"
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          "font-semibold italic text-800",
          "max-md:w-[150px] max-md:absolute max-md:top-[26%] max-md:left-[16px]"
        )}
      >
        <Image src={logo} height={100} width={100} alt="logo" />
      </div>

      {/* Seatch bar */}
      <div
        className={clsx(
          "w-[460px] px-4 py-2",
          "flex items-center justify-center gap-3",
          "rounded-xl border border-[#DADAFC]",
          "focus-within:border-accent/80",
          "transition-all duration-300",
          "max-md:max-w-[328px] max-md:mx-4"
        )}
      >
        <IoIosSearch className="text-[24px] opacity-40" />

        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e: any) => setSearchText(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full outline-none border-none bg-transparent text-sm text-400"
        />
      </div>

      {/* Profile card and notification */}
      <div
        className={clsx(
          "w-fit min-w-62 flex items-center justify-center gap-3",
          "max-lg:w-24 max-lg:justify-end",
          "max-md:gap-3 max-md:h-12 max-md:w-full"
        )}
      >
        <NotificationUi newNotifications={newNotifications} />

        {/* <span className="max-lg:hidden"> */}
        <ProfileCard
          name={user.name}
          location={user.location}
          profileImage={user.profileImage}
        />
        {/* </span> */}
      </div>
    </div>
  );
};

export default TopNav;
