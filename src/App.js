import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import logo from './logo.svg';
import './App.css';

import ChatWindow from './ChatWindow.js'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="App">
        
          <ChatWindow />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
