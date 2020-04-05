import React, { useContext } from "react";
import { AuthContext } from "auth/AuthContextProvider";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "ChatWindow/ChatWindow";
import RightPanel from "RightPanel/RightPanel";
import WelcomeScreen from "WelcomeScreen/WelcomeScreen";

import util from "util";

export default function Body() {
  console.log(
    util.inspect(useContext(AuthContext), { showHidden: true, depth: null })
  );
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated()) {
    return [
      <MuiThemeProvider key="muiThemeProvider">
        <ChatWindow />
      </MuiThemeProvider>,

      <RightPanel key="rightPanel" />
    ];
  }

  return <WelcomeScreen />;
}
