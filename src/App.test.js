import React from "react";
import { shallow, mount } from "enzyme";
import App from "./App";
it("renders without crashing", () => {
  shallow(<App />);
});
it("snapshot testing that it renders correctly", () => {
  const wrapper = mount(<App />);
  expect(wrapper).toMatchSnapshot();
});
