import SASjs from "sasjs";
import { push } from "connected-react-router";
import cachedData from '../../cached_data';
const sasService = new SASjs({
  baseURL: " ",
  port: null,
  pathSAS9: "/SASStoredProcess/do",
  pathSASViya: "/SASJobExecution",
  programRoot: "/Public/m2",
  serverType: "SASVIYA"
});

export const loadStartUp = payload => {
  payload.service.debugLogs = sasService.debugState;

  return {
    type: "LOAD_START_UP",
    payload: payload
  }
}

export const LOGOUT = () => ({
  type: "LOGOUT"
});

export const updateDebugCheckBox = payload => {
  sasService.debugState = payload;

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
        let jsonResponse;
        try {
          jsonResponse = JSON.parse(res);
        } catch (e) {
          console.log(e);
        }

        if (jsonResponse) {
          cachedData.areas = jsonResponse.data.areas;
        }

        let payload = { service: sasService, data: res };
        dispatch(loadStartUp(payload));
        if (res.login === false) {
          // try commneting this block
          dispatch(push(`homepage`));
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
}

export function execSASRequest(programName, data) {
  return new Promise((resolve, reject) => {
    sasService
      .request(programName, data, undefined)
      .then((res: any) => {
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
