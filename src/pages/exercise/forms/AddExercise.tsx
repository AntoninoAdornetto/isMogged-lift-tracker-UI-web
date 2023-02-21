import React from "react";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { createExercise, exercise } from "@services/exercise";
import { category } from "@services/category/listCategories";
import { muscleGroup } from "@services/muscle_group/listMuscleGroups";

interface AddExerciseFormProps {
  categories: category[];
  muscleGroups: muscleGroup[];
  cleanup: () => Promise<void>;
  handleError: (err: unknown) => void;
  handleSuccess: (data: exercise) => void;
}

export default function AddExerciseForm({
  categories,
  cleanup,
  handleError,
  handleSuccess,
  muscleGroups,
}: AddExerciseFormProps) {
  const newExercise = useMutation(createExercise, {
    onError(err) {
      handleError(err);
    },
    onSuccess(data) {
      handleSuccess(data);
    },
  });

  const form = useFormik({
    initialValues: {
      exerciseName: "",
      muscleGroup: "",
      category: "",
    },
    validate: (data) => {
      const errors: Record<string, string> = {};

      if (!data.exerciseName) {
        errors.exerciseName = "Exercise must have a name";
      }

      if (!data.muscleGroup) {
        errors.muscleGroup = "Exercise must have a muscle group";
      }

      if (!data.category) {
        errors.category = "Exercise must have a category";
      }

      return errors;
    },
    async onSubmit(data) {
      await newExercise.mutateAsync({
        category: data.category,
        muscle_group: data.muscleGroup,
        name: data.exerciseName,
      });

      await cleanup();

      form.resetForm();
    },
  });

  return (
    <form data-testid='addExerciseForm' onSubmit={form.handleSubmit}>
      <div className='flex flex-col'>
        <InputText
          className='mb-5 mt-5'
          data-testid='addExerciseNameInput'
          id='exerciseName'
          name='exerciseName'
          placeholder='Exercise Name'
          onChange={form.handleChange}
          value={form.values.exerciseName}
        />
        <Dropdown
          className='mb-5'
          data-testid='addExerciseMuscleGroupDropdown'
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
          className='mb-5'
          data-testid='addExerciseCategoryDropdown'
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
            "p-button-info": form.isValid,
            "p-button-danger": !form.isValid,
            "mt-5": true,
          })}
          label='Save'
          loading={newExercise.isLoading}
          type='submit'
          data-testid='createExerciseSubmitBtn'
        />
      </div>
    </form>
  );
}
