import React from "react";
import { shallow, mount } from "enzyme";
import { options, default as LoginControl } from "./LoginControl";
import AuthenticationInfo from "./AuthenticationInfo";
import util from "util";

let loginControl;
let loginControlInstance;
const mockUpdateAuthenticationInfo = jest.fn();
const mockClearAuthenticationInfo = jest.fn();
const mockLWAModule = jest.fn();
const mockIsAuthenticationInfoValid = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  Object.defineProperty(window, "amazon", {
    value: { Login: { authorize: mockLWAModule } },
    writable: true
  });
  loginControl = shallow(
    <LoginControl
      isAuthenticationInfoValid={mockIsAuthenticationInfoValid}
      clearAuthenticationInfo={mockClearAuthenticationInfo}
      updateAuthenticationInfo={mockUpdateAuthenticationInfo}
    />
  );
  loginControlInstance = loginControl.instance();
});

it("renders LoginControl with LoginButton component when isAuthenticationInfoValid returns falsy", () => {
  mockIsAuthenticationInfoValid.mockReturnValueOnce(false);
  const wrapper = shallow(
    <LoginControl isAuthenticationInfoValid={mockIsAuthenticationInfoValid} />
  );
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("renders LoginControl with LogoutButton component when isAuthenticationInfoValid returns truthy", () => {
  mockIsAuthenticationInfoValid.mockReturnValueOnce(true);
  const wrapper = shallow(
    <LoginControl isAuthenticationInfoValid={mockIsAuthenticationInfoValid} />
  );

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

it("verifies that props are passed to LogoutButton Component", () => {
  mockIsAuthenticationInfoValid.mockReturnValueOnce(true);
  const loginControl = shallow(
    <LoginControl
      isAuthenticationInfoValid={mockIsAuthenticationInfoValid}
      clearAuthenticationInfo={mockClearAuthenticationInfo}
    />
  );

  expect(Object.keys(loginControl.find("LogoutButton").props()).length).toBe(1);

  const onClickProp = loginControl.find("LogoutButton").prop("onClick");
  const handleLogoutSpy = jest.spyOn(loginControl.instance(), "handleLogout");

  onClickProp();

  expect(handleLogoutSpy).toHaveBeenCalled();
});

it("verifies that clearAuthenticationInfo is called when handleLogout is called", () => {
  loginControlInstance.handleLogout();

  expect(mockClearAuthenticationInfo).toHaveBeenCalledTimes(1);
});

it("verifies that lwa authorization is called when handleLogin is called", () => {
  loginControlInstance.handleLogin();
  const handleLWAResponseSpy = jest.spyOn(
    loginControlInstance,
    "handleLWAResponse"
  );
  const dummyLWAResponse = "dummyLWAResponse";

  expect(mockLWAModule).toHaveBeenCalledTimes(1);
  expect(mockLWAModule.mock.calls[0][0]).toBe(options);
  const lwaCallback = mockLWAModule.mock.calls[0][1];
  lwaCallback(dummyLWAResponse);
  expect(handleLWAResponseSpy).toHaveBeenCalledWith(dummyLWAResponse);
});

it("verifies that updateAuthenticationInfo is called when handleLWAResponse is called with valid lwaResponse", () => {
  const lwaResponse = {
    access_token: "some_access_token",
    expires_in: "30"
  };

  loginControlInstance.handleLWAResponse(lwaResponse);

  expect(mockUpdateAuthenticationInfo).toHaveBeenCalledTimes(1);
  const authenticationInfo = mockUpdateAuthenticationInfo.mock.calls[0][0];
  expect(authenticationInfo.getAccessToken()).toBe(lwaResponse.access_token);
});

it("verifies that updateAuthenticationInfo is not called when handleLWAResponse is called with invalid lwaResponse", () => {
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
    lwaResponseWithMissingAccessToken,
    lwaResponseWithEmptyExpiresIn,
    lwaResponseWithMissingExpiresIn,
    lwaReponseWithError,
    lwaResponseEmpty,
    lwaResponseUndefined
  ];

  for (let i = 0; i < invalidLWAResponseObjects.length; i++) {
    loginControlInstance.handleLWAResponse(invalidLWAResponseObjects[i]);

    expect(mockUpdateAuthenticationInfo).not.toHaveBeenCalled();
  }
});
