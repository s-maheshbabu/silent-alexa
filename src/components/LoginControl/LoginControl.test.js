import React from "react";
import { AuthContext } from "auth/AuthContextProvider";
import { render, cleanup, fireEvent } from '@testing-library/react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import {
  options,
  REDIRECT_PATH,
  default as LoginControl
} from "./LoginControl";

const ROOT_PATH = "http://localhost";

const mockLWAModule = jest.fn();
beforeEach(() => {
  jest.resetAllMocks();
  Object.defineProperty(window, "amazon", {
    value: { Login: { authorize: mockLWAModule } },
    writable: true
  });
});

afterEach(cleanup);

it("renders LoginControl with LoginButton component when the user is not authenticated", () => {
  const contextValue = {
    isAuthenticated: () => false
  };
  const { asFragment } = renderWithContext(<LoginControl />, contextValue);
  expect(asFragment(<LoginControl />)).toMatchSnapshot();
});

it("renders LoginControl with LogoutButton component when the user is authenticated", () => {
  const contextValue = {
    isAuthenticated: () => true
  };
  const { asFragment } = renderWithContext(<LoginControl />, contextValue);
  expect(asFragment(<LoginControl />)).toMatchSnapshot();
});

it("verifies that login button calls the lwa authorizatin procedure", () => {
  const contextValue = {
    isAuthenticated: () => false
  };
  const { getByText } = renderWithContext(<LoginControl />, contextValue);
  const loginButton = getByText("Login");

  fireEvent.click(loginButton);
  expect(mockLWAModule).toHaveBeenCalledTimes(1);
  expect(mockLWAModule.mock.calls[0][0]).toBe(options);
  expect(mockLWAModule.mock.calls[0][1]).toBe(ROOT_PATH + REDIRECT_PATH);
});

it("verifies that authentication info is cleared when logout button is clicked", () => {
  const contextValue = {
    isAuthenticated: () => true,
    clear: jest.fn()
  };
  const mockClear = jest.spyOn(contextValue, "clear");

  const { getByText } = renderWithContext(<LoginControl />, contextValue);
  const logoutButton = getByText("Logout");

  fireEvent.click(logoutButton);
  expect(mockClear).toHaveBeenCalledTimes(1);
});

// TODO: Probably adapt custom render to make this easier across all test files.
// https://testing-library.com/docs/react-testing-library/setup#custom-render
const renderWithContext = (component, contextValue) => {
  return {
    ...render(
      <AuthContext.Provider value={contextValue}>
        <MuiThemeProvider>
          {component}
        </MuiThemeProvider>
      </AuthContext.Provider>)
  }
}
