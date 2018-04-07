import React from "react";
import { shallow, mount } from "enzyme";
import LogoutButton from "./LogoutButton";

it("renders correctly (snapshot testing)", () => {
  const wrapper = shallow(<LogoutButton />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that the callback function is called when logout button is clicked", () => {
  const mockCallBack = jest.fn();
  const button = shallow(<LogoutButton onClick={mockCallBack} />).find(
    "button"
  );
  expect(button.length).toBe(1);
  button.simulate("click");

  // Verify mockCallBack called once
  expect(mockCallBack.mock.calls.length).toBe(1);
});
