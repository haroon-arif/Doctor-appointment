"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import _ from "lodash";

// Import components and utilities
import StatusMessage from "@/components/UI/message/StatusMessage";
import SettingsContainer from "./components/SettingsContainer";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import Button from "@/components/UI/button/Button";
import Label from "./components/general/Label";
import { toast } from "react-toastify";
import { updatePasswordApi } from "@/components/utilis/api/authApi";

// Define types
interface User {
  password: string;
  [key: string]: any;
}
const USER: User = {
  password: "",
};

/**
 * Password component that handles the display and update of old, new, and confirm password fields.
 *
 * @returns {JSX.Element} - Renders the settings menu component
 */
const Password = () => {
  // React states
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User>(USER);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Hooks
  const { dispatch } = useAppHook();

  /**
   * Validates the strength of a password based on specific criteria.
   *
   * @param {string} password - The password string to be validated.
   *
   * @returns {boolean} True if the password meets all criteria, false otherwise.
   */
  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  /**
   * Handles password update functionality
   *
   * @returns {Promise<void>}
   */
  const handleSave = async () => {
    let specialist = JSON.parse(localStorage.getItem("specialist")!);

    // Validations
    if (oldPassword.trim() == "") {
      setErrorMessage("Old password cannot be empty");
      return;
    } else if (newPassword.trim() == "") {
      setErrorMessage("New password cannot be empty");
      return;
    } else if (!validatePassword(newPassword)) {
      setErrorMessage(
        "Password needs 8+ characters, a number, uppercase letter, and symbol."
      );
      return;
    } else if (confirmPassword.trim() == "") {
      setErrorMessage("Confirm password cannot be empty");
      return;
    } else if (confirmPassword.trim() !== newPassword.trim()) {
      setErrorMessage("Confirm password and new password does not match.");
      return;
    } else {
      setErrorMessage("");
    }

    dispatch({ type: "SET_IS_LOADING", payload: true });

    try {
      let session = JSON.parse(localStorage.getItem("session")!);

      let formData = new FormData();

      formData.append("specialistId", user.id);
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);

      let apiRes = await updatePasswordApi(formData);

      if (apiRes) {
        session.user = apiRes.user;
        localStorage.setItem("session", JSON.stringify(session));
        dispatch({ type: "SET_PROFILE_UPDATED", payload: true });

        setConfirmPassword("");
        setErrorMessage("");
        setOldPassword("");
        setNewPassword("");

        toast.success("Password updated successfully", {
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
    } catch (error: any) {
      toast.error(
        error.message
          ? error.message
          : "Something went wrong, please try again.",
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

  // useEffect hook to get speicalist data
  useEffect(() => {
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);

      if (session) {
        setUser(session.user);
      }
    }
  }, []);

  return (
    <SettingsContainer>
      <div className={clsx("text-700 text-xl font-bold")}>Update Password</div>

      {/* Old password */}
      <div
        className={clsx("w-full flex flex-col items-start justify-start gap-4")}
      >
        <Label label="Old Password" className="font-medium" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          name="oldPassword"
          onChange={(e) => setOldPassword(e.target.value)}
          value={oldPassword}
          className={clsx(
            "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-900",
            "outline-none border border-stroke focus-within:border-accent",
            "transition-all duration-300"
          )}
        />
      </div>

      {/* New password */}
      <div
        className={clsx("w-full flex flex-col items-start justify-start gap-4")}
      >
        <Label label="New Password" className="font-medium" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          name="newPassword"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          className={clsx(
            "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-900",
            "outline-none border border-stroke focus-within:border-accent",
            "transition-all duration-300"
          )}
        />
      </div>

      {/* Confirm new password */}
      <div
        className={clsx("w-full flex flex-col items-start justify-start gap-4")}
      >
        <Label label="Confirm New Password" className="font-medium" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          name="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          className={clsx(
            "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-900",
            "outline-none border border-stroke focus-within:border-accent",
            "transition-all duration-300"
          )}
        />
      </div>

      <div className="flex items-center mb-4">
        <input
          id="default-checkbox"
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="w-4 h-4 text-accent accent-accent bg-gray-100 border-gray-300 rounded-xl focus:ring-0"
        />
        <label
          htmlFor="default-checkbox"
          className="ms-2 text-sm text-gray-900 cursor-pointer"
        >
          Show Password
        </label>
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

export default Password;
