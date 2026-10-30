import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  getItemCount: () => number
  getSubtotal: () => number
  getTotalWeightGrams: () => number
  getShippingMinor: () => number
  getItem: (productId: string) => CartItem | undefined
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.product_id === item.product_id
          )

          if (existingIndex >= 0) {
            const updatedItems = [...state.items]
            const existing = updatedItems[existingIndex]
            const newQuantity = Math.min(
              existing.quantity + item.quantity,
              existing.stock_quantity
            )
            updatedItems[existingIndex] = {
              ...existing,
              quantity: newQuantity,
              weight_grams: item.weight_grams ?? existing.weight_grams,
            }
            return { items: updatedItems }
          }

          const quantity = Math.min(item.quantity, item.stock_quantity)
          return { items: [...state.items, { ...item, quantity }] }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== productId),
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((i) => i.product_id !== productId) }
          }
          return {
            items: state.items.map((i) =>
              i.product_id === productId
                ? { ...i, quantity: Math.min(quantity, i.stock_quantity) }
                : i
            ),
          }
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price_minor * item.quantity,
          0
        )
      },

      getTotalWeightGrams: () => {
        return get().items.reduce((total, item) => {
          const itemWeight = item.weight_grams ?? 100
          return total + itemWeight * item.quantity
        }, 0)
      },

      getShippingMinor: () => {
        const items = get().items
        if (items.length === 0) return 0

        // Check if any product has free shipping (Artist Kit + FREE shipping)
        const hasFreeShipping = items.some(
          (i) =>
            i.product_slug === 'mehndi-artist-kit' ||
            i.product_name.toLowerCase().includes('free shipping')
        )
        if (hasFreeShipping) {
          return 0
        }

        const totalWeight = get().getTotalWeightGrams()
        // Base shipping starts with ₹80 (8000 paise) for up to 0.5 kg (500g)
        if (totalWeight <= 500) {
          return 8000
        }

        // Tiered weight: every additional 0.5 kg (500g) adds ₹30
        const extraBrackets = Math.ceil((totalWeight - 500) / 500)
        return 8000 + extraBrackets * 3000
      },

      getItem: (productId: string) => {
        return get().items.find((i) => i.product_id === productId)
      },
    }),
    {
      name: 'mehndi-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
