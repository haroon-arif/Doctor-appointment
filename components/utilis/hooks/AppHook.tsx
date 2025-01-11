"use client";

import { toast, ToastContainer } from "react-toastify";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useEffect,
  useState,
} from "react";

// Css
import "react-toastify/dist/ReactToastify.css";

// Custom files
import {
  getCategories,
  getSubcategories,
} from "@/components/utilis/api/treatmentApi";
import { getSpecialistAPI } from "../api/specialistApi";

// Define types
interface AppState {
  isLoading: boolean;
  showEditWorkDays: boolean;
  showAddApt: boolean;
  aptAdded: boolean;
  profileUpdated: boolean;
  workDaysUpdated: boolean;
}
interface AppAction {
  type: string;
  payload?: any;
}
interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

// Initiali states used in reducer
const initialState: AppState = {
  isLoading: false,
  showEditWorkDays: false,
  showAddApt: false,
  aptAdded: false,
  profileUpdated: false,
  workDaysUpdated: false,
};

// Create context with a default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Reducer function to handle state changes
const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_SHOW_EDIT_WORK_DAYS":
      return { ...state, showEditWorkDays: action.payload };

    case "SET_SHOW_ADD_APT":
      return { ...state, showAddApt: action.payload };

    case "SET_APT_ADDED":
      return { ...state, aptAdded: action.payload };

    case "SET_WORK_DAYS_UPDATED":
      return { ...state, workDaysUpdated: action.payload };

    case "SET_PROFILE_UPDATED":
      return { ...state, profileUpdated: action.payload };

    default:
      return state;
  }
};

// Hook to manage state with useReducer
const AppHookComp = (): AppContextType => {
  // React states
  const [session, setSession] = useState();

  // Hooks
  const [state, dispatch] = useReducer(reducer, initialState);
  const pathname = usePathname();

  /**
   * Fucntion to get all categories data from API
   */
  const fetchCategories = async () => {
    try {
      return await getCategories();
    } catch (error) {
      toast.error(
        "Something went wrong while getting categories data, please refresh.",
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
  };

  /**
   * Fucntion to get all subcategories data from API
   */
  const fetchSubcategories = async () => {
    try {
      return await getSubcategories();
    } catch (error) {
      toast.error(
        "Something went wrong while getting subcategories data, please refresh.",
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
  };

  /**
   * Fucntion to fetch specialist data from API
   */
  const fetchSpecialist = async () => {
    try {
      let session = JSON.parse(localStorage.getItem("session")!);

      if (session) {
        let specialist = await getSpecialistAPI();
        session.user = specialist[0];

        localStorage.setItem("session", JSON.stringify(session));
      }
    } catch (error) {}
  };

  /**
   * Saves the data to localStorage if it's not already present.
   * The function is temporary for handling data
   */
  const saveData = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });

    if (typeof window !== "undefined") {
      let _subCategories = localStorage.getItem("sub_categories");
      let _categories = localStorage.getItem("categories");

      if (!_categories && session) {
        let ctg = await fetchCategories();
        localStorage.setItem("categories", JSON.stringify(ctg));
      }
      if (!_subCategories && session) {
        let subctg = await fetchSubcategories();
        localStorage.setItem("sub_categories", JSON.stringify(subctg));
      }
    }

    dispatch({ type: "SET_IS_LOADING", payload: false });
  };

  // Set session
  useEffect(() => {
    if (typeof window !== "undefined") {
      let _session = JSON.parse(localStorage.getItem("session")!);
      if (_session) {
        setSession(_session);
      }
    }
  }, [pathname]);

  // UseEffect hook to call saveData function on app load
  useEffect(() => {
    saveData();
  }, [session]);

  useEffect(() => {
    fetchSpecialist();
  }, []);

  return {
    state,
    dispatch,
  };
};

/**
 * AppContextProvider component that wraps its children with the context provider.
 *
 * @param params - Destructures 'children', representing the nested components to be rendered within the context provider.
 *
 * @returns A context provider that passes down the values from 'appHookComp' to its children.
 */
const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const appContext = AppHookComp();

  return (
    <AppContext.Provider value={appContext}>
      {children}
      <ToastContainer />
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppHook = (): AppContextType => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppHook must be used within an AppContextProvider");
  }

  return context;
};

export default AppContextProvider;
