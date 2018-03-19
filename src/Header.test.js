import React from "react";
import {shallow, mount} from "enzyme";
import Header from "./Header.js";

it("renders Header without crashing", () => {
  mount(<Header />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<Header />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});