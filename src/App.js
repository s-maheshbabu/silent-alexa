import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import logo from "./logo.svg";
import "./App.css";

import ChatWindow from "./ChatWindow.js";

class App extends Component {
  render() {
    return (
      <div className="page">
        <div className="header">
          {/* TODO: Currently the content in header-info isn't centered to the entire page but is at the center of header-info itself. 
              It should be adjust to be at the center of the entire page. */}
          <div className="header-info">
            <span>Silent Alexa Header</span>
          </div>
          <div className="header-controls">
            <button>Login Button (Gootla)</button>
          </div>
        </div>

        <MuiThemeProvider>
          <ChatWindow />
        </MuiThemeProvider>

        <div className="rightpanel">
          <div className="panel-body">Right side content</div>
        </div>

        <div className="footer">
          <div className="footer-info">
            <span>Footer Info Bar</span>
            <span> That Collapses</span>
          </div>
          <div className="footer-controls">
            <a href="">Controls,</a>
            <a href="">icons</a>
            <a href="">and</a>
            <a href="">links</a>
            <a href="">can</a>
            <a href="">go</a>
            <a href="">here</a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
