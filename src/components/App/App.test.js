import React from "react";
import { shallow } from "enzyme";
import App from "./App";

it("renders correctly without crashing", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
