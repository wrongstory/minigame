import { useParams } from "react-router-dom";
import Tetris from "../games/tetris/Tetris";
// import Snake from "../games/snake/Snake";

export default function GamePage() {
  const { name } = useParams();

  switch (name) {
    case "tetris":
      return <Tetris />;
    // case "snake":
    //   return <Snake />;
    default:
      return <div>게임을 찾을 수 없습니다.</div>;
  }
}
