import type { BlockMatrix } from "./blocks";

// 90도 시계방향 회전
export function rotate(matrix: BlockMatrix): BlockMatrix {
  // const size = matrix.length;
  return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
}
