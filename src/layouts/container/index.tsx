import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  id: string;
};

export default function Container({ children, id, className }: ContainerProps) {
  return (
    <main data-testid={id} className={`h-screen font-thin ${className && className}`} id={id}>
      {children}
    </main>
  );
}
