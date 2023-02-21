import React from "react";
// import { useMutation } from "react-query";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

import { exercise } from "@services/exercise";
import { category } from "@services/category/listCategories";
import { muscleGroup } from "@services/muscle_group/listMuscleGroups";

interface EditExerciseFormProps {
  categories: category[];
  exercise: exercise;
  muscleGroups: muscleGroup[];
}

export default function EditExerciseForm({
  categories,
  exercise,
  muscleGroups,
}: EditExerciseFormProps) {
  const { category, muscle_group, name } = exercise;

  //   const editExercise = useMutation();

  const form = useFormik({
    initialValues: {
      exerciseName: name,
      muscleGroup: muscle_group,
      category,
    },
    onSubmit(data) {},
  });

  return (
    <form data-testid='editExerciseForm' onSubmit={form.handleSubmit}>
      <div className='flex flex-col'>
        <InputText
          className='mb-5 mt-3'
          data-testid='editExerciseNameInput'
          id='exerciseName'
          name='exerciseName'
          onChange={form.handleChange}
          placeholder='Edit Exercise Name'
          value={form.values.exerciseName}
        />
        <Dropdown
          className='mb-5 mt-3'
          data-testid='editExerciseMuscleGroupDropdown'
          id='muscleGroup'
          name='muscleGroup'
          placeholder='Muscle group'
          onChange={form.handleChange}
          options={muscleGroups}
          optionLabel='name'
          optionValue='name'
          value={form.values.muscleGroup}
        />
        <Dropdown
          className='mb-5 mt-3'
          data-testid='editExerciseCategoryDropdown'
          id='category'
          name='category'
          placeholder='Category'
          onChange={form.handleChange}
          options={categories}
          optionLabel='name'
          optionValue='name'
          value={form.values.category}
        />
        <Button
          className={classNames({
            "p-button-warning": form.isValid,
            "mt-5": true,
          })}
          label='Edit'
          //   loading={newExercise.isLoading}
          type='submit'
          data-testid='editExerciseSubmitBtn'
        />
      </div>
    </form>
  );
}
