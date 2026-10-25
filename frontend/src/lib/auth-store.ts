import { create } from 'zustand'
import type { User } from '@/types'
import { apiClient, ApiClientError } from '@/lib/api-client'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  setUser: (user: User | null) => void
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const user = await apiClient.post<User>('/auth/login', { email, password })
    set({ user, isAuthenticated: true, isLoading: false })
  },

  register: async (data: RegisterData) => {
    const user = await apiClient.post<User>('/auth/register', data)
    set({ user, isAuthenticated: true, isLoading: false })
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Logout should succeed even if the API call fails
    }
    set({ user: null, isAuthenticated: false, isLoading: false })
  },

  fetchUser: async () => {
    try {
      const user = await apiClient.get<User>('/auth/me')
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        set({ user: null, isAuthenticated: false, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user, isLoading: false })
  },
}))
