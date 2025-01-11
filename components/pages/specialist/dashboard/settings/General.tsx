"use client";

import React, { useEffect, useRef, useState } from "react";
import { TbEdit } from "react-icons/tb";
import clsx from "clsx";
import Image from "next/image";
import _ from "lodash";

// Images
import avatar from "@/public/specialist/settings/general/profile-avatar.webp";

// Import component and utilitiwa
import StatusMessage from "@/components/UI/message/StatusMessage";
import SettingsContainer from "./components/SettingsContainer";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import Button from "@/components/UI/button/Button";
import QMCerts from "./components/general/QMCerts";
import Label from "./components/general/Label";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateSpecialistAPI } from "@/components/utilis/api/specialistApi";
import { UserRoundPlus } from "lucide-react";

// Define types
interface User {
  id: string;
  profileImage: string;
  name: string;
  about: string;
  location: string;
  qualityMarks: [];
  clinic: string;
  clinicAddress: string;
  [key: string]: any;
}

// Initial state
const USER: User = {
  id: "",
  profileImage: "",
  name: "",
  about: "",
  location: "",
  qualityMarks: [],
  clinic: "",
  clinicAddress: "",
};

/**
 * Settings menu general component
 *
 * @returns {JSX.Element} - Renders the settings menu component
 */
const General = () => {
  // React states
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState<User>(USER);

  // Hooks
  const imgRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useAppHook();
  const router = useRouter();

  /**
   * Handles input changes for form elements.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object
   */
  const handleInput = (e: any) => {
    let { name, value } = e.target;
    let _user = _.cloneDeep(user);

    _user[name] = value;

    setUser(_user);
  };

  /**
   * Function to handle user profile image.
   */
  const handleProfileImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Handles the save operation for the user data.
   *
   * @returns {Promise<void>} A promise that resolves when the save operation is complete.
   */
  const handleSave = async () => {
    // Validations
    if (user.name.trim() == "") {
      setErrorMessage("Name cannot be empty");
      return;
    } else if (user.about.trim() == "") {
      setErrorMessage("About cannot be empty");
      return;
    } else {
      setErrorMessage("");
    }

    dispatch({ type: "SET_IS_LOADING", payload: true });

    try {
      let session = JSON.parse(localStorage.getItem("session")!);

      let formData = new FormData();

      formData.append("specialistId", user.id);
      formData.append("name", user.name);
      formData.append("about", user.about);

      if (profileImg) {
        const response = await fetch(profileImg);
        const blob = await response.blob();
        formData.append("profileImage", blob, "profileImage.png");
      }

      let apiRes = await updateSpecialistAPI(formData);

      if (apiRes) {
        session.user = apiRes.specialist;
        localStorage.setItem("session", JSON.stringify(session));
        dispatch({ type: "SET_PROFILE_UPDATED", payload: true });

        toast.success("Profile updated successfully", {
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

  // useEffect hook to get specialist data
  useEffect(() => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);

      if (session) {
        setUser(session.user);
      } else {
        router.push("/");
      }
    }
  }, []);

  return (
    <SettingsContainer>
      {/* Header */}
      <div className={clsx("text-700 text-xl font-bold")}>General</div>

      {/* Profile image */}
      <div
        className={clsx("w-full flex flex-col items-start justify-start gap-4")}
      >
        <Label label="Profile Image" className="font-medium" />

        <div className={clsx("flex items-center justify-start gap-5")}>
          <div
            className={clsx(
              "w-24 h-24 rounded-full overflow-hidden border-[2px] border-accent flex items-center justify-center"
            )}
          >
            {(profileImg || (user && user.profileImage)) && (
              <Image
                className="w-full h-full p-[2px] object-cover"
                src={profileImg || user.profileImage}
                height={300}
                width={300}
                alt="profile image"
              />
            )}
            {!profileImg && !user.profileImage && (
              <Image
                className="w-full h-full p-[2px] object-cover"
                src={avatar}
                height={300}
                width={300}
                alt="profile image"
              />
            )}
          </div>

          <Button
            onClick={() => {
              if (imgRef.current) {
                imgRef.current.click();
              }
            }}
            bg="transparent"
            className="py-3 px-4"
          >
            <input
              type="file"
              ref={imgRef}
              accept="image/*"
              onChange={handleProfileImgUpload}
              className="hidden"
            />

            <span className={clsx("flex items-center justify-center gap-2")}>
              <TbEdit className="text-[20px]" />
              <span className={clsx("")}>Update</span>
            </span>
          </Button>
        </div>
      </div>

      {/* Name */}
      <div
        className={clsx("w-full flex flex-col items-start justify-start gap-4")}
      >
        <Label label="Name" className="font-medium" />

        <input
          type="text"
          placeholder="Full Name"
          value={user.name}
          onChange={handleInput}
          name="name"
          className={clsx(
            "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-900",
            "outline-none border border-stroke focus-within:border-accent",
            "transition-all duration-300"
          )}
        />
      </div>

      {/* About */}
      <div
        className={clsx("w-full flex flex-col items-start justify-start gap-4")}
      >
        <Label label="About" className="font-medium" />

        <textarea
          onChange={handleInput}
          value={user.about}
          name="about"
          className={clsx(
            "w-full h-[278px] py-[14px] px-4 bg-white rounded-xl text-sm text-900",
            "outline-none border border-stroke focus-within:border-accent",
            "transition-all duration-300"
          )}
        />
      </div>

      {/* Working At */}
      <div
        className={clsx("w-full flex flex-col items-start justify-start gap-4")}
      >
        <Label label="Working At" showEdit={true} className="font-medium" />

        <div className={clsx("w-full flex items-cetner justify-start gap-4")}>
          {/* Center image */}
          <div className={clsx("w-20")}>
            <Image
              className="rounded-xl"
              src={avatar}
              height={200}
              width={200}
              alt="work image"
            />
          </div>

          {/* Name and location */}
          <div
            className={clsx("flex flex-col items-start justify-center gap-1")}
          >
            <span
              className={clsx("text-800 text-[15px] font-semibold leading-4")}
            >
              {user.clinic}
            </span>
            <span
              className={clsx(
                "text-400 text-[11px] font-medium leading-4 tracking-[0.22px]"
              )}
            >
              {user.clinicAddress}
            </span>
          </div>
        </div>
      </div>

      {/* Quality marks */}
      <div
        className={clsx("w-full flex flex-col items-start justify-start gap-5")}
      >
        <Label label="Quality Marks" showEdit={true} className="font-medium" />

        <div
          className={clsx(
            "w-full flex items-cetner justify-start flex-wrap gap-7"
          )}
        >
          {user.qualityMarks.map((qm, index) => (
            <QMCerts key={index} text={qm} />
          ))}
        </div>
      </div>

      {errorMessage && (
        <StatusMessage message={errorMessage} type="error" size="sm" />
      )}

      {/* Action buttons */}
      <div className={clsx("w-full flex items-center justify-center gap-2")}>
        <Button bg="transparent" className="py-4 px-6">
          Cancel
        </Button>
        <Button onClick={handleSave} bg="fill" className="py-4 px-6">
          Save
        </Button>
      </div>
    </SettingsContainer>
  );
};

export default General;
