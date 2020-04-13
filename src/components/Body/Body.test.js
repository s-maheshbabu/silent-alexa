import React from "react";
import Body from "./Body";
import { render, cleanup, act } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from "react-router-dom";
import { CookiesProvider, Cookies } from 'react-cookie';

import { AMAZON_LOGIN_COOKIE } from "Constants";

let cookies;

it("renders Body when user is authenticated ", () => {
  cookies.set(AMAZON_LOGIN_COOKIE, 'access token is present', { path: '/' });

  const { asFragment } = renderWithRouter(<Body />, cookies);
  expect(asFragment(<Body />)).toMatchSnapshot();
});

it("renders Body when user is not authenticated", async () => {
  const { asFragment } = renderWithRouter(<Body />, cookies);
  expect(asFragment(<Body />)).toMatchSnapshot();
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
