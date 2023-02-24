import React, { useState, useRef } from "react";
import { useQuery } from "react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableRowClickEventParams } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast, ToastMessage } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";

import { exercise, listExercises } from "@services/exercise";
import { listMuscleGroups } from "@services/muscle_group/listMuscleGroups";
import { listCategories } from "@services/category/listCategories";
import AddExerciseForm from "./forms/AddExercise";
import EditExercise from "./forms/EditExercise";

export default function Exercises() {
  const [action, setAction] = useState<"edit" | "add" | "query">("query");
  const [exerciseNameFilterValue, setExerciseNameFilterValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<exercise>();
  const [filters, setFilters] = useState({
    global: {
      value: "",
      matchMode: FilterMatchMode.CONTAINS,
    },
  });
  const toast = useRef<Toast>(null);

  const {
    data: exercises,
    isLoading,
    refetch,
  } = useQuery("listExercises", listExercises, {
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

    const exercise: exercise = e.data;
    setSelectedExercise(exercise);
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
            placeholder='Filter by exercise name'
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

  const dialogHeader = <span>{action === "add" ? "Add" : "Edit"} Exercise</span>;

  const handleHideDialog = () => {
    setIsVisible(false);
    setAction("query");
  };

  const handleSuccess = async (args: ToastMessage) => {
    toast.current?.show(args);
    await handleCleanup();
  };

  const handleError = (args: ToastMessage) => {
    toast.current?.show(args);
  };

  const handleCleanup = async () => {
    await refetch();
    handleHideDialog();
  };

  return (
    <>
      <Toast ref={toast} position='top-center' />
      <Dialog onHide={handleHideDialog} visible={isVisible} header={dialogHeader}>
        {action === "edit" && (
          <EditExercise
            categories={categories || []}
            exercise={selectedExercise!}
            muscleGroups={muscleGroups || []}
            handleError={handleError}
            handleSuccess={handleSuccess}
          />
        )}
        {action === "add" && (
          <AddExerciseForm
            categories={categories || []}
            handleError={handleError}
            handleSuccess={handleSuccess}
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
