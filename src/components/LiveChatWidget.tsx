import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Wrench, 
  Bot, 
  User, 
  PhoneCall, 
  ChevronRight, 
  CheckCircle2,
  Sparkles,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Flame,
  Droplet,
  Layers,
  Search,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  TrendingUp,
  Box,
  FileText,
  RotateCcw,
  Plus,
  Check,
  CheckCheck
} from 'lucide-react';
import { ValveProduct, SupportedLanguage, ValveCategory } from '../types/valve';
import { 
  consultOnlineValveEngineer, 
  exploreCatalogCategories, 
  getDetailedValveFeatureAnalysis,
  adviseByEngineeringParameters,
  EngineerAdvisorResponse 
} from '../utils/onlineValveEngineer';
import { VALVES_DATA } from '../data/valvesData';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  advisorData?: EngineerAdvisorResponse;
  isGeminiPowered?: boolean;
  modelName?: string;
}

interface LiveChatWidgetProps {
  lang: SupportedLanguage;
  valves?: ValveProduct[];
  onSelectFig?: (figCode: string) => void;
  onSelectValve?: (valve: ValveProduct) => void;
  onToggleRfq?: (valve: ValveProduct) => void;
  rfqItemIds?: string[];
  onOpenRfq?: () => void;
  onOpenAiKnowledgeModal?: () => void;
}

type WidgetTab = 'chat' | 'explore' | 'advisor';

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ 
  lang, 
  valves = VALVES_DATA,
  onSelectFig,
  onSelectValve,
  onToggleRfq,
  rfqItemIds = [],
  onOpenRfq,
  onOpenAiKnowledgeModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>('chat');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Search & Explore State
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ValveCategory | 'all'>('all');

  // Interactive 3-Step Sizing & Selection Wizard State
  const [wizardMedia, setWizardMedia] = useState('Nước lạnh Chiller HVAC');
  const [wizardPressure, setWizardPressure] = useState('PN16');
  const [wizardTemp, setWizardTemp] = useState('0°C - 100°C');
  const [wizardDn, setWizardDn] = useState('DN100 (4")');
  const [wizardFunction, setWizardFunction] = useState('Đóng/ngắt On-Off');

  const categories = useMemo(() => {
    return exploreCatalogCategories(valves, lang);
  }, [valves, lang]);

  const filteredValves = useMemo(() => {
    let list = valves;
    if (selectedCategory !== 'all') {
      list = list.filter(v => v.category === selectedCategory);
    }
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase().trim();
      list = list.filter(v => 
        v.name.toLowerCase().includes(q) ||
        (v.nameEn && v.nameEn.toLowerCase().includes(q)) ||
        v.code.toLowerCase().includes(q) ||
        v.material.toLowerCase().includes(q) ||
        v.applicableMedia.some(m => m.toLowerCase().includes(q))
      );
    }
    return list;
  }, [valves, selectedCategory, catalogSearch]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: lang === 'vi'
        ? `Xin chào Quý Kỹ sư! Tôi là Kỹ Sư Trực Tuyến UTD (AI Gemini 3.8 Flash).
Tôi liên tục cập nhật kiến thức kỹ thuật từ các tiêu chuẩn quốc tế (ASME B16.34, API 598, ISO 5208 Rate A, Crane TP 410, NFPA 13) và toàn bộ ${valves.length} dòng van UTD.
Tôi có thể:
1. Tìm kiếm đa nguồn và tư vấn chọn van tối ưu theo áp lực, nhiệt độ, lưu chất.
2. Đối chiếu thay thế tương đương từ các hãng Spirax Sarco, Johnson Controls, Bray, Danfoss, Kitz, Yoshitake, APC.
3. Tính toán lưu lượng Kv/Cv, kiểm tra các dòng van bổ sung mới của UTD và thêm trực tiếp vào Báo Giá RFQ!`
        : `Welcome! I am the UTD Online Valve Engineer (Powered by Gemini 3.8 Flash).
I continuously retrieve technical data from international standards (ASME B16.34, API 598, ISO 5208 Rate A, Crane TP 410, NFPA 13) and our complete catalog of ${valves.length} UTD valves.
I can introduce any valve's features, cross-reference competitors, calculate flow Cv/Kv, and advise on optimal valve selection!`,
      time: 'Vừa xong',
      isGeminiPowered: true
    }
  ]);

  const quickPrompts = [
    {
      qVi: '🔥 Van hơi lò hơi 250°C áp 25 bar',
      qEn: 'Valve for 250°C steam at 25 bar'
    },
    {
      qVi: '⚖️ Van cân bằng tự động PICV Chiller',
      qEn: 'Pressure independent control valve PICV'
    },
    {
      qVi: '📉 Chọn van giảm áp cho tòa nhà cao tầng',
      qEn: 'Water pressure reducing valve for high-rise'
    },
    {
      qVi: '🔄 Đối chiếu thay thế Johnson Controls / Spirax',
      qEn: 'Cross-ref Johnson Controls & Spirax Sarco'
    },
    {
      qVi: '🦋 Van Bướm Lệch Tâm 3 Kim Loại 450°C',
      qEn: 'Triple Offset Butterfly Valve 450°C'
    },
    {
      qVi: '↩️ Van một chiều cánh bướm chống búa nước',
      qEn: 'Non-slam dual plate check valve for pumps'
    },
    {
      qVi: '🤖 Kiểm tra các dòng van bổ sung mới của UTD',
      qEn: 'Check new supplemental UTD valves'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // 1. Try Gemini 3.8 Flash Online Engineer API first
    try {
      const res = await fetch('/api/gemini/engineer-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          chatHistory: messages.slice(-5).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text
          })),
          valvesCatalog: valves.map(v => ({
            code: v.code,
            name: v.name,
            material: v.material,
            pressure: v.pressure,
            tempRange: v.tempRange,
            applicableMedia: v.applicableMedia
          })),
          lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          // Identify matching valve models
          let matchedValves: ValveProduct[] = [];
          if (Array.isArray(data.recommendedCodes) && data.recommendedCodes.length > 0) {
            matchedValves = valves.filter(v => 
              data.recommendedCodes.some((code: string) => v.code.toUpperCase().includes(code.toUpperCase()))
            );
          }
          if (matchedValves.length === 0) {
            const words = query.toLowerCase().split(' ').filter(w => w.length > 2);
            matchedValves = valves.filter(v => 
              words.some(w => v.name.toLowerCase().includes(w) || v.code.toLowerCase().includes(w))
            ).slice(0, 3);
          }
          if (matchedValves.length === 0) {
            const localFallback = consultOnlineValveEngineer(query, lang, valves);
            matchedValves = localFallback.recommendedValves || (localFallback.primaryValve ? [localFallback.primaryValve] : []);
          }

          const primary = matchedValves[0];

          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            advisorData: {
              answerVi: data.reply,
              answerEn: data.reply,
              citations: data.citations || [
                'ASME B16.34: Pressure-Temperature Ratings',
                'API 598: Valve Inspection & Testing',
                'ISO 5208 Rate A: Bubble-Tight Sealing',
                'Crane Technical Paper 410: Fluid Dynamics'
              ],
              primaryValve: primary,
              recommendedValves: matchedValves.slice(0, 4),
              mode: 'advise'
            },
            isGeminiPowered: true,
            modelName: data.modelUsed || 'gemini-3.8-flash'
          };

          setMessages(prev => [...prev, botMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Local fallback
    }

    // 2. High-fidelity Local Engineering Domain Engine Fallback
    setTimeout(() => {
      const advisorResult = consultOnlineValveEngineer(query, lang, valves);
      const botReplyText = lang === 'vi' ? advisorResult.answerVi : advisorResult.answerEn;

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        advisorData: advisorResult,
        isGeminiPowered: false
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleInspectValve = (valve: ValveProduct) => {
    if (onSelectValve) {
      onSelectValve(valve);
    } else if (onSelectFig) {
      onSelectFig(valve.code);
    }
  };

  const handleRequestFeatures = (valve: ValveProduct) => {
    setActiveTab('chat');
    const query = lang === 'vi' 
      ? `Giới thiệu tính năng van ${valve.code} (${valve.name})`
      : `Introduce features of ${valve.code} (${valve.nameEn || valve.name})`;
    handleSend(query);
  };

  const handleRunAdvisorWizard = () => {
    const query = `${wizardMedia}, áp lực ${wizardPressure}, nhiệt độ ${wizardTemp}, cỡ ống ${wizardDn}, chức năng ${wizardFunction}`;
    const advisorResult = adviseByEngineeringParameters(
      {
        media: wizardMedia,
        pressure: wizardPressure,
        dn: wizardDn,
        functionType: wizardFunction
      },
      valves,
      lang
    );

    const botMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: lang === 'vi' ? advisorResult.answerVi : advisorResult.answerEn,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      advisorData: advisorResult
    };

    setMessages((prev) => [...prev, botMsg]);
    setActiveTab('chat');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Chat Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500 hover:from-blue-600 hover:to-amber-400 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-blue-950/60 border border-blue-400/40 transition-all hover:scale-105 active:scale-95"
          aria-label="Mở Kỹ sư trực tuyến UTD"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 absolute -top-1 -right-1"></span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="font-extrabold text-xs tracking-wide flex items-center gap-1.5">
              <span>{lang === 'vi' ? 'Kỹ Sư Trực Tuyến UTD' : 'UTD Online Valve Engineer'}</span>
              <span className="bg-amber-400/20 text-amber-300 px-1 py-0.2 rounded text-[9px] font-mono border border-amber-400/30">AI</span>
            </span>
            <span className="text-[10px] text-amber-200/90 font-mono">
              {lang === 'vi' ? 'Tìm hiểu sản phẩm • Giới thiệu tính năng • Tư vấn chọn van' : 'Explore products • Tech specs • Valve selection'}
            </span>
          </div>
        </button>
      )}

      {/* Main Interactive Floating Window */}
      {isOpen && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl w-[94vw] sm:w-[500px] h-[640px] max-h-[90vh] flex flex-col overflow-hidden animate-fade-in ring-1 ring-amber-500/30">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow">
                <Bot className="w-5 h-5 text-amber-200" />
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950 absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-xs sm:text-sm">
                    {lang === 'vi' ? 'Kỹ Sư Trực Tuyến UTD' : 'UTD Online Valve Engineer'}
                  </h3>
                  <span className="px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded text-[9px] font-mono font-black uppercase shadow">
                    GEMINI 3.8 FLASH
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {lang === 'vi' ? 'Tư vấn đa nguồn • ASME, API, ISO, NFPA • Báo giá & Spec UTD' : 'Multi-source advisor • ASME, API, ISO, NFPA • Specs & Quotes'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {onOpenAiKnowledgeModal && (
                <button
                  type="button"
                  onClick={onOpenAiKnowledgeModal}
                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Mở AI Tri Thức & Bổ Sung Danh Mục Van"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">Tri Thức & Bổ Sung Van</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="grid grid-cols-3 bg-slate-900/90 border-b border-slate-800 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-2 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'chat'
                  ? 'border-amber-400 text-amber-300 bg-slate-950/60 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Hỏi Đáp Kỹ Sư' : 'Live Chat'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`py-2 px-2 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'explore'
                  ? 'border-blue-400 text-blue-300 bg-slate-950/60 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Tìm Hiểu Sản Phẩm' : 'Explore Catalog'}</span>
              <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1 rounded">{valves.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('advisor')}
              className={`py-2 px-2 flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                activeTab === 'advisor'
                  ? 'border-emerald-400 text-emerald-300 bg-slate-950/60 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Tư Vấn Chọn Van' : 'Sizing Advisor'}</span>
            </button>
          </div>

          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Quick Prompts Carousel */}
              <div className="bg-slate-950/90 border-b border-slate-800/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-thin shrink-0">
                <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {lang === 'vi' ? 'Chủ đề hot:' : 'Hot Topics:'}
                </span>
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(lang === 'vi' ? p.qVi : p.qEn)}
                    className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-700/80 text-[10px] whitespace-nowrap shrink-0 transition-colors font-mono cursor-pointer"
                  >
                    {lang === 'vi' ? p.qVi : p.qEn}
                  </button>
                ))}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-950/80 scrollbar-thin">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-lg bg-blue-900/80 border border-blue-700 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed space-y-2.5 ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-900/30'
                          : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                      }`}
                    >
                      {msg.isGeminiPowered && (
                        <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full w-fit">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                          <span>AI Gemini 3.8 Flash • Tư Vấn Đa Nguồn</span>
                        </div>
                      )}

                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Primary Valve Recommendation or Direct Match */}
                      {msg.advisorData?.primaryValve && (
                        <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-3 space-y-2 shadow-inner">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                              {lang === 'vi' ? 'Model van UTD khuyên dùng:' : 'Recommended Valve Model:'}
                            </span>
                            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                              {msg.advisorData.primaryValve.code}
                            </span>
                          </div>

                          <div className="flex items-start gap-2.5">
                            {msg.advisorData.primaryValve.image && (
                              <img
                                src={resolveProductImageUrl(msg.advisorData.primaryValve.image)}
                                alt={msg.advisorData.primaryValve.name}
                                className="w-12 h-12 object-cover rounded-lg border border-slate-800 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-bold text-xs line-clamp-1">
                                {lang === 'vi' ? msg.advisorData.primaryValve.name : (msg.advisorData.primaryValve.nameEn || msg.advisorData.primaryValve.name)}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {msg.advisorData.primaryValve.pressure} • {msg.advisorData.primaryValve.sizeRange}
                              </div>
                              <div className="text-[10px] text-amber-200/90 font-mono line-clamp-1 mt-0.5">
                                {msg.advisorData.primaryValve.material}
                              </div>
                            </div>
                          </div>

                          {/* Quick Interactive Actions */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleInspectValve(msg.advisorData!.primaryValve!)}
                              className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-[10px] flex items-center justify-center gap-1 shadow transition-all"
                            >
                              <Box className="w-3 h-3 text-slate-950" />
                              <span>{lang === 'vi' ? '🔍 Xem 3D & Spec' : '🔍 Inspect 3D & Spec'}</span>
                            </button>

                            {onToggleRfq && (
                              <button
                                type="button"
                                onClick={() => onToggleRfq(msg.advisorData!.primaryValve!)}
                                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition-all ${
                                  rfqItemIds.includes(msg.advisorData.primaryValve.id)
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                    : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-slate-500 hover:text-white'
                                }`}
                              >
                                {rfqItemIds.includes(msg.advisorData.primaryValve.id) ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>{lang === 'vi' ? 'Đã trong RFQ' : 'In RFQ Cart'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3 text-amber-400" />
                                    <span>{lang === 'vi' ? '+ Thêm Báo Giá' : '+ Add to RFQ'}</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Multiple Product Cards (if explore or multi-recommendation) */}
                      {msg.advisorData?.recommendedValves && msg.advisorData.recommendedValves.length > 1 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono text-slate-400 font-bold block">
                            {lang === 'vi' ? 'Các dòng van tiêu biểu liên quan:' : 'Related Catalog Valves:'}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {msg.advisorData.recommendedValves.slice(0, 4).map((v) => (
                              <div
                                key={v.id}
                                className="bg-slate-950 p-2 rounded-lg border border-slate-800 hover:border-blue-500/60 transition-all text-[10px] flex flex-col justify-between"
                              >
                                <div>
                                  <div className="font-bold text-white line-clamp-1">{v.code}</div>
                                  <div className="text-slate-400 line-clamp-1 text-[9px]">{v.name}</div>
                                  <div className="text-amber-400 font-mono text-[9px] mt-0.5">{v.pressure} • {v.sizeRange}</div>
                                </div>
                                <div className="flex items-center gap-1 mt-1.5 pt-1 border-t border-slate-900">
                                  <button
                                    type="button"
                                    onClick={() => handleInspectValve(v)}
                                    className="flex-1 py-0.5 px-1 rounded bg-slate-900 hover:bg-blue-600 text-blue-300 hover:text-white text-[9px] font-mono text-center transition-colors"
                                  >
                                    {lang === 'vi' ? 'Chi tiết' : 'Specs'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRequestFeatures(v)}
                                    className="py-0.5 px-1.5 rounded bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-400 text-[9px] font-mono transition-colors"
                                    title="Giới thiệu tính năng"
                                  >
                                    ⚙️ {lang === 'vi' ? 'Tính năng' : 'Features'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cited Standards & Literature */}
                      {msg.advisorData?.citations && msg.advisorData.citations.length > 0 && (
                        <div className="bg-slate-950/80 border border-blue-900/60 rounded-lg p-2 text-[10px] text-slate-400 space-y-1">
                          <div className="font-mono text-blue-300 font-bold flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-blue-400" />
                            <span>{lang === 'vi' ? 'Trích Dẫn Tiêu Chuẩn Quốc Tế:' : 'Global Standard Citations:'}</span>
                          </div>
                          <ul className="list-disc pl-3.5 space-y-0.5 text-slate-300">
                            {msg.advisorData.citations.map((c, idx) => (
                              <li key={idx} className="font-mono text-[9px]">{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Field Installation Tips */}
                      {msg.advisorData?.fieldTipsVi && (
                        <div className="bg-amber-950/20 border border-amber-600/30 rounded-lg p-2 text-[10px] text-amber-200/90 flex items-start gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{lang === 'vi' ? msg.advisorData.fieldTipsVi : msg.advisorData.fieldTipsEn}</span>
                        </div>
                      )}

                      <div className={`text-[9px] font-mono mt-1 ${msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-500'}`}>
                        {msg.time}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 items-center text-slate-400 text-xs italic font-mono animate-pulse">
                    <Bot className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'vi' ? 'Kỹ sư AI đang tra cứu tiêu chuẩn & tổng hợp tư vấn...' : 'AI Engineer analyzing standards & product database...'}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      lang === 'vi'
                        ? 'Hỏi về sản phẩm, tính năng, hoặc tư vấn chọn van...'
                        : 'Ask about valve features, sizing, or applications...'
                    }
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-40 transition-all shadow"
                    aria-label="Gửi tin nhắn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLORE PRODUCTS ON THE PAGE (Tìm hiểu sản phẩm trong trang) */}
          {activeTab === 'explore' && (
            <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3 overflow-hidden bg-slate-950">
              {/* Category Filter Pills & Search */}
              <div className="space-y-2 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder={lang === 'vi' ? 'Tìm theo tên, model (Fig), vật liệu, môi chất...' : 'Search by name, model, material, media...'}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  {catalogSearch && (
                    <button
                      type="button"
                      onClick={() => setCatalogSearch('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'vi' ? 'Tất cả' : 'All'} ({valves.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.category}
                      type="button"
                      onClick={() => setSelectedCategory(c.category)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-colors ${
                        selectedCategory === c.category
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.label} ({c.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {filteredValves.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs font-mono">
                    {lang === 'vi' ? 'Không tìm thấy van phù hợp với từ khóa.' : 'No valves matched your filter.'}
                  </div>
                ) : (
                  filteredValves.map((v) => (
                    <div
                      key={v.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {v.image && (
                          <img
                            src={resolveProductImageUrl(v.image)}
                            alt={v.name}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-amber-400 text-xs">
                              {v.code}
                            </span>
                            <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700">
                              {v.pressure}
                            </span>
                            <span className="text-[9px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800">
                              {v.sizeRange}
                            </span>
                          </div>
                          <h4 className="text-white text-xs font-bold line-clamp-1 mt-0.5">
                            {lang === 'vi' ? v.name : (v.nameEn || v.name)}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {v.material}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 justify-end">
                        <button
                          type="button"
                          onClick={() => handleRequestFeatures(v)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-mono flex items-center gap-1 border border-slate-700"
                          title="Hỏi kỹ sư giới thiệu tính năng chi tiết"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{lang === 'vi' ? 'Tính năng' : 'Features'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInspectValve(v)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center gap-1 shadow"
                          title="Mở mô hình 3D và thông số kỹ thuật"
                        >
                          <Box className="w-3 h-3 text-white" />
                          <span>{lang === 'vi' ? '3D Spec' : '3D Spec'}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP VALVE SIZING & SELECTION ADVISOR (Tư vấn chọn van cho khách hàng) */}
          {activeTab === 'advisor' && (
            <div className="flex-1 flex flex-col min-h-0 p-4 space-y-3.5 overflow-y-auto scrollbar-thin bg-slate-950">
              <div className="bg-gradient-to-r from-blue-950/60 to-emerald-950/40 p-3 rounded-xl border border-blue-800/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'vi' ? 'Bộ Tư Vấn Kỹ Thuật Chọn Van Nhanh' : 'Quick Valve Engineering Selector'}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {lang === 'vi' 
                    ? 'Nhập các thông số dự án dưới đây để Kỹ sư AI tính toán và đề xuất model van UTD tối ưu nhất kèm hệ số lưu lượng Kv.'
                    : 'Input process conditions below for the AI Engineer to synthesize the optimal UTD valve model and flow sizing.'}
                </p>
              </div>

              {/* Step 1: Fluid Media */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-amber-300 font-mono flex items-center gap-1">
                  <span>1. {lang === 'vi' ? 'Môi chất / Hệ thống đường ống:' : 'Fluid Media / Piping Loop:'}</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {[
                    'Nước lạnh Chiller HVAC',
                    'Hơi nóng Lò hơi (>200°C)',
                    'PCCC Cứu Hỏa Sprinkler',
                    'Hóa chất & Axit ăn mòn',
                    'Bùn khoáng, rác, nước thải',
                    'Nước cấp đô thị & đầu bơm'
                  ].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWizardMedia(m)}
                      className={`p-2 rounded-lg text-left text-[10px] font-medium border transition-all ${
                        wizardMedia === m
                          ? 'bg-blue-600/30 text-white border-blue-400 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Pressure & Temperature */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-amber-300 font-mono">
                    2. {lang === 'vi' ? 'Cấp áp suất PN:' : 'Pressure Class:'}
                  </label>
                  <select
                    value={wizardPressure}
                    onChange={(e) => setWizardPressure(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="PN10">PN10 (10 Bar / 1.0 MPa)</option>
                    <option value="PN16">PN16 (16 Bar / 1.6 MPa)</option>
                    <option value="PN25">PN25 (25 Bar / 2.5 MPa)</option>
                    <option value="PN40">PN40 (40 Bar / 4.0 MPa)</option>
                    <option value="Class 150">ANSI Class 150 (20 Bar)</option>
                    <option value="Class 300">ANSI Class 300 (50 Bar)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-amber-300 font-mono">
                    3. {lang === 'vi' ? 'Nhiệt độ làm việc:' : 'Temperature:'}
                  </label>
                  <select
                    value={wizardTemp}
                    onChange={(e) => setWizardTemp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="0°C - 80°C">0°C - 80°C (Nước lạnh / Nước thường)</option>
                    <option value="-20°C - 120°C">-20°C - 120°C (Đệm EPDM)</option>
                    <option value="-20°C - 200°C">-20°C - 200°C (Đệm PTFE/PPL)</option>
                    <option value="200°C - 425°C">200°C - 425°C (Hơi nóng / Metal Seat)</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Size & Function */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-amber-300 font-mono">
                    4. {lang === 'vi' ? 'Cỡ ống DN:' : 'Pipe Size DN:'}
                  </label>
                  <select
                    value={wizardDn}
                    onChange={(e) => setWizardDn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="DN25 (1&quot;)">DN25 (1")</option>
                    <option value="DN50 (2&quot;)">DN50 (2")</option>
                    <option value="DN80 (3&quot;)">DN80 (3")</option>
                    <option value="DN100 (4&quot;)">DN100 (4")</option>
                    <option value="DN150 (6&quot;)">DN150 (6")</option>
                    <option value="DN200 (8&quot;)">DN200 (8")</option>
                    <option value="DN300 (12&quot;)">DN300 (12")</option>
                    <option value="DN400 (16&quot;)">DN400 (16")</option>
                    <option value="DN600 (24&quot;)">DN600 (24")</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-amber-300 font-mono">
                    5. {lang === 'vi' ? 'Mục đích vận hành:' : 'Operation Mode:'}
                  </label>
                  <select
                    value={wizardFunction}
                    onChange={(e) => setWizardFunction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  >
                    <option value="Đóng/ngắt On-Off">Đóng/ngắt On-Off (Cách ly)</option>
                    <option value="Điều tiết lưu lượng">Điều tiết lưu lượng (Throttling / Cân bằng)</option>
                    <option value="Chống búa nước & chảy ngược">Chống búa nước & chảy ngược (Van một chiều)</option>
                    <option value="Cắt rác & bùn khoáng">Cắt rác & bùn khoáng (Van cổng dao)</option>
                    <option value="Tự động khí nén / điện">Điều khiển tự động điện/khí nén</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunAdvisorWizard}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all"
                >
                  <Bot className="w-4 h-4 text-emerald-200" />
                  <span>{lang === 'vi' ? 'Nhận Tư Vấn Kỹ Sư UTD Ngay' : 'Generate Engineering Recommendation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Hotline Emergency Bar */}
          <div className="bg-slate-950 px-3 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Hotline Kỹ Thuật 24/7: <strong className="text-white font-mono">0932790928</strong></span>
            </span>
            {onOpenRfq && (
              <button
                type="button"
                onClick={onOpenRfq}
                className="text-amber-400 hover:text-amber-300 font-mono font-bold flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                <span>{lang === 'vi' ? 'Xem Giỏ Báo Giá RFQ' : 'View RFQ Cart'} ({rfqItemIds.length})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
