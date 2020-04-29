import React from "react";
import { render, cleanup } from '@testing-library/react';
import LoadingAnimation from "./LoadingAnimation";

afterEach(cleanup);

it("renders without crashing", () => {
  const { asFragment } = render(<LoadingAnimation type="bars" color="red" />);
  expect(asFragment(<LoadingAnimation />)).toMatchSnapshot();
});
