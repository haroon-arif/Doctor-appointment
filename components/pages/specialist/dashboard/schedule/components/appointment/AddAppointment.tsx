import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment, { duration } from "moment";
import _ from "lodash";

// Custom file and component imports
import {
  createPatientsApi,
  getPatientsApi,
} from "@/components/utilis/api/patientApi";
import { createAppointmentApi } from "@/components/utilis/api/appointmentApi";
import { bookedSlotsAPI } from "@/components/utilis/api/specialistApi";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import AddAppointmentsUI from "./AddAppointmentsUI";

// Defint types
interface Patient {
  id?: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: any;
}
interface WorkDay {
  isWorkDay: boolean;
  day: string;
}
interface BookedSlot {
  date: number;
  slots: {
    startTime: string;
    endTime: string;
    duration: string;
  }[];
}

interface Specialist {
  id: string;
  bookedSlots: BookedSlot[];
  name: string;
  workingDays: WorkDay[];
}
interface Treatment {
  id: "";
  name: "";
  duration: "";
  price: "";
}
interface Message {
  type: "error" | "info" | "warn";
  message: string;
}

// Initial state values
const initialPatDetail: Patient = {
  name: "",
  email: "",
  phone: "",
};
type TimeSlot = {
  time: string;
  isBooked: boolean;
  isPassed: boolean;
};
interface Props {
  calendarDate?: string;
  calendarSlot?: string;
  setShowAptModal?: any;
}

/**
 * This component shows add appointment modal where user can select
 * treatment and its schedule and then save appointent
 *
 * @returns {JSX.Element} - renders add appointment UI and its functionality
 */
const AddAppointment = ({
  calendarDate,
  calendarSlot,
  setShowAptModal,
}: Props) => {
  // React states
  const [newPatient, setNewPatient] = useState<Patient | null>(
    initialPatDetail
  );
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [treatments, setTreatments] = useState<Treatment[] | null>(null);
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [aptDuration, setAptDuration] = useState<string>("60");
  const [addPat, setAddPat] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  // Calendar states
  const [selectedDate, setSelectedDate] = useState<number | undefined>();
  const [formatedDate, setFormatedDate] = useState<string | null>("");
  const [selectedDay, setSelectedDay] = useState<string | null>("");
  const [customSlots, setCustomSlots] = useState<string[]>([]);

  //Error Message
  const [durationError, setDurationError] = useState("");
  // Hooks
  const { state, dispatch } = useAppHook();

  /**
   * Validates an email address using a regex pattern.
   *
   * @param {string} email - The email address to validate.
   * @returns {boolean} True if the email is valid, false otherwise.
   */
  const validateEmail = (email: string | undefined) => {
    if (!email) return false;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  /**
   * Validates if a given input contains only numbers, hyphens (-), and parentheses (()).
   *
   * @param {string} input - The input string to validate.
   * @returns {boolean} True if the input is valid, false otherwise.
   */
  const validatePhoneNumber = (input: string | undefined) => {
    const phonePattern = /^[0-9\-\(\)\s]+$/;
    return phonePattern.test(input ? input : "");
  };

  /**
   * Function to close appointment modal
   */
  const handleToggelAddAptModal = () => {
    setShowAptModal(false);
  };

  // validate the duration Time
  const handleBlur = () => {
    // Validate when input loses focus
    const value = Number(aptDuration);
    if (value < 15 || value > 240 || isNaN(value)) {
      setDurationError("Duration Must Between 15-240 Minute");
      setAptDuration("60");
    } else {
      setDurationError("");
    }
  };

  /**
   * Function to handle patient selection
   */
  const handlePatientSelection = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  /**
   * Function that handles the UI for if user wants to add new patien or select existing patient
   */
  const toggleAddPatient = () => {
    setAddPat(!addPat);
  };

  /**
   * Function to handle treatment selection
   *
   * @param {Treatment} treatment selected treatment object
   */
  const handleTreatmentSelection = (treatment: Treatment) => {
    // setAptDuration(treatment.duration);
    setAptDuration("60");
    setSelectedTreatment(treatment);
  };

  const isSelectedDayOff = (workingDays, date) => {
    const currentDay = moment(date).date();
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

    return isDayOff;
  };

  /**
   * Function to set selected day and date from calendar
   *
   * @param {any} fullDate - Date object returned by the react-calendar.
   */
  const handleDateChange = (fullDate: any, calendarSlot?: string) => {
    setSelectedSlot(null);
    let firstVisitDate = moment(
      specialist?.workingDays?.firstVisitDate,
      "DD-MM-YYYY"
    );

    const day = moment(fullDate).format("dddd").toLowerCase(); // "monday"
    const unixDate = moment(fullDate).startOf("day").unix(); // unix
    const fullMonth = moment(fullDate).format("MMMM"); // "October"
    const year = moment(fullDate).format("YYYY"); // "2024"
    const date = moment(fullDate).format("DD"); // "17"
    const currentUnixTime = moment().startOf("day").unix();

    let isInvalid =
      moment(fullDate).startOf("day").isBefore(moment().startOf("day")) ||
      moment(fullDate, "DD-MM-YYYY").isBefore(firstVisitDate);

    // let isDayOff = specialist?.workingDays?.some(
    //   (wday: any) => !wday.isWorkDay && wday.day == day
    // );

    let isDayOff = isSelectedDayOff(specialist?.workingDays, fullDate);

    // Validations
    if (isInvalid) {
      setMessage({
        type: "error",
        message: "Invalid Date",
      });
      setTimeSlots([]);

      return;
    } else if (isDayOff) {
      setMessage({
        type: "error",
        message: `${day} is not work day.`,
      });
      setTimeSlots([]);

      return;
    } else {
      setMessage(null);
    }

    // Set time slots
    let tslots: any = []; // time slots
    const start = moment("09:00", "HH:mm");
    const end = moment("21:00", "HH:mm");
    const currentTime = moment();

    while (start <= end) {
      let newSlot = {
        time: start.format("HH:mm"),
        isBooked: false,
        isPassed: false,
      };

      if (start.isBefore(currentTime) && unixDate == currentUnixTime) {
        newSlot.isPassed = true;
      }

      tslots.push(newSlot);
      start.add(60, "minutes");
    }

    // Checking for booked time slots
    tslots.forEach((slot: any) => {
      const isBooked = specialist?.bookedSlots?.some((bslot) => {
        const bslotDateTimestamp = new Date(bslot.date).getTime();
        const unixDateTimestamp = new Date(unixDate).getTime();

        return (
          bslotDateTimestamp === unixDateTimestamp &&
          bslot.slots.some((bslot) => bslot.startTime === slot.time)
        );
      });

      if (isBooked) {
        slot.isBooked = true;
      }
    });

    setFormatedDate(`${date} ${fullMonth} ${year}`);
    setSelectedDate(unixDate);
    setTimeSlots(tslots);
    setSelectedDay(day);

    if (calendarSlot) setSelectedSlot({ time: calendarSlot });
  };

  /**
   * Function handle appointment modal validations
   *
   * @returns {boolean} response
   */
  const validateAppoitmentData = () => {
    if (!selectedTreatment) {
      setMessage({
        type: "error",
        message: "Please select a treatment",
      });

      return true;
    }

    if (!selectedSlot) {
      setMessage({
        type: "error",
        message: "Please select a time slot for appointment",
      });

      return true;
    }

    if (!aptDuration) {
      setMessage({
        type: "error",
        message: "Please add a duration for appointment",
      });

      return true;
    }

    if (!addPat && !selectedPatient) {
      setMessage({
        type: "error",
        message: "Please select existing patient or add new",
      });

      return true;
    } else if (addPat) {
      if (newPatient?.name.trim() == "") {
        setMessage({
          type: "error",
          message: "Patient name is required",
        });

        return true;
      } else if (!validateEmail(newPatient?.email)) {
        setMessage({
          type: "error",
          message: "Email is not valid",
        });

        return true;
      } else if (!validatePhoneNumber(newPatient?.phone)) {
        setMessage({
          type: "error",
          message: "Phone number is not valid",
        });

        return true;
      } else {
        setMessage(null);
      }

      if (newPatient?.name) {
        setAllPatients((prev) => [...prev, newPatient]);
        setSelectedPatient((prev) => newPatient);
      }
    }

    return false;
  };

  /**
   * Fucntion to create new patient data
   *
   * @returns {Patient} patient data
   */
  const handleAddNewPatient = async () => {
    try {
      let formData = new FormData();

      if (newPatient) {
        formData.append("name", newPatient?.name);
        formData.append("email", newPatient?.email);
        formData.append("phone", newPatient?.phone);

        let apiRes = await createPatientsApi(formData);
        return apiRes.patient;
      }
    } catch (error: any) {
      throw new Error(
        error.message
          ? error.message
          : "Something went wrong while creating new patient please try again"
      );
    }
  };

  /**
   * Fucntion to create new appointment data
   *
   * @returns {Patient} patient data
   */
  const handleCreateNewApt = async (aptData: any) => {
    try {
      return await createAppointmentApi(aptData);
    } catch (error: any) {
      throw new Error(
        error.message
          ? error.message
          : "Something went wrong while adding new appointment, please try again"
      );
    }
  };

  // Helper function to add minutes to a time string using moment.js
  const addMinutesToTime = (time: string, minutes: number) => {
    return moment(time, "HH:mm").add(minutes, "minutes").format("HH:mm");
  };

  /**
   * Function to add new appointments after validations are done
   */
  const handleSave = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });

    try {
      let spt: Specialist | null = specialist ?? _.cloneDeep(specialist);
      let addedPatient: Patient | null = null;
      let slotRes;
      let aptRes;

      if (validateAppoitmentData()) {
        dispatch({ type: "SET_IS_LOADING", payload: false });
        return;
      }

      if (addPat) {
        addedPatient = await handleAddNewPatient();
      }

      let aptData = {
        specialist: specialist?.id,
        treatment: selectedTreatment,
        patient: addPat && addedPatient ? addedPatient : selectedPatient,
        metadata: {
          slot: selectedSlot.time,
          date: selectedDate,
          duration: aptDuration,
        },
      };

      aptRes = await handleCreateNewApt(aptData);

      // Adding selected time slot in specialist data
      // if date is already present then push in that slot otherwise create new slot
      if (selectedDate && aptRes) {
        let bookedSlots = spt?.bookedSlots;
        let slotAdded = false;

        // Default slot duration is 60 minutes.
        const defaultSlotDuration = 60; // in minutes
        const numberOfSlotsToAdd = parseInt(aptDuration) / defaultSlotDuration;

        // Generate an array of slots to add based on the duration
        let slotsToAdd: any = [];
        for (let i = 0; i < numberOfSlotsToAdd; i++) {
          const startTime = addMinutesToTime(
            selectedSlot.time,
            i * defaultSlotDuration
          );
          const newSlot = {
            startTime,
            endTime: addMinutesToTime(startTime, Number(aptDuration)),
            duration: aptDuration,
          };
          // Add the new slot if it's not already in the array
          if (!slotsToAdd.includes(newSlot)) {
            slotsToAdd.push(newSlot);
          }
        }
        // Loop through booked slots and add the selected slot(s)
        bookedSlots?.forEach((slot) => {
          if (slot.date === selectedDate) {
            slotsToAdd.forEach((timeSlot: any) => {
              if (!slot.slots.includes(timeSlot)) {
                slot.slots.push(timeSlot);
              }
            });
            slotAdded = true;
          }
        });

        // If the slot hasn't been added yet, create a new date entry
        if (spt && !slotAdded) {
          bookedSlots?.push({
            date: selectedDate,
            slots: slotsToAdd,
          });
        }

        // bookedSlots?.forEach((slot) => {
        //   if (slot.date == selectedDate) {
        //     slot.slots.push(selectedSlot);
        //     slotAdded = true;
        //   }
        // });

        // if (spt && !slotAdded) {
        //   bookedSlots?.push({
        //     date: selectedDate,
        //     slots: [selectedSlot],
        //   });
        // }

        slotRes = await bookedSlotsAPI({
          specialistId: specialist?.id,
          slots: bookedSlots,
        }); // slotRes is updated data of specialist
      }

      if (aptRes && slotRes) {
        let allApoointments =
          JSON.parse(localStorage.getItem("allApoointments")!) || [];

        allApoointments.push(aptData);
        let session = JSON.parse(localStorage.getItem("session")!);
        session.user = slotRes.specialist;
        localStorage.setItem("session", JSON.stringify(session));
        localStorage.setItem(
          "allApoointments",
          JSON.stringify(allApoointments)
        );

        dispatch({ type: "SET_APT_ADDED", payload: true });
        handleToggelAddAptModal();
      }
    } catch (error: any) {
      toast.error(
        error.message
          ? error.message
          : "Something went wrong, please try again",
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

  /**
   * Fucntion to get all patients data
   */
  const handleGetPatients = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });

    try {
      let pat: Patient[] = await getPatientsApi();
      if (pat.length > 0) setAllPatients(pat);
    } catch (error: any) {
      toast.error(
        error.message
          ? error.message
          : "Something went wrong while geting patients data, please refresh",
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

  // Function to generate custom Slots of 24 Hours
  function generateAvailableSlots() {
    try {
      const slots: string[] = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
          const formattedHour = String(hour).padStart(2, "0");
          const formattedMinute = String(minute).padStart(2, "0");
          slots.push(`${formattedHour}:${formattedMinute}`);
        }
      }
      setCustomSlots(slots);
      return slots;
    } catch (error) {}
  }

  function isTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string
  ): boolean {
    return !(end1 <= start2 || start1 >= end2);
  }

  // Main isOverLap function
  function isOverLap(time: string): boolean {
    const bookedSlots = specialist?.bookedSlots;
    if (!bookedSlots || bookedSlots.length === 0) return false;
    // Calculate the end time of the provided slot by adding aptDuration
    const slotEndTime = addMinutesToTime(time, Number(aptDuration));

    // Iterate over each bookedSlot for the given day
    return bookedSlots.some((bslot) => {
      if (bslot.date === selectedDate) {
        return bslot.slots.some((slot) => {
          const bookedStartTime = slot.startTime;
          const bookedEndTime = slot.endTime;

          // Check if the provided slot overlaps with the booked slot
          if (
            !isTimeOverlap(time, slotEndTime, bookedStartTime, bookedEndTime)
          ) {
            return false;
          } else {
            setMessage({
              type: "error",
              message:
                "Time slot is Overlaping with Existing Booked slot, please select another.",
            });
            return true;
          }
        });
      }
      // Return false if the booked slot's date does not match the selected date
      return false;
    });
  }

  /**
   * Adds a new time slot to the `timeSlots` state.
   *
   * - Validates the input time format ("HH:mm").
   * - Checks if the time slot already exists to avoid duplicates.
   * - Determines if the slot is booked based on overlap (`isOverLap`) and if it has passed (`isTimePassed`).
   * - Finds the correct position to insert the new time slot in the array based on the time order.
   * - If a duplicate slot is found, the state remains unchanged.
   * - Updates the selected time slot with the new slot and appends or inserts it in the correct position.
   *
   * @param {string} newTime - The new time slot in "HH:mm" format to be added.
   */

  const addTimeSlot = (newTime: string) => {
    setTimeSlots((prevTimeSlots) => {
      const moment = require("moment");
      const newSlotTime = moment(newTime, "HH:mm", true);
      if (!newSlotTime.isValid()) {
        throw new Error("Invalid time format. Use HH:mm in 24-hour format.");
      }

      const newSlot = {
        time: newSlotTime.format("HH:mm"),
        isBooked: isOverLap(newTime),
        isPassed: isTimePassed(newSlotTime.format("HH:mm")),
      };

      setSelectedSlot({ time: newTime });
      let isExceedTimeLimit = exceedTimeLimit(newTime, Number(aptDuration));
      if (newSlot.isBooked || newSlot.isPassed || isExceedTimeLimit)
        return prevTimeSlots;
      // Find the index for insertion
      const insertIndex = prevTimeSlots.findIndex((slot) =>
        moment(slot.time, "HH:mm", true).isAfter(newSlotTime)
      );

      // Check if the slot already exists
      const isDuplicate = prevTimeSlots.some(
        (slot) => slot.time === newSlotTime.format("HH:mm")
      );

      if (isDuplicate) {
        // Return current state if duplicate found
        return prevTimeSlots;
      }
      if (insertIndex === -1) {
        // Append if no later slot is found
        return [...prevTimeSlots, newSlot];
      }
      // Insert the new slot at the correct position
      return [
        ...prevTimeSlots.slice(0, insertIndex),
        newSlot,
        ...prevTimeSlots.slice(insertIndex),
      ];
    });
  };

  /**
   * Determines if a given time (in HH:mm format) has already passed relative to the current time.
   *
   * @param {string} Time - The time to check, in "HH:mm" 24-hour format.
   * @returns {boolean} - Returns `true` if the provided time has passed today, `false` otherwise.
   */
  const isTimePassed = (Time: string): boolean => {
    const start = moment(Time, "HH:mm");
    const currentUnixTime = moment().startOf("day").unix();
    const unixDate = selectedDate;
    const currentTime = moment();

    if (start.isBefore(currentTime) && unixDate == currentUnixTime) {
      return true;
    }
    return false;
  };
  /**
   * Checks if the calculated end time exceeds the 24-hour limit (1440 minutes).
   *
   * The function parses the given start time, calculates the total minutes from midnight,
   * adds the provided duration, and checks if the resulting end time exceeds the 24-hour limit.
   *
   * @param startTime - The starting time in "HH:mm" format.
   * @param duration - The duration in minutes to be added to the start time.
   * @returns true if the end time exceeds 1440 minutes, otherwise false.
   */
  function exceedTimeLimit(startTime: string, duration: number): boolean {
    const time = moment(startTime, "HH:mm", true);
    if (!time.isValid()) {
      return true;
    }
    const [hours, minutes] = startTime.split(":").map(Number);
    const startTimeInMinutes = hours * 60 + minutes;
    const endTimeInMinutes = startTimeInMinutes + duration;
    return endTimeInMinutes > 1440;
  }

  // whenEver the Date change it will genrate the time slot for that date
  useEffect(() => {
    if (selectedDate) {
      generateAvailableSlots();
    }
  }, [selectedDate]);

  /**
   * UseEffect to get patient's data
   */
  useEffect(() => {
    handleGetPatients();
  }, []);

  /**
   * UseEffect to validate custom slot
   */
  useEffect(() => {
    if (!selectedSlot) {
      return;
    }
    let OverLapCheck: boolean = isOverLap(selectedSlot.time);
    const unixDate = moment().startOf("day").unix();
    const selectedTime = moment(selectedSlot.time, "HH:mm"); // Strict parsing of the time string
    const currentTime = moment(); // Get the current date and time
    // Checking for booked time slots
    const isBooked = specialist?.bookedSlots?.some((bslot) => {
      const bslotDateTimestamp = new Date(bslot.date).getTime();
      const unixDateTimestamp = new Date(unixDate).getTime();

      return (
        bslotDateTimestamp === unixDateTimestamp &&
        bslot.slots.includes(selectedSlot.time)
      );
    });
    let isExceedTimeLimit = exceedTimeLimit(
      selectedSlot.time,
      Number(aptDuration)
    );
    if (isBooked) {
      setMessage({
        type: "error",
        message: "Time slot is already booked, please select another.",
      });
      setSelectedSlot(null);
    } else if (selectedTime.isBefore(currentTime) && unixDate == selectedDate) {
      setMessage({
        type: "error",
        message: "Time slot is invalid, please select another.",
      });
      setSelectedSlot(null);
    } else if (OverLapCheck) {
      setMessage({
        type: "error",
        message:
          "Time slot is Overlaping with Existing Booked slot, please select another.",
      });
      setSelectedSlot(null);
    } else if (isExceedTimeLimit) {
      setMessage({
        type: "error",
        message:
          "Time slot is exceeding today's Limit, please reduce Duration or Time.",
      });
      setSelectedSlot(null);
    } else {
      setMessage(null);
    }
  }, [selectedSlot, aptDuration]);

  // useeffect to set time and date for appointment if clicked from schdule calendar
  useEffect(() => {
    let calSlot = calendarSlot;

    if (
      calendarDate &&
      !selectedDate &&
      calendarSlot &&
      !selectedSlot &&
      specialist
    ) {
      if (calendarSlot.includes("30")) {
        calSlot = calendarSlot.split(":")[0].concat(":00");
      }
      handleDateChange(moment(calendarDate, "DD-MM-YYYY").toDate(), calSlot);
    }
  }, [calendarDate, calendarSlot, specialist]);

  /**
   * UseEffect to get treatments from specialist
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);
      let spt = session.user;
      let trts: Treatment[] = [];

      if (spt) {
        setSpecialist(spt);

        spt.services.forEach((service: any) => {
          if (service.treatments.length > 0) {
            trts.push(...service.treatments);
          }
        });
      }

      if (trts.length > 0) {
        setTreatments(trts);
      }
    }
  }, []);

  return (
    <AddAppointmentsUI
      selectedTreatment={selectedTreatment}
      selectedPatient={selectedPatient}
      setAllPatients={setAllPatients}
      allPatients={allPatients}
      newPatient={newPatient}
      treatments={treatments}
      message={message}
      addPat={addPat}
      timeSlots={timeSlots}
      aptDuration={aptDuration}
      selectedDate={selectedDate}
      formatedDate={formatedDate}
      selectedDay={selectedDay}
      selectedSlot={selectedSlot}
      setSelectedSlot={setSelectedSlot}
      handleTreatmentSelection={handleTreatmentSelection}
      handlePatientSelection={handlePatientSelection}
      handleShowAddApt={handleToggelAddAptModal}
      toggleAddPatient={toggleAddPatient}
      setNewPatient={setNewPatient}
      handleSave={handleSave}
      setAptDuration={setAptDuration}
      handleDateChange={handleDateChange}
      handleBlur={handleBlur}
      durationError={durationError}
      customSlots={customSlots}
      isOverLap={isOverLap}
      addTimeSlot={addTimeSlot}
    />
  );
};

export default AddAppointment;
