"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

/**
 *
 * @param {React.ReactNode} children - Modal content
 * @param {string} className - Modal classes
 *
 * @returns {JSX.Element} Renders Modal UI
 */
const Modal = ({
  children,
  className,
  header,
  close,
  modalWidth,
}: {
  children: React.ReactNode;
  className?: string;
  modalWidth?: number;
  header: string;
  close: () => void;
}) => {
  return (
    <div className="fixed inset-0 h-screen w-screen flex items-center justify-center z-50 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 overflow-y-scroll">
      <div
        style={{ width: modalWidth }}
        className={clsx(
          "max-h-[600px] overflow-y-auto overflowY px-8 py-6",
          "flex flex-col items-center justify-start",
          "bg-background-2324 rounded-3xl",
          "shadow-lg",
          "max-md:p-6",
          className
        )}
      >
        {/* Header */}
        <div className={clsx("w-full pb-6 flex items-center justify-between")}>
          <h2 className="text-[1.25rem] text-800 font-bold">{header}</h2>
          <X
            className="size-6 text-300 cursor-pointer hover:text-400 transition-all duration-300"
            onClick={close}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
