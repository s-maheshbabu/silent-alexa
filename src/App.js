import React, { Component } from 'react';
import ChatWindow from './ChatWindow.js'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ChatWindow />
      </div>
    );
  }
}

export default App;
