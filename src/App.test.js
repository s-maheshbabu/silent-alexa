import React from "react";
import { shallow, mount } from "enzyme";
import App from "./App";

let app;
let appInstance;
let originalState;

beforeEach(() => {
  app = shallow(<App />);
  appInstance = app.instance();
  originalState = JSON.parse(JSON.stringify(app.instance().state));
});

it("renders without crashing", () => {
  shallow(<App />);
});

it("snapshot testing that it renders correctly", () => {
  const wrapper = mount(<App />);
  expect(wrapper).toMatchSnapshot();
});

it("verifies that authenticationInfo is passed to Body component", () => {
  const wrapper = mount(<App />);
  const originalAuthenticationInfo = wrapper.instance().state
    .authenticationInfo;

  // Verify that ChatWindow recieves authenticationInfo property
  const authenticationInfoProp = wrapper
    .find("Body")
    .prop("authenticationInfo");
  expect(authenticationInfoProp).toBe(originalAuthenticationInfo);
});

it("should not change state when authorization response (implicit grant) is not defined", () => {
  global.console = {
    log: jest.fn()
  };
  appInstance.handleAuthenticationInfoUpdate();
  expect(appInstance.state).toEqual(originalState);
  expect(global.console.log).toHaveBeenCalledWith(
    "Encountered an error on login: undefined"
  );
});

it("should not change state when authorization fails (implicit grant)", () => {
  global.console = {
    log: jest.fn()
  };
  const util = require("util");
  const response = {
    error: "some_error_code",
    error_description: "description about error as string",
    state: { page: "http://somePage" }
  };
  appInstance.handleAuthenticationInfoUpdate(response);
  expect(appInstance.state).toEqual(originalState);
  // Verify error message has been logged to console
  expect(global.console.log).toHaveBeenCalledWith(
    "Encountered an error on login: " +
      util.inspect(response, { showHidden: true, depth: null })
  );
});

it("should change state when authorization response (implicit grant) is defined", () => {
  const authResponse = {
    access_token: "some_access_token",
    expires_in: 30,
    state: "user_defined_state"
  };
  appInstance.handleAuthenticationInfoUpdate(authResponse);
  const finalState = {
    authenticationInfo: {
      access_token: authResponse.access_token,
      expires_in: authResponse.expires_in
    }
  };
  expect(appInstance.state).toEqual(finalState);
});
