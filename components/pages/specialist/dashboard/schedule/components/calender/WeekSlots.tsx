import React from "react";
import moment from "moment";
import clsx from "clsx";

// Import components and utilites
import Image from "next/image";

// Custom file and component imports
import FindAppointment from "./FindAppointment";
import banicon from "@/public/specialist/calendar/banIcon.svg";

// Defint types
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
  index: Number;
  weekDates: { day: string; date: string }[];
  slot: string;
  appointments: Appointment[];
  isSlotAvailable: (date: string, day: string, slot: string) => boolean;
  getFirstHalfHourSlot: (slot: string) => string;
  getSecondHalfHourSlot: (slot: string) => string;
  setAppointment: (slot: string, date: string) => void;
}

/**
 * WeekSlots component:
 * Renders the time slots for a given day and shows the status of availability.
 * - Displays patient information if an appointment exists.
 * - Handles both available and unavailable slot statuses.
 * - Uses helper functions to determine half-hour slots.
 */
const WeekSlots = ({
  index,
  weekDates,
  slot,
  appointments,
  getFirstHalfHourSlot,
  getSecondHalfHourSlot,
  setAppointment,
  isSlotAvailable,
}: Props) => {
  return (
    <>
      {weekDates?.map(({ day, date }, index2) => {
        let inputSlot = ""; // "09:00 - 09:30"
        if (index == 0) {
          inputSlot = getFirstHalfHourSlot(slot); // "09:00 - 09:30"
        } else if (index == 1) {
          inputSlot = getSecondHalfHourSlot(slot); // "09:00 - 09:30"
        }
        const firstinputslot = getFirstHalfHourSlot(slot);
        const secondinputslot = getSecondHalfHourSlot(slot);
        day = day.toLowerCase();
        const isTimePassed = moment(
          `${date} ${slot}`,
          "DD-MM-YYYY HH:mm"
        ).isBefore(moment())
          ? "pointer-events-none"
          : "";
        // Find if there is an appointment for the current slot.
        const result = FindAppointment(appointments, date, inputSlot);
        // If an appointment exists, render patient and appointment details.
        if (typeof result === "object" && result != null) {
          const duration = Number(result.metadata.duration);

          return (
            <div
              key={index2}
              className={clsx(
                "bg-[#fff] p-2 flex justify-end items-start flex-col rounded-lg relative hover:shadow overflow-hidden",
                isTimePassed
                  ? " pointer-events-none bg-background-disable"
                  : "",
                moment(result.metadata.slot, "HH:mm")
                  .add(duration, "minutes")
                  .format("HH:mm")
                  .slice(-2) === "30"
                  ? ""
                  : "mb-[3px]"
              )}
              style={{ gridRow: `span ${duration / 30}` }}
            >
              <span
                className={clsx(
                  "hidden",
                  "max-md:block max-md:absolute max-md:inset-0 max-md:bg-accent"
                )}
              ></span>
              <span
                className={clsx(
                  "w-full",
                  "max-md:leading-normal max-md:hidden"
                )}
              >
                <p
                  className={clsx("text-[11px] text-700", "max-md:text-[7px]")}
                >
                  {" "}
                  {result.patient.name.charAt(0).toUpperCase() +
                    result.patient.name.slice(1)}
                </p>
                <p
                  className={clsx(
                    "text-accent  text-[11px] overflow-hidden whitespace-nowrap text-ellipsis w-[100%] font-medium",
                    "max-md:text-[7px]"
                  )}
                >
                  {/* {result.treatment.name} */}
                  {result.treatment.name.charAt(0).toUpperCase() +
                    result.treatment.name.slice(1)}
                </p>
                <p
                  className={clsx(
                    "flex justify-center items-center rounded-[5px] text-white bg-accent text-[9px] font-bold w-fit px-1 h-fit absolute top-1 right-1",
                    "max-md:text-[7px]"
                  )}
                >
                  {result.metadata.slot} -{" "}
                  {moment(result.metadata.slot, "HH:mm")
                    .add(duration, "minutes")
                    .format("HH:mm")}
                </p>
              </span>
            </div>
          );
        }

        // If the slot is under an existing appointment's duration, skip rendering.
        if (result === "under") {
          return null;
        }

        // Render an 'Add Appointment' button for available slots.
        else {
          let isAppointmentBooked: any = true;
          if (index == 0) {
            isAppointmentBooked = FindAppointment(
              appointments,
              date,
              secondinputslot
            );
          } else if (index == 1) {
            isAppointmentBooked = FindAppointment(
              appointments,
              date,
              firstinputslot
            );
            if (isAppointmentBooked == false) return null;
          }

          // If the slot is unavailable(means the hour is under the break or day is off), render a disabled message.
          if (!isSlotAvailable(date, day, slot)) {
            return (
              <div
                className={clsx(
                  "bg-[#6a6a6a05] py-2 flex justify-center items-center rounded-lg pointer-events-none relative",
                  isAppointmentBooked ? index == 1 && "mb-[3px]" : "mb-[3px]"
                )}
                key={index2}
                style={{ gridRow: `span ${isAppointmentBooked ? "1" : "2"}` }}
              >
                <span className="text-gray-400 text-[11px]">
                  <span className={clsx(" hidden", " max-md:inline")}>
                    <Image
                      src={banicon}
                      width={11}
                      height={11}
                      alt="Picture of the banicon"
                    />
                  </span>
                  <span className=" max-md:hidden">Not Available</span>
                </span>
              </div>
            );
          }
          // return add appointment button for furure time
          return (
            <div
              key={index2}
              className={`bg-[#ffffffbf] py-2 flex justify-center items-center rounded-lg relative ${
                isTimePassed ? " pointer-events-none bg-background-disable" : ""
              } ${isAppointmentBooked ? index == 1 && "mb-[3px]" : "mb-[3px]"}`}
              onClick={() => {
                if (index == 0) {
                  setAppointment(slot, date);
                }
              }}
              style={{ gridRow: `span ${isAppointmentBooked ? "1" : "2"}` }}
            >
              <span className="hover:bg-accent hover:text-white text-accent rounded-full px-[8px] flex justify-center items-center text-3xl font-normal cursor-pointer h-7 w-7">
                {isTimePassed == "" && "+"}
              </span>
            </div>
          );
        }
      })}
    </>
  );
};

export default WeekSlots;
