"use client";

import clsx from "clsx";
import React from "react";

// Define types
interface props {
  activeSettingMenu: string;
  setActiveSettingMenu: any;
}

// Menu items
const settingMenuItems = ["General", "Password", "Price", "Treatments"];

/**
 * Settings menu component
 *
 * @param {Object} props - The component props
 * @param {string} props.activeSettingMenu - The currently active menu item
 * @param {Function} props.setActiveSettingMenu - A function to update the active menu item
 *
 * @returns {JSX.Element} - Renders the settings menu component
 */
const SettingsMenu = ({ activeSettingMenu, setActiveSettingMenu }: props) => {
  return (
    <div
      className={clsx(
        "w-[20%] fixed",
        "flex flex-col items-start justify-start",
        "max-lg:w-full max-lg:relative "
      )}
    >
      <div
        className={clsx(
          "w-[260px]",
          "flex flex-col items-start justify-center gap-7",
          "max-lg:w-full"
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            "text-800 text-[30px] font-bold leading-[36px]",
            "max-md:mx-auto max-md:text-xl"
          )}
        >
          Settings
        </div>

        {/* Menu items */}
        <div
          className={clsx(
            "w-64 p-[4px] bg-background-primary rounded-2xl",
            "flex flex-col items-start justify-start gap-[10px]",
            "max-lg:flex-row max-lg:w-full",
            "max-md:flex-col max-md:w-full"
          )}
        >
          {settingMenuItems.map((item, index) => (
            <div
              onClick={() => setActiveSettingMenu(item)}
              key={index}
              className={clsx(
                "relative py-3 px-4 text-500 text-[14px] font-medium cursor-pointer",
                "flex items-center justify-start self-stretch",
                "hover:text-accent",
                "transition-all duration-300 overflow-hidden",
                "max-lg:w-[25%] ",
                "max-md:w-[100%] ",
                activeSettingMenu == item && "text-accent font-semibold"
              )}
            >
              <span
                className={clsx(
                  "relative z-10",
                  "max-lg:mx-auto",
                  "max-md:mx-0"
                )}
              >
                {item}
              </span>

              {/* Sliding Background */}
              <span
                className={clsx(
                  "w-full absolute inset-0 bg-white rounded-xl transition-all duration-300 ease-in-out",
                  activeSettingMenu == item ? "left-0" : "-left-full"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
