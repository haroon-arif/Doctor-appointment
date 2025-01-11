import clsx from "clsx";
import React from "react";
import Label from "../../../settings/components/general/Label";

// Degine types
interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
}
interface Props {
  toggleAddPatient: () => void;
  setNewPatient: any;
  newPatient: Patient | null;
}

/**
 * Component to handle adding new patient logic and its UI
 *
 * @returns {JSX.Element} - renders component UI
 */
const AddPatient = ({ toggleAddPatient, setNewPatient, newPatient }: Props) => {
  /**
   *
   * @param field
   * @param value
   */
  const handleInput = (field: string, value: string) => {
    setNewPatient((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4">
      {/* Top border */}
      <span className="w-full h-[1px] bg-stroke/50"></span>

      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <div className="text-[15px] font-semibold text-800 leading-[15px]">
          Add new patient
        </div>
        <button
          onClick={toggleAddPatient}
          className="text-xs text-accent/90 hover:text-accent/100 font-bold transition-all duration-300"
        >
          Find Existing
        </button>
      </div>

      {/* Form */}
      <div className="w-full flex flex-col items-center justify-start gap-4">
        {/* Name */}
        <div
          className={clsx(
            "w-full flex flex-col items-start justify-start gap-[5px]"
          )}
        >
          <Label label="Patient Name" className="font-medium" />

          <input
            type="text"
            placeholder="Type Patient Name"
            value={newPatient?.name}
            onChange={(e) => handleInput(e.target.name, e.target.value)}
            name="name"
            className={clsx(
              "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-500",
              "outline-none border border-stroke focus-within:border-accent",
              "transition-all duration-300"
            )}
          />
        </div>

        {/* Email */}
        <div
          className={clsx(
            "w-full flex flex-col items-start justify-start gap-[5px]"
          )}
        >
          <Label label="Email" className="font-medium" />

          <input
            type="email"
            placeholder="Type Email"
            value={newPatient?.email}
            onChange={(e) => handleInput(e.target.name, e.target.value)}
            name="email"
            className={clsx(
              "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-500",
              "outline-none border border-stroke focus-within:border-accent",
              "transition-all duration-300"
            )}
          />
        </div>

        {/* Phone */}
        <div
          className={clsx(
            "w-full flex flex-col items-start justify-start gap-[5px]"
          )}
        >
          <Label label="Phone" className="font-medium" />

          <input
            type="text"
            placeholder="Type Phone Number"
            value={newPatient?.phone}
            onChange={(e) => handleInput(e.target.name, e.target.value)}
            name="phone"
            className={clsx(
              "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-500",
              "outline-none border border-stroke focus-within:border-accent",
              "transition-all duration-300"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
