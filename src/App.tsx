import "./App.scss";
import routes from "./routes";

const App = () => routes;
// class App extends React.Component<any, any> {
//   componentDidMount() {
//     this.props.execStartUp();
//   }

//   render() {
//     if (this.props.sasServiceInit) {
//       return (
//         <div>
//           <SASProvider>
//             <ConnectedRouter history={this.props.history}>
//               {routes}
//             </ConnectedRouter>
//             {!this.props.userLogged ? <LoginPageComponent /> : ""}
//           </SASProvider>
//         </div>
//       );
//     } else {
//       return (
//         <div className="pageMid">
//           {" "}
//           <CircularProgress />{" "}
//         </div>
//       );
//     }
//   }
// }

// const mapStateToProps = (state: any) => {
//   return {
//     sasServiceInit: state.sasData.startupLoaded,
//     userLogged: state.sasData.userLogged
//   };
// };

// const mapDispatchToProps = dispatch => ({
//   execStartUp: () => dispatch(execStartUp())
// });

export default App;
