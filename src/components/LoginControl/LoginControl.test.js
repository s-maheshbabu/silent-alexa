import React from "react";
import { shallow, mount } from "enzyme";
import { options, redirectUri, default as LoginControl } from "./LoginControl";
import AuthenticationInfo from "AuthenticationInfo";
import util from "util";

let loginControl;
let loginControlInstance;
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

it("verifies that props are passed to HeaderFlatButton(Login) Component", () => {
  const button = loginControl.find("HeaderFlatButton");
  expect(Object.keys(button.props()).length).toBe(2);

  const labelProp = button.prop("label");
  expect(labelProp).toBe("Login");

  const onClickProp = button.prop("onClick");
  const handleLoginSpy = jest.spyOn(loginControlInstance, "handleLogin");

  onClickProp();

  expect(handleLoginSpy).toHaveBeenCalledTimes(1);
});

it("verifies that props are passed to HeaderFlatButton(Logout) Component", () => {
  mockIsAuthenticationInfoValid.mockReturnValueOnce(true);
  const loginControl = shallow(
    <LoginControl
      isAuthenticationInfoValid={mockIsAuthenticationInfoValid}
      clearAuthenticationInfo={mockClearAuthenticationInfo}
    />
  );

  const button = loginControl.find("HeaderFlatButton");
  expect(Object.keys(button.props()).length).toBe(2);

  const labelProp = button.prop("label");
  expect(labelProp).toBe("Logout");

  const onClickProp = button.prop("onClick");
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

  expect(mockLWAModule).toHaveBeenCalledTimes(1);
  expect(mockLWAModule.mock.calls[0][0]).toBe(options);
  expect(mockLWAModule.mock.calls[0][1]).toBe(redirectUri);
});
