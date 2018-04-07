import React from "react";
import { shallow } from "enzyme";
import WelcomeBody from "./WelcomeBody";

it("renders without crashing", () => {
  const wrapper = shallow(<WelcomeBody />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
