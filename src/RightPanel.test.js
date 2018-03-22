import React from "react";
import {mount} from "enzyme";
import RightPanel from "./RightPanel";

it("renders RightPanel without crashing", () => {
  mount(<RightPanel />);
});

it("renders correctly (snapshot testing)", () => {
  const wrapper = mount(<RightPanel />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});