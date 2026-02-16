import { useState, useEffect } from "react";

export default function ConfirmSaveModal({
  open,
  address,
  onClose,
  onConfirm,
}) {
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setName("");
    }
  }, [open]);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 200);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={handleClose}
        className={`
          absolute inset-0 bg-black/40
          transition-opacity duration-200
          ${visible ? "opacity-100" : "opacity-0"}
        `}
      />

      <div
        className={`
          relative w-full max-w-md bg-white rounded-xl shadow-lg p-6
          transform transition-all duration-200
          ${
            visible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }
        `}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-2">Salvar local</h2>

        <p className="text-sm text-gray-500 mb-4">{address}</p>

        <input
          type="text"
          placeholder="Nome do local (ex: Casa, Trabalho)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full px-3 py-2 mb-4
            border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          autoFocus
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="
              px-4 py-2 text-sm
              bg-gray-100 rounded-lg
              hover:bg-gray-200
            "
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              if (!name.trim()) return;
              onConfirm(name);
              handleClose();
            }}
            className="
              px-4 py-2 text-sm font-medium
              bg-blue-600 text-white rounded-lg
              hover:bg-blue-700
            "
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
