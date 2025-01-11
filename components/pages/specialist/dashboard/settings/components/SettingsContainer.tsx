import clsx from "clsx";
import React from "react";

/**
 * SettingsContainer component that serves as a wrapper for settings-related content.
 *
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - The child elements to be rendered inside the container
 *
 * @returns {JSX.Element} Rendered UI.
 */
const SettingsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={clsx(
        "w-[33rem] lg:pt-20",
        "flex flex-col items-start justify-start gap-4",
        "max-lg:w-full"
      )}
    >
      {children}
    </div>
  );
};

export default SettingsContainer;
