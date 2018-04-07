import React, { Component } from "react";
import "./App.css";

import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import AuthenticationInfo from "./AuthenticationInfo";
const util = require("util");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationInfo: undefined
    };
  }
  render() {
    return (
      <div id="page">
        <Header
          updateAuthenticationInfo={authInfo =>
            this.updateAuthenticationInfo(authInfo)
          }
        />
        <Body authenticationInfo={this.state.authenticationInfo} />
        <Footer />
      </div>
    );
  }

  updateAuthenticationInfo = function(authInfo) {
    // Update the state only if authInfo is valid
    if (authInfo && authInfo.isValid()) {
      this.setState({ authenticationInfo: authInfo });
    }
  };
}

export default App;
