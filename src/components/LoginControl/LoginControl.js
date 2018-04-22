import React from "react";
import LoginButton from "LoginButton/LoginButton";
import LogoutButton from "LogoutButton/LogoutButton";
import AuthenticationInfo from "AuthenticationInfo";
import util from "util";

// Options variable to request for implicit grant.
// TODO: Logic for assigning 'deviceSerialNumber' needs to be revisited.
export const options = Object.freeze({
  scope: ["alexa:all", "profile"],
  scope_data: {
    "alexa:all": {
      productID: "Silent_Alexa",
      productInstanceAttributes: { deviceSerialNumber: "12345" }
    }
  }
});
export default class LoginControl extends React.Component {
  render() {
    if (this.props.isAuthenticationInfoValid()) {
      return <LogoutButton onClick={() => this.handleLogout()} />;
    } else {
      return <LoginButton onClick={() => this.handleLogin()} />;
    }
  }

  handleLogin() {
    // This returns an AuthorizeRequest object. After the request is complete, the object will
    // contain properties detailing the response
    window.amazon.Login.authorize(options, response =>
      this.handleLWAResponse(response)
    );
  }

  handleLogout() {
    this.props.clearAuthenticationInfo();
  }

  handleLWAResponse = lwaResponse => {
    // Call updateAuthenticationInfo only if lwaResponse is valid
    if (this.isLWAResponseValid(lwaResponse)) {
      this.props.updateAuthenticationInfo(new AuthenticationInfo(lwaResponse));
    }
  };

  /**
   * @returns true if LoginWithAmazon response is valid
   *          false, otherwise.
   */
  isLWAResponseValid(lwaResponse) {
    if (lwaResponse && lwaResponse.access_token && lwaResponse.expires_in) {
      return true;
    }
    console.log(
      "Encountered an error on login: " +
        util.inspect(lwaResponse, { showHidden: true, depth: null })
    );
    return false;
  }
}
