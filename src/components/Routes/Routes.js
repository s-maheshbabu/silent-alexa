import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginHandler from "LoginHandler/LoginHandler";
import PageNotFound from "PageNotFound/PageNotFound";
import Body from "Header/Header";

export default function Routes(props) {
  return (
    <Switch>
      <Route
        exact
        path="/authresponse"
        render={routeProps => <LoginHandler {...routeProps} {...props} />}
      />
    </Switch>
  );
}
