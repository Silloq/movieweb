// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Player from "./pages/Playe";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:imdbId" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}
