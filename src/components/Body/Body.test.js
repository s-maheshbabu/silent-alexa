import React from "react";
import Body from "./Body";
import { AuthContext } from "auth/AuthContextProvider";
import { render, cleanup } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from "react-router-dom";

afterEach(cleanup);

it("renders Body when user is authenticated ", () => {
  const contextValue = {
    isAuthenticated: () => true
  };

  const { asFragment } = renderWithRouter(<Body />, contextValue);
  expect(asFragment(<Body />)).toMatchSnapshot();
});

it("renders Body when user is not authenticated", () => {
  const contextValue = {
    isAuthenticated: () => false
  };

  const { asFragment } = renderWithRouter(<Body />, contextValue);
  expect(asFragment(<Body />)).toMatchSnapshot();
});

function renderWithRouter(
  component,
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
          {component}
        </AuthContext.Provider>
      </Router>),
    history
  }
}
