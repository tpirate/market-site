"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Share2, Minus, Plus } from "lucide-react"
import { useCart } from "./cart-context"

// Ürün tipi
interface Product {
  id: string
  name: string
  description: string
  originalPrice: number
  discountedPrice: number
  discountPercentage: number
  image: string
  images?: string[]
  date: string
  category: string
  brand: string
  features?: string[]
  colors?: { id: string; name: string; image?: string }[]
  stock?: number
  code?: string
  exclusive?: string
  installment?: string
}

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  // Kategori yolunu oluştur
  const getCategoryPath = () => {
    switch (product.category) {
      case "elektrikli-ev-aletleri":
        return { path: "elektrikli-ev-aletleri", name: "Elektrikli Ev Aletleri" }
      case "kisisel-bakim":
        return { path: "kisisel-bakim", name: "Kişisel Bakım" }
      case "telefon-aksesuar":
        return { path: "telefon-aksesuar", name: "Telefon & Aksesuar" }
      case "bilgisayar-tablet":
        return { path: "bilgisayar-tablet", name: "Bilgisayar & Tablet" }
      case "tv-ses-sistemi":
        return { path: "tv-ses-sistemi", name: "TV & Ses Sistemi" }
      case "giyim-ayakkabi":
        return { path: "giyim-ayakkabi", name: "Giyim & Ayakkabı" }
      default:
        return { path: "elektronik", name: "Elektronik" }
    }
  }

  // Marka adını formatla
  const formatBrandName = (brand: string) => {
    return brand
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Miktar artır/azalt
  const increaseQuantity = () => {
    if (quantity < (product.stock || 10)) {
      setQuantity(quantity + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Sepete ekle
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountedPrice,
      quantity: quantity,
      image: product.image,
    })
  }

  // Ürün özellikleri
  const features = product.features || [
    "Tek seferde 1-2 fincan Türk kahvesi pişirme kapasitesi",
    "Otomatik pişirme teknolojisi",
    "Taşma önleyici sistem",
    "Sesli uyarı sistemi",
    "Kolay temizlenebilir",
  ]

  // Ürün görselleri
  const productImages = product.images || [product.image]

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="flex text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#36cfe3]">
          Ana Sayfa
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/elektronik" className="hover:text-[#36cfe3]">
          Elektronik
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href={`/${getCategoryPath().path}`} className="hover:text-[#36cfe3]">
          {getCategoryPath().name}
        </Link>
        {product.category === "elektrikli-ev-aletleri" && product.name.toLowerCase().includes("süpürge") && (
          <>
            <span className="mx-2">&gt;</span>
            <Link href="/elektrikli-ev-aletleri/elektrikli-supurge" className="hover:text-[#36cfe3]">
              Elektrikli Süpürge
            </Link>
          </>
        )}
        <span className="mx-2">&gt;</span>
        <span className="text-gray-700 truncate max-w-[200px]">{product.name.split(" ").slice(0, 3).join(" ")}</span>
      </nav>

      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol Taraf - Ürün Görseli */}
          <div className="md:w-1/2">
            <div className="relative h-[300px] md:h-[400px] w-full bg-white rounded-lg border border-gray-100">
              <Image
                src={productImages[activeImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                priority
                style={{ objectFit: "contain" }}
                className="p-4"
              />

              {/* Özel etiket */}
              {product.exclusive && (
                <div className="absolute top-2 left-2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                  {product.exclusive}
                </div>
              )}

              {/* Taksit etiketi */}
              {product.installment && (
                <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.installment}
                </div>
              )}
            </div>

            {/* Küçük Görsel Galerisi */}
            {productImages.length > 1 && (
              <div className="flex justify-center mt-4 gap-2 overflow-x-auto">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    className={`w-16 h-16 border rounded-md p-1 relative ${
                      activeImage === index ? "border-[#36cfe3]" : "border-gray-200"
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} - Görsel ${index + 1}`}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Taraf - Ürün Bilgileri */}
          <div className="md:w-1/2">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">Ürün Kodu: {product.code}</p>

            {/* Fiyat Bilgisi */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                  ₺
                  {product.discountedPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                    %{product.discountPercentage} İndirim
                  </span>
                )}
              </div>
              {product.discountPercentage > 0 && (
                <p className="text-gray-500 line-through text-sm mt-1">
                  ₺
                  {product.originalPrice.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              )}
            </div>

            {/* Marka */}
            <div className="mb-4">
              <span className="text-gray-600">Marka: </span>
              <Link href={`/marka/${product.brand}`} className="text-[#36cfe3] hover:underline">
                {formatBrandName(product.brand)}
              </Link>
            </div>

            {/* Miktar Seçimi */}
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Adet</p>
              <div className="flex items-center border border-gray-200 rounded-md w-32">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 py-2 border-x border-gray-200 min-w-[40px] text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700"
                  disabled={quantity >= (product.stock || 10)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Sepete Ekle ve Favorilere Ekle Butonları */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#36cfe3] hover:bg-[#2bb8cc] text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Sepete Ekle
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-medium py-3 px-4 rounded-md transition-colors">
                <Heart size={18} />
                <span className="hidden sm:inline">Favorilere Ekle</span>
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-medium py-3 px-4 rounded-md transition-colors">
                <Share2 size={18} />
                <span className="hidden sm:inline">Paylaş</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ürün Açıklaması ve Özellikleri */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Ürün Açıklaması</h2>
        <p className="text-gray-700 mb-6">{product.description}</p>

        <h3 className="text-lg font-bold mb-3">Ürün Özellikleri</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
