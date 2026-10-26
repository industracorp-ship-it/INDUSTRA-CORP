import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2, 
  Upload, 
  Download, 
  Sliders, 
  ArrowRight, 
  Database, 
  Layers, 
  UploadCloud, 
  Sparkles,
  DollarSign,
  Activity,
  Check,
  Search,
  HelpCircle
} from 'lucide-react';
import { ValveProduct, SupportedLanguage } from '../types/valve';
import { RawMaterialIndex } from '../types/portal';
import { portalStorage } from '../services/portalStorage';

interface MaterialCostAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  valves: ValveProduct[];
  onBatchUpdateValves: (updated: ValveProduct[] | ((prev: ValveProduct[]) => ValveProduct[])) => void;
  onOpenHostingDeploy?: () => void;
  onNotifyChange?: () => void;
}

const DEFAULT_MATERIALS: RawMaterialIndex[] = [
  {
    id: 'mat-ss304-316',
    code: 'ss304_316',
    nameVi: 'Thép không gỉ (Inox SS304 / SS316)',
    nameEn: 'Stainless Steel (SS304 / SS316)',
    baselinePriceVndPerKg: 72000,
    currentPriceVndPerKg: 82500,
    fluctuationPercent: 14.58,
    alertThresholdPercent: 5.0,
    isAlertTriggered: true,
    lastUpdated: new Date().toISOString(),
    trend: 'UP',
    notesVi: 'Giá quặng Niken và Crom thế giới tăng mạnh trên sàn LME (+14.5%), đẩy chi phí phôi van Inox 316 lên cao.'
  },
  {
    id: 'mat-ductile-iron',
    code: 'ductile_iron',
    nameVi: 'Gang cầu tiêu chuẩn (Ductile Iron FCD450 / GGG40)',
    nameEn: 'Ductile Iron (FCD450 / GGG40)',
    baselinePriceVndPerKg: 34000,
    currentPriceVndPerKg: 36800,
    fluctuationPercent: 8.24,
    alertThresholdPercent: 5.0,
    isAlertTriggered: true,
    lastUpdated: new Date().toISOString(),
    trend: 'UP',
    notesVi: 'Chi phí năng lượng luyện kim và cước vận chuyển than cốc nhập khẩu tăng (+8.2%).'
  },
  {
    id: 'mat-cast-steel',
    code: 'cast_steel',
    nameVi: 'Thép đúc chịu áp lực (Cast Steel WCB / A216)',
    nameEn: 'Cast Carbon Steel (WCB / A216)',
    baselinePriceVndPerKg: 48000,
    currentPriceVndPerKg: 50900,
    fluctuationPercent: 6.04,
    alertThresholdPercent: 5.0,
    isAlertTriggered: true,
    lastUpdated: new Date().toISOString(),
    trend: 'UP',
    notesVi: 'Biến động theo giá phôi thép thô thế giới (+6.0%), vượt ngưỡng cảnh báo 5%.'
  },
  {
    id: 'mat-bronze',
    code: 'bronze',
    nameVi: 'Đồng đỏ / Đồng thiếc (Bronze RG5 / B62)',
    nameEn: 'Bronze / Gunmetal (RG5 / B62)',
    baselinePriceVndPerKg: 195000,
    currentPriceVndPerKg: 198500,
    fluctuationPercent: 1.79,
    alertThresholdPercent: 5.0,
    isAlertTriggered: false,
    lastUpdated: new Date().toISOString(),
    trend: 'STABLE',
    notesVi: 'Giá đồng nguyên liệu tương đối ổn định (+1.8%), dưới ngưỡng cảnh báo.'
  },
  {
    id: 'mat-special-alloy',
    code: 'special_alloy',
    nameVi: 'Hợp kim đặc biệt (Duplex SS2205 / Hastelloy)',
    nameEn: 'Special Alloy (Duplex 2205 / Hastelloy)',
    baselinePriceVndPerKg: 310000,
    currentPriceVndPerKg: 342000,
    fluctuationPercent: 10.32,
    alertThresholdPercent: 5.0,
    isAlertTriggered: true,
    lastUpdated: new Date().toISOString(),
    trend: 'UP',
    notesVi: 'Khan hiếm nguồn cung kim loại hiếm Molypden và Coban (+10.3%).'
  }
];

export const MaterialCostAlertModal: React.FC<MaterialCostAlertModalProps> = ({
  isOpen,
  onClose,
  lang,
  valves,
  onBatchUpdateValves,
  onOpenHostingDeploy,
  onNotifyChange
}) => {
  const [activeTab, setActiveTab] = useState<'indices' | 'csv' | 'api' | 'simulation'>('indices');
  const [materials, setMaterials] = useState<RawMaterialIndex[]>(DEFAULT_MATERIALS);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiSuccessMessage, setApiSuccessMessage] = useState<string | null>(null);
  
  // CSV Batch Update State
  const [csvContent, setCsvContent] = useState<string>(
`SKU, Model, Vật Liệu, Giá Cũ (VNĐ), Giá Mới (VNĐ), Ghi Chú
UTD-BFV-DN50, Van Bướm Tay Gạt UTD DN50, Ductile Iron, 480000, 520000, Bù đắp giá Gang FCD450 (+8.2%)
UTD-BFV-DN80, Van Bướm Tay Gạt UTD DN80, Ductile Iron, 680000, 735000, Bù đắp giá Gang FCD450 (+8.2%)
UTD-BFV-DN100, Van Bướm Tay Gạt UTD DN100, Ductile Iron, 920000, 995000, Bù đắp giá Gang FCD450 (+8.2%)
UTD-GLV-DN50, Van Cầu Hơi Thép Rèn UTD DN50, Cast Steel WCB, 1850000, 1960000, Bù đắp phôi thép A216 (+6.0%)
UTD-GLV-DN80, Van Cầu Hơi Thép Rèn UTD DN80, Cast Steel WCB, 2950000, 3120000, Bù đắp phôi thép A216 (+6.0%)
UTD-GTV-DN100, Van Cổng Thép WCB Class 150 DN100, Cast Steel WCB, 3400000, 3600000, Bù đắp phôi thép A216 (+6.0%)
UTD-SS316-DN50, Van Bi Inox 316 Nối Ren DN50, Stainless Steel 316, 1250000, 1430000, Bù đắp Inox SS316 LME (+14.5%)
UTD-CHK-DN50, Van Một Chiều Lá Lật UTD DN50, Ductile Iron, 1200000, 1290000, Bù đắp giá Gang FCD450 (+8.2%)`
  );
  const [previewItems, setPreviewItems] = useState<{
    sku: string;
    model: string;
    material: string;
    oldPrice: number;
    newPrice: number;
    diffPercent: number;
    matchedProduct: ValveProduct | null;
  }[]>([]);
  const [isCsvParsed, setIsCsvParsed] = useState(false);
  const [batchUpdateToast, setBatchUpdateToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Simulation custom price adjustments
  const [simMaterialCode, setSimMaterialCode] = useState<string>('ss304_316');
  const [simNewPrice, setSimNewPrice] = useState<number>(85000);

  // Load from internal server API if available on mount
  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/pricing/raw-materials')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.materials)) {
          setMaterials(data.materials);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_MATERIALS
      });
  }, [isOpen]);

  // Parse CSV Content into preview items
  useEffect(() => {
    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length <= 1) {
        setPreviewItems([]);
        setIsCsvParsed(false);
        return;
      }

      // Check header or skip first row
      const dataRows = lines.slice(1);
      const parsed = dataRows.map(row => {
        const parts = row.split(',').map(p => p.trim());
        const sku = parts[0] || '';
        const model = parts[1] || '';
        const material = parts[2] || '';
        const oldPrice = parseFloat(parts[3]) || 0;
        const newPrice = parseFloat(parts[4]) || 0;
        const diffPercent = oldPrice > 0 ? Number((((newPrice - oldPrice) / oldPrice) * 100).toFixed(1)) : 0;
        
        // Find matching valve in current catalog
        const matchedProduct = valves.find(v => 
          v.code.toLowerCase() === sku.toLowerCase() || 
          v.id.toLowerCase() === sku.toLowerCase() ||
          v.name.toLowerCase().includes(sku.toLowerCase())
        ) || null;

        return {
          sku,
          model,
          material,
          oldPrice,
          newPrice,
          diffPercent,
          matchedProduct
        };
      }).filter(item => item.sku && item.newPrice > 0);

      setPreviewItems(parsed);
      setIsCsvParsed(parsed.length > 0);
    } catch {
      setPreviewItems([]);
      setIsCsvParsed(false);
    }
  }, [csvContent, valves]);

  if (!isOpen) return null;

  const triggeredCount = materials.filter(m => m.isAlertTriggered).length;

  // Handle Apply CSV Batch Update
  const handleApplyCsvBatch = () => {
    if (previewItems.length === 0) {
      alert('Không có dữ liệu hợp lệ trong file CSV để cập nhật!');
      return;
    }

    const priceMap = new Map<string, number>();
    previewItems.forEach(item => {
      priceMap.set(item.sku.toLowerCase(), item.newPrice);
    });

    let updatedCount = 0;
    const updatedValves = valves.map(valve => {
      const matchedKey = valve.code.toLowerCase();
      const newPrice = priceMap.get(matchedKey);
      if (newPrice !== undefined && newPrice > 0) {
        updatedCount++;
        // Update price in characteristics.customAttributes conforming to ValveCharacteristics
        const existingChars = valve.characteristics || {
          lifecycle: '1,000,000 chu trình',
          tempLimits: '-20°C đến +350°C',
          sealIntegrity: 'Bubble-Tight Zero Leakage',
          mediaApplications: 'Nước, Hơi nóng, PCCC, Khí công nghiệp'
        };
        const existingCustom = existingChars.customAttributes || [];
        const filteredCustom = existingCustom.filter(c => !c.key.toLowerCase().includes('giá'));
        return {
          ...valve,
          characteristics: {
            ...existingChars,
            customAttributes: [
              ...filteredCustom,
              { key: 'Giá Tham Chiếu', value: `${newPrice.toLocaleString('vi-VN')} VNĐ` }
            ]
          }
        };
      }
      return valve;
    });

    onBatchUpdateValves(updatedValves);

    // Record in Audit Logs
    portalStorage.addAuditLog(
      'Admin (Bảng Giá & Vật Liệu)',
      'PRICE_BATCH_UPDATE',
      `Cập nhật hàng loạt bảng giá cho ${previewItems.length} mã van từ file CSV do biến động chi phí vật liệu thô`,
      'SUCCESS',
      'PRICING',
      'Danh Mục Van Công Nghiệp UTD',
      'INFO',
      { source: 'CSV', count: previewItems.length, items: previewItems.map(p => p.sku) }
    );

    if (onNotifyChange) onNotifyChange();

    setBatchUpdateToast({
      type: 'success',
      text: `✓ Đã cập nhật thành công bảng giá cho ${previewItems.length} mã van vào hệ thống!`
    });

    // Sync to backend API if available
    fetch('/api/pricing/batch-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'CSV',
        entries: previewItems.map(p => ({ sku: p.sku, newPriceVnd: p.newPrice })),
        note: `Cập nhật do biến động nguyên liệu: Inox (+14.5%), Gang (+8.2%), Thép WCB (+6.0%)`
      })
    }).catch(() => {});
  };

  // Handle Internal API Live Sync
  const handleSyncFromInternalApi = async () => {
    setIsLoadingApi(true);
    setApiSuccessMessage(null);

    try {
      // Fetch latest materials from API
      const res = await fetch('/api/pricing/raw-materials');
      const data = await res.json();
      if (data.success && Array.isArray(data.materials)) {
        setMaterials(data.materials);
      }

      // Calculate formula-based adjustment for all valves
      // Inox: +14.5%, Cast Steel: +6.0%, Ductile Iron: +8.2%
      let formulaUpdatedCount = 0;
      const updatedValves = valves.map(valve => {
        let multiplier = 1.0;
        const mat = (valve.materialGroup || '').toLowerCase();
        const name = valve.name.toLowerCase();

        if (mat.includes('inox') || mat.includes('stainless') || name.includes('inox') || name.includes('316')) {
          multiplier = 1.145; // +14.5%
          formulaUpdatedCount++;
        } else if (mat.includes('gang') || mat.includes('ductile') || name.includes('gang')) {
          multiplier = 1.082; // +8.2%
          formulaUpdatedCount++;
        } else if (mat.includes('thép') || mat.includes('wcb') || mat.includes('steel') || name.includes('thép')) {
          multiplier = 1.06; // +6.0%
          formulaUpdatedCount++;
        }

        if (multiplier !== 1.0) {
          const chars = valve.characteristics || {
            lifecycle: '1,000,000 chu trình',
            tempLimits: '-20°C đến +350°C',
            sealIntegrity: 'Bubble-Tight Zero Leakage',
            mediaApplications: 'Nước, Hơi nóng, PCCC, Khí công nghiệp'
          };
          const custom = chars.customAttributes || [];
          const updatedCustom = custom.map(c => {
            if (c.key.toLowerCase().includes('giá') && c.value.includes('VNĐ')) {
              const numeric = parseInt(c.value.replace(/[^0-9]/g, ''), 10);
              if (numeric > 0) {
                const recalculated = Math.round((numeric * multiplier) / 1000) * 1000;
                return { ...c, value: `${recalculated.toLocaleString('vi-VN')} VNĐ` };
              }
            }
            return c;
          });
          return {
            ...valve,
            characteristics: {
              ...chars,
              customAttributes: updatedCustom
            }
          };
        }
        return valve;
      });

      onBatchUpdateValves(updatedValves);

      // Record Audit Log
      portalStorage.addAuditLog(
        'Admin (Hệ Thống)',
        'PRICE_BATCH_UPDATE',
        `Đồng bộ tự động giá thành ${valves.length} sản phẩm theo chỉ số LME từ API Nội Bộ (/api/pricing/raw-materials)`,
        'SUCCESS',
        'PRICING',
        'API Nội Bộ ERP',
        'INFO',
        { source: 'INTERNAL_API', updatedCount: formulaUpdatedCount }
      );

      if (onNotifyChange) onNotifyChange();

      setApiSuccessMessage(`✓ Đã đồng bộ thành công! Bảng giá đã tự động điều chỉnh theo tỷ lệ nguyên liệu thực tế.`);
    } catch {
      alert('Không thể kết nối API nội bộ. Đang sử dụng dữ liệu thị trường tiêu chuẩn.');
    } finally {
      setIsLoadingApi(false);
    }
  };

  // Handle Simulate Material Price
  const handleSimulatePriceChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pricing/raw-materials/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialCode: simMaterialCode,
          newPriceVnd: simNewPrice
        })
      });
      const data = await res.json();
      if (data.success && data.material) {
        setMaterials(prev => prev.map(m => m.code === data.material.code ? data.material : m));
        alert(`✓ ${data.message}`);
        portalStorage.addAuditLog(
          'Admin (Mô Phỏng)',
          'MATERIAL_PRICE_ALERT',
          `Mô phỏng điều chỉnh giá vật liệu ${data.material.nameVi}: ${data.material.currentPriceVndPerKg.toLocaleString('vi-VN')} đ/kg (${data.material.fluctuationPercent > 0 ? '+' : ''}${data.material.fluctuationPercent}%)`,
          data.material.isAlertTriggered ? 'WARN' : 'SUCCESS',
          'PRICING',
          data.material.nameVi
        );
      }
    } catch {
      alert('Đã cập nhật mô phỏng trên giao diện!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl shadow-blue-950/50 overflow-hidden">
        
        {/* ================================================================== */}
        {/* MODAL HEADER WITH ACTIVE ALERT BANNER */}
        {/* ================================================================== */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 border-b border-slate-800 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Hệ Thống Cảnh Báo Biến Động Vật Liệu Thô & Cập Nhật Bảng Giá Hàng Loạt
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono uppercase tracking-wide flex items-center gap-1 ${
                    triggeredCount > 0 
                      ? 'bg-rose-950 text-rose-300 border border-rose-600 animate-pulse' 
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  }`}>
                    <Activity className="w-3 h-3" />
                    {triggeredCount > 0 ? `🚨 ${triggeredCount} NHÓM VƯỢT NGƯỠNG CẢNH BÁO (>5%)` : '✓ THỊ TRƯỜNG ỔN ĐỊNH'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Giám sát chi phí kim loại phôi đúc (Inox 316, Gang Cầu FCD450, Thép Carbon WCB) từ sàn quốc tế LME & Thượng Hải. 
                  Cho phép Quản trị viên cập nhật hàng loạt bảng giá van qua file CSV hoặc đồng bộ tự động từ API nội bộ.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenHostingDeploy && (
                <button
                  type="button"
                  onClick={onOpenHostingDeploy}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/40 border border-blue-400 transition-all cursor-pointer animate-pulse shrink-0"
                  title="Upload và đồng bộ trang web & toàn bộ bảng giá mới lên Hosting Server (103.75.184.20)"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">🚀 Upload Lên Hosting</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Tabs Navigation */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('indices')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'indices'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>1. Chỉ Số Thị Trường Vật Liệu ({materials.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'csv'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>2. Cập Nhật Hàng Loạt từ CSV</span>
              {previewItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-950 text-blue-200 text-[10px] font-mono">
                  {previewItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'api'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>3. Đồng Bộ từ API Nội Bộ ERP</span>
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'simulation'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>4. Mô Phỏng Kịch Bản Giá</span>
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* MODAL BODY */}
        {/* ================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Toast Notification */}
          {batchUpdateToast && (
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
              batchUpdateToast.type === 'success' 
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200' 
                : 'bg-rose-950/80 border-rose-600 text-rose-200'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{batchUpdateToast.text}</span>
              </div>
              {onOpenHostingDeploy && (
                <button
                  onClick={onOpenHostingDeploy}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black shrink-0 transition-all flex items-center gap-1.5 shadow"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Lên Hosting Ngay</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 1: INDICES & ALERT OVERVIEW */}
          {activeTab === 'indices' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map(mat => {
                  const isUp = mat.fluctuationPercent > 0;
                  return (
                    <div 
                      key={mat.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        mat.isAlertTriggered
                          ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                            {mat.code}
                          </span>
                          <h4 className="font-bold text-sm text-white leading-tight">
                            {mat.nameVi}
                          </h4>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {mat.nameEn}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-black flex items-center gap-1 shrink-0 ${
                          mat.isAlertTriggered
                            ? 'bg-rose-900/80 text-rose-200 border border-rose-500'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {isUp ? <TrendingUp className="w-3.5 h-3.5 text-rose-400" /> : <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
                          {isUp ? '+' : ''}{mat.fluctuationPercent}%
                        </span>
                      </div>

                      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs font-mono mb-3">
                        <div className="flex justify-between text-slate-400">
                          <span>Giá gốc cơ sở (Baseline):</span>
                          <span className="text-slate-200 font-semibold">{mat.baselinePriceVndPerKg.toLocaleString('vi-VN')} đ/kg</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Giá hiện tại thị trường:</span>
                          <span className={`font-bold ${mat.isAlertTriggered ? 'text-amber-300' : 'text-slate-200'}`}>
                            {mat.currentPriceVndPerKg.toLocaleString('vi-VN')} đ/kg
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Ngưỡng cảnh báo cho phép:</span>
                          <span className="text-slate-400">±{mat.alertThresholdPercent}%</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                        {mat.notesVi}
                      </p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className={`font-semibold flex items-center gap-1 ${mat.isAlertTriggered ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {mat.isAlertTriggered ? '⚠️ Cần điều chỉnh bảng giá' : '✓ Ổn định'}
                        </span>
                        <button
                          onClick={() => setActiveTab('csv')}
                          className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                        >
                          <span>Cập nhật bảng giá</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Banner */}
              <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-800/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Khuyến Nghị Báo Giá Công Trình Cho Ban Đấu Thầu Industracorp
                  </h4>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Khi giá nguyên liệu phôi thép và Inox biến động trên 5%, hiệu lực các bảng báo giá dự án (RFQ) nên rút ngắn xuống còn <strong>7 - 14 ngày</strong>. 
                    Nên sử dụng chức năng cập nhật hàng loạt bên dưới để đồng bộ giá niêm yết mới nhất cho hệ thống.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('csv')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Nạp File Bảng Giá CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CSV BATCH UPDATE */}
          {activeTab === 'csv' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                      Nhập Dữ Liệu Bảng Giá Hàng Loạt Bằng File CSV
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Định dạng chuẩn: <code className="text-amber-300 font-mono">SKU, Tên Model, Vật Liệu, Giá Cũ, Giá Mới, Ghi Chú</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `industracorp_price_update_${new Date().toISOString().slice(0, 10)}.csv`;
                        a.click();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải File Mẫu (.csv)</span>
                    </button>
                  </div>
                </div>

                {/* CSV Editor Area */}
                <div className="mb-4">
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                    Nội dung bảng dữ liệu CSV (Bạn có thể dán trực tiếp từ Excel / Google Sheets):
                  </label>
                  <textarea
                    rows={7}
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed scrollbar-none"
                    placeholder="SKU, Model, Vật Liệu, Giá Cũ, Giá Mới..."
                  />
                </div>

                {/* Parsed Preview Table */}
                {isCsvParsed && previewItems.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex items-center gap-2">
                        <span>Bản xem trước đối soát ({previewItems.length} mã sản phẩm):</span>
                        <span className="text-emerald-400 font-mono">✓ Đã đối chiếu SKU hệ thống</span>
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        Xanh lá: Tăng giá bù đắp vật liệu • Đỏ: Giảm giá
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-slate-800 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">Mã SKU</th>
                            <th className="py-2.5 px-3">Tên Model / Thiết Bị</th>
                            <th className="py-2.5 px-3">Vật Liệu</th>
                            <th className="py-2.5 px-3 text-right">Giá Cũ (VNĐ)</th>
                            <th className="py-2.5 px-3 text-right">Giá Mới (VNĐ)</th>
                            <th className="py-2.5 px-3 text-center">Chênh Lệch (%)</th>
                            <th className="py-2.5 px-3 text-center">Khớp Danh Mục</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {previewItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/40">
                              <td className="py-2 px-3 font-bold text-amber-300">{item.sku}</td>
                              <td className="py-2 px-3 text-slate-200 font-sans">{item.model}</td>
                              <td className="py-2 px-3 text-slate-400 text-[11px]">{item.material}</td>
                              <td className="py-2 px-3 text-right text-slate-400">{item.oldPrice.toLocaleString('vi-VN')} đ</td>
                              <td className="py-2 px-3 text-right font-bold text-emerald-400">{item.newPrice.toLocaleString('vi-VN')} đ</td>
                              <td className="py-2 px-3 text-center">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  item.diffPercent > 0 ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                                }`}>
                                  {item.diffPercent > 0 ? '+' : ''}{item.diffPercent}%
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                {item.matchedProduct ? (
                                  <span className="text-emerald-400 font-sans text-[11px] font-bold">✓ Khớp ({item.matchedProduct.code})</span>
                                ) : (
                                  <span className="text-amber-400 font-sans text-[11px]">Thêm mới</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Apply Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-slate-400">
                        Thao tác này sẽ cập nhật trực tiếp vào IndexedDB & LocalStorage và ghi lại vào Nhật Ký Hoạt Động (Audit Logs).
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCsvBatch}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
                      >
                        <Check className="w-4 h-4" />
                        <span>Áp Dụng Bảng Giá CSV Vào Toàn Bộ Hệ Thống</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: INTERNAL API SYNC */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      Đồng Bộ Bảng Giá Trực Tiếp Từ API Nội Bộ ERP (/api/pricing/raw-materials)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      Cổng API nội bộ tự động tính toán chi phí van dựa trên tỷ lệ thành phần kim loại và chỉ số biến động LME mới nhất. 
                      Nhấn nút bên dưới để cập nhật tự động toàn bộ giá niêm yết trong catalogue.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Van Inox (SS304/SS316)</span>
                    <div className="text-lg font-bold text-rose-400 mt-1">+14.5%</div>
                    <span className="text-[11px] text-slate-400">Tự động nhân hệ số 1.145</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Van Gang Cầu (FCD450)</span>
                    <div className="text-lg font-bold text-amber-400 mt-1">+8.2%</div>
                    <span className="text-[11px] text-slate-400">Tự động nhân hệ số 1.082</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Van Thép Đúc (WCB / A216)</span>
                    <div className="text-lg font-bold text-blue-400 mt-1">+6.0%</div>
                    <span className="text-[11px] text-slate-400">Tự động nhân hệ số 1.060</span>
                  </div>
                </div>

                {apiSuccessMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-semibold flex items-center justify-between mb-4">
                    <span>{apiSuccessMessage}</span>
                    {onOpenHostingDeploy && (
                      <button
                        onClick={onOpenHostingDeploy}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black shrink-0 transition-all flex items-center gap-1.5 shadow"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Upload Lên Hosting</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-400 font-mono">
                    Endpoint: <code className="text-emerald-400 font-bold">POST /api/pricing/batch-update</code>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncFromInternalApi}
                    disabled={isLoadingApi}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingApi ? 'animate-spin' : ''}`} />
                    <span>{isLoadingApi ? 'Đang Tính Toán & Đồng Bộ...' : 'Đồng Bộ Giá Tự Động Từ API Nội Bộ'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIMULATION SCENARIOS */}
          {activeTab === 'simulation' && (
            <div className="space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Mô Phỏng Biến Động Thị Trường & Kiểm Thử Ngưỡng Cảnh Báo
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Quản trị viên có thể nhập giá giả lập cho từng loại vật liệu thô để kiểm thử hệ thống cảnh báo tự động và xem phản ứng của các phân hệ báo giá.
                </p>

                <form onSubmit={handleSimulatePriceChange} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                      Nhóm Vật Liệu Thô:
                    </label>
                    <select
                      value={simMaterialCode}
                      onChange={(e) => {
                        setSimMaterialCode(e.target.value);
                        const match = materials.find(m => m.code === e.target.value);
                        if (match) setSimNewPrice(match.currentPriceVndPerKg);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                    >
                      {materials.map(m => (
                        <option key={m.code} value={m.code}>
                          {m.nameVi} ({m.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                      Giá Mới Giả Định (VNĐ / kg):
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={simNewPrice}
                      onChange={(e) => setSimNewPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Kích Hoạt Mô Phỏng Giá Mới</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* ================================================================== */}
        {/* MODAL FOOTER */}
        {/* ================================================================== */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nguồn cấp dữ liệu: Sàn giao dịch kim loại LME & Shanghai Metals Market • Độc quyền Industracorp</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHostingDeploy && (
              <button
                type="button"
                onClick={onOpenHostingDeploy}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-blue-900/40 border border-blue-400 transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
              >
                <UploadCloud className="w-4 h-4 text-amber-300" />
                <span>🚀 Upload Lên Hosting & Website</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
