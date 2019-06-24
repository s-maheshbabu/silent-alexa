import React from "react";
import AuthenticationInfo from "AuthenticationInfo";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "ChatWindow/ChatWindow";
import RightPanel from "RightPanel/RightPanel";
import WelcomeScreen from "WelcomeScreen/WelcomeScreen";

export default function Body() {
  if (AuthenticationInfo.isPresent()) {
    return [
      <MuiThemeProvider key="muiThemeProvider">
        <ChatWindow />
      </MuiThemeProvider>,

      <RightPanel key="rightPanel" />
    ];
  }

  return <WelcomeScreen />;
}
