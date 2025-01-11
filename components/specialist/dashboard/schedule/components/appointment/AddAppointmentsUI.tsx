import React, { isValidElement, useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import clsx from "clsx";
// Icons
import { CalendarDays } from "lucide-react";

// Custom import and components
import StatusMessage from "@/components/UI/message/StatusMessage";
import Label from "../../../settings/components/general/Label";
import Dropdown from "@/components/UI/dropdown/Dropdown";
import CustomTimeDD from "@/components/UI/customTimeDD/CustomTimeDD";
import Button from "@/components/UI/button/Button";
import Modal from "@/components/UI/modal/Modal";
import SelectPatient from "./SelectPatient";
import AddPatient from "./AddPatient";

// Degine types
interface Treatment {
  id: "";
  name: "";
  duration: "";
  price: "";
}
interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
}
interface Message {
  type: "error" | "info" | "warn";
  message: string;
}
interface Props {
  selectedTreatment: Treatment | null;
  selectedPatient: Patient | null;
  newPatient: Patient | null;
  message: Message | null;
  durationError: string;
  treatments: Treatment[] | null;
  allPatients: Patient[];
  addPat: boolean;
  selectedDate: any;
  formatedDate: any;
  selectedDay: any;
  timeSlots: any[];
  aptDuration: string;
  selectedSlot: any;
  setSelectedSlot: any;
  handlePatientSelection: (patient: Patient) => void;
  handleTreatmentSelection: (treatment: Treatment) => void;
  handleShowAddApt: () => void;
  toggleAddPatient: () => void;
  handleSave: () => void;
  setAllPatients: any;
  setNewPatient: any;
  setAptDuration: any;
  handleDateChange: (value: any) => void;
  handleBlur: () => void;
  customSlots: string[];
  isOverLap: (time: string) => boolean;
  addTimeSlot: (time: string) => void;
}

/**
 * This component handles add appointment UI
 *
 * @returns {JSX.Element} - renders add appointment UI
 */
const AddAppointmentsUI = ({
  selectedTreatment,
  selectedPatient,
  allPatients,
  treatments,
  newPatient,
  message,
  durationError,
  addPat,
  selectedDate,
  aptDuration,
  formatedDate,
  selectedDay,
  timeSlots,
  selectedSlot,
  setSelectedSlot,
  handleTreatmentSelection,
  handlePatientSelection,
  handleShowAddApt,
  toggleAddPatient,
  setAllPatients,
  setNewPatient,
  setAptDuration,
  handleSave,
  handleDateChange,
  handleBlur,
  customSlots,
  isOverLap,
  addTimeSlot,
}: Props) => {
  // React states
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  // Hooks
  const calendarRef = useRef<HTMLInputElement>(null);

  /**
   * UseEfect to handle caledar visibility
   */
  useEffect(() => {
    if (showCalendar) {
      setShowCalendar(!showCalendar);
    }
  }, [selectedDay]);

  return (
    <Modal
      header="Add an appointment"
      close={handleShowAddApt}
      className={`${showCalendar ? "h-full" : ""} `}
      modalWidth={592}
    >
      {/* Add apppointment UI */}
      <div
        className={clsx(
          "w-full flex flex-col items-start justify-center gap-4"
        )}
      >
        {/* Select treatment */}
        <div className="w-full flex flex-col items-start justify-center gap-[5px]">
          <Label label="Treatment" className="font-medium" />
          <Dropdown
            label="Select Treatment"
            search={true}
            items={treatments
              ?.map((trt) => ({
                key: trt.id,
                value: trt.name,
              }))
              .sort((a, b) => a.value.localeCompare(b.value))}
            selection={selectedTreatment ? selectedTreatment.name : ""}
            itemSelection={(item: any) => {
              let trt: Treatment | undefined = treatments?.filter(
                (trt: Treatment) => trt.name == item.value
              )[0];
              if (trt) handleTreatmentSelection(trt);
            }}
            labelStyle={
              "w-full bg-white py-[14px] px-4 text-500 text-sm rounded-xl border border-stroke gap-1 border-[1px]"
            }
            itemsContainerStyles={"top-full left-[0px] w-full"}
            iconStyle={"size-5"}
          />
        </div>

        {/* Appointment date */}
        <div className="w-full relative flex flex-col items-start justify-center gap-[5px]">
          <div className="w-full flex flex-col items-start justify-center gap-[5px]">
            <Label label="Date" className="font-medium" />
            <div
              onClick={() => {
                if (calendarRef.current) {
                  calendarRef.current.showPicker();
                }
                setShowCalendar((prev) => !prev);
              }}
              className={clsx(
                "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-500 relative",
                "flex items-center justify-between",
                "border border-stroke cursor-pointer hover:bg-background-lite/50",
                "transition-all duration-300 capitalize"
              )}
            >
              <span>
                {formatedDate
                  ? `${
                      selectedDay == moment().format("dddd").toLocaleLowerCase()
                        ? "Today"
                        : selectedDay
                    } - ${formatedDate}`
                  : "Select Appointment Date"}
              </span>
              <CalendarDays className="size-5 text-300" />
              {/* custom Calendar */}
              {showCalendar && (
                <div
                  className="absolute z-10 bottom-0 right-0 top-full"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Calendar
                    onChange={(value) => {
                      handleDateChange(value);
                      setShowCalendar((prev) => !prev);
                    }}
                    value={moment().startOf("day").toDate()}
                    className={clsx(
                      "custom-calendar mx-auto pb-2",
                      " !w-80 !p-1 mt-[2px]",
                      " max-md:!p-0 max-md:!pb-2 "
                    )}
                    tileClassName=" !px-[1px] !w-2"
                    formatShortWeekday={(locale, date) =>
                      date
                        .toLocaleDateString(locale, { weekday: "short" })
                        .slice(0, 2)
                    }
                    formatMonthYear={(locale, date) =>
                      date.toLocaleDateString(locale, {
                        month: "short",
                        year: "numeric",
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time */}
        {timeSlots.length > 0 && (
          <div className="w-full relative flex flex-col items-start justify-center gap-[5px]">
            <Label label="Time" className="font-medium" />

            <div className="w-full flex flex-wrap items-center justify-start gap-2 ">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedSlot(slot);
                  }}
                  className={clsx(
                    "px-[16px] py-[7.5px] text-[11px] leading-[17px] tracking-[0.22px] font-medium rounded-xl border border-stroke cursor-pointer ",
                    "transition-all duration-300",
                    selectedSlot?.time == slot.time
                      ? "bg-accent text-white"
                      : "hover:bg-background-lite/50 text-700",
                    slot?.isBooked || slot?.isPassed
                      ? "pointer-events-none opacity-50"
                      : "pointer-events-auto opacity-100"
                  )}
                >
                  {slot.time}
                </div>
              ))}

              <div
                className={clsx(
                  "tracking-[0.22px] w-[150px] font-medium rounded-xl border border-stroke cursor-pointer",
                  "transition-all duration-300"
                )}
              >
                {customSlots.length > 0 && (
                  <CustomTimeDD
                    label="Custom Slot"
                    items={customSlots?.map((hour: any) => ({
                      key: hour,
                      value: hour,
                    }))}
                    selection={selectedSlot ? selectedSlot?.time : "slot"}
                    itemSelection={(selectedHour: any) => {
                      addTimeSlot(selectedHour.value);
                    }}
                    isOverLap={isOverLap}
                    selectedDate={selectedDate}
                    labelStyle={
                      "w-full bg-white text-500 text-sm rounded-xl border border-stroke gap-1 border-[1px]  !bg-transparent border-none rounded-none !px-[16px] !py-[7.5px] !text-[11px] !leading-[17px] text-700"
                    }
                    itemsContainerStyles={"top-full left-[0px] w-full"}
                    iconStyle={"size-5"}
                  />
                )}
              </div>
              {/* dropdown end */}
            </div>
          </div>
        )}

        {/* Duration */}
        {true && (
          <div className="w-full relative flex flex-col items-start justify-center gap-[5px]">
            <Label
              label="Appointment Duration (In minutes)"
              className="font-medium"
            />

            <div className="flex items-center justify-start gap-3">
              <div
                className={clsx(
                  "w-[200px] py-[14px] px-4 bg-white rounded-xl text-sm text-500",
                  "border border-stroke"
                )}
              >
                <input
                  className="appearance-none h-full w-full outline-none"
                  type="number"
                  min={15}
                  max={240}
                  value={aptDuration}
                  onChange={(e) => {
                    setAptDuration(e.target.value);
                  }}
                  onBlur={handleBlur} // Trigger validation when input loses focus
                />
              </div>
              {/* Show validation error */}
              {durationError && (
                <span className="my-3  flex items-center justify-start gap-3 font-medium tracking-[0.22px] bg-red-300 text-red-600 bg-transparent text-[13px] opacity-80">
                  {durationError}
                </span>
              )}{" "}
            </div>
          </div>
        )}

        {!addPat ? (
          <SelectPatient
            allPatients={allPatients}
            selectedPatient={selectedPatient}
            handlePatientSelection={handlePatientSelection}
            toggleAddPatient={toggleAddPatient}
          />
        ) : (
          <AddPatient
            toggleAddPatient={toggleAddPatient}
            setNewPatient={setNewPatient}
            newPatient={newPatient}
          />
        )}
      </div>

      {message && (
        <div className="w-full mt-10">
          <StatusMessage
            message={message.message}
            type={message.type}
            size="sm"
          />
        </div>
      )}

      {/* Footer */}
      <div className={clsx("w-full pt-6 flex items-center justify-end gap-2")}>
        {/* Action buttons */}
        <div
          className={clsx(
            "w-[40%] flex items-center justify-end gap-2",
            "max-md:w-full"
          )}
        >
          <Button
            onClick={handleShowAddApt}
            bg="transparent"
            className="py-4 px-6"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} bg="fill" className={`py-4 px-6`}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddAppointmentsUI;
