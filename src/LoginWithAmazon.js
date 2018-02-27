import React from 'react';

// Options variable to request for implicit grant. Logic for assigning 'deviceSerialNumber' needs to be revisited.
const options = {
    scope : ['alexa:all', 'profile'],
    scope_data : {"alexa:all":{"productID":"Silent_Alexa","productInstanceAttributes":{"deviceSerialNumber":"12345"}}}
};
export default class LoginWithAmazon extends React.Component {
  render() {
    return (
        <button type='button' onClick={() => this.handleLogin()}><img alt="demoImage" src="https://images-na.ssl-images-amazon.com/images/G/01/lwa/btnLWA_gold_156x32.png"
          width="156" height="32" />
        </button>
    )
  }

  handleLogin() {
    window.amazon.Login.authorize(options, response => this.handleResponse(response));
  }

  handleResponse(response) {
    if(response.error) {
          console.log("Encountered an error on login: " + response.error)
    }
    // Add access_token to state
    this.props.setAccessToken(response.access_token)
  }
}
