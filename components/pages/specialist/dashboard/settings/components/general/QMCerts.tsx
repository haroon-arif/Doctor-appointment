"use client";

import clsx from "clsx";
import Image from "next/image";
import React from "react";

// Images
import qmBottom from "@/public/specialist/settings/general/qm-top.svg";
import qmTop from "@/public/specialist/settings/general/qm-top.svg";

/**
 * QMCerts component that displays a certification.
 *
 * @param {Object} props - Component properties
 * @param {string} props.text - The text to be displayed for the certification
 * @param {number} props.key - A unique identifier for the component
 *
 * @returns {JSX.Element} - UI certification component.
 */
const QMCerts = ({ text, key }: { text: string; key: number }) => {
  return (
    <div
      key={key}
      className={clsx(
        "w-[150px] h-[111px] relative cursor-pointer",
        "flex items-center justify-center",
        "transition-all duration-300",
        "hover:scale-[1.03]"
      )}
    >
      <Image
        className="absolute w-[150px] h-[111px]"
        src={qmBottom}
        height={200}
        width={200}
        alt="profile image"
      />
      <Image
        className="absolute left-2 bottom-2 w-[150px] h-[111px]"
        src={qmTop}
        height={200}
        width={200}
        alt="profile image"
      />

      {/* QM test */}
      <div
        className={clsx(
          "absolute left-5 bottom-5 z-10 text-500 text-[14px] font-bold leading-4 uppercase"
        )}
      >
        {text}
      </div>
    </div>
  );
};

export default QMCerts;
