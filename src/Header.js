import React from "react";
import "Header.css";
import LoginControl from "LoginControl";

export default function Header(props) {
  return (
    <div id="header">
      {/* TODO: Currently the content in header-info isn't centered to the entire page but is at the center of header-info itself. 
              It should be adjust to be at the center of the entire page. */}
      <div id="header-info">
        <span>Silent Alexa Header (Under Construction)</span>
      </div>
      <div id="header-controls">
        <LoginControl
          isAuthenticationInfoValid={() => props.isAuthenticationInfoValid()}
          clearAuthenticationInfo={() => props.clearAuthenticationInfo()}
          updateAuthenticationInfo={authenticationInfo =>
            props.updateAuthenticationInfo(authenticationInfo)
          }
        />
      </div>
    </div>
  );
}
