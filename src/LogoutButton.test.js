import React from "react";
import {shallow, mount} from "enzyme";
import LogoutButton from "./LogoutButton";

it("renders LogoutButton without crashing", () => {
  mount(<LogoutButton />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<LogoutButton />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that the callback function is called when login button is clicked", () => {
  const mockCallBack = jest.fn();
  const button = shallow(<LogoutButton onClick={mockCallBack} />).find("button");
  expect(button.length).toBe(1);
  button.simulate("click");

  // Verify mockCallBack called once
  expect(mockCallBack.mock.calls.length).toBe(1);
});