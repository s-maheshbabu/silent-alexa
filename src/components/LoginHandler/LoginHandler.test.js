import React from "react";
import { shallow, mount } from "enzyme";
import LoginHandler from "./LoginHandler";
import AuthenticationInfo from "AuthenticationInfo";
import util from "util";

let loginHandler;
let loginHandlerInstance;
const mockUpdateAuthenticationInfo = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

it("renders LoginHandler without crashing", () => {
  const wrapper = mount(<LoginHandler />);

  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("expects updateAuthenticationInfo to be called when LoginHandler is mounted", () => {
  const lwaResponse = "access_token=some_access_token&expires_in=30";
  const routeProps = { location: { hash: lwaResponse } };
  const wrapper = mount(
    <LoginHandler
      updateAuthenticationInfo={mockUpdateAuthenticationInfo}
      {...routeProps}
    />
  );

  expect(mockUpdateAuthenticationInfo).toHaveBeenCalledTimes(1);
  expect(
    mockUpdateAuthenticationInfo.mock.calls[0][0].getAccessToken()
  ).toEqual("some_access_token");

  wrapper.unmount();
});

it("expects updateAuthenticationInfo to not be called when LoginHandler is mounted", () => {
  const lwaResponse = "error_token=some_access_token&expires_in=30";
  const routeProps = { location: { hash: lwaResponse } };
  const routePropsNoLocation = { not_location: { hash: lwaResponse } };
  const routePropsNoHash = { location: { not_hash: lwaResponse } };
  const routePropsNoLwaResponse = { location: { hash: {} } };

  const wrapperWithInvalidLwaResponse = mount(
    <LoginHandler
      updateAuthenticationInfo={mockUpdateAuthenticationInfo}
      {...routeProps}
    />
  );
  const wrapperWithNoRouteProps = mount(
    <LoginHandler updateAuthenticationInfo={mockUpdateAuthenticationInfo} />
  );

  const wrapperWithNoLocationInRouteProps = mount(
    <LoginHandler
      updateAuthenticationInfo={mockUpdateAuthenticationInfo}
      {...routePropsNoLocation}
    />
  );

  const wrapperWithNoHashInRouteProps = mount(
    <LoginHandler
      updateAuthenticationInfo={mockUpdateAuthenticationInfo}
      {...routePropsNoHash}
    />
  );

  const wrapperWithNoLwaResponseInRouteProps = mount(
    <LoginHandler
      updateAuthenticationInfo={mockUpdateAuthenticationInfo}
      {...routePropsNoLwaResponse}
    />
  );

  const wrappers = [
    wrapperWithInvalidLwaResponse,
    wrapperWithNoHashInRouteProps,
    wrapperWithNoLocationInRouteProps,
    wrapperWithNoLwaResponseInRouteProps,
    wrapperWithNoRouteProps
  ];

  expect(mockUpdateAuthenticationInfo).not.toHaveBeenCalled();

  wrappers.map(wrapper => wrapper.unmount());
});
