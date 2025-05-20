import { Truck } from "lucide-react"

export default function PromoBanner() {
  return (
    <div className="w-full py-3">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <Truck className="text-[#36cfe3]" size={20} />
        <p className="text-[#36cfe3] font-medium text-sm">500 TL ve üzeri alışverişlerinizde ücretsiz kargo!</p>
      </div>
    </div>
  )
}
