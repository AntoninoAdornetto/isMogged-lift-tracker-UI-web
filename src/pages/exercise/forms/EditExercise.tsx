import React, { useState } from "react";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

import { deleteExercise, exercise, updateExercise } from "@services/exercise";
import { category } from "@services/category/listCategories";
import { muscleGroup } from "@services/muscle_group/listMuscleGroups";
import { ToastMessage } from "primereact/toast";
import { handleHttpException } from "@utils/handleHttpException";

interface EditExerciseFormProps {
  categories: category[];
  exercise: exercise;
  muscleGroups: muscleGroup[];
  handleError: (args: ToastMessage) => void;
  handleSuccess: (args: ToastMessage) => Promise<void>;
}

export default function EditExerciseForm({
  categories,
  exercise,
  handleError,
  handleSuccess,
  muscleGroups,
}: EditExerciseFormProps) {
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { category, muscle_group, name, id } = exercise;

  const editExercise = useMutation(updateExercise, {
    onError(error) {
      handleError({ detail: handleHttpException(error), life: 3500, severity: "error" });
    },
    async onSuccess() {
      await handleSuccess({
        detail: `Successfully edited ${name}`,
        life: 3500,
        severity: "success",
      });
    },
  });

  const deleteExerciseReq = useMutation(deleteExercise, {
    onError(error) {
      handleError({ detail: handleHttpException(error), life: 3500, severity: "error" });
    },
    async onSuccess() {
      setIsDeleteModalVisible(false);
      await handleSuccess({
        detail: `Successfully deleted ${name}`,
        life: 3500,
        severity: "success",
      });
    },
  });

  const form = useFormik({
    initialValues: {
      exerciseName: name,
      muscleGroup: muscle_group,
      category,
    },
    async onSubmit(data) {
      editExercise.mutateAsync({
        name: data.exerciseName,
        category: data.category,
        muscle_group: data.muscleGroup,
        id: exercise.id,
      });
    },
  });

  const header = <p>Delete Exercise</p>;

  return (
    <>
      <Dialog
        onHide={() => setIsDeleteModalVisible(false)}
        visible={isDeleteModalVisible}
        header={header}
      >
        <div className='text-center p-5'>
          <Button
            className='p-button-danger'
            label='Confirm'
            onClick={async () => await deleteExerciseReq.mutateAsync(id)}
          />
        </div>
      </Dialog>
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
          <div className='flex justify-center items-center'>
            <Button
              className={classNames({
                "p-button-info": true,
                "w-1/2": true,
                "m-2": true,
              })}
              label='Edit'
              loading={editExercise.isLoading}
              type='submit'
              data-testid='editExerciseSubmitBtn'
            />
            <Button
              className={classNames({
                "p-button-warning": true,
                "w-1/2": true,
                "m-2": true,
              })}
              label='Delete'
              type='button'
              data-testid='deleteExerciseSubmitBtn'
              onClick={() => setIsDeleteModalVisible(true)}
            />
          </div>
        </div>
      </form>
    </>
  );
}
