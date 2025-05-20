"use client"

import type React from "react"

import { Search, ShoppingCart, X } from "lucide-react"
import { useCart } from "./cart-context"
import { useSearch } from "./search-context"
import Link from "next/link"
import { useState, useCallback } from "react"

export default function SearchBar() {
  const { getTotalItems, getTotalPrice } = useCart()
  const { searchTerm, setSearchTerm, setIsSearching } = useSearch()
  const [inputValue, setInputValue] = useState(searchTerm)

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const hasItems = totalItems > 0

  // Debounce fonksiyonu
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  // Debounce ile arama terimini güncelleme
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
      setIsSearching(!!term)
    }, 300),
    [setSearchTerm, setIsSearching],
  )

  // Input değiştiğinde
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  // Temizle butonuna tıklandığında
  const clearSearch = () => {
    setInputValue("")
    setSearchTerm("")
    setIsSearching(false)
  }

  return (
    <div className="w-full border-b border-gray-200 py-3 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="Aramak istediğin ürünü yaz..."
              className="w-full pl-12 pr-12 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] text-gray-500 placeholder-gray-400"
            />
            {inputValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <Link
            href="/sepet"
            className={`flex items-center rounded-full ${hasItems ? "bg-[#36cfe3] text-white" : "bg-gray-200 text-gray-500"} transition-colors`}
          >
            <div className="relative flex items-center justify-center h-12 w-12 rounded-full">
              <ShoppingCart size={20} />
              {hasItems && (
                <span className="absolute -top-1 -right-1 bg-white text-[#36cfe3] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>

            {hasItems && (
              <div className="pr-5 pl-1">
                <span className="font-bold">
                  ₺{totalPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
