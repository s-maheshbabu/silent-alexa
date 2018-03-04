import React from "react";
import { shallow, mount } from "enzyme";

import { Message } from "react-chat-ui";
import ChatWindow from "./ChatWindow";

const users = require("./ConversingUsers");

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

it("pushMessage persists a given message in state", () => {
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

it("handles the user's input as they are typing their request (before submission)", () => {
  chatWindowInstance.setState({
    userRequestToAlexa: "some initial value",
    curr_user: 1
  });

  const expectedUserRequestToAlexa = "mock request";
  const preventDefaultSpy = jest.fn();
  const mockEvent = {
    target: { value: expectedUserRequestToAlexa },
    preventDefault: preventDefaultSpy
  };
  chatWindow.find("UserRequestToAlexaForm").simulate("change", mockEvent);

  const finalState = chatWindowInstance.state;
  const finalUserRequestToAlexa = finalState.userRequestToAlexa;

  // Verify that preventDefault() is being called.
  expect(preventDefaultSpy.mock.calls.length).toBe(1);
  expect(finalUserRequestToAlexa).toEqual(expectedUserRequestToAlexa);
});
