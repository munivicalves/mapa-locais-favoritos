import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  function addFavorite(favorite) {
    setFavorites((prev) => [...prev, favorite]);
  }

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  }

  function renameFavorite(id, newName) {
    setFavorites((prev) =>
      prev.map((fav) => (fav.id === id ? { ...fav, name: newName } : fav)),
    );
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        renameFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
