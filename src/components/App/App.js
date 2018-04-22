import React, { Component } from "react";
import "./App.css";
import util from "util";

import Header from "Header/Header";
import Body from "Body/Body";
import Footer from "Footer/Footer";
import AuthenticationInfo from "AuthenticationInfo";

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
          isAuthenticationInfoValid={() => this.isAuthenticationInfoValid()}
          clearAuthenticationInfo={() => this.clearAuthenticationInfo()}
          updateAuthenticationInfo={authenticationInfo =>
            this.updateAuthenticationInfo(authenticationInfo)
          }
        />
        <Body
          authenticationInfo={this.state.authenticationInfo}
          isAuthenticationInfoValid={() => this.isAuthenticationInfoValid()}
          clearAuthenticationInfo={() => this.clearAuthenticationInfo()}
        />
        <Footer />
      </div>
    );
  }

  /**
   * Updates authenticationInfo prop in the component's state
   * @param authenticationInfo Instance of AuthenticationInfo
   */
  updateAuthenticationInfo = function(authenticationInfo) {
    if (
      authenticationInfo &&
      authenticationInfo instanceof AuthenticationInfo
    ) {
      this.setState({ authenticationInfo: authenticationInfo });
    } else {
      console.log(
        `Ignoring update. Received invalid authenticationInfo object: ${util.inspect(
          authenticationInfo,
          {
            showHidden: true,
            depth: null
          }
        )}.`
      );
    }
  };

  /**
   * @returns true if the authenticationInfo is defined and is an instance of {@link AuthenticationInfo}.
   *          false, otherwise.
   * TODO: Incorporate {@link  AuthenticationInfo#isValid} functionality when available.
   */
  isAuthenticationInfoValid() {
    return (
      this.state.authenticationInfo &&
      this.state.authenticationInfo instanceof AuthenticationInfo
    );
  }

  /**
   * Clears authenticationInfo prop in the component's state
   */
  clearAuthenticationInfo() {
    this.setState({ authenticationInfo: undefined });
  }
}

export default App;
