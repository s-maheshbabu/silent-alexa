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
        "Ignoring authenticationInfo update as an invalid authenticationInfo object is received."
      );
    }
  };
}

export default App;
