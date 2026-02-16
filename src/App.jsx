import FavoritesList from "./components/FavoritesList";
import MapView from "./components/MapView";
import { useState } from "react";

export default function App() {
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-800 text-center">
          Mapa de Locais Favoritos
        </h1>

        <MapView selectedFavorite={selectedFavorite} />

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Meus locais salvos
          </h2>

          <FavoritesList onSelect={setSelectedFavorite} />
        </section>
      </div>
    </div>
  );
}
