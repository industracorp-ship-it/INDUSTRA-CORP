import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  FileDown, 
  CheckCircle2, 
  Gauge, 
  Flame, 
  Layers, 
  Edit3, 
  BookOpen, 
  Wind, 
  Sparkles 
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { HERO_PIPELINE_IMAGE } from '../data/valvesData';
import { SupportedLanguage } from '../types/valve';

interface HeroSectionProps {
  lang: SupportedLanguage;
  onOpenCatalogue: () => void;
  onOpenKnowledge: (tab?: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly') => void;
  isAdminMode: boolean;
  onEditContent?: (key: string, title: string, currentValue: string) => void;
  customHeroTitle?: string;
  customHeroSubtitle?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  lang, 
  onOpenCatalogue, 
  onOpenKnowledge,
  isAdminMode,
  onEditContent,
  customHeroTitle,
  customHeroSubtitle,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="relative overflow-hidden bg-slate-950 border-b border-slate-800">
      {/* Background Pipeline Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_PIPELINE_IMAGE}
          alt="Hệ thống đường ống công nghiệp và van UTD công suất lớn"
          className="w-full h-full object-cover object-center opacity-35 scale-105 filter brightness-90 contrast-125"
          referrerPolicy="no-referrer"
          loading="eager"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/uploads/valve_placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              {t.heroTag}
            </div>

            {/* Main Headline with Admin Hover Edit */}
            <div className="relative group">
              {isAdminMode && onEditContent && (
                <button
                  type="button"
                  onClick={() => onEditContent('heroTitle', 'Tiêu đề chính Hero', customHeroTitle || t.heroTitle)}
                  className="absolute -top-3 -right-2 z-20 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-lg border border-amber-300 animate-bounce"
                  title="Admin sửa tiêu đề chính"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>✏️ Sửa Tiêu Đề</span>
                </button>
              )}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                {customHeroTitle ? (
                  customHeroTitle
                ) : (
                  lang === 'vi' ? (
                    <>
                      Giải Pháp Kiểm Soát <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400">
                        Dòng Chảy & An Toàn PCCC
                      </span>{' '}
                      Bền Vững
                    </>
                  ) : lang === 'zh' ? (
                    <>
                      工业级重型流体控制 <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400">
                        与消防管网安全解决方案
                      </span>
                    </>
                  ) : (
                    <>
                      Rugged Flow Control <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400">
                        & Fire Protection Solutions
                      </span>
                    </>
                  )
                )}
              </h1>
            </div>

            {/* Subtitle with Admin Hover Edit */}
            <div className="relative group">
              {isAdminMode && onEditContent && (
                <button
                  type="button"
                  onClick={() => onEditContent('heroSubtitle', 'Mô tả phụ Hero', customHeroSubtitle || t.heroSubtitle)}
                  className="absolute -top-2 right-0 z-20 bg-amber-500 hover:bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-lg border border-amber-300"
                  title="Admin sửa mô tả phụ"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>✏️ Sửa Mô Tả</span>
                </button>
              )}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                {customHeroSubtitle || t.heroSubtitle}
              </p>
            </div>

            {/* Call To Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#rfq-section"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-7 py-3.5 rounded-lg text-sm font-extrabold transition-all shadow-xl shadow-amber-500/25 active:scale-95 group"
              >
                <span>{t.heroCtaQuote}</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                type="button"
                onClick={onOpenCatalogue}
                className="inline-flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 px-6 py-3.5 rounded-lg text-sm font-bold transition-all hover:border-slate-500"
              >
                <FileDown className="w-4 h-4 text-amber-400" />
                <span>{t.heroDownloadSpecs}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenKnowledge('hp_butterfly')}
                className="inline-flex items-center justify-center gap-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/70 px-4 py-3.5 rounded-lg text-sm font-bold transition-all"
              >
                <Wind className="w-4 h-4 text-emerald-400" />
                <span>{t.heroTovValve}</span>
              </button>
            </div>

            {/* Four Trust Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.heroTrustAsme}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{t.heroTrustIso}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.heroTrustCe}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{t.heroTrustApi}</span>
              </div>
            </div>
          </div>

          {/* Quick Technical Guarantee Bento Card */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-amber-400" />
                  <span className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
                    {t.heroCommitment}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  100% QA/QC
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center border border-blue-800 shrink-0 mt-0.5">
                    <Gauge className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {t.heroSteamLoops}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {t.heroSteamLoopsDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-red-950 flex items-center justify-center border border-red-800 shrink-0 mt-0.5">
                    <Flame className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {t.heroFireFighting}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {t.heroFireFightingDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-800 shrink-0 mt-0.5">
                    <Wind className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {t.heroTovHighlight}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                      {t.heroTovHighlightDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{t.heroDeliveryLabel}</span>
                <span className="font-extrabold text-amber-400 font-mono">{t.heroDeliveryTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
