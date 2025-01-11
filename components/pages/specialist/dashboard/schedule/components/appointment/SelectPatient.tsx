"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import clsx from "clsx";
import { IoIosSearch } from "react-icons/io";
import Button from "@/components/UI/button/Button";
import Label from "../../../settings/components/general/Label";

// Degine types
interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
}
interface Props {
  allPatients: Patient[];
  selectedPatient: Patient | null;
  handlePatientSelection: (patient: Patient) => void;
  toggleAddPatient: () => void;
}
interface SearchCompProps {
  allPatients: Patient[];
  toggleAddPatient: () => void;
  setPatients: (patients: Patient[]) => void;
}

/**
 * Renders a patient selection component that allows users to select
 * from a list of available options.
 *
 * @param {Array<any>} allPatients - An array of patients to be displayed for selection. Each item represents a possible option.
 * @param {string | number} selectedPatient - The currently selected patient
 * @param {Function} toggleAddPatient - The function to handle visibility of the component
 * @param {Function} handlePatientSelection - A callback function that is called when a item is selected. This function should handle the
 *
 * @returns {JSX.Element} - A JSX element representing the component UI.
 */
const SelectPatient = ({
  allPatients = [],
  selectedPatient,
  handlePatientSelection,
  toggleAddPatient,
}: Props) => {
  // React states
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showMenu, setShowMenu] = useState(false);

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
    handlePatientSelection(allPatients[index]);
  };

  // useEffect hook to add selection
  useEffect(() => {
    if (selectedPatient) {
      patients.forEach((item: any, index: number) => {
        if (item.name == selectedPatient.name) {
          setSelectedIndex(index);
        }
      });
    }
  }, [selectedPatient]);

  // useEffect hook to add selection
  useEffect(() => {
    if (allPatients.length > 0) {
      setPatients(allPatients);
    }
  }, [allPatients]);

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

  return (
    <div ref={dropdownRef} className={clsx("relative w-full")}>
      <Label label="Patient" className="font-medium mb-[5px]" />

      <button
        onClick={() => setShowMenu(!showMenu)}
        className={clsx(
          "w-full bg-white border border-stroke py-[15px] px-[16px] rounded-xl text-sm text-400",
          "flex items-center justify-between",
          "cursor-pointer hover:bg-background-lite/50"
        )}
      >
        <span>
          {selectedIndex != -1
            ? patients && patients[selectedIndex]?.name
            : "Select Patient"}
        </span>
        <ChevronDown
          className={clsx(
            "size-5 text-300",
            "transition-all duration-300",
            showMenu ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      {showMenu && (
        <div
          style={{
            boxShadow: "0px 4px 15px 0px rgba(23, 46, 121, 0.10)",
          }}
          className={clsx(
            "absolute top-full left-0 w-full max-h-[250px] overflow-y-auto overflowY z-30 bg-white rounded-2xl",
            "flex flex-col items-center justify-start gap-4"
          )}
        >
          <SearchPatient
            setPatients={setPatients}
            allPatients={allPatients}
            toggleAddPatient={toggleAddPatient}
          />

          <div className="w-full pb-6 px-6 flex flex-col items-center justify-start">
            {patients?.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => handleSelection(index)}
                className={clsx(
                  "w-full py-[9px] px-[18px] rounded-xl flex items-center justify-between gap-3",
                  "",
                  "cursor-pointer",
                  "hover:bg-background-lite",
                  selectedIndex == index && "bg-background-lite",
                  "transition-all duration-300"
                )}
              >
                {/* Name and email */}
                <div
                  className={clsx(
                    "w-full flex flex-col items-start justify-center"
                  )}
                >
                  <span className="text-sm font-medium text-800">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-medium text-400 leading-[17px] tracking-[0.22px]">
                    {item.email}
                  </span>
                </div>
                {/* Phone */}
                <div
                  className={clsx(
                    "w-full flex items-center justify-end",
                    "text-sm text-800"
                  )}
                >
                  {item.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Function to handle patient search UI and its functionality
 * @param {Function} toggleAddPatient - The function to handle visibility of the component
 * @param {Function} allPatients - An array of patients to be displayed for selection. Each item represents a possible option.
 * @param {Function} setPatients - React state to set all searched patients
 * @returns {JSX.Element} - A JSX element representing the component UI.
 */
const SearchPatient = ({
  toggleAddPatient,
  allPatients,
  setPatients,
}: SearchCompProps) => {
  // React states
  const [searchText, setSearchText] = useState("");

  /**
   * Function to handle search
   * @param e
   */
  const handleSearch = (e: any) => {
    if (e.key == "Enter") {
      let foundPats = allPatients.filter((pat: Patient) => {
        if (pat.name.toLowerCase().includes(searchText.toLowerCase()))
          return true;
        else if (pat.email.toLowerCase().includes(searchText.toLowerCase()))
          return true;
        else if (pat.phone.includes(searchText)) return true;
      });

      setPatients(foundPats);
    }
  };

  /**
   * UseEffect to handle functionality if there is no search text
   */
  useEffect(() => {
    if (searchText.trim() == "") {
      setPatients(allPatients);
    }
  }, [searchText]);

  return (
    <div className="w-full pt-6 px-6 flex items-center justify-center gap-4">
      <div
        className={clsx(
          "w-full px-4 py-[15px]",
          "flex items-center justify-center gap-3",
          "rounded-xl border border-stroke",
          "focus-within:border-accent/80",
          "transition-all duration-300"
        )}
      >
        <IoIosSearch className="size-5 text-300" />

        <input
          type="text"
          placeholder="Search by Name, Email or Phone"
          value={searchText}
          onChange={(e: any) => setSearchText(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full outline-none border-none bg-transparent text-sm text-400"
        />
      </div>

      <div className={clsx("w-[100px] flex items-center justify-center")}>
        <Button onClick={toggleAddPatient} bg="transparent">
          <span className="flex items-center justify-center gap-2">
            <Plus className="size-6" />
            <span>Add</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SelectPatient;
