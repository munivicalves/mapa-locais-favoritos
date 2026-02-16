import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useState, useEffect } from "react";
import { useFavorites } from "../context/FavoritesContext";
import ConfirmSaveModal from "./ConfirmSaveModal";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

/* Ícones */
const defaultIcon = new L.Icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl,
  shadowUrl,
  iconSize: [35, 55],
  iconAnchor: [17, 55],
});

const UBERLANDIA_POSITION = [-18.9186, -48.2772];

/* Clique no mapa */
function ClickHandler({ onSelect, onAddress }) {
  useMapEvents({
    async click(e) {
      onSelect(e.latlng);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`,
      );

      const data = await response.json();

      if (data?.address) {
        const rua = data.address.road || "";
        const numero = data.address.house_number || "";
        const bairro = data.address.suburb || data.address.neighbourhood || "";
        const cidade =
          data.address.city ||
          data.address.town ||
          data.address.municipality ||
          "";
        const pais = data.address.country || "";

        const linha1 = [rua, numero].filter(Boolean).join(", ");
        const linha2 = [bairro, cidade, pais].filter(Boolean).join(", ");

        onAddress([linha1, linha2].filter(Boolean).join(" - "));
      }
    },
  });

  return null;
}

/* Centralizar mapa */
function MapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);

  return null;
}

export default function MapView({ selectedFavorite }) {
  const { favorites, addFavorite } = useFavorites();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  /* Autocomplete com debounce */
  useEffect(() => {
    if (search.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          search,
        )}&limit=5`,
      );

      const data = await response.json();
      setSuggestions(data);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  function handleSelectSuggestion(item) {
    const coords = {
      lat: Number(item.lat),
      lng: Number(item.lon),
    };

    const formatted = formatInputValue(item);

    setSearch(formatted);
    setSelectedAddress(formatted);
    setSearchResult(coords);
    setSelectedPosition(coords);
    setSuggestions([]);
  }

  function handleSave(name) {
    if (!name || !selectedPosition) return;

    addFavorite({
      id: Date.now(),
      name,
      address: selectedAddress,
      lat: selectedPosition.lat,
      lng: selectedPosition.lng,
    });

    setSelectedPosition(null);
    setSelectedAddress("");
  }

  function extractHouseNumber(text) {
    const match = text.match(/\d+/);
    return match ? match[0] : null;
  }

  function formatSuggestion(item) {
    const address = item.address || {};

    const rua = address.road || "";
    const numeroApi = address.house_number;
    const numeroInput = extractHouseNumber(search);

    const numero = numeroApi || numeroInput || "";

    const bairro = address.suburb || address.neighbourhood || "";
    const cidade = address.city || address.town || address.municipality || "";
    const pais = address.country || "";

    return {
      title: [rua, numero].filter(Boolean).join(", "),
      subtitle: [bairro, cidade, pais].filter(Boolean).join(" · "),
    };
  }

  function formatInputValue(item) {
    const address = item.address || {};

    const rua = address.road || "";
    const numero = address.house_number || extractHouseNumber(search) || "";

    const bairro = address.suburb || address.neighbourhood || "";

    const cidade = address.city || address.town || address.municipality || "";

    const pais = address.country || "";

    const linha1 = [rua, numero].filter(Boolean).join(", ");
    const linha2 = [bairro, cidade, pais].filter(Boolean).join(", ");

    return [linha1, linha2].filter(Boolean).join(" - ");
  }

  return (
    <div className="w-full space-y-4">
      {/* BUSCA */}
      <div className="relative z-40 max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Buscar endereço ou local..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full px-5 py-3
            rounded-full
            border border-gray-200
            shadow-sm
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
            placeholder-gray-400
          "
          autoComplete="off"
        />

        {Array.isArray(suggestions) && suggestions.length > 0 && (
          <ul
            className="
              absolute mt-2 w-full
              bg-white
              border border-gray-200
              rounded-xl
              shadow-xl
              max-h-60 overflow-auto
              z-50
            "
          >
            {suggestions.map((item) => {
              const formatted = formatSuggestion(item);

              return (
                <li
                  key={item.place_id}
                  onClick={() => handleSelectSuggestion(item)}
                  className="px-5 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="text-sm font-medium text-gray-800">
                    {formatted.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatted.subtitle}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* MAPA */}
      <div className="flex justify-center">
        <div
          className="w-full max-w-3xl h-[320px]
          rounded-2xl
          overflow-hidden
          shadow-xl
          border border-gray-100
          bg-white"
        >
          <MapContainer
            center={UBERLANDIA_POSITION}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <ClickHandler
              onSelect={setSelectedPosition}
              onAddress={setSelectedAddress}
            />

            {searchResult && (
              <MapCenter position={[searchResult.lat, searchResult.lng]} />
            )}

            {selectedFavorite && (
              <MapCenter
                position={[selectedFavorite.lat, selectedFavorite.lng]}
              />
            )}

            {/* Marker temporário */}
            {selectedPosition && <Marker position={selectedPosition} />}

            {/* Favoritos */}
            {favorites.map((local) => {
              const isSelected =
                selectedFavorite && local.id === selectedFavorite.id;

              return (
                <Marker
                  key={local.id}
                  position={[local.lat, local.lng]}
                  icon={isSelected ? selectedIcon : defaultIcon}
                />
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* CARD DE SALVAR */}
      {selectedPosition && (
        <div className="flex justify-center">
          <div className="w-full max-w-3xl p-5 bg-white rounded-2xl shadow-lg border space-y-3">
            <div className="text-sm text-gray-600">
              <p>
                <strong>Latitude:</strong> {selectedPosition.lat.toFixed(6)}
              </p>
              <p>
                <strong>Longitude:</strong> {selectedPosition.lng.toFixed(6)}
              </p>
            </div>

            <button
              onClick={() => setShowSaveModal(true)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Salvar local
            </button>
          </div>
        </div>
      )}

      <ConfirmSaveModal
        open={showSaveModal}
        address={search}
        onClose={() => setShowSaveModal(false)}
        onConfirm={(name) => {
          handleSave(name);
          setShowSaveModal(false);
        }}
      />
    </div>
  );
}
