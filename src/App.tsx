import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:name" element={<GamePage />} />
    </Routes>
  );
}

export default App;
