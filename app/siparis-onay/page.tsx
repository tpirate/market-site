import Navbar from "@/components/navbar"
import SearchBar from "@/components/search-bar"
import OrderConfirmation from "@/components/order-confirmation"
import Footer from "@/components/footer"

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#f0f5fa]">
      <Navbar />
      <SearchBar />
      <OrderConfirmation />
      <Footer />
    </main>
  )
}
