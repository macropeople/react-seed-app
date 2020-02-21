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
  login: ((userName: string, password: string) => Promise<boolean>) | null;
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
  login: null,
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
        console.error(e);
      }
      if (responseJson && responseJson.areas && responseJson.areas.data) {
        setStartupData(responseJson.areas.data);
      } else if (responseJson && responseJson.status === 449) {
        fetchStartupData();
      }
    });
  }, []);

  const login = useCallback((userName, password) => {
    return sasService
      .SASlogin(userName, password)
      .then(
        (res: any) => {
          if (res.search(/success/gim)) {
            setIsUserLoggedIn(true);
            return true;
          } else {
            setIsUserLoggedIn(false);
            return false;
            // setLoading(false);
          }
        },
        err => {
          console.error(err);
          return false;
          // setLoading(false);
        }
      )
      .catch(e => {
        if (e === 403) {
          console.error("Invalid host");
        }
        return false;
        // setLoading(false);
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
        login,
        startupData
      }}
    >
      {children}
    </SASContext.Provider>
  );
};

export default SASProvider;
