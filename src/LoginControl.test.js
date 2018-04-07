import React from "react";
import { shallow, mount } from "enzyme";
import LoginControl from "./LoginControl";
import AuthenticationInfo from "./AuthenticationInfo";
const util = require("util");

let loginControl;
let loginControlInstance;
let mockUpdateAuthenticationInfo;
let amazonAuthorizationSpy;

beforeEach(() => {
  mockUpdateAuthenticationInfo = jest.fn();
  loginControl = shallow(
    <LoginControl updateAuthenticationInfo={mockUpdateAuthenticationInfo} />
  );
  loginControlInstance = loginControl.instance();
  amazonAuthorizationSpy = jest.fn();

  Object.defineProperty(window, "amazon", {
    value: { Login: { authorize: amazonAuthorizationSpy } },
    writable: true
  });
});

it("renders without crashing", () => {
  const wrapper = shallow(<LoginControl />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that amazon authorization is called when login button is clicked", () => {
  mount(<LoginControl />)
    .find("LoginButton")
    .find("button")
    .simulate("click");

  // Verify authorize called once
  expect(amazonAuthorizationSpy.mock.calls.length).toBe(1);
});

it("verifies that updateAuthenticationInfo is called when handleResponse is called with valid authResponse", () => {
  const response = {
    access_token: "some_access_token",
    expires_in: "30"
  };
  loginControlInstance.handleResponse(response);
  expect(mockUpdateAuthenticationInfo).toHaveBeenCalled();
  const authInfo = mockUpdateAuthenticationInfo.mock.calls[0][0];
  expect(authInfo.getAccessToken()).toBe(response.access_token);
});

it("verifies that updateAuthenticationInfo is not called when handleResponse is called with invalid authResponse", () => {
  const authResponseWithEmptyAccessToken = {
    access_token: "",
    expires_in: "30"
  };
  const authResponseWithMissingExpiresIn = {
    access_token: "some_access_token"
  };
  const authReponseWithError = {
    error: "some_error_code",
    error_description: "description about error as string"
  };
  const authResponseEmpty = {};
  let authResponseUndefined;
  const invalidAuthResponseObjects = [
    authResponseWithEmptyAccessToken,
    authResponseWithMissingExpiresIn,
    authReponseWithError,
    authResponseEmpty,
    authResponseUndefined
  ];
  for (let i = 0; i < invalidAuthResponseObjects.length; i++) {
    expect(
      loginControlInstance.isAuthResponseValid(invalidAuthResponseObjects[i])
    ).toBeFalsy();
  }
});
