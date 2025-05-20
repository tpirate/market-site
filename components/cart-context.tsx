"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string // Add the image property
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  lastAddedProduct: string | null
  setLastAddedProduct: (name: string | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Tarayıcı ortamında olup olmadığını kontrol et
    if (typeof window !== "undefined") {
      // localStorage'dan sepet öğelerini al
      const savedCart = localStorage.getItem("cart")
      return savedCart ? JSON.parse(savedCart) : []
    }
    return []
  })
  const [lastAddedProduct, setLastAddedProduct] = useState<string | null>(null)

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      const newItems = existingItem
        ? prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
        : [...prevItems, item]

      // Sepet güncellendiğinde localStorage'a kaydet
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newItems))
      }

      return newItems
    })
    setLastAddedProduct(item.name)
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== id)

      // Sepet güncellendiğinde localStorage'a kaydet
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(newItems))
      }

      return newItems
    })
  }

  const clearCart = () => {
    setItems([])

    // Sepet temizlendiğinde localStorage'ı da temizle
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
    }
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        getTotalItems,
        getTotalPrice,
        lastAddedProduct,
        setLastAddedProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
