import Navbar from "@/components/navbar"
import SearchBar from "@/components/search-bar"
import PaymentForm from "@/components/payment-form"
import CartNotificationWrapper from "@/components/cart-notification-wrapper"

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#f0f5fa]">
      <Navbar />
      <SearchBar />
      <PaymentForm />
      <CartNotificationWrapper />
    </main>
  )
}
