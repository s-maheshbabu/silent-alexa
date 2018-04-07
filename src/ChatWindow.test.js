import React from "react";
import { shallow, mount } from "enzyme";

import { ChatFeed, Message } from "react-chat-ui";
import ChatWindow from "./ChatWindow";
import { cannedErrorResponses, customErrorCodes } from "./CannedErrorResponses";
import AuthenticationInfo from "./AuthenticationInfo";
jest.mock("./AuthenticationInfo");

import {
  mockSendTextMessageEventFunction,
  mockAlexaSuccessResponse
} from "./AVSGateway";

import { users, userIds } from "./ConversingUsers";
import { access } from "fs";

const CHATFEED_CONTAINER_HEIGHT = 234;
const CHATFEED_CONTAINER_HEIGHT_DEFAULT = 0;
const setHeightElement = function(height) {
  Element.prototype.getBoundingClientRect = jest.fn(() => {
    return {
      height: height
    };
  });
};

jest.mock("./AVSGateway");

let chatWindow;
let chatWindowInstance;
let originalState;
let preventDefaultSpy;

beforeEach(() => {
  mockSendTextMessageEventFunction.mockClear();

  preventDefaultSpy = jest.fn();
  chatWindow = shallow(<ChatWindow />);
  chatWindowInstance = chatWindow.instance();
  originalState = JSON.parse(JSON.stringify(chatWindowInstance.state));
});

it("renders correctly without crashing", () => {
  const wrapper = shallow(<ChatWindow />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("passes height of container to ChatFeed component", () => {
  // Set `height` element.
  setHeightElement(CHATFEED_CONTAINER_HEIGHT);

  const wrapper = mount(<ChatWindow />);
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

  const userId = userIds.YOU;
  const user = users.get(userId);
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

test("that when a user submits the form, we call AVSGateway with their request even if the access_token is not available.", () => {
  AuthenticationInfo.mockImplementation(() => {
    return {
      getAccessToken: () => {
        return undefined;
      }
    };
  });
  const chatWindow = mount(
    <ChatWindow authenticationInfo={new AuthenticationInfo()} />
  );
  const chatWindowInstance = chatWindow.instance();

  const userRequestToAlexaForm = chatWindow.find("form").get(0);
  const numberOfMessagesAlreadyInState = originalState.messages.length;

  const userRequestToAlexa = "a dummy user request";
  chatWindowInstance.setState({
    userRequestToAlexa: userRequestToAlexa,
    curr_user: users.get(userIds.YOU)
  });

  chatWindow
    .find("form")
    .simulate("submit", { preventDefault: preventDefaultSpy });

  expect(mockSendTextMessageEventFunction).toHaveBeenCalledTimes(1);
  expect(mockSendTextMessageEventFunction).toHaveBeenCalledWith(
    userRequestToAlexa,
    undefined
  );

  mockSendTextMessageEventFunction.mockClear();
});

it("handles the user's form submission with request to Alexa and populates the state with the user request and Alexa's response", done => {
  const access_token = "a dummy access token";
  AuthenticationInfo.mockImplementation(() => {
    return {
      getAccessToken: () => {
        return access_token;
      }
    };
  });

  const alexaId = userIds.ALEXA;
  const alexa = users.get(alexaId);
  let expectedAlexaResponse = new Message({
    id: alexaId,
    message: mockAlexaSuccessResponse,
    senderName: alexa.name
  });

  testOnUserRequestToAlexaSubmitHandling(
    access_token,
    expectedAlexaResponse,
    done
  );
});

it("handles the case when AVS throws an error in response to a user request. We should populate the state with the user request and a canned response.", done => {
  const access_token = "a dummy access token";
  AuthenticationInfo.mockImplementation(() => {
    return {
      getAccessToken: () => {
        return access_token;
      }
    };
  });
  // mock the AVSGateway to throw an error.
  mockSendTextMessageEventFunction.mockImplementation(() =>
    Promise.reject(
      new Error(cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR))
    )
  );

  const alexaId = userIds.ALEXA;
  const alexa = users.get(alexaId);
  let expectedAlexaResponse = new Message({
    id: alexaId,
    message: cannedErrorResponses.get(customErrorCodes.UNKNOWN_ERROR),
    senderName: alexa.name
  });

  testOnUserRequestToAlexaSubmitHandling(
    access_token,
    expectedAlexaResponse,
    done
  );
});

it("handles gracefully when the input form is submitted with a null or empty request string", () => {
  const numberOfMessagesAlreadyInState = originalState.messages.length;

  const userRequestToAlexaForm = chatWindow
    .find("UserRequestToAlexaForm")
    .get(0);

  let nullUserRequestToAlexa;
  chatWindowInstance.setState({
    userRequestToAlexa: nullUserRequestToAlexa
  });

  chatWindow
    .find("UserRequestToAlexaForm")
    .simulate("submit", { preventDefault: preventDefaultSpy });

  const finalState = chatWindowInstance.state;

  // Verify that preventDefault() is being called.
  expect(preventDefaultSpy.mock.calls.length).toBe(1);

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
  expect(preventDefaultSpy.mock.calls.length).toBe(1);
  expect(finalUserRequestToAlexa).toEqual(expectedUserRequestToAlexa);
});

/**
 * Helper method to test the interaction with Alexa. Will simulate a user request and
 * verify that the expected messages are populated into the state.
 * @param {Message} expectedAlexaResponse The expected response from Alexa to be verified
 * against.
 */
const testOnUserRequestToAlexaSubmitHandling = (
  expected_access_token,
  expectedAlexaResponse,
  done
) => {
  const chatWindow = mount(
    <ChatWindow authenticationInfo={new AuthenticationInfo()} />
  );
  const chatWindowInstance = chatWindow.instance();
  const originalState = JSON.parse(JSON.stringify(chatWindowInstance.state));

  const userRequestToAlexaForm = chatWindow.find("form").get(0);
  const numberOfMessagesAlreadyInState = originalState.messages.length;

  const userRequestToAlexa = "a dummy user request";
  const userId = userIds.YOU;
  const user = users.get(userId);
  chatWindowInstance.setState({
    userRequestToAlexa: userRequestToAlexa,
    curr_user: userId
  });

  chatWindow
    .find("form")
    .simulate("submit", { preventDefault: preventDefaultSpy });

  expect(preventDefaultSpy.mock.calls.length).toBe(1);

  expect(mockSendTextMessageEventFunction).toHaveBeenCalledTimes(1);
  expect(mockSendTextMessageEventFunction).toHaveBeenCalledWith(
    userRequestToAlexa,
    expected_access_token
  );

  let expectedUserMessage = new Message({
    id: userId,
    message: userRequestToAlexa,
    senderName: user.name
  });

  setImmediate(() => {
    const finalState = chatWindowInstance.state;
    const finalMessages = finalState.messages;

    expect(finalMessages.length).toBe(numberOfMessagesAlreadyInState + 2);
    expect(finalMessages[finalMessages.length - 2]).toEqual(
      expectedUserMessage
    );
    expect(finalMessages[finalMessages.length - 1]).toEqual(
      expectedAlexaResponse
    );

    expect(chatWindowInstance.state.userRequestToAlexa).toEqual("");
    done();
  });
};
