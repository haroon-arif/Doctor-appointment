"use client";

import clsx from "clsx";
import { Info } from "lucide-react";
import React from "react";

/**
 * Status message component that displays specific messages to the user.
 *
 * @param {Object} props - Component properties
 * @param {string} props.message - The message to be displayed
 * @param {"error" | "info" | "warn"} props.type - The type of message
 * @param {"sm" | "md" | "lg"} props.size - The size of the message
 *
 * @returns {JSX.Element} - The rendered UI for the status message component.
 */
const StatusMessage = ({
  message,
  type,
  size,
}: {
  message: string;
  type: "error" | "info" | "warn";
  size: "sm" | "md" | "lg";
}) => {
  return (
    <div
      className={clsx(
        "w-full my-3 ",
        "flex items-center justify-start gap-3",
        "text-[13px] font-medium tracking-[0.22px]",
        type == "info" && "bg-accent text-white ",
        type == "warn" && "bg-orange-300 text-orange-600 ",
        type == "error" && "bg-red-300 text-red-600",
        size == "lg" && "py-4 px-4 rounded-2xl",
        size == "md" && "py-2 px-2 rounded-xl text-[11px]",
        size == "sm" && "bg-transparent text-[13px] opacity-80"
      )}
    >
      <Info
        className={clsx(
          size == "lg" && "",
          size == "md" && "w-[18px]",
          size == "sm" && "bg-transparent w-[18px]"
        )}
      />
      <span>{message}</span>
    </div>
  );
};

export default StatusMessage;
