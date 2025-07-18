import { Link } from "react-router-dom";

const games = ["tetris", "snake"];

export default function Home() {
  return (
    <div className="grid gap-4 p-8">
      <h1 className="text-2xl font-bold">🎮 Mini Games</h1>
      {games.map((game) => (
        <Link
          key={game}
          to={`/game/${game}`}
          className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {game.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
