import React from "react";
import { shallow } from "enzyme";
import Body from "./Body";

it("renders correctly without crashing", () => {
  const wrapper = shallow(<Body />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
