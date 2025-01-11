"use client";

import React, { useState } from "react";
import clsx from "clsx";

// Custom component and utilities
import TreatmentsCategory from "./TreatmentsCategory";
import SettingsMenu from "./components/SettingsMenu";
import TreatmentPrice from "./TreatmentPrice";
import Password from "./Password";
import General from "./General";

/**
 * Admin menu settings component
 *
 * @returns {JSX.Element} - Renders the settings menu component
 */
const Settings = () => {
  // React states
  const [activeSettingMenu, setActiveSettingMenu] = useState("General");

  return (
    <div
      className={clsx(
        "w-full relative flex items-start justify-between gap-12",
        "max-lg:flex-col max-lg:gap-6"
      )}
    >
      <SettingsMenu
        activeSettingMenu={activeSettingMenu}
        setActiveSettingMenu={setActiveSettingMenu}
      />

      {/* Setting menu components */}
      <div
        className={clsx(
          "lg:w-[75%] translate-x-64 ml-3",
          "flex flex-col items-center justify-start gap-10",
          "max-lg:w-full max-lg:translate-x-0 max-lg:ml-0"
        )}
      >
        {activeSettingMenu == "General" && <General />}
        {activeSettingMenu == "Password" && <Password />}
        {activeSettingMenu == "Price" && <TreatmentPrice />}
        {activeSettingMenu == "Treatments" && <TreatmentsCategory />}
      </div>
    </div>
  );
};

export default Settings;
