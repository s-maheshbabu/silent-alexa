import React, { Component } from "react";
import { ChatFeed, Message } from "react-chat-ui";

import UserRequestToAlexaForm from "./UserRequestToAlexaForm.js";
const users = require("./ConversingUsers");

class ChatWindow extends Component {
  constructor() {
    super();
    this.state = {
      messages: [
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({
          id: 1,
          message: "Hey! Alexa here.",
          senderName: "Alexa"
        })
      ],
      userRequestToAlexa: "",
      useCustomBubble: false,
      curr_user: 0,
      is_typing: false
    };

    this.onUserRequestToAlexaSubmit = this.onUserRequestToAlexaSubmit.bind(
      this
    );
    this.handleChangeInUserRequestToAlexa = this.handleChangeInUserRequestToAlexa.bind(
      this
    );
  }

  /*
  Once the user submits the request for Alexa, we need to update the messages
  in the state so the chat window gets updated.
  */
  onUserRequestToAlexaSubmit(e) {
    const userRequestToAlexa = this.state.userRequestToAlexa;
    e.preventDefault();
    if (!userRequestToAlexa || 0 === userRequestToAlexa.length) {
      console.log("Request string for Alexa was empty: " + userRequestToAlexa);
      this.setState({ userRequestToAlexa: "" });
      return false;
    }
    this.pushMessage(this.state.curr_user, userRequestToAlexa);
    this.setState({ userRequestToAlexa: "" });
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
      senderName: users[userid]
    });
    messagesCopy.push(newMessage);
    this.setState({ messages: messagesCopy });
  }

  /*
  Update the state as the user is typing into the input box
  */
  handleChangeInUserRequestToAlexa(event) {
    event.preventDefault();
    this.setState({ userRequestToAlexa: event.target.value });
  }

  render() {
    return (
      <div className="ChatWindow">
        <ChatFeed
          messages={this.state.messages}
          isTyping={this.state.is_typing} // Boolean: is the recipient typing
          hasInputField={false} // Boolean: use our input, or use your own
          showSenderName={false} // show the name of the user who sent the message
          bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
        />

        <UserRequestToAlexaForm
          value={this.state.userRequestToAlexa}
          onChange={e => this.handleChangeInUserRequestToAlexa(e)}
          onSubmit={e => this.onUserRequestToAlexaSubmit(e)}
        />
      </div>
    );
  }
}

export default ChatWindow;
