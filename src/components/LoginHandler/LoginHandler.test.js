import React from "react";
import { shallow, mount } from "enzyme";
import LoginHandler from "./LoginHandler";

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

it("expects updateAuthenticationInfo to not be called when LoginHandler is mounted with invalid parameters", () => {
  const lwaResponseWithNoAccessToken =
    "error_token=some_access_token&expires_in=30";
  const lwaResponseWithNoExpiresIn = "access_token=some_access_token";
  const lwaResponseWithInvalidExpiresIn =
    "access_token=some_access_token&expires_in=-30";
  const lwaResponse = "access_token=some_access_token&expires_in=30";
  const routePropsWithlwaResponseNoAccessToken = {
    location: { hash: lwaResponseWithNoAccessToken }
  };
  const routePropsWithlwaResponseNoExpiresIn = {
    location: { hash: lwaResponseWithNoExpiresIn }
  };
  const routePropsWithlwaResponseInvalidExpiresIn = {
    location: { hash: lwaResponseWithInvalidExpiresIn }
  };
  const routePropsNoLocation = { not_location: { hash: lwaResponse } };
  const routePropsNoHash = { location: { not_hash: lwaResponse } };
  const routePropsNoLwaResponse = { location: { hash: {} } };

  const allRoutePropsObjects = [
    routePropsWithlwaResponseNoAccessToken,
    routePropsWithlwaResponseNoExpiresIn,
    routePropsWithlwaResponseInvalidExpiresIn,
    routePropsNoLocation,
    routePropsNoHash,
    routePropsNoLwaResponse
  ];

  allRoutePropsObjects.map(routeProps => {
    const wrapper = mount(
      <LoginHandler
        updateAuthenticationInfo={mockUpdateAuthenticationInfo}
        {...routeProps}
      />
    );
    expect(mockUpdateAuthenticationInfo).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});

it("expects updateAuthenticationInfo to not be called when LoginHandler is mounted with invalid parameters", () => {
  const wrapperWithNoRouteProps = mount(
    <LoginHandler updateAuthenticationInfo={mockUpdateAuthenticationInfo} />
  );
  expect(mockUpdateAuthenticationInfo).not.toHaveBeenCalled();
  wrapperWithNoRouteProps.unmount();
});
