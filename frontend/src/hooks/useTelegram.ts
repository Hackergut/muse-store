import { useEffect, useState } from "react";

interface TelegramWebApp {
  initDataUnsafe: {
    user?: { id: number; first_name: string; last_name?: string; username?: string; language_code?: string };
    query_id?: string;
  };
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    setText: (text: string) => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    color: string;
    textColor: string;
    setParams: (p: {
      text?: string;
      is_visible?: boolean;
      is_active?: boolean;
      color?: string;
      text_color?: string;
    }) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  sendData: (data: string) => void;
  close: () => void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  onEvent: (eventType: string, callback: (...args: any[]) => void) => void;
  offEvent: (eventType: string, callback: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}

export const tg = typeof window !== "undefined" && window.Telegram?.WebApp ? window.Telegram.WebApp : null;

export function useTelegram() {
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [theme, setTheme] = useState<{ bg: string; text: string; hint: string; button: string; buttonText: string }>({
    bg: "#0a0a0a",
    text: "#ffffff",
    hint: "#888888",
    button: "#1a3c2b",
    buttonText: "#ffffff",
  });

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      setIsMiniApp(true);
      const params = tg.themeParams || {};
      setTheme({
        bg: params.bg_color || "#0a0a0a",
        text: params.text_color || "#ffffff",
        hint: params.hint_color || "#888888",
        button: params.button_color || "#1a3c2b",
        buttonText: params.button_text_color || "#ffffff",
      });
    }
  }, []);

  const haptic = (style: Parameters<TelegramWebApp["HapticFeedback"]["impactOccurred"]>[0] = "light") => {
    tg?.HapticFeedback?.impactOccurred(style);
  };

  const notify = (type: "error" | "success" | "warning") => {
    tg?.HapticFeedback?.notificationOccurred(type);
  };

  const sendOrder = (orderData: unknown) => {
    tg?.sendData?.(JSON.stringify(orderData));
  };

  const closeApp = () => {
    tg?.close?.();
  };

  return {
    isMiniApp,
    theme,
    tg,
    user: tg?.initDataUnsafe?.user,
    haptic,
    notify,
    sendOrder,
    closeApp,
    MainButton: tg?.MainButton,
    BackButton: tg?.BackButton,
  };
}
