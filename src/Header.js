import React from "react";
import LoginControl from "./LoginControl.js";

export default function Header(props) {
  return (
    <div id="header">
      {/* TODO: Currently the content in header-info isn't centered to the entire page but is at the center of header-info itself. 
              It should be adjust to be at the center of the entire page. */}
      <div id="header-info">
        <span>Silent Alexa Header</span>
      </div>
      <div id="header-controls">
        <LoginControl updateAuthenticationInfo={(authResponse) => props.updateAuthenticationInfo(authResponse)} />
      </div>
    </div>
  );
}