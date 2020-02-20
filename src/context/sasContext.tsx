import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction
} from "react";
import SASjs, { SASjsConfig } from "sasjs";

interface SASContextProps {
  isUserAuthenticated: boolean;
  sasService: null | SASjs;
  setIsUserAuthenticated: null | Dispatch<SetStateAction<boolean>>;
}
export const SASContext = createContext<SASContextProps>({
  isUserAuthenticated: false,
  sasService: null,
  setIsUserAuthenticated: null
});

const SASProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const sasService = new SASjs({
    serverUrl: "http://pv.analytium.co.uk",
    port: null,
    pathSAS9: "/SASStoredProcess/do",
    pathSASViya: "/SASJobExecution",
    appLoc: "/Public/m2",
    serverType: "SASVIYA",
    debug: true
  } as SASjsConfig);
  return (
    <SASContext.Provider
      value={{ isUserAuthenticated, sasService, setIsUserAuthenticated }}
    >
      {children}
    </SASContext.Provider>
  );
};

export default SASProvider;
