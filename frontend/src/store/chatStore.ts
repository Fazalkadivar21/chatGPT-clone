import { create } from 'zustand'

interface Chat {
  _id: string
  user: string
  name: string
}

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  setChats: (chats: Chat[]) => void
  addChat: (chat: Chat) => void
  setActiveChat: (id: string | null) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  setActiveChat: (id) => set({ activeChatId: id }),
  reset: () => set({ chats: [], activeChatId: null }),
}))
