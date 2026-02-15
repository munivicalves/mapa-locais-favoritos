import { useState } from "react";
import MapView from "./components/MapView";
import FavoritesList from "./components/FavoritesList";
export default function App() {
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-semibold">Mapa de Locais Favoritos</h1>
      </header>
      <main className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Meus locais salvos</h2>
        <FavoritesList onSelect={setSelectedFavorite} />
        <MapView selectedFavorite={selectedFavorite} />
      </main>
    </div>
  );
}
