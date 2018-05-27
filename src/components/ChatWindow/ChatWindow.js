import React, { Component } from "react";
import { ChatFeed, Message } from "react-chat-ui";
import ContainerDimensions from "react-container-dimensions";

import ChatBubble from "ChatBubble/ChatBubble";
import { cannedErrorResponses, customErrorCodes } from "CannedErrorResponses";

import UserRequestToAlexaForm from "UserRequestToAlexaForm/UserRequestToAlexaForm";
import "./ChatWindow.css";

import { chatters, chatterIds } from "Chatters";

import AVSGateway from "AVSGateway";
const avs = new AVSGateway();

class ChatWindow extends Component {
  constructor() {
    super();
    this.state = {
      messages: [
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        // TODO Adding a bunch of dummy messages to make the ChatFeed overflow window height.
        // This will be useful during the development phase but will be removed once we are confident about the layout.
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          senderName: chatters.get(chatterIds.ALEXA).name
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        })
      ],
      userRequestToAlexa: "",
      is_typing: false
    };
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
      return;
    }
    this.pushMessage(chatterIds.USER, userRequestToAlexa);
    this.setState({ userRequestToAlexa: "" });

    let access_token;
    // If authenticationInfo is defined, then access_token is defined.
    if (this.props.authenticationInfo) {
      access_token = this.props.authenticationInfo.getAccessToken();
    } else {
      // Do not make a call to avs if access_token is undefined. Redirect the user to login screen.
      this.props.clearAuthenticationInfo();
      return;
    }

    avs
      .sendTextMessageEvent(userRequestToAlexa, access_token)
      .then(alexaResponses =>
        alexaResponses.map(alexaResponse =>
          this.pushMessage(chatterIds.ALEXA, alexaResponse)
        )
      )
      .catch(error => {
        // TODO: Don't show this as an Alexa bubble. It also doesn't make sense to show it as a user bubble.
        // Need to find a way to represent this error on the UI.
        this.pushMessage(
          chatterIds.ALEXA,
          cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR)
        );
      });
  }

  pushMessage(userId, message) {
    const user = chatters.get(userId);
    if (!user) {
      console.log("Unknown userId: " + userId);
      return;
    }
    if (!message || 0 === message.length) {
      console.log("Empty message: " + message);
      return;
    }

    const messagesCopy = this.state.messages.slice(); // for immutability
    const newMessage = new Message({
      id: userId,
      message,
      senderName: user.name
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
                chatBubble={ChatBubble}
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