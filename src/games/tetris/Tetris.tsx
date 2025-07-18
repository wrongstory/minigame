import { useState, useEffect, useCallback } from "react";
import { TETROMINOS } from "./blocks";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill({ filled: false, color: "" })
  );

export default function Tetris() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [block, setBlock] = useState(TETROMINOS[0]);
  const [position, setPosition] = useState({ x: 3, y: 0 });

  // 🎮 방향키 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      setPosition((prev) => {
        switch (e.key) {
          case "ArrowLeft":
            return { ...prev, x: Math.max(prev.x - 1, 0) };
          case "ArrowRight":
            return {
              ...prev,
              x: Math.min(prev.x + 1, BOARD_WIDTH - block.shape[0].length),
            };
          case "ArrowDown":
            return {
              ...prev,
              y: Math.min(prev.y + 1, BOARD_HEIGHT - block.shape.length),
            };
          default:
            return prev;
        }
      });
    },
    [block]
  );

  // 🎮 키보드 이벤트 등록
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // 🧱 보드에 현재 블록 그리기
  useEffect(() => {
    const newBoard = createEmptyBoard();

    block.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const y = position.y + dy;
          const x = position.x + dx;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            newBoard[y][x] = { filled: true, color: block.color };
          }
        }
      });
    });

    setBoard(newBoard);
  }, [block, position]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">🧱 TETRIS</h1>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 30px)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 30px)`,
          gap: "1px",
          backgroundColor: "#333",
        }}
      >
        {board.flat().map((cell, i) => (
          <div
            key={i}
            className={`w-[30px] h-[30px] border border-gray-700 ${
              cell.filled ? cell.color : "bg-gray-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
