import React, { Component } from "react";
import "./App.css";

import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import AuthenticationInfo from "./AuthenticationInfo";

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
          updateAuthenticationInfo={authenticationInfo =>
            this.updateAuthenticationInfo(authenticationInfo)
          }
        />
        <Body authenticationInfo={this.state.authenticationInfo} />
        <Footer />
      </div>
    );
  }

  /**
   * Update the state only if authenticationInfo is defined
   */
  updateAuthenticationInfo = function(authenticationInfo) {
    if (
      authenticationInfo &&
      authenticationInfo instanceof AuthenticationInfo
    ) {
      this.setState({ authenticationInfo: authenticationInfo });
    }
  };
}

export default App;
