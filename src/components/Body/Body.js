import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "ChatWindow/ChatWindow";
import RightPanel from "RightPanel/RightPanel";
import WelcomeScreen from "WelcomeScreen/WelcomeScreen";
import { useCookies } from "react-cookie";

import { AMAZON_LOGIN_COOKIE } from "Constants";

export default function Body() {
  const [cookies] = useCookies([AMAZON_LOGIN_COOKIE]);

  if (cookies[AMAZON_LOGIN_COOKIE] !== undefined) {
    return [
      <MuiThemeProvider key="muiThemeProvider">
        <ChatWindow />
      </MuiThemeProvider>,

      <RightPanel key="rightPanel" />
    ];
  }

  return <WelcomeScreen />;
}
