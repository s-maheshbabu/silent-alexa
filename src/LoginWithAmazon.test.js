import React from "react";
import {shallow, mount} from "enzyme";
import LoginWithAmazon from "./LoginWithAmazon";
const util = require("util")

let loginWithAmazon;
let loginWithAmazonInstance;
let mockUpdateAuthenticationInfo;
let amazonAuthorizationSpy;

beforeEach(() => {
    mockUpdateAuthenticationInfo = jest.fn();
    loginWithAmazon = shallow(<LoginWithAmazon updateAuthenticationInfo={mockUpdateAuthenticationInfo}/>);
    loginWithAmazonInstance = loginWithAmazon.instance();
    amazonAuthorizationSpy = jest.fn();

    Object.defineProperty(window, "amazon", {
        value: { Login: { authorize: amazonAuthorizationSpy } },
        writable: true
    });
});

it("renders without crashing", () => {
    shallow(<LoginWithAmazon />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<LoginWithAmazon />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies amazon authorization is called when login button is clicked", () => {
    mount(<LoginWithAmazon />).find("button").simulate("click");

    // Verify authorize called once
    expect(amazonAuthorizationSpy.mock.calls.length).toBe(1);
});

it("verifies updateAuthenticationInfo is called when handleResponse is called", () => {
    const response = "Some response body";
    loginWithAmazonInstance.handleResponse(response);
    expect(mockUpdateAuthenticationInfo).toHaveBeenCalledWith(response);
});
