import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  styles?: React.CSSProperties;
  id: string;
};

export default function Container({ children, id, className, styles }: ContainerProps) {
  return (
    <main
      data-testid={id}
      className={`h-screen font-thin ${className && className}`}
      id={id}
      {...(styles && { style: styles })}
    >
      {children}
    </main>
  );
}
