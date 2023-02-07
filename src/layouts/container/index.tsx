import React from "react";

type ContainerProps = {
  children: React.ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    <main data-testid='main--container' className='h-screen font-thin'>
      {children}
    </main>
  );
}
