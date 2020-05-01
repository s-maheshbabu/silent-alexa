import React from "react";
import Body from "./Body";
import { render, cleanup, act, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from "react-router-dom";
import { CookiesProvider, Cookies } from 'react-cookie';

import { AMAZON_LOGIN_COOKIE } from "Constants";

let cookies;

it("renders logged-in view correctly when user is on home page and is authenticated", () => {
  cookies.set(AMAZON_LOGIN_COOKIE, 'access token is present', { path: '/' });

  const { asFragment } = renderWithRouter(<Body />, cookies, { route: "/" });
  expect(asFragment()).toMatchSnapshot();
});

it("renders login-failed view correctly when user is on home page and is not authenticated", () => {
  const { asFragment } = renderWithRouter(<Body />, cookies, { route: "/" });
  expect(asFragment()).toMatchSnapshot();
});

it("renders login-failed view when user navigates to /access_denied", () => {
  const { asFragment } = renderWithRouter(<Body />, cookies, { route: "/access_denied" });
  expect(asFragment()).toMatchSnapshot();
});

it("renders logged-in view when user navigates to /authresponse and user logged in successfully", async () => {
  const lwaResponseHash = "#access_token=some_access_token&expires_in=30";

  const { asFragment } = renderWithRouter(<Body />, cookies, { route: "/authresponse" + lwaResponseHash });

  await waitFor(() => {
    expect(asFragment()).toMatchSnapshot();
  });
});

it("renders login-failed view when user navigates to /authresponse and user failed to login", async () => {
  const lwaResponseHash = "#";

  const { asFragment } = renderWithRouter(<Body />, cookies, { route: "/authresponse#" + lwaResponseHash });

  await waitFor(() => {
    expect(asFragment()).toMatchSnapshot();
  });
});

it("redirects to / for unknown paths", () => {
  const { history, asFragment } = renderWithRouter(
    <Body />, cookies,
    { route: "/a/random/path" }
  );

  expect(history.location.pathname).toEqual('/');
  expect(asFragment()).toMatchSnapshot();
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
      </Router >),
    history
  }
}

beforeEach(() => { cookies = new Cookies() });

afterEach(() => {
  cleanup();
  act(() => cookies.remove(AMAZON_LOGIN_COOKIE, { path: '/' }));
});
