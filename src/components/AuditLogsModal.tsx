import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2, 
  Package, 
  Layers, 
  Sliders, 
  Database, 
  KeyRound, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle2, 
  FileText,
  DollarSign,
  Activity,
  Terminal,
  Calendar
} from 'lucide-react';
import { portalStorage, AuditLogEntry } from '../services/portalStorage';
import { SupportedLanguage } from '../types/valve';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  onOpenHostingDeploy?: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenHostingDeploy
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const fetchLogs = () => {
    setIsRefreshing(true);
    // Load local storage logs
    const local = portalStorage.getAuditLogs();
    
    // Also try to query server if available
    fetch('/api/admin/audit-logs')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.logs) && data.logs.length > 0) {
          // Merge unique logs
          const combined = [...local];
          data.logs.forEach((srvLog: any) => {
            if (!combined.some(l => l.id === srvLog.id)) {
              combined.push(srvLog);
            }
          });
          // Sort by timestamp desc
          combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setLogs(combined);
        } else {
          setLogs(local);
        }
      })
      .catch(() => {
        setLogs(local);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Category filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'PRODUCT' && log.category !== 'PRODUCT') return false;
        if (selectedCategory === 'PROJECT' && log.category !== 'PROJECT') return false;
        if (selectedCategory === 'SYSTEM_CONFIG' && log.category !== 'SYSTEM_CONFIG') return false;
        if (selectedCategory === 'PRICING' && log.category !== 'PRICING') return false;
        if (selectedCategory === 'AUTH_SECURITY' && log.category !== 'AUTH_SECURITY') return false;
        if (selectedCategory === 'BACKUP_DEPLOY' && log.category !== 'BACKUP_DEPLOY') return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && log.status !== selectedStatus) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inAction = log.action?.toLowerCase().includes(q);
        const inDetails = log.details?.toLowerCase().includes(q);
        const inUser = log.user?.toLowerCase().includes(q);
        const inTarget = log.target?.toLowerCase().includes(q);
        if (!inAction && !inDetails && !inUser && !inTarget) return false;
      }

      return true;
    });
  }, [logs, selectedCategory, selectedStatus, searchQuery]);

  if (!isOpen) return null;

  const stats = {
    total: logs.length,
    product: logs.filter(l => l.category === 'PRODUCT').length,
    project: logs.filter(l => l.category === 'PROJECT').length,
    config: logs.filter(l => l.category === 'SYSTEM_CONFIG').length,
    pricing: logs.filter(l => l.category === 'PRICING').length,
    warn: logs.filter(l => l.status === 'WARN').length
  };

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = 'ID,Thời Gian,Người Thực Hiện,Vai Trò,Phân Loại,Hành Động,Đối Tượng,Chi Tiết Thao Tác,Trạng Thái\n';
    const rows = logs.map(l => {
      const cleanDetails = (l.details || '').replace(/,/g, ';').replace(/\n/g, ' ');
      const cleanTarget = (l.target || '').replace(/,/g, ';');
      return `"${l.id}","${l.timestamp}","${l.user}","${l.role || ''}","${l.category || ''}","${l.action}","${cleanTarget}","${cleanDetails}","${l.status}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `industracorp_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();

    setExportNotice('✓ Đã xuất nhật ký kiểm toán ra file CSV thành công!');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'PRODUCT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-700">📦 SẢN PHẨM</span>;
      case 'PROJECT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700">🏗️ DỰ ÁN</span>;
      case 'SYSTEM_CONFIG':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700">⚙️ CẤU HÌNH</span>;
      case 'PRICING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700">💰 BẢNG GIÁ</span>;
      case 'AUTH_SECURITY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">🔐 BẢO MẬT</span>;
      case 'BACKUP_DEPLOY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">🚀 DEPLOY</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">🏛️ HỆ THỐNG</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl shadow-blue-950/50 overflow-hidden">
        
        {/* ================================================================== */}
        {/* MODAL HEADER */}
        {/* ================================================================== */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border-b border-slate-800 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Trung Tâm Nhật Ký Hoạt Động & Kiểm Toán Hệ Thống (Audit Logs)
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    BẢO MẬT ADMIN • TRUY VẾT THỜI GIAN THỰC
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Ghi nhận toàn bộ thao tác quản trị trên portal: chỉnh sửa dữ liệu sản phẩm, xóa dự án showcase, 
                  cập nhật cấu hình hệ thống (AI & Security), biến động giá vật liệu thô và nhật ký triển khai hosting.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onOpenHostingDeploy && (
                <button
                  type="button"
                  onClick={onOpenHostingDeploy}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/40 border border-blue-400 transition-all cursor-pointer animate-pulse shrink-0"
                  title="Upload và đồng bộ trang web & toàn bộ dữ liệu mới lên Hosting Server (103.75.184.20)"
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

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Tổng Bản Ghi</span>
              <span className="text-base font-bold text-white mt-0.5 block">{stats.total}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-center">
              <span className="text-[10px] text-blue-300 block uppercase font-bold">Thay Đổi SP</span>
              <span className="text-base font-bold text-blue-400 mt-0.5 block">{stats.product}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-center">
              <span className="text-[10px] text-rose-300 block uppercase font-bold">Xóa/Sửa Dự Án</span>
              <span className="text-base font-bold text-rose-400 mt-0.5 block">{stats.project}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/50 text-center">
              <span className="text-[10px] text-purple-300 block uppercase font-bold">Cấu Hình Portal</span>
              <span className="text-base font-bold text-purple-400 mt-0.5 block">{stats.config}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-center">
              <span className="text-[10px] text-amber-300 block uppercase font-bold">Bảng Giá & VL</span>
              <span className="text-base font-bold text-amber-400 mt-0.5 block">{stats.pricing}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-[10px] text-amber-400 block uppercase font-bold">Cảnh Báo (Warn)</span>
              <span className="text-base font-bold text-amber-300 mt-0.5 block">{stats.warn}</span>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* FILTER & SEARCH TOOLBAR */}
        {/* ================================================================== */}
        <div className="bg-slate-950/70 border-b border-slate-800 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo mã SKU, tên dự án, người thực hiện, chi tiết..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tất cả phân loại</option>
              <option value="PRODUCT">📦 Dữ liệu Sản phẩm</option>
              <option value="PROJECT">🏗️ Xóa/Sửa Dự án</option>
              <option value="SYSTEM_CONFIG">⚙️ Cấu hình Hệ thống</option>
              <option value="PRICING">💰 Bảng giá & Vật liệu</option>
              <option value="AUTH_SECURITY">🔐 Bảo mật & Phân quyền</option>
              <option value="BACKUP_DEPLOY">🚀 Deploy & Sao lưu</option>
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="SUCCESS">✓ Thành công (SUCCESS)</option>
              <option value="WARN">⚠️ Cảnh báo (WARN)</option>
              <option value="DENIED">⛔ Từ chối (DENIED)</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchLogs}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-all"
              title="Làm mới dữ liệu từ server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
              title="Xuất file CSV báo cáo kiểm toán"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>
          </div>
        </div>

        {/* Notice Toast */}
        {exportNotice && (
          <div className="bg-emerald-950/90 border-b border-emerald-600/80 px-5 py-2 text-xs text-emerald-200 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* ================================================================== */}
        {/* AUDIT LOGS TABLE */}
        {/* ================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {filteredLogs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
              <Clock className="w-12 h-12 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-400">Không tìm thấy bản ghi nhật ký phù hợp bộ lọc.</p>
              <p className="text-xs text-slate-500 mt-1">Hãy thử xóa từ khóa tìm kiếm hoặc chọn "Tất cả phân loại".</p>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Thời Gian & Người Thực Hiện</th>
                    <th className="py-3 px-3">Phân Loại</th>
                    <th className="py-3 px-3">Hành Động (Action)</th>
                    <th className="py-3 px-4">Đối Tượng Tác Động</th>
                    <th className="py-3 px-4">Chi Tiết Thao Tác (Audit Details)</th>
                    <th className="py-3 px-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.map((log) => {
                    const date = new Date(log.timestamp);
                    const timeStr = date.toLocaleTimeString('vi-VN');
                    const dateStr = date.toLocaleDateString('vi-VN');

                    return (
                      <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                        {/* Time & User */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{timeStr}</span>
                            <span className="text-slate-500 text-[10px]">({dateStr})</span>
                          </div>
                          <div className="text-[11px] text-slate-300 font-sans mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span>{log.user}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {getCategoryBadge(log.category)}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-3 whitespace-nowrap font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            log.action?.includes('DELETE') ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            log.action?.includes('PRICE') ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            log.action?.includes('UPDATE') ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                            'bg-slate-800 text-slate-200'
                          }`}>
                            {log.action}
                          </span>
                        </td>

                        {/* Target */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200 text-xs max-w-[200px] truncate" title={log.target}>
                            {log.target || 'Toàn Portal'}
                          </div>
                        </td>

                        {/* Details */}
                        <td className="py-3 px-4">
                          <p className="text-slate-300 text-xs leading-relaxed max-w-md">
                            {log.details}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' :
                            log.status === 'DENIED' ? 'bg-rose-950 text-rose-400 border border-rose-700' :
                            'bg-amber-950 text-amber-400 border border-amber-700'
                          }`}>
                            {log.status === 'SUCCESS' ? '✓ THÀNH CÔNG' : log.status === 'DENIED' ? '⛔ TỪ CHỐI' : '⚠️ CẢNH BÁO'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ================================================================== */}
        {/* MODAL FOOTER */}
        {/* ================================================================== */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Đang ghi nhận: Độc lập giữa LocalStorage máy trạm và Server Database (/api/admin/audit-logs)</span>
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
