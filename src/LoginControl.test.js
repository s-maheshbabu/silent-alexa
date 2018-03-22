import React from "react";
import {shallow, mount} from "enzyme";
import LoginControl from "./LoginControl";
const util = require("util")

let loginControl;
let loginControlInstance;
let mockUpdateAuthenticationInfo;
let amazonAuthorizationSpy;

beforeEach(() => {
  mockUpdateAuthenticationInfo = jest.fn();
  loginControl = shallow(<LoginControl updateAuthenticationInfo={mockUpdateAuthenticationInfo} />);
  loginControlInstance = loginControl.instance();
  amazonAuthorizationSpy = jest.fn();

  Object.defineProperty(window, "amazon", {
    value: {Login: {authorize: amazonAuthorizationSpy}},
    writable: true
  });
});

it("renders without crashing", () => {
  shallow(<LoginControl />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<LoginControl />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that amazon authorization is called when login button is clicked", () => {
  mount(<LoginControl />).find("LoginButton").find("button").simulate("click");

  // Verify authorize called once
  expect(amazonAuthorizationSpy.mock.calls.length).toBe(1);
});

it("verifies that updateAuthenticationInfo is called when handleResponse is called", () => {
  const response = "Some response body";
  loginControlInstance.handleResponse(response);
  expect(mockUpdateAuthenticationInfo).toHaveBeenCalledWith(response);
});
