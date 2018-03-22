import React, { Component } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import ContainerDimensions from "react-container-dimensions";

import UserRequestToAlexaForm from "./UserRequestToAlexaForm";
import "./ChatWindow.css";

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
        }),
        // TODO Adding a bunch of dummy messages to make the ChatFeed overflow window height.
        // This will be useful during the development phase but will be removed once we are confident about the layout.
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 1, message: "Hello Alexa!", senderName: "You" }),
        new Message({ id: 0, message: "Hello Alexa!", senderName: "You" })
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
  onUserRequestToAlexaSubmit(event) {
    const userRequestToAlexa = this.state.userRequestToAlexa;
    event.preventDefault();
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
      <div id="leftpanel">
        <div className="panel-body">
          <ContainerDimensions>
            {({ height }) => (
              <ChatFeed
                messages={this.state.messages}
                isTyping={this.state.is_typing} // is the recipient typing
                hasInputField={false} // use the default input field that is provided along with ChatFeed component
                showSenderName={false} // show the name of the user who sent the message
                bubblesCentered={false}
                maxHeight={height}
              />
            )}
          </ContainerDimensions>
        </div>
        <div id="chat-input">
          <UserRequestToAlexaForm
            value={this.state.userRequestToAlexa}
            onChange={e => this.handleChangeInUserRequestToAlexa(e)}
            onSubmit={e => this.onUserRequestToAlexaSubmit(e)}
          />
        </div>
      </div>
    );
  }
}

export default ChatWindow;
