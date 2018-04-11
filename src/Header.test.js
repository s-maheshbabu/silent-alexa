import React from "react";
import { shallow } from "enzyme";
import Header from "./Header";

it("renders Header without crashing", () => {
  const wrapper = shallow(<Header />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that updateAuthenticationInfo function is passed to LoginControl component", () => {
  const mockCallback = jest.fn();
  const header = shallow(<Header updateAuthenticationInfo={mockCallback} />);

  // Verify that LoginControl is passed on updateAuthenticationInfo property
  const loginControlFunctionProp = header
    .find("LoginControl")
    .prop("updateAuthenticationInfo");

  expect(loginControlFunctionProp.length).toBe(1);

  // Verify that calling prop function passed to loginControl calls the mockCallback
  let dummyArgument = "dummy argument";
  loginControlFunctionProp(dummyArgument);

  expect(mockCallback).toHaveBeenCalledWith(dummyArgument);
});
