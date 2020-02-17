const initialState: any = {
  startupData: {},
  service: null,
  debugLogs: true,
  userLogged: null,
  startupLoaded: false,
  debug_reqs: [],
  failed_reqs: [],
  requestWaiting: {}
};

const sasReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "LOAD_START_UP":
      let newState = {};
      if (action.payload && action.payload.data.login === false) {
        newState = {
          startupLoaded: true,
          startupData: action.payload.data,
          userLogged: false,
          service: action.payload.service
        };
      } else {
        if (Object.entries(state.startupData).length === 0 && state.startupData.constructor === Object) {
          newState = {
            startupLoaded: true,
            startupData: action.payload.data,
            userLogged: true,
            service: action.payload.service
          };
        } else {
          newState = {
            startupLoaded: true,
            userLogged: true,
            service: action.payload.service
          };
        }
      }
      if (action.payload.service) {
        newState["debugLogs"] = action.payload.service.debugLogs;
      }
      return Object.assign({}, state, newState);
    case "LOGOUT":
      return Object.assign({}, state, {
        startupLoaded: true,
        startupData: {},
        userLogged: false
      });
    case "SESSION_EXPIRED":
      console.log(state);
      return Object.assign({}, state, {
        userLogged: false
      });
    case "UPDATE_SERVICE":
      return Object.assign({}, state, {
        service: action.payload
      });
    case "UPDATE_DEBUG_LOGS":
      return Object.assign({}, state, {
        debugLogs: action.payload
      });
    case "SAVE_REQUEST":
      return Object.assign({}, state, {
        requestWaiting: action.payload
      })
    default:
      return state;
  }
};

export default sasReducer;
