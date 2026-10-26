import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  ShieldAlert,
  ArrowRight,
  Globe,
  Zap,
  X
} from 'lucide-react';
import { 
  getEnterpriseSecurityConfig, 
  authenticateWithCorporateEmail, 
  authenticateWithPasscode,
  bypassEnterpriseLogin,
  EnterpriseSecurityConfig 
} from '../utils/enterpriseSecurityEngine';
import { SupportedLanguage } from '../types/valve';
import { IndustraLogo } from './IndustraLogo';

interface EnterpriseGatekeeperModalProps {
  isOpen: boolean;
  onAuthenticated: () => void;
  onOpenAdminLogin: () => void;
  onClose?: () => void;
  lang: SupportedLanguage;
}

export const EnterpriseGatekeeperModal: React.FC<EnterpriseGatekeeperModalProps> = ({
  isOpen,
  onAuthenticated,
  onOpenAdminLogin,
  onClose,
  lang,
}) => {
  const [authMethod, setAuthMethod] = useState<'email' | 'passcode'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const config: EnterpriseSecurityConfig = getEnterpriseSecurityConfig();

  const handleBypass = () => {
    bypassEnterpriseLogin();
    setSuccessMessage(
      lang === 'vi' 
        ? '✓ Đã kích hoạt chế độ Bỏ Qua Đăng Nhập! Đang mở quyền truy cập hệ thống...' 
        : '✓ Login bypassed successfully! Accessing portal...'
    );
    setTimeout(() => {
      onAuthenticated();
      if (onClose) onClose();
    }, 450);
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsVerifying(true);

    setTimeout(() => {
      const res = authenticateWithCorporateEmail(emailInput);
      setIsVerifying(false);
      if (res.success) {
        setSuccessMessage(lang === 'vi' ? res.messageVi : res.messageEn);
        setTimeout(() => {
          onAuthenticated();
        }, 800);
      } else {
        setErrorMessage(lang === 'vi' ? res.messageVi : res.messageEn);
      }
    }, 400);
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsVerifying(true);

    setTimeout(() => {
      const res = authenticateWithPasscode(passcodeInput);
      setIsVerifying(false);
      if (res.success) {
        setSuccessMessage(lang === 'vi' ? res.messageVi : res.messageEn);
        setTimeout(() => {
          onAuthenticated();
        }, 800);
      } else {
        setErrorMessage(lang === 'vi' ? res.messageVi : res.messageEn);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-slate-900 border-2 border-red-500/60 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 space-y-6 ring-8 ring-red-950/40"
      >
        {/* Top-Right Quick Close / Bypass Button */}
        <button
          type="button"
          onClick={handleBypass}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer z-10"
          title={lang === 'vi' ? 'Bỏ qua đăng nhập và đóng cửa sổ' : 'Skip login and close'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="text-center space-y-3">
          <IndustraLogo size="md" className="mb-3" />
          <div className="inline-flex items-center justify-center p-3.5 bg-red-950/80 rounded-2xl border border-red-500/60 shadow-xl shadow-red-950/50">
            <Lock className="w-8 h-8 text-red-400 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold bg-red-900/60 text-red-300 px-2.5 py-0.5 rounded-full border border-red-500/50">
                STRICT ENTERPRISE GATEWAY
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                HTTPS SSL PROTECTED
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {lang === 'vi' ? 'CỔNG XÁC THỰC BẢO MẬT NỘI BỘ DOANH NGHIỆP' : 'PRIVATE ENTERPRISE ACCESS GATEWAY'}
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {lang === 'vi' 
                ? 'Dự án đã được cấu hình bảo mật tên miền riêng. Toàn bộ thông số kỹ thuật, catalogue và chính sách van UTD được bảo vệ nghiêm ngặt. Người ngoài tổ chức không được phép truy cập hoặc sao chép dưới mọi hình thức.'
                : 'This project is restricted to verified organization members. Public indexing and external access are strictly disabled.'}
            </p>
          </div>
        </div>

        {/* Organization Information Badge */}
        <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-bold font-mono">
              {config.organizationName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <Globe className="w-3.5 h-3.5" />
            <span>{config.customDomain}</span>
          </div>
        </div>

        {/* Authentication Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('email');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authMethod === 'email'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '1. Email Doanh Nghiệp' : '1. Corporate Email'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('passcode');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authMethod === 'passcode'
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '2. Mã Khóa Nội Bộ' : '2. Enterprise Passcode'}</span>
          </button>
        </div>

        {/* Verification Forms */}
        {authMethod === 'email' ? (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold text-xs uppercase font-mono mb-1.5">
                {lang === 'vi' ? 'Nhập địa chỉ Email nội bộ của tổ chức:' : 'Enter internal organization email:'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="VD: nguyen.van.a@industracorp.com"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 font-medium"
                />
                <span className="absolute right-3 top-3 text-[10px] font-mono text-slate-500">
                  Domain: @industracorp.com
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {lang === 'vi' 
                  ? `Chấp nhận các email có đuôi: ${config.authorizedDomains.map(d => '@' + d).join(', ')}` 
                  : `Authorized domains: ${config.authorizedDomains.map(d => '@' + d).join(', ')}`}
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 transition-all active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'vi' ? 'Đang thẩm định email...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'XÁC THỰC TRUY CẬP NỘI BỘ' : 'AUTHENTICATE ACCESS'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyPasscode} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-bold text-xs uppercase font-mono mb-1.5">
                {lang === 'vi' ? 'Nhập mã khóa bảo mật nội bộ (Enterprise Passcode):' : 'Enter internal enterprise passcode:'}
              </label>
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                placeholder="Nhập mã khóa (VD: UTD-CORP-2026)"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/20 font-mono tracking-widest text-center text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                {lang === 'vi' 
                  ? 'Mã khóa được cấp bởi Ban Giám Đốc hoặc Quản trị viên hệ thống UTD IndustraCorp.'
                  : 'Passcode provided by system administrator.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-950/60 transition-all active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'vi' ? 'Đang kiểm tra mã khóa...' : 'Validating Passcode...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'vi' ? 'MỞ KHÓA BẰNG PASSCODE' : 'UNLOCK ACCESS'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-red-950/90 border border-red-500 text-red-200 p-3 rounded-xl text-xs flex items-center gap-2.5 animate-shake">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && (
          <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-3 rounded-xl text-xs flex items-center gap-2.5 animate-fade-in font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}



        {/* Footer Admin Shortcut */}
        <div className="border-t border-slate-800 pt-3.5 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span>{lang === 'vi' ? 'Bạn là Quản trị viên?' : 'Are you Admin?'}</span>
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="text-amber-400 hover:underline font-bold font-mono"
            >
              {lang === 'vi' ? 'Đăng nhập Admin →' : 'Admin Login →'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleBypass}
            className="text-slate-400 hover:text-amber-300 underline font-mono text-[11px] cursor-pointer"
          >
            {lang === 'vi' ? 'Bỏ qua đăng nhập' : 'Skip Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
