import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RefreshCw, 
  Building2, 
  Calendar, 
  MapPin, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  Camera, 
  Link, 
  Download, 
  Eye, 
  Wand2, 
  Flame, 
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { ProjectRecord, SupportedLanguage, ProjectIndustry } from '../types/valve';
import { translateTechString } from '../utils/engineeringTranslator';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';

interface ProjectPhotoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectRecord[];
  initialProjectId?: string;
  onUpdateProjectPhoto: (projectId: string, newImageUrl: string) => void;
  lang: SupportedLanguage;
}

interface IndustryPreset {
  id: string;
  nameVi: string;
  nameEn: string;
  industry: ProjectIndustry;
  accentColor: string;
  bgGradient: [string, string, string];
  promptSnippet: string;
  sampleAssetUrl?: string;
}

const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: 'refinery',
    nameVi: 'Lọc Hóa Dầu & Nhà Máy Khí Đốt',
    nameEn: 'Petrochemical & Oil Refinery',
    industry: 'oil_gas',
    accentColor: '#f59e0b',
    bgGradient: ['#1e1b4b', '#1e293b', '#0f172a'],
    promptSnippet: 'Petrochemical refinery pipeline manifold at golden hour dusk, heavy steel flanges, automated valve actuators, industrial flare stacks, hyper-realistic photography',
    sampleAssetUrl: '/uploads/project_refinery_plant.jpg'
  },
  {
    id: 'hvac_plant',
    nameVi: 'Trạm Chiller HVAC Cao Ốc Thương Mại',
    nameEn: 'Commercial Tower HVAC Central Plant',
    industry: 'hvac_bldg',
    accentColor: '#3b82f6',
    bgGradient: ['#0f172a', '#1e3a8a', '#0284c7'],
    promptSnippet: 'Modern skyscraper central chiller plant room, blue insulated chilled water pipes, industrial butterfly valves with electric actuators, clean epoxy floor, LED lighting',
    sampleAssetUrl: '/uploads/project_hvac_chiller.jpg'
  },
  {
    id: 'pipeline_corridor',
    nameVi: 'Hành Lang Tuyến Ống Truyền Tải Công Nghiệp',
    nameEn: 'Heavy Industrial Pipeline Corridor',
    industry: 'heavy_industry',
    accentColor: '#10b981',
    bgGradient: ['#064e3b', '#0f172a', '#1e293b'],
    promptSnippet: 'Long straight industrial pipeline corridor with pressure gauges, high pressure bypass manifolds, insulated steam jacket lines, architectural perspective',
    sampleAssetUrl: '/uploads/hero_pipeline.jpg'
  },
  {
    id: 'fire_pump',
    nameVi: 'Trạm Bơm & Van PCCC Chuẩn UL/FM',
    nameEn: 'UL/FM Fire Protection Pump Room',
    industry: 'fire_protection',
    accentColor: '#ef4444',
    bgGradient: ['#450a0a', '#1c1917', '#0c0a09'],
    promptSnippet: 'Fire protection pump station room, bright red pipes, UL/FM listed alarm check valves, deluge valves, supervisory tamper switches, NFPA compliance',
    sampleAssetUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'power_steam',
    nameVi: 'Nhiệt Điện & Hệ Thống Hơi Nóng',
    nameEn: 'Thermal Power & Steam Turbine Headers',
    industry: 'power_energy',
    accentColor: '#f97316',
    bgGradient: ['#431407', '#1c1917', '#0f172a'],
    promptSnippet: 'Thermal power plant high pressure steam header, heavy cast steel gate and globe valves, thermal insulation cladding, steam monitoring station',
    sampleAssetUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'water_utility',
    nameVi: 'Nhà Máy Xử Lý Nước & Trạm Bơm Cấp',
    nameEn: 'Municipal Water Treatment & Distribution',
    industry: 'water_utility',
    accentColor: '#06b6d4',
    bgGradient: ['#083344', '#0f172a', '#164e63'],
    promptSnippet: 'Large municipal water filtration plant, ductile iron resilient seated gate valves, electromagnetic flowmeters, blue epoxy coated fittings',
    sampleAssetUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
  }
];

export const ProjectPhotoManagerModal: React.FC<ProjectPhotoManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  initialProjectId,
  onUpdateProjectPhoto,
  lang
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || (projects[0]?.id || '')
  );
  const [activeTab, setActiveTab] = useState<'ai_gen' | 'upload' | 'url'>('ai_gen');
  const [searchFilter, setSearchFilter] = useState('');

  // Selected project object
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // AI Generator state
  const [selectedPresetId, setSelectedPresetId] = useState<string>('refinery');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGeneratingCanvas, setIsGeneratingCanvas] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [generatedPlaceholderDataUrl, setGeneratedPlaceholderDataUrl] = useState<string | null>(null);

  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // URL state
  const [directUrlInput, setDirectUrlInput] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Canvas ref for generating high-definition industrial placeholders
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync initial project when modal opens or initialProjectId changes
  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    } else if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [initialProjectId, projects]);

  // Update prompt and preview whenever selected project changes
  useEffect(() => {
    if (currentProject) {
      // Find matching preset by industry if available
      const matchingPreset = INDUSTRY_PRESETS.find((p) => p.industry === currentProject.industry) || INDUSTRY_PRESETS[0];
      setSelectedPresetId(matchingPreset.id);

      const generatedPrompt = `Industrial case study photography: ${currentProject.name} (${currentProject.nameEn}), Investor: ${currentProject.clientInvestor}, Location: ${currentProject.location}. ${matchingPreset.promptSnippet}. Crisp architectural lines, 16:9 ratio, 8k resolution.`;
      setCustomPrompt(generatedPrompt);
      setPreviewImageUrl(currentProject.imageUrl || matchingPreset.sampleAssetUrl || '');
      setDirectUrlInput(currentProject.imageUrl || '');
    }
  }, [selectedProjectId, currentProject]);

  if (!isOpen || !currentProject) return null;

  // Filter projects in selector dropdown
  const filteredProjectsList = projects.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.clientInvestor.toLowerCase().includes(q) || p.year.toString().includes(q);
  });

  /**
   * Generates a high-fidelity industrial blueprint & photographic placeholder canvas
   */
  const handleGenerateCanvasPlaceholder = () => {
    setIsGeneratingCanvas(true);

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsGeneratingCanvas(false);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingCanvas(false);
        return;
      }

      const preset = INDUSTRY_PRESETS.find((p) => p.id === selectedPresetId) || INDUSTRY_PRESETS[0];
      const width = 1200;
      const height = 675; // 16:9 ratio

      canvas.width = width;
      canvas.height = height;

      // 1. Background Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, preset.bgGradient[0]);
      bgGrad.addColorStop(0.5, preset.bgGradient[1]);
      bgGrad.addColorStop(1, preset.bgGradient[2]);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Blueprint Engineering Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
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

      // 3. Isometric Pipe & Manifold Vector Graphics
      ctx.strokeStyle = preset.accentColor;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.25;

      // Draw stylized pipeline manifold vectors
      ctx.beginPath();
      ctx.moveTo(100, 480);
      ctx.lineTo(400, 320);
      ctx.lineTo(750, 320);
      ctx.lineTo(1050, 160);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(250, 520);
      ctx.lineTo(550, 360);
      ctx.lineTo(850, 360);
      ctx.lineTo(1150, 200);
      ctx.stroke();

      // Draw valve nodes
      const valveNodes = [
        { x: 400, y: 320 },
        { x: 750, y: 320 },
        { x: 550, y: 360 },
        { x: 850, y: 360 }
      ];
      valveNodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = preset.accentColor;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      ctx.globalAlpha = 1.0;

      // 4. Vignette Shadow Overlay
      const radialGrad = ctx.createRadialGradient(
        width / 2, height / 2, 200,
        width / 2, height / 2, 650
      );
      radialGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      radialGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.6)');
      radialGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // 5. Header Badge: Official Engineering Record
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(50, 40, 480, 42);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(50, 40, 480, 42);

      ctx.fillStyle = preset.accentColor;
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText(`★ INDUSTRA CORP • CASE STUDY ${currentProject.year}`, 65, 66);

      // 6. Project Title & Investor Branding
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px "Inter", sans-serif';
      // Truncate if too long
      const title = currentProject.name.length > 40 ? currentProject.name.slice(0, 38) + '...' : currentProject.name;
      ctx.fillText(title, 50, 160);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 20px "Inter", sans-serif';
      ctx.fillText(`Chủ đầu tư / Investor: ${currentProject.clientInvestor}`, 50, 200);

      // 7. Information Pill Tags
      const tags = [
        `📍 ${currentProject.location}`,
        `💰 ${currentProject.contractValueVnd}`,
        `🏭 ${currentProject.industryLabel}`,
        `🔧 Brands: ${currentProject.brandsUsed.join(', ')}`
      ];

      let tagX = 50;
      const tagY = 250;
      tags.forEach((tag) => {
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(tag).width;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(tagX, tagY - 18, textWidth + 24, 30);
        ctx.strokeStyle = preset.accentColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(tagX, tagY - 18, textWidth + 24, 30);

        ctx.fillStyle = '#f8fafc';
        ctx.fillText(tag, tagX + 12, tagY + 3);
        tagX += textWidth + 36;
      });

      // 8. Technical Metadata HUD (Bottom Plate)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(50, height - 90, width - 100, 50);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(50, height - 90, width - 100, 50);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`PHOTOGRAPHIC ASSET ARCHIVE • ${preset.nameEn.toUpperCase()}`, 70, height - 60);

      ctx.fillStyle = preset.accentColor;
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText(`AI SIMULATION RENDERING • SENSOR: 35MM F/2.8 HDR • PROJECT ID: ${currentProject.id}`, width - 680, height - 60);

      // Convert to WebP data URL
      const dataUrl = canvas.toDataURL('image/webp', 0.92);
      setGeneratedPlaceholderDataUrl(dataUrl);
      setPreviewImageUrl(dataUrl);
      setIsGeneratingCanvas(false);

      setToastMessage(lang === 'vi' ? '✓ Đã tạo ảnh đồ họa placeholder thành công!' : '✓ HD Graphic placeholder generated successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 450);
  };

  /**
   * Handle user file upload from local computer
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImageUrl(result);
      setGeneratedPlaceholderDataUrl(result);
      setToastMessage(lang === 'vi' ? `✓ Đã nạp ảnh "${file.name}"` : `✓ Loaded "${file.name}"`);
      setTimeout(() => setToastMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Save the chosen preview image to the selected project
   */
  const handleSaveToProject = () => {
    if (!previewImageUrl) return;
    onUpdateProjectPhoto(currentProject.id, previewImageUrl);
    setToastMessage(
      lang === 'vi'
        ? `✓ Đã lưu ảnh mới cho dự án "${currentProject.name}"!`
        : `✓ Photo saved to project "${currentProject.name}"!`
    );
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>{lang === 'vi' ? 'Studio Tạo Ảnh & Upload Placeholder Cho Dự Án' : 'Project Photo & Placeholder Generator Studio'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ADMIN ONLY
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'vi'
                  ? 'Tạo ảnh minh họa bằng AI hoặc tải lên ảnh thực tế cho từng dự án trong Portfolio'
                  : 'Generate AI photo placeholders or upload actual project photos to enrich portfolio entries'}
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

        {/* Toast alert */}
        {toastMessage && (
          <div className="mx-5 mt-3 p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-lg">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {toastMessage}
            </span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* 1. Target Project Selector */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                {lang === 'vi' ? '1. Chọn Dự Án Cần Thay Đổi Ảnh / Tạo Placeholder:' : '1. Select Target Project Entry:'}
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                {projects.length} {lang === 'vi' ? 'dự án trong hệ thống' : 'total projects'}
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-bold focus:border-blue-500 focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.year}] {p.name} - {p.clientInvestor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Info summary of selected project */}
              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{currentProject.industryLabel} • {currentProject.location}</span>
                  <span className="font-extrabold text-white text-xs truncate max-w-[240px] block">{currentProject.name}</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-[11px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  {currentProject.contractValueVnd}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Main Studio Modes: Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('ai_gen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'ai_gen'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'vi' ? '⚡ AI Studio & Placeholder' : '⚡ AI Studio & Placeholder'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? '📤 Tải Lên Ảnh Từ Máy Tính' : '📤 Upload Local Image'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'url'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? '🔗 Nhập URL Ảnh' : '🔗 Image URL'}</span>
            </button>
          </div>

          {/* TAB 1: AI GENERATOR & INDUSTRY PRESETS */}
          {activeTab === 'ai_gen' && (
            <div className="space-y-4">
              
              {/* Presets Grid */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
                  {lang === 'vi' ? 'Chọn phong cách bối cảnh ngành nghề:' : 'Select Industry Photographic Scene:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {INDUSTRY_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(preset.id);
                          if (preset.sampleAssetUrl) {
                            setPreviewImageUrl(preset.sampleAssetUrl);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-950/70 border-blue-500 shadow-lg shadow-blue-900/30 scale-[1.01]'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: preset.accentColor }}
                          />
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                        <div className="text-xs font-bold text-white line-clamp-1">
                          {lang === 'vi' ? preset.nameVi : preset.nameEn}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 font-mono">
                          {preset.industry.toUpperCase()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-400">
                    {lang === 'vi' ? 'Câu lệnh mô tả hình ảnh (AI Prompt):' : 'AI Generation Prompt:'}
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">16:9 • Ultra HD • Photorealistic</span>
                </div>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons: Generate Blueprint Placeholder or Use Real-asset */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleGenerateCanvasPlaceholder}
                  disabled={isGeneratingCanvas}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>{isGeneratingCanvas ? (lang === 'vi' ? 'Đang vẽ đồ họa...' : 'Generating...') : (lang === 'vi' ? '⚡ Vẽ Ảnh Placeholder Bằng AI' : '⚡ Generate HD Placeholder')}</span>
                </button>

                {/* Pre-generated real photorealistic assets */}
                <button
                  type="button"
                  onClick={() => {
                    const preset = INDUSTRY_PRESETS.find((p) => p.id === selectedPresetId);
                    if (preset?.sampleAssetUrl) {
                      setPreviewImageUrl(preset.sampleAssetUrl);
                      setToastMessage(lang === 'vi' ? '✓ Đã chọn ảnh thư viện chuẩn ngành' : '✓ Selected verified industry photo');
                      setTimeout(() => setToastMessage(null), 2500);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
                >
                  <Camera className="w-4 h-4 text-blue-400" />
                  <span>{lang === 'vi' ? '📷 Dùng Ảnh Chụp Thực Tế Thư Viện' : '📷 Use Verified Industry Photo'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: LOCAL FILE UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all"
              >
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">
                  {lang === 'vi' ? 'Nhấn để chọn file ảnh hoặc kéo thả vào đây' : 'Click to select or drag and drop image'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {lang === 'vi'
                    ? 'Hỗ trợ định dạng JPG, PNG, WebP. Tối đa 10MB. Hệ thống sẽ tự động tối ưu hóa tỷ lệ 16:9.'
                    : 'Supports JPG, PNG, WebP up to 10MB. Automatically optimized for 16:9 portfolio layout.'}
                </p>
                {uploadedFileName && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-mono border border-blue-500/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>{uploadedFileName}</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* TAB 3: DIRECT URL INPUT */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {lang === 'vi' ? 'Đường link URL ảnh trực tiếp:' : 'Direct Image URL:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={directUrlInput}
                    onChange={(e) => {
                      setDirectUrlInput(e.target.value);
                      setPreviewImageUrl(e.target.value);
                    }}
                    placeholder="https://example.com/project-image.jpg"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewImageUrl(directUrlInput)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow"
                  >
                    {lang === 'vi' ? 'Xem thử' : 'Preview'}
                  </button>
                </div>
              </div>

              {/* Quick sample URLs */}
              <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                <span>{lang === 'vi' ? 'Gợi ý mẫu:' : 'Sample links:'}</span>
                <button
                  type="button"
                  onClick={() => {
                    const sample = '/uploads/project_refinery_plant.jpg';
                    setDirectUrlInput(sample);
                    setPreviewImageUrl(sample);
                  }}
                  className="text-blue-400 hover:underline"
                >
                  Refinery Asset
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    const sample = '/uploads/project_hvac_chiller.jpg';
                    setDirectUrlInput(sample);
                    setPreviewImageUrl(sample);
                  }}
                  className="text-blue-400 hover:underline"
                >
                  HVAC Chiller Asset
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    const sample = '/uploads/hero_pipeline.jpg';
                    setDirectUrlInput(sample);
                    setPreviewImageUrl(sample);
                  }}
                  className="text-blue-400 hover:underline"
                >
                  Industrial Pipeline
                </button>
              </div>
            </div>
          )}

          {/* 3. Live Side-by-Side Preview */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'vi' ? 'So Sánh Trực Tiếp (Hiện Tại vs Ảnh Mới Được Chọn):' : 'Live Preview Comparison (Current vs New Photo):'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">Tỷ lệ chuẩn 16:9 • Portfolio Card Aspect</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Current Image */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block flex items-center justify-between">
                  <span>{lang === 'vi' ? 'Ảnh Hiện Tại Của Dự Án' : 'Current Project Image'}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Original</span>
                </span>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                  <img
                    src={resolveProductImageUrl(currentProject.imageUrl || '/uploads/project_refinery_plant.jpg')}
                    alt={currentProject.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300">
                    {currentProject.year}
                  </div>
                </div>
              </div>

              {/* New Preview Image */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-400 block flex items-center justify-between">
                  <span>{lang === 'vi' ? 'Ảnh Mới Sẽ Được Cập Nhật' : 'New Selected / Generated Image'}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Preview (Ready)</span>
                </span>
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-emerald-500/60 bg-slate-900 shadow-lg shadow-emerald-950/40">
                  {previewImageUrl ? (
                    <img
                      src={resolveProductImageUrl(previewImageUrl)}
                      alt="New preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      {lang === 'vi' ? 'Chưa chọn ảnh' : 'No photo selected'}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-black font-mono">
                    NEW 16:9
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Hidden canvas for placeholder generation */}
          <canvas ref={canvasRef} className="hidden" />

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-slate-400 font-mono">
            {lang === 'vi' ? 'Dự án đích:' : 'Target:'} <strong className="text-white">{currentProject.name}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {lang === 'vi' ? 'Hủy' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSaveToProject}
              disabled={!previewImageUrl}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                !previewImageUrl
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-900/40 active:scale-95'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{lang === 'vi' ? '💾 Lưu Ảnh Cho Dự Án Này' : '💾 Save Photo to Project'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
