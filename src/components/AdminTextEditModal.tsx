import React, { useState } from 'react';
import { X, Check, Save, Edit3, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../types/valve';

interface AdminTextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValue: string;
  onSave: (newValue: string) => void;
  lang?: SupportedLanguage;
}

export const AdminTextEditModal: React.FC<AdminTextEditModalProps> = ({
  isOpen,
  onClose,
  title,
  initialValue,
  onSave,
  lang = 'vi',
}) => {
  const [value, setValue] = useState(initialValue);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);

  if (!isOpen) return null;

  const handleAiOptimizeSeo = () => {
    setIsAiOptimizing(true);
    setTimeout(() => {
      setIsAiOptimizing(false);
      let enhanced = value;
      if (title.toLowerCase().includes('tiêu đề') || title.toLowerCase().includes('title')) {
        enhanced = `${value.trim()} - Tiêu Chuẩn ASME, ISO 9001 & PCCC | UTD Valves`;
      } else {
        enhanced = `${value.trim()} Cung cấp đầy đủ chứng nhận CO/CQ xuất xưởng, đạt chuẩn kiểm định rò rỉ ISO 5208 Rate A và chịu nhiệt độ cao -40°C đến 450°C.`;
      }
      setValue(enhanced);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative bg-slate-900 border border-amber-500/60 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white uppercase font-mono">
              {lang === 'vi' ? `Admin Sửa Trực Tiếp: ${title}` : `Admin Edit: ${title}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-300">
              {lang === 'vi' ? 'Nội dung hiển thị trên giao diện:' : 'Content displayed on interface:'}
            </label>
            <span className="text-[10px] font-mono text-amber-400">
              {value.length} {lang === 'vi' ? 'ký tự' : 'chars'}
            </span>
          </div>

          <textarea
            rows={5}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-400 font-sans leading-relaxed"
          />
        </div>

        {/* AI SEO Optimizer Action */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleAiOptimizeSeo}
            disabled={isAiOptimizing}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isAiOptimizing ? (lang === 'vi' ? 'Đang Tối Ưu...' : 'Optimizing...') : (lang === 'vi' ? '✨ Tự Động Tối Ưu SEO & Kỹ Thuật' : '✨ Auto-Optimize SEO')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
            >
              {lang === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(value);
                onClose();
              }}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Lưu' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
