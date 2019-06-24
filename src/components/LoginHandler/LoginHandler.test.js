import React from "react";
import { shallow, mount } from "enzyme";
import queryString from "query-string";
import LoginHandler from "./LoginHandler";
import AuthenticationInfo from "AuthenticationInfo";

jest.mock("AuthenticationInfo");

beforeEach(() => {
  jest.resetAllMocks();
});

it("renders LoginHandler without crashing", () => {
  const wrapper = mount(<LoginHandler />);

  expect(wrapper).toMatchSnapshot();

  wrapper.unmount();
});

it("expects AuthenticationInfo to be persisted when LoginHandler is mounted", () => {
  const lwaResponseHash = "access_token=some_access_token&expires_in=30";
  const routeProps = { location: { hash: lwaResponseHash } };
  const wrapper = mount(<LoginHandler {...routeProps} />);

  expect(AuthenticationInfo.persist).toHaveBeenCalledTimes(1);
  expect(AuthenticationInfo.persist).toHaveBeenCalledWith(
    queryString.parse(lwaResponseHash)
  );

  wrapper.unmount();
});

it("expects AuthenticationInfo persist to not be called when LoginHandler is mounted with invalid parameters", () => {
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
    const wrapper = mount(<LoginHandler {...routeProps} />);
    expect(AuthenticationInfo.persist).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});

it("expects AuthenticationInfo persist to not be called when LoginHandler is mounted without route props", () => {
  const wrapperWithNoRouteProps = mount(<LoginHandler />);
  expect(AuthenticationInfo.persist).not.toHaveBeenCalled();
  wrapperWithNoRouteProps.unmount();
});
