import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  FileText 
} from 'lucide-react';
import { SupportedLanguage } from '../types/valve';

interface CatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const CatalogueModal: React.FC<CatalogueModalProps> = ({ isOpen, onClose, lang }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">
              {lang === 'vi' ? 'Tải Catalogue Van Công Nghiệp UTD' : 'Download UTD Valves Catalogue'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Catalogue Info Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">{lang === 'vi' ? 'Ấn bản:' : 'Edition:'}</span>
            <span className="text-amber-400 font-bold">UTD Comprehensive Catalog 2026</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">{lang === 'vi' ? 'Định dạng file:' : 'Format:'}</span>
            <span className="text-slate-200">High-Resolution PDF (25.4 MB)</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">{lang === 'vi' ? 'Số trang:' : 'Pages:'}</span>
            <span className="text-slate-200">{lang === 'vi' ? '148 Trang thông số kỹ thuật đầy đủ' : '148 Comprehensive Technical Pages'}</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-slate-400">{lang === 'vi' ? 'Chứng nhận đính kèm:' : 'Certifications:'}</span>
            <span className="text-emerald-400 font-semibold">ISO 9001, ASME, API 6D</span>
          </div>
        </div>

        {/* Table of contents snippet */}
        <div className="space-y-1.5 text-xs text-slate-300">
          <span className="font-bold text-slate-400 uppercase text-[11px] block">
            {lang === 'vi' ? 'Nội dung chính trong Catalogue:' : 'Catalogue Contents Overview:'}
          </span>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            {lang === 'vi' ? 'Phần 1: Van bi Inox 304, 316, nối ren & bích (DN15 - DN250)' : 'Part 1: SS304/316 Ball Valves (DN15 - DN250)'}
          </p>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            {lang === 'vi' ? 'Phần 2: Van bướm tay gạt, tay quay, điều khiển khí nén (DN50 - DN1000)' : 'Part 2: Wafer/Lug Butterfly Valves (DN50 - DN1000)'}
          </p>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            {lang === 'vi' ? 'Phần 3: Van cổng ty nổi, ty chìm thép đúc WCB & gang cầu (DN50 - DN600)' : 'Part 3: OS&Y Gate Valves WCB/Ductile Iron (DN50 - DN600)'}
          </p>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            {lang === 'vi' ? 'Phần 4: Bảng tra kích thước mặt bích JIS, DIN, ANSI & hệ số lưu lượng Cv' : 'Part 4: Flange dimension tables & Cv sizing charts'}
          </p>
        </div>

        {downloadComplete ? (
          <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 p-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'vi' ? 'Tải Catalogue thành công! Kiểm tra thư mục Downloads.' : 'Catalogue downloaded successfully!'}</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {downloading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                {lang === 'vi' ? 'Đang chuẩn bị file PDF...' : 'Preparing PDF file...'}
              </span>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Tải Xuống Ngay (PDF Miễn Phí)' : 'Download Free PDF Catalogue'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
