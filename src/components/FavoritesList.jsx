import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesList({ onSelect }) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-gray-500 italic">Nenhum local salvo ainda.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {favorites.map((local) => (
        <li
          key={local.id}
          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl transition-colors group"
        >
          <button
            onClick={() => onSelect(local)}
            className="text-left flex-1"
          >
            <strong className="text-gray-800 group-hover:text-blue-600 transition-colors">
              {local.name}
            </strong>
            <br />
            <span className="text-xs font-mono text-gray-500">
              {local.lat.toFixed(4)}, {local.lng.toFixed(4)}
            </span>
          </button>

          <button
            onClick={() => {
              const confirmed = window.confirm(`Deseja realmente excluir "${local.name}"?`);
              if (confirmed) {
                removeFavorite(local.id);
              }
            }}
            className="ml-3 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Excluir"
          >
            🗑️
          </button>
        </li>
      ))}
    </ul>
  );
}