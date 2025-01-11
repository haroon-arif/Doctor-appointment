"use client";

import React, { forwardRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";

// Icons
import { ChevronDown, LogOut } from "lucide-react";

// Images
import avatar from "@/public/specialist/settings/general/profile-avatar.webp";
import { useAppHook } from "@/components/utilis/hooks/AppHook";

// Define types
interface UserProps {
  name: string;
  location: string;
  profileImage: string;
}

/**
 * ProfileCard component renders a dropdown menu triggered by the user's profile information.
 * It displays the user's name and location along with a profile image.
 *
 * @param {User} user - The location of the user.
 *
 * @returns {JSX.Element} - The rendered profile card component with a dropdown menu.
 */
const ProfileCard = ({ name, location, profileImage }: UserProps) => {
  return <User name={name} location={location} profileImage={profileImage} />;
};

/**
 * User component displays the user's profile avatar, name, and location.
 * It is wrapped in a forwardRef to allow parent components to access the root DOM element.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - The name of the user.
 * @param {string} props.location - The location of the user.
 * @param {React.Ref<HTMLDivElement>} ref - A forwarded ref to access the root div element.
 *
 * @returns {JSX.Element} - The rendered user profile component.
 */
const User = forwardRef<HTMLDivElement, UserProps>(
  ({ name, location, profileImage, ...props }, ref) => {
    // React states
    const [showMenu, setShowMenu] = useState(false);

    // Hooks
    const { dispatch } = useAppHook();
    const router = useRouter();

    const handleLogout = () => {
      dispatch({ type: "SET_IS_LOADING", payload: true });
      localStorage.clear();
      router.push("/");
    };

    return (
      <div
        ref={ref}
        {...props}
        onClick={() => setShowMenu(!showMenu)}
        className={clsx(
          "w-52 relative flex items-center justify-end gap-3 cursor-pointer",
          "max-lg:w-24"
        )}
      >
        {/* show Profile card on big screen */}
        <span className={clsx("max-lg:hidden")}>
          <UserProfileInfo
            name={name}
            location={location}
            profileImage={profileImage}
          />
        </span>
        {/* rounded image from max-lg screens */}
        <span className={clsx("lg:hidden")}>
          <RoundedImage src={profileImage ? profileImage : avatar} />
        </span>

        <ChevronDown
          className={clsx(
            "text-[20px] opacity-40",
            showMenu ? "rotate-180" : "rotate-0",
            "transition-all duration-300"
          )}
        />

        {showMenu && (
          <div
            className={clsx(
              "absolute top-10 py-3 flex flex-col justify-center items-start w-full rounded-xl shadow-md bg-white text-sm",
              "max-lg:w-48 max-lg:right-0 max-lg:top-6"
            )}
          >
            {/* shows only from max-lg screen */}
            <div
              className={clsx(
                "w-full px-3 py-2 flex items-center justify-start gap-2 text-error",
                "hover:text-white",
                "transition-all duration-300",
                "lg:hidden"
              )}
            >
              <UserProfileInfo
                name={name}
                location={location}
                profileImage={profileImage}
              />
            </div>
            <div
              onClick={handleLogout}
              className={clsx(
                "w-full px-3 py-2 flex items-center justify-start gap-2 text-error",
                "hover:bg-error/80 hover:text-white",
                "transition-all duration-300"
              )}
            >
              <LogOut className="size-5" />
              <span className="">Logout</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

User.displayName = "User";

export default ProfileCard;

export function UserProfileInfo({ name, location, profileImage }: UserProps) {
  return (
    <div className={clsx("w-full flex items-center gap-3 justify-around")}>
      <RoundedImage src={profileImage ? profileImage : avatar} />
      <div className="flex flex-col items-start justify-center">
        <p className="text-800 text-[14px] leading-[18px]">{name}</p>
        <p className="text-400 text-[11px] font-medium leading-[17px] tracking-tight">
          {location}
        </p>
      </div>
    </div>
  );
}

export function RoundedImage({
  src,
  alt = "profile image",
  borderColor = "border-accent",
}: any) {
  return (
    <div
      className={clsx(
        "w-8 h-8 rounded-full overflow-hidden border-[2px]",
        borderColor
      )}
    >
      <Image
        className="w-full h-full p-[2px] object-cover"
        src={src}
        height={200}
        width={200}
        alt={alt}
      />
    </div>
  );
}
