import React from "react";
import AppBar from "material-ui/AppBar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import LoginControl from "LoginControl/LoginControl";
import "./Header.css";

function _LoginControlInHeader() {
  return <LoginControl />;
}

export default function Header(props) {
  return (
    <div id="header">
      <div id="header-info">
        <MuiThemeProvider>
          <AppBar
            className="app-bar"
            showMenuIconButton={false}
            title="Silent Alexa (Under Construction)"
            iconElementRight={_LoginControlInHeader(props)}
          />
        </MuiThemeProvider>
      </div>
    </div>
  );
}
