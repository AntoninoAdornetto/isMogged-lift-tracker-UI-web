import React from "react";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

import { createExercise } from "@services/exercise";
import { category } from "@services/category/listCategories";
import { muscleGroup } from "@services/muscle_group/listMuscleGroups";
// import { handleHttpException } from "@utils/handleHttpException";

interface AddExerciseFormProps {
  categories: category[];
  muscleGroups: muscleGroup[];
  cleanup: () => Promise<void>;
}

export default function AddExerciseForm({
  categories,
  muscleGroups,
  cleanup,
}: AddExerciseFormProps) {
  const newExercise = useMutation(createExercise, {
    // onError(err) {
    //   toast.current?.show({ severity: "error", detail: handleHttpException(err), life: 3000 });
    // },
  });

  const addExercise = useFormik({
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

      addExercise.resetForm();
    },
  });

  return (
    <form data-testid='addExerciseForm' onSubmit={addExercise.handleSubmit}>
      <div className='flex flex-col'>
        <span className='text-xl mb-5 text-center'>Create new exercise</span>
        <InputText
          className='mb-5 mt-5'
          data-testid='addExerciseNameInput'
          id='exerciseName'
          name='exerciseName'
          placeholder='Exercise Name'
          onChange={addExercise.handleChange}
          value={addExercise.values.exerciseName}
        />
        <Dropdown
          className='mb-5'
          data-testid='addExerciseMuscleGroupDropdown'
          id='muscleGroup'
          name='muscleGroup'
          placeholder='Muscle group'
          onChange={addExercise.handleChange}
          options={muscleGroups}
          optionLabel='name'
          optionValue='name'
          value={addExercise.values.muscleGroup}
        />
        <Dropdown
          className='mb-5'
          data-testid='addExerciseCategoriesDropdown'
          id='category'
          name='category'
          placeholder='Category'
          onChange={addExercise.handleChange}
          options={categories}
          optionLabel='name'
          optionValue='name'
          value={addExercise.values.category}
        />
        <Button
          className={classNames({
            "p-button-info": addExercise.isValid,
            "p-button-danger": !addExercise.isValid,
            "mt-5": true,
          })}
          disabled={!addExercise.isValid}
          label='Save'
          loading={newExercise.isLoading}
          type='submit'
          data-testid='createExerciseSubmitBtn'
        />
      </div>
    </form>
  );
}
