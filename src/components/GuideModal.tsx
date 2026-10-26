import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Github, 
  Cloud, 
  Mail, 
  FileSpreadsheet, 
  Terminal, 
  FolderArchive, 
  HelpCircle 
} from 'lucide-react';
import { SupportedLanguage } from '../types/valve';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, lang }) => {
  const [activeTab, setActiveTab] = useState<'deploy' | 'formspree' | 'sheets'>('deploy');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const formspreeCodeSnippet = `// 1. Đăng ký tài khoản miễn phí tại https://formspree.io
// 2. Tạo New Form, đặt tên "Báo Giá Van UTD", bạn sẽ nhận được 1 Form ID (VD: "xpznqwer")
// 3. Cập nhật action trong form RfqForm.tsx:

const handleSubmitWithFormspree = async (e) => {
  e.preventDefault();
  const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      company: formData.companyName,
      taxCode: formData.taxCode,
      contact: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      project: formData.projectName,
      valves: rfqItems.map(item => \`\${item.valve.code} - \${item.selectedDn} (SL: \${item.quantity})\`).join(', '),
      notes: formData.notes
    })
  });
  if (response.ok) {
    alert("Dữ liệu báo giá đã tự động chuyển thẳng về Email của bạn!");
  }
};`;

  const googleSheetsSnippet = `// Cách tự động lưu vào Google Sheets bằng Google Apps Script miễn phí:
// Bước 1: Mở Google Sheet mới -> Tiện ích mở rộng (Extensions) -> Apps Script
// Bước 2: Dán đoạn mã này vào Apps Script:

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.company,
    data.taxCode,
    data.contact,
    data.phone,
    data.email,
    data.project,
    data.valves,
    data.notes
  ]);
  return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Bước 3: Bấm Deploy (Triển khai) -> New Deployment -> Chọn Web app
// Ở mục "Who has access", chọn "Anyone" (Bất kỳ ai).
// Copy URL nhận được và fetch POST từ ứng dụng web!`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-600 flex items-center justify-center text-blue-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {lang === 'vi' ? 'Hướng Dẫn Triển Khai (Deploy) & Tích Hợp Tự Động' : 'Deployment & Automation Integration Guide'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'vi' ? 'Dành cho người mới bắt đầu - Từng bước cực kỳ đơn giản & hoàn toàn miễn phí' : 'Step-by-step simple instructions for production deployment'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/50">
          <button
            type="button"
            onClick={() => setActiveTab('deploy')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'deploy'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>{lang === 'vi' ? '1. Deploy Vercel / Netlify Miễn Phí' : '1. Free Vercel / Netlify Deployment'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('formspree')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'formspree'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{lang === 'vi' ? '2. Nhận RFQ về Email (Formspree)' : '2. Receive RFQs via Email (Formspree)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sheets'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{lang === 'vi' ? '3. Tự Động Lưu Vào Google Sheets' : '3. Auto-Sync to Google Sheets'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {activeTab === 'deploy' && (
            <div className="space-y-6">
              <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-xl text-blue-200">
                <h4 className="font-bold text-sm text-white flex items-center gap-2 mb-1">
                  <Cloud className="w-4 h-4 text-amber-400" />
                  Bạn có 2 cách đơn giản nhất để đưa trang web lên mạng Internet:
                </h4>
                <p className="text-slate-300 text-xs">
                  Cả Vercel và Netlify đều có gói Free trọn đời, hỗ trợ chứng chỉ bảo mật HTTPS (ổ khóa xanh) và tên miền miễn phí dạng <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">ten-cong-ty.vercel.app</code>.
                </p>
              </div>

              {/* Method A: Github -> Vercel (Khuyên dùng) */}
              <div className="border border-slate-800 rounded-xl p-5 bg-slate-950">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm mb-3">
                  <Github className="w-4 h-4 text-amber-400" />
                  <span>Cách 1: Đẩy mã nguồn lên GitHub rồi kết nối Vercel (Tốt nhất)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    Tạo tài khoản tại <a href="https://github.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">github.com</a> và tạo một kho lưu trữ mới (Repository) tên <code className="text-amber-300 font-mono">van-cong-nghiep-utd</code>.
                  </li>
                  <li>
                    Tại thư mục dự án trên máy tính của bạn, mở terminal/cmd và chạy 3 lệnh sau:
                    <div className="bg-slate-900 rounded p-2.5 my-1.5 font-mono text-[11px] text-amber-300 border border-slate-800">
                      git init<br />
                      git add .<br />
                      git commit -m "Khoi tao website Van UTD"<br />
                      git branch -M main<br />
                      git remote add origin https://github.com/TÊN_GITHUB_CỦA_BẠN/van-cong-nghiep-utd.git<br />
                      git push -u origin main
                    </div>
                  </li>
                  <li>
                    Vào <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-400 underline">vercel.com</a>, đăng nhập bằng GitHub và bấm <strong>"Add New Project"</strong>.
                  </li>
                  <li>
                    Chọn kho <code className="text-amber-300">van-cong-nghiep-utd</code> vừa tạo và bấm <strong>"Deploy"</strong>. Sau 1 phút trang web sẽ online toàn cầu!
                  </li>
                </ol>
              </div>

              {/* Method B: Netlify Drag & Drop (Dành cho người không biết code) */}
              <div className="border border-slate-800 rounded-xl p-5 bg-slate-950">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm mb-3">
                  <FolderArchive className="w-4 h-4 text-emerald-400" />
                  <span>Cách 2: Kéo thả trực tiếp không cần GitHub (Netlify Drop)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    Chạy lệnh <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300 font-mono">npm run build</code> trong máy bạn. Lệnh này sẽ tạo ra một thư mục tên là <strong>dist</strong> (hoặc build).
                  </li>
                  <li>
                    Truy cập trang <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-blue-400 underline">app.netlify.com/drop</a>.
                  </li>
                  <li>
                    Nắm kéo cả thư mục <strong>dist</strong> thả vào vòng tròn trên trang web Netlify.
                  </li>
                  <li>
                    Xong! Trang web của bạn lập tức hoạt động ngay và có link chia sẻ cho khách hàng.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'formspree' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-sky-400" />
                  Tích hợp Formspree miễn phí (50 lượt báo giá/tháng miễn phí)
                </h4>
                <p className="text-slate-300 mb-3">
                  Khách hàng gửi báo giá trên web, thông tin Tên công ty, MST, Danh sách van cần mua sẽ gửi trực tiếp vào hộp thư email (Gmail/Outlook) của bạn mà không cần phải viết server backend!
                </p>

                <div className="relative">
                  <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-200 overflow-x-auto">
                    {formspreeCodeSnippet}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formspreeCodeSnippet, 'formspree')}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-400 border border-slate-700 flex items-center gap-1 text-[10px]"
                  >
                    {copiedCode === 'formspree' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Tự Động Lưu RFQ Vào Google Sheets Bằng Google Apps Script
                </h4>
                <p className="text-slate-300 mb-3">
                  Mỗi khi có kỹ sư hoặc nhà thầu gửi báo giá, dữ liệu sẽ tự động thêm 1 dòng vào file Google Sheets của phòng kinh doanh UTD để theo dõi và chia việc cho sales.
                </p>

                <div className="relative">
                  <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-200 overflow-x-auto">
                    {googleSheetsSnippet}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(googleSheetsSnippet, 'sheets')}
                    className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-amber-400 border border-slate-700 flex items-center gap-1 text-[10px]"
                  >
                    {copiedCode === 'sheets' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Hỗ trợ kỹ thuật: info@industracorp.com
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold"
          >
            Đóng Hướng Dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
