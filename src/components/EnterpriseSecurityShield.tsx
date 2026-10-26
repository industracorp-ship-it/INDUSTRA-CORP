import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, AlertTriangle, X, Unlock, ShieldCheck, Zap } from 'lucide-react';
import { 
  getEnterpriseSecurityConfig, 
  getEnterpriseSession, 
  getAdminOverrideMode,
  setAdminOverrideMode,
  EnterpriseSecurityConfig 
} from '../utils/enterpriseSecurityEngine';

interface EnterpriseSecurityShieldProps {
  isAdmin?: boolean;
  isAdminOverride?: boolean;
  onToggleAdminOverride?: () => void;
}

export const EnterpriseSecurityShield: React.FC<EnterpriseSecurityShieldProps> = ({ 
  isAdmin = false,
  isAdminOverride,
  onToggleAdminOverride
}) => {
  const [config, setConfig] = useState<EnterpriseSecurityConfig>(getEnterpriseSecurityConfig);
  const [localOverride, setLocalOverride] = useState<boolean>(getAdminOverrideMode);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Sync config & override mode from storage or events
  useEffect(() => {
    const handleStorageChange = () => {
      setConfig(getEnterpriseSecurityConfig());
      setLocalOverride(getAdminOverrideMode());
    };
    const handleOverrideChange = (e: any) => {
      if (e.detail?.active !== undefined) {
        setLocalOverride(e.detail.active);
      } else {
        setLocalOverride(getAdminOverrideMode());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('utd_admin_override_change' as any, handleOverrideChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('utd_admin_override_change' as any, handleOverrideChange);
    };
  }, []);

  const isOverrideActive = isAdminOverride !== undefined ? isAdminOverride : localOverride;

  const handleToggleOverride = () => {
    if (onToggleAdminOverride) {
      onToggleAdminOverride();
    } else {
      const next = !isOverrideActive;
      setAdminOverrideMode(next);
      setLocalOverride(next);
    }
  };

  useEffect(() => {
    // If Anti-Copy Shield is disabled OR Admin Override Mode is active:
    // Toggles OFF the event listeners for 'copy', 'contextmenu', and 'keydown' (F12/Ctrl+U/Ctrl+S/DevTools)
    if (!config.isAntiCopyShieldActive || isOverrideActive) {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      return;
    }

    const triggerWarning = (msg: string) => {
      setAlertMessage(msg);
      // Auto-dismiss after 4s
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    };

    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerWarning(config.antiCopyNoticeVi || 'Thao tác click chuột phải đã bị chặn để bảo vệ bản quyền tài liệu kỹ thuật van UTD!');
    };

    // 2. Block Copy & Cut
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData(
          'text/plain',
          'Tài liệu thuộc bản quyền nội bộ tổ chức UTD IndustraCorp. Nghiêm cấm sao chép dữ liệu dưới mọi hình thức!'
        );
      }
      triggerWarning('Bảo mật nội bộ: Nghiêm cấm sao chép dữ liệu thông số kỹ thuật ra bên ngoài!');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerWarning('Bảo mật nội bộ: Nghiêm cấm cắt hoặc sao chép nội dung dự án!');
    };

    // 3. Block Keyboard Shortcuts (F12, Inspect, View Source, Save, Print)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Phím tắt F12 (Developer Tools) đã bị vô hiệu hóa vì lý do an toàn bảo mật nội bộ!');
        return;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Chức năng kiểm tra phần tử (Inspect Element) đã bị khóa bảo mật!');
        return;
      }

      // Ctrl+Shift+J / Cmd+Option+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Bảng điều khiển Console đã bị vô hiệu hóa!');
        return;
      }

      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element Picker)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Chức năng soi mã nguồn đã bị khóa!');
        return;
      }

      // Ctrl+U / Cmd+Option+U (View Page Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Xem mã nguồn trang (View Source) đã bị vô hiệu hóa hoàn toàn!');
        return;
      }

      // Ctrl+S / Cmd+S (Save Webpage)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('Lưu trang web về máy đã bị chặn bởi chính sách bảo mật!');
        return;
      }

      // Ctrl+P / Cmd+P (Print Webpage)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        e.stopPropagation();
        triggerWarning('In ấn trực tiếp không được phép. Vui lòng sử dụng tính năng xuất RFQ PDF chính thức!');
        return;
      }
    };

    // 4. Prevent Dragging Images
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        e.preventDefault();
        triggerWarning('Không được phép kéo thả hoặc tải ảnh sản phẩm ra ngoài!');
      }
    };

    // Register active event listeners on window and document
    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('copy', handleCopy, { capture: true });
    document.addEventListener('cut', handleCut, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });

    // Enforce CSS user-select none on document body
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      document.removeEventListener('copy', handleCopy, { capture: true });
      document.removeEventListener('cut', handleCut, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [config.isAntiCopyShieldActive, config.antiCopyNoticeVi, isOverrideActive]);

  return (
    <>
      {/* 1. Dynamic Enterprise Watermark (Chống chụp ảnh màn hình tuồn ra ngoài) */}
      {config.isDynamicWatermarkActive && (
        <div 
          className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none opacity-[0.035] flex flex-wrap gap-x-24 gap-y-20 items-center justify-around -rotate-12 transform scale-125"
          aria-hidden="true"
        >
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="text-white font-mono font-black text-xs uppercase tracking-widest whitespace-nowrap">
              {config.organizationName} • BẢO MẬT NỘI BỘ • KHÔNG SAO CHÉP • {config.customDomain}
            </div>
          ))}
        </div>
      )}

      {/* 2. Interactive Anti-Theft Security Toast Notification */}
      {alertMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300">
          <div className="bg-red-950/95 border-2 border-red-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-lg backdrop-blur-xl ring-4 ring-red-500/20">
            <div className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-red-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-red-200 tracking-wider font-mono uppercase">
                  🔒 CẢNH BÁO BẢO MẬT NỘI BỘ
                </span>
                <span className="text-[10px] bg-red-600 px-1.5 py-0.2 rounded font-bold font-mono">
                  ZERO-COPY
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-medium">
                {alertMessage}
              </p>
              {isAdmin && !isOverrideActive && (
                <div className="mt-2 pt-2 border-t border-red-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300">Bạn là Admin? Cần sao chép dữ liệu:</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleOverride();
                      setAlertMessage(null);
                    }}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black rounded-lg shadow flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>Bật Admin Override Mode</span>
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setAlertMessage(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Floating Admin Override Active Indicator & Quick Control */}
      {isOverrideActive && (
        <div className="fixed bottom-5 right-5 z-40 bg-slate-900/95 border-2 border-emerald-500/80 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs ring-4 ring-emerald-500/20 animate-fade-in font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex flex-col">
            <span className="font-black text-emerald-300 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              ADMIN OVERRIDE: BẬT
            </span>
            <span className="text-[10px] text-slate-300">
              Đã gỡ chặn Copy, F12 & Chuột phải
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleOverride}
            className="ml-2 px-2.5 py-1 bg-red-600/80 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-all shadow cursor-pointer"
            title="Tắt Admin Override và bật lại bảo mật chống sao chép"
          >
            Khóa Lại
          </button>
        </div>
      )}
    </>
  );
};
