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
      authenticationInfo: undefined
    }
  }
  render() {
    return (
      <div id="page">
        <Header
          isLoggedIn={() => this.isLoggedIn()}
          updateAuthenticationInfo={(authResponse) => this.handleAuthenticationInfoUpdate(authResponse)} />
        <Body />
        <Footer />
      </div>
    );
  }

  isLoggedIn = function () {
    if (this.state && this.state.authenticationInfo && this.state.authenticationInfo.access_token) {
      return true;
    }
    return false;
  }

  handleAuthenticationInfoUpdate = function (authResponse) {
    if (!authResponse) {
      this.setState({authenticationInfo: undefined})
    } else if (authResponse.error) {
      console.log("Encountered an error on login: " + util.inspect(authResponse, {showHidden: true, depth: null}));
    } else {
      console.log(authResponse);
      this.setState({authenticationInfo: {access_token: authResponse.access_token, expires_in: authResponse.expires_in}})
    }
  };
}

export default App;
