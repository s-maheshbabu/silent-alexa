import React from "react";
import LoginHandler from "./LoginHandler";
import { Router } from "react-router-dom";
import { createMemoryHistory } from 'history';
import { render, cleanup, act } from '@testing-library/react';

import { AMAZON_LOGIN_COOKIE } from "Constants";

jest.mock('react-cookie');
import { useCookies } from 'react-cookie';
const { CookiesProvider, Cookies } = jest.requireActual('react-cookie');

const setCookieMock = jest.fn();
let cookies;

it("expects LWA response to be persisted and user routed to the appropriate page in happy case", () => {
  const access_token = "some access token";
  const expires_in = 30;
  const lwaResponseHash = `access_token=${access_token}&expires_in=${expires_in}`;
  const routeProps = { location: { hash: lwaResponseHash } };
  const { history } = renderWithRouter(<LoginHandler {...routeProps} />, cookies);

  expect(setCookieMock).toHaveBeenCalledTimes(1);
  expect(setCookieMock.mock.calls[0][0]).toBe(AMAZON_LOGIN_COOKIE);
  expect(setCookieMock.mock.calls[0][1]).toBe(access_token);
  expect(setCookieMock.mock.calls[0][2]).toStrictEqual({
    maxAge: expires_in,
    secure: false,
    path: "/"
  });

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
    const { history } = renderWithRouter(<LoginHandler {...routeProps} />, cookies);

    expect(history.location.pathname).toEqual('/access_denied');
  });
});

it("expects LWA response to not be persisted when no route props are given", () => {
  renderWithRouter(<LoginHandler />, cookies);
});

function renderWithRouter(
  component,
  cookies,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  return {
    ...render(
      <Router history={history}>
        <CookiesProvider cookies={cookies}>
          {component}
        </CookiesProvider>
      </Router>),
    history
  }
}

beforeEach(() => {
  jest.resetAllMocks();
  cookies = new Cookies();

  useCookies.mockReturnValue([cookies, setCookieMock]);
});

afterEach(() => {
  cleanup();
  act(() => cookies.remove(AMAZON_LOGIN_COOKIE, { path: '/' }));
});
