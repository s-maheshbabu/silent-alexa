import React from "react";
import { shallow } from "enzyme";
import AlexaRingIcon from "./AlexaRingIcon";

it("renders AlexaRingIcon without crashing", () => {
  const wrapper = shallow(<AlexaRingIcon />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
