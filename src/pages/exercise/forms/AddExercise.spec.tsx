import React from "react";
import { screen } from "@testing-library/react";

import AddExerciseForm from "./AddExercise";
import renderWithProvider from "@utils/renderWithProvider";

/*
 * @note these are very shallow tests but the overall exercises page tests are
 * conducted in the main index file. Doing them in here would require a lot of mocking
 */

function init() {
  renderWithProvider(<AddExerciseForm />);
}

describe("AddExerciseForm", () => {
  test("Add Exercise form renders", () => {
    init();
    screen.getByTestId("addExerciseForm");
  });

  test("Exercise name input renders", () => {
    init();
    screen.getByTestId("addExerciseNameInput");
  });

  test("Muscle group dropdown renders", () => {
    init();
    screen.getByTestId("addExerciseMuscleGroupDropdown");
  });

  test("category dropdown renders", () => {
    init();
    screen.getByTestId("addExerciseCategoryDropdown");
  });
});
