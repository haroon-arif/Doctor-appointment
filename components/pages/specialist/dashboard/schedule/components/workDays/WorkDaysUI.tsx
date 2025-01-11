import Calendar from "react-calendar";
import moment from "moment";
import React from "react";
import clsx from "clsx";
import _ from "lodash";

// Icons
import { Info, Trash2 } from "lucide-react";

// Css styles
import "react-calendar/dist/Calendar.css";
import "./style.css";

// Custom file and component imports
import StatusMessage from "@/components/UI/message/StatusMessage";
import RadioButton from "@/components/UI/button/RadioButton";
import Dropdown from "@/components/UI/dropdown/Dropdown";
import Button from "@/components/UI/button/Button";
import { durationOpts } from "@/config/contants";
import Modal from "@/components/UI/modal/Modal";

// Define types
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
interface RadioOpts {
  key: string;
  label: string;
  selected: boolean;
}

interface Props {
  workingDays: WorkingDays[];
  isWorkDayOpts: RadioOpts[];
  wdTypeOpts: RadioOpts[];
  formatedDate: string | null;
  selectedDay: string | null;
  message: Message | null;
  handleRemvoeDuration: (wdIndex: number, durIndex: number) => void;
  handleWorkDayType: (key: string, wdIndex: number) => void;
  handleAddDuration: (wdIndex: number) => void;
  handleDateChange: (value: any) => void;
  tileClassName: (date: any) => string;
  handleWDType: (key: string) => void;
  handleCloseEditWD: () => void;
  handleSave: () => void;
  handleSetDuration: (
    wdIndex: number,
    durIndex: number,
    duration: any,
    type: string
  ) => void;
}

const WorkDaysUI = ({
  handleRecurring,
  recurringOpts,
  workingDaysReadState,
  selectedDate,
  handleRemoveWeek,
  handleRemoveDay,
  totalWorkingDays,
  isWorkDayOpts,
  formatedDate,
  workingDays,
  selectedDay,
  wdTypeOpts,
  message,
  handleRemvoeDuration,
  handleSetDuration,
  handleWorkDayType,
  handleCloseEditWD,
  handleAddDuration,
  handleDateChange,
  tileClassName,
  tileClassNames,
  handleWDType,
  handleSave,
}: Props) => {
  console.log("workingDaysReadState", workingDaysReadState);
  return (
    <Modal header="Edit workdays" close={handleCloseEditWD} modalWidth={816}>
      {/* Work days UI */}
      <div
        className={clsx(
          "w-full flex items-start justify-between gap-8",
          "max-md:flex-col"
        )}
      >
        {/* Select date from calender*/}
        <div className={clsx("w-[350px]", "max-md:w-full")}>
          <div
            className={clsx("flex flex-col items-start justify-center gap-4")}
          >
            <h2 className="text-800 text-[15px] font-semibold leading-[15px]">
              Set workdays for
            </h2>
            <RadioButton
              name="wdType"
              options={wdTypeOpts}
              onChange={handleWDType}
            />
          </div>

          {/* Calendar */}
          <div className="w-full mt-4">
            <Calendar
              onChange={(value) => handleDateChange(value)}
              value={moment().startOf("day").toDate()}
              className={clsx("custom-calendar mx-auto", " max-md:!p-0")}
              tileClassName={({ date }: { date: any }) => tileClassName(date)}
              formatShortWeekday={(locale, date) =>
                date
                  .toLocaleDateString(locale, { weekday: "short" })
                  .slice(0, 2)
              }
              formatMonthYear={(locale, date) =>
                date.toLocaleDateString(locale, {
                  month: "short",
                  year: "numeric",
                })
              }
            />
          </div>
        </div>

        {/* Add durations for the selected day or date */}
        <div className={clsx("w-[370px]", " max-md:w-full")}>
          <div
            className={clsx(
              "w-full flex flex-col items-center justify-center gap-4 my-4"
            )}
          >
            <div
              className={clsx(
                "w-full flex flex-col items-center justify-start gap-4"
              )}
            >
              {/* Select work day on or off */}
              {workingDaysReadState && (
                <div
                  className={clsx(
                    "w-full flex flex-col items-start justify-center gap-4"
                  )}
                >
                  <div className="text-800 text-[15px] leading-[15px] flex flex-col gap-2">
                    <span className="font-semibold">Working hours for</span>
                    <span className="flex items-center justify-center gap-1">
                      {workingDaysReadState.workingHoursFor?.length &&
                        workingDaysReadState.workingHoursFor?.map(
                          (hour, index) => (
                            <span key={hour}>
                              {workingDaysReadState.workingHoursFor.length ==
                                2 &&
                                workingDaysReadState.workingHoursFor.length -
                                  1 ==
                                  index &&
                                " - "}
                              <span className="px-2 py-1 rounded-md bg-100 text-[12px] font-medium">
                                {hour}
                              </span>
                            </span>
                          )
                        )}
                    </span>
                  </div>

                  <div
                    className={clsx(
                      "w-full flex items-center justify-end gap-4"
                    )}
                  >
                    <RadioButton
                      name="isWd"
                      options={isWorkDayOpts}
                      onChange={(key: string) => handleWorkDayType(key, 0)}
                    />

                    <button
                      onClick={() => {
                        if (workingDaysReadState.isAllWeek) {
                          handleRemoveWeek(workingDaysReadState);
                        } else {
                          handleRemoveDay(workingDaysReadState);
                        }
                      }}
                      className={clsx(
                        "w-[130px] text-right text-accent/90 text-[12px] font-semibold leading-[15px] cursor-pointer hover:text-accent/100 transition-all duration-300",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      {workingDaysReadState.isAllWeek
                        ? "Remove Week"
                        : "Remove Day"}
                      <span
                        title={`This action will remove the current ${
                          workingDaysReadState.isAllWeek ? "week" : "day"
                        } from schedule`}
                      >
                        <Info size={10} />
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Durations */}
              <div
                className={clsx(
                  "w-full h-[300px] pr-2 flex flex-col items-center justify-start gap-2 overflow-y-auto overflowY overflow-x-hidden",
                  "max-md:h-auto"
                )}
              >
                {workingDaysReadState &&
                  workingDaysReadState?.durations?.length > 0 &&
                  workingDaysReadState.durations.map((duration, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "w-full flex items-center justify-center gap-2"
                      )}
                    >
                      {/* Working hours */}
                      <div
                        className={clsx(
                          "w-full flex items-center justify-center gap-2"
                        )}
                      >
                        <Dropdown
                          label="Start Time"
                          items={durationOpts}
                          selection={duration.startTime}
                          itemSelection={(dur: any) =>
                            handleSetDuration(
                              "startTime",
                              index,
                              dur.value,
                              duration.endTime
                            )
                          }
                          labelStyle={
                            "w-full py-[14px] px-4 text-900 bg-white rounded-xl border border-stroke"
                          }
                          itemsContainerStyles={"top-full left-[0px]"}
                        />

                        <span className="w-[20px] h-[1px] bg-800 rounded-full" />

                        <Dropdown
                          label="End Time"
                          items={durationOpts}
                          selection={duration.endTime}
                          itemSelection={(dur: any) =>
                            handleSetDuration(
                              "endTime",
                              index,
                              duration.startTime,
                              dur.value
                            )
                          }
                          labelStyle={
                            "w-full py-[14px] px-4 text-900 bg-white rounded-xl border border-stroke"
                          }
                          itemsContainerStyles={"top-full left-[0px]"}
                        />
                      </div>

                      {/* Delete */}
                      <div className={clsx("w-12 h-12")}>
                        <Button
                          onClick={() =>
                            handleRemvoeDuration(workingDaysReadState, index)
                          }
                          bg="transparent"
                          className="py-[12px] px-[14px]"
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Select work day recurring or one time */}
              {workingDaysReadState && (
                <div
                  className={clsx("w-full flex items-center justify-end gap-4")}
                >
                  <RadioButton
                    name="recurringType"
                    options={recurringOpts}
                    onChange={(key: string) => handleRecurring(key, 0)}
                  />

                  <button
                    onClick={() => handleAddDuration(workingDaysReadState)}
                    className={clsx(
                      "w-[120px] text-sm text-right text-accent/90 text-[12px] font-semibold leading-[15px] cursor-pointer hover:text-accent/100 transition-all duration-300",
                      !workingDaysReadState.isWorking &&
                        "pointer-events-none opacity-50"
                    )}
                  >
                    Add a row
                  </button>
                </div>
              )}
            </div>
          </div>

          {message && (
            <div className="w-full mt-10">
              <StatusMessage
                message={message.message}
                type={message.type}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        className={clsx(
          "w-full pt-6 flex items-center justify-between gap-2",
          " max-md:flex-col"
        )}
      >
        {/* Work days */}
        <div
          className={clsx(
            "w-[70%]",
            "flex items-center justify-start gap-6",
            "max-md:w-full"
          )}
        >
          {/* Total work days */}
          <div
            className={clsx(
              "w-[120px]",
              "flex items-center justify-center gap-2"
            )}
          >
            <span className="w-8 h-8 py-[1px] text-accent text-[15px] font-semibold flex items-center justify-center bg-background-lite rounded-xl">
              {totalWorkingDays}
            </span>
            <span className="text-900 text-[12px] font-medium">Work Day</span>
            <span
              title={`Total working days for the current selected week`}
              className="text-accent/100"
            >
              <Info className="size-3 cursor-pointer" />
            </span>
          </div>

          {/* Total off days */}
          <div
            className={clsx(
              "w-[120px]",
              "flex items-center justify-center gap-2"
            )}
          >
            <span className="w-8 h-8 py-[1px] text-400 text-[15px] font-semibold flex items-center justify-center bg-100 rounded-xl">
              {7 - totalWorkingDays}
            </span>
            <span className="text-900 text-[12px] font-medium">Day Off</span>
            <span
              title={`Total off days for the current selected week`}
              className="text-accent/100"
            >
              <Info className="size-3 cursor-pointer" />
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div
          className={clsx(
            "w-[30%] flex items-center justify-center gap-2",
            "max-md:w-full"
          )}
        >
          <Button
            onClick={handleCloseEditWD}
            bg="transparent"
            className="py-4 px-6"
          >
            Close
          </Button>
          <Button onClick={handleSave} bg="fill" className="py-4 px-6">
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkDaysUI;
