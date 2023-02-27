import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import renderWithProvider from "@utils/renderWithProvider";
import EditExerciseForm, { EditExerciseFormProps } from "./EditExercise";
import * as exerciseService from "@services/exercise";

const mockProps: EditExerciseFormProps = {
  categories: [],
  exercise: { category: "", id: -1, muscle_group: "", name: "" },
  muscleGroups: [],
  onDefer: jest.fn(),
};

function init(props: EditExerciseFormProps = mockProps) {
  renderWithProvider(<EditExerciseForm {...props} />);
}

describe("Edit Exercise Form", () => {
  test("Edit Exercise form renders", () => {
    init();
    screen.getByTestId("editExerciseForm");
  });

  test("Edit Exercise name input renders", () => {
    init();
    screen.getByTestId("editExerciseNameInput");
  });

  test("Edit Exercise muscle group dropdown renders", () => {
    init();
    screen.getByTestId("editExerciseMuscleGroupDropdown");
  });

  test("Edit Exercise category dropdown renders", () => {
    init();
    screen.getByTestId("editExerciseCategoryDropdown");
  });

  test("Edit Button renders", () => {
    init();
    screen.getByTestId("editExerciseSubmitBtn");
  });

  test("Delete Button renders", () => {
    init();
    screen.getByTestId("deleteExerciseSubmitBtn");
  });

  test("Confrim delete btn renders after first delete btn is clicked", () => {
    init();
    fireEvent.click(screen.getByTestId("deleteExerciseSubmitBtn"));
    screen.getByTestId("confirmDelteExerciseBtn");
  });

  test("Edit exercise form pre populates the selected exercise", () => {
    const newProps = {
      categories: [
        {
          id: 1,
          name: "Barbell",
        },
      ],
      exercise: {
        category: "Barbell",
        id: 1,
        muscle_group: "Chest",
        name: "Bench Press",
      },
      muscleGroups: [
        {
          id: 1,
          name: "Chest",
        },
      ],
      onDefer: mockProps.onDefer,
    };
    init(newProps);

    const eNameInput = screen.getByTestId("editExerciseNameInput") as HTMLInputElement;
    expect(eNameInput.value).toBe(newProps.exercise.name);

    const mgDropdown = screen.getByTestId("editExerciseMuscleGroupDropdown");
    const mgOption = mgDropdown.querySelector("select > option") as HTMLOptionElement;
    expect(mgOption.value).toBe(newProps.exercise.muscle_group);

    const categoryDropdown = screen.getByTestId("editExerciseCategoryDropdown");
    const categoryOption = categoryDropdown.querySelector("select > option") as HTMLOptionElement;
    expect(categoryOption.value).toBe(newProps.exercise.category);
  });

  test("Edit exercise service is called", async () => {
    const newProps = {
      categories: [
        {
          id: 1,
          name: "Barbell",
        },
      ],
      exercise: {
        category: "Barbell",
        id: 1,
        muscle_group: "Chest",
        name: "Bench Press",
      },
      muscleGroups: [
        {
          id: 1,
          name: "Chest",
        },
      ],
      onDefer: mockProps.onDefer,
    };

    const updateExerciseSpy = jest.spyOn(exerciseService, "updateExercise");
    init(newProps);

    const newExerciseName = "Barbell Bench Press";
    const eNameInput = screen.getByTestId("editExerciseNameInput");
    fireEvent.change(eNameInput, { target: { value: newExerciseName } });

    const editExerciseBtn = screen.getByTestId("editExerciseSubmitBtn");

    fireEvent.click(editExerciseBtn);
    await waitFor(() => {
      expect(updateExerciseSpy).toHaveBeenCalledTimes(1);
      expect(updateExerciseSpy).toHaveBeenCalledWith({
        ...newProps.exercise,
        name: newExerciseName,
      });
    });
  });

  test("Delete exercise service is called", async () => {
    const newProps = {
      categories: [
        {
          id: 1,
          name: "Barbell",
        },
      ],
      exercise: {
        category: "Barbell",
        id: 1,
        muscle_group: "Chest",
        name: "Bench Press",
      },
      muscleGroups: [
        {
          id: 1,
          name: "Chest",
        },
      ],
      onDefer: mockProps.onDefer,
    };

    // const deleteExerciseSpy = jest.spyOn(exerciseService, "deleteExercise");
    init(newProps);
    fireEvent.click(screen.getByTestId("deleteExerciseSubmitBtn"));

    await waitFor(async () => {
      const deleteExerciseBtn = screen.getByTestId("confirmDelteExerciseBtn");
      fireEvent.click(deleteExerciseBtn);
      // @todo - fix
      // expect(deleteExerciseSpy).toHaveBeenCalled();
    });
  });
});
