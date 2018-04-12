import React from "react";
import { shallow } from "enzyme";
import Header from "./Header";

it("renders Header without crashing", () => {
  const wrapper = shallow(<Header />);
  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("verifies that props are passed to LoginControl component", () => {
  const mockIsAuthenticationInfoValid = jest.fn();
  const mockClearAuthenticationInfo = jest.fn();
  const mockUpdateAuthenticationInfo = jest.fn();
  const header = shallow(
    <Header
      isAuthenticationInfoValid={mockIsAuthenticationInfoValid}
      clearAuthenticationInfo={mockClearAuthenticationInfo}
      updateAuthenticationInfo={mockUpdateAuthenticationInfo}
    />
  );

  // Verify that only desired number of props are passed on to LoginControl
  expect(Object.keys(header.find("LoginControl").props()).length).toBe(3);

  // Verify that LoginControl is passed on isAuthenticationInfoValid property
  const isAuthenticationInfoValidProp = header
    .find("LoginControl")
    .prop("isAuthenticationInfoValid");
  expect(isAuthenticationInfoValidProp).toBeDefined();

  // Verify that calling isAuthenticationInfoValid prop function calls the mockIsAuthenticationInfoValid
  isAuthenticationInfoValidProp();
  expect(mockIsAuthenticationInfoValid).toHaveBeenCalledTimes(1);

  // Verify that LoginControl is passed on clearAuthenticationInfo property
  const clearAuthenticationInfoProp = header
    .find("LoginControl")
    .prop("clearAuthenticationInfo");
  expect(clearAuthenticationInfoProp).toBeDefined();

  // Verify that calling clearAuthenticationInfo prop function calls the mockClearAuthenticationInfo
  clearAuthenticationInfoProp();
  expect(mockClearAuthenticationInfo).toHaveBeenCalledTimes(1);

  // Verify that LoginControl is passed on updateAuthenticationInfo property
  const updateAuthenticationInfoProp = header
    .find("LoginControl")
    .prop("updateAuthenticationInfo");

  expect(updateAuthenticationInfoProp).toBeDefined();

  // Verify that calling updateAuthenticationInfo prop function calls the mockUpdateAuthenticationInfo
  let dummyArgument = "dummy argument";
  updateAuthenticationInfoProp(dummyArgument);

  expect(mockUpdateAuthenticationInfo).toHaveBeenCalledWith(dummyArgument);
});
