import React from "react";
import { screen, fireEvent } from "@testing-library/react";

import renderWithProvider from "@utils/renderWithProvider";

function init() {
  renderWithProvider();
}

describe("Dashboard page", () => {
  test("Dashboard page renders", () => {
    screen.getByText("Mog Mode");
  });
});
