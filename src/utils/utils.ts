// src/utils.ts

// Convert decimal to binary string, padded to given width
export function decToPaddedBinary(num: number, width: number): string {
  return num.toString(2).padStart(width, "0");
}

// (Later) You can add more helpers like SOP/POS/K-map generators
