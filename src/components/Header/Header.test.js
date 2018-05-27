import React from "react";
import AppBar from "material-ui/AppBar";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
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
  const loginControl = header
    .find(MuiThemeProvider)
    .find(AppBar)
    .prop("iconElementRight");

  // Verify that only desired number of props are passed on to LoginControl
  expect(Object.keys(loginControl.props).length).toBe(3);

  // Verify that LoginControl is passed on isAuthenticationInfoValid prop
  const isAuthenticationInfoValidProp =
    loginControl.props["isAuthenticationInfoValid"];
  expect(isAuthenticationInfoValidProp).toBeDefined();

  // Verify that calling isAuthenticationInfoValid prop function calls the mockIsAuthenticationInfoValid
  isAuthenticationInfoValidProp();
  expect(mockIsAuthenticationInfoValid).toHaveBeenCalledTimes(1);

  // Verify that LoginControl is passed on clearAuthenticationInfo prop
  const clearAuthenticationInfoProp =
    loginControl.props["clearAuthenticationInfo"];
  expect(clearAuthenticationInfoProp).toBeDefined();

  // Verify that calling clearAuthenticationInfo prop function calls the mockClearAuthenticationInfo
  clearAuthenticationInfoProp();
  expect(mockClearAuthenticationInfo).toHaveBeenCalledTimes(1);

  // Verify that LoginControl is passed on updateAuthenticationInfo prop
  const updateAuthenticationInfoProp =
    loginControl.props["updateAuthenticationInfo"];
  expect(updateAuthenticationInfoProp).toBeDefined();

  // Verify that calling updateAuthenticationInfo prop function calls the mockUpdateAuthenticationInfo
  let dummyArgument = "dummy argument";
  updateAuthenticationInfoProp(dummyArgument);

  expect(mockUpdateAuthenticationInfo).toHaveBeenCalledWith(dummyArgument);
});
