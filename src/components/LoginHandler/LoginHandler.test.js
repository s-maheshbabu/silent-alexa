import React from "react";
import queryString from "query-string";
import LoginHandler from "./LoginHandler";
import { AuthContext } from "auth/AuthContextProvider";
import { Router } from "react-router-dom";
import { createMemoryHistory } from 'history';
import { render, cleanup } from '@testing-library/react';

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(cleanup);

const setLWAResponseSpy = jest.fn();
const contextValue = {
  setLWAResponse: setLWAResponseSpy
};

it("expects LWA response to be persisted and user routed to the appropriate page in happy case", () => {
  const lwaResponseHash = "access_token=some_access_token&expires_in=30";
  const routeProps = { location: { hash: lwaResponseHash } };
  const { history } = renderWithRouter(<LoginHandler {...routeProps} />, contextValue);

  expect(setLWAResponseSpy).toHaveBeenCalledTimes(1);
  expect(setLWAResponseSpy).toHaveBeenCalledWith(
    queryString.parse(lwaResponseHash)
  );

  expect(history.location.pathname).toEqual('/');
});

it("expects LWA response to not be persisted and user routed to an appropriate page when LWA response is invalid or incomplete", () => {
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
    const { history } = renderWithRouter(<LoginHandler {...routeProps} />, contextValue);

    expect(history.location.pathname).toEqual('/access_denied');
    expect(setLWAResponseSpy).not.toHaveBeenCalled();
  });
});

it("expects LWA response to not be persisted when no route props are given", () => {
  renderWithRouter(<LoginHandler />, contextValue);
  expect(setLWAResponseSpy).not.toHaveBeenCalled();
});

function renderWithRouter(
  ui,
  contextValue,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  return {
    ...render(
      <Router history={history}>
        <AuthContext.Provider value={contextValue}>
          {ui}
        </AuthContext.Provider>
      </Router>),
    history
  }
}
