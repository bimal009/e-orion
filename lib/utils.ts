import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleError(error: unknown): void {
  if (error instanceof Error) {
    console.error("Error message:", error.message);
    // Optional: log stack trace or send to a logging service
    // console.error("Stack trace:", error.stack);
  } else {
    console.error("Unknown error:", error);
  }
}


export function formatDate(dateInput: string | Date): string {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  // Format: YYYY-MM-DD
  return date.toISOString().split("T")[0];
}
