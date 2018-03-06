import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import logo from './logo.svg';
import './App.css';
import LoginWithAmazon from './LoginWithAmazon.js'
import ChatWindow from './ChatWindow.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticationInfo: {}
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <LoginWithAmazon setAuthenticationInfo={(authResponse) => this.setAuthenticationInfo(authResponse)} />

          {/* This will not be rendered until access_token and expires_in are available in the state.
           TODO: Replace this with routing logic i.e., route to ChatWindow on successful login */}
          { this.state && this.state.authenticationInfo.access_token && this.state.authenticationInfo.expires_in &&
            <ChatWindow authenticationInfo={this.state.authenticationInfo}/> }
        </div>
      </MuiThemeProvider>
    );
  }

  setAuthenticationInfo(authResponse) {
    if(authResponse != undefined) {
      this.setState({authenticationInfo: {access_token: authResponse.access_token, expires_in: authResponse.expires_in}})
    }
  }
}

export default App;
