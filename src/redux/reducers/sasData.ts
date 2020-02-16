const initialState: any = {
  startupData: {},
  service: null,
  debugLogs: true,
  userLogged: null,
  startupLoaded: false,
  debug_reqs: [],
  failed_reqs: []
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
        newState = {
          startupLoaded: true,
          startupData: action.payload.data,
          userLogged: true,
          service: action.payload.service
        };
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
    case "UPDATE_SERVICE":
      return Object.assign({}, state, {
        service: action.payload
      });
    case "UPDATE_DEBUG_LOGS":
      return Object.assign({}, state, {
        debugLogs: action.payload
      });
    default:
      return state;
  }
};

export default sasReducer;
