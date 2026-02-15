import { createContext, useContext, useEffect, useState } from 'react'
  const FavoritesContext = createContext()

  export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem('favorites')

    return saved ? JSON.parse(saved) : []
    })
  function addFavorite(local) {
    setFavorites(prev => [...prev, local])
    }
  function removeFavorite(id) {
    setFavorites(prev => prev.filter(local => local.id !== id))
    }
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
    }, [favorites])

  return (
    <FavoritesContext.Provider
    value={{ favorites, addFavorite, removeFavorite }}>
    {children}
    </FavoritesContext.Provider>
    )
  }
  export function useFavorites() {
  return useContext(FavoritesContext)
}