"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

// Degine types
interface Props {
  label?: string;
  items: any;
  itemSelection: any;
  selection: string | number;
  labelStyle?: string;
  labelSelectedStyle?: string;
  itemsContainerStyles?: string;
  itemsStyle?: string;
  itemsSelectedStyle?: string;
  iconStyle?: string;
  isOverLap: (time: string) => boolean;
  selectedDate: number | undefined;
}

/**
 * Renders a selection component that allows users to select
 * from a list of available options.
 *
 * @param {Array<any>} items - An array of items to be displayed for selection. Each item represents a possible option.
 * @param {Function} itemSelection - A callback function that is called when a item is selected. This function should handle the
 * @param {string | number} selection - The currently selected item
 *
 * @returns {JSX.Element} - A JSX element representing the component UI.
 */
const CustomTimeDD = ({
  label,
  items,
  itemSelection,
  selection,
  labelStyle,
  labelSelectedStyle,
  itemsContainerStyles,
  itemsStyle,
  itemsSelectedStyle,
  iconStyle,
  isOverLap,
  selectedDate,
}: Props) => {
  // React states
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showMenu, setShowMenu] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // Hooks
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Handles the selection of an item from the dropdown menu.
   *
   * @param {number} index - The index of the selected item in the items array.
   */
  const handleSelection = (index: any) => {
    setSelectedIndex(index);
    setShowMenu(false);
    itemSelection(items[index]);
  };
  // this function for just the time validation SUer Type in Input
  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove any non-numeric characters except ':'
    value = value.replace(/[^\d:]/g, "");

    // Automatically add ':' after 2 digits for the hour part
    if (
      value.length === 2 &&
      !value.includes(":") &&
      !inputValue.includes(":")
    ) {
      value = value + ":";
    }

    // Validate time format and ensure it's within 00:00 to 23:59
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d)$/; // Regex for time validation (00:00 to 23:59)

    if (timeRegex.test(value) || value.length <= 5) {
      if (!showMenu) setShowMenu(true);
      setInputValue(value);
    }
  };

  // useEffect hook to add selection
  useEffect(() => {
    if (selection) {
      items.forEach((item: any, index: number) => {
        if (item.key == selection) {
          setSelectedIndex(index);
        }
      });
    }
  }, [selection]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  items = items?.filter(
    (item: any) =>
      item?.value?.toLowerCase().includes(inputValue.toLowerCase()) ||
      item?.name?.toLowerCase().includes(inputValue.toLowerCase())
  );
  // close modal on invalid input
  useEffect(() => {
    if (!showMenu && selectedIndex === -1) {
      setInputValue("");
    }
  }, [showMenu]);

  // ondateChange
  useEffect(() => {
    setSelectedIndex(-1);
    setInputValue("");
  }, [selectedDate]);
  return (
    <div
      ref={dropdownRef}
      className={clsx("relative w-full flex justify-center items-center")}
    >
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={clsx(
          "py-4 px-4 text-xs font-medium leading-4 text-400 w-full",
          "flex items-center justify-between",
          "cursor-pointer hover:!bg-background-lite/50",
          "" + labelStyle + " " + labelSelectedStyle
        )}
      >
        <span className=" w-full">
          <input
            type="text"
            className={` bg-transparent w-full outline-none ${selectedIndex} -`}
            placeholder={label ? label : "Select"}
            value={
              selectedIndex != -1
                ? items[selectedIndex]?.value || items[selectedIndex]?.name
                : inputValue
            }
            onChange={(e) => {
              setSelectedIndex(-1);
              handleTimeInput(e);
            }}
          />
        </span>
        <ChevronDown
          className={clsx(
            "opacity-40 size-4",
            "transition-all duration-300" + " " + iconStyle,
            showMenu ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {showMenu && (
        <div
          className={clsx(
            "absolute top-8 left-[-20px] w-[150px] max-h-[200px] overflow-y-auto overflowY z-30 bg-white rounded-xl shadow-md ",
            "flex flex-col items-center justify-start" +
              " " +
              itemsContainerStyles,
            items?.length == 0 ? "p-0" : "py-2"
          )}
        >
          {items?.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                if (isOverLap(items[index].value)) {
                  setInputValue("");
                  setSelectedIndex(-1);
                } else {
                  handleSelection(index);
                }
              }}
              className={clsx(
                "w-full text-[12px] z-30 py-3 px-3 font-medium leading-4 text-400",
                "flex items-center justify-start",
                "cursor-pointer",
                "hover:bg-background-lite",
                selectedIndex == index && "bg-background-lite",
                "transition-all duration-300" +
                  " " +
                  itemsStyle +
                  " " +
                  itemsSelectedStyle
              )}
            >
              {item?.value ? item?.value : item?.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomTimeDD;
