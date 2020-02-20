import React from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import HomePageComponent from "../components/home-page.component";
import AboutPageComponent from "../components/about-page.component";
import DebugLogsComponent from "../components/sasComponents/debug-logs.component";
import DataPageComponent from "../components/data-page.component";
import RouteWithLayout from "./routeHOC/RouteWithLayout";
import MainLayout from "../layouts/Main";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../theme";

export default (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Route exact path="/" component={() => <Redirect to="/home" />} />
      <RouteWithLayout
        exact
        path="/home"
        layout={MainLayout}
        component={HomePageComponent}
      />
      <RouteWithLayout
        exact
        path="/demo"
        layout={MainLayout}
        component={DataPageComponent}
      />
      <RouteWithLayout
        exact
        path="/about"
        layout={MainLayout}
        component={AboutPageComponent}
      />
      <RouteWithLayout
        exact
        path="/debug-logs"
        layout={MainLayout}
        component={DebugLogsComponent}
      />
    </BrowserRouter>
  </ThemeProvider>
);
