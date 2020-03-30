import React from "react";
import Body from "./Body";
import { AuthContext } from "auth/AuthContextProvider";
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

it("renders Body when user is authenticated ", () => {
  const contextValue = {
    isAuthenticated: true
  };

  const { asFragment } = renderWithContext(<Body />, contextValue);
  expect(asFragment(<Body />)).toMatchSnapshot();
});

it("renders Body when user is not authenticated", () => {
  const contextValue = {
    isAuthenticated: false
  };

  const { asFragment } = renderWithContext(<Body />, contextValue);
  expect(asFragment(<Body />)).toMatchSnapshot();
});

const renderWithContext = (
  component, contextValue) => {
  return {
    ...render(
      <AuthContext.Provider value={contextValue}>
        {component}
      </AuthContext.Provider>)
  }
}
