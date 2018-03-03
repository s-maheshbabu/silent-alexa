import React from 'react';

// Options variable to request for implicit grant.
// TODO: Logic for assigning 'deviceSerialNumber' needs to be revisited.
const options = {
    scope : ['alexa:all', 'profile'],
    scope_data : {"alexa:all":{"productID":"Silent_Alexa","productInstanceAttributes":{"deviceSerialNumber":"12345"}}}
};
export default class LoginWithAmazon extends React.Component {
  render() {
    return (
      <button type='button' onClick={() => this.handleLogin()}>
        <img alt="demoImage" src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
          width="156" height="32" />
      </button>
    )
  }

  handleLogin() {
    // This returns an AuthorizeRequest object. After the request is complete, the object will
    // contain properties detailing the response
    window.amazon.Login.authorize(options, response => this.handleResponse(response));
  }

  handleResponse(response) {
    if(typeof response === 'undefined') {
      console.log("Response is undefined");
    }
    else if(response.error) {
      console.log("Encountered an error on login: " + response.error);
    } else {
      this.props.setAuthorization(response);
    }
  }
}
