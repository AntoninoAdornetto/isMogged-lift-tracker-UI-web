import React from "react";
import { screen } from "@testing-library/react";

import Workout, { workoutProps } from "./index";
import renderWithProvider from "@utils/renderWithProvider";

const mockProps: workoutProps = {
  id: "mockworkoutid",
};

function init(props: workoutProps = mockProps) {
  renderWithProvider(<Workout {...props} />);
}

describe("Workout page", () => {
  test("Workout page renders", () => {
    init();
    screen.getByTestId("workoutPage");
  });
});
