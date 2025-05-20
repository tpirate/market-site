"use client"

import { useState, useEffect } from "react"
import CartNotification from "./cart-notification"
import { useCart } from "./cart-context"

export default function CartNotificationWrapper() {
  const [isOpen, setIsOpen] = useState(false)
  const { lastAddedProduct, setLastAddedProduct } = useCart()
  const [productName, setProductName] = useState("")

  useEffect(() => {
    if (lastAddedProduct) {
      setProductName(lastAddedProduct)
      setIsOpen(true)
      setLastAddedProduct(null)
    }
  }, [lastAddedProduct, setLastAddedProduct])

  const handleClose = () => {
    setIsOpen(false)
  }

  return <CartNotification isOpen={isOpen} onClose={handleClose} productName={productName} />
}
