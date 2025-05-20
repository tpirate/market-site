import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f5fa]">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-[#36cfe3] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sayfa Bulunamadı</h2>
        <p className="text-gray-600 mb-6">
          Aradığınız sayfa bulunamadı veya taşınmış olabilir. Lütfen ana sayfaya dönün ve tekrar deneyin.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#36cfe3] hover:bg-[#2bb8cc] text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
