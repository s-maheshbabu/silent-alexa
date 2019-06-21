import React, { Component } from "react";
import "./App.css";
import util from "util";

import Header from "Header/Header";
import Body from "Body/Body";
import Footer from "Footer/Footer";
import Routes from "Routes/Routes";
import AuthenticationInfo from "AuthenticationInfo";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticationInfo: undefined
    };
  }

  componentWillUnmount() {
    console.log("App Component Was Unmounted");
  }
  componentDidMount() {
    console.log("App Component Was Mounted");
  }

  render() {
    return (
      <div id="page">
        <Routes
          updateAuthenticationInfo={authenticationInfo =>
            this.updateAuthenticationInfo(authenticationInfo)
          }
        />
        <Header
          isAuthenticationInfoValid={() => this.isAuthenticationInfoValid()}
          clearAuthenticationInfo={() => this.clearAuthenticationInfo()}
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
    console.log("Update Auth Called: " + authenticationInfo);
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
    console.log("IsAuthValid Called: " + this.state.authenticationInfo);
    return (
      this.state.authenticationInfo &&
      this.state.authenticationInfo instanceof AuthenticationInfo
    );
  }

  /**
   * Clears authenticationInfo prop in the component's state
   */
  clearAuthenticationInfo() {
    console.log("Clear Auth Called");
    this.setState({ authenticationInfo: undefined });
  }
}

export default App;
