import React from "react";
import {shallow, mount} from "enzyme";
import RightPanel from "./RightPanel.js";

it("renders RightPanel without crashing", () => {
  mount(<RightPanel />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<RightPanel />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});