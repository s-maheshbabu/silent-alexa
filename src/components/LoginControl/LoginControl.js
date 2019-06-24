import React from "react";
import HeaderFlatButton from "HeaderFlatButton/HeaderFlatButton";
import AuthenticationInfo from "AuthenticationInfo";

// Options variable to request for implicit grant.
// TODO: Logic for assigning 'deviceSerialNumber' needs to be revisited.
export const options = Object.freeze({
  scope: ["alexa:all", "profile"],
  scope_data: {
    "alexa:all": {
      productID: "Silent_Alexa",
      productInstanceAttributes: { deviceSerialNumber: "12345" }
    }
  },
  popup: false
});

// Redirect path to handle the response from LoginWithAmazon
export const REDIRECT_PATH = "authresponse";

export default class LoginControl extends React.Component {
  render() {
    if (AuthenticationInfo.isPresent()) {
      return (
        <HeaderFlatButton label="Logout" onClick={() => this.handleLogout()} />
      );
    } else {
      return (
        <HeaderFlatButton label="Login" onClick={() => this.handleLogin()} />
      );
    }
  }

  handleLogin() {
    // The authorization service will redirect the user-agent to the redirect path
    // which will contain an authorization response as a URI fragment
    window.amazon.Login.authorize(
      options,
      window.location.href + REDIRECT_PATH
    );
  }

  handleLogout() {
    AuthenticationInfo.clear();
    // TODO: Also, redirect the user to the login page.
  }
}
