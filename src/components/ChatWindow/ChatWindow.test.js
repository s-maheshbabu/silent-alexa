import React from "react";
import { shallow, mount } from "enzyme";
import clone from "clone";
import { List, fromJS } from "immutable";

import { ChatFeed, Message } from "monkas-chat";
import ChatWindow from "./ChatWindow";
import { cannedErrorResponses, customErrorCodes } from "CannedErrorResponses";
import { Cookies } from 'react-cookie';

import { AMAZON_LOGIN_COOKIE } from "Constants";

import {
  mockSendTextMessageEventFunction,
  mockAlexaSuccessResponses
} from "AVSGateway";

import { chatters, chatterIds } from "Chatters";

const CHATFEED_CONTAINER_HEIGHT = 234;
const CHATFEED_CONTAINER_HEIGHT_DEFAULT = 0;

const setHeightElement = function (height) {
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      height: height
    };
  });
};

jest.mock("AVSGateway");

let chatWindow;
let chatWindowInstance;
let originalState;
let preventDefaultSpy;
let cookies;

beforeEach(() => {
  mockSendTextMessageEventFunction.mockClear();
  cookies = new Cookies();

  preventDefaultSpy = jest.fn();
  chatWindow = shallow(<ChatWindow.WrappedComponent cookies={cookies} />);
  chatWindowInstance = chatWindow.instance();
  originalState = clone(chatWindowInstance.state);
});

it("renders correctly without crashing", () => {
  expect(chatWindow).toMatchSnapshot();
});

it("passes height of container to ChatFeed component", () => {
  // Set `height` element.
  setHeightElement(CHATFEED_CONTAINER_HEIGHT);

  const wrapper = mount(<ChatWindow.WrappedComponent cookies={cookies} />, {});
  const chatFeed = wrapper.find(ChatFeed);

  expect(chatFeed.length).toBe(1);
  expect(chatFeed.prop("maxHeight")).toBe(CHATFEED_CONTAINER_HEIGHT);

  wrapper.unmount();

  //Reset `height` element
  setHeightElement(CHATFEED_CONTAINER_HEIGHT_DEFAULT);
});

it("persists a given message in state when pushMessage is called", () => {
  const numberOfMessagesAlreadyInState = originalState.messages.length;
  expect(originalState.messages.length).toBe(numberOfMessagesAlreadyInState);

  const userId = chatterIds.USER;
  const user = chatters.get(userId);
  const message = "test message";
  const expectedMessage = new Message({
    id: userId,
    message,
    senderName: user.name
  });

  chatWindowInstance.pushMessage(userId, message);
  const finalState = chatWindowInstance.state;

  const finalMessages = finalState.messages;
  expect(finalMessages.length).toBe(numberOfMessagesAlreadyInState + 1);
  expect(finalMessages[numberOfMessagesAlreadyInState]).toEqual(
    expectedMessage
  );
});

it("handles gracefully when pushMessage is called with an unknown user", () => {
  const invalidUserid = 1000; // valid values are just 0 and 1

  chatWindowInstance.pushMessage(invalidUserid, "test message");
  const finalState = chatWindowInstance.state;

  // Nothing about the state should have changed.
  expect(finalState).toEqual(originalState);
});

it("handles gracefully when pushMessage is called with an empty or null message", () => {
  const userid = 1;
  const emptyMessage = "";

  chatWindowInstance.pushMessage(userid, emptyMessage);
  let finalState = chatWindowInstance.state;

  // Nothing about the state should have changed.
  expect(finalState).toEqual(originalState);

  let nullMessage;

  chatWindowInstance.pushMessage(userid, nullMessage);
  finalState = chatWindowInstance.state;

  // Nothing about the state should have changed.
  expect(finalState).toEqual(originalState);
});

test("that when a user submits the form, we do not call AVSGateway if the user is not authenticated and redirect the user away from the protected chat screen.", () => {
  const history = { push: jest.fn() };

  cookies = new Cookies();
  const mockCookiesRemove = cookies.remove = jest.fn();

  const chatWindow = mount(<ChatWindow.WrappedComponent history={history} cookies={cookies} />);
  const chatWindowInstance = chatWindow.instance();

  const userRequestToAlexa = "a dummy user request";
  chatWindowInstance.setState({
    userRequestToAlexa: userRequestToAlexa,
    curr_user: chatters.get(chatterIds.YOU)
  });

  chatWindow
    .find("form")
    .simulate("submit", { preventDefault: preventDefaultSpy });

  expect(mockSendTextMessageEventFunction).not.toHaveBeenCalled();

  expect(mockCookiesRemove).toHaveBeenCalledTimes(1);
  expect(mockCookiesRemove.mock.calls[0][0]).toBe(AMAZON_LOGIN_COOKIE);
  expect(mockCookiesRemove.mock.calls[0][1]).toBe(undefined);
  expect(mockCookiesRemove.mock.calls[0][2]).toStrictEqual({
    maxAge: 0,
    secure: false,
    path: "/"
  });

  expect(history.push).toHaveBeenCalledTimes(1);
  expect(history.push).toHaveBeenCalledWith('/access_denied');
});

it("handles the user's form submission with request to Alexa and populates the state with the user request and Alexa's response", done => {
  const alexaId = chatterIds.ALEXA;
  const alexa = chatters.get(alexaId);

  const expectedAlexaResponses = mockAlexaSuccessResponses.map(
    alexaResponse =>
      new Message({
        id: alexaId,
        message: alexaResponse,
        senderName: alexa.name,
        avatar: alexa.avatar
      })
  );

  testOnUserRequestToAlexaSubmitHandling(expectedAlexaResponses, done);
});

it("handles the case when AVS throws an error in response to a user request. We should populate the state with the user request and a canned response.", done => {
  // mock the AVSGateway to throw an error.
  mockSendTextMessageEventFunction.mockImplementation(() =>
    Promise.reject(
      new Error(cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR))
    )
  );

  const alexaId = chatterIds.ALEXA;
  const alexa = chatters.get(alexaId);
  const expectedAlexaResponse = List.of(
    new Message({
      id: alexaId,
      message: cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR),
      senderName: alexa.name,
      avatar: alexa.avatar
    })
  );

  testOnUserRequestToAlexaSubmitHandling(expectedAlexaResponse, done);
});

it("handles gracefully when the input form is submitted with a null or empty request string", () => {
  let nullUserRequestToAlexa;
  chatWindowInstance.setState({
    userRequestToAlexa: nullUserRequestToAlexa
  });

  chatWindow
    .find("UserRequestToAlexaForm")
    .simulate("submit", { preventDefault: preventDefaultSpy });

  const finalState = chatWindowInstance.state;

  // Verify that preventDefault() is being called.
  expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

  // Nothing about the state should have changed.
  expect(finalState).toEqual(originalState);
});

it("handles the user's input as they are typing their request (before submission)", () => {
  chatWindowInstance.setState({
    userRequestToAlexa: "some initial value",
    curr_user: 1
  });

  const expectedUserRequestToAlexa = "a dummy user request";
  const event = {
    target: { value: expectedUserRequestToAlexa },
    preventDefault: preventDefaultSpy
  };
  chatWindow.find("UserRequestToAlexaForm").simulate("change", event);

  const finalState = chatWindowInstance.state;
  const finalUserRequestToAlexa = finalState.userRequestToAlexa;

  // Verify that preventDefault() is being called.
  expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  expect(finalUserRequestToAlexa).toEqual(expectedUserRequestToAlexa);
});

/**
 * Helper method to test the interaction with Alexa. Will simulate a user request and
 * verify that the expected messages are populated into the state.
 * @param {Message} expectedAlexaResponses The expected responses from Alexa to be verified
 * against.
 */
const testOnUserRequestToAlexaSubmitHandling = (
  expectedAlexaResponses,
  done
) => {
  const access_token = "a dummy access token";
  cookies.set(AMAZON_LOGIN_COOKIE, access_token, { path: '/' });

  const chatWindow = mount(<ChatWindow.WrappedComponent cookies={cookies} />);
  const chatWindowInstance = chatWindow.instance();
  const originalState = clone(chatWindowInstance.state);

  const numberOfMessagesAlreadyInState = originalState.messages.length;

  const userRequestToAlexa = "a dummy user request";
  const userId = chatterIds.USER;
  const user = chatters.get(userId);

  chatWindowInstance.setState({
    userRequestToAlexa: userRequestToAlexa,
    curr_user: userId
  });

  chatWindow
    .find("form")
    .simulate("submit", { preventDefault: preventDefaultSpy });

  expect(preventDefaultSpy).toHaveBeenCalledTimes(1);

  expect(mockSendTextMessageEventFunction).toHaveBeenCalledTimes(1);
  expect(mockSendTextMessageEventFunction).toHaveBeenCalledWith(
    userRequestToAlexa,
    access_token
  );

  const expectedUserMessage = new Message({
    id: userId,
    message: userRequestToAlexa,
    senderName: user.name
  });

  setImmediate(() => {
    const finalState = chatWindowInstance.state;
    const finalMessages = finalState.messages;

    // We should have added userMessage and all of Alexa's responses.
    const numberOfExpectedAlexaResponses = expectedAlexaResponses.size;
    const numberOfNewMessagesToGoIntoState = 1 + numberOfExpectedAlexaResponses;

    expect(finalMessages.length).toBe(
      numberOfMessagesAlreadyInState + numberOfNewMessagesToGoIntoState
    );
    expect(finalMessages[numberOfMessagesAlreadyInState]).toEqual(
      expectedUserMessage
    );
    expect(
      fromJS(finalMessages.slice(numberOfMessagesAlreadyInState + 1))
    ).toEqual(expectedAlexaResponses);

    expect(chatWindowInstance.state.userRequestToAlexa).toEqual("");
    done();
  });
};

afterEach(() => {
  chatWindow.unmount();
});
