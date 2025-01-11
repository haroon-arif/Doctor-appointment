"use client";

import React, { useEffect } from "react";

// CSS
import "./loader.css";

// Import components and utilities
import { useAppHook } from "@/components/utilis/hooks/AppHook";

/**
 * Loader component that renders a loading indicator.
 *
 * @returns {JSX.Element} returns loader/spinner to indicate a loading state.
 */
const Loader = () => {
  // Hooks
  const { state } = useAppHook();

  // Use useEffect to modify the document only on the client-side
  useEffect(() => {
    if (state.isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function to reset overflow when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [state.isLoading]);

  if (state.isLoading) {
    return (
      <div className="fixed h-screen w-screen flex items-center justify-center z-[51] bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
        <div className="loader" />
      </div>
    );
  }

  return null;
};

export default Loader;
