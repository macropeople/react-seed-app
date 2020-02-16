import React from "react";
import { Route, HashRouter, Redirect } from "react-router-dom";
import HomePageComponent from "../components/home-page.component";
import AboutPageComponent from "../components/about-page.component";
import LoginPageComponent from "../components/login-page.component";
import DebugLogsComponent from "../components/sasComponents/debug-logs.component";
import DataPageComponent from "../components/data-page.component";
import RouteWithLayout from "./routeHOC/RouteWithLayout";
import MainLayout from "../layouts/Main";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { requireAuthentication } from "../components/guards/authGuard";
import { requireNoAuthentication } from "../components/guards/noAuthGuard";
import theme from "../theme";

export default (
  <ThemeProvider theme={theme}>
    <HashRouter>
      <Route
        exact
        path="/login"
        component={requireNoAuthentication(LoginPageComponent)}
      />
      <Route exact path="/" component={() => <Redirect to="/home" />} />
      <RouteWithLayout
        exact
        path="/home"
        layout={requireAuthentication(MainLayout)}
        component={HomePageComponent}
      />
      <RouteWithLayout
        exact
        path="/demo"
        layout={requireAuthentication(MainLayout)}
        component={DataPageComponent}
      />
      <RouteWithLayout
        exact
        path="/about"
        layout={requireAuthentication(MainLayout)}
        component={AboutPageComponent}
      />
      <RouteWithLayout
        exact
        path="/debug-logs"
        layout={requireAuthentication(MainLayout)}
        component={DebugLogsComponent}
      />
    </HashRouter>
  </ThemeProvider>
);
