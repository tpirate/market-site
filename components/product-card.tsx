"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "./cart-context"

interface ProductCardProps {
  id: string
  name: string
  description: string
  originalPrice: number
  discountedPrice: number
  image: string
  discountPercentage?: number
}

export default function ProductCard({
  id,
  name,
  description,
  originalPrice,
  discountedPrice,
  image,
  discountPercentage,
}: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price: discountedPrice,
      quantity: 1,
      image: image,
    })
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      {/* Badge and Image Container */}
      <div className="relative">
        {/* Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Image
            src="https://cdn2.a101.com.tr/dbmk89vnr/CALL/Image/getw/files/665969109a216f00085028a0/web.png?width=300"
            alt="Aldin Aldin Badge"
            width={80}
            height={24}
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Discount Badge */}
        {discountPercentage && (
          <div className="absolute bottom-2 right-2 z-10 bg-red-600 text-white font-bold px-2 py-1 rounded-md">
            %{discountPercentage} İNDİRİM
          </div>
        )}

        {/* Product Image with Link */}
        <Link href={`/urun/${id}`} className="block relative h-48 w-full bg-white p-4">
          <Image src={image || "/placeholder.svg"} alt={name} fill style={{ objectFit: "contain" }} />
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <Link href={`/urun/${id}`} className="block hover:text-[#36cfe3] transition-colors">
          <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10 text-gray-800">{name}</h3>
        </Link>
        <p className="text-gray-600 text-xs mb-4 line-clamp-2 h-8">{description}</p>
        <div className="mt-auto">
          <p className="text-gray-500 line-through text-sm mb-1">₺{originalPrice.toLocaleString("tr-TR")}</p>
          <p className="text-red-600 font-bold text-xl mb-3">₺{discountedPrice.toLocaleString("tr-TR")}</p>
          <button
            className="w-full bg-[#36cfe3] hover:bg-[#2bb8cc] text-white py-2 rounded-md transition-colors"
            onClick={handleAddToCart}
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  )
}
