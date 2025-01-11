"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

// Custom component and files
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import AdminMenu from "./components/AdminMenu";
import Dashboard from "./dashbaord/Dashboard";
import TopNav from "./components/TopNav";
import Reviews from "./reviews/Reviews";
import Schedule from "./schedule";
import Settings from "./settings";
import Inbox from "./inbox/Inbox";
import AddAppointment from "./schedule/components/appointment/AddAppointment";
import WorkDays from "./schedule/components/workDays/WorkDays";

// Define Types
interface Schedule {
  date: string;
  slot: string;
}

/**
 * Component to handle dashboard menu components
 *
 * @returns {JSX.Element} - Renders the settings menu component
 */
const Index = () => {
  // React states
  const [activeAdminMenu, setActiveAdminMenu] = useState("Dashboard");
  const [showAptModal, setShowAptModal] = useState(false);
  const [showWorkDaysModal, setShowWorkDaysModal] = useState(false);
  // appointment state
  const [appointmentSchedule, setAppointmentSchedule] = useState<Schedule>({
    date: "",
    slot: "",
  });

  // Hooks
  const { dispatch } = useAppHook();
  const router = useRouter();

  // useEffect hook to get session and authenticate user
  useEffect(() => {
    dispatch({ type: "SET_IS_LOADING", payload: true });

    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);
      if (!session) {
        router.push("/");
      } else {
        dispatch({ type: "SET_IS_LOADING", payload: false });
      }
    }
  }, []);

  // useEffect hook to setup active admin menu page
  useEffect(() => {
    if (typeof window !== "undefined") {
      let activeDbMenu = localStorage.getItem("active_db_menu");

      if (activeDbMenu) {
        setActiveAdminMenu(activeDbMenu);
      }
    }
  }, []);
  // this useEffect check if modal close then make the Appointment as empty
  useEffect(() => {
    if (!showAptModal) {
      setAppointmentSchedule((prev) => {
        return { ...prev, date: "", slot: "" };
      });
    }
  }, [showAptModal]);

  return (
    <div className="w-full bg-background-primary min-h-screen">
      <TopNav />

      <div
        className={clsx(
          "w-full relative flex items-center justify-center",
          "max-lg:px-2"
        )}
      >
        <AdminMenu
          activeAdminMenu={activeAdminMenu}
          setActiveAdminMenu={setActiveAdminMenu}
        />

        {/* Admin menu components */}
        <div
          className={clsx(
            "w-[93dvw] mt-[4.2rem] ml-[7dvw] mr-2 mb-5 z-10 min-h-[85dvh] bg-white px-8 py-8 rounded-2xl overflow-hidden",
            "max-lg:w-full max-lg:ml-0 max-lg:mr-0 max-lg:px-[16px] max-lg:mb-[104px]",
            "max-md:mt-[6rem]  max-md:px-[8px] max-md:mb-[72px]"
          )}
        >
          {activeAdminMenu == "Dashboard" && <Dashboard />}
          {activeAdminMenu == "Schedule" && (
            <Schedule
              setShowAptModal={setShowAptModal}
              setAppointmentSchedule={setAppointmentSchedule}
              setShowWorkDaysModal={setShowWorkDaysModal}
            />
          )}
          {activeAdminMenu == "Settings" && <Settings />}
          {activeAdminMenu == "Reviews" && <Reviews />}
          {activeAdminMenu == "Inbox" && <Inbox />}
        </div>
      </div>
      {/* Schedule Appintment modal */}
      {showAptModal && (
        <AddAppointment
          setShowAptModal={setShowAptModal}
          calendarDate={appointmentSchedule.date}
          calendarSlot={appointmentSchedule.slot}
        />
      )}

      {/* Specialist work days modal */}
      {showWorkDaysModal && (
        <WorkDays closeModal={() => setShowWorkDaysModal(false)} />
      )}
    </div>
  );
};

export default Index;
