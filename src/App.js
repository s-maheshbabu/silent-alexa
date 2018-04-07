import React, { Component } from "react";
import "./App.css";

import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import AuthenticationInfo from "./AuthenticationInfo";
const util = require("util");
const DEFAULT_AUTHENTICATION_INFO = new AuthenticationInfo();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationInfo: { DEFAULT_AUTHENTICATION_INFO }
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
        <Body authenticationInfo={this.state.authenticationInfo} />
        <Footer />
      </div>
    );
  }

  handleAuthenticationInfoUpdate = function(authResponse) {
    const authInfo = new AuthenticationInfo(authResponse);
    this.setState({ authenticationInfo: authInfo });
  };
}

export default App;
