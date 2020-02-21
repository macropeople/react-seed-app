import React from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import HomePageComponent from "../components/home-page.component";
import DataPageComponent from "../components/data-page.component";
import RouteWithLayout from "./routeHOC/RouteWithLayout";
import MainLayout from "../layouts/Main";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../theme";
import SASProvider from "../context/sasContext";

export default (
  <ThemeProvider theme={theme}>
    <SASProvider>
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
      </BrowserRouter>
    </SASProvider>
  </ThemeProvider>
);
