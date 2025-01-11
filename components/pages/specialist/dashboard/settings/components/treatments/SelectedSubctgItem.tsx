"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import React from "react";

/**
 * Represents a selected subcategory item in the list.
 *
 * @param {Object} item - The subcategory item being displayed.
 * @param {boolean} showBottomB - Indicates whether the bottom button should be shown.
 * @param {number} index - The index of the item in the list.
 * @param {Function} remove - A function to call when removing the item from the selection.
 *
 * @returns {JSX.Element} The rendered component for the selected subcategory item.
 */
const SelectedSubctgItem = ({
  item,
  showBottomB,
  index,
  remove,
}: {
  item: any;
  showBottomB: boolean;
  index: number;
  remove: any;
}) => {
  return (
    <div
      key={index}
      className={clsx(
        "w-full",
        "flex items-center justify-between",
        showBottomB && "border-b border-stroke"
      )}
    >
      <div
        className={clsx(
          "w-full p-4 text-xs font-medium text-600 pointer-events-none"
        )}
      >
        {item.subcategory.name}
      </div>

      <div
        className={clsx(
          "px-5 py-4 cursor-pointer",
          "hover:text-error hover:opacity-70",
          "transition-all duration-300",
          "border-l border-stroke",
          "opacity-40"
        )}
      >
        <X className="size-4" onClick={() => remove(item.subcategory.id)} />
      </div>
    </div>
  );
};

export default SelectedSubctgItem;
