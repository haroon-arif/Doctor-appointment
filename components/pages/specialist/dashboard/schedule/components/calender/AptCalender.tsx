import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment, { duration } from "moment";
import clsx from "clsx";

// Icons
import { ChevronLeft, ChevronRight } from "lucide-react";
import leftcurve from "@/public/specialist/calendar/SubtractLeft.svg";
import righttcurve from "@/public/specialist/calendar/SubtractRight.svg";

// Cutom files and components
import { getAppointmentsApi } from "@/components/utilis/api/appointmentApi";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import CalendarTodayView from "./CalendarTodayView";
import CalendarMonthView from "./CalendarMonthView";
import CalendarWeekView from "./CalendarWeekView";
import CalendarDayView from "./CalendarDayView";
import Image from "next/image";

// Define types
interface CalenderDate {
  day: string;
  date: number | null;
}
type View = "month" | "week" | "day" | "today";
interface Sepecialist {
  name: string;
  about: string;
  location: string;
  qualityMarks: [];
  clinic: string;
  clinicAddress: string;
  [key: string]: any;
}
interface Duration {
  startTime: string;
  endTime: string;
}
interface DayWithDurations {
  day: string;
  durations: Duration[];
  breaks: Duration[];
}
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
  date: number; // Unix timestamp
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
interface Schedule {
  date: string;
  slot: string;
}
interface Props {
  selectedTreatment: any;
  setShowAptModal: (value: boolean) => void; // Modal visibility handler
  setAppointmentSchedule: React.Dispatch<React.SetStateAction<Schedule>>; // State updater for schedule
}

// Initial valeus
const views: View[] = ["month", "week", "day", "today"];
const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/**
 * Appointment Calendar Component.
 *
 * @param {object} props - Component props.
 * @param {any} props.selectedTreatment - State representing the selected treatment from filters.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setShowAptModal - Function to toggle the appointment modal visibility.
 * @param {React.Dispatch<React.SetStateAction<Schedule>>} props.setAppointmentSchedule - State updater function for the appointment schedule.
 * @returns {JSX.Element} The rendered component's UI.
 */
const AptCalender = ({
  selectedTreatment,
  setShowAptModal,
  setAppointmentSchedule,
}: Props) => {
  // React states
  // const [currentMonth, setCurrentMonth] = useState(
  //   moment().startOf("month").toISOString()
  // );
  const [currentMonth, setCurrentMonth] = useState(
    moment().format("YYYY-MM-DD") // This sets the current date in the "YYYY-MM-DD" format
  );
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [calenderDates, setCalenderDates] = useState<CalenderDate[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [weekDates, setWeekDates] = useState<WeekDate[]>([]);
  const [durations, setDurations] = useState<DayWithDurations[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const [currentView, setCurrentView] = useState<View>("month");
  const [specialist, setSpecialist] = useState<Sepecialist>();
  const [offdays, setOffdays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    window.innerWidth < 768
  );

  // Hooks
  const { state, dispatch } = useAppHook();

  //functions

  /**
   * Checks if a given time slot is available for a specified day.
   *
   * @param {string} date - The date to check. format:dd-mm-yyyy
   * @param {string} day - The day of the week. format dddd
   * @param {string} slot - The time slot to validate. format 1:00
   * @returns {boolean} True if the slot is available, false otherwise.
   */

  const isSlotAvailable = (date: string, day: string, slot: string) => {
    day = day.toLowerCase();
    const dayDurations = durations.find((d) => d.day === day); // Find the durations for the specified day
    if (!dayDurations) return false; // If no durations found for the day, return false

    // Check if the slot falls within any of the specified durations
    return dayDurations.durations.some((duration) => {
      return slot >= duration.startTime && slot < duration.endTime; // Slot must be greater than or equal to start and less than end
    });
  };

  /**
   * Counts available half-hour slots within a given time range.
   * @param {string} day - The day to check. format dddd
   * @param {string} inputslot - Time range in "HH:mm - HH:mm" format.
   * @param {number} duration - Total duration in minutes. format 60
   * @returns {number} - Number of available 30-minute slots.
   */

  const AvailableSlots = (
    date: string,
    day: string,
    inputslot: string,
    duration: number
  ): number => {
    // console.log("input slot is:", inputslot);
    const [startTime] = inputslot.split(" - ");
    let time = moment(startTime, "HH:mm");
    let availableSlots = 1;

    for (let i = 1; i < duration / 30; i++) {
      const newTime = time.add(30, "minutes").format("HH:mm");
      if (isSlotAvailable(date, day, newTime)) availableSlots++;
    }

    return availableSlots;
  };

  /**
   * Checks if the given date ('dd-mm-yyyy') is today or in the future.
   * @param {string} dateStr - The date string.
   * @returns {boolean} - `true` if the date is today or later, `false` otherwise.
   */
  const isFutureOrToday = (dateStr: string): boolean => {
    if (dateStr == "") return false;
    const [day, month, year] = dateStr.split("-").map(Number);
    const inputDate = new Date(year, month - 1, day, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
  };

  // it will generate the month dates in array
  const generateCalendarData = (month: string, year: string) => {
    const startDate = moment(`${month} ${year}`, "MMMM YYYY");
    if (!startDate.isValid()) return;
    const totalDays = startDate.daysInMonth();
    const firstDayOfMonth = startDate.startOf("month").day(); // Weekday index (0 = Sunday)
    const newCalendarDates: CalenderDate[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      newCalendarDates.push({ day: days[i], date: null });
    }

    for (let day = 1; day <= totalDays; day++) {
      const currentDay = startDate.clone().date(day);
      newCalendarDates.push({
        day: currentDay.format("dddd").toLowerCase(),
        date: currentDay.unix(),
      });
    }

    setCalenderDates(newCalendarDates);
  };

  // it will generate the week dates array
  const generateCalendarWeekData = (month: string) => {
    const startOfWeek = moment(currentMonth).startOf("week");
    const days = [];

    // Loop through the 7 days of the week
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.clone().add(i, "days");
      const today = moment().startOf("day"); // Today's date at the start of day
      const isToday = day.isSame(today, "day"); // Check if the current day is today

      // Push each day with formatted date and weekday name
      days.push({ date: day.format("DD-MM-YYYY"), day: day.format("dddd") });
    }
    setWeekDates(days);
  };

  // it will handle date change to previous
  const handlePrevDate = () => {
    if (currentView == "month") {
      setCurrentMonth(
        moment(currentMonth).subtract(1, "M").startOf("month").toISOString()
      );
    } else if (currentView == "week") {
      setCurrentMonth(
        moment(currentMonth).subtract(1, "w").startOf("week").toISOString()
      );
    } else if (currentView == "day") {
      setCurrentMonth(
        moment(currentMonth).subtract(1, "d").startOf("day").toISOString()
      );
    } else if (currentView == "today") {
      return;
    }
  };

  // it will handle date change to previous
  const handleNextDate = () => {
    if (currentView == "month") {
      setCurrentMonth(
        moment(currentMonth).add(1, "M").startOf("month").toISOString()
      );
    } else if (currentView == "week") {
      // Move to the next week, setting to the start of that week
      setCurrentMonth(
        moment(currentMonth).add(1, "w").startOf("week").toISOString()
      );
    } else if (currentView == "day") {
      // Move to the next day, setting to the start of that day
      setCurrentMonth(
        moment(currentMonth).add(1, "d").startOf("day").toISOString()
      );
    } else if (currentView == "today") {
      return;
    }
  };
  const handleDateClick = (clickedDate: string) => {
    try {
      const parsedDate = moment(clickedDate, "DD-MM-YYYY");
      if (!parsedDate.isValid()) {
        throw new Error("Invalid date format");
      }
      setCurrentMonth(parsedDate.startOf("day").toISOString());
      setCurrentView("day");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  /**
   * Returns the date string based on the current view:
   * - Month: "MMMM, YYYY"
   * - Week: "DD - DD MMMM, YYYY"
   * - Day: "DD MMMM, YYYY"
   * @returns {string} - Formatted date.
   */
  const handleFormatedDateView = () => {
    if (currentView == "month") {
      return moment(currentMonth).format("MMMM, YYYY");
    } else if (currentView == "week") {
      // Get the start and end dates of the current week
      const startOfWeek = moment(currentMonth).startOf("week");
      const endOfWeek = moment(currentMonth).endOf("week");

      // Format as "DD - DD MMMM, YYYY"
      return `${startOfWeek.format("DD")} - ${endOfWeek.format(
        "DD MMMM, YYYY"
      )}`;
    } else if (currentView == "day") {
      // Format the current day as "DD MMMM, YYYY"
      return moment(currentMonth).format("DD MMMM, YYYY");
      // const todayInCurrentMonth = moment(currentMonth).date(moment().date());
      // return todayInCurrentMonth.format("DD MMMM, YYYY");
    } else if (currentView == "today") {
      // Format the current day as "DD MMMM, YYYY"
      return moment().format("DD MMMM, YYYY");
    }
    return "";
  };

  /**
   * Sets the appointment with the provided slot and date,
   * and triggers the appointment modal display.
   * @param {string} slot - The selected time slot (e.g., "10:00 AM").
   * @param {string} date - The selected date (e.g., "23-10-2024").
   */
  const setAppointment = (slot: string, date: string) => {
    slot = slot.trim();
    date = date.trim();
    setAppointmentSchedule({ slot: slot, date: date });
    setShowAptModal(true);
  };

  /**
   * Returns the first half-hour time slot based on the provided time.
   * @param {string} slot - Starting time (e.g., "12:00").
   * @returns {string} - Formatted half-hour slot (e.g., "12:00 - 12:30").
   */
  const getFirstHalfHourSlot = (slot: string): string => {
    const [hour, minute] = slot.split(":").map(Number); // Extract hour and minute from the input string
    const returnval = `${hour}:00 - ${hour}:30`; // Format the first half-hour time range
    return returnval; // Return the formatted string
  };

  /**
   * Returns the second half-hour time slot based on the provided time.
   * @param {string} slot - Initial time in "HH:MM" format (e.g., "12:00").
   * @returns {string} - Second half-hour slot (e.g., "12:30 - 13:00").
   */
  const getSecondHalfHourSlot = (slot: string): string => {
    const [hour] = slot.trim().split(":").map(Number);
    const minute = 30; // Fixed minute value for the second half-hour slot
    // Return the second half-hour time slot as "{hour}:30 - {next hour}:00"
    return `${hour}:30 - ${hour + 1}:00`;
  };

  /**
   * Returns ful hour slot format: 09:00 - 10:00
   * @param {string} slot - Initial time in "HH:MM" format (e.g., "12:00").
   * @returns {string} - hour slot (e.g., "12:00 - 13:00").
   */
  const getHourSlot = (slot: string): string => {
    const [hour, minute] = slot.trim().split(":").map(Number);

    // Format the next hour
    const nextHour = (hour + 1).toString().padStart(2, "0");

    // Return the slot in "HH:00 - HH:00" format
    return `${hour.toString().padStart(2, "0")}:00 - ${nextHour}:00`;
  };

  /**
   * Creates headers for the week view, displaying the date and day name for each day.
   * Highlights today's date and styles off days accordingly.
   * @returns {JSX.Element} - JSX elements representing the headers for each day of the week.
   */
  const generateWeekDaysHeaders = () => {
    const startOfWeek = moment(currentMonth).startOf("week"); // Get the start date of the current week
    const days = []; // Array to hold the day headers
    // Loop through the next 7 days to create headers
    days.push(<div className="h-0 w-0 -ml-1"></div>);
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.clone().add(i, "days"); // Clone the start date and add i days
      const today = moment().startOf("day"); // Today's date set to the start of the day
      const isToday = day.isSame(today, "day"); // Check if the current day is today
      // Push the day header into the days array with appropriate styles
      days.push(
        <div
          key={i}
          className={clsx(
            `text-center p-[8px] rounded-lg bg-[#FFF] w-full mb-[4px] overflow-hidden ${
              isToday ? "bg-background-gradiant" : ""
            } ${
              offdays.includes(day.format("dddd").toLowerCase())
                ? "text-text-light"
                : "text-[#2E384D]"
            }`,
            "max-md:rounded-[4px]"
          )}
        >
          <div className={clsx("font-bold text-lg leading-6 text-center")}>
            {day.format("DD")}
          </div>{" "}
          <div className={clsx("text-[13px] font-medium", " text-[11px]")}>
            {isSmallScreen
              ? day.format("dddd").slice(0, 3)
              : day.format("dddd")}
          </div>{" "}
        </div>
      );
    }
    return <>{days}</>; // Return the array of day headers as JSX elements
  };

  /**
   * Returns the complete date for the DAY view in "DD-MM-YYYY" format.
   * @returns {string} - Formatted date (e.g., "01-01-2024").
   */
  const getCompleteDayDate = (): string => {
    return moment(currentMonth).format("DD-MM-YYYY"); // Return the full date in the specified format
  };

  /**
   * Fucntion to get all appointments data from API
   */
  const handleGetAllApts = async () => {
    try {
      let apiRes = await getAppointmentsApi();
      if (Array.isArray(apiRes)) {
        setAppointments(apiRes);
        setAllAppointments(apiRes);
      }
    } catch (error: any) {
      toast.error(
        error.message
          ? error.message
          : "Something went wrong while getting appointments data, please refresh.",
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
  };

  /**
   * Generates an array of 24-hour time slots starting from 09:00 (9 AM).
   * @returns {string[]} An array of formatted time slots (e.g., ["09:00", "10:00", ...]).
   */
  const generateTimeSlots = (): string[] => {
    const startHour = moment("09:00", "HH:mm"); // Start at 09:00
    const generatedSlots: string[] = [];

    // Loop 24 times to create 24-hour slots
    for (let i = 0; i < 24; i++) {
      generatedSlots.push(startHour.format("HH:mm")); // Add formatted hour
      startHour.add(1, "hour"); // Increment the time by 1 hour
    }

    return generatedSlots;
  };

  // useEffects Start

  // UseEffect to get all appointments
  useEffect(() => {
    handleGetAllApts();
  }, []);

  /**
   * Handles appointment addition side effects. Resets 'aptAdded' state
   * and retrieves all appointments when 'aptAdded' changes to true.
   */
  useEffect(() => {
    if (state.aptAdded) {
      dispatch({ type: "SET_APT_ADDED", payload: false });
      handleGetAllApts();
    }
  }, [state.aptAdded]);

  /**
   * Loads session data from localStorage, sets the specialist info,
   * and identifies non-working days.
   */
  const loadSpecialistData = () => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      const session = JSON.parse(localStorage.getItem("session")!);
      if (session) {
        let spt = session.user;

        if (spt) {
          const newOffdays = spt.workingDays
            .filter((day: any) => !day.isWorkDay)
            .map((day: any) => day.day.toLowerCase());

          setSpecialist(spt);
          setOffdays(newOffdays);
        }
      }
      setIsLoading(false);
    }
  };

  /**
   * Retrieves specialist's off days from local storage on component mount.
   * Sets off days based on non-working days in session data.
   */
  useEffect(() => {
    loadSpecialistData();
  }, []);

  // on workdays chaneg this useEffect Will run and load the Specilaist data
  useEffect(() => {
    if (state.workDaysUpdated) {
      dispatch({ type: "SET_WORK_DAYS_UPDATED", payload: false });
      loadSpecialistData();
    }
  }, [state.workDaysUpdated]);
  /**
   * Updates displayed appointments based on the selected treatment.
   * Sets all appointments if "all" is selected; otherwise, filters by treatment ID.
   */
  useEffect(() => {
    if (selectedTreatment && allAppointments.length > 0) {
      // console.log("selectedTreatment", selectedTreatment);
      if (selectedTreatment.key == "all") {
        setAppointments(allAppointments);
      } else {
        let apts: Appointment[] = allAppointments.filter(
          (apt) => apt.treatment.id == selectedTreatment.id
        );

        setAppointments(apts);
      }
    }
  }, [selectedTreatment]);

  /**
   * Calculates and updates durations and breaks for the specialist's working days
   * whenever the 'specialist' object changes.
   */
  useEffect(() => {
    if (specialist) {
      setIsLoading(true);
      // console.log("speciallist is: ", specialist);
      // Filter out non-working days
      const workingDays = specialist.workingDays.filter(
        (day: { isWorkDay: boolean }) => day.isWorkDay
      );

      // Process each working day to include durations and calculated breaks
      const updatedDurations: DayWithDurations[] = workingDays.map(
        (day: { day: string; durations: Duration[] }) => {
          const sortedDurations = day.durations.sort(
            (a: Duration, b: Duration) =>
              moment(a.startTime, "HH:mm").valueOf() -
              moment(b.startTime, "HH:mm").valueOf()
          );

          // Calculate breaks between consecutive durations
          const breaks: Duration[] = [];
          for (let i = 0; i < sortedDurations.length - 1; i++) {
            const currentEnd = moment(sortedDurations[i].endTime, "HH:mm");
            const nextStart = moment(sortedDurations[i + 1].startTime, "HH:mm");

            if (nextStart.isAfter(currentEnd)) {
              breaks.push({
                startTime: currentEnd.format("HH:mm"),
                endTime: nextStart.format("HH:mm"),
              });
            }
          }

          return {
            day: day.day,
            durations: sortedDurations,
            breaks,
          };
        }
      );
      setDurations(updatedDurations); // Store in 'durations' state
      setIsLoading(false);
    }
  }, [specialist]);

  /**
   * Generates and stores time slots on component mount.
   */
  useEffect(() => {
    const slots = generateTimeSlots(); // Generate the slots
    setTimeSlots(slots); // Store the generated slots in state
  }, []); // Empty dependency array ensures it runs only once

  /**
   * Initializes calendar data for the current month on component mount.
   */
  useEffect(() => {
    generateCalendarData(
      moment(currentMonth).format("MMMM").toLowerCase(),
      moment(currentMonth).format("YYYY").toLowerCase()
    );
    generateCalendarWeekData(moment(currentMonth).format("MMMM").toLowerCase());
  }, []);

  /**
   * Updates calendar data when `currentMonth` changes.
   */
  useEffect(() => {
    generateCalendarData(
      moment(currentMonth).format("MMMM").toLowerCase(),
      moment(currentMonth).format("YYYY").toLowerCase()
    );
    generateCalendarWeekData(moment(currentMonth).format("MMMM").toLowerCase());
  }, [currentMonth]);

  //this useEffect Run on Every Time Screen Width Change
  useEffect(() => {
    // Function to check and update the screen size
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array, but we call handleResize inside

  return (
    <div className="w-full">
      {/* calender topbar start  */}
      <div
        className={clsx(
          "w-fit my-2 flex items-center justify-center self-start gap-3",
          "max-md:absolute max-md:!top-[162px] max-md:left-1/2 max-md:transform max-md:-translate-x-1/2 max-md:w-full"
        )}
      >
        <button
          onClick={handlePrevDate}
          className={clsx(
            currentView == "today" && "pointer-events-none opacity-30"
          )}
        >
          <ChevronLeft className="text-500 size-5" />
        </button>
        <div>{handleFormatedDateView()}</div>
        <button
          onClick={handleNextDate}
          className={clsx(
            currentView == "today" && "pointer-events-none opacity-30"
          )}
        >
          <ChevronRight className="text-500 size-5" />
        </button>
      </div>
      {/* calender top bar end  */}

      {/* views start/it will show the view name */}
      <div className="w-fit flex items-center justify-center self-start mx-auto ">
        {views.map((view) => (
          <div
            key={view}
            onClick={() => setCurrentView(view)}
            className={clsx(
              "cursor-pointer flex h-[48px] w-[98px] py-[8px] px-[24px] justify-center items-center  rounded-t-xl relative",
              "max-md:w-[62px] max-md:text-[11px] max-md:h-[37px] ",
              currentView == view && " font-semibold text-accent bg-[#F3F6FF]"
            )}
          >
            {currentView == view && (
              <>
                <Image
                  src={leftcurve}
                  alt="left-icon"
                  width={16}
                  height={16}
                  className={clsx(
                    " absolute left-[-15%] top-[69%] h-[16px] w-[16px]",
                    "max-md:left-[-24%] max-md:top-[58%]"
                  )}
                  layout="intrinsic"
                />
                <Image
                  src={righttcurve}
                  alt="right-icon"
                  width={16}
                  height={16}
                  className={clsx(
                    " absolute right-[-15%] top-[69%] h-[16px] w-[16px]",
                    "max-md:right-[-24%] max-md:top-[58%]"
                  )}
                  layout="intrinsic"
                />
              </>
            )}

            {view.charAt(0).toUpperCase() + view.slice(1)}
          </div>
        ))}
      </div>
      {/* views end */}

      {/* actual Views month, week, today day start */}
      <div
        className={clsx(
          `w-full flex flex-col items-center justify-center gap-3 py-2 rounded-[14px] ${
            currentView == "day" ||
            currentView == "today" ||
            currentView == "week"
              ? ""
              : "bg-[#F3F6FF] px-2"
          }`,
          "max-lg:gap-[2px]"
        )}
      >
        <div
          className={clsx(
            `${
              currentView == "month"
                ? "w-full grid grid-cols-7 items-center justify-center gap-1 "
                : ""
            }`,
            "max-md:gap-[2px]"
          )}
        >
          {/* month view start */}
          {currentView == "month" &&
            days.map((day, dindex) => (
              <div
                key={dindex}
                className={clsx(
                  "w-full flex flex-col justify-center items-center p-[8px] rounded-lg bg-[#FFF] ",
                  "max-md:rounded-[4px]"
                )}
              >
                <span
                  className={clsx(
                    "text-[13px] font-medium",
                    offdays.includes(day) ? "text-text-light" : "text-[#2E384D]"
                  )}
                >
                  {isSmallScreen
                    ? day.charAt(0).toUpperCase() +
                      day.slice(1, 3).toLowerCase()
                    : day.charAt(0).toUpperCase() + day.slice(1)}
                </span>

                <span></span>
              </div>
            ))}
        </div>
        {currentView == "month" && (
          <CalendarMonthView
            calenderDates={calenderDates}
            offdays={offdays}
            appointments={appointments}
            isFutureOrToday={isFutureOrToday}
            handleDateClick={handleDateClick}
          />
        )}
        {/* month view end */}

        {/* week view start */}
        {currentView == "week" &&
          // weekDates.length > 0 &&
          (isLoading ? (
            "Please Wait"
          ) : (
            <CalendarWeekView
              appointments={appointments}
              setAppointment={setAppointment}
              weekDates={weekDates}
              timeSlots={timeSlots}
              generateWeekDaysHeaders={generateWeekDaysHeaders}
              getFirstHalfHourSlot={getFirstHalfHourSlot}
              getSecondHalfHourSlot={getSecondHalfHourSlot}
              isSlotAvailable={isSlotAvailable}
            />
          ))}
        {/* week view end  */}
        {/* day view start */}
        {currentView == "day" &&
          (isLoading ? (
            "Please Wait"
          ) : (
            <CalendarDayView
              isSlotAvailable={isSlotAvailable}
              setAppointment={setAppointment}
              timeSlots={timeSlots}
              offdays={offdays}
              getFirstHalfHourSlot={getFirstHalfHourSlot}
              getSecondHalfHourSlot={getSecondHalfHourSlot}
              appointments={appointments}
              getCompleteDayDate={getCompleteDayDate}
            />
          ))}
        {/* week view end  */}

        {/* today view start  */}
        {currentView == "today" &&
          (isLoading ? (
            "Please Wait"
          ) : (
            <CalendarTodayView
              isSlotAvailable={isSlotAvailable}
              setAppointment={setAppointment}
              offdays={offdays}
              timeSlots={timeSlots}
              getFirstHalfHourSlot={getFirstHalfHourSlot}
              getSecondHalfHourSlot={getSecondHalfHourSlot}
              appointments={appointments}
            />
          ))}
        {/* today view end  */}
      </div>
    </div>
  );
};

export default AptCalender;
