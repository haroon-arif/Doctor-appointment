import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import _ from "lodash";

// Css styles
import "react-calendar/dist/Calendar.css";
import "./style.css";

// Custom file and component imports
import { specialistScheduleAPI } from "@/components/utilis/api/specialistApi";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import WorkDaysUI from "./WorkDaysUI";

moment.updateLocale("en", {
  week: {
    dow: 1, // Set Monday as the first day of the week
  },
});

// Define types
interface Specialist {
  id: string;
  name: string;
  about: string;
  location: string;
  qualityMarks: [];
  clinic: string;
  clinicAddress: string;
  [key: string]: any;
}
interface Duraton {
  startTime: string;
  endTime: string;
  [key: string]: any;
}
interface WorkingDays {
  date: number | null;
  day: string;
  allWeek: boolean; // If true then allWeek  else if false then its specific day
  isWorkDay: boolean; // If true then isWorkDay else if false then its day off
  recurring: boolean; // If true then recurring  else if false then its oneTime
  durations: Duraton[];
}
interface Message {
  type: "error" | "info" | "warn";
  message: string;
}
interface Props {
  setShowWorkDaysModal: any;
}

// Radio button options
let scheduleModeDefaultOptions = [
  { key: "allWeek", label: "All Week", selected: true },
  { key: "specificDay", label: "Specific Day", selected: false },
];
let isWorkingDefaultOptions = [
  { key: "workDay", label: "Work Day", selected: true },
  { key: "dayOff", label: "Day Off", selected: false },
];
let recurringDefaultOptions = [
  { key: "recurring", label: "Recurring", selected: true },
  { key: "oneTime", label: "One Time", selected: false },
];

// Default values
const durationItem: Duraton = {
  startTime: "",
  endTime: "",
};
const wdItem: WorkingDays = {
  date: null,
  day: "",
  allWeek: false,
  isWorkDay: true,
  recurring: false,
  durations: [],
};

/**
 * Component to handle specialist work days UI and functionality
 *
 * Duratin is added bases on user's selection of work day type which is "All week" or "Sepcific day".
 *
 * Durations are added day and week wise not date wise any duration for a
 * day is same for all days of the month.
 *
 * If work day type is all week then duration will be added or removed from
 * all days of the week and if Specific then opertions are done on that day only.
 *
 * If "All week" is selected then changes in durations will apply to all days
 * which have same length (rows) of durations  i.e it will not apply to the
 * day that has different length (rows) of durations.
 *
 * @returns {JSX.Element} - Renders component's UI
 */
const WorkDays = ({ closeModal }: Props) => {
  // React states
  const [scheduleModeOptions, setScheduleModeOptions] = useState(
    scheduleModeDefaultOptions
  );
  const [recurringOptions, setRecurringOptions] = useState(
    recurringDefaultOptions
  );
  const [isWoringOptions, setIsWorkingOptions] = useState(
    isWorkingDefaultOptions
  );

  const [scheduleMode, setScheduleMode] = useState<"allWeek" | "specificDay">(
    "allWeek"
  );
  const [isRecurring, setIsRecurring] = useState<boolean>(true);

  const [selectedDate, setSelectedDate] = useState<
    number | string | undefined
  >();
  const [formatedDate, setFormatedDate] = useState<string | null>("");
  const [workingDays, setWorkingDays] = useState<WorkingDays[]>([]);
  const [workingDaysReadState, setWorkingDaysReadState] = useState<
    WorkingDays[]
  >([]);
  const [selectedDay, setSelectedDay] = useState<string | null>("");

  const [totalWorkingDays, setTotalWorkingDays] = useState();
  const [message, setMessage] = useState<Message | null>(null);
  const [specialist, setSpecialist] = useState<Specialist>();
  const [tileClassNames, setTtileClassNames] = useState();

  // Hooks
  const { state, dispatch } = useAppHook();

  /**
   * Handles the selection of a workday type.
   *
   * @param {string} key - The key of the selected workday type.
   */
  const handleScheduleModeSelection = (key: "allWeek" | "specificDay") => {
    const updatedOptions = scheduleModeDefaultOptions.map((item) =>
      item.key === key
        ? { ...item, selected: true }
        : { ...item, selected: false }
    );

    let readState = _.cloneDeep(workingDaysReadState);
    if (key === "specificDay") {
      readState.workingHoursFor = [formateDate(selectedDate)];
    } else {
      readState = setWorkingHours(readState);
    }
    setWorkingDaysReadState(readState);

    setScheduleModeOptions(updatedOptions);
    setScheduleMode(key);
  };

  const handleRecurringSelection = (key: string) => {
    const updatedOptions = recurringOptions.map((item) =>
      item.key === key
        ? { ...item, selected: true }
        : { ...item, selected: false }
    );

    setRecurringOptions(updatedOptions);
    setIsRecurring(key === "recurring" ? true : false);
  };

  const handleIsWorkingSelection = (key: string) => {
    const updatedOptions = isWoringOptions.map((item) =>
      item.key === key
        ? { ...item, selected: true }
        : { ...item, selected: false }
    );
    setIsWorkingOptions(updatedOptions);
  };

  /**
   * Handles work day type and updates options and specialist work days.
   *
   * @param {string} key - The key indicating whether it’s all week or specifi day.
   * @param {number} wdIndex - The index of the specific workday in the workingDays array.
   */
  const handleIsWorking = (key: string, wdIndex: number) => {
    handleIsWorkingSelection(key);

    let wds: WorkingDays[] = JSON.parse(JSON.stringify(workingDays));

    let startDateOfWeek = moment(selectedDate, "DD-MM-YYYY")
      .startOf("week")
      .format("DD-MM-YYYY");
    let endDateOfWeek = moment(selectedDate, "DD-MM-YYYY")
      .endOf("week")
      .format("DD-MM-YYYY");

    if (scheduleMode == "allWeek") {
      let weeks = wds.weeks;
      let weekFound = false;

      for (let week of weeks) {
        if (
          week.startDate === startDateOfWeek &&
          week.endDate === endDateOfWeek
        ) {
          week.isAllWeek = true;
          week.isSpecificDay = false;
          week.durations = [];
          week.isRecurring = isRecurring;
          week.isWorking = key === "workDay" ? true : false;
          weekFound = true;
        }
      }

      if (!weekFound) {
        let week = {
          startDate: startDateOfWeek,
          endDate: endDateOfWeek,
          durations: [],
          isAllWeek: true,
          isSpecificDay: false,
          isRecurring: isRecurring,
          isWorking: key === "workDay" ? true : false,
        };
        weeks.push(week);
      }
    } else if (scheduleMode == "specificDay") {
      let days = wds.days;
      let dayFound = false;

      for (let day of days) {
        if (day.date === selectedDate) {
          day.isSpecificDay = true;
          day.isAllWeek = false;
          day.durations = [];
          day.isRecurring = isRecurring;
          day.isWorking = key === "workDay" ? true : false;
          dayFound = true;
        }
      }

      if (!dayFound) {
        let day = {
          date: selectedDate,
          durations: [],
          isSpecificDay: true,
          isAllWeek: false,
          isRecurring: isRecurring,
          isWorking: key === "workDay" ? true : false,
        };
        days.push(day);
      }
    }

    setWorkingDays(wds);
  };

  /**
   * Function to add new duration row in work days array
   *
   * @param {number} wdIndex - The index of the specific workday in the workingDays array.
   */
  const handleAddDuration = (schedule) => {
    let wds: WorkingDays[] = JSON.parse(JSON.stringify(workingDays));

    const newDur = {
      startTime: "",
      endTime: "",
    };

    let startDateOfWeek = moment(selectedDate, "DD-MM-YYYY")
      .startOf("week")
      .format("DD-MM-YYYY");
    let endDateOfWeek = moment(selectedDate, "DD-MM-YYYY")
      .endOf("week")
      .format("DD-MM-YYYY");

    if (scheduleMode == "allWeek") {
      let weeks = wds.weeks;
      let weekFound = false;

      for (let week of weeks) {
        if (
          week.startDate === startDateOfWeek &&
          week.endDate === endDateOfWeek
        ) {
          week.durations.push(newDur);
          week.isAllWeek = true;
          week.isSpecificDay = false;
          week.isRecurring = isRecurring;
          weekFound = true;
        }
      }

      if (!weekFound) {
        let week = {
          startDate: startDateOfWeek,
          endDate: endDateOfWeek,
          durations: [...schedule.durations, newDur],
          isAllWeek: true,
          isSpecificDay: false,
          isRecurring: isRecurring,
          isWorking: true,
        };
        weeks.push(week);
      }
    } else if (scheduleMode == "specificDay") {
      let days = wds.days;
      let dayFound = false;

      for (let day of days) {
        if (day.date === selectedDate) {
          day.durations.push(newDur);
          day.isSpecificDay = true;
          day.isAllWeek = false;
          day.isRecurring = isRecurring;
          dayFound = true;
        }
      }

      if (!dayFound) {
        let day = {
          date: selectedDate,
          durations: [...schedule.durations, newDur],
          isSpecificDay: true,
          isAllWeek: false,
          isRecurring: isRecurring,
          isWorking: true,
        };
        days.push(day);
      }
    }

    setWorkingDays(wds);
  };

  /**
   * Function to remove duration row in work days array
   *
   * @param {number} wdIndex - The index of the specific workday in the workingDays array.
   * @param {number} durIndex - The key indicating whether it’s all week or specifi day.
   */
  const handleRemvoeDuration = (schedule, durIndex: number) => {
    let durations = _.cloneDeep(schedule.durations);
    let wds = _.cloneDeep(workingDays);

    let startDateOfWeek = moment(selectedDate, "DD-MM-YYYY")
      .startOf("week")
      .format("DD-MM-YYYY");
    let endDateOfWeek = moment(selectedDate, "DD-MM-YYYY")
      .endOf("week")
      .format("DD-MM-YYYY");

    if (scheduleMode == "allWeek") {
      let weeks = wds.weeks;
      let weekFound = false;

      for (let week of weeks) {
        if (
          week.startDate === startDateOfWeek &&
          week.endDate === endDateOfWeek
        ) {
          let durations = week.durations;
          durations = durations.filter((_, index) => index != durIndex);
          week.durations = durations;
          weekFound = true;
          break;
        }
      }

      if (!weekFound) {
        let week = {
          startDate: startDateOfWeek,
          endDate: endDateOfWeek,
          durations: [],
          isAllWeek: true,
          isSpecificDay: false,
          isRecurring: isRecurring,
          isWorking: true,
        };

        durations = durations.filter((_, index) => index != durIndex);
        week.durations = durations;
        weeks.push(week);
      }
      wds.weeks = weeks;
    } else if (scheduleMode == "specificDay") {
      let days = wds.days;
      let dayFound = false;

      for (let day of days) {
        if (day.date === schedule.date) {
          let durations = day.durations;
          durations = durations.filter((_, index) => index != durIndex);
          day.durations = durations;
          dayFound = true;
          break;
        }
      }

      if (!dayFound) {
        let day = {
          date: selectedDate,
          durations: [],
          isSpecificDay: true,
          isAllWeek: false,
          isRecurring: isRecurring,
          isWorking: true,
        };

        durations = durations.filter((_, index) => index != durIndex);
        day.durations = durations;
        days.push(day);
      }
      wds.days = days;
    }

    setWorkingDays(wds);
  };

  /**
   * Function to set start and end time durations in work days array bases on word day type selection
   *
   * @param {number} wdIndex - The index of the specific workday in the workingDays array.
   * @param {number} durIndex - The index of the duration.
   * @param {any} duration - Contains time value.
   * @param {string} type - Either start time or end time.
   */
  const setDurationValidations = (
    type: string,
    durIndex,
    startTime,
    endTime
  ) => {
    let durations = _.cloneDeep(workingDaysReadState.durations);
    let errorFound = false;

    if (durations.length && durations[0].startTime && durations[0].endTime) {
      for (let index = 0; index < durations.length; index++) {
        let duration = durations[index];

        if (
          type === "startTime" &&
          startTime &&
          (duration.startTime === startTime || duration.endTime === startTime)
        ) {
          setMessage({
            type: "error",
            message: "Time is already used, please select another",
          });
          errorFound = true;
          break;
        } else if (
          type === "endTime" &&
          endTime &&
          (duration.startTime === endTime || duration.endTime === endTime)
        ) {
          setMessage({
            type: "error",
            message: "Time is already used, please select another",
          });
          errorFound = true;
          break;
        } else if (
          type === "startTime" &&
          durIndex !== index &&
          startTime &&
          startTime >= duration.startTime &&
          startTime <= duration.endTime
        ) {
          setMessage({
            type: "error",
            message:
              "Start time overlaps another slot, please select another time",
          });
          errorFound = true;
          break;
        } else if (
          type === "endTime" &&
          durIndex !== index &&
          endTime &&
          endTime >= duration.startTime &&
          endTime <= duration.endTime
        ) {
          setMessage({
            type: "error",
            message:
              "End time overlaps another slot, please select another time",
          });
          errorFound = true;
          break;
        } else if (
          type === "endTime" &&
          startTime &&
          endTime &&
          durIndex == index &&
          endTime <= startTime
        ) {
          setMessage({
            type: "error",
            message: "End time is invalid, please select another time",
          });
          errorFound = true;
          break;
        } else if (
          type === "startTime" &&
          startTime &&
          endTime &&
          durIndex == index &&
          startTime >= endTime
        ) {
          setMessage({
            type: "error",
            message: "Start time is invalid, please select another time",
          });
          errorFound = true;
          break;
        } else if (
          startTime &&
          endTime &&
          durIndex !== index &&
          startTime <= duration.startTime &&
          endTime >= duration.endTime
        ) {
          setMessage({
            type: "error",
            message: "Slot overlaps another slot, please select another time",
          });
          errorFound = true;
          break;
        }
      }
    }

    return errorFound;
  };

  /**
   * Function to set start and end time durations in work days array bases on word day type selection
   *
   * @param {number} wdIndex - The index of the specific workday in the workingDays array.
   * @param {number} durIndex - The index of the duration.
   * @param {any} duration - Contains time value.
   * @param {string} type - Either start time or end time.
   */
  const handleSetDuration = (
    type: string,
    durIndex: number,
    startTime: string,
    endTime: string
  ) => {
    let wds = _.cloneDeep(workingDays);
    let readState = _.cloneDeep(workingDaysReadState);

    if (setDurationValidations(type, durIndex, startTime, endTime)) {
      return;
    } else {
      setMessage(null);
    }

    let startDateOfWeek = moment(selectedDate, "DD-MM-YYYY")
      .startOf("week")
      .format("DD-MM-YYYY");
    let endDateOfWeek = moment(selectedDate, "DD-MM-YYYY")
      .endOf("week")
      .format("DD-MM-YYYY");

    if (scheduleMode == "allWeek") {
      let weeks = wds.weeks;
      let weekFound = false;

      for (let week of weeks) {
        if (
          week.startDate === startDateOfWeek &&
          week.endDate === endDateOfWeek
        ) {
          week.durations[durIndex].startTime = startTime;
          week.durations[durIndex].endTime = endTime;
          week.isAllWeek = true;
          week.isSpecificDay = false;
          week.isRecurring = isRecurring;
          weekFound = true;
        }
      }

      if (!weekFound) {
        let week = {
          startDate: startDateOfWeek,
          endDate: endDateOfWeek,
          durations: [
            {
              startTime: startTime,
              endTime: endTime,
            },
          ],
          isAllWeek: true,
          isSpecificDay: false,
          isRecurring: isRecurring,
          isWorking: true,
        };
        // if (
        //   readState.durations.length > 0 &&
        //   readState.durations[0].startTime &&
        //   readState.durations[0].endTime
        // ) {
        //   week.durations.unshift(...readState.durations);
        // }
        weeks.push(week);
      }
    } else if (scheduleMode == "specificDay") {
      let days = wds.days;
      let dayFound = false;

      for (let day of days) {
        if (day.date === selectedDate) {
          day.durations[durIndex].startTime = startTime;
          day.durations[durIndex].endTime = endTime;
          day.isSpecificDay = true;
          day.isAllWeek = false;
          day.isRecurring = isRecurring;
          dayFound = true;
        }
      }

      if (!dayFound) {
        let day = {
          date: selectedDate,
          durations: [
            {
              startTime: startTime,
              endTime: endTime,
            },
          ],
          isSpecificDay: true,
          isAllWeek: false,
          isRecurring: isRecurring,
          isWorking: true,
        };
        // if (
        //   readState.durations.length > 0 &&
        //   readState.durations[0].startTime &&
        //   readState.durations[0].endTime
        // ) {
        //   day.durations.unshift(...readState.durations);
        // }
        days.push(day);
      }
    }

    setWorkingDays(wds);
  };

  /**
   * Function to set selected day and date from calendar
   *
   * @param {any} fullDate - Date object returned by the react-calendar.
   */
  const handleDateChange = (fullDate: any) => {
    const day = moment(fullDate).format("dddd").toLowerCase(); // "monday"
    const unixDate = moment(fullDate).startOf("day").format("DD-MM-YYYY"); // unix
    const fullMonth = moment(fullDate).format("MMMM"); // "October"
    const year = moment(fullDate).format("YYYY"); // "2024"
    const date = moment(fullDate).format("DD"); // "17"

    if (scheduleMode == "allWeek") {
      const startOfWeek = moment(fullDate).startOf("week");
      const endOfWeek = moment(fullDate).endOf("week");
      const startDate = startOfWeek.format("DD MMMM YYYY");
      const endDate = endOfWeek.format("DD MMMM YYYY");

      setFormatedDate(`${startDate} - ${endDate}`);
    } else if (scheduleMode == "specificDay") {
      setFormatedDate(`${date} ${fullMonth} ${year}`);
    }

    setSelectedDate(unixDate);
    setSelectedDay(day);
  };

  /**
   * Function to set classes for the selected day based on day off or work day in working days array
   *
   * @param {any} date - Date object returned by the react-calendar.
   *
   * @returns {string} - Css classes
   */
  const tileClassName = (date?: any) => {
    const isToday = moment(date).isSame(moment(), "day");
    const isSelected = selectedDate
      ? moment(date).isSame(moment(selectedDate, "DD-MM-YYYY"), "day")
      : false;

    const currentDay = moment(date).date(); // Day of the month
    let isDayOff = false;

    // Check for off days for date
    if (workingDays?.days?.length) {
      isDayOff = workingDays.days.some((d) => {
        const dayDate = moment(d.date, "DD-MM-YYYY");
        const isSameDate = dayDate.isSame(moment(date), "day");
        const isRecurringMatch = d.isRecurring && dayDate.date() === currentDay;

        return (isSameDate || isRecurringMatch) && !d.isWorking;
      });
    }

    // Check for off days for weeks
    // if (!isDayOff && workingDays?.weeks?.length) {
    //   const currentDate = moment(date).startOf("day");

    //   // Iterate through all weeks
    //   for (
    //     let weekIndex = 0;
    //     weekIndex < workingDays.weeks.length;
    //     weekIndex++
    //   ) {
    //     const week = workingDays.weeks[weekIndex];
    //     // console.log("week", week);
    //     const start = moment(week.startDate, "DD-MM-YYYY")
    //       .startOf("week")
    //       .startOf("day");
    //     const end = moment(week.endDate, "DD-MM-YYYY")
    //       .endOf("week")
    //       .startOf("day");

    //     if (!week.isWorking) {
    //       // Handle current week range (if the week is marked as off)
    //       if (currentDate.isBetween(start, end, null, "[]")) {
    //         isDayOff = true;
    //         break;
    //       }

    //       // Handle continuous recurrence for non-working weeks
    //       if (week.isRecurring) {
    //         let recurringStart = start.clone();
    //         let recurringEnd = end.clone();

    //         // Define a boundary to prevent infinite loops
    //         const maxRecurrenceDate = moment().add(2, "years");

    //         while (recurringStart.isBefore(maxRecurrenceDate)) {
    //           // Move to the next week's range
    //           recurringStart.add(1, "week");
    //           recurringEnd.add(1, "week");

    //           // Check if the current date falls in this recurring week range
    //           if (
    //             currentDate.isBetween(recurringStart, recurringEnd, null, "[]")
    //           ) {
    //             isDayOff = true;
    //             break;
    //           }

    //           // Check the next week to determine behavior
    //           const nextWeek = workingDays.weeks[weekIndex + 1]; // Get the next week in sequence

    //           if (nextWeek) {
    //             // Check if the next week is non-recurring
    //             if (!nextWeek.isRecurring) {
    //               // Check if next week's range is after the updated recurring week range
    //               const nextStart = moment(
    //                 nextWeek.startDate,
    //                 "DD-MM-YYYY"
    //               ).startOf("week");
    //               const nextEnd = moment(nextWeek.endDate, "DD-MM-YYYY").endOf(
    //                 "week"
    //               );

    //               if (currentDate.isBetween(nextStart, nextEnd, null, "[]")) {
    //                 if (!week.isWorking) {
    //                   isDayOff = true;
    //                 } else {
    //                   isDayOff = false;
    //                 }
    //                 // continue;
    //               }

    //               // If next week's start is after the current recurring range, exit the loop
    //               // if (nextStart.isAfter(recurringStart)) {
    //               //   continue;
    //               // }
    //             } else {
    //               // If the next week is recurring, continue checking
    //               console.log("found recurring");
    //               // break;
    //             }
    //           }
    //         }

    //         // Exit the loop early if we found a match
    //         // if (isDayOff) {
    //         //   console.log(
    //         //     "day off breaking at",
    //         //     week.startDate,
    //         //     currentDate.format("MM-DD-YYYY")
    //         //   );
    //         //   break;
    //         // }
    //       }
    //     } else {
    //       // If the current week is marked as "working," ensure it's not marked as "off."
    //       if (currentDate.isBetween(start, end, null, "[]")) {
    //         // console.log("WORKING", start, end, currentDate);
    //         isDayOff = false;
    //         // break;
    //       }
    //     }
    //   }
    // }

    if (!isDayOff && workingDays?.weeks?.length) {
      const maxRecurrenceDate = moment().add(2, "years");
      const currentDate = moment(date).startOf("day");
      let isSpecificMatch = false;

      // Step 1: Check specific weeks first (non-recurring)
      for (const week of workingDays.weeks) {
        if (!week.isRecurring) {
          const start = moment(week.startDate, "DD-MM-YYYY")
            .startOf("week")
            .startOf("day");
          const end = moment(week.endDate, "DD-MM-YYYY")
            .endOf("week")
            .startOf("day");

          if (currentDate.isBetween(start, end, null, "[]")) {
            isDayOff = !week.isWorking;
            isSpecificMatch = true;
            break; // Stop checking further weeks
          }
        }
      }

      // Step 2: Apply recurring weeks if no specific match is found
      if (!isSpecificMatch) {
        for (const week of workingDays.weeks) {
          if (week.isRecurring) {
            let recurringStart = moment(week.startDate, "DD-MM-YYYY")
              .startOf("week")
              .startOf("day");
            let recurringEnd = moment(week.endDate, "DD-MM-YYYY")
              .endOf("week")
              .startOf("day");

            while (recurringStart.isBefore(maxRecurrenceDate)) {
              // Check if the current date is within this recurring range
              if (
                currentDate.isBetween(recurringStart, recurringEnd, null, "[]")
              ) {
                isDayOff = !week.isWorking;
                break;
              }

              // Move to the next recurrence
              recurringStart.add(1, "week");
              recurringEnd.add(1, "week");
            }
          }
        }
      }
    }

    // Return appropriate classes based on the conditions
    let classNames = [
      "custom-calendar react-calendar__tile",
      isDayOff && isSelected
        ? "react-calendar__tile--active selected selected opacity-60"
        : isDayOff
        ? "react-calendar__month-view__days__day--day-off"
        : "",
      isToday && isDayOff
        ? "react-calendar__tile--active selected selected opacity-60"
        : isToday
        ? "react-calendar__tile--active selected selected"
        : "",
      isSelected ? "react-calendar__tile--active selected" : "",
      isToday && !isSelected
        ? "react-calendar__tile--active selected selected opacity-60"
        : "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return classNames;
  };

  const handleRemoveWeek = (week) => {
    let wds = _.cloneDeep(workingDays);
    let weeks = wds.weeks;

    weeks = weeks.filter(
      (w) => !(w.startDate == week.startDate && w.endDate == week.endDate)
    );
    wds.weeks = weeks;

    setWorkingDays(wds);
  };

  const handleRemoveDay = (day) => {
    let wds = _.cloneDeep(workingDays);
    let days = wds.days;

    days = days.filter((d) => !(d.date == day.date));
    wds.days = days;

    setWorkingDays(wds);
  };

  const remvoeEmptyDefaultScheduleIfEmpy = (wds) => {
    let weeks = wds.weeks;
    weeks = weeks.filter(
      (week) =>
        !(
          week.defaultWeek &&
          week.durations.length === 1 &&
          !week.durations[0].startTime &&
          !week.durations[0].endTime
        )
    );
    wds.weeks = weeks;

    return wds;
  };

  /**
   * Function to handle working days validations on save
   *
   */
  const saveFunctionValidations = (wds) => {
    let weeks = wds.weeks;
    weeks = weeks.filter(
      (week) =>
        !(
          week.defaultWeek &&
          week.durations.length === 1 &&
          !week.durations[0].startTime &&
          !week.durations[0].endTime
        )
    );
    wds.weeks = weeks;
    setWorkingDays(wds);

    let errorsFound = false;

    for (let week of wds.weeks) {
      if (week.isWorking && week.durations.length < 1) {
        setMessage({
          type: "error",
          message: `You have set ${week.startDate}-${week.endDate} week as "Work Day" but not added any durations, please add slots or remove day".`,
        });

        errorsFound = true;
        break;
      }
      let isEmpty = week.durations.some(
        (dur) => dur.startTime == "" || dur.endTime == ""
      );

      if (isEmpty) {
        setMessage({
          type: "error",
          message: `You have left empty slots for
        ${week.startDate}-${week.endDate} week, please verify and fix the slots.`,
        });

        errorsFound = true;
        break;
      }
    }
    for (let day of wds.days) {
      if (day.isWorking && day.durations.length < 1) {
        setMessage({
          type: "error",
          message: `You have set ${day.date} as "Work Day" but not added any durations, please add slots or remove day".`,
        });

        errorsFound = true;
        break;
      }

      let isEmpty = day.durations.some(
        (dur) => dur.startTime == "" || dur.endTime == ""
      );

      if (isEmpty) {
        setMessage({
          type: "error",
          message: `You have left empty slots for
        ${day.date} day, please verify and fix the slots.`,
        });

        errorsFound = true;
        break;
      }
    }

    return errorsFound;
  };

  /**
   * Function working days array in specialist
   *
   */
  const handleSave = async () => {
    let wds = _.cloneDeep(workingDays);
    wds = remvoeEmptyDefaultScheduleIfEmpy(wds);
    // console.log("wds", wds);
    if (saveFunctionValidations(wds)) {
      return;
    } else setMessage(null);

    dispatch({ type: "SET_IS_LOADING", payload: true });

    try {
      let session = JSON.parse(localStorage.getItem("session")!);

      let apiRes = await specialistScheduleAPI({
        specialistId: specialist?.id,
        workingDays: workingDays,
      });

      if (apiRes) {
        session.user = apiRes.specialist;
        localStorage.setItem("session", JSON.stringify(session));
        dispatch({ type: "SET_WORK_DAYS_UPDATED", payload: true });
        closeModal();
      }
    } catch (error) {
      toast.error("Something went wrong, please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    dispatch({ type: "SET_IS_LOADING", payload: false });
  };

  const formateDate = (date) =>
    moment(date, "DD-MM-YYYY").format("DD MMMM, YYYY");

  /**
   * Setting working hours
   */
  const setWorkingHours = (readState) => {
    if (readState) {
      if (readState.isSpecificDay) {
        readState.workingHoursFor = [formateDate(readState.date)];
      } else if (readState.isAllWeek) {
        let start = moment(selectedDate, "DD-MM-YYYY").startOf("week");
        let end = moment(selectedDate, "DD-MM-YYYY").endOf("week");
        let weekDates = [];

        while (start.isSameOrBefore(end)) {
          weekDates.push(start.format("DD-MM-YYYY"));
          start.add(1, "day");
        }

        // Filter out days that are already in `workingDays`
        weekDates = weekDates.filter((date) => {
          const isInWorkingDays = workingDays.days?.some((day) => {
            return moment(date, "YYYY-MM-DD").isSame(
              moment(day.date, "YYYY-MM-DD"),
              "day"
            );
          });
          return !isInWorkingDays;
        });

        // Filter out recurring off days
        weekDates = weekDates.filter((date) => {
          const currentDay = moment(date, "DD-MM-YYYY").date();
          const currentMonth = moment(date, "DD-MM-YYYY").month();
          const currentDate = moment(date, "DD-MM-YYYY");

          const recurringDay = workingDays.days?.find((day) => {
            const dayDate = moment(day.date, "DD-MM-YYYY");
            const isPastOrCurrentMonth =
              dayDate.isBefore(currentDate, "month") ||
              dayDate.month() === currentMonth;

            return (
              day.isRecurring &&
              dayDate.date() === currentDay &&
              isPastOrCurrentMonth
            );
          });

          return !recurringDay;
        });

        if (weekDates.length == 7) {
          weekDates = [formateDate(weekDates[0]), formateDate(weekDates[6])];
        } else {
          weekDates = weekDates.map((date) =>
            moment(date, "DD-MM-YYYY").format("DD/MM")
          );
        }

        readState.workingHoursFor = weekDates;
      }

      return readState;
    }
  };

  useEffect(() => {
    if (selectedDate && workingDays) {
      const start = moment(selectedDate, "DD-MM-YYYY").startOf("week");
      const end = moment(selectedDate, "DD-MM-YYYY").endOf("week");
      const weekDates = [];
      const offDays = [];
      let isEntireWeekOff = false;

      // Generate all dates for the selected week
      while (start.isSameOrBefore(end)) {
        weekDates.push(start.clone());
        start.add(1, "day");
      }

      // Check if the whole week is off in the `weeks` array
      const matchingWeek = workingDays.weeks?.find((week) => {
        const weekStart = moment(week.startDate, "DD-MM-YYYY").startOf("day");
        const weekEnd = moment(week.endDate, "DD-MM-YYYY").endOf("day");

        return (
          weekStart.isSameOrBefore(moment(selectedDate, "DD-MM-YYYY")) &&
          weekEnd.isSameOrAfter(moment(selectedDate, "DD-MM-YYYY")) &&
          !week.isWorking
        );
      });

      if (matchingWeek) {
        isEntireWeekOff = true;
      }

      // If the whole week is off, mark all days as off
      if (isEntireWeekOff) {
        offDays.push(...weekDates.map((date) => date.format("DD-MM-YYYY")));
        setTotalWorkingDays(0); // No working days if the entire week is off
      } else {
        // Otherwise, check each date individually
        const workingDaysCount = weekDates.reduce((count, currentDate) => {
          const matchingDay = workingDays.days?.find((day) => {
            const dayDate = moment(day.date, "DD-MM-YYYY");

            // Specific day match (non-recurring)
            const isSpecificDay =
              dayDate.isSame(currentDate, "day") && !day.isRecurring;

            // Recurring day match
            const isRecurringDay =
              dayDate.date() === currentDate.date() && day.isRecurring;

            return isSpecificDay || isRecurringDay;
          });

          if (matchingDay && !matchingDay.isWorking) {
            offDays.push(currentDate.format("DD-MM-YYYY"));
          } else {
            count++;
          }

          return count;
        }, 0);

        // Log totals for debugging
        // console.log("Total Working Days:", workingDaysCount);
        // console.log("Off Days:", offDays);

        setTotalWorkingDays(workingDaysCount);
      }
    }
  }, [workingDays?.days, workingDays?.weeks, selectedDate]);

  /**
   * Get specialist data and set working days array on compnent load
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);
      let spt = session.user;

      if (!spt) return;

      setSpecialist(spt);

      let wds = {};

      // if (false) {
      if (spt.workingDays && Object.keys(spt.workingDays).length > 0) {
        wds = _.cloneDeep(spt.workingDays);
      } else {
        wds = {
          firstVisitDate: moment().startOf("week").format("DD-MM-YYYY"),
          weeks: [
            {
              startDate: moment().startOf("week").format("DD-MM-YYYY"),
              endDate: moment().endOf("week").format("DD-MM-YYYY"),
              isWorking: true,
              isRecurring: true,
              isSpecificDay: false,
              isAllWeek: true,
              defaultWeek: true,
              durations: [
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            },
          ],
          days: [],
        };

        // {
        //   date: moment().format("DD-MM-YYYY"),
        //   isWorking: true,
        //   isRecurring: true,
        //   durations: [
        //     {
        //       startTime: "",
        //       endTime: "",
        //     },
        //   ],
        // },
      }

      const day = moment().format("dddd").toLowerCase();
      const date = moment().format("DD-MM-YYYY");

      setWorkingDays(wds);
      setSelectedDay(day);
      setSelectedDate(date);
    }
  }, []);

  /**
   * Setting read state
   */
  useEffect(() => {
    if (selectedDate && workingDays) {
      let wds = _.cloneDeep(workingDays);
      let firstVisitDate = moment(wds.firstVisitDate, "DD-MM-YYYY");
      let readStateWeek = null;
      let readStateDay = null;
      let weeks = wds.weeks;
      let days = wds.days;
      let weekIndex = 0;
      let daysIndex = 0;

      const findWeek = (
        weeks: any,
        weekindex: number,
        checkRecurring: boolean
      ) => {
        let startDate = moment(selectedDate, "DD-MM-YYYY")
          .subtract(weekindex, "week")
          .startOf("week")
          .format("DD-MM-YYYY");
        let endDate = moment(selectedDate, "DD-MM-YYYY")
          .subtract(weekindex, "week")
          .endOf("week")
          .format("DD-MM-YYYY");

        for (let week of weeks) {
          if (checkRecurring) {
            if (
              week.startDate === startDate &&
              week.endDate === endDate &&
              week.isRecurring
            ) {
              return week;
            }
          } else {
            if (week.startDate === startDate && week.endDate === endDate) {
              return week;
            }
          }
        }

        return null;
      };
      const findDay = (
        days: any,
        monthOffset: number,
        checkRecurring: boolean
      ) => {
        let date = moment(selectedDate, "DD-MM-YYYY")
          .subtract(monthOffset, "month")
          .format("DD-MM-YYYY");

        for (let day of days) {
          if (checkRecurring) {
            if (day.date === date && day.isRecurring) {
              return day;
            }
          } else {
            if (day.date === date) {
              return day;
            }
          }
        }
        return null;
      };

      readStateWeek = findWeek(weeks, 0, false);
      readStateDay = findDay(days, 0, false);

      if (!readStateWeek) {
        while (readStateWeek === null) {
          readStateWeek = findWeek(weeks, weekIndex, true);

          if (readStateWeek) {
            break;
          }

          // Stop if the startDate is earlier than firstVisitDate
          let currentStartDate = moment(selectedDate, "DD-MM-YYYY")
            .subtract(weekIndex, "week")
            .startOf("week");

          if (currentStartDate.isBefore(firstVisitDate)) {
            // console.log("Reached the first visit date. Stopping the loop.");
            break;
          }
          weekIndex++;
        }
      }

      if (!readStateDay) {
        while (readStateDay === null || daysIndex < 100) {
          readStateDay = findDay(days, daysIndex, true);

          if (readStateDay) {
            break;
          }

          // Stop if the date is earlier than firstVisitDate
          let currentDate = moment(selectedDate, "DD-MM-YYYY")
            .subtract(daysIndex, "month")
            .format("DD-MM-YYYY");

          if (moment(currentDate, "DD-MM-YYYY").isBefore(firstVisitDate)) {
            // console.log("Reached the first visit date. Stopping the loop.");
            break;
          }

          daysIndex++;
        }
      }

      if (moment(selectedDate, "DD-MM-YYYY").isBefore(firstVisitDate)) {
        setMessage({
          type: "error",
          message:
            "You are visiting past dates where durations were never added",
        });
        setWorkingDaysReadState(null);
        return;
      } else {
        setMessage(null);
      }

      if (readStateDay) {
        let readStateDayCopy = _.cloneDeep(readStateDay);
        readStateDayCopy = setWorkingHours(readStateDayCopy);

        handleScheduleModeSelection("specificDay");
        handleIsWorkingSelection(
          readStateDayCopy.isWorking ? "workDay" : "dayOff"
        );
        handleRecurringSelection(
          readStateDayCopy.isRecurring ? "recurring" : "oneTime"
        );
        setIsRecurring(readStateDayCopy.isRecurring);
        setWorkingDaysReadState(readStateDayCopy);
      } else if (readStateWeek) {
        let readStateWeekCopy = _.cloneDeep(readStateWeek);
        readStateWeekCopy = setWorkingHours(readStateWeekCopy);

        handleScheduleModeSelection("allWeek");
        handleIsWorkingSelection(
          readStateWeekCopy.isWorking ? "workDay" : "dayOff"
        );
        handleRecurringSelection(
          readStateWeekCopy.isRecurring ? "recurring" : "oneTime"
        );
        setIsRecurring(readStateWeekCopy.isRecurring);
        setWorkingDaysReadState(readStateWeekCopy);
      }
    }
  }, [selectedDate, workingDays]);

  /**
   * Update radio button options for work day
   */
  useEffect(() => {
    if (workingDays.length > 0) {
      const updatedOptions = isWoringOptions.map((item) => {
        const isWorkDay = workingDays.some(
          (day) => day.day === selectedDay && day.isWorkDay
        );

        return {
          ...item,
          selected: isWorkDay ? item.key === "workDay" : item.key === "dayOff",
        };
      });
      setIsWorkingOptions(updatedOptions);
    }
  }, [selectedDay]);

  console.log("workingDays", workingDays);

  return (
    <WorkDaysUI
      handleRecurring={handleRecurringSelection}
      recurringOpts={recurringOptions}
      workingDaysReadState={workingDaysReadState}
      handleRemoveWeek={handleRemoveWeek}
      totalWorkingDays={totalWorkingDays}
      handleRemoveDay={handleRemoveDay}
      selectedDate={selectedDate}
      isWorkDayOpts={isWoringOptions}
      formatedDate={formatedDate}
      workingDays={workingDays}
      selectedDay={selectedDay}
      wdTypeOpts={scheduleModeOptions}
      message={message}
      handleRemvoeDuration={handleRemvoeDuration}
      handleSetDuration={handleSetDuration}
      handleWorkDayType={handleIsWorking}
      handleCloseEditWD={closeModal}
      handleAddDuration={handleAddDuration}
      handleDateChange={handleDateChange}
      tileClassName={tileClassName}
      tileClassNames={tileClassNames}
      handleWDType={handleScheduleModeSelection}
      handleSave={handleSave}
    />
  );
};

export default WorkDays;
