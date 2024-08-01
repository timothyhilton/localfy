import { create } from 'zustand'

type LastListenedLengthState = {
  length: number
  setLength: (length: number) => void
}

export const useLastListenedLengthStore = create<LastListenedLengthState>((set) => ({
  length: 0,
  setLength: (length) => set({ length })
}))
