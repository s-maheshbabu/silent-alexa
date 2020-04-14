import React, { Component } from "react";
import { ChatFeed, Message } from "monkas-chat";
import ContainerDimensions from "react-container-dimensions";
import { instanceOf } from 'prop-types';

import ChatBubble from "ChatBubble/ChatBubble";
import { cannedErrorResponses, customErrorCodes } from "CannedErrorResponses";

import UserRequestToAlexaForm from "UserRequestToAlexaForm/UserRequestToAlexaForm";
import "./ChatWindow.css";

import { chatters, chatterIds } from "Chatters";

import AVSGateway from "AVSGateway";
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from "react-cookie";

import { AMAZON_LOGIN_COOKIE } from "Constants";
const avs = new AVSGateway();

// TODO: Existing dependency for chat window is not supported. Just making a note of
// a potentially better supported solution https://github.com/FaridSafi/react-native-gifted-chat
class ChatWindow extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

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
          avatar: chatters.get(chatterIds.ALEXA).avatar
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
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
        }),
        new Message({
          id: chatterIds.USER,
          message: "Hello Alexa!",
          senderName: chatters.get(chatterIds.USER).name
        }),
        new Message({
          id: chatterIds.ALEXA,
          message: "Hey! Alexa here.",
          avatar: chatters.get(chatterIds.ALEXA).avatar
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

    const history = this.props.history;
    const { cookies } = this.props;
    const access_token = cookies.get(AMAZON_LOGIN_COOKIE);
    if (access_token === undefined) {
      cookies.remove(AMAZON_LOGIN_COOKIE, undefined, {
        maxAge: 0,
        secure: false, // TODO: Change localhost to also use https and then change this to true.
        path: "/"
      });

      history.push("/access_denied");
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
      senderName: user.name,
      avatar: user.avatar
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
                showSenderName={true} // show the name of the user who sent the message
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

// TODO: Use Recomponse to make it more readable. Even better if we can make this class
// a function so we can just use hooks.
export default withRouter(withCookies(ChatWindow));
