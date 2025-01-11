import Button from "@/components/UI/button/Button";
import Image from "next/image";
import React from "react";
import clsx from "clsx";
// Icons
import { X } from "lucide-react";
import NetworkLoading from "@/public/specialist/top-nav/NetworkLoading.svg";
import MessageIcon from "@/public/specialist/top-nav/MessageIcon.svg";
// Import component and utilitiwa
import Modal from "@/components/UI/modal/Modal";
import NotifcationModal from "./NotifcationModal";
// define types
interface Props {
  toggleNotification: () => void;
}
const NotificationBar = ({ toggleNotification }: Props) => {
  // this variable remove by actual error state
  const error = false;
  // notification variable replace with actual notification
  let notification: any[] = [
    { length: 1 },
    { length: 2 },
    { length: 3 },
    { length: 4 },
    { length: 5 },
  ];

  return (
    <NotifcationModal
      notification={notification}
      error={error}
      toggleNotification={toggleNotification}
    >
      {error ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className=" h-[204px] w-[334px] text-center">
            <div className="flex justify-center items-center">
              <Image
                src={NetworkLoading}
                width={56}
                height={56}
                alt="Loading"
                className="animate-spin"
              />
            </div>
            <div>Connection Porblem</div>
            <div>
              Poor network connection detected. Please check your connectivity
            </div>
            <Button className=" h-fit">RETRY</Button>
          </div>
        </div>
      ) : // NOtication row
      notification?.length > 0 ? (
        notification.map((val, index) => {
          return (
            <div className="flex rounded-xl px-3 py-[12px] hover:bg-[#f5f4ff] h-fit min-h-[60px]">
              <div className="w-[10%] ">
                <div className="w-[10px] h-[10px] bg-[#08b6f0] rounded-full border-[2px] border-background-primary "></div>
              </div>
              <div className=" w-[80%] ">
                <div className="text-[13px] leading-[18px]">Comment here</div>
                <div className="flex gap-7">
                  <div className="text-[11px] text-[#626f93]">name</div>
                  <div className=" text-[11px] text-[#626f93]">Time</div>
                </div>
              </div>
              <div className=" w-[10%] flex justify-center items-center cursor-pointer">
                <X className=" w-[18px] h-[18px] hover:text-accent" />
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <div className=" h-[204px] w-[334px] text-center">
            <div className="flex justify-center items-center">
              <Image
                src={MessageIcon}
                width={56}
                height={56}
                alt="Loading"
                className="Message Icon"
              />
            </div>
            <div className=" text-text-dark">No notifications yet</div>
            <div className=" text-text-muted">
              Stay tuned! Notifications about your activity will show up here
            </div>
          </div>
        </div>
      )}
    </NotifcationModal>
  );
};

export default NotificationBar;
