"use client"

import type React from "react"

import { useCart } from "./cart-context"
import { MapPin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddressForm() {
  const router = useRouter()
  const { getTotalPrice } = useCart()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    neighborhood: "",
    postalCode: "",
    address: "",
    saveAddress: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Toplam fiyat
  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice >= 500 ? 0 : 29.99
  const totalWithShipping = totalPrice + shippingCost

  // Form alanlarını güncelle
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Hata mesajını temizle
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Checkbox değişikliğini işle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Formu doğrula
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Ad Soyad alanı zorunludur"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon alanı zorunludur"
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz"
    }

    if (!formData.city.trim()) {
      newErrors.city = "İl alanı zorunludur"
    }

    if (!formData.district.trim()) {
      newErrors.district = "İlçe alanı zorunludur"
    }

    if (!formData.neighborhood.trim()) {
      newErrors.neighborhood = "Mahalle alanı zorunludur"
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Posta Kodu alanı zorunludur"
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Posta kodu 5 haneli olmalıdır"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Adres alanı zorunludur"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Formu gönder
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Adres bilgilerini localStorage'a kaydet
      if (formData.saveAddress) {
        localStorage.setItem("savedAddress", JSON.stringify(formData))
      }

      // Ödeme sayfasına yönlendir
      setTimeout(() => {
        router.push("/odeme")
      }, 500)
    } else {
      // Sayfayı ilk hata alanına kaydır
      const firstErrorField = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        element.focus()
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sol Taraf - Adres Formu */}
          <div className="lg:w-2/3">
            {/* Teslimat Adımı */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 rounded-full bg-[#36cfe3] text-white flex items-center justify-center mr-3">
                  <MapPin size={18} />
                </div>
                <h2 className="text-xl font-bold">Teslimat Adresi</h2>
              </div>

              {/* Adres Formu */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">Adres Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]`}
                      placeholder="Ad Soyad"
                      maxLength={50}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]`}
                      placeholder="0 (5XX) XXX XX XX"
                      maxLength={11}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      İl <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full border ${errors.city ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]`}
                      placeholder="İl"
                      maxLength={30}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                      İlçe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={`w-full border ${errors.district ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]`}
                      placeholder="İlçe"
                      maxLength={30}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                  </div>
                  <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                      Mahalle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className={`w-full border ${errors.neighborhood ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]`}
                      placeholder="Mahalle"
                      maxLength={30}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.neighborhood && <p className="mt-1 text-xs text-red-500">{errors.neighborhood}</p>}
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Posta Kodu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full border ${errors.postalCode ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]`}
                      placeholder="34000"
                      maxLength={5}
                      required
                      disabled={isSubmitting}
                    />
                    {errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Adres <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full border ${errors.address ? "border-red-500" : "border-gray-300"} rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]`}
                      placeholder="Sokak, Cadde, Bina No, Daire No vb."
                      maxLength={200}
                      required
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="saveAddress"
                        checked={formData.saveAddress}
                        onChange={handleCheckboxChange}
                        className="rounded text-[#36cfe3] focus:ring-[#36cfe3]"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">Bu adresi kaydet</span>
                    </label>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <p className="text-sm text-gray-500">
                      <span className="text-red-500">*</span> ile işaretli alanların doldurulması zorunludur.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Sipariş Özeti */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
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
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Toplam</span>
                  <span className="text-[#36cfe3]">₺{totalWithShipping.toLocaleString("tr-TR")}</span>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full block text-center bg-[#36cfe3] hover:bg-[#2bb8cc] text-white font-medium py-3 rounded-md transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    İşleniyor...
                  </span>
                ) : (
                  "Devam Et"
                )}
              </button>

              <Link
                href="/sepet"
                className={`w-full block text-center mt-3 text-gray-600 hover:text-gray-800 font-medium py-2 ${isSubmitting ? "pointer-events-none opacity-50" : ""}`}
              >
                Sepete Dön
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
