import StatusMessage from "@/components/UI/message/StatusMessage";
import clsx from "clsx";
import { Minus, Plus } from "lucide-react";
import React from "react";
import TreatmentLabel from "./TreatmentLabel";
import SelectedTreatmentItem from "./SelectedTreatmentItem";
import Button from "@/components/UI/button/Button";

// Define types
interface Category {
  id: number;
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
interface Props {
  selectedServices: Service[];
  showTreatments: ShowTreatment;
  errorMessage: string;
  setShowTreatments: any;
  handleSave: () => void;
  handleRemoveItem: (serviceIndex: any, trtId: any) => void;
  handleAddItem: (serviceIndex: any) => void;
  handleInput: (
    serviceIndex: any,
    trtId: any,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleDurationSelection: (
    duration: any,
    serviceIndex: any,
    trtId: any
  ) => void;
}

/**
 * Component for adding treatments to selected services.
 *
 * @param {Array<Service>} selectedServices - The currently selected services that treatments can be added to.
 * @param {boolean} showTreatments - A flag to control the visibility of the treatments list.
 * @param {Function} setShowTreatments - A function to update the visibility state of the treatments list.
 * @param {string} errorMessage - A message indicating any input errors related to treatments.
 * @param {Function} handleSave - A function to save the added treatments to the selected services.
 * @param {Function} handleRemoveItem - A function to remove a treatment from a service.
 * @param {Function} handleAddItem - A function to add a new treatment to a service.
 * @param {Function} handleInput - A function to handle input changes for treatment details.
 * @param {Function} handleDurationSelection - A function to handle duration selection for treatments.
 *
 * @returns {JSX.Element} - A JSX element representing the AddTreatments component.
 */
const AddTreatments = ({
  selectedServices,
  showTreatments,
  setShowTreatments,
  errorMessage,
  handleSave,
  handleRemoveItem,
  handleAddItem,
  handleInput,
  handleDurationSelection,
}: Props) => {
  return (
    <div
      className={clsx(
        "w-[45rem] mt-8 flex flex-col items-start justify-start gap-3",
        "max-lg:w-full"
      )}
    >
      {/* If no subcategories have been selected for current category */}
      {selectedServices.length < 1 && (
        <StatusMessage
          message={"Please add treatments to adjust their prices"}
          type="info"
          size="lg"
        />
      )}

      {selectedServices.map((service, serviceIndex) => (
        <div
          key={serviceIndex}
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
            <div
              className={clsx(
                "w-full text-700 text-[0.77rem] font-semibold",
                "flex items-center justify-between"
              )}
            >
              <span>
                {service?.subcategory.name} ({service.treatments.length - 1})
              </span>
              {showTreatments[serviceIndex] && (
                <Minus
                  onClick={() =>
                    setShowTreatments((prev: any) => ({
                      ...prev,
                      [serviceIndex]: false,
                    }))
                  }
                  className={clsx(
                    "opacity-70",
                    "hover:opacity-100 cursor-pointer",
                    "transition-all duration-300"
                  )}
                />
              )}
              {!showTreatments[serviceIndex] && (
                <Plus
                  onClick={() =>
                    setShowTreatments((prev: any) => ({
                      ...prev,
                      [serviceIndex]: true,
                    }))
                  }
                  strokeWidth={2}
                  className={clsx(
                    "text-accent size-6 cursor-pointer",
                    "opacity-70",
                    "hover:opacity-100 cursor-pointer",
                    "transition-all duration-300"
                  )}
                />
              )}
            </div>

            {showTreatments[serviceIndex] && (
              <div
                className={clsx(
                  "w-full mb-[0.6rem] relative flex items-center"
                )}
              >
                <TreatmentLabel label="Treatments" className="absolute" />
                <TreatmentLabel
                  label="Duration"
                  className="absolute right-44"
                />
                <TreatmentLabel label="Price" className="absolute right-14" />
              </div>
            )}
          </div>

          {/* Selected treatments */}
          {service?.treatments.length > 0 && showTreatments[serviceIndex] && (
            <div
              className={clsx(
                "w-full rounded-xl bg-white",
                "flex flex-col items-center self-stretch",
                "border border-stroke",
                "transition-all duration-300"
              )}
            >
              {/* Single item */}
              {service?.treatments.map((item: Treatment, index: number) => (
                <SelectedTreatmentItem
                  serviceIndex={serviceIndex}
                  item={item}
                  isLastItem={index == service?.treatments.length - 1}
                  removeItem={handleRemoveItem}
                  addItem={handleAddItem}
                  handleInput={handleInput}
                  handleDurationSelection={handleDurationSelection}
                />
              ))}
            </div>
          )}

          {errorMessage && showTreatments[serviceIndex] && (
            <StatusMessage message={errorMessage} type="error" size="sm" />
          )}

          {/* Action buttons */}
          {showTreatments[serviceIndex] && (
            <div
              className={clsx(
                "w-full px-3 py-2 mt-2 flex items-center justify-start gap-2"
              )}
            >
              <Button bg="transparent" className="py-3 px-6">
                Cancel
              </Button>
              <Button onClick={handleSave} bg="fill" className="py-3 px-6">
                Save
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddTreatments;
