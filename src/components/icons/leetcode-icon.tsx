import type React from "react";

/**
 * Marca simplificada de LeetCode, dibujada a trazo para que se lea a 16px.
 *
 * Hereda `currentColor` como los demas iconos del encabezado.
 */
export function LeetCodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>LeetCode</title>
      <path d="M14.6 3.6 7.2 11a3.5 3.5 0 0 0 0 4.9l3.1 3.1a3.5 3.5 0 0 0 4.9 0l2.1-2.1" />
      <path d="M10.4 13.3H20" />
      <path d="m16.7 7.5-3.1-3.1" />
    </svg>
  );
}
