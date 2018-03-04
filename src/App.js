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
      authenticationValues: {}
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <LoginWithAmazon setAuthorization={(authResponse) => this.setAuthenticationValues(authResponse)} />

          {/* This will not be rendered until access_token and expires_in are available in the state.
           TODO: Replace this with routing logic i.e., route to ChatWindow on successful login */}
          { this.state && this.state.authenticationValues.access_token && this.state.authenticationValues.expires_in &&
            <ChatWindow authenticationValues={this.state.authenticationValues}/> }
        </div>
      </MuiThemeProvider>
    );
  }

  setAuthenticationValues(authResponse) {
    if(authResponse !== undefined) {
      this.setState({authenticationValues: {access_token: authResponse.access_token, expires_in: authResponse.expires_in}})
    }
  }
}

export default App;
