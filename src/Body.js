import React, {Component} from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import ChatWindow from "./ChatWindow";
import RightPanel from "./RightPanel";

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