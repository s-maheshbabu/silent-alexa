import React from "react";
import { shallow, mount } from "enzyme";
import Body from "./Body";

const mockIsAuthenticationInfoValid = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

it("renders Body when isAuthenticationInfoValid returns true", () => {
  mockIsAuthenticationInfoValid.mockReturnValueOnce(true);
  const wrapper = shallow(
    <Body isAuthenticationInfoValid={mockIsAuthenticationInfoValid} />
  );
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("renders Body when isAuthenticationInfoValid returns false", () => {
  mockIsAuthenticationInfoValid.mockReturnValueOnce(false);
  const wrapper = shallow(
    <Body isAuthenticationInfoValid={mockIsAuthenticationInfoValid} />
  );
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

// TODO: We should use shallow or render here instead of mount. However, because
// Body is a component that returns an array of elements, enzyme doesn't
// yet support this feature.

// They fixed it here https://github.com/airbnb/enzyme/commit/6f7f4fbae19050a912c70e6fbfe42c47b0851fe3

// It is not yet released on npm though. Once enzyme version > 3.3.0 is
// released, we need to fix this test.
it("verifies that authenticationInfo is passed to ChatWindow component", () => {
  mockIsAuthenticationInfoValid.mockReturnValueOnce(true);
  const authenticationInfo = {};
  const body = mount(
    <Body
      isAuthenticationInfoValid={mockIsAuthenticationInfoValid}
      authenticationInfo={authenticationInfo}
    />
  );

  // Verify that ChatWindow recieves authenticationInfo prop
  const authenticationInfoProp = body
    .find("ChatWindow")
    .prop("authenticationInfo");
  expect(authenticationInfoProp).toBe(authenticationInfo);
});
