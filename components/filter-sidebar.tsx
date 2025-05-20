"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FilterSection {
  title: string
  options: { id: string; label: string }[]
}

interface FilterSidebarProps {
  categories: FilterSection
  brands: FilterSection
  onFilterChange: (type: string, id: string, checked: boolean) => void
  selectedFilters: {
    categories: string[]
    brands: string[]
  }
}

export default function FilterSidebar({ categories, brands, onFilterChange, selectedFilters }: FilterSidebarProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [isBrandOpen, setIsBrandOpen] = useState(true)

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h2 className="text-lg font-bold mb-4">Filtreler</h2>

      {/* Categories Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <h3 className="text-base font-medium">Kategoriler</h3>
          {isCategoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {isCategoryOpen && (
          <div className="space-y-2">
            {categories.options.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  className="w-4 h-4 border-gray-300 rounded"
                  checked={selectedFilters.categories.includes(category.id)}
                  onChange={(e) => onFilterChange("categories", category.id, e.target.checked)}
                />
                <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 my-3"></div>

      {/* Brands Section */}
      <div className="mb-4">
        <div
          className="flex justify-between items-center cursor-pointer mb-3"
          onClick={() => setIsBrandOpen(!isBrandOpen)}
        >
          <h3 className="text-base font-medium">Marka</h3>
          {isBrandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {isBrandOpen && (
          <div className="space-y-2">
            {brands.options.map((brand) => (
              <div key={brand.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  className="w-4 h-4 border-gray-300 rounded"
                  checked={selectedFilters.brands.includes(brand.id)}
                  onChange={(e) => onFilterChange("brands", brand.id, e.target.checked)}
                />
                <label htmlFor={`brand-${brand.id}`} className="ml-2 text-sm text-gray-700">
                  {brand.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
