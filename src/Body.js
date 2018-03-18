import React, {Component} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "./ChatWindow.js";
import RightPanel from "./RightPanel.js";

export default class Body extends Component {
  render() {
    return (
      [
        <MuiThemeProvider>
          <ChatWindow />
        </MuiThemeProvider>,

        <RightPanel />
      ]
    )
  }
}