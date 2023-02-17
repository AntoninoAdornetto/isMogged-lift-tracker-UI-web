import React, { useState } from "react";
import { DataTable, DataTableRowClickEventParams } from "primereact/datatable";
import { useQuery } from "react-query";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

import { listExercises, listExercisesResponse } from "@services/exercise/listExercises";
import { Dialog } from "primereact/dialog";

type Filter = {
  [key: string]: {
    value: string;
    matchMode: FilterMatchMode;
  };
};

export default function Exercises() {
  const [isVisible, setIsVisible] = useState(false);
  const [exerciseNameFilterValue, setExerciseNameFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<Filter>({
    global: {
      value: "",
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  const { data, isLoading } = useQuery(
    ["listExercises", page, pageSize],
    () => listExercises({ page, pageSize }),
    {
      refetchOnWindowFocus: false,
    }
  );

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

  const header = (
    <div>
      <div className='flex justify-between items-center'>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText
            placeholder='Keyword search'
            onChange={handleSearch}
            value={exerciseNameFilterValue}
          />
        </span>
        <Button type='button' icon='pi pi-plus' className='p-button-success' />
      </div>
    </div>
  );

  const handleExerciseSelection = (e: DataTableRowClickEventParams) => {
    setIsVisible(true);
    // open dialog modal to display form to user to edit the exercise and see more about it
    const { id, category, muscle_group, name }: listExercisesResponse = e.data;
    console.log(id, category, muscle_group, name);
  };

  return (
    <>
      <Dialog onHide={() => setIsVisible(false)} visible={isVisible}></Dialog>
      <DataTable
        dataKey='id'
        filters={filters}
        loading={isLoading}
        header={header}
        globalFilterFields={["name"]}
        value={data}
        onRowClick={handleExerciseSelection}
        selectionMode='single'
      >
        <Column field='name' header='Name' filter />
        <Column field='muscle_group' header='Muscle Group' />
        <Column field='category' header='Category' />
      </DataTable>
    </>
  );
}
