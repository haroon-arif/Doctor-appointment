import React from "react";
import clsx from "clsx";
import moment from "moment";

// Cutom files and components
import WeekSlots from "./WeekSlots";

// Define the required types for the props
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

interface WeekDate {
  date: string;
  day: string;
}

interface Props {
  timeSlots: string[];
  generateWeekDaysHeaders: () => JSX.Element;
  getFirstHalfHourSlot: (slot: string) => string;
  getSecondHalfHourSlot: (slot: string) => string;
  appointments: Appointment[];
  weekDates: WeekDate[];
  setAppointment: (slot: string, date: string) => void;
  isSlotAvailable: (date: string, day: string, slot: string) => boolean;
}

/**
 * CalendarWeekView Component
 *
 * Renders a weekly calendar with time slots and appointments, allowing users
 * to view availability and manage bookings.
 *
 * Props:
 * - `weekDates`: Array of date and day objects.
 * - `timeSlots`: Available time slots for the week.
 * - `generateWeekDaysHeaders`: Function to create weekday headers.
 * - `getFirstHalfHourSlot` & `getSecondHalfHourSlot`: Functions for half-hour slots.
 * - `appointments`: List of scheduled appointments.
 * - `setAppointment`: Function to set or update an appointment.
 * - `isSlotAvilable`: Function Check Slot is underWrokingHour not.
 *
 * Returns:
 * A `JSX.Element` representing a `div` with a grid layout of weekday headers and time slots.
 */

const CalendarWeekView = ({
  weekDates,
  timeSlots,
  generateWeekDaysHeaders,
  getFirstHalfHourSlot,
  getSecondHalfHourSlot,
  appointments,
  setAppointment,
  isSlotAvailable,
}: Props) => {
  return (
    <div
      className={clsx(
        "w-full relative top-[-20px] ",
        "flex flex-col justify-end",
        "max-lg:top-[-10px]"
      )}
    >
      <div
        className={clsx(
          " w-[95%] px-[8px] py-[6px] table-fixed border-separate border-spacing-x-[3px] border-spacing-y-[3px] bg-background-primary relative ml-auto rounded-[14px] overflow-visible",
          "max-md:ml-[49px] max-md:w-auto"
        )}
      >
        <div
          className={clsx(
            "grid grid-cols-[0px,1fr,1fr,1fr,1fr,1fr,1fr,1fr] gap-y-[1px] gap-x-1 relative auto-rows-[minmax(30px,auto)]",
            " max-md:gap-x-[2px]"
          )}
        >
          {generateWeekDaysHeaders()}

          {timeSlots?.map((slot, index) =>
            ["firstHalfHour", "secondHalfHour"].map((value, i) => (
              <React.Fragment key={i}>
                {/* it shows time slot on left */}
                {i == 0 ? (
                  <div
                    className={` h-20 w-0 ${i} -ml-1`}
                    style={{ gridRow: `span 2` }}
                  >
                    <span className="h-10 w-7 flex items-start relative left-[-50px] top-[-10px] text-400 text-[11px] ">
                      {slot}
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {/* it shows the weekslot row */}
                <WeekSlots
                  index={i}
                  weekDates={weekDates}
                  slot={slot}
                  appointments={appointments}
                  getFirstHalfHourSlot={getFirstHalfHourSlot}
                  getSecondHalfHourSlot={getSecondHalfHourSlot}
                  setAppointment={setAppointment}
                  isSlotAvailable={isSlotAvailable}
                />
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* slots show on Mobile Device */}
      <div className={clsx("w-full relative  ", "flex justify-end")}>
        <div
          className={clsx(" hidden  w-[95%] ", "max-md:block max-md:ml-[49px]")}
        >
          {weekDates.map(({ date }, index) => {
            const unixDate = moment(date, "DD-MM-YYYY").unix();
            let dailyAppointments = appointments.filter(
              (appt) => appt.metadata.date === unixDate
            );
            return (
              <>
                {dailyAppointments?.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className={clsx(
                        " bg-[#fff] p-2 flex justify-center items-start flex-col relative w-full h-[84px] rounded-lg my-[2px] ",
                        "hover:bg-background-primary"
                      )}
                    >
                      <span>
                        <p className="flex justify-center items-center rounded-[5px] text-white bg-accent text-[9px] font-bold w-fit px-1 h-fit absolute top-2 right-2">
                          <>
                            {value.metadata.slot}-
                            {moment(value.metadata.slot, "HH:mm")
                              .add(Number(value.metadata.duration), "minutes")
                              .format("HH:mm")}
                          </>
                        </p>

                        <p className="text-[11px]">
                          {value.patient.name.charAt(0).toUpperCase() +
                            value.treatment.name.slice(1)}
                        </p>
                        <p className="text-accent font-bold text-sm">
                          {value.treatment.name.charAt(0).toUpperCase() +
                            value.treatment.name.slice(1)}
                        </p>
                        <p className="text-[11px] text-400">
                          Patient:{" "}
                          <span className="font-medium text-700">
                            {value.patient.name}
                          </span>
                        </p>
                      </span>
                    </div>
                  );
                })}
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarWeekView;
