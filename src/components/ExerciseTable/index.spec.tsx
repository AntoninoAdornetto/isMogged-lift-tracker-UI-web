import React from "react";
import { fireEvent, screen } from "@testing-library/react";

import renderWithProvider from "@utils/renderWithProvider";
import { ExerciseTable, ExerciseTableProps } from "./";

const mockProps: ExerciseTableProps = {
  exercises: Array.from({ length: 10 }, (_, k) => ({
    category: "category ".concat(`${k}`),
    id: k + 1,
    muscle_group: "muscle group ".concat(`${k}`),
    name: "exercise name ".concat(`${k}`),
  })),
  isLoading: false,
  onExerciseSelection: jest.fn(),
};

function init(props: ExerciseTableProps = mockProps) {
  renderWithProvider(<ExerciseTable {...props} />);
}

describe("Exercise Table", () => {
  test("Renders the exercise table", () => {
    init();
    screen.getByTestId("exercisesTable");
  });

  test("Renders the exercises in the table", () => {
    init();
    mockProps.exercises.forEach((e) => {
      screen.getByText(e.name);
      screen.getByText(e.muscle_group);
      screen.getByText(e.category);
    });
  });

  test("When an exercise is selected, the onExerciseSelection handler is invoked", () => {
    init();
    const e = screen.getByText(mockProps.exercises[0].name);
    fireEvent.click(e);
    expect(mockProps.onExerciseSelection).toHaveBeenCalledTimes(1);
  });

  test("User can filter by an exercise name", async () => {
    init();
    fireEvent.click(screen.getByText("Filter Options"));
    const eFilter = screen.getByTestId("exerciseNameFilterInput");
    const eIndex = 2;
    fireEvent.change(eFilter, { target: { value: mockProps.exercises[eIndex].name } });

    mockProps.exercises.forEach((e, i) => {
      if (i === eIndex) {
        screen.getByText(e.category);
        screen.getByText(e.muscle_group);
        screen.getByText(e.name);
      } else {
        expect(screen.queryByText(e.category)).toBeNull();
        expect(screen.queryByText(e.muscle_group)).toBeNull();
        expect(screen.queryByText(e.name)).toBeNull();
      }
    });
  });
});
