import React from "react";
import { useQuery } from "react-query";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";

import { listMuscleGroups } from "@services/muscle_group/listMuscleGroups";
import { listCategories } from "@services/category/listCategories";
import AddExerciseForm from "@src/pages/exercise/forms/AddExercise";

export type HeaderProps = {
  filteredMuscleGroup: string;
  keyword: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onMuscleGroupChange: (e: DropdownChangeParams) => void;
};

export function Header({
  filteredMuscleGroup,
  keyword,
  onChange,
  onMuscleGroupChange,
}: HeaderProps) {
  const { data: muscleGroups } = useQuery("listMuscleGroups", listMuscleGroups, {
    enabled: true,
    staleTime: Infinity,
  });

  const { data: categories } = useQuery("listCategories", listCategories, {
    enabled: true,
    staleTime: Infinity,
  });

  return (
    <div data-testid='exercisesTableHeader'>
      <Accordion>
        <AccordionTab header='Filter Options'>
          <div>
            <span className='p-input-icon-left mb-5 w-full'>
              <i className='pi pi-search' />
              <InputText
                className='w-full'
                data-testid='exerciseNameFilterInput'
                placeholder='Search by exercise name'
                onChange={onChange}
                value={keyword}
              />
            </span>
            {muscleGroups && (
              <Dropdown
                className='w-full'
                data-testid='filterByMuscleGroupDropdown'
                id='muscleGroup'
                name='muscleGroup'
                placeholder='Filter by muscle group'
                onChange={onMuscleGroupChange}
                options={[{ name: "All" }, ...muscleGroups]}
                optionLabel='name'
                optionValue='name'
                value={filteredMuscleGroup}
              />
            )}
          </div>
        </AccordionTab>
        {muscleGroups && categories && (
          <AccordionTab header='Create'>
            <AddExerciseForm categories={categories} muscleGroups={muscleGroups} />
          </AccordionTab>
        )}
      </Accordion>
    </div>
  );
}
