import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import renderWithProvider from "@utils/renderWithProvider";

import Exercises from ".";
import { exercise } from "@services/exercise/createExercise";
import * as listExercises from "@services/exercise/listExercises";

const mockData = Array.from(
  { length: 10 },
  (_, k): exercise => ({
    id: k,
    category: `category ${k}`,
    muscle_group: `muscle group ${k}`,
    name: `name ${k}`,
  })
);

function init() {
  renderWithProvider(<Exercises />);
}

describe(Exercises, () => {
  let listExercisesSpy: jest.SpyInstance;

  beforeEach(() => {
    listExercisesSpy = jest.spyOn(listExercises, "listExercises");
    listExercisesSpy.mockResolvedValue(mockData);
    init();
  });

  test("Exercise page renders", () => {
    screen.getByTestId("exercisePage");
  });

  test("Exercises render in data table", async () => {
    await waitFor(() => {
      mockData.forEach((e) => {
        screen.getByText(e.name);
        screen.getByText(e.muscle_group);
        screen.getByText(e.category);
      });
    });
  });

  test("When user queries for an exercise name, only the results will populate in data table", async () => {
    const filterInput = screen.getByTestId("exerciseFilterInput") as HTMLInputElement;
    const filterIndex = 1;
    const filteredExercise = mockData[filterIndex];
    const query = filteredExercise.name;
    fireEvent.change(filterInput, { target: { value: query } });

    await waitFor(() => {
      expect(filterInput.value).toBe(query);

      mockData.forEach((data, index) => {
        if (filterIndex !== index) {
          expect(screen.queryByText(data.category)).toBeNull();
          expect(screen.queryByText(data.muscle_group)).toBeNull();
          expect(screen.queryByText(data.name)).toBeNull();
        } else {
          screen.getByText(data.category);
          screen.getByText(data.muscle_group);
          screen.getByText(data.name);
        }
      });
    });
  });

  test("Edit exercise form is displayed to the user when they click on an exercise", async () => {
    const firstExercise = mockData[0];

    await waitFor(() => {
      screen.getByText(firstExercise.name).click();
    });

    await waitFor(() => {
      screen.getByTestId("editExerciseForm");
    });
  });

  test("Add exercise form is displayed to the user when the plus button is clicked", async () => {
    const addExerciseBtn = screen.getByTestId("exerciseFilterInput");
    fireEvent.click(addExerciseBtn);

    await waitFor(() => {
      screen.getByTestId("addExerciseBtn");
    });
  });
});
