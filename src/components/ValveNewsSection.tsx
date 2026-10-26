import React, { useState, useMemo, useEffect } from 'react';
import { 
  Newspaper, 
  Search, 
  BookOpen, 
  Clock, 
  Calendar, 
  Bookmark, 
  ChevronRight, 
  HelpCircle, 
  ShieldCheck, 
  Wrench, 
  SlidersHorizontal, 
  Sparkles,
  ExternalLink,
  Plus,
  Filter
} from 'lucide-react';
import { VALVE_NEWS_ARTICLES, ValveNewsArticle, ValveNewsCategory, getStoredValveArticles } from '../data/valveNewsData';
import { SupportedLanguage } from '../types/valve';
import { translateTechString } from '../utils/engineeringTranslator';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';
import { ValveArticleModal } from './ValveArticleModal';

interface ValveNewsSectionProps {
  lang: SupportedLanguage;
  onSelectValveCode?: (code: string) => void;
  isAdminMode?: boolean;
}

export const ValveNewsSection: React.FC<ValveNewsSectionProps> = ({
  lang,
  onSelectValveCode,
  isAdminMode = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<ValveNewsArticle | null>(null);
  const [articlesList, setArticlesList] = useState<ValveNewsArticle[]>(() => getStoredValveArticles());

  useEffect(() => {
    const handleStorage = () => {
      setArticlesList(getStoredValveArticles());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('utd_valve_articles_updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('utd_valve_articles_updated', handleStorage);
    };
  }, []);

  const categories = [
    { key: 'all', labelVi: 'Tất Cả Bài Viết', labelEn: 'All Articles', labelZh: '全部技术文章' },
    { key: 'troubleshooting', labelVi: 'Khắc Phục Sự Cố & Rò Rỉ', labelEn: 'Troubleshooting', labelZh: '故障诊断与泄漏排除' },
    { key: 'installation', labelVi: 'Kỹ Thuật Lắp Đặt & Đấu Nối', labelEn: 'Installation', labelZh: '管道安装与对接工艺' },
    { key: 'selection', labelVi: 'Lựa Chọn & Tính Toán Van (Cv/Kv)', labelEn: 'Selection & Sizing', labelZh: '工程选型与Cv/Kv计算' },
    { key: 'standards', labelVi: 'Tiêu Chuẩn ASME / ISO / API', labelEn: 'Standards & Compliance', labelZh: 'ASME/ISO/API 规范' },
    { key: 'operation', labelVi: 'Vận Hành & Bảo Trì Định Kỳ', labelEn: 'Operation & Maintenance', labelZh: '运行操作与周期保养' },
  ];

  const filteredArticles = useMemo(() => {
    return articlesList.filter((article) => {
      const matchCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        article.title.toLowerCase().includes(q) ||
        article.titleEn.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.sourceCitation.publisherOrBrand.toLowerCase().includes(q) ||
        article.glossary.some(g => g.term.toLowerCase().includes(q) || g.termVi.toLowerCase().includes(q))
      );
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="valve-news" className="py-16 sm:py-20 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold font-mono uppercase mb-2.5">
            <Newspaper className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'BẢN TIN NGÀNH VAN & TRI THỨC KỸ THUẬT' : (lang === 'zh' ? '工业阀门行业周刊与工程知识文库' : 'VALVE INDUSTRY BULLETIN & ENGINEERING INSIGHTS')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {lang === 'vi' 
              ? 'Tài Liệu Hướng Dẫn Vận Hành, Lắp Đặt & Khắc Phục Sự Cố Kỹ Thuật' 
              : (lang === 'zh' ? '阀门运行操作、管道安装与故障排除技术指南' : 'Technical Operation, Installation & Troubleshooting Guides')}
          </h2>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            {lang === 'vi'
              ? 'Tổng hợp kiến thức từ các báo chí chuyên ngành van quốc tế (Valve World, Flow Control) và tài liệu kỹ thuật chính hãng (Spirax Sarco, Emerson, Bray, Kitz) có trích dẫn nguồn đầy đủ và giải thích thuật ngữ chuyên sâu.'
              : 'Curated technical intelligence from leading industry journals and manufacturers with official citations and detailed engineering glossaries.'}
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'vi' ? 'Tìm bài viết, hiện tượng xâm thực, búa nước, rách đệm, Cv...' : 'Search articles, cavitation, water hammer, Kv factor...'}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="text-xs text-slate-400 font-mono">
              {lang === 'vi' 
                ? `Hiển thị: ${filteredArticles.length} / ${VALVE_NEWS_ARTICLES.length} tài liệu chuyên sâu` 
                : `Showing: ${filteredArticles.length} / ${VALVE_NEWS_ARTICLES.length} whitepapers`}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {lang === 'vi' ? cat.labelVi : (lang === 'zh' ? (cat as any).labelZh : cat.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-950/40 group cursor-pointer"
            >
              <div>
                {/* Image & Category Pill */}
                <div className="relative aspect-16/9 bg-slate-950 overflow-hidden border-b border-slate-800 flex items-center justify-center p-2">
                  <img
                    src={resolveProductImageUrl(article.featuredImage)}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono font-bold text-amber-300 border border-slate-700">
                    {translateTechString(article.categoryLabelVi, article.categoryLabelEn, lang)}
                  </div>
                  <div className="absolute bottom-2.5 right-3 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{article.readTimeMinutes} {lang === 'vi' ? 'phút' : (lang === 'zh' ? '分钟' : 'min')}</span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{article.publishDate}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                    {translateTechString(article.title, article.titleEn, lang)}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {translateTechString(article.summary, article.summaryEn, lang)}
                  </p>

                  {/* Official Citation Pill */}
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-0.5">
                    <span className="text-amber-400 font-bold block flex items-center gap-1">
                      <Bookmark className="w-3 h-3" />
                      {article.sourceCitation.publisherOrBrand}
                    </span>
                    <span className="text-slate-400 text-[10px] line-clamp-1">
                      {article.sourceCitation.documentTitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 pt-0">
                <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-blue-400 group-hover:text-blue-300 font-bold">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Xem bài viết & thuật ngữ' : (lang === 'zh' ? '阅读全文与专业术语解析' : 'Read & Explore Terms')}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Article Modal with Technical Glossary */}
      <ValveArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        lang={lang}
        onSelectValveCode={onSelectValveCode}
      />
    </section>
  );
};
