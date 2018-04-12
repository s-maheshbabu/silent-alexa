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
  expect(button).toBeDefined();
  button.simulate("click");

  expect(mockCallBack).toHaveBeenCalledTimes(1);
});
