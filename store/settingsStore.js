import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useSettingsStore = create(persist(
    (set) => ({
        apiKey: '',
        baseURL: '',
        themeMode: '',
        setApiKey: (apiKey) => set({ apiKey }),
        setBaseURL: (baseURL) => set({ baseURL }),
        setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
    name: 'settings-storage', // unique name
       storage: createJSONStorage(() => AsyncStorage),
    }
));

export default useSettingsStore;
