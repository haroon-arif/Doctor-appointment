"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

// Icons
import { Plus } from "lucide-react";

// Import components and utilities
import SelectedSubctgItem from "./SelectedSubctgItem";
import Button from "@/components/UI/button/Button";
import Dropdown from "@/components/UI/dropdown/Dropdown";

// Define types
interface Category {
  id: string;
  name: string;
}
interface SubCategory {
  id: number;
  name: string;
  categoryId: string;
}
interface Service {
  subcategory: SubCategory;
  treatments: [];
}
interface Options {
  key: string;
  value: string;
}
interface Props {
  handleRemoveItem: (subCtgId: any) => void;
  selectedSubCtg: SubCategory | null;
  selectedCategory: Category | null;
  selectedServices: Service[];
  setSelectedServices: any;
  newSubctgs: SubCategory[];
  setSelectedSubCtg: any;
  handleSave: () => void;
}

/**
 * AddSubCategories component that manages the addition and removal of subcategories.
 *
 * @param {Object} props - Component properties
 * @param {function} props.setSelectedServices - A function to update the selected services state.
 * @param {function} props.setSelectedSubCtg - A function to update the selected subcategory state.
 * @param {Category} props.selectedCategory - The currently selected category object.
 * @param {Service[]} props.selectedServices - An array of currently selected services.
 * @param {function} props.handleRemoveItem - A function to handle the removal of a subcategory item.
 * @param {SubCategory} props.selectedSubCtg - The currently selected subcategory object.
 * @param {function} props.handleSave - A function to save the changes made to the selected subcategories.
 * @param {SubCategory[]} props.newSubctgs - An array of new subcategory objects that can be added.
 *
 * @returns {JSX.Element} The rendered component for managing subcategories.
 */
const AddSubCategories = ({
  setSelectedServices,
  setSelectedSubCtg,
  selectedCategory,
  selectedServices,
  handleRemoveItem,
  selectedSubCtg,
  handleSave,
  newSubctgs,
}: Props) => {
  // React states
  const [dropdownOpts, setDropdownOpts] = useState<Options[]>([]);

  /**
   * Handles the addition of a new service category based on the selected subcategory.
   *
   * @returns {void}
   */
  const handleAddNewCtg = () => {
    let srvs = [...selectedServices];

    if (selectedSubCtg) {
      // Check if the subcategory already exists in the services array
      const existingService = srvs.find(
        (service) => service.subcategory.id === selectedSubCtg.id
      );

      // If it doesn't exist, push a new service object
      if (!existingService) {
        srvs.push({
          subcategory: selectedSubCtg, // Add the selected subcategory
          treatments: [], // Initialize treatments array
        });
      }
    }

    setSelectedServices(srvs);
    setSelectedSubCtg(null);
  };

  const handleSelection = (item: Options) => {
    setSelectedSubCtg(newSubctgs.filter((ctg) => ctg.name == item.key)[0]);
  };

  useEffect(() => {
    let opts: Options[] = [];

    if (newSubctgs.length > 0) {
      newSubctgs.forEach((ctg) => {
        let item = {
          key: ctg.name,
          value: ctg.name,
        };
        opts.push(item);
      });
    }

    setDropdownOpts(opts);
  }, [newSubctgs]);

  console.log("newSubctgs", newSubctgs);

  return (
    <div
      className={clsx(
        "w-[45rem] mt-8 flex flex-col items-start justify-start",
        "max-lg:w-full"
      )}
    >
      <div
        className={clsx(
          "w-full py-4 px-2 bg-background-2324 rounded-2xl",
          "flex flex-col items-center justify-start"
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            "w-full px-4 mb-2",
            "flex flex-col items-start justify-start gap-2"
          )}
        >
          <div className={clsx("w-full text-700 text-[0.77rem] font-semibold")}>
            {selectedCategory?.name} ({selectedServices.length})
          </div>
          <div
            className={clsx(
              "w-full text-300 text-[11px] font-medium tracking-[0.22px]"
            )}
          >
            Treatments
          </div>
        </div>

        {selectedServices.length < 1 && (
          <div
            className={clsx(
              "w-full my-3 px-4 text-300 text-[11px] font-medium tracking-[0.22px]"
            )}
          >
            Please Add Treatments From Below
          </div>
        )}

        {/* Selected treatments */}
        {selectedServices.length > 0 && (
          <div
            className={clsx(
              "w-full rounded-xl bg-white",
              "flex flex-col items-center self-stretch",
              "border border-stroke"
            )}
          >
            {/* Single item */}
            {selectedServices.map((item: Service, index: number) => (
              <SelectedSubctgItem
                item={item}
                index={index}
                showBottomB={index !== selectedServices.length - 1}
                remove={handleRemoveItem}
              />
            ))}
          </div>
        )}

        {/* Select new treatment */}
        <div
          className={clsx(
            "w-full px-3 py-2 flex flex-col items-center justify-start gap-2"
          )}
        >
          {/* Dropdown */}
          <div
            className={clsx(
              "w-full",
              "flex items-center self-stretch gap-2",
              newSubctgs.length < 1 && "opacity-60 pointer-events-none"
            )}
          >
            {/* Select new sub category */}
            <Dropdown
              label="Select Treatment"
              search={true}
              items={dropdownOpts}
              selection={selectedCategory ? selectedCategory.name : ""}
              itemSelection={handleSelection}
              labelStyle={
                "w-full bg-white py-[14px] px-4 text-500 text-sm rounded-xl border border-stroke gap-1 border-[1px]"
              }
              itemsContainerStyles={"top-full left-[0px] w-full"}
              iconStyle={"size-5"}
            />

            {/* Add new sub category */}
            <button
              onClick={handleAddNewCtg}
              className={clsx(
                "bg-white/50 px-3 py-[11px]",
                "flex items-center justify-center",
                "rounded-xl border-[2px] border-background-secondary",
                "hover:bg-background-secondary",
                "transition-all duration-300",
                !selectedSubCtg && "opacity-60 pointer-events-none"
              )}
            >
              <Plus strokeWidth={2.5} className="text-accent size-6" />
            </button>
          </div>

          {newSubctgs.length < 1 && (
            <div
              className={clsx(
                "w-full text-300 text-[11px] capitalize font-medium tracking-[0.22px]"
              )}
            >
              All available treatments have been selected
            </div>
          )}

          {/* Action buttons */}
          <div
            className={clsx(
              "w-full mt-2 flex items-center justify-center gap-2"
            )}
          >
            <Button bg="transparent" className="py-3 px-6">
              Cancel
            </Button>
            <Button onClick={handleSave} bg="fill" className="py-3 px-6">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategories;
