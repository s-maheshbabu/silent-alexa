import React from "react";
import "./Header.css";
import LoginControl from "LoginControl/LoginControl";
import AppBar from "material-ui/AppBar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

/**
 * Exported to facilitate testing.
 */
function _LoginControlInHeader(props) {
  return (
    <LoginControl
      isAuthenticationInfoValid={() => props.isAuthenticationInfoValid()}
      clearAuthenticationInfo={() => props.clearAuthenticationInfo()}
      updateAuthenticationInfo={authenticationInfo =>
        props.updateAuthenticationInfo(authenticationInfo)
      }
    />
  );
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

export { _LoginControlInHeader };
