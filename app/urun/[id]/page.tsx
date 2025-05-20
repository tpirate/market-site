import Navbar from "@/components/navbar"
import SearchBar from "@/components/search-bar"
import ProductDetail from "@/components/product-detail"
import Footer from "@/components/footer"
import CartNotificationWrapper from "@/components/cart-notification-wrapper"
import { products } from "@/data/products"
import { notFound } from "next/navigation"

export default function ProductPage({ params }: { params: { id: string } }) {
  // Ürün ID'sine göre ürünü bul
  const product = products.find((p) => p.id === params.id)

  // Ürün bulunamazsa 404 sayfasına yönlendir
  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#f0f5fa]">
      <Navbar />
      <SearchBar />
      <ProductDetail product={product} />
      <Footer />
      <CartNotificationWrapper />
    </main>
  )
}
