import React from "react";

import { exerciseSection } from "@pages/workout/forms/WorkoutForm";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";

type LiftTableProps = {
  currentExercise: exerciseSection;
  id: string;
};

export function LiftTable({ currentExercise, id }: LiftTableProps) {
  return (
    <div data-testid={id} id={id} className='mb-5'>
      <DataTable
        header={<p>{id}</p>}
        responsiveLayout='scroll'
        value={Array.from({ length: currentExercise.sets }, (_, n) => ({
          set: n + 1,
          weight: currentExercise.weight[n],
          reps: currentExercise.reps[n],
        }))}
      >
        <Column field='set' header='Set' />
        <Column
          body={<InputNumber minFractionDigits={2} size={3} />}
          field='weight'
          header='Lbs'
          alignHeader='center'
        />
        <Column
          alignHeader='center'
          body={<InputNumber minFractionDigits={2} size={3} />}
          field='reps'
          header='Reps'
        />
      </DataTable>
    </div>
  );
}
