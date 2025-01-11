"use client";

import clsx from "clsx";
import React from "react";

// Icons
import { Plus, X } from "lucide-react";

// Import components and utilites
import Dropdown from "@/components/UI/dropdown/Dropdown";

// Define types
interface Props {
  item?: any;
  isLastItem: boolean;
  serviceIndex?: number;
  removeItem?: (serviceIndex: any, id: number) => void;
  addItem?: (serviceIndex: any, id: number) => void;
  handleInput: (serviceIndex: any, trtId: any, e: any) => void;
  handleDurationSelection?: (
    duration: any,
    serviceIndex: any,
    trtId: any
  ) => void;
}

// Drpdown items
const duration = [
  { key: "30", value: "30m" },
  { key: "60", value: "1h" },
  { key: "90", value: "1h 30m" },
];

/**
 * Renders a selected treatment item within a service.
 *
 * @param {number} serviceIndex - The index of the service to which the treatment item belongs.
 * @param {Function} handleInput - A function to handle changes in treatment input fields.
 * @param {boolean} isLastItem - A flag indicating if this is the last treatment item in the list.
 * @param {Treatment} item - The treatment object containing its details.
 * @param {Function} [handleDurationSelection] - Optional function to handle the selection of duration for the treatment.
 * @param {Function} [removeItem] - Optional function to remove the treatment item from the list.
 * @param {Function} [addItem] - Optional function to add a new treatment item to the list.
 *
 * @returns {JSX.Element} - A JSX element representing the SelectedTreatmentItem component.
 */
const SelectedTreatmentItem = ({
  serviceIndex,
  handleInput,
  isLastItem,
  item,
  handleDurationSelection = () => {},
  removeItem = () => {},
  addItem = () => {},
}: Props) => {
  return (
    <div
      key={item.id}
      className={clsx(
        "w-full",
        "flex items-center justify-between",
        !isLastItem && "border-b border-stroke"
      )}
    >
      <>
        {/* Treatment name */}
        <div className={clsx("w-full p-4 text-xs font-medium text-600")}>
          {/* {item.name} */}
          <input
            type="text"
            onChange={(e) => handleInput(serviceIndex, item.id, e)}
            value={item.name ? item.name : ""}
            name="name"
            className="w-full outline-none bg-transparent"
          />
        </div>

        {/* Treatment duration */}
        <div className={clsx("w-[96px]", "flex ", "border-l border-stroke")}>
          <Dropdown
            items={duration}
            search={true}
            selection={item.duration}
            itemSelection={(duration: any) =>
              handleDurationSelection(duration.key, serviceIndex, item.id)
            }
            labelStyle={"w-[96px] "}
          />
        </div>

        {/* Treatment price */}
        <div
          className={clsx(
            "w-[109px] p-4 text-xs font-medium text-600",
            "flex items-center justify-end",
            "border-l border-stroke"
          )}
        >
          <span></span>
          <input
            type="text"
            className={clsx(
              "w- outline-none bg-transparent border-none text-right",
              "text-[12px] font-bold leading-4 text-700 placeholder:text-300",

              "[&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
            )}
            placeholder="€ 00.00"
            name="price"
            onChange={(e) => handleInput(serviceIndex, item.id, e)}
            value={item.price ? "€ " + item.price : ""}
          />
        </div>

        <div className={clsx("px-5 py-4 ", "border-l border-stroke")}>
          {!isLastItem && (
            <X
              className={clsx(
                "size-4 cursor-pointer opacity-40 ",
                "hover:text-error hover:opacity-70",
                "transition-all duration-300"
              )}
              onClick={() => removeItem(serviceIndex, item.id)}
            />
          )}
          {isLastItem && (
            <Plus
              onClick={() => addItem(serviceIndex, item.id)}
              className={clsx(
                "text-accent size-4 cursor-pointer",
                "opacity-90",
                "hover:opacity-100",
                "transition-all duration-300"
              )}
            />
          )}
        </div>
      </>
    </div>
  );
};

export default SelectedTreatmentItem;
