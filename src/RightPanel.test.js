import React from "react";
import { shallow } from "enzyme";
import RightPanel from "RightPanel";

it("renders RightPanel without crashing", () => {
  const wrapper = shallow(<RightPanel />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
