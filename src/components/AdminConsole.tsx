import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Terminal, 
  Save, 
  CheckCircle, 
  Link as LinkIcon, 
  DollarSign, 
  Tag, 
  Users, 
  HelpCircle, 
  Trash2, 
  Zap, 
  Target, 
  Sliders,
  Mail,
  MessageCircle,
  Code
} from 'lucide-react';
import { LandingPageSettings, PixelEvent } from '../types';

interface AdminConsoleProps {
  settings: LandingPageSettings;
  setSettings: (settings: LandingPageSettings) => void;
  pixelEvents: PixelEvent[];
  clearLogs: () => void;
  onFireMockEvent: (eventName: string) => void;
  onResetDefaults: () => void;
}

export default function AdminConsole({
  settings,
  setSettings,
  pixelEvents,
  clearLogs,
  onFireMockEvent,
  onResetDefaults
}: AdminConsoleProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [pixelInput, setPixelInput] = useState(settings.pixelId);
  const [checkoutUrlInput, setCheckoutUrlInput] = useState(settings.checkoutUrl);
  const [priceInput, setPriceInput] = useState(settings.price.toString());
  const [origPriceInput, setOrigPriceInput] = useState(settings.originalPrice.toString());
  const [spotsTotalInput, setSpotsTotalInput] = useState(settings.spotsTotal.toString());
  const [spotsLeftInput, setSpotsLeftInput] = useState(settings.spotsLeft.toString());
  const [supportEmailInput, setSupportEmailInput] = useState(settings.supportEmail);
  const [whatsappInput, setWhatsappInput] = useState(settings.supportWhatsapp);
  
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'pixel' | 'help'>('config');

  // Adhere strictly to requested security constraints
  const ADMIN_CONFIG = {
    password: 'MiaPasswordSegreta2024!',
    keys: { ctrl: true, shift: true, key: 'x' },
    sessionTime: 300000, // 5 minutes
    maxAttempts: 2
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.ctrlKey === ADMIN_CONFIG.keys.ctrl &&
        e.shiftKey === ADMIN_CONFIG.keys.shift &&
        e.key.toLowerCase() === ADMIN_CONFIG.keys.key.toLowerCase()
      ) {
        e.preventDefault();
        e.stopPropagation();

        if (isBlocked) {
          console.log('🚫 Accesso bloccato per questa sessione');
          alert('🚫 Accesso bloccato temporaneamente. Troppi tentativi falliti.');
          return;
        }

        if (isAuthorized) {
          setIsAuthorized(false);
          setIsOpen(false);
          document.body.removeAttribute('data-admin-active');
          console.log('🔒 Sessione amministratore terminata');
          return;
        }

        const inputPassword = prompt('🔐 Accesso Riservato:');

        if (inputPassword === ADMIN_CONFIG.password) {
          setIsAuthorized(true);
          setIsOpen(true);
          setFailedAttempts(0);
          document.body.setAttribute('data-admin-active', 'true');
          console.log('✅ Modalità amministratore attivata');
        } else {
          // Password prompt canceled or incorrect
          if (inputPassword !== null) {
            setFailedAttempts((prev) => {
              const next = prev + 1;
              if (next >= ADMIN_CONFIG.maxAttempts) {
                setIsBlocked(true);
                console.log('🚫 Troppi tentativi falliti. Accesso bloccato.');
                alert('🚫 Troppi tentativi falliti. Accesso bloccato.');
                
                // Unblock after 1 hour (3600000ms)
                setTimeout(() => {
                  setIsBlocked(false);
                  setFailedAttempts(0);
                }, 3600000);
              } else {
                alert(`❌ Accesso negato. Tentativi rimasti: ${ADMIN_CONFIG.maxAttempts - next}`);
              }
              return next;
            });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthorized, isBlocked]);

  // Tab blur safety & session timer constraints
  useEffect(() => {
    if (!isAuthorized) return;

    const timer = setTimeout(() => {
      setIsAuthorized(false);
      setIsOpen(false);
      document.body.removeAttribute('data-admin-active');
      alert('🔒 Sessione scaduta per sicurezza');
    }, ADMIN_CONFIG.sessionTime);

    const handleBlur = () => {
      setIsAuthorized(false);
      setIsOpen(false);
      document.body.removeAttribute('data-admin-active');
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isAuthorized]);

  const handleSave = () => {
    const updated: LandingPageSettings = {
      ...settings,
      pixelId: pixelInput.trim(),
      checkoutUrl: checkoutUrlInput.trim(),
      price: parseFloat(priceInput) || 17,
      originalPrice: parseFloat(origPriceInput) || 87,
      spotsTotal: parseInt(spotsTotalInput) || 100,
      spotsLeft: parseInt(spotsLeftInput) || 24,
      supportEmail: supportEmailInput.trim(),
      supportWhatsapp: whatsappInput.trim(),
    };
    setSettings(updated);
    
    // Save to localStorage
    localStorage.setItem('schiena_libera_settings', JSON.stringify(updated));
    showToast();
  };

  const showToast = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const triggerReset = () => {
    if (window.confirm("Sei sicuro di voler ripristinare i dati predefiniti?")) {
      onResetDefaults();
      // Reset local fields
      setPixelInput("");
      setCheckoutUrlInput("https://pay.hotmart.com/Q105934024P?checkoutMode=10");
      setPriceInput("17");
      setOrigPriceInput("87");
      setSpotsTotalInput("100");
      setSpotsLeftInput("24");
      setSupportEmailInput("aaragon70@gmail.com");
      setWhatsappInput("");
      showToast();
    }
  };

  if (!isAuthorized) {
    return null;
  }

  if (!isOpen) {
    const gestioneButtonStyle: React.CSSProperties = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 999999,
      backgroundColor: '#00ff44', // VERDE ACCESO
      color: '#000000',           // Testo nero per contrasto
      border: '3px solid #ffffff',
      borderRadius: '8px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0, 255, 68, 0.4)',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      animation: 'pulseAdmin 2s infinite',
    };

    return (
      <button
        className="gestione-btn"
        data-gestione="true"
        style={gestioneButtonStyle}
        onClick={() => setIsOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#00ff00';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#00ff44';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        🔧 GESTIONE ADMIN
      </button>
    );
  }

  return (
    <div id="admin-management-block" className="relative z-50 w-full bg-slate-900 border-b border-violet-500/30 text-slate-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Header Console */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-violet-500 to-purple-500 p-1.5 rounded-lg text-white shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                CONSOLE STRUMENTI EDITORE <span className="bg-violet-500/20 text-violet-300 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border border-violet-500/30">Attiva</span>
              </h1>
              <p className="text-xs text-slate-400">
                Pannello per cambiare pixel di Meta, link di Hotmart ed eventi in tempo reale. <span className="text-amber-400 font-medium">Questa barra scompare per i tuoi clienti!</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'config' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Configurazione Dati
            </button>
            <button
              onClick={() => setActiveTab('pixel')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pixel' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Test Pixel Meta ({pixelEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'help' ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Come funziona?
            </button>

            <div className="h-6 w-[1px] bg-slate-800 mx-1Hidden md:block"></div>

            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/20 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              title="Nasconde questo pannello per vedere l'esatta vista del cliente"
            >
              <EyeOff className="w-3.5 h-3.5" />
              Anteprima Cliente
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="py-4">
          <AnimatePresence mode="wait">
            {activeTab === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {/* Meta Pixel Column */}
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-xs text-violet-300 uppercase tracking-wider">
                    <Target className="w-3.5 h-3.5" />
                    <span>Meta Pixel Tracker</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">ID Pixel di Facebook/Meta</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={pixelInput}
                        onChange={(e) => setPixelInput(e.target.value)}
                        placeholder="Es: 987654321098..."
                        className="w-full bg-slate-900 text-white rounded-lg pl-3 pr-8 py-1.5 text-xs border border-slate-700 focus:outline-none focus:border-violet-500 font-mono"
                      />
                      {settings.pixelId ? (
                        <div className="absolute right-2.5 top-2.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Pixel caricato e attivo nel codice" />
                      ) : (
                        <div className="absolute right-2.5 top-2.5 w-2 h-2 rounded-full bg-slate-600" title="Inserisci un ID per attivare il codice Pixel reale" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {settings.pixelId ? (
                        <span className="text-emerald-400">✓ Codice pixel iniettato. Monitora gli eventi nella scheda 'Test Pixel Meta'!</span>
                      ) : (
                        "Non impostato. Inserisci il codice per attivare la telemetria reale di Meta Ads."
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Visualizzazione Landing Page</label>
                    <div className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-300">Vedi schermate originali PDF</span>
                      <button
                        onClick={() => {
                          const updated = { ...settings, showOriginalPhotos: !settings.showOriginalPhotos };
                          setSettings(updated);
                          localStorage.setItem('schiena_libera_settings', JSON.stringify(updated));
                        }}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all uppercase cursor-pointer ${
                          settings.showOriginalPhotos 
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {settings.showOriginalPhotos ? "On (Mostra)" : "Off (Nascondi)"}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Attiva per mostrare ai clienti una galleria opzionale dei 6 screenshot autentici inviati, utile per verificare la perfetta somiglianza strutturale!
                    </p>
                  </div>
                </div>

                {/* Hotmart and Price Column */}
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-xs text-amber-300 uppercase tracking-wider">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Link di Vendita & Prezzi</span>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">URL checkout Hotmart</label>
                    <input
                      type="text"
                      value={checkoutUrlInput}
                      onChange={(e) => setCheckoutUrlInput(e.target.value)}
                      placeholder="https://pay.hotmart.com/..."
                      className="w-full bg-slate-900 text-white rounded-lg px-3 py-1.5 text-xs border border-slate-700 focus:outline-none focus:focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Prezzo Offerta (€)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-500">€</span>
                        <input
                          type="number"
                          value={priceInput}
                          onChange={(e) => setPriceInput(e.target.value)}
                          className="w-full bg-slate-900 text-white rounded-lg pl-6 pr-2 py-1.5 text-xs border border-slate-700 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Prezzo Intero (€)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-xs text-slate-500">€</span>
                        <input
                          type="number"
                          value={origPriceInput}
                          onChange={(e) => setOrigPriceInput(e.target.value)}
                          className="w-full bg-slate-900 text-white rounded-lg pl-6 pr-2 py-1.5 text-xs border border-slate-700 focus:outline-none focus:border-violet-500 text-slate-400 line-through"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scarcity and Support Column */}
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-xs text-indigo-300 uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5" />
                    <span>Supporto & Scadenza</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Posti Totali</label>
                      <input
                        type="number"
                        value={spotsTotalInput}
                        onChange={(e) => setSpotsTotalInput(e.target.value)}
                        className="w-full bg-slate-900 text-white rounded-lg px-3 py-1.5 text-xs border border-slate-700 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Posti Rimasti</label>
                      <input
                        type="number"
                        value={spotsLeftInput}
                        onChange={(e) => setSpotsLeftInput(e.target.value)}
                        className="w-full bg-slate-900 text-white rounded-lg px-3 py-1.5 text-xs border border-slate-700 focus:outline-none focus:border-violet-500 text-red-400 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">Email Supporto</label>
                      <div className="relative">
                        <Mail className="absolute left-2 top-2 w-3.5 h-3.5 text-slate-500" />
                        <input
                          type="email"
                          value={supportEmailInput}
                          onChange={(e) => setSupportEmailInput(e.target.value)}
                          placeholder="Email"
                          className="w-full bg-slate-900 text-white rounded-lg pl-7 pr-2 py-1.5 text-xs border border-slate-700 focus:outline-none text-ellipsis"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-0.5">WhatsApp Link o Tel</label>
                      <div className="relative">
                        <MessageCircle className="absolute left-2 top-2 w-3.5 h-3.5 text-emerald-500" />
                        <input
                          type="text"
                          value={whatsappInput}
                          onChange={(e) => setWhatsappInput(e.target.value)}
                          placeholder="Es: +39333123456"
                          className="w-full bg-slate-900 text-white rounded-lg pl-7 pr-2 py-1.5 text-xs border border-slate-700 focus:outline-none text-ellipsis"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pixel' && (
              <motion.div
                key="pixel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {/* Event Simulator triggers */}
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-3">
                  <div className="font-semibold text-xs text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Simulatore eventi Meta</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Clicca un bottone per testare le chiamate al Pixel. Vedrai apparire la traccia nel terminale a destra per verificare il payload.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onFireMockEvent('PageView')}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition-all"
                    >
                      PageView
                    </button>
                    <button
                      onClick={() => onFireMockEvent('InitiateCheckout')}
                      className="px-2.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-200 rounded-lg text-xs font-medium cursor-pointer transition-all"
                    >
                      InitiateCheckout
                    </button>
                    <button
                      onClick={() => onFireMockEvent('Purchase')}
                      className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-200 rounded-lg text-xs font-medium cursor-pointer transition-all col-span-2"
                    >
                      Purchase (Acquisto simulato €{settings.price})
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    *Nota: Se l'ID pixel è configurato, questi eventi vengono trasmessi realmente ai server di Meta (Facebook)!
                  </p>
                </div>

                {/* Event Logs viewer */}
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 space-y-2 col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Registro Eventi Feed (Live Activity Log)</span>
                    </div>
                    <button
                      onClick={clearLogs}
                      className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Svuota logs
                    </button>
                  </div>

                  <div className="bg-slate-950 rounded-lg p-2.5 h-[130px] overflow-y-auto font-mono text-[10px] border border-slate-850 space-y-1.5 scrolling-smooth text-slate-300">
                    {pixelEvents.length === 0 ? (
                      <div className="text-slate-500 italic h-full flex items-center justify-center">
                        In attesa di eventi... Visita la landing page o clicca un mock trigger sotto.
                      </div>
                    ) : (
                      pixelEvents.slice().reverse().map((evt) => (
                        <div key={evt.id} className="border-b border-slate-900 pb-1.5 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">{evt.timestamp}</span>
                            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-white font-bold">{evt.eventName}</span>
                            <span className={`px-1 rounded-[4px] text-[9px] ${
                              evt.status === 'fired_successfully' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                            }`}>
                              {evt.status === 'fired_successfully' ? 'Fired Real fbq()' : 'Simulation'}
                            </span>
                          </div>
                          <div className="text-slate-400 pl-1 mt-0.5 whitespace-pre-wrap">
                            Params: {JSON.stringify(evt.parameters)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'help' && (
              <motion.div
                key="help"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300"
              >
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-violet-400" />
                  Guida all'integrazione del Pixel di Meta & Hotmart
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <p>
                      <strong>1. Come inserire il pixel:</strong> Prendi il tuo ID numerico da Meta Events Manager (es. <code className="bg-slate-900 border border-slate-800 px-1 py-0.2 rounded text-violet-300">105304928...</code>) e incollalo nel campo. Verrà generato automaticamente il frammento JavaScript asincrono nativo di Facebook Pixel.
                    </p>
                    <p>
                      <strong>2. Tracciamento automatico:</strong> Cliccare sui pulsanti "SCARICA SUBITO" ed "INIZIA OGGI" attiverà automaticamente l'evento <code className="bg-slate-900 border border-slate-800 px-1 py-0.2 rounded text-amber-300">InitiateCheckout</code> ed effettuerà il redirect immediato alla pagina di pagamento Hotmart.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p>
                      <strong>3. Integrazione Hotmart:</strong> Abbiamo pre-collegato l'URL fornito. Quando cambi l'URL di checkout nella console, tutti i pulsanti della landing page rimandano istantaneamente a quel link con la trasmissione dei parametri promozionali.
                    </p>
                    <p>
                      <strong>4. Vista Cliente Pulita:</strong> Clicca su "Anteprima Cliente". La pagina apparirà esattamente come la vedono i tuoi acquirenti. Un discreto pulsante ad ingranaggio viola in basso a destra ricomparirà per darti l'accesso amministrativo in qualunque momento.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Salva Configurazione
            </button>
            <button
              onClick={triggerReset}
              className="bg-transparent hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              title="Azzera e rimetti i valori originali dell'applicazione"
            >
              <RefreshCw className="w-3 h-3" />
              Ripristina Default
            </button>
          </div>

          <AnimatePresence>
            {showSavedToast && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Salvataggio completato con successo! Codice Pixel e link aggiornati nell'APP!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="text-[10px] text-slate-500 font-mono">
            Vite Developer Mode Active • 100% Client-side sandbox
          </span>
        </div>
      </div>
    </div>
  );
}
