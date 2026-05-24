import React, { useState, useEffect } from 'react';
import AdminConsole from './components/AdminConsole';
import LandingPage from './components/LandingPage';
import { LandingPageSettings, PixelEvent } from './types';
import { initMetaPixel, firePixelEvent } from './utils/pixelHelper';
import { Sliders, RefreshCw, Eye, Sparkles } from 'lucide-react';

const DEFAULTS: LandingPageSettings = {
  pixelId: '', // Default blank to let user insert theirs
  checkoutUrl: 'https://pay.hotmart.com/Q105934024P?checkoutMode=10',
  price: 17,
  originalPrice: 47,
  productName: 'Protocollo Schiena Libera',
  authorName: 'Dr. Marco Wellness',
  spotsTotal: 100,
  spotsLeft: 24,
  supportEmail: 'aaragon70@gmail.com',
  supportWhatsapp: '',
  discountCode: 'OFFERTA7',
  showOriginalPhotos: false,
  isFictionalMode: false
};

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [settings, setSettings] = useState<LandingPageSettings>(() => {
    try {
      const saved = localStorage.getItem('schiena_libera_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate old 87 default to 47
        if (parsed.originalPrice === 87) {
          parsed.originalPrice = 47;
          localStorage.setItem('schiena_libera_settings', JSON.stringify(parsed));
        }
        return { ...DEFAULTS, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse saved settings', e);
    }
    return DEFAULTS;
  });

  const [pixelEvents, setPixelEvents] = useState<PixelEvent[]>([]);
  const [isConsoleMinimised, setIsConsoleMinimised] = useState(false);

  // Helper to add logged events into state
  const addPixelLog = (newEvent: PixelEvent) => {
    setPixelEvents(prev => [...prev, newEvent]);
  };

  // On mount and whenever settings.pixelId changes, re-initialize the Meta Pixel
  useEffect(() => {
    if (settings.pixelId) {
      const loaded = initMetaPixel(settings.pixelId, addPixelLog);
      if (loaded) {
        console.log(`[Meta Pixel] Successfully initialized with ID: ${settings.pixelId}`);
      }
    } else {
      console.log('[Meta Pixel] No Pixel ID configured. Operating in simulation log mode.');
    }
  }, [settings.pixelId]);

  // Handle CTA actions: InitiateCheckout event and then redirect
  const handleCheckoutRedirect = () => {
    // 1. Log and fire InitiateCheckout Meta Pixel event
    const payload = {
      content_name: settings.productName,
      content_category: 'Digital Product / PDF Book',
      value: settings.price,
      currency: 'EUR'
    };

    firePixelEvent('InitiateCheckout', payload, settings.pixelId, addPixelLog);

    // 2. Wait slightly to ensure asynchronous tracking scripts have a moment to emit
    const finalUrl = settings.checkoutUrl;
    
    // Simulate active purchase loading visual for customer
    const delay = 400;
    setTimeout(() => {
      try {
        // Handle iframe top redirection
        if (window.top && window.top !== window) {
          window.top.location.href = finalUrl;
        } else {
          window.location.href = finalUrl;
        }
      } catch (err) {
        // Fallback for security contexts
        window.location.href = finalUrl;
      }
    }, delay);
  };

  // Manual trace events for dashboard testers
  const handleFireMockEvent = (eventName: string) => {
    const payload: Record<string, any> = {
      simulated_by_admin: true,
      timestamp_epoch: Date.now()
    };

    if (eventName === 'Purchase') {
      payload.value = settings.price;
      payload.currency = 'EUR';
      payload.content_name = settings.productName;
    }

    firePixelEvent(eventName, payload, settings.pixelId, addPixelLog);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULTS);
    localStorage.removeItem('schiena_libera_settings');
    setPixelEvents([]);
    
    // Trigger simulated page view after reset
    if (DEFAULTS.pixelId) {
      initMetaPixel(DEFAULTS.pixelId, addPixelLog);
    } else {
      // Simulate clean pageview on simulated start
      const pageViewEvent: PixelEvent = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
        eventName: 'PageView',
        parameters: { info: 'Default state loaded' },
        status: 'simulation_only'
      };
      setPixelEvents([pageViewEvent]);
    }
  };

  // Initial trigger simulation logged if page loads first time without real pixel
  useEffect(() => {
    if (!settings.pixelId) {
      const initEvent: PixelEvent = {
        id: 'initial-load',
        timestamp: new Date().toISOString().split('T')[1].slice(0, 8),
        eventName: 'PageView',
        parameters: { info: 'Pagina caricata correttamente nel browser cliente' },
        status: 'simulation_only'
      };
      setPixelEvents([initEvent]);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen selection:bg-violet-600 selection:text-white bg-slate-950 font-sans">
      
      {/* 1. TOP ADMIN CONSOLE BLOCK (Rendered according to conditional preference) */}
      <AdminConsole
        isAuthorized={isAuthorized}
        setIsAuthorized={setIsAuthorized}
        settings={settings}
        setSettings={setSettings}
        pixelEvents={pixelEvents}
        clearLogs={() => setPixelEvents([])}
        onFireMockEvent={handleFireMockEvent}
        onResetDefaults={handleResetDefaults}
      />

      {/* 2. THE HIGH CONVERTING SALES LANDING PAGE */}
      <LandingPage
        isAuthorized={isAuthorized}
        settings={settings}
        onCallToAction={handleCheckoutRedirect}
      />
    </div>
  );
}

