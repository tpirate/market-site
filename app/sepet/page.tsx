import Navbar from "@/components/navbar"
import SearchBar from "@/components/search-bar"
import CartContent from "@/components/cart-content"
import CartNotificationWrapper from "@/components/cart-notification-wrapper"

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#f0f5fa]">
      <Navbar />
      <SearchBar />
      <CartContent />
      <CartNotificationWrapper />
    </main>
  )
}
