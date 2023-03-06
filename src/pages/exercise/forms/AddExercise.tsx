import React, { useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import { createExercise, listExercises } from "@services/exercise";
import { category } from "@services/category/listCategories";
import { muscleGroup } from "@services/muscle_group";
import { handleHttpException } from "@utils/handleHttpException";

type AddExerciseFormProps = {
  muscleGroups: muscleGroup[];
  categories: category[];
};

export default function AddExerciseForm({ categories, muscleGroups }: AddExerciseFormProps) {
  const toast = useRef<Toast>(null);

  const { refetch } = useQuery("listExercises", listExercises, {
    enabled: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const newExercise = useMutation(createExercise, {
    onError(err) {
      toast.current?.show({ detail: handleHttpException(err), life: 3500, severity: "error" });
    },
    async onSuccess(data) {
      toast.current?.show({
        detail: `Added ${data.name} to exercise data base`,
        life: 3500,
        severity: "success",
      });
      await refetch();
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
      form.resetForm();
    },
  });

  return (
    <>
      <Toast ref={toast} />
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
    </>
  );
}
