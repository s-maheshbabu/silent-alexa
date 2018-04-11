import React from "react";
import { shallow, mount } from "enzyme";
import LoginControl from "./LoginControl";
import AuthenticationInfo from "./AuthenticationInfo";
const util = require("util");

let loginControl;
let loginControlInstance;
const mockUpdateAuthenticationInfo = jest.fn();
const mockAmazonAuthorization = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  Object.defineProperty(window, "amazon", {
    value: { Login: { authorize: mockAmazonAuthorization } },
    writable: true
  });
  loginControl = shallow(
    <LoginControl updateAuthenticationInfo={mockUpdateAuthenticationInfo} />
  );
  loginControlInstance = loginControl.instance();
});

it("renders LoginButton without crashing", () => {
  const wrapper = shallow(<LoginControl />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that props are passed to LoginButton Component", () => {
  expect(Object.keys(loginControl.find("LoginButton").props()).length).toBe(1);
  const onClickProp = loginControl.find("LoginButton").prop("onClick");
  const handleLoginSpy = jest.spyOn(loginControlInstance, "handleLogin");

  onClickProp();

  expect(handleLoginSpy).toHaveBeenCalledTimes(1);
});

it("verifies that amazon authorization is called when handleLogin is called", () => {
  loginControlInstance.handleLogin();

  // Verify authorize called once
  expect(mockAmazonAuthorization.mock.calls.length).toBe(1);
});

it("verifies that updateAuthenticationInfo is called when handleResponse is called with valid lwaResponse", () => {
  const response = {
    access_token: "some_access_token",
    expires_in: "30"
  };

  loginControlInstance.handleResponse(response);

  expect(mockUpdateAuthenticationInfo).toHaveBeenCalledTimes(1);
  const authenticationInfo = mockUpdateAuthenticationInfo.mock.calls[0][0];
  expect(authenticationInfo.getAccessToken()).toBe(response.access_token);
});

it("verifies that updateAuthenticationInfo is not called when handleResponse is called with invalid lwaResponse", () => {
  const lwaResponseWithEmptyAccessToken = {
    access_token: "",
    expires_in: "30"
  };
  const lwaResponseWithMissingAccessToken = {
    expires_in: "30"
  };
  const lwaResponseWithMissingExpiresIn = {
    access_token: "some_access_token"
  };
  const lwaResponseWithEmptyExpiresIn = {
    access_token: "some_access_token",
    expires_in: ""
  };
  const lwaReponseWithError = {
    error: "some_error_code",
    error_description: "description about error as string"
  };
  const lwaResponseEmpty = {};
  let lwaResponseUndefined;

  const invalidLWAResponseObjects = [
    lwaResponseWithEmptyAccessToken,
    lwaResponseWithMissingExpiresIn,
    lwaReponseWithError,
    lwaResponseEmpty,
    lwaResponseUndefined
  ];

  for (let i = 0; i < invalidLWAResponseObjects.length; i++) {
    loginControlInstance.handleResponse(invalidLWAResponseObjects[i]);

    expect(mockUpdateAuthenticationInfo).not.toHaveBeenCalled();
  }
});
