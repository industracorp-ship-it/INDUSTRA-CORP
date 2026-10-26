import React, { useState, useEffect } from 'react';
import { 
  X, 
  RefreshCw, 
  ExternalLink, 
  Globe, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  Clock, 
  Database, 
  Cpu, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Download
} from 'lucide-react';
import { 
  CRAWLER_TARGET_SITES, 
  loadCrawlerState, 
  saveCrawlerState, 
  executeCrawlCycle 
} from '../utils/brandCrawlerEngine';
import { CrawlerSiteConfig, CrawlLogItem, ValveProduct, SupportedLanguage } from '../types/valve';

interface BrandCrawlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  onSyncProductsToCatalog: (valves: ValveProduct[]) => void;
  totalCatalogProducts: number;
}

export const BrandCrawlerModal: React.FC<BrandCrawlerModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSyncProductsToCatalog,
  totalCatalogProducts
}) => {
  if (!isOpen) return null;

  const [crawlerState, setCrawlerState] = useState(() => loadCrawlerState());
  const [sites, setSites] = useState<CrawlerSiteConfig[]>(CRAWLER_TARGET_SITES);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'sites' | 'terminal' | 'docs'>('sites');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const runCrawlerNow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(5);

    try {
      const result = await executeCrawlCycle((currProgress, logItem) => {
        setProgress(currProgress);
        setCrawlerState((prev) => {
          const next = {
            ...prev,
            progressPercent: currProgress,
            logs: [logItem, ...prev.logs].slice(0, 50)
          };
          saveCrawlerState(next);
          return next;
        });
      });

      // Update site status
      setSites((prev) =>
        prev.map((s) => ({
          ...s,
          status: 'success',
          lastCrawledAt: new Date().toLocaleTimeString()
        }))
      );

      setCrawlerState((prev) => {
        const next = {
          ...prev,
          isRunning: false,
          progressPercent: 100,
          lastRunAt: new Date().toISOString(),
          totalItemsExtracted: result.extractedValves.length
        };
        saveCrawlerState(next);
        return next;
      });

      // Auto sync or trigger sync
      onSyncProductsToCatalog(result.extractedValves);
      setSyncToast(
        lang === 'vi'
          ? `✓ Quét thành công và đồng bộ ${result.extractedValves.length} sản phẩm hãng vào Catalog!`
          : `✓ Successfully crawled and mapped ${result.extractedValves.length} brand products to Catalog!`
      );
      setTimeout(() => setSyncToast(null), 4000);
    } catch (err) {
      console.error('Crawler execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleToggleAutoSchedule = () => {
    setCrawlerState((prev) => {
      const next = { ...prev, autoSchedule: !prev.autoSchedule };
      saveCrawlerState(next);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {lang === 'vi' 
                    ? 'Tác Vụ Ngầm Crawler & Đồng Bộ Danh Mục Hãng Đối Tác' 
                    : 'Automated Background Crawler & Brand Spec Sync'}
                </h3>
                <span className="bg-blue-950 text-blue-300 border border-blue-600/50 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  AUTONOMOUS V2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'vi'
                  ? 'Tự động quét specs, tiêu chuẩn và catalog từ VYC Spain, Shield UK, JM Valve Korea, Johnson Controls và Tyco.'
                  : 'Scrapes live specs, standards and documentation from VYC, Shield, JMV, Johnson Controls and Tyco.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runCrawlerNow}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
                isRunning 
                  ? 'bg-amber-600 text-white cursor-not-allowed opacity-80' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>
                {isRunning
                  ? (lang === 'vi' ? 'Đang quét...' : 'Crawling...')
                  : (lang === 'vi' ? 'Chạy Quét Ngay' : 'Run Crawl Now')}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Toast */}
        {syncToast && (
          <div className="bg-emerald-950/90 border-b border-emerald-600/80 px-6 py-2.5 text-xs font-bold text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {syncToast}
            </span>
            <span className="text-[11px] font-mono opacity-80">Catalog: {totalCatalogProducts} items</span>
          </div>
        )}

        {/* Sub-header status bar */}
        <div className="bg-slate-950/40 px-6 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
              <strong className="text-slate-200">
                {isRunning ? (lang === 'vi' ? 'Đang chạy' : 'Running') : (lang === 'vi' ? 'Sẵn sàng' : 'Idle / Ready')}
              </strong>
            </span>
            <span>•</span>
            <span>
              {lang === 'vi' ? 'Số trang đích:' : 'Target Sites:'} <strong className="text-slate-200">6 Hãng (Kèm APC Valve)</strong>
            </span>
            <span>•</span>
            <span>
              {lang === 'vi' ? 'Lần quét gần nhất:' : 'Last Crawl:'}{' '}
              <strong className="text-slate-200">
                {crawlerState.lastRunAt ? new Date(crawlerState.lastRunAt).toLocaleTimeString() : 'N/A'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleAutoSchedule}
              className={`px-2 py-1 rounded text-[11px] font-semibold border flex items-center gap-1.5 transition-all ${
                crawlerState.autoSchedule
                  ? 'bg-blue-950 text-blue-300 border-blue-700/60'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>
                {crawlerState.autoSchedule
                  ? (lang === 'vi' ? 'Đã bật lịch quét hàng ngày (Mỗi 24h)' : 'Daily Auto Crawl (Every 24h)')
                  : (lang === 'vi' ? 'Lịch tự động: Tắt' : 'Auto Schedule: Off')}
              </span>
            </button>
          </div>
        </div>

        {/* Progress Bar when running */}
        {isRunning && (
          <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('sites')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sites'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '6 Website Hãng Đối Tác (Kèm APC Valve)' : '6 Partner Brand Portals (Inc. APC Valve)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Nhật Ký Quét & Terminal Logs' : 'Crawler Terminal & Logs'}</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-slate-300">
              {crawlerState.logs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'docs'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Tài Liệu Kỹ Thuật (PDF / TDS)' : 'Engineering TDS & Catalogs'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'sites' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sites.map((site) => (
                <div
                  key={site.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{site.flag}</span>
                        <h4 className="text-sm font-bold text-white">{site.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 font-bold">
                        {site.itemsFound} {lang === 'vi' ? 'Sản phẩm' : 'Products'}
                      </span>
                    </div>

                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 font-mono truncate flex items-center gap-1 mb-2.5"
                    >
                      <span className="truncate">{site.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>

                    <p className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                      <strong>{lang === 'vi' ? 'Trọng tâm thu thập:' : 'Target Focus:'}</strong>{' '}
                      {lang === 'vi' ? site.focus : site.focusEn}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lang === 'vi' ? 'Đã chuẩn hóa ProductGrid' : 'Mapped to ProductGrid'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {site.docLinks.length} {lang === 'vi' ? 'tài liệu kỹ thuật' : 'datasheets'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 h-96 overflow-y-auto space-y-2 shadow-inner">
              <div className="text-slate-500 pb-2 border-b border-slate-900 flex justify-between">
                <span>TERMINAL_OUTPUT // CRAWLER_AGENT_THREAD_01</span>
                <span>STATUS: READY</span>
              </div>
              {crawlerState.logs.map((item) => (
                <div key={item.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 text-[11px] flex-shrink-0">[{item.timestamp}]</span>
                  <span className={`text-[11px] font-bold px-1 rounded flex-shrink-0 ${
                    item.level === 'success' ? 'bg-emerald-950 text-emerald-400' :
                    item.level === 'warn' ? 'bg-amber-950 text-amber-400' :
                    item.level === 'error' ? 'bg-rose-950 text-rose-400' :
                    'bg-blue-950 text-blue-400'
                  }`}>
                    {item.siteName}
                  </span>
                  <span className={item.level === 'success' ? 'text-emerald-300' : 'text-slate-200'}>
                    {lang === 'vi' ? item.message : item.messageEn}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                {lang === 'vi'
                  ? 'Các tài liệu kỹ thuật, bảng tra cứu lưu lượng và chứng chỉ xuất xưởng được bot crawler tự động lập chỉ mục:'
                  : 'Official technical sheets, flow coefficient graphs and certifications indexed by the background crawler:'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sites.flatMap((site) =>
                  site.docLinks.map((link, idx) => {
                    const filename = link.split('/').pop() || 'document.pdf';
                    return (
                      <div
                        key={`${site.id}-${idx}`}
                        className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileText className="w-5 h-5 text-amber-400 flex-shrink-0" />
                          <div className="overflow-hidden">
                            <span className="text-xs font-bold text-slate-200 block truncate">
                              {filename}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {site.name}
                            </span>
                          </div>
                        </div>

                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 rounded text-xs flex items-center gap-1 border border-slate-700/80 flex-shrink-0"
                        >
                          <span>{lang === 'vi' ? 'Xem' : 'View'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'vi'
                ? 'Dữ liệu được kiểm định bởi kỹ sư trưởng Industracorp trước khi đưa vào catalog'
                : 'Data verified by Industracorp lead engineers before catalog ingestion'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-slate-300 hover:bg-slate-800 font-bold"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
