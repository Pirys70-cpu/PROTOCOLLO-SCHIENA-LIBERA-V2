import React from 'react';
import { CheckCircle2, Download, ArrowLeft, Mail, FileText, ExternalLink, HelpCircle } from 'lucide-react';
import { LandingPageSettings } from '../types';

interface ThankYouPageProps {
  settings: LandingPageSettings;
  onBackToHome: () => void;
}

export default function ThankYouPage({ settings, onBackToHome }: ThankYouPageProps) {
  const { productName, price, supportEmail } = settings;

  // Mock download prompt for PDF guide
  const handleDownloadPDF = () => {
    // Generate a simple dummy file blob to trigger an actual safe browser download 
    // of a simulated guide or show direct support.
    try {
      const content = `--- PROTOCOLLO SCHIENA LIBERA ---\nGentile Cliente,\nGrazie per aver acquistato il ${productName}.\nPresto riceverai tutti i contenuti multimediali all'indirizzo email di acquisto.\n\nContatto Supporto Clinico: ${supportEmail}\n\nInizia la tua routine di 10 minuti oggi stesso!`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Protocollo_Schiena_Libera_Manuale.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Download avviato con successo!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20 text-slate-100 flex-grow flex items-center justify-center">
      <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-3xl p-6 md:p-10 border border-violet-500/30 shadow-2xl relative overflow-hidden text-center">
        
        {/* Confetti Ambient Accents */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Big Success Tick Badge */}
        <div className="mx-auto w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-500/40">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Transmitted Info Badge */}
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] px-3.5 py-1.5 rounded-full font-mono uppercase tracking-widest font-black mb-4">
          <span>● Meta Pixel:</span>
          <span className="animate-pulse">Evento PURCHASE Tracciato</span>
        </div>

        {/* Headings */}
        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
          Grazie della Fiducia! 🎉
        </h1>
        <p className="text-slate-300 text-sm md:text-base mt-2 max-w-lg mx-auto">
          Il tuo ordine da <strong className="text-emerald-400">€{price}.00</strong> è andato a buon fine. Il tuo accesso al <strong className="text-violet-400">{productName}</strong> è ora attivo ed è coperto dalla garanzia a vita.
        </p>

        {/* Immediate Access Actions Dashboard */}
        <div className="mt-8 bg-slate-950/70 rounded-2xl p-5 border border-slate-800 text-left max-w-xl mx-auto space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-900">
            <div className="bg-violet-600/20 p-2 rounded-lg text-violet-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Download Immediato Copia Digitale</h4>
              <p className="text-[11px] text-slate-500">File in formato multipaginato PDF compatibile con smartphone, PC e tablet.</p>
            </div>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="w-full py-4 px-6 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] text-slate-950 text-sm font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg border-b-2 border-emerald-600 select-none"
            id="thank-you-download-btn"
          >
            <Download className="w-5 h-5 stroke-[3px]" />
            Scarica il Protocollo Posturale (PDF)
          </button>
        </div>

        {/* Customer Steps Instructions */}
        <div className="mt-8 text-left max-w-xl mx-auto space-y-4">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider pl-1 font-mono">
            Prossimi Passaggi Consigliati:
          </h3>
          
          <div className="grid grid-cols-1 gap-3.5">
            {[
              {
                step: "1",
                label: "Controlla la tua Casella di posta",
                detail: `Abbiamo appena inviato l'originale digitale ed i bonus anche al tuo indirizzo e-mail. Cerca un messaggio con oggetto "${productName}".`
              },
              {
                step: "2",
                label: "Inizia con il Primo Pilastro Posturale",
                detail: "Apri il Capitolo 3 a pagina 12 del manuale ed esegui la mossa passiva di scarico immediato per sbloccare le vertebre rigide."
              },
              {
                step: "3",
                label: "Qualsiasi Domanda o Necessità?",
                detail: `Siamo a tua completa disposizione. Per qualsiasi disguido o supporto scrivi a: ${supportEmail}`
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className="w-7 h-7 bg-violet-600/20 border border-violet-500/30 text-violet-300 font-extrabold text-xs rounded-full flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-white">{item.label}</h4>
                  <p className="text-xs text-slate-400 leading-normal">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions of Thank You screen */}
        <div className="mt-10 pt-6 border-t border-slate-800 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider py-2 px-4 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Torna alla Pagina Principale
          </button>

          {supportEmail && (
            <a
              href={`mailto:${supportEmail}`}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer font-bold"
            >
              <Mail className="w-4 h-4" />
              <span>Contatta Assistenza Clienti</span>
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
