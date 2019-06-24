import React from "react";
import { shallow, mount } from "enzyme";
import AuthenticationInfo from "AuthenticationInfo";
import {
  options,
  REDIRECT_PATH,
  default as LoginControl
} from "./LoginControl";

let loginControl;
let loginControlInstance;
const mockClearAuthenticationInfo = jest.fn();
const mockLWAModule = jest.fn();
const mockIsAuthenticationInfoValid = jest.fn();

jest.mock("AuthenticationInfo");

beforeEach(() => {
  jest.resetAllMocks();
  Object.defineProperty(window, "amazon", {
    value: { Login: { authorize: mockLWAModule } },
    writable: true
  });
  loginControl = shallow(<LoginControl />);
  loginControlInstance = loginControl.instance();
});

it("renders LoginControl with LoginButton component when AuthenticationInfo is not present", () => {
  const isPresentMock = jest.spyOn(AuthenticationInfo, "isPresent");
  isPresentMock.mockImplementation(() => false);
  const wrapper = shallow(<LoginControl />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("renders LoginControl with LogoutButton component when AuthenticationInfo is present", () => {
  const isPresentMock = jest.spyOn(AuthenticationInfo, "isPresent");
  isPresentMock.mockImplementation(() => true);
  const wrapper = shallow(<LoginControl />);

  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that props are passed to HeaderFlatButton(Login) Component", () => {
  const isPresentMock = jest.spyOn(AuthenticationInfo, "isPresent");
  isPresentMock.mockImplementation(() => false);

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
  const isPresentMock = jest.spyOn(AuthenticationInfo, "isPresent");
  isPresentMock.mockImplementation(() => true);

  const loginControl = shallow(<LoginControl />);

  const button = loginControl.find("HeaderFlatButton");
  expect(Object.keys(button.props()).length).toBe(2);

  const labelProp = button.prop("label");
  expect(labelProp).toBe("Logout");

  const onClickProp = button.prop("onClick");
  const handleLogoutSpy = jest.spyOn(loginControl.instance(), "handleLogout");

  onClickProp();

  expect(handleLogoutSpy).toHaveBeenCalled();
});

it("verifies that AuthenticationInfo is cleared when handleLogout is called", () => {
  loginControlInstance.handleLogout();

  expect(AuthenticationInfo.clear).toHaveBeenCalledTimes(1);
});

it("verifies that lwa authorization is called when handleLogin is called", () => {
  loginControlInstance.handleLogin();

  expect(mockLWAModule).toHaveBeenCalledTimes(1);
  expect(mockLWAModule.mock.calls[0][0]).toBe(options);
  expect(mockLWAModule.mock.calls[0][1]).toBe(
    window.location.href + REDIRECT_PATH
  );
});
