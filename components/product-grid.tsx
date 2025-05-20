"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import ProductCard from "./product-card"
import FilterSidebar from "./filter-sidebar"
import { useSearch } from "./search-context"
import { products } from "@/data/products"

type SortOption = "recommended" | "price-asc" | "price-desc" | "newest"

export default function ProductGrid() {
  const [sortOption, setSortOption] = useState<SortOption>("recommended")
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
  })
  const [isMobile, setIsMobile] = useState(false)
  const { searchTerm, isSearching } = useSearch()

  const categories = {
    title: "Kategoriler",
    options: [
      { id: "beyaz-esya-ankastre", label: "Beyaz Eşya & Ankastre" },
      { id: "telefon-aksesuar", label: "Telefon & Aksesuar" },
      { id: "bilgisayar-tablet", label: "Bilgisayar & Tablet" },
      { id: "tv-ses-sistemi", label: "Televizyon & Ses Sistemi" },
      { id: "elektrikli-ev-aletleri", label: "Elektrikli Ev Aletleri" },
      { id: "isitma-sogutma", label: "Isıtma ve Soğutma" },
      { id: "kisisel-bakim", label: "Kişisel Bakım" },
      { id: "giyim-ayakkabi", label: "Giyim & Ayakkabı" },
    ],
  }

  const brands = {
    title: "Marka",
    options: [
      { id: "arzum", label: "Arzum" },
      { id: "stanley", label: "Stanley" },
      { id: "karaca", label: "Karaca" },
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "xiaomi", label: "Xiaomi" },
      { id: "philips", label: "Philips" },
      { id: "dyson", label: "Dyson" },
      { id: "logitech", label: "Logitech" },
      { id: "nike", label: "Nike" },
      { id: "issey-miyake", label: "Issey Miyake" },
    ],
  }

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // İlk yükleme kontrolü
    checkIfMobile()

    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const handleFilterChange = (type: string, id: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      if (checked) {
        return {
          ...prev,
          [type]: [...prev[type as keyof typeof prev], id],
        }
      } else {
        return {
          ...prev,
          [type]: prev[type as keyof typeof prev].filter((item) => item !== id),
        }
      }
    })
  }

  const filteredAndSortedProducts = useMemo(() => {
    // First search
    let filtered = [...products]

    if (isSearching && searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower),
      )
    }

    // Then filter by categories and brands
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter((product) => selectedFilters.categories.includes(product.category))
    }

    if (selectedFilters.brands.length > 0) {
      filtered = filtered.filter((product) => selectedFilters.brands.includes(product.brand))
    }

    // Then sort
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice)
        break
      case "price-desc":
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      default:
        // "recommended" - default order
        break
    }

    return filtered
  }, [sortOption, selectedFilters, searchTerm, isSearching])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as SortOption)
  }

  const getTitle = () => {
    if (isSearching) {
      return `"${searchTerm}" için arama sonuçları (${filteredAndSortedProducts.length})`
    }
    return "Öne Çıkan Ürünler"
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-6">
      <div className="flex justify-between items-center mb-6 px-4 md:px-0">
        <h2 className="text-xl font-bold">{getTitle()}</h2>
        <div className="relative">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-[#36cfe3]"
          >
            <option value="recommended">Önerilen</option>
            <option value="price-asc">Fiyat (Artan)</option>
            <option value="price-desc">Fiyat (Azalan)</option>
            <option value="newest">En Yeniler</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Filter Sidebar - Hidden on mobile */}
        {!isMobile && (
          <div className="md:w-1/4 lg:w-1/5 pl-0">
            <FilterSidebar
              categories={categories}
              brands={brands}
              onFilterChange={handleFilterChange}
              selectedFilters={selectedFilters}
            />
          </div>
        )}

        {/* Product Grid */}
        <div className={`${isMobile ? "w-full px-4" : "md:w-3/4 lg:w-4/5"}`}>
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  originalPrice={product.originalPrice}
                  discountedPrice={product.discountedPrice}
                  discountPercentage={product.discountPercentage}
                  image={product.image}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-lg text-gray-600">
                {isSearching ? `"${searchTerm}" için sonuç bulunamadı.` : "Seçilen filtrelere uygun ürün bulunamadı."}
              </p>
              <button
                onClick={() => {
                  setSelectedFilters({ categories: [], brands: [] })
                }}
                className="mt-4 bg-[#36cfe3] text-white px-4 py-2 rounded-md hover:bg-[#2bb8cc]"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
