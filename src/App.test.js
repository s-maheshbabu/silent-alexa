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

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<App />);
  expect(wrapper).toMatchSnapshot();
  wrapper.unmount();
});

it("renders LogoutButton when authenticationInfo state changes", () => {
  const wrapper = mount(<App />);
  wrapper.setState({authenticationInfo: {access_token: "some_access_token", expires_in: "30"}});
  expect(wrapper).toMatchSnapshot();
  wrapper.unmount();
});

it("should not change state when authorization response (implicit grant) is not defined", () => {
  global.console = {
    log: jest.fn()
  };
  appInstance.handleAuthenticationInfoUpdate();
  expect(appInstance.state).toEqual(originalState);
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
