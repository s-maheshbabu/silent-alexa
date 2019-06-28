import React from "react";
import { shallow } from "enzyme";

import Header from "./Header";
it("renders Header without crashing", () => {
  const wrapper = shallow(<Header />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});
