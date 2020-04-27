import React from "react";
import Routes from "./Routes";
import { Router } from "react-router-dom";
import { createMemoryHistory } from 'history';
import { render, cleanup, waitFor } from '@testing-library/react';
import { AuthContext } from "auth/AuthContextProvider";

jest.mock("AVSGateway");

beforeEach(() => {
  setLWAResponseSpy.mockClear();
});

afterEach(cleanup);

const setLWAResponseSpy = jest.fn();
const contextValue = {
  setLWAResponse: setLWAResponseSpy
};

it("redirects to / if path is /authresponse and user logged in successfully", async () => {
  const lwaResponseHash = "access_token=some_access_token&expires_in=30";
  const routeProps = { location: { hash: lwaResponseHash } };

  const { history } = renderWithRouter(
    <Routes {...routeProps} />, contextValue,
    createMemoryHistory({ initialEntries: ['/authresponse'] })
  );

  await waitFor(() => {
    expect(history.location.pathname).toEqual('/');
  });
});

it("redirects to /access_denied if path is /authresponse and the login attempt failed", async () => {
  const { history } = renderWithRouter(
    <Routes />, contextValue,
    createMemoryHistory({ initialEntries: ['/authresponse'] })
  );

  await waitFor(() => {
    expect(history.location.pathname).toEqual('/access_denied');
  });

});

it("redirects to / if path is not /authresponse", () => {
  const { history } = renderWithRouter(
    <Routes />, contextValue,
    createMemoryHistory({ initialEntries: ['/a/random/path'] })
  );

  expect(history.location.pathname).toEqual('/');
});

function renderWithRouter(
  component,
  contextValue,
  history
) {
  return {
    ...render(
      <Router history={history}>
        <AuthContext.Provider value={contextValue}>
          {component}
        </AuthContext.Provider>
      </Router>),
    history
  }
}
