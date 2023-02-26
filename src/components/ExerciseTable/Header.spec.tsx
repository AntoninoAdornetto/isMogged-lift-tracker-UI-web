import React from "react";
import { fireEvent, screen } from "@testing-library/react";

import renderWithProvider from "@utils/renderWithProvider";
import { Header, HeaderProps } from "./Header";

const mockProps: HeaderProps = {
  filteredMuscleGroup: "",
  keyword: "",
  onChange: jest.fn(),
  onMuscleGroupChange: jest.fn(),
};

function init(props: HeaderProps = mockProps) {
  renderWithProvider(<Header {...props} />);
}

describe("Exercise Table Header", () => {
  test("renders the table header", () => {
    init();
    screen.getByTestId("exercisesTableHeader");
  });

  test("Filter accordion renders", () => {
    init();
    screen.getByText("Filter Options");
  });

  test("Create new exercise accordion renders", () => {
    init();
    screen.getByText("Create");
  });

  test("Filter accordion will display exercise name search input when clicked", () => {
    init();
    const filter = screen.getByText("Filter Options");
    fireEvent.click(filter);
    screen.getByTestId("exerciseNameFilterInput");
  });

  test("Exercise name filter will register change events", () => {
    init();
    const filter = screen.getByText("Filter Options");
    fireEvent.click(filter);
    const eFilter = screen.getByTestId("exerciseNameFilterInput");

    const value = "Bench Press";

    for (const c of value) {
      fireEvent.change(eFilter, { target: { value: c } });
    }
    expect(mockProps.onChange).toHaveBeenCalledTimes(value.length);
  });

  test("Create form renders and displays all fields", () => {
    init();
    const create = screen.getByText("Create");
    fireEvent.click(create);
    screen.getByTestId("addExerciseNameInput");
    screen.getByTestId("addExerciseCategoryDropdown");
    screen.getByTestId("addExerciseMuscleGroupDropdown");
    screen.getByTestId("createExerciseSubmitBtn");
  });

  it.todo(
    "Filter accordion will display muscle group filtering option when clicked and the muscle groups is not null"
    // ,
    // () => {
    //   // const listMGSpy = jest.spyOn(MGService, "listMuscleGroups")
    //   // listMGSpy.mockResolvedValueOnce([{id: 1, name:"chest"}, {id: 1, name: "back"}])
    //   init();
    //   const filter = screen.getByText("Filter Options");
    //   fireEvent.click(filter);
    //   screen.getByTestId("filterByMuscleGroupDropdown");
    // }
  );
});
