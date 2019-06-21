import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "ChatWindow/ChatWindow";
import RightPanel from "RightPanel/RightPanel";
import WelcomeScreen from "WelcomeScreen/WelcomeScreen";
import PageNotFound from "PageNotFound/PageNotFound";
import { Route, Switch, Redirect } from "react-router-dom";

export default function Body(props) {
  return (
    <Switch>
      <Route path="/" exact component={WelcomeScreen} />
      <Route path="/silent-alexa" exact component={WelcomeScreen} />
      <Route
        exact
        path={["/silent-alexa/chat", "/chat"]}
        render={() => {
          if (props.isAuthenticationInfoValid())
            return [
              <MuiThemeProvider key="muiThemeProvider">
                <ChatWindow
                  authenticationInfo={props.authenticationInfo}
                  clearAuthenticationInfo={props.clearAuthenticationInfo}
                />
              </MuiThemeProvider>,

              <RightPanel key="rightPanel" />
            ];
          else
            return (
              <Redirect
                to={{ pathname: "/", state: { from: props.location } }}
              />
            );
        }}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
}
