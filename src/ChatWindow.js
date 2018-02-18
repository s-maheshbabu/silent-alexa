import React, { Component } from 'react';
import { ChatFeed, Message } from 'react-chat-ui'

const users = require('./ConversingUsers');

class ChatWindow extends Component {
  constructor() {
    super();
    this.state = {
      messages: [
        new Message({ id: 0, message: 'Hello Alexa!', senderName: 'You' }),
        new Message({
          id: 1,
          message: 'Hey! Alexa here.',
          senderName: 'Alexa',
        }),
      ],
      requestToAlexa: '',
      useCustomBubble: false,
      curr_user: 0,
      is_typing: false
    };

    this.onMessageSubmit = this.onMessageSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onMessageSubmit(e) {
    const requestToAlexa = this.state.requestToAlexa;
    e.preventDefault();
    if (!requestToAlexa || 0 === requestToAlexa.length) {
      console.log("Request string for Alexa was empty: " + requestToAlexa);
      this.setState({ requestToAlexa: '' });
      return false;
    }
    this.pushMessage(this.state.curr_user, requestToAlexa);
    this.setState({ requestToAlexa: '' });
    return true;
  }

  pushMessage(userid, message) {
    if (!users[userid]) {
      console.log("Unknown userId: " + userid);
      return;
    }
    if (!message || 0 === message.length) {
      console.log("Empty message: " + message);
      return;
    }

    const messagesCopy = this.state.messages.slice(); // for immutability
    const newMessage = new Message({
      id: userid,
      message,
      senderName: users[userid],
    });
    messagesCopy.push(newMessage);
    this.setState({ messages: messagesCopy });
  }

  handleChange(event) {
    this.setState({ requestToAlexa: event.target.value });
  }

  render() {
    return (
      <div className="ChatWindow" >

        <ChatFeed
          messages={this.state.messages}
          isTyping={this.state.is_typing} // Boolean: is the recipient typing
          hasInputField={false} // Boolean: use our input, or use your own
          showSenderName={false} // show the name of the user who sent the message
          bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
        />

        <form onSubmit={this.onMessageSubmit}>
          <input type="text" value={this.state.requestToAlexa} onChange={this.handleChange}
            placeholder="Type your request for Alexa..."
            className="request-input"
          />
        </form>

      </div>
    );
  }
}


export default ChatWindow;
