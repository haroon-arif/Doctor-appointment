"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

// Icons
import { Eye, EyeOff } from "lucide-react";

// Images
// import logo from "@/public/logo/logo.png";

// Import components and utilities
import StatusMessage from "@/components/UI/message/StatusMessage";
import { useAppHook } from "@/components/utilis/hooks/AppHook";
import { userSignin } from "@/components/utilis/api/authApi";
import Button from "@/components/UI/button/Button";

/**
 * Signin component that renders the user sign-in form.
 *
 * @returns {JSX.Element} returns the sign-in form and related UI components.
 */
const Signin = () => {
  // React states
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setpassword] = useState("");
  const [email, setEmail] = useState("");

  // Hooks
  const { dispatch } = useAppHook();
  const router = useRouter();

  /**
   * Function to validate email
   * @param {*} email
   * @returns Boolean
   */
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  /**
   * Handles the user sign-in process.
   *
   * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
   */
  const handleSignin = async () => {
    if (email.trim() == "" || !validateEmail(email)) {
      setErrorMessage("Please enter correct email");
      return;
    } else if (password.trim() == "") {
      setErrorMessage("Please enter password");
      return;
    } else {
      setErrorMessage("");
    }

    dispatch({ type: "SET_IS_LOADING", payload: true });

    try {
      if (email && password) {
        let authData = await userSignin({
          email,
          password,
        });

        if (authData) {
          localStorage.setItem("session", JSON.stringify(authData));
          router.push("/specialist");
        }
      }
    } catch (error: any) {
      dispatch({ type: "SET_IS_LOADING", payload: false });
      setErrorMessage(error.message);
    }
  };

  // useEffect to check for an existing session in localStorage on component mount
  useEffect(() => {
    dispatch({ type: "SET_IS_LOADING", payload: false });
    if (typeof window !== "undefined") {
      let session = JSON.parse(localStorage.getItem("session")!);

      // If a session exists, navigate to the specialist page
      if (session) {
        router.push("/specialist");
      }
    }
  }, []);

  return (
    <div
      className={clsx(
        "w-full h-screen bg-background-primary flex justify-center"
      )}
    >
      {/* Signin form */}
      <div
        className={clsx(
          "w-[500px] mt-20 capitalize h-fit bg-white rounded-xl p-5 shadow-lg",
          "flex flex-col items-center justify-center gap-5"
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            "w-full my-6 text-600 text-lg font-semibold leading-5",
            "flex flex-col items-center justify-center gap-2"
          )}
        >
          Login to specialist panel
        </div>

        {/* Username */}
        <div
          className={clsx(
            "w-full flex flex-col items-start justify-start gap-1"
          )}
        >
          <div
            className={clsx(
              "w-full text-600 text-[14px] font-semibold leading-5",
              "flex flex-col items-start justify-start gap-2"
            )}
          >
            Email
          </div>
          <input
            type={"text"}
            placeholder="jan_doe"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={clsx(
              "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-900",
              "outline-none border border-stroke focus-within:border-accent",
              "transition-all duration-300"
            )}
          />
        </div>

        {/* Password */}
        <div
          className={clsx(
            "w-full flex flex-col items-start justify-start gap-1"
          )}
        >
          <div
            className={clsx(
              "w-full text-600 text-[14px] font-semibold leading-5",
              "flex flex-col items-start justify-start gap-2"
            )}
          >
            Password
          </div>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              name="newPassword"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className={clsx(
                "w-full py-[14px] px-4 bg-white rounded-xl text-sm text-900",
                "outline-none border border-stroke focus-within:border-accent",
                "transition-all duration-300"
              )}
            />
            <div className="absolute right-3 top-3 cursor-pointer opacity-40">
              {showPassword && (
                <EyeOff onClick={() => setShowPassword(false)} />
              )}
              {!showPassword && <Eye onClick={() => setShowPassword(true)} />}
            </div>
          </div>
        </div>

        {errorMessage && (
          <StatusMessage message={errorMessage} type="error" size="sm" />
        )}

        <div className={clsx("w-full flex items-center justify-center gap-2")}>
          <Button
            onClick={handleSignin}
            bg="fill"
            className="py-4 px-6 hover:scale-1 opacity-90 hover:opacity-100 mt-3"
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
