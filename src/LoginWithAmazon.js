import React from "react";

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
    this.props.updateAuthenticationInfo(authorizationResponse);
  }
}
