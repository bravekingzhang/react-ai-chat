import { create } from "zustand";
import { Session, SessionSetting } from "./sessionTypes"; // 使用你定义的类型
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SessionStore {
  sessions: Session[];
  currentSessionId: string | null;
  updateSessionSettings: (sessionId: string, settings: SessionSetting) => void;
}

// persist session settings,fixme
const useChatSessionStore = create<SessionStore, any>(
  persist(
    (set) => ({
      sessions: [],
      currentSessionId: null,
      updateSessionSettings: (sessionId, settings) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, settings } : session
          ),
        })),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useChatSessionStore;
