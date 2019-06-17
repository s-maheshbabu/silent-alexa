import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "ChatWindow/ChatWindow";
import RightPanel from "RightPanel/RightPanel";
import WelcomeScreen from "WelcomeScreen/WelcomeScreen";
import { Route, Switch } from "react-router-dom";

export default function Body(props) {
  return (
    <Switch>
      <Route path="/" exact component={WelcomeScreen} />
      <Route path="/silent-alexa" exact component={WelcomeScreen} />
      <Route
        exact
        path="/chat"
        render={() => [
          <MuiThemeProvider key="muiThemeProvider">
            <ChatWindow
              authenticationInfo={props.authenticationInfo}
              clearAuthenticationInfo={props.clearAuthenticationInfo}
            />
          </MuiThemeProvider>,

          <RightPanel key="rightPanel" />
        ]}
      />
    </Switch>
  );

  if (props.isAuthenticationInfoValid()) {
    return [
      <MuiThemeProvider key="muiThemeProvider">
        <ChatWindow
          authenticationInfo={props.authenticationInfo}
          clearAuthenticationInfo={props.clearAuthenticationInfo}
        />
      </MuiThemeProvider>,

      <RightPanel key="rightPanel" />
    ];
  }

  return <WelcomeScreen />;
}
