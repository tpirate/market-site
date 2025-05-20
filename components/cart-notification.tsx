"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import Link from "next/link"

interface CartNotificationProps {
  isOpen: boolean
  onClose: () => void
  productName: string
}

export default function CartNotification({ isOpen, onClose, productName }: CartNotificationProps) {
  // Popup'ı kapatmak için zamanlayıcı
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // 5 saniye sonra otomatik kapanır

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 top-4 flex justify-center items-start z-50 px-4 pointer-events-none">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 w-full max-w-md pointer-events-auto">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-[#36cfe3]">
              <CheckCircle size={24} />
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">Ürün sepete eklendi</p>
              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{productName}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Kapat</span>
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 p-4 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50 focus:outline-none"
          >
            Alışverişe Devam Et
          </button>
          <Link
            href="/sepet"
            className="flex-1 bg-[#36cfe3] text-white rounded-md py-2 px-4 text-sm font-medium text-center hover:bg-[#2bb8cc] focus:outline-none"
            onClick={onClose}
          >
            Sepete Git
          </Link>
        </div>
      </div>
    </div>
  )
}
