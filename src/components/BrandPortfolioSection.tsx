import React from 'react';
import { ShieldCheck, Award, ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { AUTHORIZED_BRANDS, AuthorizedBrand } from '../data/categoryData';
import { TRANSLATIONS } from '../data/translations';
import { SupportedLanguage } from '../types/valve';

interface BrandPortfolioSectionProps {
  lang: SupportedLanguage;
  onSelectBrand?: (brandName: string) => void;
}

export const BrandPortfolioSection: React.FC<BrandPortfolioSectionProps> = ({
  lang,
  onSelectBrand,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold font-mono uppercase mb-2.5">
            <Award className="w-3.5 h-3.5" />
            <span>{t.brandSectionBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.brandSectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t.brandSectionDesc}
          </p>
        </div>

        {/* 6 Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AUTHORIZED_BRANDS.map((brand) => (
            <div
              key={brand.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 group relative overflow-hidden shadow-lg shadow-black/40"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

              <div>
                {/* Top Badge & Flag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-2xl" role="img" aria-label={brand.origin}>
                    {brand.flag}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-amber-400">
                    {lang === 'vi' ? brand.badge : brand.badgeEn}
                  </span>
                </div>

                {/* Brand Name & Origin */}
                <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{brand.name}</span>
                </h3>
                <span className="text-[11px] font-medium text-slate-400 block mb-2 font-mono">
                  {lang === 'vi' ? 'Xuất xứ:' : 'Origin:'} <strong className="text-slate-300">{lang === 'vi' ? brand.origin : brand.originEn}</strong>
                </span>

                {/* Tagline */}
                <p className="text-xs font-semibold text-amber-200/90 mb-2 leading-snug">
                  {lang === 'vi' ? brand.tagline : brand.taglineEn}
                </p>

                {/* Specialty */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase mb-0.5">
                    {lang === 'vi' ? 'Dòng Sản Phẩm Chủ Lực:' : 'Core Product Lines:'}
                  </span>
                  <p className="leading-relaxed">{lang === 'vi' ? brand.specialty : brand.specialtyEn}</p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'vi' ? 'CO/CQ & Mill Test Đầy Đủ' : 'Full CO/CQ & Mill Test 3.1'}
                </span>
                {onSelectBrand && (
                  <button
                    type="button"
                    onClick={() => onSelectBrand(brand.id === 'utd' ? 'UTD' : brand.name)}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[11px]"
                  >
                    <span>{lang === 'vi' ? 'Xem Van' : 'View Valves'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
