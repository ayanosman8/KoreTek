import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
}

export function Card({ children, title }: CardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
}
