// Minimal shape of the Telegram WebApp API surface actually used here.
// Declared locally instead of pulling in a full type-definitions package,
// since the app only needs a handful of methods.
type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  openLink?: (url: string) => void;
  HapticFeedback?: {
    impactOccurred?: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
  };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function initTelegramWebApp(): void {
  try {
    window.Telegram?.WebApp?.ready?.();
    window.Telegram?.WebApp?.expand?.();
  } catch {
    // Telegram WebApp script failed to load or threw — the app must keep
    // working as a plain browser page.
  }
}

export function hapticTap(): void {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.("light");
  } catch {
    // no-op, haptics are a nice-to-have
  }
}

/**
 * Opens an external URL (e.g. a Lava.top payment page) using the Telegram
 * in-app browser when available, falling back to a normal new tab in any
 * other browser context.
 */
export function openExternalLink(url: string): void {
  try {
    const webApp = window.Telegram?.WebApp;
    if (webApp?.openLink) {
      webApp.openLink(url);
      return;
    }
  } catch {
    // fall through to window.open
  }
  window.open(url, "_blank", "noopener,noreferrer");
}
