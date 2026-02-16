import { useState, useEffect } from "react";

export default function RenameFavoriteModal({
  open,
  favorite,
  onClose,
  onConfirm,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (favorite) {
      setName(favorite.name);
    }
  }, [favorite]);

  if (!open || !favorite) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 animate-scale-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Renomear favorito
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full px-4 py-2
            border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          placeholder="Novo nome"
          autoFocus
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Cancelar
          </button>

          <button
            onClick={() => onConfirm(name)}
            disabled={!name.trim()}
            className="
              px-4 py-2 text-sm rounded-lg
              bg-blue-600 text-white
              hover:bg-blue-700 disabled:opacity-50
            "
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
