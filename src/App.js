import React, { Component } from "react";
import "./App.css";

import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
const util = require("util");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationInfo: {}
    };
  }
  render() {
    return (
      <div id="page">
        <Header
          updateAuthenticationInfo={authResponse =>
            this.handleAuthenticationInfoUpdate(authResponse)
          }
        />
        <Body />
        <Footer />
      </div>
    );
  }

  handleAuthenticationInfoUpdate = function(authResponse) {
    if (!authResponse || authResponse.error) {
      console.log(
        "Encountered an error on login: " +
          util.inspect(authResponse, { showHidden: true, depth: null })
      );
    } else {
      this.setState({
        authenticationInfo: {
          access_token: authResponse.access_token,
          expires_in: authResponse.expires_in
        }
      });
    }
  };
}

export default App;
