import { create } from "zustand";
import { Session, SessionSetting, Message } from "./sessionTypes";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SessionState {
  sessions: Session[];
  currentSessionId: string | null;
  setCurrentSessionId: (sessionId: string | null) => void;
  updateSessionSettings: (sessionId: string, settings: SessionSetting) => void;
  createSession: (session: Session) => void;
  addMessageToSession: (sessionId: string, message: Message) => void;
}

const useSessionStore = create<SessionState, any>(
  persist(
    (set) => ({
      sessions: [],
      currentSessionId: null,

      setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),

      createSession: (session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),

      addMessageToSession: (sessionId, message) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, messages: [...session.messages, message] }
              : session
          ),
        })),

      updateSessionSettings: (sessionId, settings) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, settings } : session
          ),
        })),
    }),
    {
      name: "session-storage", // 使用新的存储键
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useSessionStore;
