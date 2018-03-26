import React from "react";
import LoginButton from "./LoginButton";

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
    this.props.updateAuthenticationInfo(authorizationResponse);
  };
}
