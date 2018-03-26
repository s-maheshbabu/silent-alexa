import React from "react";
import { shallow, mount } from "enzyme";
import LoginControl from "./LoginControl";
const util = require("util");

const amazonAuthorizationSpy = jest.fn();
const mockIsLoggedIn = jest.fn();

beforeEach(() => {
  amazonAuthorizationSpy.mockReset();
  mockIsLoggedIn.mockReset();

  Object.defineProperty(window, "amazon", {
    value: { Login: { authorize: amazonAuthorizationSpy } },
    writable: true
  });
});

it("renders without crashing", () => {
  mockIsLoggedIn.mockReturnValueOnce(false);
  shallow(<LoginControl isLoggedIn={mockIsLoggedIn}/>);
});

it("renders LoginButton when isLoggedIn returns false (snapshot testing)", () => {
  mockIsLoggedIn.mockReturnValueOnce(false);
  const wrapper = mount(<LoginControl isLoggedIn={mockIsLoggedIn} />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("renders LogoutButton when isLoggedIn returns true (snapshot testing)", () => {
  mockIsLoggedIn.mockReturnValueOnce(true);
  const wrapper = mount(<LoginControl isLoggedIn={mockIsLoggedIn} />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that amazon authorization is called when login button is clicked", () => {
  mockIsLoggedIn.mockReturnValueOnce(false);
  mount(<LoginControl isLoggedIn={mockIsLoggedIn}/>).find("LoginButton").find("button").simulate("click");

  // Verify authorize called once
  expect(amazonAuthorizationSpy.mock.calls.length).toBe(1);
});

it("verifies that updateAuthenticationInfo is called when handleResponse is called", () => {
  const mockUpdateAuthenticationInfo = jest.fn();
  const loginControl = shallow(<LoginControl isLoggedIn={mockIsLoggedIn} updateAuthenticationInfo={mockUpdateAuthenticationInfo} />);
  const loginControlInstance = loginControl.instance();
  const response = "Some response body";
  loginControlInstance.handleResponse(response);
  expect(mockUpdateAuthenticationInfo).toHaveBeenCalledWith(response);
});

it("verifies that updateAuthenticationInfo is called when logout button is clicked", () => {
  const mockUpdateAuthenticationInfo = jest.fn();
  mockIsLoggedIn.mockReturnValueOnce(true);
  const wrapper = mount(<LoginControl isLoggedIn={mockIsLoggedIn} updateAuthenticationInfo={mockUpdateAuthenticationInfo} />)
  wrapper.find("LogoutButton").find("button").simulate("click");

  // Verify updateAuthenticationInfo called once
  expect(mockUpdateAuthenticationInfo.mock.calls.length).toBe(1);
  expect(mockUpdateAuthenticationInfo).toHaveBeenCalledWith();
});
