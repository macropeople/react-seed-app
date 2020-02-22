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
  debug: true
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
    sasService.request("common/appInit", null, true).then((response: any) => {
      let responseJson;
      try {
        responseJson = JSON.parse(response);
      } catch (e) {
        console.error(e);
      }
      if (responseJson && responseJson.status === 449) {
        fetchStartupData();
      } else {
        setStartupData(responseJson);
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
          }
        },
        err => {
          console.error(err);
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
    return sasService.request(url, data).then((res: any) => {
      let jsonResponse;
      if (res.login === false) {
        setIsUserLoggedIn(false);
        return false;
      }

      try {
        jsonResponse = JSON.parse(res);
        return jsonResponse;
      } catch (e) {
        console.error("Error parsing json: ", e);
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
