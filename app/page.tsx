import Navbar from "@/components/navbar"
import SearchBar from "@/components/search-bar"
import Carousel from "@/components/carousel"
import PromoBanner from "@/components/promo-banner"
import ProductGrid from "@/components/product-grid"
import Footer from "@/components/footer"
import CartNotificationWrapper from "@/components/cart-notification-wrapper"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <SearchBar />
      <Carousel />
      <PromoBanner />
      <ProductGrid />
      <Footer />
      <CartNotificationWrapper />
    </main>
  )
}
