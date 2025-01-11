import React, { useState } from "react";
import moment from "moment";
import clsx from "clsx";

// Defint types
interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// interface define
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

interface CalendarDate {
  day: string;
  date: number | null;
}

interface Props {
  calenderDates: CalendarDate[];
  offdays: string[];
  appointments: Appointment[];
  isFutureOrToday: (dateStr: string) => boolean;
  handleDateClick: (date: string) => void;
}

/**
 * CalendarMonthView Component
 *
 * Displays a monthly calendar with date boxes showing:
 * - Date number
 * - Up to three appointments, with a "+X more..." label if applicable
 * - A modal for dates with more than two appointments, detailing all appointments
 *
 * @returns {JSX.Element} - Renders the calendar UI
 */
const CalendarMonthView = ({
  calenderDates,
  offdays,
  appointments,
  isFutureOrToday,
  handleDateClick,
}: Props) => {
  // React states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState<
    Appointment[]
  >([]);

  // functions

  //open the appointment modal to show appoinment in detail
  const handleOpenModal = (matchedAppointments: Appointment[]) => {
    setSelectedAppointments(matchedAppointments);
    // comment this section for just not to show detail modal
    // setIsModalOpen(true);
  };

  // close the appointment show modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointments([]);
  };

  return (
    // grid of 7 column in month
    <div className={clsx("w-full grid grid-cols-7 gap-1", "max-md:gap-[2px]")}>
      {calenderDates.map((calendar, index) => {
        const calendarDate = moment.unix(Number(calendar.date)).startOf("day");
        const today = moment().startOf("day");
        const isToday = calendarDate.isSame(today, "day");
        const isDisabled = offdays.includes(calendar.day.toLowerCase());
        const matchedAppointments =
          appointments &&
          appointments.filter((appointment) =>
            moment.unix(appointment.metadata.date).isSame(calendarDate, "day")
          );
        const isOverflow = matchedAppointments.length > 2; // Define your threshold for overflow
        const FutureorToday = isFutureOrToday(
          calendar.date ? moment.unix(calendar.date).format("DD-MM-YYYY") : ""
        )
          ? ""
          : "pointer-events-none";

        return (
          <div
            key={index}
            className={clsx(
              " flex flex-col rounded h-[156px] w-full font-bold p-[8px] justify-between items-start cursor-pointer overflow-hidden ",
              "max-lg:h-[80px]",
              "max-md:p-1",
              isToday ? "bg-background-gradiant today" : "bg-[#ffffff80]",
              isDisabled && "text-300"
            )}
            onClick={() => {
              if (calendar.date) {
                handleDateClick(
                  moment.unix(calendar.date).format("DD-MM-YYYY")
                );
              }
            }}
          >
            <span
              className={clsx(
                " font-bold text-xl leading-6 text-700",
                "max-lg:text-sm"
              )}
            >
              {calendar.date ? moment.unix(calendar.date).format("DD") : ""}
            </span>
            {/* Render limited matching appointments inside the calendar box */}
            <span className=" w-full">
              {matchedAppointments.slice(0, 3).map((appointment, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    "mt-[2px] text-sm text-gray-800 w-full",
                    " max-lg:h-[11px]",
                    "max-md:text-[7px]",
                    FutureorToday == "" ? "" : "opacity-50"
                  )}
                >
                  <p className="flex justify-start w-full items-center text-[11px]">
                    <span
                      className={clsx(
                        "flex justify-center items-center lg:rounded-[5px] text-white bg-accent font-bold px-1 lg:h-fit leading-[14px] w-[30%] text-[11px]",
                        " max-lg:w-[30px] max-lg:h-[11px] max-lg:rounded-[2px]",
                        "max-md:text-[7px]"
                      )}
                    >
                      {appointment.metadata.slot}
                    </span>
                    <span
                      className={clsx(
                        "font-bold text-accent overflow-hidden whitespace-nowrap max-w-[120px] ml-1 w-[35%] text-[11px]",
                        "max-md:text-[7px] ",
                        "max-sm:w-[70%]"
                      )}
                    >
                      {/* to captlize the first letter js use here */}
                      {appointment.treatment.name.charAt(0).toUpperCase() +
                        appointment.treatment.name.slice(1)}
                    </span>
                    <span
                      className={clsx(
                        " text-700 overflow-hidden whitespace-nowrap text-ellipsis max-w-[120px] ml-1 w-[35%] font-medium text-[11px]",
                        "max-md:text-[7px]",
                        " max-sm:w-[0%]"
                      )}
                    >
                      {appointment.patient.name.charAt(0).toUpperCase() +
                        appointment.patient.name.slice(1)}
                    </span>
                  </p>
                </div>
              ))}
              {isOverflow && (
                <p className=" text-gray-500 cursor-pointer text-[11px] mt-[1px]">
                  {matchedAppointments.length - 3 === 0
                    ? ""
                    : `+
                  ${matchedAppointments.length - 3} more...`}
                </p>
              )}
            </span>
          </div>
        );
      })}

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded p-4 w-1/3">
            <h2 className="text-lg font-bold mb-2">Appointments</h2>
            {selectedAppointments.map((appointment, idx) => (
              <div key={idx} className="mb-2">
                <p>Patient: {appointment.patient.name}</p>
                <p>Treatment: {appointment.treatment.name}</p>
                <p>Duration: {appointment.metadata.duration} min</p>
              </div>
            ))}
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-blue-500 text-white rounded py-1 px-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarMonthView;
