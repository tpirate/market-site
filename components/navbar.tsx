"use client"

import Image from "next/image"
import Link from "next/link"
import { User } from "lucide-react"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false)

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

  return (
    <nav className="bg-[#36cfe3] py-2 px-0.5">
      <div className={`container mx-auto flex ${isMobile ? "justify-center" : "justify-between"} items-center pr-0.5`}>
        <div className={`flex space-x-1.5 ${isMobile ? "mx-auto" : "ml-0.5"}`}>
          <Link href="/" className="bg-[#dafbff] rounded-md px-3 py-1.5 flex items-center justify-center">
            <div className="relative w-20 h-8">
              <Image
                src="https://api.a101prod.retter.io/dbmk89vnr/CALL/Image/get/a101-logo-2_256x256.svg"
                alt="A101 Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>

          <Link href="/" className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
            <div className="relative w-20 h-8">
              <Image
                src="https://api.a101prod.retter.io/dbmk89vnr/CALL/Image/get/extra-logo_256x256.svg"
                alt="A101 EKSTRA Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>

          <Link href="/" className="bg-[#dafbff] rounded-md px-3 py-1.5 flex items-center justify-center">
            <div className="relative w-20 h-8">
              <Image
                src="https://api.a101prod.retter.io/dbmk89vnr/CALL/Image/get/kapida-logo_256x256.svg"
                alt="A101 KAPIDA Logo"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>
        </div>

        {!isMobile && (
          <Link
            href="#"
            className="flex items-center gap-1 bg-white text-[#36cfe3] px-4 py-1.5 rounded-full text-sm font-medium mr-0.5"
          >
            <User size={16} />
            <span>Giriş Yap</span>
          </Link>
        )}
      </div>
    </nav>
  )
}
