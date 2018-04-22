import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "ChatWindow/ChatWindow";
import RightPanel from "RightPanel/RightPanel";
import WelcomeScreen from "WelcomeScreen/WelcomeScreen";

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
