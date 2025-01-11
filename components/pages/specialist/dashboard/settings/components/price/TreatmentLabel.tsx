"use client";

import clsx from "clsx";
import React from "react";

/**
 * Renders a label for a treatment with optional custom styling.
 *
 * @param {string} label - The text to be displayed as the label.
 * @param {string} [className] - Optional additional class names for styling.
 *
 * @returns {JSX.Element} - A JSX element representing the label.
 */
const TreatmentLabel = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        " text-300 text-[11px] font-medium tracking-[0.22px]",
        className
      )}
    >
      {label}
    </div>
  );
};

export default TreatmentLabel;
