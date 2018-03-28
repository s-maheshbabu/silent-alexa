import React from "react";
import { shallow, mount } from "enzyme";
import Body from "./Body";

it("renders correctly without crashing", () => {
  const wrapper = shallow(<Body />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

// TODO: We should use shallow here instead of mount. However, because
// Body is a component that returns an array of elements, enzyme doesn't
// yet support this feature.

// They fixed it here https://github.com/airbnb/enzyme/commit/6f7f4fbae19050a912c70e6fbfe42c47b0851fe3

// It is not yet released on npm though. Once enzyme version > 3.3.0 is
// released, we need to fix this test.
it("verifies that authenticationInfo is passed to ChatWindow component", () => {
  const mockAuthenticationInfo = {};
  const body = mount(<Body authenticationInfo={mockAuthenticationInfo} />);

  // Verify that ChatWindow recieves authenticationInfo property
  const authenticationInfoProp = body
    .find("ChatWindow")
    .prop("authenticationInfo");
  expect(authenticationInfoProp).toBe(mockAuthenticationInfo);
});
