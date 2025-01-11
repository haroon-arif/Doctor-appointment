import clsx from "clsx";
import React from "react";

interface Button {
  bg?: "transparent" | "fill";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Button component renders a customizable button with background color, additional styles, and child content.
 *
 * @param {Object} props - Component props.
 * @param {string} props.bg - The background color of the button.
 * @param {React.ReactNode} props.children - The content to be displayed inside the button (text, icons, etc.).
 * @param {string} [props.className] - Additional class names to apply for custom styling.
 *
 * @returns {JSX.Element} - The rendered button component.
 */
const Button = ({ bg, children, className, onClick }: Button) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative w-fit p-3 flex-[1_0_0] rounded-xl ",
        "text-[14px] font-bold leading-4",
        "border-[2px]",
        "hover:scale-[1.03]",
        "transition-all duration-300 overflow-hidden",
        bg == "transparent"
          ? "bg-white/50 text-accent border-[#E4E4F8] hover:text-white hover:border-accent       before:absolute before:-z-10 before:content-[''] before:bg-accent before:top-0 before:left-0 before:w-full before:h-full before:scale-x-0 hover:before:scale-x-100 before:origin-left  before:transition-transform before:duration-300"
          : "bg-accent text-white border-[2px] border-accent",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
