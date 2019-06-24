import React from "react";
import { shallow, mount } from "enzyme";
import Body from "./Body";
import AuthenticationInfo from "AuthenticationInfo";

jest.mock("AuthenticationInfo");

beforeEach(() => {
  jest.resetAllMocks();
});

it("renders Body when AuthenticationInfo is present", () => {
  const isPresentMock = jest.spyOn(AuthenticationInfo, "isPresent");
  isPresentMock.mockImplementation(() => true);

  const wrapper = shallow(<Body />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("renders Body when AuthenticationInfo is not present", () => {
  const isPresentMock = jest.spyOn(AuthenticationInfo, "isPresent");
  isPresentMock.mockImplementation(() => false);

  const wrapper = shallow(<Body />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
