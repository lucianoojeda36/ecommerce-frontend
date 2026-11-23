import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { readFavoritesCache, useFavorites, useFavoriteProducts, useToggleFavorite } from '../api/hooks'
import type { Product } from '../types'

interface FavoritesContextValue {
  ids: string[]
  items: Product[]
  count: number
  isFavorite: (id: string) => boolean
  toggle: (product: Product) => void
  isLoading: boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: ids = [], isLoading } = useFavorites()
  const toggleMutation = useToggleFavorite()
  const [cache, setCache] = useState<Record<string, Product>>(() => readFavoritesCache())

  const missingIds = useMemo(() => ids.filter(id => !cache[id]), [ids, cache])
  const resolved = useFavoriteProducts(missingIds)
  const resolvedMap = useMemo(() => {
    const map = new Map<string, Product>()
    missingIds.forEach((id, index) => {
      const product = resolved[index]?.data
      if (product) map.set(id, product)
    })
    return map
  }, [missingIds, resolved])

  const items = useMemo(
    () => ids.map(id => cache[id] || resolvedMap.get(id)).filter((product): product is Product => !!product),
    [ids, cache, resolvedMap],
  )

  const toggle = (product: Product) => {
    const favorite = !ids.includes(product.id)
    setCache((previous) => {
      const next = { ...previous }
      if (favorite) next[product.id] = product
      else delete next[product.id]
      return next
    })
    toggleMutation.mutate({ product, favorite })
  }

  const value: FavoritesContextValue = {
    ids,
    items,
    count: ids.length,
    isFavorite: (id) => ids.includes(id),
    toggle,
    isLoading: isLoading && ids.length === 0,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavoritesContext debe usarse dentro de FavoritesProvider')
  return context
}
