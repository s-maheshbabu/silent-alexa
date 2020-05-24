import React from "react";
import { render, cleanup } from '@testing-library/react';
import PageNotFoundScreen from "./PageNotFoundScreen";

afterEach(cleanup);

it("renders without crashing", () => {
  const { asFragment } = render(<PageNotFoundScreen />);
  expect(asFragment(<PageNotFoundScreen />)).toMatchSnapshot();
});
