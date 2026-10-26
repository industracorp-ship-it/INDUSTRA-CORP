import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Plus, 
  Check, 
  ShieldCheck, 
  Gauge, 
  Layers, 
  Thermometer, 
  FileCode2, 
  CheckCircle2, 
  Info,
  Edit3,
  Save,
  Trash2,
  RotateCcw,
  Sparkles,
  Droplet,
  Clock,
  Activity,
  Calculator,
  TrendingUp,
  Camera,
  Wrench,
  Box,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { ValveProduct, UserRole, ValveDimensionSpec, CustomCharacteristic, ValveCharacteristics, SupportedLanguage } from '../types/valve';
import { synthesizeValveCharacteristics } from '../utils/aiCharacteristics';
import { translateTechString } from '../utils/engineeringTranslator';
import { UnitConverterWidget } from './UnitConverterWidget';
import { ValveFlowChart } from './ValveFlowChart';
import { Valve3DViewer } from './Valve3DViewer';
import { ValveInstallationGuideModal } from './ValveInstallationGuideModal';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';

interface SpecModalProps {
  valve: ValveProduct | null;
  onClose: () => void;
  lang: SupportedLanguage;
  userRole: UserRole;
  onToggleRfq: (product: ValveProduct) => void;
  isInRfq: boolean;
  isAdminMode?: boolean;
  onSaveValve?: (updated: ValveProduct) => void;
  onOpenKnowledge?: (tab?: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly') => void;
}

export const SpecModal: React.FC<SpecModalProps> = ({
  valve,
  onClose,
  lang,
  userRole,
  onToggleRfq,
  isInRfq,
  isAdminMode = false,
  onSaveValve,
  onOpenKnowledge,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [showFlowChart, setShowFlowChart] = useState(true);
  const [visualMode, setVisualMode] = useState<'3d' | 'photo'>('3d');
  const [isInstallationGuideOpen, setIsInstallationGuideOpen] = useState(false);

  // Editable fields state
  const [testPressureShell, setTestPressureShell] = useState(valve?.testPressureShell || '');
  const [testPressureSeat, setTestPressureSeat] = useState(valve?.testPressureSeat || '');
  const [tempRange, setTempRange] = useState(valve?.tempRange || '');
  const [leakageClass, setLeakageClass] = useState(valve?.leakageClass || '');
  const [standardsText, setStandardsText] = useState((valve?.standards || []).join(', '));
  const [highlightsText, setHighlightsText] = useState((valve?.highlightFeatures || []).join('\n'));
  const [specs, setSpecs] = useState<ValveDimensionSpec[]>(valve?.specs || []);

  // AI Characteristics state
  const [lifecycle, setLifecycle] = useState('');
  const [lifecycleEn, setLifecycleEn] = useState('');
  const [tempLimits, setTempLimits] = useState('');
  const [tempLimitsEn, setTempLimitsEn] = useState('');
  const [sealIntegrity, setSealIntegrity] = useState('');
  const [sealIntegrityEn, setSealIntegrityEn] = useState('');
  const [mediaApplications, setMediaApplications] = useState('');
  const [mediaApplicationsEn, setMediaApplicationsEn] = useState('');
  const [aiSummaryNotes, setAiSummaryNotes] = useState('');
  const [aiSummaryNotesEn, setAiSummaryNotesEn] = useState('');
  const [customAttributes, setCustomAttributes] = useState<CustomCharacteristic[]>([]);

  useEffect(() => {
    if (valve) {
      setTestPressureShell(valve.testPressureShell || '');
      setTestPressureSeat(valve.testPressureSeat || '');
      setTempRange(valve.tempRange || '');
      setLeakageClass(valve.leakageClass || '');
      setStandardsText((valve.standards || []).join(', '));
      setHighlightsText((valve.highlightFeatures || []).join('\n'));
      setSpecs(valve.specs || []);

      const char = valve.characteristics || synthesizeValveCharacteristics(valve);
      setLifecycle(char.lifecycle || '');
      setLifecycleEn(char.lifecycleEn || '');
      setTempLimits(char.tempLimits || '');
      setTempLimitsEn(char.tempLimitsEn || '');
      setSealIntegrity(char.sealIntegrity || '');
      setSealIntegrityEn(char.sealIntegrityEn || '');
      setMediaApplications(char.mediaApplications || '');
      setMediaApplicationsEn(char.mediaApplicationsEn || '');
      setAiSummaryNotes(char.aiSummaryNotes || '');
      setAiSummaryNotesEn(char.aiSummaryNotesEn || '');
      setCustomAttributes(char.customAttributes || []);

      setIsEditing(false);
      setSaveSuccess(false);
    }
  }, [valve]);

  if (!valve) return null;

  const handleCadDownload = (format: 'STEP' | 'DWG' | 'PDF') => {
    setDownloadSuccess(
      lang === 'vi'
        ? `Đang tải file kỹ thuật ${format} cho mã ${valve.code}...`
        : `Downloading ${format} engineering drawing for ${valve.code}...`
    );
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 3500);
  };

  const handleReSynthesizeCharacteristics = () => {
    if (!valve) return;
    const reSynthesized = synthesizeValveCharacteristics({
      ...valve,
      tempRange,
      leakageClass,
    });
    setLifecycle(reSynthesized.lifecycle);
    setLifecycleEn(reSynthesized.lifecycleEn || '');
    setTempLimits(reSynthesized.tempLimits);
    setTempLimitsEn(reSynthesized.tempLimitsEn || '');
    setSealIntegrity(reSynthesized.sealIntegrity);
    setSealIntegrityEn(reSynthesized.sealIntegrityEn || '');
    setMediaApplications(reSynthesized.mediaApplications);
    setMediaApplicationsEn(reSynthesized.mediaApplicationsEn || '');
    setAiSummaryNotes(reSynthesized.aiSummaryNotes || '');
    setAiSummaryNotesEn(reSynthesized.aiSummaryNotesEn || '');
    setCustomAttributes(reSynthesized.customAttributes || []);
  };

  const handleAddCustomAttribute = () => {
    const newAttr: CustomCharacteristic = {
      id: `attr-${Date.now()}`,
      key: lang === 'vi' ? 'Đặc tính kỹ thuật mới' : 'New Technical Attribute',
      keyEn: 'New Technical Attribute',
      value: lang === 'vi' ? 'Giá trị tiêu chuẩn' : 'Standard Value',
      valueEn: 'Standard Value',
    };
    setCustomAttributes([...customAttributes, newAttr]);
  };

  const handleDeleteCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, idx) => idx !== index));
  };

  const handleUpdateCustomAttribute = (index: number, field: keyof CustomCharacteristic, val: string) => {
    const updated = [...customAttributes];
    updated[index] = { ...updated[index], [field]: val };
    setCustomAttributes(updated);
  };

  const handleSaveSpecs = () => {
    if (!onSaveValve) return;

    const parsedStandards = standardsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const parsedHighlights = highlightsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updatedValve: ValveProduct = {
      ...valve,
      testPressureShell,
      testPressureSeat,
      tempRange,
      leakageClass,
      standards: parsedStandards.length > 0 ? parsedStandards : valve.standards,
      highlightFeatures: parsedHighlights.length > 0 ? parsedHighlights : valve.highlightFeatures,
      specs: specs.length > 0 ? specs : valve.specs,
      characteristics: {
        lifecycle,
        lifecycleEn,
        tempLimits,
        tempLimitsEn,
        sealIntegrity,
        sealIntegrityEn,
        mediaApplications,
        mediaApplicationsEn,
        aiSummaryNotes,
        aiSummaryNotesEn,
        customAttributes,
      },
    };

    onSaveValve(updatedValve);
    setSaveSuccess(true);
    setIsEditing(false);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  const handleAddSpecRow = () => {
    const newRow: ValveDimensionSpec = {
      dn: `DN${(specs.length + 1) * 25}`,
      pn: valve.pressure || 'PN16',
      faceToFace: 150,
      height: 180,
      weightKg: 10,
      kvFlow: 200,
      cvFlow: 230,
      flangeHoles: 4,
    };
    setSpecs([...specs, newRow]);
  };

  const handleUpdateSpecRow = (index: number, field: keyof ValveDimensionSpec, val: any) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: val };
    setSpecs(updated);
  };

  const handleDeleteSpecRow = (index: number) => {
    setSpecs(specs.filter((_, idx) => idx !== index));
  };

  const handleCancelEdit = () => {
    setTestPressureShell(valve.testPressureShell || '');
    setTestPressureSeat(valve.testPressureSeat || '');
    setTempRange(valve.tempRange || '');
    setLeakageClass(valve.leakageClass || '');
    setStandardsText((valve.standards || []).join(', '));
    setHighlightsText((valve.highlightFeatures || []).join('\n'));
    setSpecs(valve.specs || []);

    const char = valve.characteristics || synthesizeValveCharacteristics(valve);
    setLifecycle(char.lifecycle || '');
    setLifecycleEn(char.lifecycleEn || '');
    setTempLimits(char.tempLimits || '');
    setTempLimitsEn(char.tempLimitsEn || '');
    setSealIntegrity(char.sealIntegrity || '');
    setSealIntegrityEn(char.sealIntegrityEn || '');
    setMediaApplications(char.mediaApplications || '');
    setMediaApplicationsEn(char.mediaApplicationsEn || '');
    setAiSummaryNotes(char.aiSummaryNotes || '');
    setAiSummaryNotesEn(char.aiSummaryNotesEn || '');
    setCustomAttributes(char.customAttributes || []);

    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/80 border border-amber-600/50 px-2.5 py-1 rounded">
              {valve.code}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {lang === 'vi' 
                  ? valve.name 
                  : (lang === 'zh' ? (valve.nameZh || translateTechString(valve.name, valve.nameEn, 'zh')) : (lang === 'th' ? (valve.nameTh || translateTechString(valve.name, valve.nameEn, 'th')) : (valve.nameEn || translateTechString(valve.name, undefined, 'en'))))}
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {lang === 'vi' ? valve.categoryLabel : valve.categoryLabelEn} • {valve.pressure}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Visual Installation Guide Button */}
            <button
              type="button"
              onClick={() => setIsInstallationGuideOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/30 border border-blue-400/30"
              title={lang === 'vi' ? 'Xem sơ đồ xiết bu lông chữ thập & hướng lắp đặt van bằng AI' : 'View bolt tightening sequence & installation guide'}
            >
              <Wrench className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'vi' ? '📐 Hướng Dẫn Lắp Đặt AI' : '📐 Visual Guide (AI)'}</span>
            </button>

            {/* UTDCORP IOM Documentation Button */}
            {(valve?.category === 'butterfly' || valve?.isHighPerformance) && onOpenKnowledge && (
              <button
                type="button"
                onClick={() => onOpenKnowledge('hp_butterfly')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 hover:from-emerald-600 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/30"
                title={lang === 'vi' ? 'Xem toàn bộ tài liệu IOM do UTDCORP cung cấp: Hướng dẫn sử dụng, lắp đặt, vận hành & môi chất' : 'View UTDCORP IOM Manual: Installation, Operation, Maintenance & Media'}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-200" />
                <span>{lang === 'vi' ? '📘 Tài Liệu UTDCORP IOM' : '📘 UTDCORP IOM Manual'}</span>
              </button>
            )}

            {/* Engineering Unit Converter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsConverterOpen(!isConverterOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isConverterOpen
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-1 ring-amber-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
              }`}
              title="Quy đổi nhanh hệ số lưu lượng Kv/Cv, áp suất bar/psi và nhiệt độ"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? '📐 Đổi Đơn Vị Kỹ Thuật' : '📐 Unit Converter'}</span>
            </button>

            {/* Admin Toggle Edit Button */}
            {(isAdminMode || userRole === 'admin') && onSaveValve && (
              <button
                type="button"
                onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isEditing 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                }`}
                title={lang === 'vi' ? 'Admin sửa nội dung thông số kỹ thuật bên trong và lưu vĩnh viễn' : 'Admin edit specifications and lock permanently'}
              >
                {isEditing ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Hủy Sửa' : 'Cancel'}</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? '✏️ Sửa Thông Số' : '✏️ Edit Specs'}</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label={lang === 'vi' ? 'Đóng cửa sổ' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Top Banner Alert Message for Save Status */}
          {saveSuccess && (
            <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'vi' 
                  ? '✓ Đã lưu thay đổi thông số kỹ thuật thành công và ghi nhớ vĩnh viễn vào hệ thống (không bị mất khi tải lại)!' 
                  : '✓ Technical specifications updated and permanently stored in database!'}
              </span>
            </div>
          )}

          {/* Top Banner Alert Message for Download Status */}
          {downloadSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Admin Edit Notice Bar when Editing */}
          {isEditing && (
            <div className="bg-amber-500/15 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {lang === 'vi' ? (
                    <><strong>Chế độ Admin:</strong> Bạn đang trực tiếp thay đổi thông số kỹ thuật bên trong. Bấm nút <strong>"Lưu Thay Đổi Thông Số"</strong> bên dưới để lưu vĩnh viễn không bị mất đi.</>
                  ) : (
                    <><strong>Admin Mode:</strong> You are directly modifying internal technical specifications. Click <strong>"Save Specs"</strong> below to permanently save changes.</>
                  )}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSaveSpecs}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 shrink-0 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Lưu Ngay' : 'Save Now'}</span>
              </button>
            </div>
          )}

          {/* Interactive 3D Model & Real Photo Viewport Section */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <Box className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                    <span>{lang === 'vi' ? 'Trực Quan Hóa Sản Phẩm (Mô Hình 3D CAD & Ảnh Thực Tế)' : 'Product Visualization (3D CAD & Photo)'}</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'vi' ? 'Xoay 360°, phóng to thu nhỏ và kiểm tra kết cấu cơ khí theo chuẩn kỹ thuật' : 'Rotate 360°, zoom, and inspect mechanical structure'}
                  </span>
                </div>
              </div>

              {/* View Switcher Tabs & Quick Action */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-mono font-bold">
                  <button
                    type="button"
                    onClick={() => setVisualMode('3d')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      visualMode === '3d'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? '🧊 Mô Hình 3D' : '🧊 3D Model'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisualMode('photo')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      visualMode === 'photo'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? '📷 Ảnh Chụp' : '📷 Photo'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInstallationGuideOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? '📐 Hướng Dẫn Lắp Đặt AI' : '📐 Visual Guide AI'}</span>
                </button>
              </div>
            </div>

            {/* Display Area */}
            {visualMode === '3d' ? (
              <Valve3DViewer
                category={valve.category}
                valveCode={valve.code}
                valveName={valve.name}
                material={valve.material}
                lang={lang}
              />
            ) : (
              <div className="relative w-full h-[340px] sm:h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
                <img
                  src={resolveProductImageUrl(valve.image)}
                  alt={valve.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                  }}
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-900/90 text-[11px] font-mono text-slate-300 border border-slate-700/80">
                  {valve.brand || 'UTD Industrial Valve'} • {valve.code}
                </div>
              </div>
            )}
          </div>

          {/* Quick Specifications Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-400" />
                {lang === 'vi' ? 'Tiêu chuẩn thử nghiệm áp' : 'Pressure Test Standard'}
              </div>
              {isEditing ? (
                <div className="mt-2 space-y-1.5">
                  <input
                    type="text"
                    value={testPressureShell}
                    onChange={(e) => setTestPressureShell(e.target.value)}
                    placeholder="Áp vỏ (VD: 1.5 x PN)"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                  <input
                    type="text"
                    value={testPressureSeat}
                    onChange={(e) => setTestPressureSeat(e.target.value)}
                    placeholder="Áp đệm (VD: 1.1 x PN)"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 font-mono"
                  />
                </div>
              ) : (
                <>
                  <div className="text-xs text-slate-200 font-mono mt-1 font-semibold">
                    {valve.testPressureShell}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {valve.testPressureSeat}
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-red-400" />
                {lang === 'vi' ? 'Nhiệt độ & Độ kín' : 'Temp & Leakage Rate'}
              </div>
              {isEditing ? (
                <div className="mt-2 space-y-1.5">
                  <input
                    type="text"
                    value={tempRange}
                    onChange={(e) => setTempRange(e.target.value)}
                    placeholder="Dải nhiệt (VD: -20°C đến +150°C)"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                  <input
                    type="text"
                    value={leakageClass}
                    onChange={(e) => setLeakageClass(e.target.value)}
                    placeholder="Cấp kín (VD: ISO 5208 Rate A)"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[11px] text-emerald-300"
                  />
                </div>
              ) : (
                <>
                  <div className="text-xs text-slate-200 font-mono mt-1 font-semibold">
                    {valve.tempRange}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {valve.leakageClass}
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'vi' ? 'Chứng nhận & Xuất xứ' : 'Standards & Origin'}
              </div>
              {isEditing ? (
                <div className="mt-2">
                  <textarea
                    rows={2}
                    value={standardsText}
                    onChange={(e) => setStandardsText(e.target.value)}
                    placeholder="Các chuẩn cách nhau bằng dấu phẩy (VD: ASME B16.34, ISO 5208, CE)"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
              ) : (
                <>
                  <div className="text-xs text-slate-200 mt-1 font-semibold">
                    {valve.standards.join(' • ')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    CO, CQ & Mill Test 3.1
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AI-Synthesized Valve Characteristics Box (Đặc Tính của Van) */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 rounded-2xl border-2 border-amber-500/50 p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-500/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold uppercase tracking-wide text-white flex items-center gap-2">
                    <span>{lang === 'vi' ? '⚡ Đặc Tính Kỹ Thuật & Vận Hành' : '⚡ Valve Operational & Technical Characteristics'}</span>
                  </h4>
                  <p className="text-[11px] text-amber-300/80">
                    {lang === 'vi' 
                      ? 'Thông số kỹ thuật chuẩn hóa, kiểm định áp lực thủy tĩnh và tiêu chuẩn vật liệu quốc tế' 
                      : 'Standardized engineering parameters, hydrostatic pressure tests and global material certifications'}
                  </p>
                </div>
              </div>

              {/* Admin Actions for Characteristics */}
              {isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReSynthesizeCharacteristics}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1 shadow transition-all"
                    title={lang === 'vi' ? 'Hệ thống phân tích lại đặc tính dựa trên vật liệu và tiêu chuẩn' : 'Re-synthesize characteristics'}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? '⚡ Phân Tích Lại' : '⚡ Re-Synthesize'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomAttribute}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? '+ Thêm Đặc Tính' : '+ Add Attribute'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4 Core Characteristics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
              {/* 1. Lifecycle */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {lang === 'vi' ? 'Tuổi Thọ Vận Hành & Chu Trình:' : 'Operational Lifecycle & Cycles:'}
                  </span>
                </div>
                {isEditing ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={lifecycle}
                      onChange={(e) => setLifecycle(e.target.value)}
                      placeholder="Tuổi thọ tiếng Việt"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-medium"
                    />
                    <input
                      type="text"
                      value={lifecycleEn}
                      onChange={(e) => setLifecycleEn(e.target.value)}
                      placeholder="Lifecycle English"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-[11px] text-slate-300"
                    />
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                    {lang === 'vi' ? lifecycle : translateTechString(lifecycle, lifecycleEn, 'en')}
                  </div>
                )}
              </div>

              {/* 2. Temperature Limits */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-red-400 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-red-400" />
                    {lang === 'vi' ? 'Giới Hạn Nhiệt Độ Hoạt Động:' : 'Operating Temperature Range:'}
                  </span>
                </div>
                {isEditing ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={tempLimits}
                      onChange={(e) => setTempLimits(e.target.value)}
                      placeholder="Giới hạn nhiệt độ tiếng Việt"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-medium"
                    />
                    <input
                      type="text"
                      value={tempLimitsEn}
                      onChange={(e) => setTempLimitsEn(e.target.value)}
                      placeholder="Temp range English"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-[11px] text-slate-300"
                    />
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm font-extrabold text-amber-200 leading-snug">
                    {lang === 'vi' ? tempLimits : translateTechString(tempLimits, tempLimitsEn, 'en')}
                  </div>
                )}
              </div>

              {/* 3. Sealing Integrity */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {lang === 'vi' ? 'Cấp Độ Kín & Khả Năng Rò Rỉ:' : 'Sealing Integrity & Leak Rate:'}
                  </span>
                </div>
                {isEditing ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={sealIntegrity}
                      onChange={(e) => setSealIntegrity(e.target.value)}
                      placeholder="Độ kín tiếng Việt"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-medium"
                    />
                    <input
                      type="text"
                      value={sealIntegrityEn}
                      onChange={(e) => setSealIntegrityEn(e.target.value)}
                      placeholder="Sealing English"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-[11px] text-slate-300"
                    />
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-300 leading-snug">
                    {lang === 'vi' ? sealIntegrity : translateTechString(sealIntegrity, sealIntegrityEn, 'en')}
                  </div>
                )}
              </div>

              {/* 4. Media Applications */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-blue-400" />
                    {lang === 'vi' ? 'Ứng Dụng Cho Môi Chất:' : 'Applicable Media & Fluids:'}
                  </span>
                </div>
                {isEditing ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={mediaApplications}
                      onChange={(e) => setMediaApplications(e.target.value)}
                      placeholder="Môi chất tiếng Việt"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-medium"
                    />
                    <input
                      type="text"
                      value={mediaApplicationsEn}
                      onChange={(e) => setMediaApplicationsEn(e.target.value)}
                      placeholder="Media English"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-[11px] text-slate-300"
                    />
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm font-extrabold text-slate-200 leading-snug">
                    {lang === 'vi' ? mediaApplications : translateTechString(mediaApplications, mediaApplicationsEn, 'en')}
                  </div>
                )}
              </div>
            </div>

            {/* Valmet High Performance Butterfly Valve Benchmark & IOM Manual Card */}
            {(valve?.category === 'butterfly' || valve?.isHighPerformance) && (
              <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-blue-950/70 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 mb-4">
                <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-extrabold text-white">
                          {lang === 'vi' ? 'Tài Liệu Kỹ Thuật Độc Quyền do UTDCORP Cung Cấp' : 'UTDCORP Proprietary Technical Documentation'}
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                          UTDCORP Heavy-Duty Standards (utdcorp.com)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {lang === 'vi'
                          ? 'Tích hợp đầy đủ cẩm nang Hướng dẫn sử dụng, Lắp đặt, Vận hành và Môi chất độc quyền từ UTDCORP (utdcorp.com)'
                          : 'Full Installation, Operation, Maintenance & Media guidelines provided by UTDCORP Engineering'}
                      </p>
                    </div>
                  </div>

                  {onOpenKnowledge && (
                    <button
                      type="button"
                      onClick={() => onOpenKnowledge('hp_butterfly')}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all shrink-0"
                    >
                      <span>{lang === 'vi' ? 'Xem Toàn Bộ Cẩm Nang IOM' : 'Open Full IOM Manual'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 3 Quick Highlight Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-emerald-400 font-bold block">💧 Môi chất ứng dụng:</span>
                    <span className="text-slate-300">Pulp & Paper (bột giấy 4-5%), Hơi quá nhiệt 450°C, Hóa dầu, LNG -196°C, Chiller</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-blue-400 font-bold block">🛠️ Quy tắc lắp đặt IOM:</span>
                    <span className="text-slate-300">Trục nằm ngang xả cặn đáy, cấm nâng bằng actuator, siết bu lông sao chéo 5 bước</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold block">⚙️ Vận hành & Cữ chặn:</span>
                    <span className="text-slate-300">Thổi rửa ống mở 100% (90°), cữ chặn đệm nêm không quá lực, chuẩn ISO 5208 Rate A</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Technical Analysis Insight Note */}
            {(aiSummaryNotes || isEditing) && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-3 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'vi' ? 'Nhận Định Kỹ Thuật Chuyên Gia:' : 'Engineering Analysis Insight:'}</span>
                </div>
                {isEditing ? (
                  <div className="space-y-1.5 mt-2">
                    <textarea
                      rows={2}
                      value={aiSummaryNotes}
                      onChange={(e) => setAiSummaryNotes(e.target.value)}
                      placeholder="Nhận định kỹ thuật tiếng Việt"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
                    />
                    <textarea
                      rows={2}
                      value={aiSummaryNotesEn}
                      onChange={(e) => setAiSummaryNotesEn(e.target.value)}
                      placeholder="Engineering Analysis English"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
                    />
                  </div>
                ) : (
                  <p className="text-slate-300 leading-relaxed italic">
                    "{lang === 'vi' ? aiSummaryNotes : (aiSummaryNotesEn || aiSummaryNotes)}"
                  </p>
                )}
              </div>
            )}

            {/* Custom Attributes (Admin Add / Delete) */}
            {customAttributes && customAttributes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {lang === 'vi' ? 'Đặc Tính Bổ Sung Do Admin Kiểm Tra:' : 'Additional Verified Characteristics:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {customAttributes.map((attr, idx) => (
                    <div key={attr.id || idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2 text-xs">
                      {isEditing ? (
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={attr.key}
                            onChange={(e) => handleUpdateCustomAttribute(idx, 'key', e.target.value)}
                            placeholder="Tên đặc tính"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-amber-300"
                          />
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => handleUpdateCustomAttribute(idx, 'value', e.target.value)}
                            placeholder="Giá trị"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200"
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-400 font-medium block text-[10px] uppercase">
                            {lang === 'vi' ? attr.key : translateTechString(attr.key, attr.keyEn, 'en')}:
                          </span>
                          <span className="text-white font-bold">
                            {lang === 'vi' ? attr.value : translateTechString(attr.value, attr.valueEn, 'en')}
                          </span>
                        </div>
                      )}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomAttribute(idx)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Xóa đặc tính này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Design Features Bullet Points */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              {lang === 'vi' ? 'Đặc tính thiết kế cơ khí' : 'Mechanical Design Highlights'}
            </h4>
            {isEditing ? (
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  Nhập mỗi đặc tính trên một dòng mới:
                </label>
                <textarea
                  rows={4}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 leading-relaxed"
                />
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {(valve.highlightFeatures || []).map((feat, i) => {
                  let text = feat;
                  if (lang === 'en') {
                    text = valve.highlightFeaturesEn?.[i] || translateTechString(feat, undefined, 'en');
                  } else if (lang === 'zh') {
                    text = valve.highlightFeaturesZh?.[i] || translateTechString(feat, valve.highlightFeaturesEn?.[i], 'zh');
                  } else if (lang !== 'vi') {
                    text = translateTechString(feat, valve.highlightFeaturesEn?.[i], lang);
                  }
                  return (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold mt-0.5">•</span>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Unit Converter Utility Panel for Field Engineers */}
          {isConverterOpen && (
            <UnitConverterWidget
              currentSpecs={specs}
              currentPressure={valve.pressure}
              currentTempRange={tempRange}
              lang={lang}
              onClose={() => setIsConverterOpen(false)}
            />
          )}

          {/* Main Dimensional Specs Table with Zebra Striping */}
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                {lang === 'vi' ? 'Bảng tra kích thước đường ống & lưu lượng' : 'Dimensional Specs & Flow Coefficients'}
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowFlowChart(!showFlowChart)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold font-mono flex items-center gap-1 shadow-sm transition-colors ${
                    showFlowChart
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{showFlowChart ? (lang === 'vi' ? 'Ẩn Biểu Đồ D3 (Kv)' : 'Hide D3 Chart') : (lang === 'vi' ? '📈 Biểu đồ D3.js: Áp suất vs Lưu lượng (Kv Sizing)' : '📈 D3.js Flow vs ΔP Sizing')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsConverterOpen(!isConverterOpen)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-[11px] font-bold font-mono flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isConverterOpen ? (lang === 'vi' ? 'Đóng bộ đổi đơn vị' : 'Hide Converter') : (lang === 'vi' ? '📐 Quy Đổi Kv/Cv & Áp Lực' : '📐 Convert Kv/Cv & Pressure')}</span>
                </button>
                <span className="text-[11px] text-slate-400 font-mono">
                  Unit: mm / kg / m³/h
                </span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{lang === 'vi' ? 'Thêm Dòng DN' : 'Add DN Row'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* D3-based Flow Rate (Kv) Chart Visualization */}
            {showFlowChart && (
              <div className="mb-4">
                <ValveFlowChart
                  specs={specs}
                  valveName={valve.name}
                  valveCode={valve.code}
                  lang={lang}
                />
              </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 uppercase tracking-wider font-mono text-[11px] border-b border-slate-700">
                    <th className="py-2.5 px-3 font-bold">{lang === 'vi' ? 'Kích thước DN' : 'Nominal DN'}</th>
                    <th className="py-2.5 px-3 font-bold">{lang === 'vi' ? 'Áp lực PN' : 'Pressure'}</th>
                    <th className="py-2.5 px-3 font-bold text-center">Face to Face (L)</th>
                    <th className="py-2.5 px-3 font-bold text-center">{lang === 'vi' ? 'Chiều cao (H)' : 'Height (H)'}</th>
                    <th className="py-2.5 px-3 font-bold text-center">{lang === 'vi' ? 'Trọng lượng (Kg)' : 'Weight (kg)'}</th>
                    <th className="py-2.5 px-3 font-bold text-center text-emerald-400">Kvs (m³/h)</th>
                    <th className="py-2.5 px-3 font-bold text-center text-blue-400">Cv (GPM)</th>
                    <th className="py-2.5 px-3 font-bold text-center">{lang === 'vi' ? 'Số lỗ bích' : 'Bolt Holes'}</th>
                    {isEditing && <th className="py-2.5 px-2 text-center">{lang === 'vi' ? 'Xóa' : 'Delete'}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {specs.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors hover:bg-blue-950/40 ${
                        idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/60'
                      }`}
                    >
                      <td className="py-2 px-2.5 font-extrabold text-amber-400 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.dn}
                            onChange={(e) => handleUpdateSpecRow(idx, 'dn', e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 w-24 text-amber-400 font-bold"
                          />
                        ) : (
                          row.dn
                        )}
                      </td>
                      <td className="py-2 px-2.5 text-slate-300 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="text"
                            value={row.pn}
                            onChange={(e) => handleUpdateSpecRow(idx, 'pn', e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 w-20 text-slate-200"
                          />
                        ) : (
                          row.pn
                        )}
                      </td>
                      <td className="py-2 px-2.5 text-center text-slate-200">
                        {isEditing ? (
                          <input
                            type="number"
                            value={row.faceToFace}
                            onChange={(e) => handleUpdateSpecRow(idx, 'faceToFace', Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 w-16 text-center text-slate-200"
                          />
                        ) : (
                          `${row.faceToFace} mm`
                        )}
                      </td>
                      <td className="py-2 px-2.5 text-center text-slate-200">
                        {isEditing ? (
                          <input
                            type="number"
                            value={row.height}
                            onChange={(e) => handleUpdateSpecRow(idx, 'height', Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 w-16 text-center text-slate-200"
                          />
                        ) : (
                          `${row.height} mm`
                        )}
                      </td>
                      <td className="py-2 px-2.5 text-center text-slate-300 font-semibold">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.5"
                            value={row.weightKg}
                            onChange={(e) => handleUpdateSpecRow(idx, 'weightKg', Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 w-16 text-center text-slate-300"
                          />
                        ) : (
                          `${row.weightKg} kg`
                        )}
                      </td>
                      <td className="py-2 px-2.5 text-center text-emerald-400 font-bold">
                        {isEditing ? (
                          <input
                            type="number"
                            value={row.kvFlow}
                            onChange={(e) => handleUpdateSpecRow(idx, 'kvFlow', Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 w-16 text-center text-emerald-400 font-bold"
                          />
                        ) : (
                          row.kvFlow
                        )}
                      </td>
                      <td className="py-2 px-2.5 text-center text-blue-400 font-bold">
                        {isEditing ? (
                          <input
                            type="number"
                            value={row.cvFlow || Math.round(row.kvFlow * 1.156)}
                            onChange={(e) => handleUpdateSpecRow(idx, 'cvFlow', Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 w-16 text-center text-blue-400 font-bold"
                          />
                        ) : (
                          row.cvFlow || Math.round(row.kvFlow * 1.156)
                        )}
                      </td>
                      <td className="py-2 px-2.5 text-center text-slate-400">
                        {isEditing ? (
                          <input
                            type="number"
                            value={row.flangeHoles}
                            onChange={(e) => handleUpdateSpecRow(idx, 'flangeHoles', Number(e.target.value))}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 w-14 text-center text-slate-400"
                          />
                        ) : (
                          row.flangeHoles
                        )}
                      </td>
                      {isEditing && (
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteSpecRow(idx)}
                            className="p-1 rounded bg-red-950 text-red-400 hover:text-red-300 hover:bg-red-900 transition-colors"
                            title={lang === 'vi' ? 'Xóa dòng kích thước này' : 'Delete this size row'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 italic">
              {lang === 'vi' 
                ? '* Ghi chú: Kích thước dung sai ±1.5mm theo chuẩn ASME B16.10 / DIN EN 558. Có thể gia công theo bản vẽ riêng của dự án.' 
                : '* Note: Dimensional tolerance ±1.5mm per ASME B16.10 / DIN EN 558. Custom project drawings available upon request.'}
            </p>
          </div>

          {/* Applicable Fluids Tags */}
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block mb-2">
              {lang === 'vi' ? 'Môi chất khuyến nghị sử dụng:' : 'Recommended Service Fluids:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {(valve.applicableMedia || []).map((media, i) => {
                let text = media;
                if (lang === 'en') {
                  text = valve.applicableMediaEn?.[i] || translateTechString(media, undefined, 'en');
                } else if (lang === 'zh') {
                  text = valve.applicableMediaZh?.[i] || translateTechString(media, valve.applicableMediaEn?.[i], 'zh');
                } else if (lang !== 'vi') {
                  text = translateTechString(media, valve.applicableMediaEn?.[i], lang);
                }
                return (
                  <span
                    key={i}
                    className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 font-medium"
                  >
                    ✓ {text}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Engineering CAD Files Download for Engineers & Contractors */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">
              {lang === 'vi' ? 'Tài liệu kỹ thuật:' : 'Downloads:'}
            </span>
            <button
              type="button"
              onClick={() => handleCadDownload('PDF')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Data Sheet PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleCadDownload('STEP')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'vi' ? 'Bản vẽ 3D STEP' : '3D STEP CAD'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleCadDownload('DWG')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-700 transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{lang === 'vi' ? 'Bản vẽ 2D DWG' : '2D DWG CAD'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={handleSaveSpecs}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Lưu Thay Đổi Thông Số (Khóa Vĩnh Viễn)' : 'Save Specs (Lock Permanently)'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onToggleRfq(valve)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-extrabold transition-all active:scale-95 ${
                isInRfq
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isInRfq ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'Đã có trong RFQ' : 'In RFQ List'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'Thêm vào yêu cầu báo giá' : 'Add to RFQ'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Visual Installation Guide & Bolt-Tightening Protocol Modal */}
      {isInstallationGuideOpen && (
        <ValveInstallationGuideModal
          isOpen={isInstallationGuideOpen}
          onClose={() => setIsInstallationGuideOpen(false)}
          valve={valve}
          lang={lang}
        />
      )}
    </div>
  );
};

