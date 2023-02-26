import React, { useState } from "react";
import { useQuery } from "react-query";
import { DataTable, DataTableRowClickEventParams } from "primereact/datatable";
import { DropdownChangeParams } from "primereact/dropdown";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";

import { Header } from "./Header";
import { exercise } from "@services/exercise";
import { listExercisesBy } from "@services/muscle_group";

export type ExerciseTableProps = {
  exercises: exercise[];
  isLoading: boolean;
  onExerciseSelection: (e: DataTableRowClickEventParams) => void;
};

export function ExerciseTable({ exercises, isLoading, onExerciseSelection }: ExerciseTableProps) {
  const [tableData, setTableData] = useState<typeof exercises>([]);
  const [muscleGroup, setMuscleGroup] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    global: {
      value: "",
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  useQuery(["listExercisesBy", muscleGroup], () => listExercisesBy(muscleGroup), {
    enabled: Boolean(muscleGroup),
    refetchOnWindowFocus: false,
    onSuccess(data) {
      setTableData(data);
    },
    onError() {
      setTableData([]);
    },
  });

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;

    setFilters((prevState) => ({
      global: {
        ...prevState.global,
        value,
      },
    }));

    setSearchValue(value);
  };

  const handleMuscleGroupFilter = async (e: DropdownChangeParams) => {
    if (e.value === "All") {
      setMuscleGroup("");
      setTableData([]);
    } else {
      setMuscleGroup(e.value);
    }
  };

  return (
    <DataTable
      dataKey='id'
      data-testid='exercisesTable'
      filters={filters}
      header={
        <Header
          keyword={searchValue}
          onChange={handleSearch}
          filteredMuscleGroup={muscleGroup}
          onMuscleGroupChange={handleMuscleGroupFilter}
        />
      }
      loading={isLoading}
      globalFilterFields={["name"]}
      value={tableData.length ? tableData : exercises}
      onRowClick={onExerciseSelection}
      selectionMode='single'
    >
      <Column field='name' header='Name' />
      <Column field='muscle_group' header='Muscle Group' />
      <Column field='category' header='Category' />
    </DataTable>
  );
}
