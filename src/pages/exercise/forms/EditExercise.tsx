import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

import { deleteExercise, exercise, updateExercise, listExercises } from "@services/exercise";
import { category } from "@services/category/listCategories";
import { muscleGroup } from "@services/muscle_group/listMuscleGroups";
import { handleHttpException } from "@utils/handleHttpException";

export type EditExerciseFormProps = {
  categories: category[];
  exercise: exercise;
  muscleGroups: muscleGroup[];
  onDefer: () => void;
};

export default function EditExerciseForm({
  categories,
  exercise,
  muscleGroups,
  onDefer,
}: EditExerciseFormProps) {
  const toast = useRef<Toast>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { category, muscle_group, name, id } = exercise;

  const { refetch } = useQuery("listExercises", listExercises, {
    enabled: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const editExercise = useMutation(updateExercise, {
    onError(error) {
      toast.current?.show({ detail: handleHttpException(error), life: 3500, severity: "error" });
    },
    async onSuccess() {
      toast.current?.show({
        detail: `Successfully edited ${name}`,
        life: 3500,
        severity: "success",
      });
      await refetch();
      onDefer();
    },
  });

  const deleteExerciseReq = useMutation(deleteExercise, {
    onError(error) {
      toast.current?.show({ detail: handleHttpException(error), life: 3500, severity: "error" });
    },
    async onSuccess() {
      toast.current?.show({
        detail: `Successfully deleted ${name}`,
        life: 3500,
        severity: "success",
      });
      await refetch();
      setIsDeleteModalVisible(false);
      onDefer();
    },
  });

  const form = useFormik({
    initialValues: {
      exerciseName: name,
      muscleGroup: muscle_group,
      category,
    },
    validateOnMount: true,
    validate(values) {
      const errors: Record<string, string> = {};

      if (
        values.exerciseName === name &&
        values.muscleGroup === muscle_group &&
        values.category === category
      ) {
        errors.noChanges = "please make a change to the form";
      }

      return errors;
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

  const handleDeleteExercise = async () => {
    await deleteExerciseReq.mutateAsync(id);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        onHide={() => setIsDeleteModalVisible(false)}
        visible={isDeleteModalVisible}
        header={<p>Delete Exercise</p>}
      >
        <div className='text-center p-5'>
          <Button
            className='p-button-danger'
            data-testid='confirmDelteExerciseBtn'
            label='Confirm'
            onClick={handleDeleteExercise}
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
              disabled={!form.isValid}
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
