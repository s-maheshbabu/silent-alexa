import React from "react";
import { shallow } from "enzyme";
import ChatBubble from "ChatBubble";

it("renders correctly (snapshot testing)", () => {
  const wrapper = shallow(<ChatBubble />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
