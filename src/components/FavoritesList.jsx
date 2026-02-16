import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import RenameFavoriteModal from "./RenameFavoriteModal";

export default function FavoritesList({ onSelect }) {
  const { favorites, removeFavorite, renameFavorite } = useFavorites();
  const [showModal, setShowModal] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [editingFavorite, setEditingFavorite] = useState(null);

  if (favorites.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center">
        Nenhum local salvo ainda
      </p>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {favorites.map((local) => (
          <div
            key={local.id}
            className="
              p-4 bg-white rounded-xl
              shadow border
              hover:shadow-md transition
              flex flex-col gap-3
              md:flex-row md:items-center md:justify-between
            "
          >
            <div
              className="flex-1 cursor-pointer space-y-1"
              onClick={() => onSelect(local)}
            >
              <p className="text-lg font-bold text-gray-800">{local.name}</p>

              <p className="text-sm text-gray-500 break-words">
                {local.address}
              </p>

              <p className="text-xs text-gray-400">
                {local.lat.toFixed(5)}, {local.lng.toFixed(5)}
              </p>
            </div>

            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <button
                onClick={() => onSelect(local)}
                className="
                  px-4 py-2 text-sm
                  bg-blue-100 text-blue-700
                  rounded-lg hover:bg-blue-200
                  transition
                "
              >
                Ver
              </button>

              <button
                onClick={() => setEditingFavorite(local)}
                className="
                  px-4 py-2 text-sm
                  bg-gray-100 text-gray-700
                  rounded-lg hover:bg-gray-200
                  transition
                "
              >
                Renomear
              </button>

              <button
                onClick={() => {
                  setSelectedLocal(local);
                  setShowModal(true);
                }}
                className="
                  px-4 py-2 text-sm
                  bg-red-100 text-red-700
                  rounded-lg hover:bg-red-200
                  transition
                "
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDeleteModal
        open={showModal}
        localName={selectedLocal?.name}
        onClose={() => {
          setShowModal(false);
          setSelectedLocal(null);
        }}
        onConfirm={() => {
          removeFavorite(selectedLocal.id);
          setShowModal(false);
          setSelectedLocal(null);
        }}
      />

      <RenameFavoriteModal
        open={!!editingFavorite}
        favorite={editingFavorite}
        onClose={() => setEditingFavorite(null)}
        onConfirm={(newName) => {
          renameFavorite(editingFavorite.id, newName);
          setEditingFavorite(null);
        }}
      />
    </>
  );
}
