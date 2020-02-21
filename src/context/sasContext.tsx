import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef
} from "react";
import SASjs, { SASjsConfig } from "sasjs";

interface SASContextProps {
  isUserLoggedIn: boolean;
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
  userName: "",
  sasService,
  setIsUserLoggedIn: null,
  startupData: null
});

const sessionCheckIntervalMins = 10;

const SASProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [startupData, setStartupData] = useState(null);
  const checkSessionTimer = useRef(null as any);

  useEffect(() => {
    sasService.checkSession().then(response => {
      setIsUserLoggedIn(response.isLoggedIn);
    });
    checkSessionTimer.current = setInterval(() => {
      sasService.checkSession().then(response => {
        setIsUserLoggedIn(response.isLoggedIn);
      });
    }, sessionCheckIntervalMins * 60 * 1000);
    return () => clearTimeout(checkSessionTimer.current);
  }, []);

  useEffect(() => {
    if (isUserLoggedIn) {
      setUserName(sasService.getUserName());
      if (!startupData) {
        sasService
          .request("common/appInit", null, true)
          .then((response: any) => {
            let responseJson;
            try {
              responseJson = JSON.parse(response);
            } catch (e) {
              console.log(e);
            }
            if (responseJson && responseJson.data) {
              setStartupData(responseJson.data);
            }
          });
      }
    }
  }, [isUserLoggedIn, startupData]);

  return (
    <SASContext.Provider
      value={{
        isUserLoggedIn,
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
