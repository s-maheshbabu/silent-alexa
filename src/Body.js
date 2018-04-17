import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "./ChatWindow";
import RightPanel from "./RightPanel";
import WelcomeScreen from "./WelcomeScreen";

export default function Body(props) {
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
