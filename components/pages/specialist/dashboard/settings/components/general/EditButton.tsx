"use client";

import clsx from "clsx";
import React from "react";

// Define types
interface EditButton {
  text: any;
  onClick?: any;
}

/**
 * EditButton component renders a button with customizable text and an onClick handler.
 *
 * @param {Object} props - Component props.
 * @param {string} props.text - The text to display on the button.
 * @param {function} props.onClick - The callback function to execute when the button is clicked.
 *
 * @returns {JSX.Element} - The rendered edit button component.
 */
const EditButton = ({ text, onClick }: EditButton) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-[14px] text-accent/80 font-bold leading-4",
        "hover:text-accent/100 transition-all duration-300"
      )}
    >
      {text}
    </button>
  );
};

export default EditButton;
