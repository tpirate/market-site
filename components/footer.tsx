import Image from "next/image"
import Link from "next/link"
import { Youtube, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white py-6 border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Social Media Section */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-[#36cfe3] font-medium mb-4">Sosyal Medya</h3>
            <div className="flex space-x-5">
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Youtube size={24} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Linkedin size={24} />
              </Link>
            </div>
          </div>

          {/* Certification Badges */}
          <div className="flex space-x-4 items-center">
            <Image
              src="https://www.a101.com.tr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fa101_qr_icon.35cbd491.jpg&w=3840&q=100"
              alt="A101 QR Kod"
              width={60}
              height={60}
            />
            <Image
              src="https://www.a101.com.tr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftr_go.ad7359e4.jpg&w=3840&q=100"
              alt="TR GO"
              width={60}
              height={60}
            />
            <Image
              src="https://www.a101.com.tr/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fetbis.c2fb7b54.jpg&w=3840&q=100"
              alt="ETBİS'e Kayıtlıdır"
              width={60}
              height={60}
            />
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm">© 2025 A101 Ekstra</p>
        </div>
      </div>
    </footer>
  )
}
