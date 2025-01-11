import { Plus, Wrench } from "lucide-react";
import React, { useEffect, useState } from "react";
import clsx from "clsx";

// Custom file and component imports
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import Dropdown from "@/components/UI/dropdown/Dropdown";
import Button from "@/components/UI/button/Button";

// Define types
interface Treatment {
  id: "";
  name: "";
  duration: "";
  price: "";
}
interface Options {
  key: string;
  value: string;
}

interface Props {
  setSelectedTreatment: any;
  setShowAptModal: any;
  setShowWorkDaysModal: any;
}

/**
 * Component to show schedule section's top bar and menu items
 *
 * @returns {JSX.Element} - Renders component's UI
 */
const Topbar = ({
  setShowAptModal,
  setSelectedTreatment,
  setShowWorkDaysModal,
}: Props) => {
  // React states
  const [treatments, setTreatments] = useState<Treatment[] | null>(null);
  const [trtOpts, setTrtOpts] = useState<Options[] | undefined>([]);

  // Hooks
  const { state, dispatch } = useAppHook();

  /**
   * Function to show work days modal
   */
  const handleShowWD = () => {
    setShowWorkDaysModal(true);
  };

  /**
   * Function to show  appointment modal
   */
  const handleShowAddApt = () => {
    setShowAptModal(true);
  };

  /**
   * Function to get dropdown options
   */
  const handleGetDropdownOpts = () => {
    let opts: Options[] | undefined = treatments?.map((trt) => ({
      key: trt?.id,
      value: trt?.name,
    }));

    opts?.unshift({ key: "all", value: "All Treatments" });
    setTrtOpts(opts);
  };

  /**
   * Function to handle dropdown options selection for treatments
   */
  const handleTrtSelecion = (selectedTrt: Options) => {
    if (selectedTrt.key == "all") {
      setSelectedTreatment(selectedTrt);
    } else {
      let trt = treatments?.filter((trt) => trt.id == selectedTrt.key)[0];
      setSelectedTreatment(trt);
    }
  };

  /**
   * UseEffect to get treatments from specialist
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);
      let spt = session.user;
      let trts: Treatment[] = [];

      if (spt) {
        spt?.services?.forEach((service: any) => {
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

  useEffect(() => {
    handleGetDropdownOpts();
  }, [treatments]);

  return (
    <div
      className={clsx(
        "w-full",
        "flex items-center justify-between",
        "max-md:flex-col max-md:justify-center"
      )}
    >
      <h2 className={clsx("text-3xl font-bold text-800", "max-md:text-xl")}>
        Schedule
      </h2>
      <div
        className={clsx(" hidden", "max-md:block max-md:invisible max-md:h-11")}
      >
        Formated date View
      </div>

      {/* Menu */}
      <div
        className={clsx(
          "flex items-center justify-center gap-4",
          "max-md:-full max-md:flex-wrap"
        )}
      >
        {/* Treatments filter */}
        {trtOpts && trtOpts.length > 0 && (
          <Dropdown
            label="All Treatments"
            search={true}
            items={trtOpts}
            selection={""}
            itemSelection={handleTrtSelecion}
            labelStyle={
              "!w-[172px] bg-white py-[15px] px-[16px] text-500 text-sm rounded-xl border border-stroke gap-1 border-[1px] max-md:!w-full"
            }
            labelSelectedStyle={""}
            itemsContainerStyles={"top-full left-[0px] w-full"}
            iconStyle={"size-5"}
          />
        )}

        {/* Add appointment */}
        <div className={clsx("w-full", "max-md:w-fit")}>
          <Button
            onClick={handleShowAddApt}
            bg="fill"
            className={clsx("py-[12px] px-6", "max-md:w-[249px]")}
          >
            <span
              className={clsx(
                "flex items-center justify-center gap-2 text-sm font-bold",
                "max-md:px-[59px]"
              )}
            >
              <Plus strokeWidth={2.5} className="size-6" />
              <span>Appointment</span>
            </span>
          </Button>
        </div>

        {/* Edit work days button */}
        <div className={clsx("w-12", "max-md:flex")}>
          <Button
            onClick={handleShowWD}
            bg="transparent"
            className={clsx(
              "py-[12px] px-[0.88rem]",
              "max-md:w-12 max-md:h-12 max-md:p-3"
            )}
          >
            <Wrench className="size-6 transform -scale-x-100" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
