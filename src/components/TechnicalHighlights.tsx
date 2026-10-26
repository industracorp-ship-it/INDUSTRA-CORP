import React from 'react';
import { Flame, Gauge, Shield, Droplets } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';
import { SupportedLanguage } from '../types/valve';

interface TechnicalHighlightsProps {
  lang: SupportedLanguage;
}

export const TechnicalHighlights: React.FC<TechnicalHighlightsProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  const highlights = [
    {
      icon: Flame,
      color: 'text-amber-400',
      bgIcon: 'bg-amber-950/60 border-amber-800/80',
      value: '-40°C ~ +450°C',
      label: t.statTemp,
      desc: t.statTempDesc,
      subDetail: t.techParam1Sub
    },
    {
      icon: Gauge,
      color: 'text-blue-400',
      bgIcon: 'bg-blue-950/60 border-blue-800/80',
      value: 'PN10 - PN100',
      label: t.statPressure,
      desc: t.statPressureDesc,
      subDetail: t.techParam2Sub
    },
    {
      icon: Shield,
      color: 'text-emerald-400',
      bgIcon: 'bg-emerald-950/60 border-emerald-800/80',
      value: 'SS304 / 316 / WCB / GGG50',
      label: t.statMaterial,
      desc: t.statMaterialDesc,
      subDetail: t.techParam3Sub
    },
    {
      icon: Droplets,
      color: 'text-sky-400',
      bgIcon: 'bg-sky-950/60 border-sky-800/80',
      value: 'Class VI / Rate A',
      label: t.statLeakage,
      desc: t.statLeakageDesc,
      subDetail: t.techParam4Sub
    },
  ];

  return (
    <section id="technical-highlights" className="py-16 sm:py-20 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 font-mono">
            {t.techSectionBadge}
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.techSectionTitle}
          </p>
          <p className="text-sm text-slate-400 mt-3">
            {t.techSectionDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-950/90 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${item.bgIcon} border flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
                    PARAM #{index + 1}
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                  {item.value}
                </div>

                <h3 className="text-sm font-bold text-slate-200 mt-2">
                  {item.label}
                </h3>

                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <span>→</span>
                  <span>{item.subDetail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
