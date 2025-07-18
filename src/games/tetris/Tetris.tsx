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
  const [fixedBoard, setFixedBoard] = useState(createEmptyBoard());

  // 충돌 감지
  const isCollision = (x: number, y: number) => {
    return block.shape.some((row, dy) =>
      row.some((cell, dx) => {
        if (!cell) return false;
        const newY = y + dy;
        const newX = x + dx;
        return (
          newY >= BOARD_HEIGHT ||
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          (newY >= 0 && fixedBoard[newY][newX]?.filled)
        );
      })
    );
  };

  // 키 입력
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      setPosition((prev) => {
        let newPos = { ...prev };

        if (e.key === "ArrowLeft") newPos.x--;
        else if (e.key === "ArrowRight") newPos.x++;
        else if (e.key === "ArrowDown") newPos.y++;

        if (!isCollision(newPos.x, newPos.y)) return newPos;
        return prev;
      });

      // 🔁 회전 키
      if (e.key === "ArrowUp") {
        const rotatedShape = rotate(block.shape);
        const testBlock = { ...block, shape: rotatedShape };

        const testCollision = rotatedShape.some((row, dy) =>
          row.some((cell, dx) => {
            if (!cell) return false;
            const newY = position.y + dy;
            const newX = position.x + dx;
            return (
              newY >= BOARD_HEIGHT ||
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              (newY >= 0 && fixedBoard[newY][newX]?.filled)
            );
          })
        );

        if (!testCollision) {
          setBlock(testBlock);
        }
      }
    },
    [block, position, fixedBoard]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 중력 작동
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        const nextY = prev.y + 1;
        if (!isCollision(prev.x, nextY)) {
          return { ...prev, y: nextY };
        } else {
          // 고정 로직
          const newFixed = fixedBoard.map((row) => [...row]);
          block.shape.forEach((row, dy) =>
            row.forEach((cell, dx) => {
              if (cell) {
                const y = prev.y + dy;
                const x = prev.x + dx;
                if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                  newFixed[y][x] = { filled: true, color: block.color };
                }
              }
            })
          );
          setFixedBoard(newFixed);
          setBlock(TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)]);
          return { x: 3, y: 0 };
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [block, fixedBoard]);

  // 렌더링용 합성 보드
  const mergedBoard = createEmptyBoard();

  // 고정된 블록 렌더
  fixedBoard.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.filled) mergedBoard[y][x] = cell;
    });
  });

  // 현재 블록 렌더
  block.shape.forEach((row, dy) =>
    row.forEach((cell, dx) => {
      if (cell) {
        const y = position.y + dy;
        const x = position.x + dx;
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          mergedBoard[y][x] = { filled: true, color: block.color };
        }
      }
    })
  );

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
        {mergedBoard.flat().map((cell, i) => (
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
