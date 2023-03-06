import React, { useRef, useState } from "react";
import { useQuery } from "react-query";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableRowClickEventParams } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

import { ExerciseTable } from "@components/ExerciseTable";
import { listExercises, exercise } from "@services/exercise";
import { InputNumber } from "primereact/inputnumber";

type WorkoutFormProps = {
  template?: any;
};

type exerciseForm = {
  sets: number;
  weight: number[];
  reps: number[];
};

type template = {
  id: string;
  name: string;
  exercises: string[];
  sets: number[];
  date_last_used: string;
  created_by: string;
};

function initialValuesFrom(template: template) {
  return template.exercises.reduce((acc: Record<string, exerciseForm>, exercise, index) => {
    const setCount = template.sets[index];
    const repsAndWeight = Array.from({ length: setCount }, (_, s) => s - s);
    acc = {
      ...acc,
      [exercise]: {
        sets: setCount,
        reps: repsAndWeight,
        weight: repsAndWeight,
      },
    };
    return acc;
  }, {});
}

export function WorkoutForm({ template }: WorkoutFormProps) {
  const [isSelectingExercise, setIsSelectingExercise] = useState(false);
  const toastRef = useRef<Toast>(null);

  const workoutForm = useFormik({
    initialValues: {} as Record<string, exerciseForm>,
    enableReinitialize: false,
    onSubmit(values) {
      console.log(values);
    },
  });

  const { data: exercises, isLoading } = useQuery("listExercises", listExercises, {
    enabled: isSelectingExercise,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const handleDialogVisibility = () => {
    setIsSelectingExercise(!isSelectingExercise);
  };

  const handleAddSet: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const exercise = e.currentTarget.parentElement?.id;
    if (!exercise) return;

    workoutForm.setValues((prevState) => ({
      ...prevState,
      [exercise]: {
        reps: [...prevState[exercise].reps, 0],
        weight: [...prevState[exercise].weight, 0],
        sets: prevState[exercise].sets + 1,
      },
    }));
  };

  const handleAddExercise = (e: DataTableRowClickEventParams) => {
    const exercise = e.data as exercise;
    const { name } = exercise;

    if (name in workoutForm.values) {
      toastRef.current?.show({
        detail: `${name} already in workout`,
        life: 3500,
        severity: "warn",
      });
    } else {
      workoutForm.setValues((prevState) => ({
        ...prevState,
        [name]: {
          sets: 1,
          reps: [0],
          weight: [0],
        },
      }));
      handleDialogVisibility();
    }
  };

  console.log(workoutForm.values);

  return (
    <>
      <form data-testid='workoutForm' onSubmit={workoutForm.handleSubmit}>
        <p className='text-2xl text-center'>Active workout</p>
        {Object.keys(workoutForm.values).map((e) => {
          return (
            <div id={e} key={e}>
              <DataTable
                responsiveLayout='scroll'
                header={<p>{e}</p>}
                value={Array.from({ length: workoutForm.values[e].sets }, (_, eKey) => ({
                  set: workoutForm.values[e].sets - workoutForm.values[e].sets + eKey + 1,
                  reps: workoutForm.values[e].reps[eKey],
                  weight: workoutForm.values[e].weight[eKey],
                }))}
              >
                <Column header='Set' field='set' />
                <Column
                  alignHeader='center'
                  body={<InputNumber minFractionDigits={2} size={3} />}
                  header='Lbs'
                  field='weight'
                />
                <Column
                  alignHeader='center'
                  body={<InputNumber minFractionDigits={0} size={2} />}
                  header='Reps'
                  field='reps'
                />
              </DataTable>
              <Button className='w-full' label='Add Set' type='button' onClick={handleAddSet} />
            </div>
          );
        })}
        <Button
          className='p-button-info w-full mt-5'
          label='Add Exercise'
          type='button'
          onClick={handleDialogVisibility}
        />
      </form>
      <Dialog
        header='Select an exercise'
        onHide={handleDialogVisibility}
        visible={isSelectingExercise}
      >
        <Toast ref={toastRef} />
        <ExerciseTable
          exercises={exercises || []}
          isLoading={isLoading}
          onExerciseSelection={handleAddExercise}
        />
      </Dialog>
    </>
  );
}
