import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Download, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  Wrench,
  Copy,
  Layers,
  Info,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { ValveProduct, ValveDimensionSpec, SupportedLanguage } from '../types/valve';

interface ValveInstallationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  valve: ValveProduct;
  lang: SupportedLanguage;
}

export const ValveInstallationGuideModal: React.FC<ValveInstallationGuideModalProps> = ({
  isOpen,
  onClose,
  valve,
  lang,
}) => {
  const specs = valve.specs || [];
  const defaultDn = specs[0]?.dn || 'DN100 (4")';
  const [selectedDn, setSelectedDn] = useState<string>(defaultDn);
  const [connectionType, setConnectionType] = useState<string>('flanged_rf');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState<boolean>(false);
  const [generatedPosterUrl, setGeneratedPosterUrl] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync selectedDn if specs change
  useEffect(() => {
    if (specs.length > 0 && !specs.some((s) => s.dn === selectedDn)) {
      setSelectedDn(specs[0].dn);
    }
  }, [specs, selectedDn]);

  const currentSpec = useMemo(() => {
    return specs.find((s) => s.dn === selectedDn) || specs[0] || {
      dn: 'DN100 (4")',
      pn: valve.pressure || 'PN16',
      flangeHoles: 8,
      kvFlow: 920,
      weightKg: 18,
      faceToFace: 190,
      height: 450,
    };
  }, [specs, selectedDn, valve]);

  // Determine bolt count (4, 8, 12, 16, 20)
  const boltCount = useMemo(() => {
    if (currentSpec.flangeHoles && currentSpec.flangeHoles > 0) {
      return currentSpec.flangeHoles;
    }
    const dnNum = parseInt(selectedDn.replace(/\D/g, ''), 10) || 50;
    if (dnNum <= 50) return 4;
    if (dnNum <= 150) return 8;
    if (dnNum <= 300) return 12;
    if (dnNum <= 450) return 16;
    return 20;
  }, [currentSpec, selectedDn]);

  // Standard criss-cross sequence calculation for flanges
  const boltSequence = useMemo(() => {
    if (boltCount === 4) return [1, 3, 2, 4];
    if (boltCount === 8) return [1, 5, 3, 7, 2, 6, 4, 8];
    if (boltCount === 12) return [1, 7, 4, 10, 2, 8, 5, 11, 3, 9, 6, 12];
    if (boltCount === 16) return [1, 9, 5, 13, 3, 11, 7, 15, 2, 10, 6, 14, 4, 12, 8, 16];
    // 20 bolts
    return [1, 11, 6, 16, 3, 13, 8, 18, 2, 12, 7, 17, 4, 14, 9, 19, 5, 15, 10, 20];
  }, [boltCount]);

  // Torque values based on standard bolt size M16, M20, M24 etc.
  const torqueSpecs = useMemo(() => {
    const dnNum = parseInt(selectedDn.replace(/\D/g, ''), 10) || 50;
    let boltSize = 'M16';
    let finalTorqueNm = 85;

    if (dnNum <= 40) {
      boltSize = 'M12';
      finalTorqueNm = 45;
    } else if (dnNum <= 80) {
      boltSize = 'M16';
      finalTorqueNm = 95;
    } else if (dnNum <= 150) {
      boltSize = 'M20';
      finalTorqueNm = 175;
    } else if (dnNum <= 250) {
      boltSize = 'M24';
      finalTorqueNm = 285;
    } else {
      boltSize = 'M27 / M30';
      finalTorqueNm = 420;
    }

    return {
      boltSize,
      pass1: Math.round(finalTorqueNm * 0.3),
      pass2: Math.round(finalTorqueNm * 0.6),
      pass3: finalTorqueNm,
      finalRotational: finalTorqueNm,
    };
  }, [selectedDn]);

  if (!isOpen) return null;

  /**
   * Generates a high-resolution visual installation guide poster image using HTML5 Canvas
   */
  const handleGenerateAiPoster = () => {
    setIsGeneratingAiImage(true);

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsGeneratingAiImage(false);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingAiImage(false);
        return;
      }

      const width = 1200;
      const height = 800;
      canvas.width = width;
      canvas.height = height;

      // 1. Blueprint Deep Industrial Dark Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(0.5, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Engineering Grid Lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Technical Border & Title Header
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Header Bar
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(32, 32, width - 64, 85);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.strokeRect(32, 32, width - 64, 85);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px "JetBrains Mono", monospace';
      ctx.fillText('★ INDUSTRA CORP • TECHNICAL SPECIFICATION & INSTALLATION PROTOCOL', 55, 60);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px "Inter", sans-serif';
      ctx.fillText(`VISUAL INSTALLATION GUIDE & BOLT-TIGHTENING SEQUENCE: ${valve.code}`, 55, 95);

      // Metadata Pill Badges (Right side of header)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fillRect(width - 360, 50, 330, 50);
      ctx.strokeStyle = '#3b82f6';
      ctx.strokeRect(width - 360, 50, 330, 50);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`SIZE: ${selectedDn} • ${currentSpec.pn || 'PN16'}`, width - 345, 72);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`HOLES: ${boltCount} BOLTS (${torqueSpecs.boltSize}) • ${connectionType.toUpperCase()}`, width - 345, 90);

      // 4. LEFT SECTION: Circular Flange Bolt Tightening Sequence Diagram
      const flangeCenterX = 310;
      const flangeCenterY = 320;
      const flangeRadius = 145;
      const boltCircleRadius = 110;
      const boreRadius = 60;

      // Outer Flange Face
      ctx.beginPath();
      ctx.arc(flangeCenterX, flangeCenterY, flangeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Raised Face Ring
      ctx.beginPath();
      ctx.arc(flangeCenterX, flangeCenterY, boltCircleRadius + 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner Pipe Flow Bore
      ctx.beginPath();
      ctx.arc(flangeCenterX, flangeCenterY, boreRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#090d16';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FLOW BORE', flangeCenterX, flangeCenterY - 6);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${selectedDn}`, flangeCenterX, flangeCenterY + 12);
      ctx.textAlign = 'left';

      // Criss-Cross Bolt Sequence Lines
      const boltPositions: { x: number; y: number; num: number; seq: number }[] = [];
      for (let i = 0; i < boltCount; i++) {
        // Start from top (0 is -Math.PI / 2)
        const angle = -Math.PI / 2 + (i / boltCount) * Math.PI * 2;
        const bx = flangeCenterX + Math.cos(angle) * boltCircleRadius;
        const by = flangeCenterY + Math.sin(angle) * boltCircleRadius;
        const boltNum = i + 1;
        const seqIndex = boltSequence.indexOf(boltNum) + 1;
        boltPositions.push({ x: bx, y: by, num: boltNum, seq: seqIndex });
      }

      // Draw sequence star path connecting bolts in order
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      for (let s = 1; s <= boltCount; s++) {
        const pt = boltPositions.find((b) => b.seq === s);
        if (pt) {
          if (s === 1) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw each bolt node with number and sequence pill
      boltPositions.forEach((b) => {
        // Bolt hole background circle
        ctx.beginPath();
        ctx.arc(b.x, b.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Sequence number inside
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${b.seq}`, b.x, b.y);
      });
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      // Flange Title label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.fillText(`TRÌNH TỰ XIẾT CHỮ THẬP (${boltCount} BU LÔNG ${torqueSpecs.boltSize})`, 55, 495);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`Thực hiện theo thứ tự số: 1 → 2 → 3 → ... → ${boltCount}`, 55, 515);

      // 5. RIGHT SECTION: Standard Orientation Rules (4 Cards)
      const rightStartX = 580;
      let curY = 145;

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px "Inter", sans-serif';
      ctx.fillText('QUY TẮC ĐỊNH HƯỚNG LẮP ĐẶT TIÊU CHUẨN (VALVE ORIENTATION)', rightStartX, curY);
      curY += 25;

      const rules = [
        {
          title: '1. TY VAN THẲNG ĐỨNG (STEM UPRIGHT 0° - 45°)',
          status: 'KHUYẾN NGHỊ HÀNG ĐẦU (RECOMMENDED)',
          color: '#10b981',
          desc: 'Cho phép vận hành trơn tru nhất, giảm ma sát ty đệm và không đọng cặn trong cổ van.',
          icon: '✓'
        },
        {
          title: '2. TY VAN NẰM NGANG (STEM HORIZONTAL 90°)',
          status: 'CHẤP NHẬN ĐƯỢC (PERMISSIBLE)',
          color: '#f59e0b',
          desc: 'Chỉ áp dụng cho môi chất sạch. Với van DN150 trở lên cần lắp bệ đỡ để tránh lệch tâm ống.',
          icon: '▲'
        },
        {
          title: '3. TY VAN CHÚC NGƯỢC XUỐNG DƯỚI (STEM INVERTED 180°)',
          status: 'NGHIÊM CẤM TUYỆT ĐỐI (FORBIDDEN)',
          color: '#ef4444',
          desc: 'Gây đọng cặn bẩn trong nắp ca-pô, rách gioăng làm kín và ăn mòn ty van nhanh chóng.',
          icon: '✕'
        },
        {
          title: '4. HƯỚNG MÔI CHẤT (FLOW ARROW ALIGNMENT)',
          status: 'BẮT BUỘC THEO MŨI TÊN TRÊN THÂN',
          color: '#3b82f6',
          desc: `Lắp đúng chiều mũi tên đúc trên thân van (P1 -> P2). Lưu lượng định mức Kvs: ${currentSpec.kvFlow} m³/h.`,
          icon: '➔'
        }
      ];

      rules.forEach((r) => {
        // Card background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(rightStartX, curY, 560, 68);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(rightStartX, curY, 560, 68);

        // Icon box
        ctx.fillStyle = r.color;
        ctx.fillRect(rightStartX + 10, curY + 12, 28, 28);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(r.icon, rightStartX + 24, curY + 32);
        ctx.textAlign = 'left';

        // Title & status
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.fillText(r.title, rightStartX + 48, curY + 24);

        ctx.fillStyle = r.color;
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText(r.status, rightStartX + 48, curY + 40);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Inter", sans-serif';
        ctx.fillText(r.desc, rightStartX + 48, curY + 58);

        curY += 76;
      });

      // 6. BOTTOM SECTION: 4-Stage Torque Schedule Table
      const tableY = 560;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(55, tableY, width - 110, 140);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.strokeRect(55, tableY, width - 110, 140);

      // Table Header
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('BẢNG TIÊU CHUẨN LỰC XIẾT BU LÔNG THEO GIAI ĐOẠN (TORQUE STAGING SCHEDULE - ASME B16.5):', 70, tableY + 28);

      // 4 Stages Columns
      const colW = (width - 150) / 4;
      const stages = [
        { step: 'GIAI ĐOẠN 1 (SNUG FIT)', pct: '30% Lực', val: `${torqueSpecs.pass1} Nm`, note: 'Căn chỉnh đều khe hở đệm' },
        { step: 'GIAI ĐOẠN 2 (INTERMEDIATE)', pct: '60% Lực', val: `${torqueSpecs.pass2} Nm`, note: 'Xiết đối xứng chữ thập' },
        { step: 'GIAI ĐOẠN 3 (FINAL TORQUE)', pct: '100% Lực', val: `${torqueSpecs.pass3} Nm`, note: 'Đạt lực ép gioăng kín tiêu chuẩn' },
        { step: 'GIAI ĐOẠN 4 (FINAL PASS)', pct: 'Kiểm tra vòng tròn', val: `${torqueSpecs.pass3} Nm`, note: 'Đi theo chiều kim đồng hồ 1 vòng' }
      ];

      stages.forEach((st, idx) => {
        const xPos = 70 + idx * colW;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.fillText(st.step, xPos, tableY + 60);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.fillText(st.val, xPos, tableY + 88);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px "Inter", sans-serif';
        ctx.fillText(st.pct, xPos, tableY + 104);
        ctx.fillText(st.note, xPos, tableY + 120);
      });

      // 7. Footer Stamp / QA Note
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('DOC REF: IND-ENG-INST-2026 • APPROVED UNDER ISO 5208 / EN 12266-1 PROTOCOL • INDUSTRA INDUSTRIAL CORP', 55, height - 42);

      // Convert to high-resolution PNG data URL
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      setGeneratedPosterUrl(dataUrl);
      setIsGeneratingAiImage(false);
    }, 550);
  };

  /**
   * Copy quick jobsite installation text summary
   */
  const handleCopySummary = () => {
    const text = `=== BẢN HƯỚNG DẪN LẮP ĐẶT VAN ${valve.code} (${selectedDn}) ===
1. Kích thước: ${selectedDn} - Áp lực: ${currentSpec.pn || 'PN16'}
2. Số bu lông mặt bích: ${boltCount} bu lông (${torqueSpecs.boltSize})
3. Trình tự xiết chữ thập (Star pattern): ${boltSequence.join(' -> ')}
4. Lực xiết tiêu chuẩn:
   - Bước 1 (30%): ${torqueSpecs.pass1} Nm
   - Bước 2 (60%): ${torqueSpecs.pass2} Nm
   - Bước 3 (100%): ${torqueSpecs.pass3} Nm
   - Bước 4: Kiểm tra vòng tròn theo chiều kim đồng hồ
5. Định hướng ty van: Khuyến nghị hướng thẳng đứng (0-45°), tuyệt đối không chúc ngược 180°.
6. Môi chất lưu lượng định mức Kvs: ${currentSpec.kvFlow} m3/h.`;

    navigator.clipboard.writeText(text);
    setCopiedToast(lang === 'vi' ? '✓ Đã sao chép hướng dẫn kỹ thuật vào clipboard!' : '✓ Installation summary copied to clipboard!');
    setTimeout(() => setCopiedToast(null), 3000);
  };

  /**
   * Download the generated visual guide poster
   */
  const handleDownloadPoster = () => {
    if (!generatedPosterUrl) return;
    const a = document.createElement('a');
    a.href = generatedPosterUrl;
    a.download = `Visual_Installation_Guide_${valve.code.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedDn.replace(/[^a-zA-Z0-9]/g, '')}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>{lang === 'vi' ? 'Bản Hướng Dẫn Lắp Đặt Kỹ Thuật (Visual Installation Guide)' : 'Visual Installation & Bolt-Tightening Protocol'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  AI ASSISTED
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'vi'
                  ? `Sơ đồ định hướng ty van & trình tự xiết bu lông chữ thập theo kích cỡ danh định cho model ${valve.code}`
                  : `Orientation guidelines & criss-cross bolt tightening sequence for ${valve.code}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {copiedToast && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-lg">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {copiedToast}
            </span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Controls: Select DN & Connection Type */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'vi' ? 'Kích Thước Danh Định (DN Size):' : 'Nominal DN Size:'}
                </label>
                <select
                  value={selectedDn}
                  onChange={(e) => setSelectedDn(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
                >
                  {specs.map((s, idx) => (
                    <option key={idx} value={s.dn}>
                      {s.dn} ({s.flangeHoles || 8} lỗ bích)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {lang === 'vi' ? 'Kiểu Kết Nối Đường Ống:' : 'Connection Style:'}
                </label>
                <select
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-400 focus:outline-none"
                >
                  <option value="flanged_rf">Mặt Bích DIN / ASME (Flanged Raised Face)</option>
                  <option value="wafer">Kẹp Wafer Giữa 2 Bích (Wafer Pattern)</option>
                  <option value="lugged">Bắt Bulông Lugged Toàn Thân</option>
                  <option value="threaded">Nối Ren Trong NPT / BSPT</option>
                  <option value="welded">Hàn Đối Đầu Butt-Weld</option>
                </select>
              </div>
            </div>

            {/* Quick Sizing Badge */}
            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono">
                {lang === 'vi' ? 'Số bu lông & Lực xiết khuyến nghị:' : 'Bolts & Final Torque:'}
              </span>
              <span className="font-mono font-black text-emerald-400 text-sm">
                {boltCount} bu lông ({torqueSpecs.boltSize}) • {torqueSpecs.pass3} Nm
              </span>
            </div>
          </div>

          {/* Interactive Bolt-Tightening Diagram & Staging */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left: Circular Flange SVG Diagram */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'vi' ? `Sơ Đồ Xiết Chữ Thập (${boltCount} Bu Lông)` : `Star Sequence (${boltCount} Bolts)`}</span>
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold">
                  {torqueSpecs.boltSize}
                </span>
              </div>

              {/* Circular Flange SVG */}
              <div className="relative w-full aspect-square max-w-[260px] mx-auto my-2">
                <svg viewBox="0 0 280 280" className="w-full h-full select-none">
                  {/* Outer Flange */}
                  <circle cx="140" cy="140" r="130" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
                  <circle cx="140" cy="140" r="105" fill="none" stroke="rgba(255,255,255,0.15)" strokeDasharray="3,3" />

                  {/* Flow Bore */}
                  <circle cx="140" cy="140" r="55" fill="#090d16" stroke="#10b981" strokeWidth="2" />
                  <text x="140" y="136" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    FLOW BORE
                  </text>
                  <text x="140" y="152" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    {selectedDn}
                  </text>

                  {/* Sequence Star Lines */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeDasharray="4,3"
                    opacity="0.75"
                    points={boltSequence.map((bNum) => {
                      const angle = -Math.PI / 2 + ((bNum - 1) / boltCount) * Math.PI * 2;
                      const bx = 140 + Math.cos(angle) * 105;
                      const by = 140 + Math.sin(angle) * 105;
                      return `${bx},${by}`;
                    }).join(' ')}
                  />

                  {/* Bolt Circles */}
                  {boltSequence.map((bNum, idx) => {
                    const angle = -Math.PI / 2 + ((bNum - 1) / boltCount) * Math.PI * 2;
                    const bx = 140 + Math.cos(angle) * 105;
                    const by = 140 + Math.sin(angle) * 105;
                    const isPassed = idx < Math.min(boltCount, activeStep * Math.ceil(boltCount / 3));

                    return (
                      <g key={bNum} className="cursor-pointer">
                        <circle
                          cx={bx}
                          cy={by}
                          r="13"
                          fill={isPassed ? '#f59e0b' : '#0f172a'}
                          stroke={isPassed ? '#ffffff' : '#f59e0b'}
                          strokeWidth="2"
                        />
                        <text
                          x={bx}
                          y={by + 4}
                          textAnchor="middle"
                          fill={isPassed ? '#0f172a' : '#fef3c7'}
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {idx + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="text-[11px] text-slate-400 text-center font-mono mt-1">
                {lang === 'vi' ? 'Trình tự: ' : 'Order: '}
                <strong className="text-amber-300">{boltSequence.join(' → ')}</strong>
              </div>
            </div>

            {/* Right: 4-Stage Torque Staging */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono mb-2">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>{lang === 'vi' ? 'Quy Trình Xiết 4 Giai Đoạn (Torque Staging):' : '4-Stage Torque Schedule:'}</span>
                </span>

                <div className="space-y-2 mt-3">
                  {/* Stage 1 */}
                  <div 
                    onClick={() => setActiveStep(1)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      activeStep === 1 ? 'bg-blue-950/80 border-blue-500 shadow' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white">Bước 1: Snug Fit (30% Lực)</span>
                      <span className="text-amber-400 font-mono">{torqueSpecs.pass1} Nm</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'vi' ? 'Xiết nhẹ để định hình và căn phẳng gioăng làm kín không bị lệch tâm.' : 'Snug bolts to seat gasket evenly without distortion.'}
                    </p>
                  </div>

                  {/* Stage 2 */}
                  <div 
                    onClick={() => setActiveStep(2)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      activeStep === 2 ? 'bg-blue-950/80 border-blue-500 shadow' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white">Bước 2: Intermediate (60% Lực)</span>
                      <span className="text-amber-400 font-mono">{torqueSpecs.pass2} Nm</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'vi' ? 'Tăng lực theo trình tự chữ thập đối xứng để ép đều lực nén.' : 'Tighten in star criss-cross sequence to build uniform clamp.'}
                    </p>
                  </div>

                  {/* Stage 3 */}
                  <div 
                    onClick={() => setActiveStep(3)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      activeStep === 3 ? 'bg-blue-950/80 border-blue-500 shadow' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white">Bước 3: Final Torque (100% Lực)</span>
                      <span className="text-emerald-400 font-mono">{torqueSpecs.pass3} Nm</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'vi' ? 'Đạt mô-men xoắn danh định thiết kế ASME B16.5 / DIN EN 1092.' : 'Reach full design tightening torque.'}
                    </p>
                  </div>

                  {/* Stage 4 */}
                  <div 
                    onClick={() => setActiveStep(4)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      activeStep === 4 ? 'bg-blue-950/80 border-blue-500 shadow' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-white">Bước 4: Kiểm Tra Vòng Tròn (Clockwise Pass)</span>
                      <span className="text-emerald-400 font-mono">{torqueSpecs.pass3} Nm</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {lang === 'vi' ? 'Đi theo chiều kim đồng hồ 1 vòng kiểm tra lại từng bu lông.' : 'Make one final clockwise pass to confirm all bolts equal.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === 'vi' ? 'Bu lông khuyến nghị:' : 'Recommended bolt grade:'}</span>
                <span className="font-mono text-white font-bold">ASTM A193 B7 / Inox 316</span>
              </div>
            </div>

          </div>

          {/* Standard Orientation Guidelines (4 Rules) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'vi' ? 'Quy Tắc Định Hướng Lắp Đặt Tiêu Chuẩn (Installation Orientation)' : 'Standard Valve Orientation Rules'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Rule 1: Upright */}
              <div className="bg-slate-900 p-3 rounded-xl border border-emerald-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-emerald-400">1. THẲNG ĐỨNG (0°-45°)</span>
                    <span className="text-emerald-400 font-bold">✓ TỐT NHẤT</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {lang === 'vi' ? 'Ty van hướng thẳng đứng lên trên hoặc lệch tối đa 45°. Giúp giảm tải ma sát và tránh đọng cặn bẩn.' : 'Stem upright or within 45°. Minimizes stem friction and prevents sediment accumulation.'}
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono mt-2 block font-bold">✓ Khuyến nghị ưu tiên</span>
              </div>

              {/* Rule 2: Horizontal */}
              <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-amber-400">2. NẰM NGANG (90°)</span>
                    <span className="text-amber-400 font-bold">▲ CHẤP NHẬN</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {lang === 'vi' ? 'Cho phép đối với lưu chất sạch. Với van cỡ lớn ≥ DN150 hoặc van điều khiển nặng, bắt buộc có giá đỡ cổ van.' : 'Acceptable for clean fluids. Large valves ≥ DN150 require external pipe support.'}
                  </p>
                </div>
                <span className="text-[10px] text-amber-400 font-mono mt-2 block font-bold">▲ Cần giá đỡ van</span>
              </div>

              {/* Rule 3: Inverted (Forbidden) */}
              <div className="bg-slate-900 p-3 rounded-xl border border-red-500/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-red-400">3. CHÚC XUỐNG (180°)</span>
                    <span className="text-red-400 font-bold">✕ CẤM</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {lang === 'vi' ? 'Nghiêm cấm tuyệt đối quay ty van chúc ngược xuống đất. Rác và cặn sẽ tích tụ trong nắp van làm hỏng gioăng.' : 'Never invert valve downward. Dirt and sludge will settle in bonnet, causing gland failure.'}
                  </p>
                </div>
                <span className="text-[10px] text-red-400 font-mono mt-2 block font-bold">✕ Nguy cơ hỏng nắp van</span>
              </div>

              {/* Rule 4: Flow Arrow */}
              <div className="bg-slate-900 p-3 rounded-xl border border-blue-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-blue-400">4. MŨI TÊN DÒNG CHẢY</span>
                    <span className="text-blue-400 font-bold">➔ P1 → P2</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {lang === 'vi' ? `Lắp đúng chiều mũi tên đúc trên thân van. Lưu lượng định mức Kvs: ${currentSpec.kvFlow} m³/h.` : `Align with cast body arrow. Rated Kvs capacity: ${currentSpec.kvFlow} m³/h.`}
                  </p>
                </div>
                <span className="text-[10px] text-blue-400 font-mono mt-2 block font-bold">➔ Bắt buộc theo chiều</span>
              </div>
            </div>
          </div>

          {/* Valmet IOM Supplementary Engineering Reference Card */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-3">
            <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-xs font-bold text-white font-mono">
                      {lang === 'vi' ? 'Tài Liệu Kỹ Thuật Độc Quyền do UTDCORP Cung Cấp (utdcorp.com)' : 'UTDCORP Proprietary Engineering Manual'}
                    </h5>
                    <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                      UTDCORP Heavy-Duty Standard
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    {lang === 'vi'
                      ? 'Nguồn và tài liệu kỹ thuật độc quyền do UTDCORP cung cấp cho dòng Van Bướm Hiệu Suất Cao UTD'
                      : 'Proprietary engineering documentation provided by UTDCORP for UTD High Performance Valves'}
                  </p>
                </div>
              </div>

              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-bold font-mono flex items-center gap-1 border border-slate-700 transition-colors"
              >
                <span>utdcorp.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-amber-400 font-bold block">1. Cẩu Nâng & Hướng Trục:</span>
                <p className="text-slate-300 leading-relaxed">
                  {lang === 'vi' 
                    ? 'Chỉ dùng đai vải nylon quấn quanh thân van. Tuyệt đối không cẩu móc vào actuator hoặc ty van. Khuyến nghị lắp trục nằm ngang để tự xả cặn đáy.' 
                    : 'Use nylon slings around body only. Never lift by actuator. Horizontal shaft recommended for self-flushing.'}
                </p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-rose-400 font-bold block">2. Cảnh Báo Hàn Mặt Bích:</span>
                <p className="text-slate-300 leading-relaxed">
                  {lang === 'vi'
                    ? 'Nghiêm cấm hàn bích khi van đang kẹp. Phải đính điểm -> tháo van ra -> hàn hoàn tất -> đợi ống nguội về nhiệt độ phòng mới lắp lại van.'
                    : 'Never weld flanges with valve in place. Tack weld -> remove valve -> complete welding & cool down -> re-install.'}
                </p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-emerald-400 font-bold block">3. Hướng Dòng Chảy Ưu Tiên:</span>
                <p className="text-slate-300 leading-relaxed">
                  {lang === 'vi'
                    ? 'Trục ngược dòng (Shaft Upstream) cho bột giấy & bùn cát mài mòn. Đệm đón áp (Seat Upstream) cho hơi nóng chênh áp cao.'
                    : 'Shaft upstream for pulp & abrasive slurry. Seat upstream for high differential pressure steam isolation.'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Image Generation Section (Poster Generator) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-amber-500/30">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>{lang === 'vi' ? 'Tạo Bản Vẽ Hướng Dẫn Lắp Đặt Bằng AI (AI Visual Installation Poster)' : 'Generate AI Visual Installation Blueprint Poster'}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'vi'
                    ? 'Sinh poster kỹ thuật độ phân giải cao (1200x800) sẵn sàng in ấn hoặc gửi kỹ sư công trường'
                    : 'Render high-resolution 1200x800 technical blueprint poster for jobsite technicians and documentation'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateAiPoster}
                  disabled={isGeneratingAiImage}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAiImage ? (lang === 'vi' ? 'Đang tạo bản vẽ...' : 'Generating...') : (lang === 'vi' ? '⚡ Tạo Bản Vẽ AI Ngay' : '⚡ Generate AI Blueprint')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                  title="Sao chép tóm tắt thông số xiết bu lông"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'Sao chép văn bản' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            {/* Live Generated Poster Preview */}
            {generatedPosterUrl && (
              <div className="mt-4 pt-4 border-t border-slate-800 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'vi' ? 'Bản vẽ kỹ thuật đã được tạo hoàn tất (1200 x 800 HD):' : 'Technical Blueprint Poster Ready (1200 x 800 HD):'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleDownloadPoster}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'vi' ? 'Tải Ảnh Bản Vẽ (PNG)' : 'Download Poster (PNG)'}</span>
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
                  <img
                    src={generatedPosterUrl}
                    alt="Visual Installation Guide Poster"
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/uploads/valve_placeholder.svg';
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hidden Canvas for High-Resolution Drawing */}
          <canvas ref={canvasRef} className="hidden" />

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-slate-400">
            Tiêu chuẩn: <strong className="text-white">ASME B16.5 / DIN EN 1092-1 / ISO 5208</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
