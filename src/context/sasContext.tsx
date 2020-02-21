import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback
} from "react";
import SASjs, { SASjsConfig } from "sasjs";

interface SASContextProps {
  isUserLoggedIn: boolean;
  checkingSession: boolean;
  userName: string;
  sasService: SASjs;
  setIsUserLoggedIn: null | Dispatch<SetStateAction<boolean>>;
  startupData: any;
}

const sasService = new SASjs({
  serverUrl: "http://pv.analytium.co.uk",
  port: null,
  pathSAS9: "/SASStoredProcess/do",
  pathSASViya: "/SASJobExecution",
  appLoc: "/Public/m2",
  serverType: "SASVIYA",
  debug: true
} as SASjsConfig);

export const SASContext = createContext<SASContextProps>({
  isUserLoggedIn: false,
  checkingSession: false,
  userName: "",
  sasService,
  setIsUserLoggedIn: null,
  startupData: null
});

const SASProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);
  const [userName, setUserName] = useState("");
  const [startupData, setStartupData] = useState(null);

  const fetchStartupData = useCallback(() => {
    sasService.request("common/appInit", null, true).then((response: any) => {
      let responseJson;
      try {
        responseJson = JSON.parse(response);
      } catch (e) {
        console.log(e);
      }
      if (responseJson && responseJson.areas && responseJson.areas.data) {
        setStartupData(responseJson.areas.data);
      } else if (responseJson && responseJson.status === 449) {
        fetchStartupData();
      }
    });
  }, []);

  useEffect(() => {
    setCheckingSession(true);
    sasService.checkSession().then(response => {
      setCheckingSession(false);
      setIsUserLoggedIn(response.isLoggedIn);
    });
  }, []);

  useEffect(() => {
    if (isUserLoggedIn) {
      setUserName(sasService.getUserName());
      if (!startupData) {
        fetchStartupData();
      }
    }
  }, [isUserLoggedIn, startupData, fetchStartupData]);

  return (
    <SASContext.Provider
      value={{
        isUserLoggedIn,
        checkingSession,
        userName,
        sasService,
        setIsUserLoggedIn,
        startupData
      }}
    >
      {children}
    </SASContext.Provider>
  );
};

export default SASProvider;
