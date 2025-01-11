import clsx from "clsx";
import React from "react";
interface Props {
  children: React.ReactNode;
  toggleNotification: () => void;
  error: any;
  notification: Array<object>;
}
const NotifcationModal = ({
  children,
  toggleNotification,
  error,
  notification,
}: Props) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-[22%] z-10"
        onClick={toggleNotification} // Clicking on overlay closes notification
      ></div>
      {/* Notification bar - positioned below the bellbutton */}
      <div
        className={clsx(
          "absolute mt-4 bg-white shadow-lg z-30 before:content-[''] before:absolute before:-top-2 before:left-8 before:border-8 before:border-transparent before:border-b-white rounded-2xl  w-[526px] right-[237px] top-[60%]  h-[318px] flex flex-col",
          "max-lg:right-14",
          "max-md:top-[40%] max-md:w-full max-md:right-0 max-md:h-[calc(100vh-62px)]"
        )}
      >
        {" "}
        <div
          className={clsx(
            "absolute -top-2 lg:right-[4%] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white",
            "max-lg:right-[3.5%]",
            "max-md:right-[54px]"
          )}
        ></div>
        <div className=" flex justify-between m-4">
          <p className="text-gray-800 text-base font-medium">
            Notification
            {notification.length > 0 && " (43)"}{" "}
          </p>

          <div
            className={clsx(
              "text-[13px] font-medium",
              notification.length > 0 ? "text-accent" : ""
            )}
          >
            Clear All
          </div>
        </div>
        <hr />
        {/* Notification COntainer */}
        <div
          className={clsx(
            " m-4 relative  flex-grow ",
            !error && notification.length > 0 ? "overflow-y-auto overflowY" : ""
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default NotifcationModal;
