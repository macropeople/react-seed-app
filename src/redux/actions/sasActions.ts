import SASjs, { SASjsConfig } from "sasjs";
import { createdStore } from "./../store";
const sasService = new SASjs({
  serverUrl: " ",
  port: null,
  pathSAS9: "/SASStoredProcess/do",
  pathSASViya: "/SASJobExecution",
  appLoc: "/Public/m2",
  serverType: "SASVIYA",
  debug: true
} as SASjsConfig);

export const loadStartUp = payload => {
  payload.service.debugLogs = sasService.getSasjsConfig().debug;

  return {
    type: "LOAD_START_UP",
    payload: payload
  };
};

export const LOGOUT = () => ({
  type: "LOGOUT"
});

const SESSION_EXPIRED = () => ({
  type: "SESSION_EXPIRED"
});

const SAVE_REQUEST = payload => ({
  type: "SAVE_REQUEST",
  payload: payload
});

export const updateDebugCheckBox = payload => {
  sasService.setDebugState(payload);

  return {
    type: "UPDATE_DEBUG_LOGS",
    payload: payload
  };
};

export function execStartUp() {
  return (dispatch, state) => {
    sasService
      .request("common/appInit", null, true)
      .then((res: any) => {
        console.log("STARTUP LOADED", res);

        let jsonResponse;

        if (res.login === false) {
          jsonResponse = res;
        } else {
          try {
            jsonResponse = JSON.parse(res);
          } catch (e) {
            console.log(e);
          }
        }

        let startupData = res;

        if (jsonResponse) {
          let payload;

          if (jsonResponse.login === false) {
            payload = { service: sasService, data: jsonResponse };
          } else {
            startupData = jsonResponse.data;

            if (jsonResponse.data) {
              payload = { service: sasService, data: startupData };
            }
          }

          dispatch(loadStartUp(payload));
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
}

export function execSASRequest(programName, data): Promise<any> {
  return new Promise((resolve, reject) => {
    sasService
      .request(programName, data)
      .then((res: any) => {
        console.log(res);

        if (res.login! === false) {
          createdStore.dispatch(
            SAVE_REQUEST({
              programName: programName,
              data: data
            })
          );
          createdStore.dispatch(SESSION_EXPIRED());
        }

        resolve(res);
      })
      .catch(e => {
        reject(e);
      });
  });
}

export function getSasjsConfig() {
  return sasService.getSasjsConfig();
}

export function getSASProgramLogs() {
  return sasService.getSasRequests();
}

export const getUserName = () => {
  return sasService.getUserName();
};

export function logOut() {
  return (dispatch, state) => {
    sasService
      .logOut()
      .then((res: any) => {
        if (res === true) {
          dispatch(LOGOUT());
        } else {
          console.log(res);
          console.log("Couldn't Logout");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
}
