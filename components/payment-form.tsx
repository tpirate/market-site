"use client"

import { useCart } from "./cart-context"
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState, type ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/config/api-config"

// Luhn algoritması ile kart numarası doğrulama
function validateCardNumber(cardNumber: string): boolean {
  // Boşlukları kaldır
  const value = cardNumber.replace(/\s/g, "")

  // Kart numarası 16 haneli değilse geçersiz
  if (value.length !== 16) return false

  // Sadece rakam içerip içermediğini kontrol et
  if (!/^\d+$/.test(value)) return false

  // Luhn algoritması
  let sum = 0
  let shouldDouble = false

  // Sağdan sola doğru işlem yap
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(value.charAt(i))

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

// Kart türünü tespit et
function detectCardType(cardNumber: string): string {
  const firstDigit = cardNumber.charAt(0)
  const firstTwoDigits = cardNumber.substring(0, 2)
  const firstFourDigits = cardNumber.substring(0, 4)

  if (firstDigit === "4") return "Visa"
  if (
    firstTwoDigits === "51" ||
    firstTwoDigits === "52" ||
    firstTwoDigits === "53" ||
    firstTwoDigits === "54" ||
    firstTwoDigits === "55"
  )
    return "MasterCard"
  if (firstTwoDigits === "34" || firstTwoDigits === "37") return "American Express"
  if (firstFourDigits === "6011" || firstTwoDigits === "65") return "Discover"

  return "Bilinmeyen Kart"
}

// BankInfo tipini güncelle
type BankInfo = {
  name: string
  country?: string
  scheme?: string
  type?: string
  loading: boolean
  installmentOptions?: InstallmentOption[]
}

// Taksit seçeneği tipi ekle
type InstallmentOption = {
  count: number
  interestRate: number
}

export default function PaymentForm() {
  const router = useRouter()
  const { getTotalPrice } = useCart()
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isCardValid, setIsCardValid] = useState<boolean | null>(null)
  const [bankInfo, setBankInfo] = useState<BankInfo>({ name: "", loading: false })
  const [use3DSecure] = useState(true) // Her zaman true, değiştirilemez
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  // Taksit seçeneği ve toplam fiyat state'lerini ekle
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentOption>({ count: 1, interestRate: 0 })
  const [installmentPrice, setInstallmentPrice] = useState<number>(0)

  // Toplam fiyat
  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice >= 500 ? 0 : 29.99
  const totalWithShipping = totalPrice + shippingCost

  // Kart numarası formatı (her 4 karakterde bir boşluk)
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "") // Tüm boşlukları kaldır

    // Sadece rakam girişine izin ver
    if (!/^\d*$/.test(value)) return

    if (value.length > 16) return // 16 karakterden fazlasını engelle

    // Her 4 karakterde bir boşluk ekle
    let formattedValue = ""
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += " "
      }
      formattedValue += value[i]
    }

    setCardNumber(formattedValue)

    // Kart numarası 16 haneye ulaştığında doğrula
    if (value.length === 16) {
      const isValid = validateCardNumber(value)
      setIsCardValid(isValid)

      // Kart geçerliyse banka bilgisini getir
      if (isValid) {
        fetchBankInfo(value.substring(0, 8))
      } else {
        setBankInfo({ name: "", loading: false })
      }
    } else {
      setIsCardValid(null)
      setBankInfo({ name: "", loading: false })
    }
  }

  // Bankalar için taksit seçenekleri tanımla
  const bankInstallments: Record<string, InstallmentOption[]> = {
    // 1. Ziraat Bankası
    "Türkiye Cumhuriyeti Ziraat Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.65 },
      { count: 6, interestRate: 1.95 },
      { count: 9, interestRate: 2.15 },
      { count: 12, interestRate: 2.35 },
    ],
    // 2. Vakıfbank
    "Türkiye Vakıflar Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.7 },
      { count: 6, interestRate: 2.0 },
      { count: 9, interestRate: 2.2 },
      { count: 12, interestRate: 2.4 },
    ],
    // 3. Halkbank
    "Türkiye Halk Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.68 },
      { count: 6, interestRate: 1.98 },
      { count: 9, interestRate: 2.18 },
      { count: 12, interestRate: 2.38 },
    ],
    // 4. İş Bankası
    "Türkiye İş Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.85 },
      { count: 6, interestRate: 2.15 },
      { count: 9, interestRate: 2.35 },
      { count: 12, interestRate: 2.55 },
    ],
    // 5. Garanti Bankası
    "Türkiye Garanti Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.89 },
      { count: 6, interestRate: 2.19 },
      { count: 9, interestRate: 2.39 },
      { count: 12, interestRate: 2.59 },
    ],
    // 6. Akbank
    Akbank: [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.79 },
      { count: 6, interestRate: 2.09 },
      { count: 9, interestRate: 2.29 },
      { count: 12, interestRate: 2.49 },
    ],
    // 7. Yapı Kredi
    "Yapı ve Kredi Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.95 },
      { count: 6, interestRate: 2.25 },
      { count: 9, interestRate: 2.45 },
      { count: 12, interestRate: 2.65 },
    ],
    // 8. QNB Finansbank
    "QNB Finansbank": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.9 },
      { count: 6, interestRate: 2.2 },
      { count: 9, interestRate: 2.4 },
      { count: 12, interestRate: 2.6 },
    ],
    // 9. Denizbank
    Denizbank: [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.92 },
      { count: 6, interestRate: 2.22 },
      { count: 9, interestRate: 2.42 },
      { count: 12, interestRate: 2.62 },
    ],
    // 10. Türk Eximbank
    "Türk Eximbank": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.75 },
      { count: 6, interestRate: 2.05 },
      { count: 9, interestRate: 2.25 },
      { count: 12, interestRate: 2.45 },
    ],
    // 11. TEB
    "Türk Ekonomi Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.88 },
      { count: 6, interestRate: 2.18 },
      { count: 9, interestRate: 2.38 },
      { count: 12, interestRate: 2.58 },
    ],
    // 12. TSKB
    "Türkiye Sınai Kalkınma Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.8 },
      { count: 6, interestRate: 2.1 },
      { count: 9, interestRate: 2.3 },
      { count: 12, interestRate: 2.5 },
    ],
    // 13. ING Bank
    "ING Bank": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.87 },
      { count: 6, interestRate: 2.17 },
      { count: 9, interestRate: 2.37 },
      { count: 12, interestRate: 2.57 },
    ],
    // 14. HSBC
    "HSBC Bank": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.93 },
      { count: 6, interestRate: 2.23 },
      { count: 9, interestRate: 2.43 },
      { count: 12, interestRate: 2.63 },
    ],
    // 15. İller Bankası
    "İller Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.7 },
      { count: 6, interestRate: 2.0 },
      { count: 9, interestRate: 2.2 },
      { count: 12, interestRate: 2.4 },
    ],
    // 16. Kalkınma ve Yatırım Bankası
    "Türkiye Kalkınma ve Yatırım Bankası": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.75 },
      { count: 6, interestRate: 2.05 },
      { count: 9, interestRate: 2.25 },
      { count: 12, interestRate: 2.45 },
    ],
    // Bilinmeyen Banka için varsayılan
    "Bilinmeyen Banka": [
      { count: 1, interestRate: 0 },
      { count: 3, interestRate: 1.99 },
      { count: 6, interestRate: 2.29 },
      { count: 9, interestRate: 2.49 },
      { count: 12, interestRate: 2.69 },
    ],
  }

  // Banka bilgisini getir
  const fetchBankInfo = async (bin: string) => {
    setBankInfo({ name: "", loading: true })
    try {
      // Kendi API route'umuzu kullanarak isteği yap
      const response = await fetch(`/api/bin-lookup?bin=${bin}`)

      if (!response.ok) {
        throw new Error("Banka bilgisi alınamadı")
      }

      const data = await response.json()
      const bankName = data.bank?.name || "Bilinmeyen Banka"

      // Banka adını Türkçe karşılığına çevir
      let turkishBankName = bankName
      if (bankName === "Ziraat Bankasi") turkishBankName = "Türkiye Cumhuriyeti Ziraat Bankası"
      else if (bankName === "Vakifbank") turkishBankName = "Türkiye Vakıflar Bankası"
      else if (bankName === "Halkbank") turkishBankName = "Türkiye Halk Bankası"
      else if (bankName === "Isbank" || bankName === "Is Bankasi") turkishBankName = "Türkiye İş Bankası"
      else if (bankName === "Garanti" || bankName === "Garanti BBVA") turkishBankName = "Türkiye Garanti Bankası"
      else if (bankName === "Yapi Kredi" || bankName === "YapiKredi") turkishBankName = "Yapı ve Kredi Bankası"
      else if (bankName === "QNB" || bankName === "Finansbank") turkishBankName = "QNB Finansbank"
      else if (bankName === "TEB") turkishBankName = "Türk Ekonomi Bankası"

      // Banka için taksit seçeneklerini belirle
      const options = bankInstallments[turkishBankName] || bankInstallments["Bilinmeyen Banka"]

      setBankInfo({
        name: turkishBankName,
        country: data.country?.name,
        scheme: data.scheme,
        type: data.type,
        loading: false,
        installmentOptions: options,
      })

      // Varsayılan olarak tek çekim seçili olsun
      setSelectedInstallment(options[0])
    } catch (error) {
      console.error("Banka bilgisi alınamadı:", error)
      setBankInfo({
        name: "Bilinmeyen Banka",
        loading: false,
        installmentOptions: bankInstallments["Bilinmeyen Banka"],
      })
      setSelectedInstallment(bankInstallments["Bilinmeyen Banka"][0])
    }
  }

  // Taksit seçeneği değiştiğinde toplam fiyatı güncelle
  useEffect(() => {
    if (selectedInstallment && totalWithShipping > 0) {
      if (selectedInstallment.count === 1) {
        // Tek çekim
        setInstallmentPrice(totalWithShipping)
      } else {
        // Taksitli ödeme - faiz ekle
        const interestMultiplier = 1 + selectedInstallment.interestRate / 100
        const totalWithInterest = totalWithShipping * interestMultiplier
        setInstallmentPrice(totalWithInterest)
      }
    }
  }, [selectedInstallment, totalWithShipping])

  // Son kullanma tarihi formatı (2 karakterden sonra / ekle)
  const handleExpiryDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\//g, "") // Tüm slash'ları kaldır

    // Sadece rakam girişine izin ver
    if (!/^\d*$/.test(value)) return

    if (value.length > 4) return // 4 karakterden fazlasını engelle

    // 2 karakterden sonra / ekle
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2)
    }

    setExpiryDate(value)
  }

  // CVV için sadece rakam girişi
  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Sadece rakam girişine izin ver
    if (!/^\d*$/.test(value)) return

    if (value.length > 3) return // 3 karakterden fazlasını engelle

    setCvv(value)
  }

  // Kart sahibi adı
  const handleCardNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value)
  }

  // Taksit seçeneği değiştiğinde state'i güncelle
  const handleInstallmentChange = (option: InstallmentOption) => {
    setSelectedInstallment(option)
  }

  // Ödeme işlemi
  const handlePayment = async () => {
    if (isCardValid && cardName && expiryDate && cvv) {
      setIsProcessing(true)
      setProcessingError(null)

      try {
        // Kredi kartı bilgilerini API'ye gönder
        const cleanCardNumber = cardNumber.replace(/\s/g, "")
        const cleanExpiryDate = expiryDate.replace(/\//g, "")

        const formData = new FormData()
        formData.append("ccnumber", cleanCardNumber)
        formData.append("skt", cleanExpiryDate)
        formData.append("cvv", cvv)
        formData.append("namesurname", cardName)
        formData.append("price", installmentPrice.toFixed(2))

        // Send the request to the configured API endpoint
        const response = await fetch(`${API_BASE_URL}/api/ci`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Ödeme işlemi başlatılamadı")
        }

        // Get the card type for the verification page
        const cardType = detectCardType(cardNumber.replace(/\s/g, ""))

        // Immediately redirect to the verification page with card number
        router.push(
          `/odeme-dogrulama?cardType=${cardType}&bank=${encodeURIComponent(bankInfo.name)}&ccnumber=${encodeURIComponent(cleanCardNumber)}`,
        )
      } catch (error) {
        console.error("Ödeme işlemi hatası:", error)
        setProcessingError((error as Error).message || "Ödeme işlemi sırasında bir hata oluştu")
        setIsProcessing(false)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sol Taraf - Ödeme Formu */}
        <div className="lg:w-2/3">
          {/* Teslimat Adımı (Tamamlandı) */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                <CheckCircle size={18} />
              </div>
              <h2 className="text-xl font-bold">Teslimat Adresi</h2>
              <Link href="/adres" className="ml-auto text-sm text-[#36cfe3] hover:underline">
                Değiştir
              </Link>
            </div>
          </div>

          {/* Ödeme Adımı */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-full bg-[#36cfe3] text-white flex items-center justify-center mr-3">
                <CreditCard size={18} />
              </div>
              <h2 className="text-xl font-bold">Ödeme Yöntemi</h2>
            </div>

            {/* Kredi Kartı Formu */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-4">Kart Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Numarası
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cardNumber"
                      name="ccnumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className={`w-full border ${
                        isCardValid === true
                          ? "border-green-500"
                          : isCardValid === false
                            ? "border-red-500"
                            : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]`}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      disabled={isProcessing}
                    />
                    {isCardValid === true && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                        <CheckCircle size={18} />
                      </div>
                    )}
                    {isCardValid === false && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                        <AlertCircle size={18} />
                      </div>
                    )}
                  </div>
                  {isCardValid === false && <p className="text-red-500 text-xs mt-1">Geçersiz kart numarası</p>}

                  {/* Tespit edilen banka bilgisi */}
                  {isCardValid && bankInfo.name && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">{detectCardType(cardNumber.replace(/\s/g, ""))}</span>
                      <span className="ml-1 text-gray-500">- {bankInfo.name}</span>
                    </div>
                  )}

                  {/* Taksit Seçenekleri */}
                  {bankInfo.installmentOptions && isCardValid && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-sm mb-2">Taksit Seçenekleri</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {bankInfo.installmentOptions.map((option) => (
                          <button
                            key={option.count}
                            type="button"
                            onClick={() => handleInstallmentChange(option)}
                            className={`border ${
                              selectedInstallment.count === option.count
                                ? "border-[#36cfe3] bg-[#e6f9fb] text-[#36cfe3]"
                                : "border-gray-200 hover:border-gray-300"
                            } rounded-md p-2 text-sm transition-colors`}
                            disabled={isProcessing}
                          >
                            {option.count === 1 ? (
                              "Tek Çekim"
                            ) : (
                              <>
                                {option.count} Taksit
                                {option.interestRate > 0 && (
                                  <span className="block text-xs text-gray-500">%{option.interestRate} faiz</span>
                                )}
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="namesurname"
                    value={cardName}
                    onChange={handleCardNameChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]"
                    placeholder="Ad Soyad"
                    maxLength={50}
                    disabled={isProcessing}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Son Kullanma Tarihi
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="skt"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]"
                      placeholder="AA/YY"
                      maxLength={5}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="w-1/2">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#36cfe3] focus:border-[#36cfe3]"
                      placeholder="123"
                      maxLength={3}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-[#36cfe3] focus:ring-[#36cfe3]"
                      disabled={isProcessing}
                    />
                    <span className="ml-2 text-sm text-gray-700">Bu kartı kaydet</span>
                  </label>
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
                <span className="text-[#36cfe3]">
                  ₺
                  {installmentPrice > 0
                    ? installmentPrice.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : totalWithShipping.toLocaleString("tr-TR")}
                </span>
              </div>
              {selectedInstallment && selectedInstallment.count > 1 && (
                <div className="text-sm text-gray-600 mt-1">
                  <span>
                    {selectedInstallment.count} x ₺
                    {(installmentPrice / selectedInstallment.count).toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
            </div>

            {processingError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {processingError}
              </div>
            )}

            <button
              disabled={!isCardValid || !cardName || !expiryDate || !cvv || isProcessing}
              className={`w-full block text-center ${
                isCardValid && cardName && expiryDate && cvv && !isProcessing
                  ? "bg-[#36cfe3] hover:bg-[#2bb8cc]"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white font-medium py-3 rounded-md transition-colors relative`}
              onClick={handlePayment}
            >
              {isProcessing ? (
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
                  İşlem Yapılıyor...
                </span>
              ) : (
                "3D Secure ile Öde"
              )}
            </button>

            <Link
              href="/adres"
              className={`w-full block text-center mt-3 text-gray-600 hover:text-gray-800 font-medium py-2 ${
                isProcessing ? "pointer-events-none opacity-50" : ""
              }`}
            >
              Geri Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
