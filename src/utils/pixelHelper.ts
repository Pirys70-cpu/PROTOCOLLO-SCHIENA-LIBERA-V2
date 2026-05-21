import { PixelEvent } from '../types';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

/**
 * Dynamically initializes the Meta (Facebook) Pixel with the specified pixel ID.
 */
export function initMetaPixel(pixelId: string, onEventFired?: (event: PixelEvent) => void): boolean {
  if (!pixelId || pixelId.trim() === '') {
    return false;
  }

  try {
    // Custom script injection standard for Meta Pixel
    const f = window;
    const b = document;
    const e = 'script';
    const v = 'https://connect.facebook.net/en_US/fbevents.js';

    if (!f.fbq) {
      const n: any = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];

      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else {
        b.head.appendChild(t);
      }
      f.fbq = n;
    }

    // Initialize the Pixel
    window.fbq('init', pixelId);
    
    // Track PageView immediately on load
    firePixelEvent('PageView', {}, pixelId, onEventFired);
    return true;
  } catch (error) {
    console.error('Failed to initialize Meta Pixel:', error);
    return false;
  }
}

/**
 * Fires a Meta Pixel event to both the actual Meta endpoint (if initialized)
 * and logs it inside our custom log history.
 */
export function firePixelEvent(
  eventName: string,
  parameters: Record<string, any> = {},
  pixelId: string,
  onEventFired?: (event: PixelEvent) => void
): PixelEvent {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8); // e.g., "14:23:45"
  const eventId = Math.random().toString(36).substr(2, 9);
  
  const hasRealPixel = !!(pixelId && window.fbq);

  if (hasRealPixel) {
    try {
      window.fbq('track', eventName, parameters);
      console.log(`[Meta Pixel Real event: ${eventName}]`, parameters);
    } catch (e) {
      console.error('Error firing real Meta Pixel event:', e);
    }
  } else {
    console.log(`[Meta Pixel Simulated event: ${eventName}] (No real Pixel ID configured yet)`, parameters);
  }

  const newEvent: PixelEvent = {
    id: eventId,
    timestamp,
    eventName,
    parameters,
    status: hasRealPixel ? 'fired_successfully' : 'simulation_only'
  };

  if (onEventFired) {
    onEventFired(newEvent);
  }

  return newEvent;
}
