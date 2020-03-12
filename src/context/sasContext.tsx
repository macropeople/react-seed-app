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
  logout: (() => void) | null;
  request: (({ url, data }) => Promise<any>) | null;
  startupData: any;
}

const sasService = new SASjs({
  serverUrl: " ",
  port: null,
  pathSAS9: "/SASStoredProcess/do",
  pathSASViya: "/SASJobExecution",
  appLoc: "/Public/app",
  serverType: "SASVIYA",
  debug: false
} as SASjsConfig);

export const SASContext = createContext<SASContextProps>({
  isUserLoggedIn: false,
  checkingSession: false,
  userName: "",
  sasService,
  setIsUserLoggedIn: null,
  login: null,
  logout: null,
  request: null,
  startupData: null
});

const SASProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(false);
  const [userName, setUserName] = useState("");
  const [startupData, setStartupData] = useState(null);

  const fetchStartupData = useCallback(() => {
    sasService.request("common/appInit", null).then((response: any) => {
      setStartupData(response);
    });
  }, []);

  const login = useCallback((userName, password) => {
    return sasService
      .logIn(userName, password)
      .then(
        (res: { isLoggedIn: boolean; userName: string }) => {
          setIsUserLoggedIn(res.isLoggedIn);
          return true;
        },
        err => {
          console.error(err);
          setIsUserLoggedIn(false);
          return false;
        }
      )
      .catch(e => {
        if (e === 403) {
          console.error("Invalid host");
        }
        return false;
      });
  }, []);

  const logout = useCallback(() => {
    sasService.logOut().then(() => {
      setIsUserLoggedIn(false);
    });
  }, []);

  const request = useCallback(({ url, data }) => {
    return sasService
      .request(url, data)
      .then((res: any) => {
        if (res.login === false) {
          setIsUserLoggedIn(false);
          return false;
        }
        return res;
      })
      .catch(e => {
        if (e.message.includes("login required")) {
          setIsUserLoggedIn(false);
          return false;
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
        login,
        logout,
        request,
        startupData
      }}
    >
      {children}
    </SASContext.Provider>
  );
};

export default SASProvider;
