import React from "react";
import { screen } from "@testing-library/react";

import Exercises from ".";
import renderWithProvider from "@utils/renderWithProvider";

function init() {
  renderWithProvider(<Exercises />);
}

describe("Exercises Page", () => {
  test("Exercise page renders", () => {
    init();
    screen.getByText("Filter Options");
    screen.getByText("Create");
  });
});
