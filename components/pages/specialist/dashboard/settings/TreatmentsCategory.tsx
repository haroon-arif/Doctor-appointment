"use clint";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import clsx from "clsx";

// Import components and utilities
import { updateServicesAPI } from "@/components/utilis/api/specialistApi";
import AddSubCategories from "./components/treatments/AddSubCategories";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import MainCategories from "./components/MainCategories";
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

/**
 * Treatments component that displays a list of available treatments.
 *
 * @returns {JSX.Element} The rendered component containing treatment information.
 */
const TreatmentsCategory = () => {
  // Reacr states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedSubCtg, setSelectedSubCtg] = useState<SubCategory | null>(
    null
  );
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [newSubctgs, setNewSubctgs] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubctg, setAllSubctg] = useState<SubCategory[]>([]);

  // Hooks
  const { dispatch } = useAppHook();

  /**
   * Handles the removal of a service item based on its subcategory ID.
   *
   * @param {any} subCtgId - The ID of the subcategory to be removed from the selected services.
   */
  const handleRemoveItem = (subCtgId: any) => {
    const foundCtg = selectedServices.find(
      (service) => service.subcategory.id === subCtgId
    );
    if (foundCtg) {
      setNewSubctgs((prev) => [...prev, foundCtg.subcategory]);
    }

    const updatedServices = selectedServices.filter(
      (service) => service.subcategory.id !== subCtgId
    );
    setSelectedServices(updatedServices);
  };

  /**
   * Handles the save operation for the specialist's services.
   *
   * @returns {Promise<void>} A promise that resolves when the save operation is complete.
   */
  const handleSave = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });

    try {
      let session = JSON.parse(localStorage.getItem("session")!);
      let specialist = session.user;

      if (selectedServices.length < 1) {
        throw new Error("Please select atleast one treatment");
      }

      // Filter subcategories from services which are not related to the selected category to avoid duplication
      let otherServices = specialist.services.filter(
        (service: Service) =>
          service.subcategory.categoryId !== selectedCategory?.id
      );

      // Add services with subcategories related to selected category
      otherServices.push(...selectedServices);
      // specialist.services = otherServices;
      let services = otherServices;

      let apiRes = await updateServicesAPI({
        specialistId: specialist.id,
        services,
      });

      if (apiRes) {
        specialist = apiRes.specialist;
        session.user = specialist;
        localStorage.setItem("session", JSON.stringify(session));
      }
    } catch (error: any) {
      console.log("error while updating services", error);

      toast.error(
        error.message
          ? error.message
          : "Something went wrong, please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }

    dispatch({ type: "SET_IS_LOADING", payload: false });
  };

  // Fetch categories data on component mount
  useEffect(() => {
    let ctgrs = JSON.parse(localStorage.getItem("categories")!);

    // Save categories and select the first one
    if (ctgrs.length > 0) {
      setCategories(ctgrs);
      setSelectedCategory(ctgrs[0]);
    } else {
      // perform function if no categories found
    }
  }, []);

  // Update subcategories upon main category selection
  useEffect(() => {
    let subctgrs = JSON.parse(localStorage.getItem("sub_categories")!);

    if (subctgrs.length > 0) {
      // Selecting subcatrgories according to the selected category
      subctgrs = subctgrs.filter(
        (ctg: any) => ctg.categoryId == selectedCategory?.id
      );

      setAllSubctg(subctgrs);
    } else {
      // perform function if no subcategories found
    }
  }, [selectedCategory]);

  /**
   * UseEffect hook to getting already selected subcategories from specialist according to selected category
   * Subcategories will be filtered as whole service of specialist
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      let specialist = JSON.parse(localStorage.getItem("session")!).user;

      if (selectedCategory && specialist) {
        let selectedCategoryId = selectedCategory.id;

        let specialistSubctgs = specialist.services.filter(
          (service: any) => service.subcategory.categoryId == selectedCategoryId
        );

        if (specialistSubctgs.length > 0) {
          setSelectedServices(specialistSubctgs);
        } else {
          setSelectedServices([]);
        }
      } else {
        // perform function if there is no selected category
      }
    }
  }, [selectedCategory]);

  // UseEffect hook to filter out selected subcategories from all subcategories to show only new subcategories in selection dropdown
  useEffect(() => {
    if (selectedCategory && allSubctg.length > 0) {
      let subctgs = [];

      subctgs = allSubctg.filter((ctg) => {
        return !selectedServices.some(
          (selectedCtg: any) => ctg.id === selectedCtg.subcategory.id
        );
      });

      setNewSubctgs(subctgs);
    }
  }, [selectedCategory, allSubctg, selectedServices]);

  return (
    <div
      className={clsx(
        "w-full lg:pt-20 lg:pr-11 flex items-start justify-center gap-4",
        "max-lg:flex-col"
      )}
    >
      {/* Main categories max-md>*/}
      <span className={clsx("w-full", "max-md:hidden")}>
        <MainCategories
          categories={categories}
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </span>

      {/* DropDown Of MainCategories max-md< */}
      <span className={clsx(" hidden", " max-md:block max-md:w-full")}>
        <Dropdown
          label="All Treatments"
          search={true}
          items={categories}
          selection={""}
          itemSelection={setSelectedCategory}
          // displayKey="name" // Set displayKey to "name" to access item.name
          labelStyle={
            "w-[172px] bg-white py-[15px] px-[16px] text-500 text-sm rounded-xl border border-stroke gap-1 border-[1px]"
          }
          labelSelectedStyle={""}
          itemsContainerStyles={"top-full left-[0px] w-full"}
          iconStyle={"size-5"}
        />
      </span>

      {/* Adding sub categories section */}
      <AddSubCategories
        setSelectedServices={setSelectedServices}
        setSelectedSubCtg={setSelectedSubCtg}
        selectedCategory={selectedCategory}
        selectedServices={selectedServices}
        handleRemoveItem={handleRemoveItem}
        selectedSubCtg={selectedSubCtg}
        handleSave={handleSave}
        newSubctgs={newSubctgs}
      />
    </div>
  );
};

export default TreatmentsCategory;
