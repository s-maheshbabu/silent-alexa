import React, {Component} from "react";

import logo from "./logo.svg";
import "./App.css";

import Header from "./Header.js";
import Body from "./Body.js";
import Footer from "./Footer.js";
const util = require("util");

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      authenticationInfo: {}
    }
  }
  render() {
    return (
      <div id="page">
        <Header updateAuthenticationInfo={(authResponse) => this.handleAuthenticationInfoUpdate(authResponse)} />
        <Body />
        <Footer />
      </div>
    );
  }

  handleAuthenticationInfoUpdate = function (authResponse) {
    if (!authResponse || authResponse.error) {
      console.log("Encountered an error on login: " + util.inspect(authResponse, {showHidden: true, depth: null}));
    } else {
      this.setState({authenticationInfo: {access_token: authResponse.access_token, expires_in: authResponse.expires_in}})
    }
  }
}

export default App;
