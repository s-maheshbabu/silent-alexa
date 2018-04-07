import React from "react";
import LoginButton from "./LoginButton";
import AuthenticationInfo from "./AuthenticationInfo";
import util from "util";

// Options variable to request for implicit grant.
// TODO: Logic for assigning 'deviceSerialNumber' needs to be revisited.
const options = Object.freeze({
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
    return <LoginButton onClick={() => this.handleLogin()} />;
  }

  handleLogin() {
    // This returns an AuthorizeRequest object. After the request is complete, the object will
    // contain properties detailing the response
    window.amazon.Login.authorize(options, response =>
      this.handleResponse(response)
    );
  }

  handleResponse = authorizationResponse => {
    // Call updateAuthenticationInfo only if authorizationResponse is valid
    if (this.isAuthResponseValid(authorizationResponse)) {
      this.props.updateAuthenticationInfo(
        new AuthenticationInfo(authorizationResponse)
      );
    }
  };

  isAuthResponseValid(authResponse) {
    if (authResponse && authResponse.access_token && authResponse.expires_in) {
      return true;
    } else {
      console.log(
        "Encountered an error on login: " +
          util.inspect(authResponse, { showHidden: true, depth: null })
      );
      return false;
    }
  }
}
