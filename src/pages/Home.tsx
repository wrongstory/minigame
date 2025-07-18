import { Link } from "react-router-dom";

const games = [
  {
    name: "Tetris",
    path: "tetris",
    image: "https://via.placeholder.com/300x450.png?text=TETRIS",
  },
  {
    name: "Snake",
    path: "snake",
    image: "https://via.placeholder.com/300x450.png?text=SNAKE",
  },
  {
    name: "2048",
    path: "game2048",
    image: "https://via.placeholder.com/300x450.png?text=2048",
  },
  {
    name: "Memory",
    path: "memory",
    image: "https://via.placeholder.com/300x450.png?text=MEMORY",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl font-bold mb-12">🎬 Mini Game Showcase</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {games.map((game) => (
          <Link
            key={game.path}
            to={`/game/${game.path}`}
            className="relative group overflow-hidden rounded-xl shadow-xl transform transition duration-300 hover:scale-105"
          >
            <img
              src={game.image}
              alt={`${game.name} Poster`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <h2 className="text-xl font-bold text-white mb-4">{game.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
