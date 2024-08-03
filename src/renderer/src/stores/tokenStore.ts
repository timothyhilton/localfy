import { create } from 'zustand'

type TokenState = {
  token: string
  setToken: (token: string) => void
}

export const useTokenStore = create<TokenState>((set) => ({
  token: '',
  setToken: (token) => set({ token })
}))
