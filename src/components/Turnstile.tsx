import React, { useEffect, useRef } from 'react';

// Cloudflare Turnstile, the bot check on the booking form. The admin system turns it on by sending its site key with the hotel
// info (HOTEL_INFO.captchaSiteKey); the token it gives is checked there before the booking is made, and works only once.

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptLoad: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptLoad ??= new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile did not load')));
    script.onerror = () => {
      scriptLoad = null; // let a later attempt try again
      script.remove();
      reject(new Error('Turnstile did not load'));
    };
    document.head.appendChild(script);
  });
  return scriptLoad;
}

/**
 * The widget. Calls onToken with a fresh token, or with '' when it expires or fails. Remount it (change its key) for a new token
 * after a booking attempt, since each token works once.
 */
export const Turnstile: React.FC<{
  siteKey: string;
  /** Checked by the PMS, so a token made for one form doesn't work on another ('booking' or 'lookup'). */
  action?: 'booking' | 'lookup';
  onToken: (token: string) => void;
  onLoadError: () => void;
}> = ({ siteKey, action = 'booking', onToken, onLoadError }) => {
  const box = useRef<HTMLDivElement>(null);
  // Latest callbacks, without re-rendering the widget when the parent re-renders.
  const handlers = useRef({ onToken, onLoadError });
  handlers.current = { onToken, onLoadError };

  useEffect(() => {
    let widgetId: string | undefined;
    let gone = false;
    loadTurnstile()
      .then((api) => {
        if (gone || !box.current) return;
        widgetId = api.render(box.current, {
          sitekey: siteKey,
          action,
          theme: 'light',
          callback: (token: string) => handlers.current.onToken(token),
          'expired-callback': () => handlers.current.onToken(''),
          'error-callback': () => handlers.current.onToken(''),
        });
      })
      .catch(() => !gone && handlers.current.onLoadError());
    return () => {
      gone = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, action]);

  return <div ref={box} className="min-h-[65px]" />;
};
