import React from "react";
import {mount} from "enzyme";
import Footer from "./Footer.js";

it("renders Footer without crashing", () => {
  mount(<Footer />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<Footer />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});