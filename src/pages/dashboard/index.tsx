import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleNewWorkoutClick = () => {
    navigate("/workout");
  };

  return (
    <div data-testid='dashboardPage'>
      <Button
        className='p-button-info'
        type='button'
        label='Mog Now'
        onClick={handleNewWorkoutClick}
      />
    </div>
  );
}
