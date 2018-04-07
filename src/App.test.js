import React from "react";
import { shallow } from "enzyme";
import App from "./App";
import AuthenticationInfo from "./AuthenticationInfo";

let app;
let appInstance;
let originalState;

beforeEach(() => {
  app = shallow(<App />);
  appInstance = app.instance();
  originalState = appInstance.state;
});

it("renders correctly without crashing", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
  wrapper.unmount();
});

it("verifies that authenticationInfo is passed to Body component", () => {
  const wrapper = shallow(<App />);
  const originalAuthenticationInfo = wrapper.instance().state
    .authenticationInfo;

  // Verify that Body recieves authenticationInfo property
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
  expect(appInstance.state.authenticationInfo.getAccessToken()).toEqual(
    new AuthenticationInfo().getAccessToken()
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
  expect(appInstance.state.authenticationInfo.getAccessToken()).toEqual(
    new AuthenticationInfo().getAccessToken()
  );
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
  const expectedAuthenticationInfo = new AuthenticationInfo(authResponse);
  const actualAuthenticationInfo = appInstance.state.authenticationInfo;
  expect(actualAuthenticationInfo.getAccessToken()).toEqual(
    expectedAuthenticationInfo.getAccessToken()
  );
});
