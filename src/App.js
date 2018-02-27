import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import logo from './logo.svg';
import './App.css';
import LoginWithAmazon from './LoginWithAmazon.js'
import ChatWindow from './ChatWindow.js'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
          <LoginWithAmazon setAccessToken={(access_token) => this.setState({access_token: access_token})} />

          {/* This will not be rendered until access_token is available in the state */}
          { this.state && this.state.access_token &&
            <ChatWindow access_token={this.state.access_token}/> }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
