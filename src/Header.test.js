import React from "react";
import { shallow, mount } from "enzyme";
import Header from "./Header";

const mockIsLoggedIn = jest.fn();

beforeEach(() => {
  mockIsLoggedIn.mockReset();
});

it("renders Header without crashing", () => {
  mockIsLoggedIn.mockReturnValueOnce(false);
  mount(<Header isLoggedIn={() => mockIsLoggedIn} />);
});

it("renders correctly (snapshot testing)", () => {
  mockIsLoggedIn.mockReturnValueOnce(false);
  const wrapper = mount(<Header isLoggedIn={mockIsLoggedIn} />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("renders correctly logout (snapshot testing)", () => {
  mockIsLoggedIn.mockReturnValueOnce(true);
  const wrapper = mount(<Header isLoggedIn={() => mockIsLoggedIn} />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that updateAuthenticationInfo function is passed to LoginControl component", () => {
  const mockCallback = jest.fn();
  const header = shallow(<Header isLoggedIn={jest.fn()} updateAuthenticationInfo={mockCallback} />);

  // Verify that LoginControl is passed on updateAuthenticationInfo property
  const loginControlFunctionProp = header
    .find("LoginControl")
    .prop("updateAuthenticationInfo");
  expect(loginControlFunctionProp.length).toBe(1);

  // Verify that calling prop function passed to loginControl calls the mockCallback
  loginControlFunctionProp();
  expect(mockCallback.mock.calls.length).toEqual(1);
});
