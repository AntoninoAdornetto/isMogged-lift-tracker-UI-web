import React from "react";
import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import renderWithProvider from "@utils/renderWithProvider";

import Exercises from ".";
import { exercise } from "@services/exercise/createExercise";
import * as service from "@services/exercise";
import * as muscleGroupService from "@services/muscle_group/listMuscleGroups";
import * as categoryService from "@services/category/listCategories";

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

describe("Exercises Page", () => {
  afterEach(cleanup);

  describe("Basic render tests for Exercise Page elements", () => {
    let listExercisesSpy: jest.SpyInstance;

    beforeEach(() => {
      listExercisesSpy = jest.spyOn(service, "listExercises");
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

    test("When user queries for a specific exercise name, only the results will populate in data table", async () => {
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

    test("Add exercise form is displayed to the user when the plus button is clicked", () => {
      const addExerciseBtn = screen.getByTestId("addExerciseBtn");
      fireEvent.click(addExerciseBtn);
      screen.getByTestId("addExerciseForm");
    });
  });

  describe("Add Exercise Form", () => {
    const muscleGroups = [
      { id: 1, name: "Chest" },
      { id: 2, name: "Back" },
      { id: 3, name: "Shoulders" },
      { id: 4, name: "legs" },
    ];

    const categories = [
      { id: 1, name: "Barbell" },
      { id: 2, name: "Dumbbell" },
      { id: 3, name: "Machine" },
    ];

    test("Muscle group service is called", () => {
      const muscleGroupSpy = jest.spyOn(muscleGroupService, "listMuscleGroups");
      init();
      expect(muscleGroupSpy).toHaveBeenCalledTimes(1);
    });

    test("Catgory service is called", () => {
      const categorySpy = jest.spyOn(categoryService, "listCategories");
      init();
      expect(categorySpy).toHaveBeenCalledTimes(1);
    });

    test("Exercise name input accepts a value", () => {
      init();
      const addExerciseBtn = screen.getByTestId("addExerciseBtn");
      fireEvent.click(addExerciseBtn);

      const value = "Bench Press";

      const exerciseName = screen.getByTestId("addExerciseNameInput") as HTMLInputElement;
      fireEvent.change(exerciseName, { target: { value } });
      expect(exerciseName.value).toBe(value);
    });

    test("Muscle group down down populates all muscle group names", async () => {
      const muscleGroupSpy = jest.spyOn(muscleGroupService, "listMuscleGroups");
      muscleGroupSpy.mockResolvedValueOnce(muscleGroups);
      init();
      const addExerciseBtn = screen.getByTestId("addExerciseBtn");
      fireEvent.click(addExerciseBtn);

      const muscleGroupDropdown = screen.getByTestId(
        "addExerciseMuscleGroupDropdown"
      ) as HTMLSelectElement;

      fireEvent.click(muscleGroupDropdown);

      await waitFor(() => {
        muscleGroups.forEach((mg) => {
          screen.getByText(mg.name);
        });
      });
    });

    test("Category dropdown populates all category names", async () => {
      const categorySpy = jest.spyOn(categoryService, "listCategories");
      categorySpy.mockResolvedValueOnce(categories);
      init();

      const addExerciseBtn = screen.getByTestId("addExerciseBtn");
      fireEvent.click(addExerciseBtn);

      const category = screen.getByTestId("addExerciseCategoryDropdown");
      fireEvent.click(category);

      await waitFor(() => {
        categories.forEach((c) => {
          screen.getByText(c.name);
        });
      });
    });

    test("New Exercise can be created", async () => {
      const categorySpy = jest.spyOn(categoryService, "listCategories");
      const muscleGroupSpy = jest.spyOn(muscleGroupService, "listMuscleGroups");
      const listExercisesSpy = jest.spyOn(service, "listExercises");
      const createExerciseSpy = jest.spyOn(service, "createExercise");
      categorySpy.mockResolvedValueOnce(categories);
      muscleGroupSpy.mockResolvedValueOnce(muscleGroups);
      listExercisesSpy.mockResolvedValue(mockData);

      init();

      const addExerciseBtn = screen.getByTestId("addExerciseBtn");
      fireEvent.click(addExerciseBtn);

      const newExerciseValues = {
        exerciseName: "Bench Press",
        muscleGroup: muscleGroups[0].name,
        category: categories[0].name,
      };

      const exerciseName = screen.getByTestId("addExerciseNameInput");
      const category = screen.getByTestId("addExerciseCategoryDropdown");
      const muscleGroupDropdown = screen.getByTestId("addExerciseMuscleGroupDropdown");
      const submitBtn = screen.getByTestId("createExerciseSubmitBtn");

      fireEvent.click(exerciseName);

      fireEvent.change(exerciseName, { target: { value: newExerciseValues.exerciseName } });
      fireEvent.click(muscleGroupDropdown);

      await waitFor(() => {
        fireEvent.click(screen.getByText(newExerciseValues.muscleGroup));
      });

      fireEvent.click(category);

      await waitFor(() => {
        fireEvent.click(screen.getByText(newExerciseValues.category));
      });

      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(createExerciseSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
