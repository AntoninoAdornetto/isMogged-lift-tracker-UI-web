import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <main data-testid='main--container' className={`h-screen font-thin ${className}`}>
      {children}
    </main>
  );
}
