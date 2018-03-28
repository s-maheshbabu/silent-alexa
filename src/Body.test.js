import React from "react";
import { mount } from "enzyme";
import Body from "./Body";

it("renders Body without crashing", () => {
  mount(<Body />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<Body />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that authenticationInfo is passed to ChatWindow component", () => {
  const mockAuthenticationInfo = {};
  const body = mount(<Body authenticationInfo={mockAuthenticationInfo} />);

  // Verify that ChatWindow recieves authenticationInfo property
  const authenticationInfoProp = body
    .find("ChatWindow")
    .prop("authenticationInfo");
  expect(authenticationInfoProp).toBe(mockAuthenticationInfo);
});
