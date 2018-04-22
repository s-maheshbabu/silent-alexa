import React from "react";
import { shallow } from "enzyme";
import WelcomeScreen from "WelcomeScreen";

it("renders without crashing", () => {
  const wrapper = shallow(<WelcomeScreen />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
