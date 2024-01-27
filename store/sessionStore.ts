import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Session, Message } from "./sessionTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SessionState {
  sessions: Session[];
  createSession: (session: Session) => void;
  addMessageToSession: (sessionId: string, message: Message) => void;
}

const useSessionStore = create<SessionState, any>(
  persist(
    (set) => ({
      sessions: [],

      createSession: (session: Session) =>
        set((state) => ({ sessions: [...state.sessions, session] })),

      addMessageToSession: (sessionId: string, message: Message) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId
              ? { ...session, messages: [...session.messages, message] }
              : session
          ),
        })),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useSessionStore;
