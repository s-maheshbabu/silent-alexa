import React from "react";
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { CookiesProvider, Cookies } from 'react-cookie';

import { AMAZON_LOGIN_COOKIE } from "Constants";

import {
  options,
  REDIRECT_PATH,
  default as LoginControl
} from "./LoginControl";

const ORIGIN_PATH = "http://localhost:3000";

const mockLWAModule = jest.fn();
beforeEach(() => {
  jest.resetAllMocks();
  Object.defineProperty(window, "amazon", {
    value: { Login: { authorize: mockLWAModule } },
    writable: true
  });
});

let cookies;

it("renders LoginControl with LoginButton component when the user is not authenticated", () => {
  const { asFragment } = renderWithCookies(<LoginControl />, cookies);
  expect(asFragment(<LoginControl />)).toMatchSnapshot();
});

it("renders LoginControl with LogoutButton component when the user is authenticated", () => {
  cookies.set(AMAZON_LOGIN_COOKIE, 'access token is present', { path: '/' });

  const { asFragment } = renderWithCookies(<LoginControl />, cookies);
  expect(asFragment(<LoginControl />)).toMatchSnapshot();
});

it("verifies that login button calls the lwa authorizatin procedure", () => {
  delete global.window.location;
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      origin: ORIGIN_PATH
    },
    configurable: true
  });


  const { getByText } = renderWithCookies(<LoginControl />, cookies);
  const loginButton = getByText("Login");

  fireEvent.click(loginButton);
  expect(mockLWAModule).toHaveBeenCalledTimes(1);
  expect(mockLWAModule.mock.calls[0][0]).toBe(options);
  expect(mockLWAModule.mock.calls[0][1]).toBe(ORIGIN_PATH + REDIRECT_PATH);

  // Cleanup
  delete global.window.location;
});

it("verifies that authentication info is cleared when logout button is clicked", () => {
  cookies.set(AMAZON_LOGIN_COOKIE, 'access token is present', { path: '/' });

  const { getByText } = renderWithCookies(<LoginControl />, cookies);
  const logoutButton = getByText("Logout");

  fireEvent.click(logoutButton);
  expect(cookies.get(AMAZON_LOGIN_COOKIE)).toBe(undefined);
});

// TODO: Probably adapt custom render to make this easier across all test files.
// https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithCookies = (component, cookies) => {
  return {
    ...render(
      <CookiesProvider cookies={cookies}>
        <MuiThemeProvider>
          {component}
        </MuiThemeProvider>
      </CookiesProvider>)
  }
}

beforeEach(() => { cookies = new Cookies(); });

afterEach(() => {
  cleanup();
  act(() => cookies.remove(AMAZON_LOGIN_COOKIE, { path: '/' }));
});
