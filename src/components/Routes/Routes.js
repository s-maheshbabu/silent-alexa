import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginHandler from "LoginHandler/LoginHandler";

export default function Routes(props) {
  return (
    <Switch>
      <Route
        exact
        path="/authresponse"
        render={routeProps => <LoginHandler {...routeProps} {...props} />}
      />
      <Route
        exact
        path="/silent-alexa/authresponse"
        render={routeProps => <LoginHandler {...routeProps} {...props} />}
      />
    </Switch>
  );
}
