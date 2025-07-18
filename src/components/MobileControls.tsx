interface Props {
  moveLeft: () => void;
  moveRight: () => void;
  rotateBlock: () => void;
  dropOne: () => void;
  hardDrop: () => void;
}

export default function MobileControls({
  moveLeft,
  moveRight,
  rotateBlock,
  dropOne,
  hardDrop,
}: Props) {
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(30);
  };

  return (
    <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-xs">
      <button
        onClick={() => {
          vibrate();
          moveLeft();
        }}
        className="bg-white text-black py-2 rounded text-xl"
      >
        ◀️
      </button>
      <button
        onClick={() => {
          vibrate();
          rotateBlock();
        }}
        className="bg-white text-black py-2 rounded text-xl"
      >
        🔁
      </button>
      <button
        onClick={() => {
          vibrate();
          moveRight();
        }}
        className="bg-white text-black py-2 rounded text-xl"
      >
        ▶️
      </button>
      <button
        onClick={() => {
          vibrate();
          dropOne();
        }}
        className="col-span-3 bg-yellow-300 text-black py-2 rounded text-xl"
      >
        ⬇️
      </button>
      <button
        onClick={() => {
          vibrate();
          hardDrop();
        }}
        className="col-span-3 bg-red-500 text-white py-2 rounded text-xl"
      >
        ⏬ 하드드롭
      </button>
    </div>
  );
}
