import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Send, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  Key, 
  Hash, 
  HelpCircle, 
  ExternalLink, 
  Clock, 
  Trash2, 
  Sliders, 
  Check, 
  Layers,
  Zap,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { 
  notificationService, 
  NotificationConfig, 
  NotificationLog 
} from '../services/notificationService';
import { SupportedLanguage } from '../types/valve';

interface AdminNotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const AdminNotificationSettingsModal: React.FC<AdminNotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'logs' | 'guide'>('config');
  const [config, setConfig] = useState<NotificationConfig>(notificationService.getConfig());
  const [logs, setLogs] = useState<NotificationLog[]>(notificationService.getLogs());
  const [recipientInput, setRecipientInput] = useState<string>(config.recipients.join(', '));
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentConf = notificationService.getConfig();
      setConfig(currentConf);
      setRecipientInput(currentConf.recipients.join(', '));
      setLogs(notificationService.getLogs());
      setTestResult(null);
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    const parsedRecipients = recipientInput
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0 && r.includes('@'));

    const updated = notificationService.saveConfig({
      ...config,
      recipients: parsedRecipients.length > 0 ? parsedRecipients : ['info@industracorp.com', 'trong.luu@industracorp.com']
    });

    setConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRunTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await notificationService.sendTestPing();
      setTestResult({
        success: res.success,
        message: res.message || 'Đã phát tín hiệu kiểm tra thành công tới Email & Telegram Bot!'
      });
      setLogs(notificationService.getLogs());
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e.message || 'Lỗi kiểm tra thông báo tự động.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearLogs = () => {
    if (confirm(lang === 'vi' ? 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử thông báo?' : 'Clear all notification logs?')) {
      notificationService.clearLogs();
      setLogs([]);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  {lang === 'vi' ? 'Hệ Thống Thông Báo Tự Động (Email & Telegram)' : 'Automated Admin Alerts (Email & Telegram)'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                  ACTIVE 24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'vi' 
                  ? 'Bắn thông báo tức thì khi có Đăng ký Đại Lý B2B hoặc Báo Giá Khẩn Cấp' 
                  : 'Instant push notifications for new B2B dealers & urgent quotations'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunTestPing}
              disabled={isTesting}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-600 text-sky-300 text-xs font-bold transition-all disabled:opacity-50"
              title="Bắn tin nhắn thử nghiệm kiểm tra kết nối"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTesting ? 'Đang gửi test...' : 'Bắn Test Ngay'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/80 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'config'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Cấu Hình Kênh Truyền' : 'Channel Settings'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'logs'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Nhật Ký Thông Báo' : 'Dispatch Logs'}</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-mono">
                {logs.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'guide'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang === 'vi' ? 'Hướng Dẫn Telegram Bot' : 'Telegram Setup'}</span>
            </button>
          </div>

          {/* Quick status badges */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono">
            <span className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
              config.emailEnabled ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}>
              <Mail className="w-3 h-3" />
              <span>Email: {config.emailEnabled ? 'BẬT' : 'TẮT'}</span>
            </span>
            <span className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
              config.telegramEnabled ? 'bg-sky-950/80 text-sky-400 border-sky-700' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}>
              <MessageSquare className="w-3 h-3" />
              <span>Telegram: {config.telegramEnabled ? 'BẬT' : 'TẮT'}</span>
            </span>
          </div>
        </div>

        {/* Test Result Banner */}
        {testResult && (
          <div className={`mx-6 mt-4 p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            testResult.success 
              ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-200' 
              : 'bg-rose-950/70 border-rose-500/70 text-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
            <button 
              type="button" 
              onClick={() => setTestResult(null)}
              className="text-xs opacity-70 hover:opacity-100 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'config' && (
            <div className="space-y-6">
              {/* Channel 1: Telegram Bot Configuration */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/40 text-sky-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Kênh Telegram Push Notification</span>
                        <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-1.5 py-0.2 rounded font-mono">
                          Tức thì 0.5s
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Bắn tin nhắn trực tiếp vào Telegram cá nhân hoặc Group Ban Giám Đốc Industracorp
                      </p>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.telegramEnabled}
                      onChange={(e) => setConfig({ ...config, telegramEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bot Token Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-sky-400" />
                        <span>Telegram Bot Token:</span>
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setShowToken(!showToken)}
                        className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                      >
                        {showToken ? 'Ẩn token' : 'Hiện token'}
                      </button>
                    </label>
                    <input 
                      type={showToken ? 'text' : 'password'}
                      value={config.telegramBotToken}
                      onChange={(e) => setConfig({ ...config, telegramBotToken: e.target.value })}
                      placeholder="vd: 7123456789:AAHxyzABC1234567890abcdef..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Lấy từ <strong className="text-sky-300">@BotFather</strong> trên Telegram. Để trống sẽ tự động điều phối qua Gateway nội bộ.
                    </p>
                  </div>

                  {/* Chat ID Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-sky-400" />
                      <span>Telegram Chat ID / Group ID:</span>
                    </label>
                    <input 
                      type="text"
                      value={config.telegramChatId}
                      onChange={(e) => setConfig({ ...config, telegramChatId: e.target.value })}
                      placeholder="vd: -1001234567890 hoặc ID người dùng"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      ID nhóm hoặc cá nhân tiếp nhận thông báo (lấy từ bot <strong className="text-sky-300">@userinfobot</strong>).
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-sky-950/30 border border-sky-800/40 rounded-xl text-xs text-sky-200 flex items-center justify-between">
                  <span>
                    📱 <strong>Mẫu tin nhắn Telegram:</strong> Định dạng HTML với icon trực quan, link bấm gọi hotline khách hàng và nút duyệt hồ sơ nhanh.
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('guide')}
                    className="text-[11px] text-sky-300 font-bold underline hover:text-white shrink-0 ml-2 cursor-pointer"
                  >
                    Xem cách tạo Bot 2 phút →
                  </button>
                </div>
              </div>

              {/* Channel 2: Email Dispatch Configuration */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Kênh Email Tự Động (SMTP Dispatch)</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                          Hồ sơ chi tiết
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Gửi email tự động kèm danh mục van chi tiết, thông tin MST và link kích hoạt
                      </p>
                    </div>
                  </div>

                  {/* Toggle switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={config.emailEnabled}
                      onChange={(e) => setConfig({ ...config, emailEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Email Quản Trị Viên Tiếp Nhận (phân tách bằng dấu phẩy):
                  </label>
                  <input 
                    type="text"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    placeholder="info@industracorp.com, trong.luu@industracorp.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-400">Gợi ý nhanh:</span>
                    <button
                      type="button"
                      onClick={() => setRecipientInput('info@industracorp.com, trong.luu@industracorp.com')}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                    >
                      + Ban Giám Đốc Mặc Định
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecipientInput(prev => `${prev}${prev ? ', ' : ''}kythuat@industracorp.com`)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                    >
                      + Phòng Kỹ Thuật
                    </button>
                  </div>
                </div>
              </div>

              {/* Event Trigger Matrix */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Ma Trận Sự Kiện Kích Hoạt Bắn Thông Báo Tự Động</span>
                </h4>

                <div className="space-y-3">
                  {/* Event 1 */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                    <input 
                      type="checkbox"
                      checked={config.notifyOnB2BRegistration}
                      onChange={(e) => setConfig({ ...config, notifyOnB2BRegistration: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-white">Khách hàng đăng ký Đại Lý B2B Mới</strong>
                        <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 rounded font-mono">
                          ƯU TIÊN CAO
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Bắn Email & Telegram ngay khi khách hàng gửi hồ sơ doanh nghiệp, MST, SĐT và mức chiết khấu kỳ vọng để Admin duyệt cấp quyền xuất PDF.
                      </p>
                    </div>
                  </label>

                  {/* Event 2 */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                    <input 
                      type="checkbox"
                      checked={config.notifyOnUrgentRfq}
                      onChange={(e) => setConfig({ ...config, notifyOnUrgentRfq: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-white">Khách hàng gửi Yêu cầu Báo Giá Khẩn Cấp (RFQ)</strong>
                        <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 rounded font-mono">
                          KHẨN CẤP (24H/48H)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tự động đẩy chi tiết danh mục van công trình, số lượng, quy cách kích cỡ DN và thông tin liên hệ tới Telegram Hotline & Email kỹ thuật.
                      </p>
                    </div>
                  </label>

                  {/* Event 3 */}
                  <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                    <input 
                      type="checkbox"
                      checked={config.notifyOnMaterialAlert}
                      onChange={(e) => setConfig({ ...config, notifyOnMaterialAlert: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs text-white">Biến động giá nguyên vật liệu thô LME vượt ngưỡng 5%</strong>
                        <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 rounded font-mono">
                          THỊ TRƯỜNG KIM LOẠI
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Báo động khi giá thép không gỉ Inox SS304/SS316, đồng hoặc gang biến động mạnh để điều chỉnh bảng giá niêm yết.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Lịch Sử Phát Thông Báo Tự Động</h4>
                  <p className="text-[11px] text-slate-400">
                    Theo dõi toàn bộ các lần phát tín hiệu qua Email và Telegram gần nhất
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLogs(notificationService.getLogs())}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1"
                    title="Làm mới danh sách"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Làm mới</span>
                  </button>

                  {logs.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearLogs}
                      className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa Lịch Sử</span>
                    </button>
                  )}
                </div>
              </div>

              {logs.length === 0 ? (
                <div className="p-12 text-center bg-slate-950 rounded-2xl border border-slate-800">
                  <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Chưa có lịch sử thông báo nào được ghi nhận.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            log.type === 'B2B_REGISTRATION' ? 'bg-purple-950 text-purple-300 border border-purple-700' :
                            log.type === 'URGENT_RFQ' ? 'bg-rose-950 text-rose-300 border border-rose-700' :
                            'bg-sky-950 text-sky-300 border border-sky-700'
                          }`}>
                            {log.type === 'B2B_REGISTRATION' ? 'ĐẠI LÝ B2B' :
                             log.type === 'URGENT_RFQ' ? 'RFQ KHẨN CẤP' : 'HỆ THỐNG'}
                          </span>

                          <strong className="text-white font-medium">{log.title}</strong>
                        </div>

                        <p className="text-slate-400 text-[11px]">{log.details}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {log.recipientSummary} • {new Date(log.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1">
                          {log.channels.includes('email') && (
                            <span className="p-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800" title="Đã gửi Email">
                              <Mail className="w-3 h-3" />
                            </span>
                          )}
                          {log.channels.includes('telegram') && (
                            <span className="p-1 rounded bg-sky-950 text-sky-400 border border-sky-800" title="Đã gửi Telegram">
                              <MessageSquare className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-700">
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <span>Hướng Dẫn 2 Bước Kết Nối Telegram Bot Độc Lập</span>
                </h4>

                <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <strong className="text-sky-400 font-bold block text-sm">
                      Bước 1: Tạo Bot và lấy Bot Token
                    </strong>
                    <p>1. Mở ứng dụng Telegram, tìm kiếm bot chính thức: <strong className="text-white">@BotFather</strong></p>
                    <p>2. Gửi lệnh: <code className="bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded font-mono">/newbot</code></p>
                    <p>3. Đặt tên hiển thị (vd: <em>Industracorp Alert Bot</em>) và username (vd: <em>industracorp_alert_bot</em> kết thúc bằng chữ "bot")</p>
                    <p>4. BotFather sẽ trả về chuỗi <strong>HTTP API Token</strong> (dạng <code>7123456789:AAH...</code>). Quý khách dán chuỗi này vào ô <strong>Telegram Bot Token</strong>.</p>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <strong className="text-sky-400 font-bold block text-sm">
                      Bước 2: Lấy Chat ID của Admin hoặc Nhóm Quản Trị
                    </strong>
                    <p>• <strong>Nếu gửi cho cá nhân:</strong> Tìm bot <strong className="text-white">@userinfobot</strong> trên Telegram và bấm Start, bot sẽ trả về số <code>Id</code> của quý khách (vd: <code>123456789</code>).</p>
                    <p>• <strong>Nếu gửi vào nhóm Ban Giám Đốc:</strong> Thêm bot vừa tạo vào nhóm Telegram, cấp quyền gửi tin nhắn, sau đó thêm bot <strong className="text-white">@RawDataBot</strong> vào nhóm để lấy ID nhóm (thường bắt đầu bằng dấu trừ, vd: <code>-1001987654321</code>).</p>
                  </div>

                  <div className="p-3.5 bg-emerald-950/40 border border-emerald-700/50 rounded-xl text-emerald-200">
                    💡 <strong>Chế độ mặc định sẵn sàng:</strong> Ngay cả khi chưa nhập Token riêng, hệ thống tự động ghi nhận và chuyển tiếp thông báo theo cơ chế an toàn, ghi nhận đầy đủ vào Nhật Ký Thông Báo và Audit Log của Portal.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunTestPing}
              disabled={isTesting}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTesting ? 'Đang gửi test...' : 'Gửi Thử Nghiệm'}</span>
            </button>

            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Đã lưu thành công!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
