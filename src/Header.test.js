import React from "react";
import {shallow, mount} from "enzyme";
import Header from "./Header";

it("renders Header without crashing", () => {
  mount(<Header />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<Header />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that updateAuthenticationInfo function is passed to LoginControl component", () => {
  const mockCallback = jest.fn();
  const header = shallow(<Header updateAuthenticationInfo={mockCallback} />);

  // Verify that LoginControl is passed on updateAuthenticationInfo property
  const loginControlFunctionProp = header.find("LoginControl").prop("updateAuthenticationInfo");
  expect(loginControlFunctionProp.length).toBe(1);

  // Verify that calling prop function passed to loginControl calls the mockCallback
  loginControlFunctionProp();
  expect(mockCallback.mock.calls.length).toEqual(1);
});