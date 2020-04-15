import React from "react";
import App from "./App";
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import { CookiesProvider, Cookies } from 'react-cookie';

import { AMAZON_LOGIN_COOKIE } from "Constants";

afterEach(cleanup);

it("integration test to verify the actions to be taken when a currently authenticated user clicks on the logout button while on the chat page.", async () => {
  let cookies = new Cookies();
  cookies.set(AMAZON_LOGIN_COOKIE, 'access token is present', { path: '/' });

  const { getByText, getByRole, queryByText, queryByRole } = renderWithProviders(<App />, cookies);
  const logoutButton = getByText("Logout");
  const chatInputTextBox = getByRole("textbox");
  expect(logoutButton).not.toBeUndefined();
  expect(chatInputTextBox).not.toBeUndefined();

  fireEvent.click(logoutButton);

  await waitFor(() => {
    expect(queryByText("Logout")).not.toBeInTheDocument();
    expect(queryByRole("textbox")).not.toBeInTheDocument();

    expect(queryByText("Login")).toBeInTheDocument();
    expect(getByText("WELCOME TO SILENT ALEXA", { exact: false })).toBeInTheDocument();
  })
});

function renderWithProviders(
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
