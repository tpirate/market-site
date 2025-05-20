"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const images = [
  "https://cdn2.a101.com.tr/dbmk89vnr/CALL/Image/getw/files/681baea461c9a900087982f2/02.web-3.jpg",
  "https://cdn2.a101.com.tr/dbmk89vnr/CALL/Image/getw/files/681baea461c9a900087982f7/02.web-8.jpg",
  "https://cdn2.a101.com.tr/dbmk89vnr/CALL/Image/getw/files/681baea461c9a900087982f3/02.web-4.jpg",
  "https://cdn2.a101.com.tr/dbmk89vnr/CALL/Image/getw/files/681baea461c9a900087982ef/02.web.jpg",
  "https://cdn2.a101.com.tr/dbmk89vnr/CALL/Image/getw/files/681baea461c9a900087982f4/02.web-5.jpg",
  "https://cdn2.a101.com.tr/dbmk89vnr/CALL/Image/getw/files/681baea461c9a900087982f5/02.web-6.jpg",
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // 5 saniyede bir otomatik geçiş

    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Slide ${index + 1}`}
              fill
              priority={index === 0}
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-[#36cfe3] text-white rounded-full p-1 sm:p-2 focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-[#36cfe3] text-white rounded-full p-1 sm:p-2 focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full focus:outline-none ${
              index === currentIndex ? "bg-[#36cfe3]" : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
