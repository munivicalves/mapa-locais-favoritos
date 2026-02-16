export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  localName,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="
        relative z-10
        w-full max-w-sm
        bg-white rounded-2xl
        p-6 shadow-xl
        space-y-4
      "
      >
        <h3 className="text-lg font-semibold text-gray-800">Remover local?</h3>

        <p className="text-sm text-gray-600">
          Tem certeza que deseja remover o local
          <span className="font-semibold"> {localName}</span>?
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="
              px-4 py-2 text-sm
              rounded-lg
              border border-gray-300
              hover:bg-gray-100
            "
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 text-sm
              rounded-lg
              bg-red-600 text-white
              hover:bg-red-700
            "
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
