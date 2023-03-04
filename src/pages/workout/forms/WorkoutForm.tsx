import React from "react";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { exercise } from "@services/exercise";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

import { LiftTable } from "@components/LiftTable";

type WorkoutFormProps = {
  template?: exerciseTemplateResponse;
};

type exerciseTemplateResponse = {
  id: string;
  name: string;
  exercises: string[];
  sets: number[];
  date_last_used: string;
  created_by: string;
};

export type exerciseSection = {
  sets: number;
  weight: number[];
  reps: number[];
};

type exerciseForm = {
  sets: number;
  weight: number[];
  reps: number[];
};

function initialValuesFrom(template: exerciseTemplateResponse) {
  return template.exercises.reduce((acc: Record<string, exerciseForm>, cur, i) => {
    const setCount = template.sets[i];
    acc = {
      ...acc,
      [cur]: {
        sets: setCount,
        reps: Array.from({ length: setCount }, (_, k) => k - k),
        weight: Array.from({ length: setCount }, (_, k) => k - k),
      },
    };
    return acc;
  }, {});
}

const testTemplate: exerciseTemplateResponse = {
  id: "c3d2196d-02de-4beb-823c-0c3a521bb305",
  name: "Chesticles",
  exercises: [
    "Bench Press Barbell",
    "Incline Bench Press Barbell",
    "Chest Fly Cables",
    "Chest Dips",
  ],
  sets: [3, 3, 3, 3],
  date_last_used: "0001-01-01T00:00:00Z",
  created_by: "ad0fac27-0bbe-4f6f-85fe-65f512cfce17",
};

type createLiftsRequest = {
  exercise_name: string[];
  weight: number[];
  reps: number[];
};

const produceDBQuery = (workout: Record<string, exerciseForm>) => {
  return Object.keys(workout).reduce(
    (acc: createLiftsRequest, cur) => {
      const exerciseName = Array.from({ length: workout[cur].sets }).fill(cur) as string[];
      acc = {
        ...acc,
        exercise_name: acc.exercise_name.concat(exerciseName),
        reps: acc.reps.concat(workout[cur].reps),
        weight: acc.weight.concat(workout[cur].weight),
      };
      return acc;
    },
    { exercise_name: [], weight: [], reps: [] } satisfies createLiftsRequest
  );
};

export function WorkoutForm({ template = testTemplate }: WorkoutFormProps) {
  const workoutForm = useFormik({
    initialValues: {
      ...(template && initialValuesFrom(testTemplate)),
    },
    onSubmit(values) {
      console.log(values);
    },
  });

  const handleIncrementSetCount: React.MouseEventHandler<HTMLButtonElement> = (e) => {};

  const renderExercisesFromTemplate = () => {
    if (!template) return;

    return template.exercises.map((exercise, i) => {
      return (
        <LiftTable
          key={exercise}
          currentExercise={workoutForm.values[exercise]}
          id={exercise}
          handleAddSet={handleIncrementSetCount}
        />
      );
    });
  };

  console.log(workoutForm.initialValues);
  console.log(produceDBQuery(workoutForm.initialValues));

  return (
    <form onSubmit={workoutForm.handleSubmit}>
      {renderExercisesFromTemplate()}
      <div>
        <Button label='Add Exercise' onClick={() => console.log("test")} />
      </div>
    </form>
  );
}
