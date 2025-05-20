import Navbar from "@/components/navbar"
import SearchBar from "@/components/search-bar"
import AddressForm from "@/components/address-form"
import CartNotificationWrapper from "@/components/cart-notification-wrapper"

export default function AddressPage() {
  return (
    <main className="min-h-screen bg-[#f0f5fa]">
      <Navbar />
      <SearchBar />
      <AddressForm />
      <CartNotificationWrapper />
    </main>
  )
}
