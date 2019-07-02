import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginHandler from "LoginHandler/LoginHandler";
import DefaultRedirect from "DefaultRedirect/DefaultRedirect";

export default function Routes(props) {
  return (
    <Switch>
      <Route
        exact
        path="/authresponse"
        render={routeProps => <LoginHandler {...routeProps} {...props} />}
      />
      {/* TODO: Redirect to NotFound Page for other paths rather than redirecting
         to home. https://github.com/s-maheshbabu/silent-alexa/issues/55 */}
      <Route
        exact
        path="/:foo+"
        render={routeProps => <DefaultRedirect {...routeProps} />}
      />
    </Switch>
  );
}
