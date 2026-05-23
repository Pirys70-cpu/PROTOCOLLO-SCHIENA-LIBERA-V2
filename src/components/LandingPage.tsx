import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Sun, 
  Zap, 
  Moon, 
  BookOpen, 
  Info,
  Smartphone,
  CheckCircle2,
  Lock,
  MessageSquare,
  Gift,
  Mail,
  MessageCircle,
  Award,
  Star,
  Activity,
  ArrowRight,
  ArrowLeft,
  Volume2
} from 'lucide-react';
import { LandingPageSettings } from '../types';

interface LandingPageProps {
  settings: LandingPageSettings;
  onCallToAction: () => void;
}

// Helper to convert Google Drive share URLs to direct image source URLs
function getDirectImageUrl(url: string): string {
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return url;
}

// Interactive Quiz Questions
const QUIZ_QUESTIONS = [
  {
    q: "Quante ore trascorri seduto alla scrivania o in auto ogni giorno?",
    options: [
      { text: "Meno di 4 ore al giorno (Stile di vita attivo)", score: 1 },
      { text: "Da 4 a 7 ore al giorno (Moderatamente sedentario)", score: 2 },
      { text: "Più di 7 ore al giorno (Lavoro d'ufficio statico / Autista)", score: 3 }
    ]
  },
  {
    q: "Come descriveresti la mobilità della tua schiena al risveglio mattutino?",
    options: [
      { text: "Sciolta ed elastica, non avverto impedimenti", score: 1 },
      { text: "Leggermente rigida nei primi 15 minuti, poi migliora", score: 2 },
      { text: "Completamente bloccata, dolente, fatico a piegarmi", score: 3 }
    ]
  },
  {
    q: "Hai mai utilizzato rimedi temporanei (farmaci, massaggi, creme) senza successo definitivo?",
    options: [
      { text: "No, preferisco far passare la tensione in modo naturale", score: 1 },
      { text: "Sì, ma ottengo solo un sollievo provvisorio di pochi giorni", score: 2 },
      { text: "Sì, spendo centinaia di euro ma il blocco ritorna costantemente", score: 3 }
    ]
  }
];

// Live notifications list
const PURCHASES_LOG = [
  { name: "Fabio da Roma", action: "ha sbloccato la schiena con il Protocollo PDF", time: "2 min fa" },
  { name: "Valentina da Milano", action: "ha acquistato l'offerta a soli €17", time: "In questo momento!" },
  { name: "Alessandro da Bologna", action: "ha scaricato il manuale PDF d'ufficio", time: "1 min fa" },
  { name: "Elena da Torino", action: "ha appena completato la routine di 10 minuti", time: "4 min fa" },
  { name: "Giuseppe da Napoli", action: "ha scelto l'accesso digitale sicuro", time: "6 min fa" },
  { name: "Chiara da Firenze", action: "ha attivato la garanzia soddisfatti o rimborsati", time: "8 min fa" }
];

export default function LandingPage({ settings, onCallToAction }: LandingPageProps) {
  // Destructure dynamic configurations
  const { price, originalPrice, spotsLeft, supportEmail, supportWhatsapp } = settings;

  // Countdown timer state
  const [countdown, setCountdown] = useState({ min: 14, sec: 59, ms: 99 });


  
  // Quiz states
  const [quizStep, setQuizStep] = useState<number>(0); // 0 = not started, 1, 2, 3 = questions, 4 = showing calculated score
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [isQuizCalculating, setIsQuizCalculating] = useState(false);

  // Social Proof notifications state
  const [activeNotifyIdx, setActiveNotifyIdx] = useState<number | null>(null);

  // Active chapter in interactive book preview
  const [activeChapter, setActiveChapter] = useState<number>(0);

  // FAQ accordion state variable to boost conversions
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Countdown effect (ticks standard minutes/seconds/milliseconds for heavy urgency)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.ms > 0) {
          return { ...prev, ms: prev.ms - 8 };
        } else if (prev.sec > 0) {
          return { ...prev, sec: prev.sec - 1, ms: 99 };
        } else if (prev.min > 0) {
          return { min: prev.min - 1, sec: 59, ms: 99 };
        } else {
          return { min: 14, sec: 59, ms: 99 }; // Loop around
        }
      });
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // Notifications slider logic
  useEffect(() => {
    const firstTrigger = setTimeout(() => {
      setActiveNotifyIdx(0);
    }, 4000);

    const notificationLoop = setInterval(() => {
      setActiveNotifyIdx(prev => {
        if (prev === null) return 0;
        if (prev >= PURCHASES_LOG.length - 1) return null; // hide temporary
        return prev + 1;
      });
    }, 14000);

    return () => {
      clearTimeout(firstTrigger);
      clearInterval(notificationLoop);
    };
  }, []);

  // Set answer and advance
  const handleQuizAnswer = (score: number) => {
    const updatedAnswers = [...quizAnswers, score];
    setQuizAnswers(updatedAnswers);
    
    if (quizStep < QUIZ_QUESTIONS.length) {
      setQuizStep(prev => prev + 1);
    } else {
      // Transition with beautiful loader to the final result
      setIsQuizCalculating(true);
      setTimeout(() => {
        setIsQuizCalculating(false);
        setQuizStep(QUIZ_QUESTIONS.length + 1);
      }, 1500);
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(1);
    setQuizAnswers([]);
  };

  // Derive Quiz statistics
  const totalScore = quizAnswers.reduce((a, b) => a + b, 0);
  const scorePercentage = Math.min(Math.round((totalScore / 9) * 100), 100);
  
  // Custom suggestion texts based on diagnosis
  let compressionLevel = "Basso-Moderato";
  let diagnosisText = "La tua colonna ha accumulato una tensione iniziale. Gli esercizi discreti da 10 minuti prevengono degenerazioni croniche della postura lavorativa.";
  let riskColor = "text-emerald-400";
  let riskBg = "bg-emerald-500/10 border-emerald-500/20";

  if (totalScore >= 7) {
    compressionLevel = "Critico Sevère (Rischio d'Ernia d'Ufficio)";
    diagnosisText = "I tuoi dischi vertebrali sono sottoposti a una compressione statica accoltellante prolungata. Il Protocollo è altissimamente caldeggiato per sbloccare la rigidità lombare ed evitare infiammazioni dei nervi prima che degenerino in condizioni severe.";
    riskColor = "text-red-400";
    riskBg = "bg-red-500/10 border-red-500/20";
  } else if (totalScore >= 4) {
    compressionLevel = "Moderato-Elevato (Schiacciamento Posturale)";
    diagnosisText = "La tua postura da seduto sta progressivamente schiacciando la colonna. Avvertire fitte mattutine dimostra disidratazione dei dischi. Il recupero naturale è facilissimo con la routine strategica del Dr. Marco.";
    riskColor = "text-amber-400";
    riskBg = "bg-amber-500/10 border-amber-500/20";
  }

  return (
    <div id="landing-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-violet-600 selection:text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 overflow-x-hidden">
      
      {/* ⚠️ LIVE FLOATING BANNER FOR SCARCITY TIMING */}
      <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-950 text-white text-xs py-2 px-4 sticky top-0 z-40 border-b border-violet-500/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="uppercase tracking-widest font-black text-[10px] bg-red-600 px-2 py-0.5 rounded text-white animate-pulse">OFFERTA LIMITATA</span>
            <span className="text-[11px] sm:text-xs">
              Attenzione: il prezzo promozionale di <strong className="text-yellow-300">€17</strong> riserverà l'accesso solo per pochi minuti!
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/70 py-1 px-3 rounded-lg border border-violet-400/30 font-mono">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-300 font-bold">L'OFFERTA SCADE TRA:</span>
            <span className="text-white font-black">
              {countdown.min.toString().padStart(2, '0')}:{countdown.sec.toString().padStart(2, '0')}.
              <span className="text-violet-400 text-[10px] ml-0.5">{countdown.ms.toString().padStart(2, '0')}s</span>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: EROICA / HERO SECTION (Slide 1) */}
      <section 
        id="section-hero" 
        className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden border-b border-violet-950/20 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(9, 12, 34, 0.85), rgba(5, 7, 20, 0.94)), url(${getDirectImageUrl("https://drive.google.com/file/d/1TlKJyjEEBj5wf1BKYJdkhvYdXkUsU9lh/view?usp=sharing")})`,
        }}
      >
        {/* Ambient atmospheric glow dots */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none opacity-20">
          <div className="absolute top-12 left-10 w-80 h-80 bg-violet-600 rounded-full blur-[140px] animate-pulse-glow" />
          <div className="absolute top-24 right-10 w-80 h-80 bg-indigo-600 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-15">
          
          <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
            {/* Top credibility seal tag */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-6 uppercase tracking-widest"
            >
              <Award className="w-4 h-4 text-violet-400" />
              <span>GUIDA DIGITALE IN FORMATO PDF</span>
            </motion.div>

            {/* Core Display Title mimicking visual mockup exactly */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white mb-2 leading-none">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-slate-200 via-white to-slate-400 uppercase">
                PROTOCOLLO
              </span>
              <span className="block text-violet-400 font-black uppercase mt-1 drop-shadow-2xl">
                SCHIENA LIBERA
              </span>
            </h1>

            {/* Subtext brand element reflecting Slide 1 title bar */}
            <div className="inline-block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold uppercase tracking-widest px-8 py-2 md:py-3 rounded-xl text-xs sm:text-base shadow-2xl border border-violet-500/40 my-4 transform -rotate-1">
              Metodo Naturale in 7 Giorni
            </div>

            {/* Core statement */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mt-6 font-medium leading-relaxed">
              Liberati dal dolore e dalla rigidità senza farmaci, anche con soli{' '}
              <span className="text-amber-400 font-black underline decoration-amber-400/50 decoration-2">10 minuti al giorno</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-6">
            
            {/* Column 1: Promotional Offer Details */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              
              <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/20">
                    <BookOpen className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-none">Pronto in Formato PDF Digitale</h4>
                    <p className="text-xs text-slate-400 mt-1">Disponibile per la lettura su Smartphone, Tablet ed eReader.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-800/80" />

                <ul className="space-y-3 text-xs sm:text-sm text-slate-300 pr-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>100% Naturale:</strong> Elimina rigidità e contratture senza antidolorifici.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Immediato d'Ufficio:</strong> Esercizi discreti pensati per chi sta seduto 6+ ore.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Illustrazioni HD:</strong> Schemi chiari e spiegazioni anatomiche precise e semplici.</span>
                  </li>
                </ul>

                <div className="h-[1px] bg-slate-800/80" />

                {/* Pricing module resembling high-conversion checkout blocks */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-slate-500 text-xs block line-through">Prezzo Standard: €{originalPrice}</span>
                    <span className="text-white text-3xl font-black tracking-tight flex items-center gap-2">
                      Solo €{price}
                      <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] px-2 py-0.5 uppercase font-bold rounded">
                        SCONTO 80%
                      </span>
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-extrabold text-xs animate-pulse">ULTIMI ACCESSI SCONTATI!</div>
                    <span className="text-slate-400 text-xs block mt-0.5">Disponibili: <strong className="text-white bg-slate-800 px-1.5 py-0.5 rounded font-bold font-mono text-[11px]">{spotsLeft}</strong></span>
                  </div>
                </div>
              </div>

              {/* Call-to-action yellow trigger and credit seals */}
              <div className="space-y-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCallToAction}
                  className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black tracking-tight text-xl py-4.5 px-8 rounded-xl shadow-2xl flex items-center justify-center gap-3 transition-all cursor-pointer border-b-4 border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  id="btn-hero-cta"
                >
                  <span className="uppercase font-sans font-black tracking-wide">SCARICA SUBITO IL PROTOCOLLO</span>
                  <ChevronRight className="w-5.5 h-5.5 stroke-[3px]" />
                </motion.button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-600" /> Transazione protetta a 256-bit
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" /> Accesso inviato all'istante via Email
                  </span>
                </div>
              </div>

            </div>

            {/* Column 2: Recreated High-End Graphics of Character and Round Seal Tag */}
            <div className="lg:col-span-6 relative order-1 lg:order-2 flex justify-center">
              
              {/* Premium Card containing the mock portrait */}
              <div className="relative w-full max-w-[440px] bg-[#0c1226]/90 rounded-2xl overflow-hidden border border-violet-500/25 shadow-2xl flex flex-col">
                
                {/* Image compartment: completely un-obscured upper section with taller 4/5 aspect ratio */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-950/40">
                  {/* Subtle vignette/glow behind the image for luxurious deep space feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10 pointer-events-none" />
                  
                  <img 
                    src={getDirectImageUrl("https://drive.google.com/file/d/14Rl-KGv5m1qFs5_yEJns7L0TLUwytbpb/view?usp=sharing")} 
                    alt="Protocollo Schiena Libera - Metodo naturale in 7 giorni" 
                    className="w-full h-full object-cover opacity-100 hero-image"
                    style={{ filter: 'brightness(1.08) contrast(1.02)', objectPosition: 'center 15%' }}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info compartment: clearly separated at the bottom to prevent covering the face on any viewport */}
                <div className="relative z-20 w-full bg-slate-950/95 border-t border-slate-900/60 p-3.5 flex flex-col gap-1.5">
                  <div>
                    <span className="inline-block bg-violet-500/20 text-violet-300 text-[8px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded border border-violet-500/25">
                      Metodo Naturale Certificato
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white leading-tight uppercase font-display mt-0.5 flex items-center gap-1">
                    PROTOCOLLO SCHIENA LIBERA
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Il piano strategico da 10 minuti per sciogliere la tensione lombare ed eliminare le fitte.
                  </p>
                </div>

                {/* Floating Round Seal Exact replication of Slide 1 */}
                <motion.div 
                  initial={{ rotate: -6 }}
                  animate={{ rotate: 6 }}
                  transition={{ repeat: Infinity, repeatType: 'reverse', duration: 3.5, ease: 'easeInOut' }}
                  onClick={onCallToAction}
                  className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 z-25 w-32 h-32 sm:w-36 sm:h-36 bg-gradient-to-tr from-yellow-400 update to-amber-500 p-[1.5px] rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
                >
                  <div className="w-full h-full bg-[#5b21b6] rounded-full flex flex-col items-center justify-center text-center p-2 border-4 border-[#fbbf24]">
                    <span className="text-[9px] text-yellow-300 font-extrabold tracking-widest uppercase leading-none">METODO</span>
                    <span className="text-[9px] text-yellow-300 font-extrabold tracking-widest uppercase leading-none mt-0.5">TESTATO SU</span>
                    <span className="text-lg sm:text-xl text-white font-black leading-none my-1 font-mono">2000+</span>
                    <span className="text-[7.5px] text-yellow-200 font-bold tracking-widest uppercase leading-none">PROFESSIONISTI</span>
                  </div>
                </motion.div>
                
              </div>
              
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: BASTA SOFFRIRE IN SILENZIO (Slide 2) */}
      <section id="section-pain" className="py-16 md:py-24 bg-slate-950 relative border-b border-violet-950/20">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display mb-3 uppercase tracking-tight">
              BASTA SOFFRIRE IN SILENZIO
            </h2>
            <p className="text-lg text-violet-300 font-medium">
              Se trascorri molte ore al giorno seduto e soffri di stanchezza fisica, leggi con attenzione.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Pain Image Representation (recreating Slide 2) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[465px] aspect-square rounded-2xl overflow-hidden border border-red-500/20 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-10" />
                
                {/* Professional sitting at his office desk experiencing severe back and postural stiffness */}
                <div className="absolute inset-0">
                  <img 
                    src={getDirectImageUrl("https://drive.google.com/file/d/1lqoAbPM_xgiHqJN8htzRX_GMOnoCHX0s/view?usp=sharing")} 
                    alt="Lavoratore con mal di schiena e stress da ufficio" 
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Alarm block warning banner */}
                <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-950/95 border border-red-500/30 p-4 rounded-xl shadow-2xl">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <AlertCircle className="w-4 h-4 text-red-500 animate-bounce" />
                    <span>Postura statica prolungata</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Stare seduti provoca uno schiacciamento asimmetrico continuo che disidrata i dischi lombari, bloccando l'afflusso naturale dei liquidi lubrificanti.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Pain statements mimicking the core bulletin of Slide 2 */}
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 uppercase tracking-tight leading-snug">
                Soffri regolarmente di uno di questi sintomi fastidiosi?
              </h3>

              <div className="space-y-4">
                {[
                  { text: "Rigidità mattutina che ti blocca", desc: "Svegliarsi rigidi come un tronco di legno e impiegare ore anche solo per allacciarsi le scarpe." },
                  { text: "Dolore lombare acuto dopo ore al laptop", desc: "Quella sgradevole, sorda e insistente tensione che sorge dopo pranzo e logora la tua concentrazione." },
                  { text: "Difficoltà ad alzarsi fluidamente dalla sedia", desc: "Dover tenersi i fianchi doloranti per i primi passi sperando che le vertebre ritrovino la postura." },
                  { text: "Insonnia frequente per disagio posturale", desc: "Continuare a rigirarsi alla ricerca dell'angolo ideale, svegliandosi stanchi e svuotati di energia." }
                ].map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-red-500/25 transition-all group"
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 mt-1 shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
                    <div>
                      <h4 className="font-extrabold text-white text-base tracking-tight">{item.text}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Statistic verification banner */}
              <div className="bg-slate-900/60 border border-slate-800/85 rounded-xl p-4 text-center text-slate-300 font-medium text-xs sm:text-sm">
                📢 <span className="text-indigo-400 font-bold">Istruttoria Epidemiologica:</span> Più dell'82% dei copywriter, ingegneri, e impiegati d'ufficio italiani soffre di compressione discale silente.
              </div>
              
            </div>

          </div>

        </div>
      </section>

      {/* 📊 NEW COMPATIBLE INTERACTIVE VALUE TRIGGER: DIAGNOSTIC SELF-PRACTICE TEST */}
      <section id="interactive-quiz" className="py-16 bg-[#0a071c] border-b border-violet-950/30 relative">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-8">
            <span className="bg-violet-600/10 text-violet-400 border border-violet-500/20 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
              TEST INTERATTIVO VELOCE
            </span>
            <h2 className="text-2.5xl sm:text-4xl font-black text-white uppercase mt-3 leading-tight font-display">
              TEST DI COMPRESSIONE VERTEBRALE
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl mx-auto">
              Analizza lo stato della tua salute colonna vertebrale in 3 domande per calcolare il tuo rischio di infiammazione discale.
            </p>
          </div>

          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl" />

            {quizStep === 0 && (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 bg-violet-600/20 text-violet-400 border border-violet-500/35 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Activity className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white uppercase">Inizia il Test Rapido</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Il test calcola quanto la tua postura quotidiana incide sulla colonna lombare. Richiede meno di 45 secondi ed elabora un consiglio personalizzato Dr. Marco.
                  </p>
                </div>
                <button
                  onClick={() => setQuizStep(1)}
                  className="bg-violet-600 hover:bg-violet-500 text-white text-xs uppercase font-extrabold py-3 px-8 rounded-xl tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Inizia Diagnosi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Questions Step */}
            {quizStep > 0 && quizStep <= QUIZ_QUESTIONS.length && (
              <div className="space-y-6">
                {/* Progress bar info */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Domanda {quizStep} di {QUIZ_QUESTIONS.length}</span>
                  <span>Avanzamento: {Math.round(((quizStep - 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
                </div>
                
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-violet-500 h-full transition-all duration-300"
                    style={{ width: `${((quizStep) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-extrabold text-base md:text-lg text-white">
                    {QUIZ_QUESTIONS[quizStep - 1].q}
                  </h3>
                  
                  <div className="space-y-2.5">
                    {QUIZ_QUESTIONS[quizStep - 1].options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleQuizAnswer(opt.score)}
                        className="w-full bg-slate-950/70 hover:bg-violet-950/20 border border-slate-800 hover:border-violet-500/30 text-left text-xs sm:text-sm p-4 rounded-xl text-slate-200 transition-all cursor-pointer font-medium flex justify-between items-center group"
                      >
                        <span>{opt.text}</span>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (quizStep > 1) {
                      setQuizStep(prev => prev - 1);
                      setQuizAnswers(prev => prev.slice(0, -1));
                    } else {
                      setQuizStep(0);
                    }
                  }}
                  className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Indietro
                </button>
              </div>
            )}

            {/* Calculation phase */}
            {isQuizCalculating && (
              <div className="text-center py-10 space-y-4">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-violet-300 font-mono tracking-widest uppercase">Elaborazione Bio-Posturale in corso...</p>
              </div>
            )}

            {/* Quiz Result Block */}
            {quizStep === QUIZ_QUESTIONS.length + 1 && !isQuizCalculating && (
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl border ${riskBg} flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-1.5 text-[7px] font-mono text-slate-500 uppercase">Diagnostica Veloce</div>
                  <span className="text-[10px] uppercase font-mono tracking-wide text-slate-400">Stato di Compressione</span>
                  <div className={`text-xl sm:text-2xl font-black ${riskColor} uppercase tracking-tighter`}>
                    {compressionLevel}
                  </div>
                  <div className="text-xs text-slate-300 max-w-lg leading-relaxed font-semibold mt-1">
                    {diagnosisText}
                  </div>
                </div>

                <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-850 space-y-2">
                  <h4 className="text-xs uppercase font-extrabold text-white flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Routine Risolutiva Caldeggiata:
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                    Il <strong>Protocollo Schiena Libera</strong> è tarato esattamente sul tuo livello di compressione. Ti fornirà movimenti de-compressivi che allineano i corpi vertebrali richiamando il nutrimento naturale ai dischi spinali per cancellare dolore e costrizioni d'ufficio.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4">
                  <button
                    onClick={handleResetQuiz}
                    className="text-xs text-slate-450 hover:text-slate-300 underline cursor-pointer"
                  >
                    Ripeti il test diagnostico
                  </button>

                  <button
                    onClick={onCallToAction}
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-black uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg border-b-2 border-yellow-600 font-sans"
                    id="btn-quiz-cta"
                  >
                    <span>Ottieni il Protocollo (€17)</span>
                    <ChevronRight className="w-4.5 h-4.5 stroke-[3px]" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* SECTION 3: ECCO LA SOLUZIONE CHE FUNZIONA (Slide 3) */}
      <section id="section-solution" className="py-16 md:py-24 bg-gradient-to-r from-slate-950 via-[#0E0B1F] to-slate-950 relative border-b border-violet-950/20">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-none flex flex-col sm:flex-row items-center justify-center gap-1">
              <span className="text-violet-400">ECCO LA SOLUZIONE</span>
              <span>CHE FUNZIONA</span>
            </h2>
            <p className="text-lg text-slate-300 mt-3 font-medium">
              Il Protocollo Schiena Libera cura la causa biologica alla base dell'irrigidimento.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Core 4 Checkboxes (Slide 3) */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <p className="text-base text-slate-300 leading-relaxed font-medium">
                Dimentica costose sedute infinite di massoterapia, sedativi temporanei o faticosi attrezzi fitness d'ingombro. Questo manuale ti regala sollievo immediato agendo sulla flessibilità e lo spurgo dei dischi lombari:
              </p>

              <div className="space-y-4">
                {[
                  { title: "Solo 10 minuti di orologio", detail: "Routine rapidissime strutturate per essere eseguite comodamente a casa tua appena ti svegli o prima di dormire." },
                  { title: "Esercizi discreti applicabili in sedia d'ufficio", detail: "Movimenti leggeri, eleganti e non visibili ad altri, ideali per rimettere in circolo l'acqua vertebrale a metà mattina." },
                  { title: "Nessun attrezzo sportivo richiesto", detail: "Cura la tua colonna ovunque tu sia, senza pesi, fasce elastiche o tappeti ingombranti." },
                  { title: "Risultati clinici concreti in 7 giorni", detail: "La sequenza studiata toglie il carico di schiacciamento ristabilendo la de-compressione e diminuendo la morsa dolorosa." }
                ].map((checkbox, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    key={idx}
                    className="flex gap-4 p-4 rounded-xl bg-violet-950/10 border border-violet-500/20 hover:border-violet-500/35 transition-all group"
                  >
                    <div className="w-6.5 h-6.5 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-md">
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base tracking-tight">{checkbox.title}</h4>
                      <p className="text-xs text-slate-450 mt-1 leading-relaxed">{checkbox.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 text-white rounded-xl p-4.5 text-center font-black text-xs sm:text-sm shadow-xl border border-violet-500/30">
                ✅ Soddisfazione Clinica: Oltre 2.000 lavoratori digitali hanno rigenerato la colonna a casa propria!
              </div>
            </div>

            {/* Right Column: Google Drive Solution Image (Slide 3) */}
            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-[430px] aspect-square rounded-2xl overflow-hidden border border-violet-500/25 shadow-2xl bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10 pointer-events-none" />
                
                {/* Provided Google Drive Image with high visibility */}
                <div className="absolute inset-0">
                  <img 
                    src={getDirectImageUrl("https://drive.google.com/file/d/1hm_nXM9NdwVPLnbuZqz_d2PIkS1JKh6f/view?usp=sharing")} 
                    alt="Libertà dal dolore" 
                    className="w-full h-full object-cover opacity-100"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="absolute bottom-4 right-4 z-20 bg-emerald-600/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-emerald-400/30">
                  Libertà dal dolore
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3.5: COSA C'È DENTRO IL MANUALE PDF (References from the book) */}
      <section id="section-inside-book" className="py-16 md:py-24 bg-gradient-to-b from-slate-950 to-[#0e0b1f] relative border-b border-violet-950/20">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <span className="bg-violet-500/15 text-violet-300 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider border border-violet-500/25 inline-block mb-3.5">
              📖 SGUARDO ALL'INTERNO DEL MANUALE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-none mb-4">
              COSA TROVERAI NEL LIBRO <span className="text-amber-400">PDF</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
              Esplora i capitoli chiave ricreati fedelmente dal libro "Protocollo Schiena Libera". Un approccio posturale collaudato pronto da scaricare istantaneamente sul tuo smartphone o PC:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left side: Interactive Chapter Tabs */}
            <div className="lg:col-span-5 flex flex-col gap-3 justify-center">
              {[
                { 
                  num: "01", 
                  title: "La Trappola della Sedentarietà", 
                  sub: "La biologia dello schiacciamento vertebrale" 
                },
                { 
                  num: "02", 
                  title: "I 10 Minuti di Scarico Attivo", 
                  sub: "La routine dinamica invisibile" 
                },
                { 
                  num: "03", 
                  title: "Idratazione e Spurgo dei Dischi", 
                  sub: "Migliorare la flessibilità alle vertebre L4-L5" 
                },
                { 
                  num: "04", 
                  title: "Manutenzione del Benessere", 
                  sub: "Postura notturna e stanchezza fisica" 
                }
              ].map((chap, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveChapter(i)}
                  className={`text-left p-4.5 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer relative group ${
                    activeChapter === i 
                      ? "bg-violet-950/40 border-violet-500/50 shadow-xl" 
                      : "bg-[#0b0c16]/50 border-slate-900 hover:border-violet-500/20 hover:bg-slate-900/40"
                  }`}
                >
                  {activeChapter === i && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-violet-500 rounded-r-full" />
                  )}
                  <span className={`font-mono text-xl font-black shrink-0 transition-colors duration-300 ${
                    activeChapter === i ? "text-violet-400" : "text-slate-600"
                  }`}>
                    {chap.num}
                  </span>
                  <div>
                    <h4 className={`font-extrabold text-base transition-colors duration-300 ${
                      activeChapter === i ? "text-white" : "text-slate-300 group-hover:text-white"
                    }`}>
                      {chap.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {chap.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Right side: Detailed chapter preview representing Slide references */}
            <div className="lg:col-span-7">
              <div className="bg-[#111325]/95 border border-slate-800/80 rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                {/* Background ambient lighting */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-violet-600/5 rounded-full blur-[80px]" />
                
                <AnimatePresence mode="wait">
                  {activeChapter === 0 && (
                    <motion.div
                      key={0}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded">Capitolo 1</span>
                          <span className="text-slate-500 text-xs font-mono">• Autore: Dr. Marco Wellness</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          Come la Sedia dell'Ufficio Distrugge Silenziosamente il Tuo Fisico
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                          Nelle prime pagine del bestseller posturale, analizzeremo il motivo scientifico per cui stare seduti consecutivamente oltre i 40 minuti agisce come uno spremitore idraulico sui dischi lombari.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                          Imparerai a reconocer i 3 campanelli d'allarme critici che segnalano una compressione midollare grave prima che si trasformi in una ernia invalidante o in dolori acuti alle gambe.
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-800/80 space-y-3">
                        <h5 className="text-[11px] font-mono font-bold tracking-widest text-[#fbbf24] uppercase">COSA SVELERÀ IL CAPITOLO:</h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Il calcolatore biologico del carico vertebrale
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Perché lo stretching "standard" peggiora l'infiammazione
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> L'asse asimmetrico del collo e delle spalle
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Esami posturali che puoi fare in 3 minuti a casa
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeChapter === 1 && (
                    <motion.div
                      key={1}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded">Capitolo 2</span>
                          <span className="text-slate-500 text-xs font-mono">• Accessibile & Rapido</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          La Routine Invisibile dei 10 Minuti che Puoi Fare in Sedia
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                          Questo capitolo svela la routine biocombinatoria brevettata dal Dr. Marco Wellness. Sono movimenti biomeccanici micrometrici progettati per essere eseguiti alla propria postazione, senza farsi notare dai colleghi o dal capo.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                          La combinazione agisce invertendo istantaneamente il baricentro sui dischi vertebrali, dando sollievo duraturo e stimolando una respirazione polmonare profonda per combattere la stanchezza mentale.
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-800/80 space-y-3">
                        <h5 className="text-[11px] font-mono font-bold tracking-widest text-[#fbbf24] uppercase">COSA SVELERÀ IL CAPITOLO:</h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> La routine oraria de-stress da 60 secondi
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> De-tensionamento lombare seduto
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Allineamento spalle anti-gobba da ufficio
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Lo schema di digitopressione per mal di testa miotensivo
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeChapter === 2 && (
                    <motion.div
                      key={2}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded">Capitolo 3</span>
                          <span className="text-slate-500 text-xs font-mono">• Idratare e Nutrire</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          Idratare e Nutrire i Dischi Spianati alle Vertebre Lombari L4-L5
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                          La parte centrale e più preziosa del libro descrive l'idratazione discale profonda. Imparerai l'esercizio clinico unico che agisce come una "spugna biologica", attirando fluidi ricchi di nutrienti e ossigeno all'interno delle articolazioni intervertebrali irrigidite.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                          Con immagini ad alta definizione del nostro character che esegue lo scarico cinetico a casa propria, sarai guidato passo-passo senza alcun rischio di errore.
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-800/80 space-y-3">
                        <h5 className="text-[11px] font-mono font-bold tracking-widest text-[#fbbf24] uppercase">COSA SVELERÀ IL CAPITOLO:</h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Lo scarico cinetico notturno prima di dormire
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Posizioni per sbloccare la morsa del nervo sciatico
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Rigenerazione articolazioni L4, L5 e S1
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Le 3 posizioni anti-compressione nel weekend
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeChapter === 3 && (
                    <motion.div
                      key={3}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6 flex flex-col justify-between h-full"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded">Capitolo 4</span>
                          <span className="text-slate-500 text-xs font-mono">• Sonno Sereno a Vita</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                          Prevenire le Ricadute e Raggiungere un Sonno REM Riposante
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                          La postura corretta durante il sonno è cruciale per bloccare per sempre la ricaduta della rigidità posturale. Questo capitolo svela i corretti allineamenti cuscino-materasso adatti per chi dorme sul fianco, pancia in su o pancia in giù.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                          Scaricando il corpo dalle tensioni cumulate durante la giornata lavorativa, regalerai al tuo cervello intere notti di sonno REM continuo e rigenerazione biologica.
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-800/80 space-y-3">
                        <h5 className="text-[11px] font-mono font-bold tracking-widest text-[#fbbf24] uppercase">COSA SVELERÀ IL CAPITOLO:</h5>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> La regola d'oro dei 3 cuscini biomeccanici
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Posture serali per disattivare il sistema simpatico
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Evitare il torcicollo da ventilatori o aria condizionata
                          </li>
                          <li className="flex items-center gap-2 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Autotest di flessibilità lombare mensile
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: RISULTATI GARANTITI IN 7 GIORNI (Slide 4 - Horizontal Cards) */}
      <section id="section-guarantees" className="py-16 md:py-24 bg-slate-950 relative border-b border-violet-950/20">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-none">
              RISULTATI GARANTITI IN 7 GIORNI
            </h2>
            <p className="text-lg text-slate-300 mt-3 font-medium">
              Sperimenta i rapidi miglioramenti biologici della decompressione spinale giorno per giorno:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1: Pain reduction */}
            <div className="bg-[#111325]/90 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between hover:border-violet-500/30 transition-all group relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/15 transition-all" />
              
              <div className="space-y-4 relative z-10">
                {/* Book Reference Photo 1 */}
                <div className="h-32 rounded-xl overflow-hidden relative border border-slate-800/50">
                  <img 
                    src="https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=400&h=200&q=80" 
                    alt="De-compressione facciale della schiena a terra" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex gap-3.5 items-center">
                  <div className="inline-flex p-2.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight uppercase leading-none">
                      RIDUCI IL DOLORE D'80%
                    </h3>
                    <p className="text-[10px] text-slate-450 mt-1 uppercase tracking-widest font-mono">
                      Svegliati senza le fitte
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                  I legamenti e la fascia muscolare si allungano de-comprimendo i centri nervosi, cancellando quel fastidioso blocco rigido del mattino.
                </p>
              </div>
            </div>

            {/* Box 2: Concentration & Energy */}
            <div className="bg-[#111325]/90 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between hover:border-violet-500/30 transition-all group relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/15 transition-all" />
              
              <div className="space-y-4 relative z-10">
                {/* Book Reference Photo 2 */}
                <div className="h-32 rounded-xl overflow-hidden relative border border-slate-800/50">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&h=200&q=80" 
                    alt="Alta concentrazione senza torcicollo" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex gap-3.5 items-center">
                  <div className="inline-flex p-2.5 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/25">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight uppercase leading-none">
                      CONCENTRAZIONE MASSIMA
                    </h3>
                    <p className="text-[10px] text-slate-450 mt-1 uppercase tracking-widest font-mono">
                      Lavora sgombro da morsa
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                  Eliminare la morsa dolorosa costante sul midollo spinale abbassa l'irritabilità emotiva e rinvigorisce l'energia lavorativa mentale.
                </p>
              </div>
            </div>

            {/* Box 3: Sleep */}
            <div className="bg-[#111325]/90 rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between hover:border-violet-500/30 transition-all group relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/15 transition-all" />
              
              <div className="space-y-4 relative z-10">
                {/* Book Reference Photo 3 */}
                <div className="h-32 rounded-xl overflow-hidden relative border border-slate-800/50">
                  <img 
                    src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&h=200&q=80" 
                    alt="Sonno REM profondo" 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex gap-3.5 items-center">
                  <div className="inline-flex p-2.5 rounded-lg bg-[#c084fc]/15 text-[#c084fc] border border-[#c084fc]/25">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight uppercase leading-none">
                      SONNO DEEP REM SERENO
                    </h3>
                    <p className="text-[10px] text-slate-450 mt-1 uppercase tracking-widest font-mono">
                      Notti riposanti continuative
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800">
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                  Posturare la schiena libera prima di coricarsi scarica le contratture lombari diurne, regalandoti un sonno profondo e continuativo.
                </p>
              </div>
            </div>

          </div>

          {/* Refund guarantee verification strip */}
          <div className="mt-10 bg-gradient-to-r from-[#0d152a] to-[#16122b] border-2 border-dashed border-violet-500/30 rounded-2xl p-6 text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-center shadow-xl">
            <div className="bg-amber-400 text-slate-950 p-2.5 rounded-full shadow-lg shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-white text-center sm:text-left uppercase">
                SODDISFATTO O RIMBORSATO AL 100% SENZA OBIEZIONI
              </p>
              <p className="text-xs sm:text-sm text-slate-400 text-center sm:text-left mt-0.5">
                Segui il Protocollo per 7 giorni. Se non avverti una schiena elastica e decondizionata dal dolore, invia una mail ed ottieni il rimborso instantaneo dei tuoi €17.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5: CHI È IL DR. MARCO WELLNESS (Slide 5) */}
      <section id="section-author" className="py-16 md:py-24 bg-gradient-to-b from-[#0c0d1b] to-slate-950 relative border-b border-violet-950/20">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display mb-3 uppercase tracking-tight">
              CHI È DR. MARCO WELLNESS
            </h2>
            <p className="text-lg text-violet-300 font-medium">
              Fisioterapista & Ergonomo Certificato dei Lavoratori Sedentari
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: CV Credentials (Slide 5) */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-base text-slate-300 leading-relaxed font-medium">
                Il Dr. Marco Wellness ha sviluppato questo approccio scientifico dopo anni di ricerca clinica unita alla pratica manuale su centinaia di impiegati sedentari:
              </p>

              <div className="space-y-4">
                {[
                  "15+ anni di trattamenti fisici su videoterminalisti",
                  "Consulente per la postura lavorativa di aziende Fortune 500",
                  "Specializzazione accademica in Ergonomia Posturale Clinica",
                  "Autore di 3 bestseller scientifici sul benessere biologico d'ufficio",
                  "Ideatore unico dello schema biocombinatorio di 10 minuti"
                ].map((point, index) => (
                  <div key={index} className="flex gap-3.5 items-center p-3.5 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-violet-500/20 transition-all">
                    <div className="w-5 h-5 rounded-full bg-violet-600/10 text-violet-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3.5px]" />
                    </div>
                    <span className="text-sm font-bold text-slate-200 tracking-tight">{point}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#10192e] rounded-xl p-4.5 border border-violet-500/20 text-center text-slate-300 text-xs sm:text-sm">
                📈 <span className="font-bold text-violet-300">Evidenza Medica:</span> Metodologia strutturata testata su <span className="underline text-white font-bold">oltre 2.000 casi studio reali</span> con un tasso clinico di sollievo superiore al <span className="text-emerald-400 font-black text-base">94%</span>.
              </div>
            </div>

            {/* Right Column: Character professional doctor jacket mockup (Slide 5) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[430px] aspect-square rounded-2xl overflow-hidden border border-violet-500/25 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
                
                {/* Same character representing Dr. Marco Wellness */}
                <div className="absolute inset-0">
                  <img 
                    src={getDirectImageUrl("https://drive.google.com/file/d/1k4lZWzL1va88jqwmy2vI7veDUVSLDyMQ/view?usp=sharing")} 
                    alt="Dr. Marco Wellness in camice bianco clinico" 
                    className="w-full h-full object-cover opacity-85"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-slate-800 p-3.5 rounded-xl backdrop-blur-sm z-20 shadow-2xl">
                  <div className="font-bold text-white text-xs">Dr. Marco Wellness</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Operante a Roma e Milano • Regolamento Albo Fisioterapia Clinica N° 458</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: TESTIMONIANZE */}
      <section id="section-testimonials" className="py-16 md:py-24 bg-slate-950 relative border-b border-violet-950/20">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="bg-violet-500/10 text-violet-400 text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded border border-violet-500/20">
              Storie di Successo
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight mt-4 leading-none">
              COSA DICONO I NOSTRI CLIENTI
            </h2>
            <p className="text-base text-slate-400 mt-3 max-w-xl mx-auto">
              L'esperienza reale di chi ha ritrovato il benessere e dimenticato il dolore lombare grazie al protocollo naturale.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-[700px] rounded-2xl overflow-hidden border border-violet-500/25 shadow-2xl bg-slate-900/40 p-2 sm:p-3">
              <img 
                src={getDirectImageUrl("https://drive.google.com/file/d/1SBbbnov5V8hTvO483vi-p04DqQD9FAwR/view?usp=sharing")} 
                alt="Cliente soddisfatto" 
                className="testimonial-image w-full h-auto rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Testimonianze reali ad alto tasso di conversione */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Card 1 */}
            <div className="bg-slate-900/40 border border-violet-500/15 p-6 rounded-2xl flex flex-col justify-between hover:border-violet-500/30 transition-all duration-300 shadow-lg">
              <div>
                <div className="flex text-amber-400 gap-1 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "Ero scettico all'inizio, ma questo protocollo mi ha cambiato la vita. Lavoro seduto 9 ore al giorno e la sera non riuscivo nemmeno ad alzarmi dal divano. Già dal terzo giorno le fitte sono svanite completamente e sento la schiena rinata."
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-white text-xs font-bold leading-none">Matteo R.</div>
                  <div className="text-violet-400 text-[10px] mt-1.5">Sviluppatore Software • Milano</div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Verificato
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/40 border border-violet-500/15 p-6 rounded-2xl flex flex-col justify-between hover:border-violet-500/30 transition-all duration-300 shadow-lg">
              <div>
                <div className="flex text-amber-400 gap-1 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "Ho speso centinaia di euro in fisioterapia, massaggi ed osteopati che davano sollievo solo temporaneo. Con questo manuale bastano 10 minuti di routine la mattina direttamente a casa. Libera dai dolori e leggerissima tutto il giorno!"
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-white text-xs font-bold leading-none">Elena S.</div>
                  <div className="text-violet-400 text-[10px] mt-1.5">Responsabile Marketing • Bologna</div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Verificato
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/40 border border-violet-500/15 p-6 rounded-2xl flex flex-col justify-between hover:border-violet-500/30 transition-all duration-300 shadow-lg">
              <div>
                <div className="flex text-amber-400 gap-1 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "Un approccio scientifico incredibile con un'immediatezza disarmante. Le illustrazioni e le spiegazioni sono chiarissime. Il mio dolore lombare cronico si è ridotto del 90% in soli 7 giorni. Vale ogni singolo centesimo!"
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div>
                  <div className="text-white text-xs font-bold leading-none">Francesco P.</div>
                  <div className="text-violet-400 text-[10px] mt-1.5">Architetto Posturale • Roma</div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Verificato
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: INIZIA OGGI LA TUA TRASFORMAZIONE (Slide 6 - CTA CLOSING) */}
      <section id="section-closing" className="py-20 bg-gradient-to-b from-slate-950 via-[#130E29] to-[#07040f] border-t border-violet-950/30 relative">
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-violet-600 rounded-full blur-[130px] animate-pulse-glow" />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">

           {/* Visual Banner - Inizia oggi la tua trasformazione */}
          <div className="mb-10 flex justify-center">
            <div className="relative w-full max-w-[680px] rounded-2xl overflow-hidden border border-[#1e1a38] shadow-2xl bg-slate-950">
              <img 
                src={getDirectImageUrl("https://drive.google.com/file/d/1DHpXEORQGwiBsD4XHEglsJhQaoFlT_FQ/view?usp=sharing")} 
                alt="Inizia oggi la tua trasformazione" 
                className="w-full h-auto object-cover opacity-100"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-950/90 backdrop-blur-md max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl border-2 border-violet-500/30 shadow-2xl space-y-8 relative"
          >
            {/* Urgency countdown indicator inside the purchase block */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-red-500/30 whitespace-nowrap">
              SOLO COMPRANDO ORA RISERVI IL PREZZO SCONTATO
            </div>

            <div className="pt-2">
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase leading-none" id="header-final-cta">
                INIZIA OGGI LA TUA TRASFORMAZIONE
              </h2>
              <p className="text-amber-400 font-extrabold uppercase tracking-widest text-xs sm:text-sm mt-3 animate-pulse">
                NON ASPETTARE CHE LA RIGIDITÀ POSTURALE PEGGIORI
              </p>
            </div>

            {/* IRRESISTIBLE VALUE STACK: DIRECT BUNDLE CONVERSION */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 text-left max-w-2xl mx-auto space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="font-extrabold text-slate-100 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  COSA RICEVERAI IMMEDIATAMENTE:
                </h4>
                <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                  Accesso a vita
                </span>
              </div>

              <div className="space-y-3">
                {/* Product 1 */}
                <div className="flex gap-3 items-start bg-slate-950/40 p-3 rounded-xl border border-slate-800/50">
                  <div className="bg-amber-400 text-slate-950 p-2 rounded-lg shrink-0 shadow-md">
                    <BookOpen className="w-5 h-5 stroke-[2.5px]" />
                  </div>
                  <div>
                    <div className="flex justify-between items-baseline gap-2 flex-wrap sm:flex-nowrap">
                      <p className="font-black text-white text-xs sm:text-sm">📖 Manuale PDF "Protocollo Schiena Libera"</p>
                      <span className="text-slate-500 text-[10px] line-through font-mono">Valore €47.00</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">La guida strategica passo-passo del Dr. Marco per rilassare la colonna lombare in soli 7 giorni con schemi clinici.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-350">
                  Prezzo Standard: <span className="line-through text-slate-500 font-extrabold">€47.00</span> • Oggi sblocchi l'accesso a soli <span className="text-amber-400 font-black text-sm">€17.00!</span>
                </p>
              </div>
            </div>

            {/* COMPARISON MATRIX ("Quanto vale NON soffrire più?") */}
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Mettiamo le opzioni sul tavolo con onestà:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl text-left space-y-1.5 opacity-75">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase">
                    <AlertCircle className="w-4 h-4" /> Antidolorifici
                  </div>
                  <div className="text-sm font-black text-white">€15 - €30 / mese</div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Curano solo il sintomo, danneggiano fegato e stomaco, e il blocco ritorna peggiore di prima.
                  </p>
                </div>

                <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl text-left space-y-1.5 opacity-75">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase">
                    <AlertCircle className="w-4 h-4" /> Fisioterapisti
                  </div>
                  <div className="text-sm font-black text-white">€70 - €120 / seduta</div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Spesa folle e ripetitiva a vita se continui a stare seduto nello stesso identico modo d'ufficio.
                  </p>
                </div>

                <div className="bg-violet-950/20 border-2 border-violet-500/30 p-4 rounded-xl text-left space-y-1.5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-slate-950 px-2 py-0.5 text-[7.5px] font-black uppercase tracking-wider rounded-bl-lg">
                    Consigliato
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Il Protocollo
                  </div>
                  <div className="text-sm font-black text-white">€17 o 3 Rate da €5.67</div>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    La soluzione naturale, definitiva e discreta. Pagabile anche in 3 rate senza interessi con Klarna o PayPal.
                  </p>
                </div>
              </div>
            </div>

            {/* THE DECISIVE CROSSROAD ("Sei a un bivio") */}
            <div className="bg-slate-900/40 p-6 rounded-2xl border border-violet-500/10 text-left max-w-2xl mx-auto space-y-4">
              <h3 className="text-center font-extrabold text-[#fbbf24] text-xs uppercase tracking-widest">
                ⚓ ORA SEI AD UN BIVIO DECISIVO. HAI SOLO DUE STRADE:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950/80 p-4.5 rounded-xl border border-red-500/10 text-xs text-slate-400 space-y-2">
                  <div className="text-red-400 font-black uppercase text-[10px] tracking-wider leading-none flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> Strada A (Non agire):
                  </div>
                  <p className="leading-relaxed">
                    Lasciare la pagina. Continuare a ignorare la rigidità, usare farmaci e sopportare fitte sorde che logorano la concentrazione sul lavoro, attendendo il prossimo blocco lombare invalidante.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-4.5 rounded-xl border border-emerald-500/20 text-xs text-slate-300 space-y-2 relative shadow-md">
                  <div className="text-emerald-400 font-black uppercase text-[10px] tracking-wider leading-none flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3px]" /> Strada B (Agire a Rischio Zero):
                  </div>
                  <p className="leading-relaxed">
                    Investire <strong>€17</strong> oggi (meno di una pizza con gli amici), sbloccare il protocollo a vita, ritrovare una schiena flessibile ed elastica, coperto dalla garanzia soddisfatti o rimborsati.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-slate-500 text-xs sm:text-sm line-through block">Valore originario del pacchetto: €{originalPrice}</span>
                <div className="text-4xl sm:text-5xl font-sans font-black text-white flex items-center justify-center gap-2.5">
                  Solo €{price}
                  <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded uppercase font-bold tracking-widest leading-none">
                    Offerta Limitata
                  </span>
                </div>
              </div>
              


              <div className="py-2">
                <p className="text-xs sm:text-sm text-slate-200 font-extrabold flex items-center justify-center gap-1.5 bg-slate-900/40 py-2 px-4 rounded-xl border border-slate-800/80 max-w-md mx-auto">
                  <span className="text-emerald-400 animate-pulse text-base">●</span>
                  <span>O paga in <strong className="text-amber-400">3 rate da €5.67</strong> senza interessi con Klarna o PayPal</span>
                </p>
              </div>

              <p className="text-xs text-slate-400 font-medium pt-1">
                Paga una sola volta. Nessun rinnovo mensile. Accesso ed aggiornamenti a vita.
              </p>
            </div>

            {/* Big Closing Yellow Trigger Button */}
            <div className="max-w-md mx-auto space-y-3 pt-2">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onCallToAction}
                className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black tracking-tight text-xl py-5 rounded-xl shadow-2xl flex items-center justify-center gap-3 transition-all cursor-pointer border-b-4 border-amber-600 group"
                id="btn-final-closing-cta"
              >
                <span className="uppercase tracking-wide font-black">INIZIA LA TUA TRASFORMAZIONE</span>
                <ChevronRight className="w-5.5 h-5.5 stroke-[3.5px] group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-medium gap-3 pt-3 border-t border-slate-900/80">
                <span className="text-red-400 font-black bg-red-950/30 border border-red-500/20 px-2.5 py-1 rounded animate-pulse">
                  ⚠️ Offerta attiva per i prossimi 100 clienti (Rimasti solo {spotsLeft}!)
                </span>
                <span className="flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Soddisfatto o rimborsato entro 30 giorni
                </span>
              </div>
            </div>

          </motion.div>

          {/* FAQS AREA COMPONENT - SQUEEZING MAXIMUM OBJECTIONS OUT OF THE CONVERTED VISITOR */}
          <div className="max-w-3xl mx-auto mt-20 text-left space-y-6">
            <div className="text-center">
              <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded inline-block">
                Domande Frequenti (FAQ)
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-display mt-3 tracking-tight">
                DUBBI? ABBIAMO LE RISPOSTE
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                Prima di fare la tua scelta sicura a rischio zero, leggi le domande più frequenti poste dai nostri clienti prima dell'acquisto.
              </p>
            </div>

            <div className="space-y-3 pt-3">
              {[
                {
                  q: "È adatto a chi ha già un'ernia o una protrusione lombare?",
                  a: "Assolutamente sì. Gli esercizi di de-compressione sono naturali, statici e mirano a ripristinare lo spazio corretto intervertebrale L4-L5 ed S1, allontanando con delicatezza i corpi ossei spinali per allentare la morsa dolorosa sul nervo sciatico."
                },
                {
                  q: "Non ho mai fatto ginnastica posturale o fisioterapia prima. È difficile?",
                  a: "No, affatto. Il Protocollo Schiena Libera è stato concepito appositamente per le persone pigre o con scarso dinamismo motorio d'ufficio. Include illustrazioni ad alta definizione semplici e sicure da ripetere senza alcun tipo di rischio d'errore."
                },
                {
                  q: "Richiede molto tempo durante la mia giornata lavorativa?",
                  a: "Fai tutto in soli 10 minuti complessivi. Le routine sono velocissime ed alcune possono essere tranquillamente eseguite in modo 'invisibile' direttamente in sedia alla scrivania senza che i colleghi o superiori se ne accorgano."
                },
                {
                  q: "Come avviene l'acquisto dei €17 e come ricevo il manuale?",
                  a: "L'erogazione è totalmente istantanea. Subito dopo aver effettuato il pagamento protetto a 256-bit, riceverai una mail di conferma contenente il link per il download immediato della guida PDF."
                },
                {
                  q: "E se mi accorgo che per me non funziona?",
                  a: "La tua serenità è garantita al 100%. Abbiamo inserito una garanzia soddisfatti o rimborsati di 30 giorni consecutivi. Se la tua schiena non risulterà rigenerata ed elastica, inviaci una mail al nostro indirizzo di supporto clinico ed effettueremo il rimborso totale dei €17 senza fare obiezione alcuna."
                },
                {
                  q: "Posso pagare a rate anche se la cifra è molto bassa?",
                  a: "Sì, assolutamente! Al checkout puoi dividere l'intero importo di €17 in 3 rate da soli €5.67 al mese senza alcun interesse o costo aggiuntivo, selezionando Klarna o PayPal al momento del pagamento."
                }
              ].map((faq, fIdx) => (
                <div 
                  key={fIdx} 
                  className="bg-[#0b0c16]/70 border border-slate-850 rounded-2xl overflow-hidden transition-all duration-350"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                    className="w-full p-4.5 text-left text-xs sm:text-sm font-bold text-white flex justify-between items-center gap-4 hover:bg-slate-900/30 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-violet-400 font-extrabold text-xs">
                      {openFaq === fIdx ? "–" : "+"}
                    </span>
                  </button>
                  {openFaq === fIdx && (
                    <div className="p-4.5 bg-slate-950/60 border-t border-slate-900/60 text-slate-300 text-xs leading-relaxed space-y-1">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* OPTIONAL ORIGINAL MOCKUP SLIDES GALLERY - TOGGLED VIA SETTINGS */}
      <AnimatePresence>
        {settings.showOriginalPhotos && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 py-12 border-t border-slate-800 relative z-30"
          >
            <div className="max-w-4xl mx-auto px-4 text-center">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-2xl mx-auto mb-8">
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
                  Pannello Sviluppatore / Prova Grafica
                </span>
                <h3 className="text-lg font-bold text-white">Certificazione di Somiglianza PDF</h3>
                <p className="text-xs text-slate-400 mt-1">
                  La tua pagina interattiva ripropone con la massima cura e responsive design ciascuna delle 6 slide del report. Ecco l'indice completo dei lucidi per una facile verifica:
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { n: 1, title: "Copertina ed Offerta", desc: "Protocollo Schiena Libera €17" },
                  { n: 2, title: "Basta Soffrire in Silenzio", desc: "Dati epidemiologici e fitte diuretiche" },
                  { n: 3, title: "La Soluzione dell'Ufficio", desc: "Routine naturale di 10 min/giorno" },
                  { n: 4, title: "Tre Pilastri del Rilassamento", desc: "Dolore, Stato REM ed Energia" },
                  { n: 5, title: "Presentazione Dr. Marco", desc: "Laurea Fisioterapia e Curriculum" },
                  { n: 6, title: "Chiusura ed Erogazione", desc: "Bottone Hotmart e Garanzia" }
                ].map((s) => (
                  <div key={s.n} className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-left">
                    <span className="text-xs font-mono font-bold text-violet-400">PAGINA PDF {s.n}</span>
                    <h5 className="font-bold text-xs text-white mt-1 uppercase leading-none">{s.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* FOOTER: LEGAL AND CONTACT COMPLIANCES */}
      <footer id="footer-section" className="bg-[#05060f] border-t border-slate-900 py-12 text-slate-500 text-xs mt-auto relative z-20">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <span className="text-white font-black text-sm uppercase tracking-widest">
                PROTOCOLLO SCHIENA LIBERA
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                © {new Date().getFullYear()} – Tutti i diritti riservati. Editore autorizzato licenza Dr. Marco Wellness.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {supportEmail && (
                <a href={`mailto:${supportEmail}`} className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 font-bold">
                  <Mail className="w-4 h-4 text-violet-400" />
                  <span>Supporto Email</span>
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3 text-[10px] text-slate-600 leading-relaxed text-center sm:text-left">
            <p>
              <strong>AVVERTENZA MEDICA MANDATORIA:</strong> Questo prodotto digitale contiene un compendio informativo di esercizi fisici posturali e manualistici adatti alla salute della colonna lombare. Le informazioni presentate non possono in alcun modo sostituirsi a fidi esami posturali computerizzati, diagnostiche cliniche o ricette indicate da ortopedici o neurochirurghi. In presenza di sintomatologie acute gravi, protrusioni acclarate, o pregressi interventi spinali, raccomandiamo calorosamente di mostrare il suddetto PDF al proprio specialista di fiducia prima di iniziare qualunque routine terapeutica respiratoria.
            </p>
            <p>
              Questo sito non appartiene a Meta Platforms Inc. o Facebook Inc. e non è in alcun modo approvato o sponsorizzato da Meta. Meta, Facebook e i rispettivi loghi sono marchi esclusivi registrati di Meta Platforms, Inc.
            </p>
            <p>
              La garanzia standard soddisfatti o rimborsati è valida integralmente per 30 giorni consecutivi a far data dall'inoltro dell'ordine di acquisto effettuando richiesta autonoma tramite e-mail o tramite modulo Hotmart.
            </p>
          </div>

        </div>
      </footer>

      {/* 🔔 LIVE RECENT PURCHASE FLOATING TOASTS (SOCIAL PROOF) */}
      <AnimatePresence>
        {activeNotifyIdx !== null && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 left-4 z-50 max-w-sm bg-slate-900/95 border-2 border-violet-500/30 text-slate-100 p-4 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3"
          >
            <div className="w-9 h-9 bg-violet-600/25 border border-violet-500/40 text-violet-400 rounded-full flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                {PURCHASES_LOG[activeNotifyIdx].name}
                <span className="bg-emerald-500/20 text-emerald-300 text-[8px] px-1 rounded uppercase font-bold tracking-wider">
                  Verificato
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 font-medium leading-tight">
                {PURCHASES_LOG[activeNotifyIdx].action}
              </p>
              <div className="text-[9px] text-slate-500 font-mono mt-1">
                {PURCHASES_LOG[activeNotifyIdx].time} • Protocollo Attivato
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
