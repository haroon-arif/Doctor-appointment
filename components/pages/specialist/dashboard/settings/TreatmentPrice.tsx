"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import _ from "lodash";

// Import components and utilities
import { updateServicesAPI } from "@/components/utilis/api/specialistApi";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import AddTreatments from "./components/price/AddTreatments";
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
interface Treatment {
  id: string;
  name: string;
  price: string;
  duration: string;
  [key: string]: any;
}
interface ShowTreatment {
  [key: number]: boolean;
}
interface Service {
  subcategory: SubCategory;
  treatments: Treatment[];
}

/**
 * Price component to add treatments price and duration
 *
 * @returns {JSX.Element} The rendered component containing price information.
 */
const TreatmentPrice = () => {
  // Reacr states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [showTreatments, setShowTreatments] = useState<ShowTreatment>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Hooks
  const { dispatch } = useAppHook();

  /**
   * Handles the removal of a treatment from a specific service.
   *
   * @param {number} serviceIndex - The index of the service from which the treatment should be removed.
   * @param {any} trtId - The ID of the treatment to be removed.
   *
   * @returns {void}
   */
  const handleRemoveItem = (serviceIndex: any, trtId: any) => {
    let services = [...selectedServices];
    let treatments = services[serviceIndex].treatments;

    treatments = treatments.filter((trt) => trt.id != trtId);
    services[serviceIndex].treatments = treatments;

    setSelectedServices(services);
  };

  /**
   * Handles the addition of a new blank treatment to a specific service.
   *
   * @param {number} serviceIndex - The index of the service to which a new treatment is being added.
   *
   * @returns {void}
   */
  const handleAddItem = (serviceIndex: any) => {
    let services = [...selectedServices];

    // Validations
    if (
      services[serviceIndex].treatments[
        services[serviceIndex].treatments.length - 1
      ].name.trim() == ""
    ) {
      setErrorMessage("Please add name");
      return;
    } else if (
      services[serviceIndex].treatments[
        services[serviceIndex].treatments.length - 1
      ].duration.trim() == ""
    ) {
      setErrorMessage("Please add duration");
      return;
    } else if (
      services[serviceIndex].treatments[
        services[serviceIndex].treatments.length - 1
      ].price.trim() == ""
    ) {
      setErrorMessage("Please add price");
      return;
    } else {
      setErrorMessage("");
    }

    // Addin new blank treatment
    services[serviceIndex].treatments.push({
      id: uuidv4(),
      name: "",
      duration: "",
      price: "",
    });

    setSelectedServices(services);
  };

  /**
   * Handles the input change for a specific treatment within a service.
   *
   * @param {number} serviceIndex - The index of the service that contains the treatment being modified.
   * @param {any} trtId - The ID of the treatment being updated.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object
   *
   * @returns {void}
   */
  const handleInput = (
    serviceIndex: any,
    trtId: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let services = [...selectedServices];
    let { name, value } = e.target;

    // Remove symbols and checks for invalid input
    if (name == "price") {
      value = value.replace("€ ", "");
      const numericValue = parseFloat(value.trim());

      if (isNaN(numericValue)) {
        return;
      }
    }

    services[serviceIndex].treatments.forEach((trt: Treatment) => {
      if (trt.id == trtId) {
        trt[name] = value;
      }
    });

    setSelectedServices(services);
  };

  /**
   * Handles the selection of duration for a specific treatment within a service.
   *
   * @param {any} duration - The selected duration to be assigned to the treatment.
   * @param {number} serviceIndex - The index of the service containing the treatment.
   * @param {any} trtId - The ID of the treatment being updated.
   *
   * @returns {void}
   */
  const handleDurationSelection = (
    duration: any,
    serviceIndex: any,
    trtId: any
  ) => {
    let services = [...selectedServices];

    services[serviceIndex].treatments.forEach((trt: Treatment) => {
      if (trt.id == trtId) {
        trt.duration = duration;
      }
    });

    setSelectedServices(services);
  };

  const validations = (services: Service[]) => {
    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      for (let j = 0; j < service.treatments.length; j++) {
        const trt = service.treatments[j];

        if (trt.name.trim() == "") {
          setErrorMessage(`Name cannot be empty at ${j + 1} row`);
          return false;
        } else if (trt.duration.trim() == "") {
          setErrorMessage(`Duration cannot be empty at ${j + 1} row`);
          return false;
        } else if (trt?.price?.trim() == "") {
          setErrorMessage(`Price cannot be empty at ${j + 1} row`);
          return false;
        }
      }
    }

    setErrorMessage("");
    return true;
  };

  /**
   * Handles the saving of selected services and treatments for a specialist.
   *
   * @returns {void}
   */
  const handleSave = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });

    try {
      let session = JSON.parse(localStorage.getItem("session")!);
      let specialist = session.user;

      // Filter subcategories from services which are not related to the selected category to avoid duplication
      let otherServices = specialist.services.filter(
        (service: Service) =>
          service.subcategory.categoryId !== selectedCategory?.id
      );

      // Removing blank treatment fields
      let tempServices = _.cloneDeep(selectedServices);
      tempServices.forEach((service) => {
        service.treatments.pop();
      });

      // Validations
      if (!validations(tempServices)) {
        return;
      }

      otherServices.push(...tempServices);
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

  /**
   * UseEffect hook to getting already selected subcategories from specialist according to selected category
   * Subcategories will be filtered as whole service of specialist
   * Also adding a blank item for adding new tretament
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);
      let specialist = session.user;

      if (selectedCategory && specialist) {
        let selectedCategoryId = selectedCategory.id;

        let services = specialist.services.filter(
          (service: any) => service.subcategory.categoryId == selectedCategoryId
        );

        // Adding a blank treatment field at the end of each so user can add new treatment
        if (services.length > 0) {
          services.forEach((service: any) => {
            service.treatments.push({
              id: uuidv4(),
              name: "",
              duration: "",
              price: "",
            });
          });

          setSelectedServices(services);
        } else {
          setSelectedServices([]);
        }
      } else {
        // perform function if there is no selected category
      }
    }
  }, [selectedCategory]);

  return (
    <div
      className={clsx(
        "w-full pt-20 pr-11 flex items-start justify-center gap-4",
        "max-lg:pt-0 max-lg:pr-0 max-lg:flex-col "
      )}
    >
      {/* Main categories max-md>*/}
      <span className={clsx(" w-full", "max-md:hidden")}>
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
          labelStyle={
            "w-[172px] bg-white py-[15px] px-[16px] text-500 text-sm rounded-xl border border-stroke gap-1 border-[1px]"
          }
          labelSelectedStyle={""}
          itemsContainerStyles={"top-full left-[0px] w-full"}
          iconStyle={"size-5"}
        />
      </span>
      {/* Adding new treatments subcategories */}
      <AddTreatments
        selectedServices={selectedServices}
        showTreatments={showTreatments}
        setShowTreatments={setShowTreatments}
        errorMessage={errorMessage}
        handleSave={handleSave}
        handleRemoveItem={handleRemoveItem}
        handleAddItem={handleAddItem}
        handleInput={handleInput}
        handleDurationSelection={handleDurationSelection}
      />
    </div>
  );
};

export default TreatmentPrice;
