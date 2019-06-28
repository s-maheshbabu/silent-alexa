import React, { Component } from "react";
import "./App.css";

import Header from "Header/Header";
import Body from "Body/Body";
import Footer from "Footer/Footer";
import Routes from "Routes/Routes";

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
        <Routes />
        <Header />
        <Body />
        <Footer />
      </div>
    );
  }
}

export default App;
