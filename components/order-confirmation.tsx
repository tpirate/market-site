"use client"

import { useEffect } from "react"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCart } from "./cart-context"

export default function OrderConfirmation() {
  const { clearCart } = useCart()

  // Sayfa yüklendiğinde sepeti temizle
  useEffect(() => {
    clearCart()
  }, []) // Empty dependency array ensures this runs only once when component mounts

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Siparişiniz Alındı!</h1>
          <p className="text-gray-600">
            Siparişiniz başarıyla oluşturuldu. Sipariş detaylarınız e-posta adresinize gönderildi.
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-[#e6f9fb] rounded-full flex items-center justify-center mr-3">
              <Package className="text-[#36cfe3]" size={20} />
            </div>
            <div>
              <h3 className="font-medium">Sipariş Durumu</h3>
              <p className="text-sm text-gray-600">Siparişiniz hazırlanıyor</p>
            </div>
          </div>

          <div className="relative pt-4">
            <div className="flex mb-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
                <CheckCircle className="text-white" size={14} />
              </div>
              <div className="ml-3">
                <p className="font-medium">Sipariş Alındı</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="absolute top-4 left-3 w-0.5 h-12 bg-gray-200"></div>
            <div className="flex mb-2 mt-6">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center z-10">
                <span className="text-gray-500 text-xs">2</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-600">Hazırlanıyor</p>
              </div>
            </div>
            <div className="absolute top-16 left-3 w-0.5 h-12 bg-gray-200"></div>
            <div className="flex mt-6">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center z-10">
                <span className="text-gray-500 text-xs">3</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-600">Kargoya Verildi</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Siparişinizle ilgili sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.
          </p>
          <Link
            href="/"
            className="inline-flex items-center bg-[#36cfe3] hover:bg-[#2bb8cc] text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Alışverişe Devam Et
            <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
