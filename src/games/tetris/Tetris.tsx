import { useState, useEffect, useCallback } from "react";
import { TETROMINOS } from "./blocks";
import { rotate } from "./utils";
import { useIsMobile } from "../../hooks/useIsMobile";
import MobileControls from "../../components/MobileControls";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createEmptyBoard = () =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill({ filled: false, color: "" })
  );

export default function Tetris() {
  const [block, setBlock] = useState(TETROMINOS[0]);
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [fixedBoard, setFixedBoard] = useState(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [dropInterval, setDropInterval] = useState(500); // 기본 0.5초
  const isMobile = useIsMobile();

  const moveLeft = () => {
    setPosition((prev) => {
      const newX = prev.x - 1;
      return isCollision(newX, prev.y) ? prev : { ...prev, x: newX };
    });
  };

  const moveRight = () => {
    setPosition((prev) => {
      const newX = prev.x + 1;
      return isCollision(newX, prev.y) ? prev : { ...prev, x: newX };
    });
  };

  const dropOne = () => {
    setPosition((prev) => {
      const newY = prev.y + 1;
      return isCollision(prev.x, newY) ? prev : { ...prev, y: newY };
    });
  };

  const hardDrop = () => {
    let y = position.y;
    while (!isCollision(position.x, y + 1)) y++;
    setPosition({ ...position, y }); // or trigger lock-in
  };

  const rotateBlock = () => {
    const rotated = rotate(block.shape);
    const testBlock = { ...block, shape: rotated };

    const testCollision = rotated.some((row, dy) =>
      row.some((cell, dx) => {
        if (!cell) return false;
        const newY = position.y + dy;
        const newX = position.x + dx;
        return (
          newY >= BOARD_HEIGHT ||
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          (newY >= 0 && fixedBoard[newY][newX].filled)
        );
      })
    );

    if (!testCollision) {
      setBlock(testBlock);
    }
  };

  // 하단 충돌 감지
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

  const clearFullRows = (board: typeof fixedBoard) => {
    const newBoard = board.filter((row) => row.some((cell) => !cell.filled));
    const cleared = BOARD_HEIGHT - newBoard.length;
    const emptyRows = Array.from({ length: cleared }, () =>
      Array(BOARD_WIDTH).fill({ filled: false, color: "" })
    );
    return {
      board: [...emptyRows, ...newBoard],
      cleared,
    };
  };

  // 키 입력
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 기본 스크롤 방지
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
      setPosition((prev) => {
        const newPos = { ...prev };

        if (e.key === "ArrowLeft") newPos.x--;
        else if (e.key === "ArrowRight") newPos.x++;
        else if (e.key === "ArrowDown") newPos.y++;

        if (!isCollision(newPos.x, newPos.y)) return newPos;
        return prev;
      });

      // 회전 키
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
      } else if (e.code === "Space") {
        e.preventDefault(); // 스페이스바 스크롤 방지

        let dropY = position.y;
        while (!isCollision(position.x, dropY + 1)) {
          dropY++;
        }

        const newFixed = fixedBoard.map((row) => [...row]);

        block.shape.forEach((row, dy) =>
          row.forEach((cell, dx) => {
            if (cell) {
              const y = dropY + dy;
              const x = position.x + dx;
              if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                newFixed[y][x] = { filled: true, color: block.color };
              }
            }
          })
        );

        // 줄 삭제 + 점수
        const { board: clearedBoard, cleared } = clearFullRows(newFixed);
        setFixedBoard(clearedBoard);

        setScore((prev) => {
          const newScore = prev + cleared * 100;
          const newLevel = Math.floor(newScore / 1000) + 1;

          if (newLevel !== level) {
            setLevel(newLevel);
            const newSpeed = Math.max(100, 500 - (newLevel - 1) * 50);
            setDropInterval(newSpeed);
          }

          return newScore;
        });

        // 새 블록 생성
        const nextBlock =
          TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
        const nextPosition = { x: 3, y: 0 };

        const isBlocked = nextBlock.shape.some((row, dy) =>
          row.some((cell, dx) => {
            if (!cell) return false;
            const y = nextPosition.y + dy;
            const x = nextPosition.x + dx;
            return (
              y >= BOARD_HEIGHT ||
              x < 0 ||
              x >= BOARD_WIDTH ||
              (y >= 0 && clearedBoard[y][x].filled)
            );
          })
        );

        if (isBlocked) {
          setIsGameOver(true);
        } else {
          setBlock(nextBlock);
          setPosition(nextPosition);
        }
      }
    },
    [block, position, fixedBoard]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // 블록 하강 작동
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      const nextY = position.y + 1;

      if (!isCollision(position.x, nextY)) {
        setPosition((prev) => ({ ...prev, y: nextY }));
      } else {
        const newFixed = fixedBoard.map((row) => [...row]);
        block.shape.forEach((row, dy) =>
          row.forEach((cell, dx) => {
            if (cell) {
              const y = position.y + dy;
              const x = position.x + dx;
              if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                newFixed[y][x] = { filled: true, color: block.color };
              }
            }
          })
        );

        const { board: clearedBoard, cleared } = clearFullRows(newFixed);
        setFixedBoard(clearedBoard);

        setScore((prev) => {
          const newScore = prev + cleared * 100;
          const newLevel = Math.floor(newScore / 1000) + 1;

          if (newLevel !== level) {
            setLevel(newLevel);
            const newSpeed = Math.max(100, 500 - (newLevel - 1) * 50);
            setDropInterval(newSpeed);
          }

          return newScore;
        });

        const nextBlock =
          TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
        const nextPosition = { x: 3, y: 0 };

        const isBlocked = nextBlock.shape.some((row, dy) =>
          row.some((cell, dx) => {
            if (!cell) return false;
            const y = nextPosition.y + dy;
            const x = nextPosition.x + dx;
            return (
              y >= BOARD_HEIGHT ||
              x < 0 ||
              x >= BOARD_WIDTH ||
              (y >= 0 && clearedBoard[y][x].filled)
            );
          })
        );

        if (isBlocked) {
          setIsGameOver(true);
          clearInterval(interval);
        } else {
          setBlock(nextBlock);
          setPosition(nextPosition);
        }
      }
    }, dropInterval); // 여기도 반영해야 함!

    return () => clearInterval(interval);
  }, [position, block, fixedBoard, isGameOver, dropInterval, level]); // ✅ level도 의존성에 추가

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
    <div className="relative h-dvh w-full overflow-hidden bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-6">
      {/* 헤더 */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          🧱 TETRIS
        </h1>
        <h2 className="text-base sm:text-lg">Level: {level}</h2>
        <h2 className="text-base sm:text-lg font-semibold" translate="no">
          Score: {score}
        </h2>
      </div>

      {/* 게임 보드 (반응형) */}
      <div
        className="grid w-full max-w-[min(90vw,400px)]"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}`,
          gap: "1px",
          backgroundColor: "#333",
        }}
      >
        {mergedBoard.flat().map((cell, i) => (
          <div
            key={i}
            className={`border border-gray-700 ${
              cell.filled ? cell.color : "bg-gray-800"
            }`}
          />
        ))}
      </div>
      {/* 가상 버튼: 게임판 아래 */}
      {isMobile && !isGameOver && (
        <MobileControls
          moveLeft={moveLeft}
          moveRight={moveRight}
          rotateBlock={rotateBlock}
          dropOne={dropOne}
          hardDrop={hardDrop}
        />
      )}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center z-50 p-4">
          <h2 className="text-2xl sm:text-4xl text-red-500 font-bold mb-4">
            💀 GAME OVER
          </h2>
          <button
            className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200"
            onClick={() => {
              setFixedBoard(createEmptyBoard());
              setPosition({ x: 3, y: 0 });
              setBlock(
                TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)]
              );
              setIsGameOver(false);
              setScore(0);
            }}
          >
            다시 시작
          </button>
        </div>
      )}
    </div>
  );
}
