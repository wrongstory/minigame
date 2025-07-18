import { Link } from "react-router-dom";

const games = [
  { name: "Tetris", path: "tetris" },
  { name: "Snake", path: "snake" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-300 to-blue-200 flex flex-col items-center justify-center px-4">
      <h1 className="text-5xl font-extrabold text-white mb-10 drop-shadow-lg">
        🎮 Mini Game World
      </h1>
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        {games.map((game) => (
          <Link
            key={game.path}
            to={`/game/${game.path}`}
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition transform text-center text-lg font-semibold"
          >
            {game.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
