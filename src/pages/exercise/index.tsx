import React, { useState, useRef } from "react";
import { useQuery } from "react-query";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableRowClickEventParams } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FilterMatchMode } from "primereact/api";

import { exercise, listExercises } from "@services/exercise";
import { listMuscleGroups } from "@services/muscle_group/listMuscleGroups";
import { listCategories } from "@services/category/listCategories";
import { handleHttpException } from "@utils/handleHttpException";
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

  const dialogHeader = <span>{action === "add" ? "Add" : "Edit"} Exercise</span>;

  const handleHideDialog = () => {
    setIsVisible(false);
    setAction("query");
  };

  const handleAddExerciseError = (err: unknown) => {
    toast.current?.show({ severity: "error", detail: handleHttpException(err), life: 3000 });
  };

  const handleAddExerciseSuccess = (data: exercise) => {
    toast.current?.show({
      severity: "success",
      detail: `Added new exercise ${data.name}`,
      life: 3000,
    });
  };

  const handleCleanup = async () => {
    await refetch();
    setIsVisible(false);
    setAction("query");
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
          />
        )}

        {action === "add" && (
          <AddExerciseForm
            categories={categories || []}
            cleanup={handleCleanup}
            handleError={handleAddExerciseError}
            handleSuccess={handleAddExerciseSuccess}
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
