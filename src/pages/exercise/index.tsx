import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableRowClickEventParams } from "primereact/datatable";
// import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";
// import { classNames } from "primereact/utils";

import { createExercise, exercise, listExercises } from "@services/exercise";
import { listMuscleGroups } from "@services/muscle_group/listMuscleGroups";
import { listCategories } from "@services/category/listCategories";
import { handleHttpException } from "@utils/handleHttpException";
import AddExerciseForm from "./forms/AddExercise";

export default function Exercises() {
  const [action, setAction] = useState<"edit" | "add" | "query">("query");
  const [isVisible, setIsVisible] = useState(false);
  const [exerciseNameFilterValue, setExerciseNameFilterValue] = useState("");
  const [page] = useState(1);
  const [pageSize] = useState(50);
  const [filters, setFilters] = useState({
    global: {
      value: "",
      matchMode: FilterMatchMode.CONTAINS,
    },
  });
  const toast = useRef<Toast>(null);

  const newExercise = useMutation(createExercise, {
    onError(err) {
      toast.current?.show({ severity: "error", detail: handleHttpException(err), life: 3000 });
    },
  });

  const {
    data: exercises,
    isLoading,
    refetch,
  } = useQuery(["listExercises", page, pageSize], () => listExercises({ page, pageSize }), {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const { data: muscleGroups } = useQuery("listMuscleGroups", listMuscleGroups, {
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const { data: categories } = useQuery("listCategories", listCategories, {
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    setFilters((prevState) => ({
      global: {
        ...prevState.global,
        value,
      },
    }));

    setExerciseNameFilterValue(value);
  };

  const handleEditExercise = (e: DataTableRowClickEventParams) => {
    setAction("edit");
    setIsVisible(true);

    // open dialog modal to display form to user to edit the exercise and see more about it
    const { id, category, muscle_group, name }: exercise = e.data;
    console.log(id, category, muscle_group, name);
  };

  const handleAddExercise = () => {
    setAction("add");
    setIsVisible(true);
  };

  const header = (
    <div data-testid='exercisePage'>
      <div className='flex justify-between items-center'>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText
            data-testid='exerciseFilterInput'
            placeholder='Keyword search'
            onChange={handleSearch}
            value={exerciseNameFilterValue}
          />
        </span>
        <Button
          data-testid='addExerciseBtn'
          type='button'
          icon='pi pi-plus'
          className='p-button-success'
          onClick={handleAddExercise}
        />
      </div>
    </div>
  );

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
      await refetch();
      setIsVisible(false);
      setAction("query");
      addExercise.resetForm();
    },
  });

  // const addExerciseForm = action === "add" && (
  //   <form data-testid='addExerciseForm' onSubmit={addExercise.handleSubmit}>
  //     <div className='flex flex-col'>
  //       <span className='text-xl mb-5 text-center'>Create new exercise</span>
  //       <InputText
  //         className='mb-5 mt-5'
  //         data-testid='addExerciseNameInput'
  //         id='exerciseName'
  //         name='exerciseName'
  //         placeholder='Exercise Name'
  //         onChange={addExercise.handleChange}
  //         value={addExercise.values.exerciseName}
  //       />
  //       <Dropdown
  //         className='mb-5'
  //         data-testid='addExerciseMuscleGroupDropdown'
  //         id='muscleGroup'
  //         name='muscleGroup'
  //         placeholder='Muscle group'
  //         onChange={addExercise.handleChange}
  //         options={muscleGroups}
  //         optionLabel='name'
  //         optionValue='name'
  //         value={addExercise.values.muscleGroup}
  //       />
  //       <Dropdown
  //         className='mb-5'
  //         data-testid='addExerciseCategoriesDropdown'
  //         id='category'
  //         name='category'
  //         placeholder='Category'
  //         onChange={addExercise.handleChange}
  //         options={categories}
  //         optionLabel='name'
  //         optionValue='name'
  //         value={addExercise.values.category}
  //       />
  //       <Button
  //         className={classNames({
  //           "p-button-info": addExercise.isValid,
  //           "p-button-danger": !addExercise.isValid,
  //           "mt-5": true,
  //         })}
  //         disabled={!addExercise.isValid}
  //         label='Save'
  //         loading={newExercise.isLoading}
  //         type='submit'
  //         data-testid='createExerciseSubmitBtn'
  //       />
  //     </div>
  //   </form>
  // );

  const handleHideDialog = () => {
    setIsVisible(false);
    setAction("query");
  };

  return (
    <>
      <Toast ref={toast} position='top-center' />
      <Dialog onHide={handleHideDialog} visible={isVisible}>
        {action === "edit" && <form data-testid='editExerciseForm'>Edit Exercise</form>}
        {/* {addExerciseForm} */}
        {action === "add" && (
          <AddExerciseForm
            categories={categories || []}
            cleanup={async () => {
              await refetch();
              setIsVisible(false);
              setAction("query");
            }}
            muscleGroups={muscleGroups || []}
          />
        )}
      </Dialog>
      <DataTable
        dataKey='id'
        filters={filters}
        loading={isLoading}
        header={header}
        globalFilterFields={["name"]}
        value={exercises}
        onRowClick={handleEditExercise}
        selectionMode='single'
      >
        <Column field='name' header='Name' filter />
        <Column field='muscle_group' header='Muscle Group' />
        <Column field='category' header='Category' />
      </DataTable>
    </>
  );
}
