"use client";

import clsx from "clsx";
import React, { useState } from "react";

// Custom file and component imports
import AddAppointment from "./components/appointment/AddAppointment";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import AptCalender from "./components/calender/AptCalender";
import WorkDays from "./components/workDays/WorkDays";
import Topbar from "./components/Topbar";

// Define types
interface Treatment {
  id: "";
  name: "";
  duration: "";
  price: "";
}
interface Schedule {
  date: string;
  slot: string;
}
interface Props {
  setShowAptModal: (value: boolean) => void; // Simplified function type
  setShowWorkDaysModal: (value: boolean) => void; // Simplified function type
  setAppointmentSchedule: React.Dispatch<React.SetStateAction<Schedule>>; // State updater function type
}

/**
 * Component to handle schduled and add appointments and specialist work days
 *
 * @returns {JSX.Element} - Renders the schedule component
 */

const index = ({
  setShowAptModal,
  setAppointmentSchedule,
  setShowWorkDaysModal,
}: Props) => {
  // React states
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment>();
  // Hooks
  const { state, dispatch } = useAppHook();

  return (
    <div
      className={clsx(
        "w-full flex flex-col items-center justify-center gap-[18px] "
      )}
    >
      <Topbar
        setSelectedTreatment={setSelectedTreatment}
        setShowAptModal={setShowAptModal}
        setShowWorkDaysModal={setShowWorkDaysModal}
      />

      {/* Calendar */}
      {/* <AptCalender
        selectedTreatment={selectedTreatment}
        setShowAptModal={setShowAptModal}
        setAppointmentSchedule={setAppointmentSchedule}
      /> */}

      {/* Specialist work days modal */}
      {/* {showWorkDaysModal && (
        <WorkDays setShowWorkDaysModal={setShowWorkDaysModal} />
      )} */}

      {/* Add new apoointment modal */}
      {/* {showAptModal && <AddAppointment setShowAptModal={setShowAptModal} />} */}
    </div>
  );
};

export default index;
