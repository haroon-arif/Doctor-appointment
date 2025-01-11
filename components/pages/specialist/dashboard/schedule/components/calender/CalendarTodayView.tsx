import React, { useEffect, useState } from "react";
import clsx from "clsx";
import moment from "moment";

// Custom file and component imports
import FindAppointment from "./FindAppointment";

// define types
interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Treatment {
  id: number;
  name: string;
  duration: string;
  price: string;
}

interface Metadata {
  slot: string;
  date: number;
  duration: string;
}

interface Appointment {
  specialist: string;
  patient: Patient;
  treatment: Treatment;
  metadata: Metadata;
}

interface Props {
  offdays: string[];
  timeSlots: string[];
  getFirstHalfHourSlot: (slot: string) => string;
  getSecondHalfHourSlot: (slot: string) => string;
  appointments: Appointment[];
  setAppointment: (slot: string, date: string) => void;
  isSlotAvailable: (date: string, day: string, slot: string) => boolean;
}
/**
 * CalendarDayView component renders a day's calendar view with available time slots,
 * off days, and appointments. It displays the day's name, date, and time slots for
 * scheduling appointments.
 *
 * Props:
 * - `timeSlots`: Array of available time slots for the day.
 * - `offdays`: Array of off days.
 * - `getFirstHalfHourSlot`: Function to get the first half-hour slot.
 * - `getSecondHalfHourSlot`: Function to get the second half-hour slot.
 * - `getCompleteDayDate`: Function to get the complete date for the day.
 * - `appointments`: Array of existing appointments.
 * - `setAppointment`: Function to set the selected appointment.
 * - `isSlotAvailable`: function that will return if the slot is underworking hours or not
 *
 *
 * @returns {JSX.Element} A JSX element representing the calendar day's view.
 */
const CalendarTodayView = ({
  timeSlots,
  offdays,
  getFirstHalfHourSlot,
  getSecondHalfHourSlot,
  appointments,
  setAppointment,
  isSlotAvailable,
}: Props) => {
  return (
    <div className="flex w-full justify-end">
      <div
        className={clsx(
          "pr-2 col-span-1 w-[95%] bg-[#F3F6FF] relative top-[-20px] p-[6px] gap-1 rounded-[14px]",
          "max-lg:top-[-10px]",
          "max-md:ml-[49px]"
        )}
      >
        {/* grid start  */}
        <div className="grid grid-cols-[0px_1fr] gap-[1px]">
          <div className="empty-slot"></div>
          <div
            className={clsx(
              "flex w-full relative justify-center items-center bg-[#FFF] p-[8px] rounded-lg mb-[4px] bg-background-gradiant text-accent",
              offdays.includes(moment().format("dddd").toLowerCase())
                ? "bg-[#ffffff80] text-300"
                : ""
            )}
          >
            <div className="flex w-full relative justify-center items-center rounded-lg flex-col">
              <span className="font-bold">{moment().format("DD")}</span>
              <span>
                {window.innerWidth < 768
                  ? moment().format("dddd").slice(0, 3)
                  : moment().format("dddd")}
              </span>
            </div>
          </div>
          {timeSlots.map((slot, index) => (
            <React.Fragment key={index}>
              <div
                className="h-10 flex items-start relative left-[-53px] top-[-10px] text-400 text-[11px] min-h-16"
                style={{ gridRow: "span 2" }}
              >
                {slot.split(" - ")[0]}
              </div>
              {["firstHalfHour", "secondHalfHour"].map((value, i) => {
                const inputDate: string = moment().format("DD-MM-YYYY");
                let inputSlot = ""; // "09:00 - 09:30"
                if (i == 0) {
                  inputSlot = getFirstHalfHourSlot(slot); // "09:00 - 09:30"
                } else if (i == 1) {
                  inputSlot = getSecondHalfHourSlot(slot); // "09:00 - 09:30"
                }
                const firstinputslot = getFirstHalfHourSlot(slot);
                const secondinputslot = getSecondHalfHourSlot(slot);

                const isTimePassed = moment(
                  `${inputDate} ${slot}`,
                  "DD-MM-YYYY HH:mm"
                ).isBefore(moment())
                  ? "pointer-events-none" // Example class if time is past
                  : "";

                // Check if an appointment exists
                const result = FindAppointment(
                  appointments,
                  inputDate,
                  inputSlot
                );

                // Return patient details if result is an object
                if (typeof result === "object") {
                  const duration = Number(result.metadata.duration);
                  return (
                    <div
                      key={`${index}-${i}`}
                      className={` bg-[#fff] p-3 flex justify-center items-start flex-col rounded-lg mt-[1px] relative hover:shadow ${
                        isTimePassed
                          ? " pointer-events-none bg-background-disable"
                          : ""
                      } ${
                        moment(result.metadata.slot, "HH:mm")
                          .add(Number(result.metadata.duration), "minutes")
                          .format("HH:mm")
                          .slice(-2) === "30"
                          ? ""
                          : "mb-[3px]"
                      }`}
                      style={{
                        gridRow: `span ${duration / 30}`,
                      }}
                    >
                      <span className="pl-[50px]">
                        <p className="flex justify-center items-center rounded-[5px] text-white bg-accent text-[9px] font-bold w-fit px-1 h-fit absolute top-2 right-2">
                          {i == 0 ? (
                            <>
                              {slot}-
                              {moment(slot, "HH:mm")
                                .add(
                                  Number(result.metadata.duration),
                                  "minutes"
                                )
                                .format("HH:mm")}
                            </>
                          ) : (
                            <>
                              {moment(slot, "HH:mm")
                                .add(30, "minutes")
                                .format("HH:mm")}
                              -
                              {moment(slot, "HH:mm")
                                .add(
                                  Number(result.metadata.duration) + 30,
                                  "minutes"
                                )
                                .format("HH:mm")}
                            </>
                          )}
                        </p>

                        <p className="text-[11px]">
                          {result.patient.name.charAt(0).toUpperCase() +
                            result.treatment.name.slice(1)}
                        </p>
                        <p className="text-accent font-bold text-sm">
                          {result.treatment.name.charAt(0).toUpperCase() +
                            result.treatment.name.slice(1)}
                        </p>
                        <p className="text-[11px] text-400">
                          Patient:{" "}
                          <span className="font-medium text-700">
                            {result.patient.name}
                          </span>
                        </p>
                      </span>
                    </div>
                  );
                } else if (result === "under") {
                  // Return empty space if the slot is under the booked slot
                  return null;
                } else {
                  let isAppointmentBooked: any = true;
                  if (i == 0) {
                    isAppointmentBooked = FindAppointment(
                      appointments,
                      inputDate,
                      secondinputslot
                    );
                  } else if (i == 1) {
                    isAppointmentBooked = FindAppointment(
                      appointments,
                      inputDate,
                      firstinputslot
                    );
                    if (isAppointmentBooked == false) return null;
                  }

                  if (
                    !isSlotAvailable(inputDate, moment().format("dddd"), slot)
                  ) {
                    return (
                      <div
                        className={clsx(
                          "bg-[#6a6a6a05] py-[8px] flex justify-center items-center rounded-lg pointer-events-none",
                          isAppointmentBooked
                            ? index == 1 && "mb-[3px]"
                            : "mb-[3px]"
                        )}
                        key={`${index}-${i}`}
                        style={{
                          gridRow: `span ${isAppointmentBooked ? "1" : "2"}`,
                        }}
                      >
                        <span className="text-gray-400 text-[11px]">
                          Not Available
                        </span>
                      </div>
                    );
                  }
                  // Return the button to add an appointment if no appointment exists
                  return (
                    <>
                      <div
                        key={`${index}-${i}`}
                        className={clsx(
                          "bg-[#ffffffbf] py-[8px] flex justify-center items-center rounded-lg relative ",
                          isTimePassed
                            ? " pointer-events-none bg-background-disable"
                            : "",
                          isAppointmentBooked
                            ? index == 1 && "mb-[3px]"
                            : "mb-[3px]"
                        )}
                        onClick={() => {
                          if (i == 0) {
                            setAppointment(slot, inputDate);
                          }
                        }}
                        style={{
                          gridRow: `span ${isAppointmentBooked ? "1" : "2"}`,
                        }}
                      >
                        <span className="hover:bg-[#6968EC] hover:text-white text-[#6968EC] rounded-full px-[8px] flex justify-center items-center text-3xl font-normal cursor-pointer h-7 w-7">
                          {isTimePassed === "" ? "+" : ""}
                        </span>
                      </div>
                    </>
                  );
                }
              })}
            </React.Fragment>
          ))}
        </div>
        {/* grid end  */}
      </div>
    </div>
  );
};

export default CalendarTodayView;
