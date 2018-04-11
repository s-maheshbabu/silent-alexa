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

  handleResponse = lwaResponse => {
    // Call updateAuthenticationInfo only if lwaResponse is valid
    if (this.isLWAResponseValid(lwaResponse)) {
      this.props.updateAuthenticationInfo(new AuthenticationInfo(lwaResponse));
    }
  };

  /**
   * Returns true if LoginWithAmazon response is valid. False, otherwise.
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
