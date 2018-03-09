import React from "react";
import { shallow, mount } from "enzyme";

import { ChatFeed, Message } from "react-chat-ui";
import ChatWindow from "./ChatWindow";

const users = require("./ConversingUsers");
const CHATFEED_CONTAINER_HEIGHT = 234;

let chatWindow;
let chatWindowInstance;
let originalState;

beforeEach(() => {
  chatWindow = shallow(<ChatWindow />);
  chatWindowInstance = chatWindow.instance();
  originalState = JSON.parse(JSON.stringify(chatWindow.instance().state));
});

it("renders ChatWindow without crashing", () => {
  mount(<ChatWindow />);
});

it("renders correctly (snapshot testing)", () => {
  // Set height of the ChatFeed container.
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      height: CHATFEED_CONTAINER_HEIGHT
    };
  });

  const wrapper = mount(<ChatWindow />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("passes height of container to ChatFeed component", () => {
  // Set height of the ChatFeed container.
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      height: CHATFEED_CONTAINER_HEIGHT
    };
  });

  const wrapper = mount(<ChatWindow />);
  const chatFeed = wrapper.find(ChatFeed);

  expect(chatFeed.length).toBe(1);
  expect(chatFeed.prop("maxHeight")).toBe(CHATFEED_CONTAINER_HEIGHT);

  wrapper.unmount();
});

it("persists a given message in state when pushMessage is called", () => {
  const numberOfMessagesAlreadyInState = originalState.messages.length;
  expect(originalState.messages.length).toBe(numberOfMessagesAlreadyInState);

  const userid = 1;
  const message = "test message";
  const expectedMessage = new Message({
    id: userid,
    message,
    senderName: users[userid]
  });

  chatWindow.instance().pushMessage(userid, message);
  const finalState = chatWindow.instance().state;

  const finalMessages = finalState.messages;
  expect(finalMessages.length).toBe(numberOfMessagesAlreadyInState + 1);
  expect(finalMessages[numberOfMessagesAlreadyInState]).toEqual(
    expectedMessage
  );
});

it("handles gracefully when pushMessage is called with an unknown user", () => {
  const invalidUserid = 1000; // valid values are just 0 and 1

  chatWindow.instance().pushMessage(invalidUserid, "test message");
  const finalState = chatWindow.instance().state;

  // Nothing about the state should have changed.
  expect(finalState).toEqual(originalState);
});

it("handles gracefully when pushMessage is called with an empty or null message", () => {
  const userid = 1;
  const emptyMessage = "";

  chatWindow.instance().pushMessage(userid, emptyMessage);
  let finalState = chatWindow.instance().state;

  // Nothing about the state should have changed.
  expect(finalState).toEqual(originalState);

  let nullMessage;

  chatWindow.instance().pushMessage(userid, nullMessage);
  finalState = chatWindow.instance().state;

  // Nothing about the state should have changed.
  expect(finalState).toEqual(originalState);
});

it("handles the user's form submission with request to Alexa properly", () => {
  const chatWindow = mount(<ChatWindow />);
  const chatWindowInstance = chatWindow.instance();
  const originalState = JSON.parse(JSON.stringify(chatWindowInstance.state));

  const userRequestToAlexaForm = chatWindow.find("form").get(0);
  const numberOfMessagesAlreadyInState = originalState.messages.length;

  const mockuserRequestToAlexa = "mock request";
  const userid = 1;
  chatWindowInstance.setState({
    userRequestToAlexa: mockuserRequestToAlexa,
    curr_user: userid
  });

  const preventDefaultSpy = jest.fn();
  chatWindow
    .find("form")
    .simulate("submit", { preventDefault: preventDefaultSpy });

  // Verify that preventDefault() is being called.
  expect(preventDefaultSpy.mock.calls.length).toBe(1);

  const finalState = chatWindowInstance.state;

  const expectedMessage = new Message({
    id: userid,
    message: mockuserRequestToAlexa,
    senderName: users[userid]
  });
  const finalMessages = finalState.messages;
  expect(finalMessages.length).toBe(numberOfMessagesAlreadyInState + 1);
  expect(finalMessages[numberOfMessagesAlreadyInState]).toEqual(
    expectedMessage
  );

  expect(chatWindowInstance.state.userRequestToAlexa).toEqual("");
});

it("handles gracefully when the input form is submitted with a null or empty request string", () => {
  const numberOfMessagesAlreadyInState = originalState.messages.length;

  const userRequestToAlexaForm = chatWindow
    .find("UserRequestToAlexaForm")
    .get(0);

  let nulluserRequestToAlexa;
  chatWindowInstance.setState({
    userRequestToAlexa: nulluserRequestToAlexa
  });

  chatWindow
    .find("UserRequestToAlexaForm")
    .simulate("submit", { preventDefault: jest.fn() });

  const finalState = chatWindowInstance.state;

  // Nothing about the state should have changed.
  expect(finalState).toEqual(originalState);
});
