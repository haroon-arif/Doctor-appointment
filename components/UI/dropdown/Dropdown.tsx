"use client";

import React, { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

// Degine types
interface Props {
  label?: string;
  search?: boolean;
  items: any;
  itemSelection: any;
  selection: string | number;
  labelStyle?: string;
  labelSelectedStyle?: string;
  itemsContainerStyles?: string;
  itemsStyle?: string;
  itemsSelectedStyle?: string;
  iconStyle?: string;
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
const Dropdown = ({
  label,
  search,
  items,
  itemSelection,
  selection,
  labelStyle,
  labelSelectedStyle,
  itemsContainerStyles,
  itemsStyle,
  itemsSelectedStyle,
  iconStyle,
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
  if (search == true) {
    items = items?.filter(
      (item: any) =>
        item?.value?.toLowerCase().includes(inputValue.toLowerCase()) ||
        item?.name?.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  // useEffect hook to add selection
  useEffect(() => {
    if (selection) {
      items.forEach((item: any, index: number) => {
        if (item.key == selection) {
          setSelectedIndex(index);
        }
      });
    } else {
      setSelectedIndex(-1);
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

  useEffect(() => {
    if (selectedIndex == -1) {
      setInputValue("");
    }
  }, [showMenu]);
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
          "cursor-pointer hover:bg-background-lite/50",
          "" + labelStyle + " " + labelSelectedStyle
        )}
      >
        <span className=" w-full">
          {search == true ? (
            <input
              type="text"
              className={` bg-transparent w-full outline-none ${selectedIndex}`}
              placeholder={label ? label : "Select"}
              value={
                selectedIndex != -1
                  ? items[selectedIndex]?.value || items[selectedIndex]?.name
                  : inputValue
              }
              readOnly={!showMenu}
              onChange={(e) => {
                setSelectedIndex(-1);
                setInputValue(e.target.value);
              }}
              onClick={(e) => {
                setShowMenu(true);
                e.stopPropagation();
              }}
            />
          ) : selectedIndex != -1 ? (
            items[selectedIndex]?.value || items[selectedIndex]?.name
          ) : label ? (
            label
          ) : (
            "Select"
          )}
        </span>

        {showMenu && (inputValue || selectedIndex != -1) && (
          <X
            className=" size-4 text-300 cursor-pointer hover:text-400 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setInputValue("");
              setSelectedIndex(-1);
            }}
          />
        )}
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
                handleSelection(index);
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

export default Dropdown;
