import React from "react";
import { render, cleanup } from '@testing-library/react';
import LoginFailedScreen from "./LoginFailedScreen";

afterEach(cleanup);

it("renders without crashing", () => {
  const { asFragment } = render(<LoginFailedScreen />);
  expect(asFragment(<LoginFailedScreen />)).toMatchSnapshot();
});
