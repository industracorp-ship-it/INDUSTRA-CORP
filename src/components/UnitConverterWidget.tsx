import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  Gauge, 
  Thermometer, 
  Droplet, 
  Check, 
  Sparkles, 
  Copy, 
  X,
  ChevronDown,
  Layers
} from 'lucide-react';
import { 
  convertFlow, 
  convertPressure, 
  convertTemperature, 
  DN_INCH_MAP,
  FlowConversionResult,
  PressureConversionResult,
  TemperatureConversionResult
} from '../utils/engineeringUnitConverter';
import { ValveDimensionSpec, SupportedLanguage } from '../types/valve';

interface UnitConverterWidgetProps {
  currentSpecs?: ValveDimensionSpec[];
  currentPressure?: string;
  currentTempRange?: string;
  lang: SupportedLanguage;
  onClose?: () => void;
}

export const UnitConverterWidget: React.FC<UnitConverterWidgetProps> = ({
  currentSpecs = [],
  currentPressure = 'PN16',
  currentTempRange = '-20°C đến +150°C',
  lang,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'pressure' | 'temp' | 'dn'>('flow');

  // 1. Flow State
  const [flowInput, setFlowInput] = useState<number>(() => {
    return currentSpecs[0]?.kvFlow || 200;
  });
  const [flowUnit, setFlowUnit] = useState<'kv' | 'cv'>('kv');
  const [deltaP, setDeltaP] = useState<number>(1);
  const flowResult: FlowConversionResult = convertFlow(flowInput, flowUnit, deltaP);

  // 2. Pressure State
  const [pressureInput, setPressureInput] = useState<number>(() => {
    const num = currentPressure.match(/\d+/);
    return num ? parseInt(num[0], 10) : 16;
  });
  const [pressureUnit, setPressureUnit] = useState<'bar' | 'psi' | 'kpa' | 'mpa'>('bar');
  const pressureResult: PressureConversionResult = convertPressure(pressureInput, pressureUnit);

  // 3. Temp State
  const [tempInput, setTempInput] = useState<number>(() => {
    const match = currentTempRange.match(/(\d{2,3})\s*(?:°C|C)?/i);
    return match ? parseInt(match[1], 10) : 180;
  });
  const [tempUnit, setTempUnit] = useState<'c' | 'f' | 'k'>('c');
  const tempResult: TemperatureConversionResult = convertTemperature(tempInput, tempUnit);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (val: string | number, key: string) => {
    navigator.clipboard?.writeText(String(val));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-slate-950 border border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-white font-mono uppercase tracking-wide">
                {lang === 'vi' ? 'Bộ Đổi Đơn Vị Kỹ Thuật (Unit Converter)' : 'Field Engineering Unit Converter'}
              </h3>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 font-bold">
                ISO / ASME
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'vi' 
                ? 'Quy đổi tức thì hệ số lưu lượng Kv/Cv, cấp áp suất bar/psi/kPa và dải nhiệt độ vận hành'
                : 'Instant engineering conversion for Kv/Cv, bar/psi/kPa pressure & operating temperatures'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveTab('flow')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'flow'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Droplet className="w-3.5 h-3.5 text-blue-300" />
          <span>{lang === 'vi' ? '1. Lưu Lượng (Kv / Cv)' : '1. Flow (Kv / Cv)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pressure')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'pressure'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? '2. Áp Suất (bar / psi / kPa)' : '2. Pressure (bar / psi / kPa)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('temp')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'temp'
              ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Thermometer className="w-3.5 h-3.5 text-red-300" />
          <span>{lang === 'vi' ? '3. Nhiệt Độ (°C / °F / K)' : '3. Temperature (°C / °F)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dn')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'dn'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-300" />
          <span>{lang === 'vi' ? '4. Size Ống (DN ↔ Inch)' : '4. Pipe Sizing (DN ↔ Inch)'}</span>
        </button>
      </div>

      {/* 1. FLOW CONVERTER TAB */}
      {activeTab === 'flow' && (
        <div className="space-y-3.5">
          {/* Quick presets from valve specs */}
          {currentSpecs.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] bg-slate-900/90 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 font-mono">
                {lang === 'vi' ? 'Nạp nhanh từ size van:' : 'Fill from specs:'}
              </span>
              {currentSpecs.slice(0, 6).map((spec, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFlowInput(spec.kvFlow);
                    setFlowUnit('kv');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-950 text-blue-300 hover:text-white hover:bg-blue-900/60 border border-slate-700/80 font-mono text-[10px]"
                >
                  {spec.dn}: {spec.kvFlow} m³/h
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Input */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase block">
                {lang === 'vi' ? 'Nhập giá trị lưu lượng:' : 'Input Flow Value:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={flowInput}
                  onChange={(e) => setFlowInput(Number(e.target.value))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
                <select
                  value={flowUnit}
                  onChange={(e) => setFlowUnit(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-amber-300 font-mono font-bold"
                >
                  <option value="kv">Kv (m³/h)</option>
                  <option value="cv">Cv (US GPM)</option>
                </select>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Chênh áp ΔP:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={deltaP}
                    onChange={(e) => setDeltaP(Number(e.target.value))}
                    className="w-14 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs text-slate-200"
                  />
                  <span>bar</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-blue-500/30 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Kv (Hệ mét DIN/ISO):</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-sm font-mono font-extrabold text-emerald-400">
                      {flowResult.kv} m³/h
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleCopy(flowResult.kv, 'kv')}
                      className="text-slate-400 hover:text-white text-xs"
                      title="Copy"
                    >
                      {copiedKey === 'kv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Cv (Hệ Mỹ ANSI/ISA):</span>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-sm font-mono font-extrabold text-blue-400">
                      {flowResult.cv} GPM
                    </strong>
                    <button
                      type="button"
                      onClick={() => handleCopy(flowResult.cv, 'cv')}
                      className="text-slate-400 hover:text-white text-xs"
                      title="Copy"
                    >
                      {copiedKey === 'cv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-1 text-[11px] text-slate-300 font-mono">
                  <span>Lưu lượng Q tại ΔP={deltaP} bar:</span>
                  <span className="text-white font-bold">{flowResult.qM3PerHour} m³/h</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 italic font-mono">
                💡 Công thức chuẩn: Cv = Kv × 1.156 • 1 Kv = 1 m³/h nước ở 20°C qua van khi áp sụt 1 bar.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRESSURE CONVERTER TAB */}
      {activeTab === 'pressure' && (
        <div className="space-y-3.5">
          {/* Quick presets for common pressures */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] bg-slate-900/90 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-mono">
              {lang === 'vi' ? 'Cấp áp chuẩn UTD:' : 'Standard Ratings:'}
            </span>
            {[
              { label: 'PN10 (10 bar)', val: 10, unit: 'bar' },
              { label: 'PN16 (232 psi)', val: 16, unit: 'bar' },
              { label: 'PN25 (362 psi)', val: 25, unit: 'bar' },
              { label: 'PN40 (40 bar)', val: 40, unit: 'bar' },
              { label: '300 PSI (PCCC)', val: 300, unit: 'psi' },
              { label: 'Class 150', val: 20, unit: 'bar' },
              { label: 'Class 300', val: 50, unit: 'bar' }
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPressureInput(p.val);
                  setPressureUnit(p.unit as any);
                }}
                className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 hover:text-white hover:bg-amber-900/60 border border-slate-700/80 font-mono text-[10px]"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Input */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase block">
                {lang === 'vi' ? 'Nhập giá trị áp suất:' : 'Input Pressure Value:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={pressureInput}
                  onChange={(e) => setPressureInput(Number(e.target.value))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
                <select
                  value={pressureUnit}
                  onChange={(e) => setPressureUnit(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-amber-300 font-mono font-bold"
                >
                  <option value="bar">bar</option>
                  <option value="psi">psi (lbf/in²)</option>
                  <option value="kpa">kPa</option>
                  <option value="mpa">MPa</option>
                </select>
              </div>

              <div className="pt-2 text-xs font-mono">
                <span className="text-slate-400 text-[10px] block mb-0.5">Phân hạng kỹ thuật:</span>
                <span className="px-2 py-1 rounded bg-amber-950/60 border border-amber-600/40 text-amber-300 font-bold block">
                  {pressureResult.standardRating}
                </span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/30 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">bar:</span>
                  <span className="text-amber-300 font-extrabold text-sm">{pressureResult.bar} bar</span>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">psi (Pound/sq.in):</span>
                  <span className="text-white font-extrabold text-sm">{pressureResult.psi} psi</span>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">kPa:</span>
                  <span className="text-slate-200 font-bold">{pressureResult.kpa} kPa</span>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">MPa:</span>
                  <span className="text-slate-200 font-bold">{pressureResult.mpa} MPa</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-1.5">
                <span>kgf/cm² (Hệ cũ):</span>
                <span className="text-white font-semibold">{pressureResult.kgfCm2} kgf/cm²</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TEMPERATURE CONVERTER TAB */}
      {activeTab === 'temp' && (
        <div className="space-y-3.5">
          {/* Presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] bg-slate-900/90 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-mono">
              {lang === 'vi' ? 'Điểm nhiệt thông dụng:' : 'Quick Presets:'}
            </span>
            {[
              { label: '-20°C (Chiller / Glycol)', val: -20 },
              { label: '0°C (Đóng băng)', val: 0 },
              { label: '100°C (Hơi bão hòa 1 bar)', val: 100 },
              { label: '180°C (Hơi PN10)', val: 180 },
              { label: '300°C (Hơi quá nhiệt WCB)', val: 300 },
              { label: '425°C (WCB Max)', val: 425 }
            ].map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTempInput(t.val);
                  setTempUnit('c');
                }}
                className="px-2 py-0.5 rounded bg-slate-950 text-red-300 hover:text-white hover:bg-red-900/60 border border-slate-700/80 font-mono text-[10px]"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Input */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase block">
                {lang === 'vi' ? 'Nhập nhiệt độ vận hành:' : 'Input Temperature:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempInput}
                  onChange={(e) => setTempInput(Number(e.target.value))}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-sm focus:border-red-400 focus:outline-none"
                />
                <select
                  value={tempUnit}
                  onChange={(e) => setTempUnit(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-red-300 font-mono font-bold"
                >
                  <option value="c">°Celsius (°C)</option>
                  <option value="f">°Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </select>
              </div>

              <div className="pt-2 text-xs font-mono">
                <span className="text-slate-400 text-[10px] block mb-0.5">Khuyến nghị vật liệu làm kín (Trim):</span>
                <span className="p-2 rounded bg-red-950/50 border border-red-700/40 text-red-200 text-[11px] block leading-snug">
                  {tempResult.recommendedTrim}
                </span>
              </div>
            </div>

            {/* Results Grid */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-red-500/30 space-y-2 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">°Celsius:</span>
                  <span className="text-red-300 font-extrabold text-base">{tempResult.celsius}°C</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">°Fahrenheit:</span>
                  <span className="text-amber-300 font-extrabold text-base">{tempResult.fahrenheit}°F</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Kelvin:</span>
                  <span className="text-slate-200 font-extrabold text-base">{tempResult.kelvin} K</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 italic font-mono border-t border-slate-800 pt-2">
                Công thức: °F = °C × 1.8 + 32 • K = °C + 273.15
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PIPE SIZING (DN <-> INCH) TAB */}
      {activeTab === 'dn' && (
        <div className="space-y-2">
          <div className="text-[11px] text-slate-400 font-mono mb-1">
            Bảng tra kích thước danh nghĩa đường ống tiêu chuẩn (Nominal Diameter DIN/ISO vs ASME B36.10):
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {DN_INCH_MAP.map((item, i) => (
              <div 
                key={i}
                className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center hover:border-emerald-500/50 transition-colors"
              >
                <div className="text-amber-300 font-extrabold font-mono text-xs">{item.dn}</div>
                <div className="text-slate-300 font-bold text-xs">{item.inch}</div>
                <div className="text-[10px] text-slate-500 font-mono">{item.mm} mm</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
