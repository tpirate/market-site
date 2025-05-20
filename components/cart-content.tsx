"use client"

import { useCart } from "./cart-context"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CartContent() {
  const { items, removeItem, addItem, getTotalPrice } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(items.map((item) => [item.id, item.quantity])),
  )

  // Sepet boşsa
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Sepetiniz Boş</h2>
          <p className="text-gray-500 mb-6">Sepetinizde henüz ürün bulunmamaktadır.</p>
          <Link
            href="/"
            className="inline-block bg-[#36cfe3] hover:bg-[#2bb8cc] text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>
    )
  }

  // Ürün miktarını güncelle
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    // Mevcut ürünü bul
    const item = items.find((item) => item.id === id)
    if (!item) return

    // Miktarı güncelle
    setQuantities((prev) => ({ ...prev, [id]: newQuantity }))

    // Sepeti güncelle
    removeItem(id)
    addItem({ ...item, quantity: newQuantity })
  }

  // Ürünü sepetten kaldır
  const handleRemoveItem = (id: string) => {
    removeItem(id)
    setQuantities((prev) => {
      const newQuantities = { ...prev }
      delete newQuantities[id]
      return newQuantities
    })
  }

  // Toplam fiyat
  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice >= 500 ? 0 : 29.99
  const totalWithShipping = totalPrice + shippingCost

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sepetim</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sepet Ürünleri */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium">Sepetteki Ürünler ({items.length})</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row">
                  {/* Ürün Resmi Placeholder */}
                  <div className="sm:w-24 h-24 bg-gray-50 rounded-md flex items-center justify-center mb-4 sm:mb-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  {/* Ürün Bilgileri */}
                  <div className="sm:ml-4 flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-[#36cfe3] font-bold mb-4">₺{item.price.toLocaleString("tr-TR")}</p>

                    <div className="flex justify-between items-center">
                      {/* Miktar Kontrolü */}
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, quantities[item.id] - 1)}
                          className="px-3 py-1 text-gray-500 hover:text-gray-700"
                          disabled={quantities[item.id] <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1 border-x border-gray-200 min-w-[40px] text-center">
                          {quantities[item.id]}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, quantities[item.id] + 1)}
                          className="px-3 py-1 text-gray-500 hover:text-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Kaldır Butonu */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        <span>Kaldır</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sipariş Özeti */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-medium mb-4">Sipariş Özeti</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Ara Toplam</span>
                <span>₺{totalPrice.toLocaleString("tr-TR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kargo</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600">Ücretsiz</span>
                  ) : (
                    `₺${shippingCost.toLocaleString("tr-TR")}`
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <div className="text-xs text-gray-500 italic">
                  500 TL ve üzeri alışverişlerde kargo ücretsizdir. Ücretsiz kargo için{" "}
                  <span className="font-medium">₺{(500 - totalPrice).toLocaleString("tr-TR")}</span> daha
                  harcayabilirsiniz.
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between font-bold">
                <span>Toplam</span>
                <span className="text-[#36cfe3]">₺{totalWithShipping.toLocaleString("tr-TR")}</span>
              </div>
            </div>

            <Link
              href="/adres"
              className="w-full block text-center bg-[#36cfe3] hover:bg-[#2bb8cc] text-white font-medium py-3 rounded-md transition-colors"
            >
              Devam Et
            </Link>

            <Link href="/" className="w-full block text-center mt-3 text-gray-600 hover:text-gray-800 font-medium py-2">
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
