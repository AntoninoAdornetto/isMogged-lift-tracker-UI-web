import React, { useState } from "react";
import { useQuery } from "react-query";
import { DataTableRowClickEventParams } from "primereact/datatable";
import { Dialog } from "primereact/dialog";

import { exercise, listExercises } from "@services/exercise";
import { listMuscleGroups } from "@services/muscle_group/listMuscleGroups";
import { listCategories } from "@services/category/listCategories";
import EditExercise from "./forms/EditExercise";
import { ExerciseTable } from "@components/ExerciseTable";

export default function Exercises() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<exercise>({
    category: "",
    id: -1,
    muscle_group: "",
    name: "",
  });

  const { data: exercises, isLoading } = useQuery("listExercises", listExercises, {
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

  const handleExerciseSelection = (e: DataTableRowClickEventParams) => {
    const exercise: exercise = e.data;
    setSelectedExercise(exercise);
    setIsVisible(true);
  };

  const handleHide = () => {
    setIsVisible(false);
  };

  return (
    <>
      <ExerciseTable
        exercises={exercises || []}
        isLoading={isLoading}
        onExerciseSelection={handleExerciseSelection}
      />
      <Dialog onHide={handleHide} header='Edit Exercise' visible={isVisible}>
        {categories && muscleGroups && (
          <EditExercise
            categories={categories}
            exercise={selectedExercise}
            muscleGroups={muscleGroups}
            onDefer={handleHide}
          />
        )}
      </Dialog>
    </>
  );
}
