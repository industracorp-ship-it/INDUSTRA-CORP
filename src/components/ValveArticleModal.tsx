import React from 'react';
import { 
  X, 
  ExternalLink, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Bookmark, 
  Share2, 
  Printer, 
  HelpCircle,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { ValveNewsArticle } from '../data/valveNewsData';
import { SupportedLanguage } from '../types/valve';
import { translateTechString } from '../utils/engineeringTranslator';

interface ValveArticleModalProps {
  article: ValveNewsArticle | null;
  onClose: () => void;
  lang: SupportedLanguage;
  onSelectValveCode?: (code: string) => void;
}

export const ValveArticleModal: React.FC<ValveArticleModalProps> = ({
  article,
  onClose,
  lang,
  onSelectValveCode
}) => {
  if (!article) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              {translateTechString(article.categoryLabelVi, article.categoryLabelEn, lang)}
            </span>
            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {article.publishDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {article.readTimeMinutes} {lang === 'vi' ? 'phút đọc' : 'min read'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={lang === 'vi' ? 'In bài viết kỹ thuật' : 'Print Technical Article'}
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Close article modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-300">
          {/* Header Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight tracking-tight">
              {translateTechString(article.title, article.titleEn, lang)}
            </h1>

            {/* Source Citation Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'TRÍCH DẪN NGUỒN KỸ THUẬT CHÍNH THỨC:' : (lang === 'zh' ? '官方工程文献与制造厂权威引文出处:' : 'OFFICIAL TECHNICAL CITATION:')}</span>
                </div>
                <p className="text-slate-200 font-semibold">{article.sourceCitation.publisherOrBrand}</p>
                <p className="text-slate-400 text-[11px]">{article.sourceCitation.documentTitle} • {article.sourceCitation.publicationCode}</p>
              </div>
              {article.sourceCitation.sourceUrl && (
                <a
                  href={article.sourceCitation.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-bold underline shrink-0"
                >
                  <span>{lang === 'vi' ? 'Xem tài liệu gốc' : 'Original Source'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Article Executive Summary */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            <strong className="block text-blue-300 font-bold mb-1 font-mono uppercase text-[11px]">
              {lang === 'vi' ? 'TÓM TẮT KỸ THUẬT:' : 'EXECUTIVE ENGINEERING SUMMARY:'}
            </strong>
            {translateTechString(article.summary, article.summaryEn, lang)}
          </div>

          {/* Full Article Content */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
            {lang === 'vi' ? article.content : (lang === 'zh' ? translateTechString(article.content, article.contentEn, 'zh') : article.contentEn)}
          </div>

          {/* Key Takeaways */}
          <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'vi' ? 'Khuyến Cáo Thực Hành Cho Kỹ Sư & Tổng Thầu:' : (lang === 'zh' ? '工程师与施工总包最佳实践规范指南:' : 'Engineering Best Practices & Field Rules:')}</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {(lang === 'vi' ? article.keyTakeaways : article.keyTakeawaysEn).map((t, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✔</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Glossary Explanations */}
          {article.glossary && article.glossary.length > 0 && (
            <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'vi' ? 'Giải Thích Từ Thuật Ngữ Kỹ Thuật Ngành Van:' : (lang === 'zh' ? '阀门工程技术核心专业术语释义:' : 'Technical Terminology Glossary & Definitions:')}</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Dịch sát nghĩa chuẩn ASME / ISO</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {article.glossary.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-amber-300 font-mono">{item.term}</strong>
                      <span className="text-[10px] text-slate-400">{item.termVi}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">
                      {translateTechString(item.definitionVi, item.definitionEn, lang)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Valve Products */}
          {article.recommendedValveCodes && article.recommendedValveCodes.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-bold">
                  {lang === 'vi' ? 'Dòng van UTD tương ứng được khuyến nghị:' : 'Recommended UTD Valve Models:'}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {article.recommendedValveCodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      if (onSelectValveCode) onSelectValveCode(code);
                      onClose();
                    }}
                    className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 rounded-lg font-mono font-bold text-xs transition-colors"
                  >
                    {code} →
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Close */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            {lang === 'vi' ? 'Đóng Bài Viết' : (lang === 'zh' ? '关闭文章' : 'Close Article')}
          </button>
        </div>
      </div>
    </div>
  );
};
