import React, { useState } from 'react';
import { 
  Pin, 
  X, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Thermometer, 
  Gauge, 
  Maximize2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { ValveProduct, SupportedLanguage } from '../types/valve';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';

interface QuickCompareFloatingPanelProps {
  pinnedProducts: ValveProduct[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  lang: SupportedLanguage;
  onOpenSpecs?: (product: ValveProduct) => void;
  onOpenCompareModal?: () => void;
}

export const QuickCompareFloatingPanel: React.FC<QuickCompareFloatingPanelProps> = ({
  pinnedProducts,
  onRemoveProduct,
  onClearAll,
  lang,
  onOpenSpecs,
  onOpenCompareModal
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!pinnedProducts || pinnedProducts.length === 0) return null;

  // Auto-generate comparative summary highlighting differences in material, pressure, and size
  const generateComparativeSummary = () => {
    if (pinnedProducts.length < 2) {
      return {
        materialSummary: lang === 'vi' 
          ? `Sản phẩm hiện tại: ${pinnedProducts[0].material}. Hãy ghim thêm 1-2 van khác để hệ thống tự động so sánh vật liệu.` 
          : `Current product: ${pinnedProducts[0].materialEn || pinnedProducts[0].material}. Pin 1-2 more valves to compare materials.`,
        pressureSummary: lang === 'vi'
          ? `Cấp áp suất: ${pinnedProducts[0].pressure}.`
          : `Pressure class: ${pinnedProducts[0].pressure}.`,
        sizeSummary: lang === 'vi'
          ? `Dải kích thước: ${pinnedProducts[0].sizeRange}.`
          : `Size range: ${pinnedProducts[0].sizeRange}.`,
        aiInsight: lang === 'vi'
          ? 'Ghim thêm sản phẩm để kích hoạt phân tích tự động sai khác vật liệu, áp suất và ứng dụng.'
          : 'Pin another valve to activate automated mechanical delta analysis.'
      };
    }

    // 1. Material comparison
    const materials = pinnedProducts.map(p => ({
      code: p.code,
      mat: (lang === 'vi' ? p.material : p.materialEn) || p.material,
      group: p.materialGroup
    }));
    const uniqueMatGroups = new Set(materials.map(m => m.group));
    let materialSummary = '';
    if (uniqueMatGroups.size === 1) {
      materialSummary = lang === 'vi'
        ? `Tất cả ${pinnedProducts.length} van đều cùng nhóm vật liệu (${materials[0].mat}), mang lại tính đồng bộ cao trong môi trường chất lỏng tương đương.`
        : `All ${pinnedProducts.length} valves share similar metallurgy (${materials[0].mat}), providing uniform galvanic compatibility.`;
    } else {
      materialSummary = lang === 'vi'
        ? `Khác biệt về kim loại: ${materials.map(m => `${m.code} dùng [${m.mat}]`).join(' vs ')}. Van Inox ưu thế kháng hóa chất & chịu nhiệt, trong khi Van Gang/Thép WCB tối ưu chi phí cho môi trường nước & hơi thông dụng.`
        : `Metallurgy variance: ${materials.map(m => `${m.code} utilizes [${m.mat}]`).join(' vs ')}. Stainless steel variants excel in chemical duty, while ductile iron/carbon steel optimize budget for water and steam.`;
    }

    // 2. Pressure rating comparison
    const pressures = pinnedProducts.map(p => ({
      code: p.code,
      press: p.pressure,
      group: p.pressureGroup
    }));
    const uniquePress = new Set(pressures.map(p => p.press));
    let pressureSummary = '';
    if (uniquePress.size === 1) {
      pressureSummary = lang === 'vi'
        ? `Cùng dải áp suất làm việc ${pressures[0].press}, phù hợp đấu nối trên cùng tuyến ống áp lực.`
        : `Identical design pressure ${pressures[0].press}, suitable for uniform operating loop.`;
    } else {
      pressureSummary = lang === 'vi'
        ? `Chênh lệch cấp áp suất: ${pressures.map(p => `${p.code} (${p.press})`).join(' vs ')}. Lưu ý không lắp van có cấp áp thấp hơn tại đầu hút/xả máy bơm chịu áp lực cao.`
        : `Pressure delta: ${pressures.map(p => `${p.code} (${p.press})`).join(' vs ')}. Ensure lower pressure rated valves are not exposed to high-pressure pump discharge headers.`;
    }

    // 3. Size range comparison
    const sizes = pinnedProducts.map(p => ({
      code: p.code,
      size: p.sizeRange
    }));
    const sizeSummary = lang === 'vi'
      ? `Phạm vi đường kính: ${sizes.map(s => `${s.code} [${s.size}]`).join(' vs ')}.`
      : `Bore sizing range: ${sizes.map(s => `${s.code} [${s.size}]`).join(' vs ')}.`;

    // 4. Overall AI Insight
    const aiInsight = lang === 'vi'
      ? `Phân tích UTD: Khi lựa chọn giữa ${pinnedProducts.map(p => p.code).join(', ')}, hãy ưu tiên van có cấp độ kín ${pinnedProducts[0].leakageClass} nếu hệ thống yêu cầu chống rò rỉ bọt khí tuyệt đối.`
      : `Engineering synthesis: When selecting between ${pinnedProducts.map(p => p.code).join(', ')}, prioritize ISO 5208 Rate A sealing if zero-leakage shutoff is required.`;

    return {
      materialSummary,
      pressureSummary,
      sizeSummary,
      aiInsight
    };
  };

  const summary = generateComparativeSummary();

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl shadow-2xl transition-all duration-300">
      <div className="bg-slate-950/95 backdrop-blur-md border-2 border-amber-500/80 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-amber-500/30">
        {/* Floating Bar Header */}
        <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm font-mono uppercase tracking-wide">
                  {lang === 'vi' ? 'Bảng So Sánh Nhanh Sản Phẩm Đã Ghim' : 'Quick Pinned Valve Comparator'}
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {pinnedProducts.length}/3 {lang === 'vi' ? 'Sản phẩm' : 'Valves'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {lang === 'vi' ? 'Hệ thống tự động phân tích sai khác về vật liệu, cấp áp lực và dải kích cỡ.' : 'Auto-synthesizes differences in metallurgy, pressure class, and size range.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenCompareModal && pinnedProducts.length >= 2 && (
              <button
                type="button"
                onClick={onOpenCompareModal}
                className="px-2.5 py-1 text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg transition-all flex items-center gap-1 shadow"
                title="Mở bảng so sánh overlay toàn màn hình"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>So Sánh Chi Tiết (Modal)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClearAll}
              className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              title={lang === 'vi' ? 'Bỏ ghim toàn bộ' : 'Clear all pinned'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Xóa ghim' : 'Clear'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Pinned Chips Strip (Always visible) */}
        <div className="px-4 py-2.5 bg-slate-950/80 flex items-center gap-2 overflow-x-auto border-b border-slate-900">
          {[0, 1, 2].map((slotIdx) => {
            const product = pinnedProducts[slotIdx];
            if (!product) {
              return (
                <div 
                  key={slotIdx}
                  className="flex-1 min-w-[140px] border border-dashed border-slate-800 rounded-xl p-2 flex items-center justify-center text-slate-600 text-xs font-mono"
                >
                  <Pin className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                  <span>{lang === 'vi' ? `+ Ghim van #${slotIdx + 1}` : `+ Pin slot #${slotIdx + 1}`}</span>
                </div>
              );
            }

            return (
              <div 
                key={product.id}
                className="flex-1 min-w-[180px] bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/60 rounded-xl p-2 flex items-center justify-between gap-2 transition-all shadow"
              >
                <div 
                  className="flex items-center gap-2 cursor-pointer overflow-hidden"
                  onClick={() => onOpenSpecs && onOpenSpecs(product)}
                  title="Bấm để xem chi tiết thông số"
                >
                  <img
                    src={resolveProductImageUrl(product.imageVariants?.thumbnail || product.image)}
                    alt={product.code}
                    className="w-9 h-9 object-contain rounded bg-slate-950 p-0.5 border border-slate-800 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="overflow-hidden">
                    <span className="font-mono font-bold text-xs text-amber-300 block truncate">
                      {product.code}
                    </span>
                    <span className="text-[10px] text-slate-300 block truncate">
                      {lang === 'vi' ? product.name : product.nameEn}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveProduct(product.id)}
                  className="p-1 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
                  title={lang === 'vi' ? 'Bỏ ghim sản phẩm này' : 'Unpin this valve'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Expanded Comparative Detail Section */}
        {isExpanded && (
          <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-4 text-xs animate-fade-in bg-slate-950">
            {/* Auto-Generated Summary Highlights Box */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 border border-amber-500/40 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs uppercase tracking-wide border-b border-amber-500/20 pb-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{lang === 'vi' ? 'Điểm Khác Biệt Kỹ Thuật (Tự Động Tổng Hợp):' : 'Key Engineering Differences (Auto-Synthesized):'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                {/* 1. Material */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-sky-400 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    1. {lang === 'vi' ? 'Vật Liệu Thân (Material)' : 'Material Metallurgy'}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {summary.materialSummary}
                  </p>
                </div>

                {/* 2. Pressure Rating */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    2. {lang === 'vi' ? 'Cấp Áp Lực (Pressure Rating)' : 'Pressure Rating'}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {summary.pressureSummary}
                  </p>
                </div>

                {/* 3. Size Range */}
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    3. {lang === 'vi' ? 'Dải Kích Cỡ (Size Range)' : 'Bore Size Range'}
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {summary.sizeSummary}
                  </p>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-amber-300/90 font-medium italic flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{summary.aiInsight}</span>
              </div>
            </div>

            {/* Side-by-side Table Breakdown */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <th className="py-2 px-3">{lang === 'vi' ? 'Thông Số' : 'Parameter'}</th>
                    {pinnedProducts.map((p) => (
                      <th key={p.id} className="py-2 px-3 font-bold text-amber-400">
                        {p.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-200">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-400">{lang === 'vi' ? 'Tên dòng van' : 'Valve Name'}</td>
                    {pinnedProducts.map((p) => (
                      <td key={p.id} className="py-2 px-3 font-sans font-bold">
                        {lang === 'vi' ? p.name : p.nameEn}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-900/40">
                    <td className="py-2 px-3 font-semibold text-slate-400">{lang === 'vi' ? 'Vật liệu thân' : 'Material'}</td>
                    {pinnedProducts.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-sky-300 font-semibold">
                        {lang === 'vi' ? p.material : p.materialEn}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-400">{lang === 'vi' ? 'Cấp áp suất' : 'Pressure'}</td>
                    {pinnedProducts.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-amber-400 font-bold">
                        {p.pressure}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-900/40">
                    <td className="py-2 px-3 font-semibold text-slate-400">{lang === 'vi' ? 'Dải kích cỡ' : 'Size Range'}</td>
                    {pinnedProducts.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-emerald-400 font-bold">
                        {p.sizeRange}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-400">{lang === 'vi' ? 'Nhiệt độ hoạt động' : 'Temperature'}</td>
                    {pinnedProducts.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-red-300">
                        {p.tempRange}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-900/40">
                    <td className="py-2 px-3 font-semibold text-slate-400">{lang === 'vi' ? 'Kiểu kết nối' : 'Connection'}</td>
                    {pinnedProducts.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-slate-300">
                        {p.connection}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-400">{lang === 'vi' ? 'Cấp độ kín khít' : 'Leakage Class'}</td>
                    {pinnedProducts.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-emerald-300">
                        {p.leakageClass}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
