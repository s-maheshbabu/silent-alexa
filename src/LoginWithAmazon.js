import React from "react";
const util = require("util");

// Options variable to request for implicit grant.
// TODO: Logic for assigning 'deviceSerialNumber' needs to be revisited.
const options = {
    scope : ["alexa:all", "profile"],
    scope_data : {"alexa:all":{"productID":"Silent_Alexa","productInstanceAttributes":{"deviceSerialNumber":"12345"}}}
};
export default class LoginWithAmazon extends React.Component {
  render() {
    return (
      <button type="button" onClick={() => this.handleLogin()}>
        <img alt="loginImage" src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
          width="106" height="20" />
      </button>
    )
  }

  handleLogin() {
    // This returns an AuthorizeRequest object. After the request is complete, the object will
    // contain properties detailing the response
    window.amazon.Login.authorize(options, response => this.handleResponse(response));
  }

  handleResponse = (authorizationResponse) => {
    if(typeof authorizationResponse == "undefined" || authorizationResponse.error) {
      console.log("Encountered an error on login: " + util.inspect(authorizationResponse, { showHidden: true, depth: null }));
    } else {
      this.props.updateAuthenticationInfo(authorizationResponse);
    }
  }
}
