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
  test("Exercise page renders", () => {
    init();
    screen.getByTestId("exercisePage");
  });

  test("Exercises render in data table", async () => {
    const listExercisesSpy = jest.spyOn(listExercises, "listExercises");
    listExercisesSpy.mockResolvedValueOnce(mockData);
    init();

    await waitFor(() => {
      mockData.forEach((e) => {
        screen.getByText(e.name);
        screen.getByText(e.muscle_group);
        screen.getByText(e.category);
      });
    });
  });

  test("When user queries for an exercise name, the results will populate in data table", async () => {
    const listExercisesSpy = jest.spyOn(listExercises, "listExercises");
    listExercisesSpy.mockResolvedValueOnce(mockData);
    init();

    const filterInput = screen.getByTestId("exerciseFilterInput") as HTMLInputElement;
    const selectedIndex = 1;
    const filteredExercise = mockData[selectedIndex];
    const query = filteredExercise.name;
    fireEvent.change(filterInput, { target: { value: query } });

    await waitFor(() => {
      expect(filterInput.value).toBe(query);

      mockData.forEach((data, index) => {
        if (selectedIndex !== index) {
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
});
