import { createContext, useContext, type ReactNode } from "react";

export type DsfrTheme = "default" | "dark";

type ThemeModeContextValue = {
  theme: DsfrTheme;
  toggleTheme: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({
  value,
  children,
}: {
  value: ThemeModeContextValue;
  children: ReactNode;
}) {
  return (
    <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const value = useContext(ThemeModeContext);
  if (!value) {
    throw new Error("useThemeMode doit être utilisé sous ThemeModeProvider");
  }
  return value;
}

