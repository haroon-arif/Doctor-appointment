"use client";

import clsx from "clsx";
import React from "react";

// Import components and utilities
import EditButton from "@/components/pages/specialist/dashboard/settings/components/general/EditButton";

/**
 * Label component that displays a text label with an optional edit feature.
 *
 * @param {Object} props - Component properties
 * @param {string} props.label - The text to be displayed as the label
 * @param {boolean} props.showEdit - Flag to determine if the edit option should be shown
 *
 * @returns {JSX.Element} - UI for label component.
 */
const Label = ({
  label,
  showEdit = false,
  className,
}: {
  label: string;
  showEdit?: boolean;
  className?: string;
}) => {
  return (
    <div className={clsx("w-full", "flex items-center justify-between gap-4")}>
      <div
        className={clsx(
          "w-full text-700 text-[14px] leading-5",
          "flex flex-col items-start justify-start gap-2",
          className
        )}
      >
        {label}
      </div>

      {showEdit && <EditButton text={"Edit"} />}
    </div>
  );
};

export default Label;
