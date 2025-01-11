"use client";

import clsx from "clsx";
import { Bell } from "lucide-react";
import React, { forwardRef, useState } from "react";
import NotificationBar from "./NotificationBar";

// Define types
interface Bell {
  newNotifications: boolean;
}

/**
 * Notification UI component that displays a notification bell icon.
 * It indicates the presence of new notifications by changing its appearance or behavior.
 *
 * @param {Object} param0 - Component props.
 * @param {boolean} param0.newNotifications - A boolean indicating if there are new notifications.
 *
 * @returns {JSX.Element} - The rendered UI for the notification bell.
 */
const NotificationUi = ({ newNotifications }: Bell) => {
  return <NotiBell newNotifications={newNotifications} />;
};

/**
 * NotiBell component renders a notification bell icon with a reference to the DOM element.
 * It uses React's `forwardRef` to allow the parent component to access the underlying DOM element.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.newNotifications - A boolean that indicates if there are new notifications.
 * @param {React.Ref<HTMLDivElement>} ref - A forwarded ref to access the root div element of the notification bell.
 *
 * @returns {JSX.Element} - The rendered notification bell component.
 */
const NotiBell = forwardRef<HTMLDivElement, Bell>(
  ({ newNotifications, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle the notification visibility
    const toggleNotification = () => {
      setIsOpen(!isOpen);
    };
    return (
      <>
        <div ref={ref} {...props} className="relative cursor-pointer">
          <Bell
            strokeWidth={2.5}
            className="w-[22px] text-accent"
            onClick={toggleNotification}
          />

          {newNotifications && (
            <div className="w-[10px] h-[10px] absolute top-[2px] right-[2px] bg-error rounded-full border-[2px] border-background-primary" />
          )}
          {/* Notification Modal */}
        </div>
        {isOpen && <NotificationBar toggleNotification={toggleNotification} />}
      </>
    );
  }
);

export default NotificationUi;
