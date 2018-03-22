import React from "react";
import {mount} from "enzyme";
import Body from "./Body";

it("renders Body without crashing", () => {
  mount(<Body />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<Body />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});