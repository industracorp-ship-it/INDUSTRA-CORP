import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert,
  Building2, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  Sliders,
  LogOut,
  Edit,
  Trash2,
  Save,
  Check,
  Building,
  Hash,
  MapPin,
  Briefcase,
  Percent,
  Search,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  verifyAdminLogin, 
  verifyMemberLogin, 
  saveAdminPassword, 
  getAdminConfig, 
  getCurrentSession, 
  setCurrentSession, 
  getB2BMembers, 
  saveB2BMembers,
  deleteB2BMember,
  updateB2BMember,
  B2BMember,
  UserSession
} from '../utils/authEngine';
import { SupportedLanguage } from '../types/valve';
import { portalStorage } from '../services/portalStorage';
import { PortalUser, UserRoleType, ProjectCode } from '../types/portal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  onAdminLoginSuccess: () => void;
  onMemberLoginSuccess: (member: B2BMember) => void;
  onLogout: () => void;
  currentUserSession: UserSession | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAdminLoginSuccess,
  onMemberLoginSuccess,
  onLogout,
  currentUserSession
}) => {
  // Navigation tabs:
  // If admin logged in: default to 'manage_employees' or 'manage_b2b'
  // If guest: default to 'admin' (login) or 'member' (login)
  const isAdminLoggedIn = currentUserSession?.userType === 'admin';
  const isMemberLoggedIn = currentUserSession?.userType === 'member';
  const [activeTab, setActiveTab] = useState<'admin' | 'member' | 'manage_employees' | 'manage_b2b' | 'change_password' | 'my_profile'>(
    isAdminLoggedIn ? 'manage_employees' : isMemberLoggedIn ? 'my_profile' : 'admin'
  );
  
  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('trong.luu@industracorp.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);

  // Member Login Form State
  const [memberEmail, setMemberEmail] = useState('');
  const [memberTaxCode, setMemberTaxCode] = useState('');
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberSuccess, setMemberSuccess] = useState<string | null>(null);

  // Change Password State (3-Step & Email Confirmation)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [otpSentMessage, setOtpSentMessage] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);

  // Real-time Lists (Restricted strictly to Super Admin only)
  const [employeesList, setEmployeesList] = useState<PortalUser[]>([]);
  const [b2bList, setB2bList] = useState<B2BMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Add / Edit Employee State
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<PortalUser | null>(null);
  const [employeeFormData, setEmployeeFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    department: 'Ban Giám Đốc',
    role: 'WAREHOUSE_STAFF' as UserRoleType,
    assignedProjects: ['PROJECT_INVENTORY'] as ProjectCode[]
  });

  // Add / Edit B2B Company State
  const [isAddingB2B, setIsAddingB2B] = useState(false);
  const [editingB2B, setEditingB2B] = useState<B2BMember | null>(null);
  const [b2bFormData, setB2bFormData] = useState<Partial<B2BMember>>({
    companyName: '',
    taxCode: '',
    fullName: '',
    email: '',
    phone: '',
    position: 'Trưởng Ban Mua Sắm / Dự Án',
    address: '',
    businessType: 'Tổng thầu EPC / Nhà phân phối van',
    discountRatePercent: 25,
    status: 'approved' as const,
    notes: ''
  });

  // Sync lists on mount or open - STRICT ACCESS CONTROL:
  // ONLY Admin receives employee & B2B data; non-admin members and guests get empty lists.
  useEffect(() => {
    if (isOpen) {
      if (currentUserSession?.userType === 'admin') {
        setEmployeesList(portalStorage.getAvailableUsers());
        setB2bList(getB2BMembers());
        setActiveTab((prev) => 
          prev === 'manage_b2b' || prev === 'change_password' ? prev : 'manage_employees'
        );
      } else if (currentUserSession?.userType === 'member') {
        // Members / staff: Purge sensitive lists completely from state
        setEmployeesList([]);
        setB2bList([]);
        setActiveTab('my_profile');
      } else {
        // Guests / visitors: Purge sensitive lists completely from state
        setEmployeesList([]);
        setB2bList([]);
        setActiveTab((prev) => (prev === 'member' ? 'member' : 'admin'));
      }
    }
  }, [isOpen, currentUserSession]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // --- ADMIN LOGIN ---
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    const res = verifyAdminLogin(adminEmail, adminPassword);
    if (res.success) {
      setAdminSuccess('✓ Đăng nhập Quản Trị Viên thành công! Đang chuyển đến bảng điều khiển quản lý nhân viên và đối tác B2B...');
      onAdminLoginSuccess();
      setEmployeesList(portalStorage.getAvailableUsers());
      setB2bList(getB2BMembers());
      setTimeout(() => {
        setAdminSuccess(null);
        setActiveTab('manage_employees');
      }, 600);
    } else {
      setAdminError(res.message);
    }
  };

  // --- MEMBER LOGIN ---
  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);
    const res = verifyMemberLogin(memberEmail, memberTaxCode);
    if (res.success && res.member) {
      setMemberSuccess(res.message);
      setTimeout(() => {
        setMemberSuccess(null);
        onMemberLoginSuccess(res.member!);
        onClose();
      }, 700);
    } else {
      setMemberError(res.message);
    }
  };

  // --- CHANGE PASSWORD ---
  const handleSendOtp = () => {
    setIsSendingOtp(true);
    setPwError(null);
    const emailToUse = adminEmail || 'trong.luu@industracorp.com';
    const res = portalStorage.requestEmailOtp(emailToUse);
    setIsSendingOtp(false);
    if (res.success) {
      setOtpSentMessage(res.message);
      if (res.otpCode) {
        setEmailOtp(res.otpCode);
      }
    } else {
      setPwError(res.message);
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (newPassword.length < 3) {
      setPwError('Mật khẩu mới phải có tối thiểu 3 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Mật khẩu xác nhận lại không khớp với mật khẩu mới!');
      return;
    }

    if (!emailOtp || emailOtp.trim().length === 0) {
      setPwError('BẢO MẬT: Mật khẩu thay đổi bắt buộc phải được xác minh bằng mã OTP gửi về Email! Vui lòng bấm "Gửi OTP qua Email" bên dưới.');
      return;
    }

    const emailToUse = adminEmail || 'trong.luu@industracorp.com';
    const otpValid = portalStorage.verifyEmailOtp(emailToUse, emailOtp);
    if (!otpValid) {
      setPwError('Mã OTP xác minh từ email không chính xác hoặc đã hết hạn! Vui lòng lấy mã mới.');
      return;
    }

    const saved = saveAdminPassword(newPassword);
    portalStorage.changePassword(emailToUse, oldPassword, newPassword, confirmPassword, emailOtp);
    if (saved) {
      setPwSuccess('✓ Đã xác minh qua Email thành công! Mật khẩu quản trị viên mới đã được lưu an toàn.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setEmailOtp('');
      setOtpSentMessage(null);
      setTimeout(() => setPwSuccess(null), 4000);
    } else {
      setPwError('Không thể lưu mật khẩu. Vui lòng thử lại!');
    }
  };

  // =========================================================================
  // EMPLOYEE MANAGEMENT (CRUD, EDIT NAME, DELETE, ADD - AUTO-SAVE, NO RESTORE)
  // =========================================================================
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFormData.fullName || !employeeFormData.email || !employeeFormData.username) {
      alert('Vui lòng điền đầy đủ Họ tên, Username và Email!');
      return;
    }

    if (editingEmployee) {
      // Edit existing employee
      const updatedUser: PortalUser = {
        ...editingEmployee,
        fullName: employeeFormData.fullName.trim(),
        username: employeeFormData.username.trim(),
        email: employeeFormData.email.trim(),
        phone: employeeFormData.phone.trim() || '0932790928',
        department: employeeFormData.department,
        role: employeeFormData.role,
        roleNameVi: employeeFormData.role === 'SUPER_ADMIN' ? 'Quản Trị Viên Cao Cấp' :
                    employeeFormData.role === 'WAREHOUSE_STAFF' ? 'Thủ Kho' :
                    employeeFormData.role === 'QUOTATION_SPECIALIST' ? 'Chuyên Viên Báo Giá' : 'Chuyên Viên Kế Hoạch',
        assignedProjects: employeeFormData.assignedProjects
      };

      portalStorage.updateUser(updatedUser);
      setEmployeesList(portalStorage.getAvailableUsers());
      setEditingEmployee(null);
      showNotification(`✓ Đã lưu thay đổi thông tin nhân viên "${updatedUser.fullName}" vào hệ thống!`);
    } else {
      // Add new employee
      const res = portalStorage.addUser({
        fullName: employeeFormData.fullName.trim(),
        username: employeeFormData.username.trim(),
        email: employeeFormData.email.trim(),
        role: employeeFormData.role,
        roleNameVi: employeeFormData.role === 'SUPER_ADMIN' ? 'Quản Trị Viên Cao Cấp' :
                    employeeFormData.role === 'WAREHOUSE_STAFF' ? 'Thủ Kho' :
                    employeeFormData.role === 'QUOTATION_SPECIALIST' ? 'Chuyên Viên Báo Giá' : 'Chuyên Viên Kế Hoạch',
        assignedProjects: employeeFormData.assignedProjects
      });

      if (res.success && res.user) {
        setEmployeesList(portalStorage.getAvailableUsers());
        setIsAddingEmployee(false);
        showNotification(res.message);
      } else {
        alert(res.message);
      }
    }
  };

  const handleDeleteEmployee = (userId: string, userName: string) => {
    if (confirm(`CẢNH BÁO XÓA NHÂN SỰ:\nBạn có chắc chắn muốn xóa vĩnh viễn nhân viên "${userName}" khỏi hệ thống?\nHệ thống tự động lưu lại và KHÔNG tự ý khôi phục tài khoản này.`)) {
      const res = portalStorage.deleteUser(userId);
      if (res.success) {
        setEmployeesList(portalStorage.getAvailableUsers());
        showNotification(`✓ Đã xóa vĩnh viễn nhân viên "${userName}". Hệ thống khóa khôi phục.`);
      } else {
        alert(res.message);
      }
    }
  };

  const handleStartEditEmployee = (user: PortalUser) => {
    setEditingEmployee(user);
    setEmployeeFormData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone || '0932790928',
      department: user.department || 'Ban Giám Đốc',
      role: user.role,
      assignedProjects: user.assignedProjects || ['PROJECT_INVENTORY']
    });
    setIsAddingEmployee(false);
  };

  const handleToggleAssignedProject = (code: ProjectCode) => {
    setEmployeeFormData(prev => {
      const has = prev.assignedProjects.includes(code);
      const updated = has ? prev.assignedProjects.filter(c => c !== code) : [...prev.assignedProjects, code];
      return { ...prev, assignedProjects: updated };
    });
  };

  // =========================================================================
  // B2B COMPANY MANAGEMENT (CRUD, EDIT NAME, DELETE, ADD - AUTO-SAVE, NO RESTORE)
  // =========================================================================
  const handleSaveB2BCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bFormData.companyName || !b2bFormData.taxCode || !b2bFormData.fullName || !b2bFormData.phone || !b2bFormData.email) {
      alert('Vui lòng điền đầy đủ Tên công ty, MST, Người đại diện, SĐT và Email!');
      return;
    }

    if (editingB2B) {
      // Edit existing company
      const updatedCompany: B2BMember = {
        ...editingB2B,
        companyName: (b2bFormData.companyName || '').trim(),
        taxCode: (b2bFormData.taxCode || '').trim(),
        fullName: (b2bFormData.fullName || '').trim(),
        email: (b2bFormData.email || '').trim().toLowerCase(),
        phone: (b2bFormData.phone || '').trim(),
        position: b2bFormData.position?.trim(),
        address: b2bFormData.address?.trim(),
        businessType: b2bFormData.businessType?.trim(),
        discountRatePercent: Number(b2bFormData.discountRatePercent) || 25,
        status: b2bFormData.status || 'approved',
        notes: b2bFormData.notes?.trim()
      };

      updateB2BMember(updatedCompany);
      setB2bList(getB2BMembers());
      setEditingB2B(null);
      portalStorage.addAuditLog(
        'Admin (Quản Trị)',
        'UPDATE_B2B_COMPANY',
        `Cập nhật thông tin công ty B2B [${updatedCompany.companyName}] (MST: ${updatedCompany.taxCode}) - Chiết khấu: ${updatedCompany.discountRatePercent}%`,
        'SUCCESS'
      );
      showNotification(`✓ Đã lưu thay đổi thông tin công ty "${updatedCompany.companyName}" vào hệ thống!`);
    } else {
      // Add new company
      const newCompany: B2BMember = {
        id: `b2b-${Date.now()}`,
        companyName: (b2bFormData.companyName || '').trim(),
        taxCode: (b2bFormData.taxCode || '').trim(),
        fullName: (b2bFormData.fullName || '').trim(),
        email: (b2bFormData.email || '').trim().toLowerCase(),
        phone: (b2bFormData.phone || '').trim(),
        position: b2bFormData.position?.trim() || 'Người Đại Diện',
        address: b2bFormData.address?.trim() || 'Việt Nam',
        businessType: b2bFormData.businessType?.trim() || 'Tổng thầu EPC / Phân phối van',
        discountRatePercent: Number(b2bFormData.discountRatePercent) || 25,
        status: b2bFormData.status || 'approved',
        role: 'dealer',
        registeredAt: new Date().toISOString().split('T')[0],
        approvedAt: b2bFormData.status === 'approved' ? new Date().toISOString().split('T')[0] : undefined,
        notes: b2bFormData.notes?.trim()
      };

      const currentList = getB2BMembers();
      saveB2BMembers([newCompany, ...currentList]);
      setB2bList(getB2BMembers());
      setIsAddingB2B(false);
      portalStorage.addAuditLog(
        'Admin (Quản Trị)',
        'ADD_B2B_COMPANY',
        `Thêm mới đại lý/công ty B2B [${newCompany.companyName}] (MST: ${newCompany.taxCode}) - Chiết khấu: ${newCompany.discountRatePercent}%`,
        'SUCCESS'
      );
      showNotification(`✓ Đã thêm công ty B2B "${newCompany.companyName}" thành công!`);
    }
  };

  const handleDeleteB2BCompany = (id: string, companyName: string) => {
    if (confirm(`CẢNH BÁO XÓA DOANH NGHIỆP:\nBạn có chắc chắn muốn xóa vĩnh viễn công ty "${companyName}" khỏi danh sách B2B?\nHệ thống tự động lưu lại và KHÔNG tự ý khôi phục đối tác này.`)) {
      deleteB2BMember(id);
      setB2bList(getB2BMembers());
      portalStorage.addAuditLog(
        'Admin (Quản Trị)',
        'DELETE_B2B_COMPANY',
        `Xóa vĩnh viễn công ty đối tác [${companyName}] khỏi hệ thống. Khóa khôi phục.`,
        'SUCCESS'
      );
      showNotification(`✓ Đã xóa vĩnh viễn doanh nghiệp "${companyName}". Hệ thống khóa khôi phục.`);
    }
  };

  const handleStartEditB2B = (member: B2BMember) => {
    setEditingB2B(member);
    setB2bFormData({
      companyName: member.companyName,
      taxCode: member.taxCode,
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      position: member.position || '',
      address: member.address || '',
      businessType: member.businessType || '',
      discountRatePercent: member.discountRatePercent || 25,
      status: member.status,
      notes: member.notes || ''
    });
    setIsAddingB2B(false);
  };

  const handleQuickChangeB2BStatus = (member: B2BMember, newStatus: 'approved' | 'rejected' | 'pending') => {
    const updated = { ...member, status: newStatus, approvedAt: newStatus === 'approved' ? new Date().toISOString().split('T')[0] : member.approvedAt };
    updateB2BMember(updated);
    setB2bList(getB2BMembers());
    portalStorage.addAuditLog(
      'Admin (Quản Trị)',
      'UPDATE_B2B_STATUS',
      `Thay đổi trạng thái đại lý [${member.companyName}] thành: ${newStatus.toUpperCase()}`,
      'SUCCESS'
    );
    showNotification(`✓ Đã cập nhật trạng thái của "${member.companyName}" thành ${newStatus.toUpperCase()}!`);
  };

  // Filtered lists for search
  const filteredEmployees = employeesList.filter(e => 
    e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.roleNameVi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredB2B = b2bList.filter(m => 
    m.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.taxCode.includes(searchTerm) ||
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/aistudio/image_c970573c.png" 
              alt="UTD Industracorp" 
              className="h-9 w-auto object-contain hidden sm:block" 
            />
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isAdminLoggedIn 
                ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400' 
                : isMemberLoggedIn
                ? 'bg-blue-500/10 border border-blue-500/40 text-blue-400'
                : 'bg-slate-800 border border-slate-700 text-slate-300'
            }`}>
              {isAdminLoggedIn ? <ShieldCheck className="w-5 h-5" /> : isMemberLoggedIn ? <Building2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider font-mono">
                  {isAdminLoggedIn 
                    ? 'Cổng Quản Trị Nội Bộ & Dữ Liệu Doanh Nghiệp' 
                    : isMemberLoggedIn
                    ? 'Cổng Thông Tin Thành Viên Đại Lý B2B'
                    : (lang === 'vi' ? 'Cổng Xác Thực & Đăng Nhập Nội Bộ' : 'Internal Authentication Gateway')}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black uppercase ${
                  isAdminLoggedIn 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : isMemberLoggedIn
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {isAdminLoggedIn ? 'SUPER ADMIN (TOÀN QUYỀN)' : isMemberLoggedIn ? 'THÀNH VIÊN ĐẠI LÝ B2B' : 'GUEST / CHƯA ĐĂNG NHẬP'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isAdminLoggedIn 
                  ? `Quản trị viên tối cao: ${currentUserSession.displayName} (${currentUserSession.email}) - Toàn quyền xem, chỉnh sửa & xoá dữ liệu.` 
                  : isMemberLoggedIn
                  ? `Đang đăng nhập: ${currentUserSession.displayName} • ${currentUserSession.companyName || currentUserSession.email}`
                  : 'Bắt buộc phải đăng nhập. Chỉ riêng Quản Trị Viên (Super Admin) mới có quyền truy cập, chỉnh sửa và xoá danh sách nhân viên và công ty B2B.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Permanent Persistence Notice Banner */}
        <div className="bg-slate-950/90 border-b border-slate-800/80 px-5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2 text-[11px]">
            <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>
              {isAdminLoggedIn ? (
                <>
                  <strong>Chính sách lưu trữ an toàn & Toàn quyền Admin:</strong> Mọi thay đổi (sửa/xóa nhân viên, cty B2B) được lưu lập tức vào cơ sở dữ liệu. Hệ thống <strong>không tự ý khôi phục</strong> tài khoản đã xoá.
                </>
              ) : isMemberLoggedIn ? (
                <>
                  <strong>Quy định bảo mật hệ thống:</strong> Chỉ riêng Quản Trị Viên (Super Admin) mới xem được và có toàn quyền chỉnh sửa, xoá dữ liệu nhân viên & các công ty B2B. Nhân viên và công ty B2B <strong>không nhìn thấy danh sách này</strong>.
                </>
              ) : (
                <>
                  <strong>Yêu cầu xác thực:</strong> Bắt buộc đăng nhập tài khoản Quản trị viên để xem danh sách nhân viên và đối tác B2B. Khách vãng lai <strong>không có quyền truy cập</strong>.
                </>
              )}
            </span>
          </div>

          {currentUserSession && (
            <button
              type="button"
              onClick={() => {
                onLogout();
                setCurrentSession(null);
                setActiveTab('admin');
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 bg-rose-950/50 px-2.5 py-1 rounded-lg border border-rose-800 shrink-0 cursor-pointer"
              title="Đăng xuất khỏi phiên làm việc hiện tại"
            >
              <LogOut className="w-3 h-3" />
              <span>Đăng xuất ({currentUserSession.userType === 'admin' ? 'Admin' : 'Thành viên'})</span>
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-5 pt-2 flex items-center gap-2 overflow-x-auto">
          {isAdminLoggedIn ? (
            <>
              {/* TAB 1: EMPLOYEES */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('manage_employees');
                  setEditingEmployee(null);
                  setIsAddingEmployee(false);
                }}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'manage_employees'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>👥 Danh Sách Nhân Viên</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 font-mono">
                  {employeesList.length}
                </span>
              </button>

              {/* TAB 2: B2B COMPANIES */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('manage_b2b');
                  setEditingB2B(null);
                  setIsAddingB2B(false);
                }}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'manage_b2b'
                    ? 'border-purple-400 text-purple-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>🏢 Các Công Ty B2B Đăng Ký</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 font-mono">
                  {b2bList.length}
                </span>
              </button>

              {/* TAB 3: CHANGE PASSWORD */}
              <button
                type="button"
                onClick={() => setActiveTab('change_password')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'change_password'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>🔑 Đổi Mật Khẩu Admin</span>
              </button>
            </>
          ) : isMemberLoggedIn ? (
            <>
              {/* TAB FOR LOGGED IN B2B MEMBER / STAFF */}
              <button
                type="button"
                onClick={() => setActiveTab('my_profile')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'my_profile'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>🏢 Hồ Sơ Doanh Nghiệp B2B</span>
              </button>
            </>
          ) : (
            <>
              {/* LOGIN TABS FOR GUESTS / VISITORS */}
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quản Trị Viên (Admin Đăng Nhập)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('member')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'member'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Thành Viên Đại Lý B2B (Đăng Nhập)</span>
              </button>
            </>
          )}
        </div>

        {/* Live Notification Toast */}
        {saveToast && (
          <div className="mx-5 mt-3 p-2.5 bg-emerald-950/90 border border-emerald-500 rounded-xl text-xs text-emerald-200 flex items-center gap-2 shadow-lg animate-fade-in font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* ========================================================================= */}
          {/* VIEW 1: MANAGE EMPLOYEES (ADMIN ONLY - STRICTLY GUARDED)                  */}
          {/* ========================================================================= */}
          {isAdminLoggedIn && activeTab === 'manage_employees' && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm nhân viên theo họ tên, username, email..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingEmployee(!isAddingEmployee);
                      setEditingEmployee(null);
                      setEmployeeFormData({
                        fullName: '',
                        username: '',
                        email: '',
                        phone: '0932790928',
                        department: 'Phòng Kỹ Thuật & Van UTD',
                        role: 'WAREHOUSE_STAFF',
                        assignedProjects: ['PROJECT_INVENTORY']
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isAddingEmployee ? 'Đóng Form' : '+ Thêm Nhân Viên Mới'}</span>
                  </button>

                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    {filteredEmployees.length} nhân sự
                  </span>
                </div>
              </div>

              {/* Add or Edit Employee Form */}
              {(isAddingEmployee || editingEmployee) && (
                <form onSubmit={handleSaveEmployee} className="p-4 bg-slate-950 border border-amber-500/50 rounded-xl space-y-3 animate-fade-in shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-amber-400 uppercase font-mono flex items-center gap-1.5">
                      <Edit className="w-3.5 h-3.5" />
                      <span>{editingEmployee ? `Chỉnh Sửa Nhân Viên: ${editingEmployee.fullName}` : 'Thêm Nhân Viên Mới'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingEmployee(false);
                        setEditingEmployee(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Hủy bỏ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Họ và Tên Nhân Viên:</label>
                      <input
                        type="text"
                        required
                        value={employeeFormData.fullName}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, fullName: e.target.value })}
                        placeholder="vd: Nguyễn Văn An"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Tên Đăng Nhập (Username):</label>
                      <input
                        type="text"
                        required
                        value={employeeFormData.username}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, username: e.target.value })}
                        placeholder="vd: an.nguyen"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Email Công Vụ:</label>
                      <input
                        type="email"
                        required
                        value={employeeFormData.email}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, email: e.target.value })}
                        placeholder="vd: an.nguyen@industracorp.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Số Điện Thoại:</label>
                      <input
                        type="text"
                        value={employeeFormData.phone}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, phone: e.target.value })}
                        placeholder="0932790928"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Phòng Ban / Bộ Phận:</label>
                      <input
                        type="text"
                        value={employeeFormData.department}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, department: e.target.value })}
                        placeholder="vd: Phòng Kỹ Thuật Dự Án"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Vai Trò Hệ Thống:</label>
                      <select
                        value={employeeFormData.role}
                        onChange={(e) => setEmployeeFormData({ ...employeeFormData, role: e.target.value as UserRoleType })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                      >
                        <option value="SUPER_ADMIN">👑 Quản Trị Viên Cao Cấp (Super Admin)</option>
                        <option value="WAREHOUSE_STAFF">📦 Thủ Kho (Quản lý kho van)</option>
                        <option value="QUOTATION_SPECIALIST">💼 Chuyên Viên Báo Giá (Báo giá PDF)</option>
                        <option value="BUSINESS_PLANNER">📈 Chuyên Viên Kế Hoạch (Chiến lược)</option>
                      </select>
                    </div>
                  </div>

                  {/* Module Permissions Checkboxes */}
                  <div>
                    <label className="block text-slate-400 mb-1.5 text-xs font-bold">
                      Phân Quyền Phân Hệ Phụ Trách:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {([
                        { code: 'PROJECT_INVENTORY' as ProjectCode, label: '📦 Quản Lý Kho & Tồn Kho' },
                        { code: 'PROJECT_QUOTATION' as ProjectCode, label: '💼 Quản Lý Báo Giá & Xuất PDF' },
                        { code: 'PROJECT_PLANNING' as ProjectCode, label: '📈 Kế Hoạch Kinh Doanh' },
                        { code: 'PROJECT_AI_SETTINGS' as ProjectCode, label: '🤖 Cấu Hình Trợ Lý AI' }
                      ]).map((p) => {
                        const isChecked = employeeFormData.assignedProjects.includes(p.code);
                        return (
                          <button
                            type="button"
                            key={p.code}
                            onClick={() => handleToggleAssignedProject(p.code)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                              isChecked 
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600' 
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <span>{isChecked ? '✓ ' : '+ '}</span>
                            <span>{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingEmployee(false);
                        setEditingEmployee(null);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingEmployee ? 'Lưu Thay Đổi Ngay' : 'Thêm Nhân Viên Ngay'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Employees Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/50">
                        <th className="py-2.5 px-3">Họ Tên & Email</th>
                        <th className="py-2.5 px-3">Tài Khoản & SĐT</th>
                        <th className="py-2.5 px-3">Chức Danh & Phòng Ban</th>
                        <th className="py-2.5 px-3">Phân Quyền Phân Hệ</th>
                        <th className="py-2.5 px-3 text-center">Toàn Quyền Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{emp.fullName}</span>
                              {emp.role === 'SUPER_ADMIN' && (
                                <span className="text-[9px] px-1.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-mono">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">{emp.email}</span>
                          </td>

                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            <div className="text-slate-200">@{emp.username}</div>
                            <div className="text-slate-400">{emp.phone || '0932790928'}</div>
                          </td>

                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              emp.role === 'SUPER_ADMIN' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                              emp.role === 'WAREHOUSE_STAFF' ? 'bg-blue-950 text-blue-300 border border-blue-700' :
                              emp.role === 'QUOTATION_SPECIALIST' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                              'bg-purple-950 text-purple-300 border border-purple-700'
                            }`}>
                              {emp.roleNameVi}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5">{emp.department || 'Ban Giám Đốc'}</div>
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                              {emp.role === 'SUPER_ADMIN' ? (
                                <span className="text-emerald-400 font-bold">Toàn bộ 4 phân hệ (*)</span>
                              ) : (
                                (emp.assignedProjects || []).map(p => (
                                  <span key={p} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                                    {p.replace('PROJECT_', '')}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Employee Name / Info button */}
                              <button
                                type="button"
                                onClick={() => handleStartEditEmployee(emp)}
                                className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-300 hover:text-white transition-all"
                                title="Sửa tên, chức danh, phân quyền nhân viên"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Employee Permanently button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteEmployee(emp.id, emp.fullName)}
                                disabled={emp.role === 'SUPER_ADMIN' && employeesList.filter(x => x.role === 'SUPER_ADMIN').length <= 1}
                                className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Xóa vĩnh viễn nhân viên này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: MANAGE B2B COMPANIES (ADMIN ONLY - STRICTLY GUARDED)             */}
          {/* ========================================================================= */}
          {isAdminLoggedIn && activeTab === 'manage_b2b' && (
            <div className="space-y-4">
              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên công ty, MST, người đại diện, SĐT..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingB2B(!isAddingB2B);
                      setEditingB2B(null);
                      setB2bFormData({
                        companyName: '',
                        taxCode: '',
                        fullName: '',
                        email: '',
                        phone: '',
                        position: 'Người Đại Diện / Ban Mua Sắm',
                        address: '',
                        businessType: 'Tổng thầu EPC / Nhà phân phối van',
                        discountRatePercent: 25,
                        status: 'approved',
                        notes: ''
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{isAddingB2B ? 'Đóng Form' : '+ Thêm Công Ty B2B Mới'}</span>
                  </button>

                  <span className="text-xs font-mono text-purple-300 bg-purple-950 px-2.5 py-1.5 rounded-lg border border-purple-800">
                    {filteredB2B.length} doanh nghiệp
                  </span>
                </div>
              </div>

              {/* Add or Edit B2B Company Form */}
              {(isAddingB2B || editingB2B) && (
                <form onSubmit={handleSaveB2BCompany} className="p-4 bg-slate-950 border border-purple-500/50 rounded-xl space-y-3 animate-fade-in shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-purple-400 uppercase font-mono flex items-center gap-1.5">
                      <Edit className="w-3.5 h-3.5" />
                      <span>{editingB2B ? `Chỉnh Sửa Công Ty: ${editingB2B.companyName}` : 'Thêm Công Ty B2B Mới'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingB2B(false);
                        setEditingB2B(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Hủy bỏ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 mb-1 font-bold">Tên Công Ty / Doanh Nghiệp (Toàn quyền sửa):</label>
                      <input
                        type="text"
                        required
                        value={b2bFormData.companyName || ''}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, companyName: e.target.value })}
                        placeholder="vd: CÔNG TY CỔ PHẦN CƠ ĐIỆN VINAFLOW"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Mã Số Thuế (MST):</label>
                      <input
                        type="text"
                        required
                        value={b2bFormData.taxCode || ''}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, taxCode: e.target.value })}
                        placeholder="0317899988"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Người Đại Diện / Liên Hệ:</label>
                      <input
                        type="text"
                        required
                        value={b2bFormData.fullName || ''}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, fullName: e.target.value })}
                        placeholder="Nguyễn Văn Minh"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Số Điện Thoại:</label>
                      <input
                        type="text"
                        required
                        value={b2bFormData.phone || ''}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, phone: e.target.value })}
                        placeholder="0988123456"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Email Nhận Báo Giá:</label>
                      <input
                        type="email"
                        required
                        value={b2bFormData.email || ''}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, email: e.target.value })}
                        placeholder="contact@vinaflow.vn"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Mức Chiết Khấu Đại Lý (%):</label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={b2bFormData.discountRatePercent || 25}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, discountRatePercent: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Trạng Thái Phê Duyệt:</label>
                      <select
                        value={b2bFormData.status || 'approved'}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, status: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-purple-400 focus:outline-none cursor-pointer"
                      >
                        <option value="approved">✓ Đã Phê Duyệt (Được lấy báo giá PDF)</option>
                        <option value="pending">⏳ Đang Chờ Duyệt (Pending)</option>
                        <option value="rejected">✕ Từ Chối Phê Duyệt (Rejected)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-bold">Lĩnh Vực Hoạt Động:</label>
                      <input
                        type="text"
                        value={b2bFormData.businessType || ''}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, businessType: e.target.value })}
                        placeholder="Đại lý phân phối van / Cơ điện M&E"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-slate-400 mb-1 font-bold">Địa Chỉ Trụ Sở / Kho Hàng:</label>
                      <input
                        type="text"
                        value={b2bFormData.address || ''}
                        onChange={(e) => setB2bFormData({ ...b2bFormData, address: e.target.value })}
                        placeholder="Số 18/2 DT743, An Phú, Thuận An, Bình Dương"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingB2B(false);
                        setEditingB2B(null);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingB2B ? 'Lưu Thay Đổi Doanh Nghiệp' : 'Thêm Doanh Nghiệp Ngay'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* B2B Companies Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/50">
                        <th className="py-2.5 px-3">Doanh Nghiệp & MST</th>
                        <th className="py-2.5 px-3">Người Đại Diện & SĐT</th>
                        <th className="py-2.5 px-3">Email & Lĩnh Vực</th>
                        <th className="py-2.5 px-3 text-center">Chiết Khấu</th>
                        <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                        <th className="py-2.5 px-3 text-center">Toàn Quyền Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-sans">
                      {filteredB2B.map((comp) => (
                        <tr key={comp.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2.5 px-3 max-w-xs">
                            <div className="font-bold text-white text-xs leading-tight">
                              {comp.companyName}
                            </div>
                            <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                              MST: {comp.taxCode}
                            </div>
                            {comp.address && (
                              <div className="text-[10px] text-slate-500 truncate" title={comp.address}>
                                {comp.address}
                              </div>
                            )}
                          </td>

                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-slate-200">{comp.fullName}</div>
                            <div className="text-[11px] text-emerald-400 font-mono">{comp.phone}</div>
                          </td>

                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            <div className="text-slate-300">{comp.email}</div>
                            <div className="text-[10px] text-slate-500 font-sans">{comp.businessType || 'Đại lý phân phối'}</div>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-950 text-amber-300 border border-amber-700">
                              {comp.discountRatePercent}%
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              comp.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                              comp.status === 'rejected' ? 'bg-rose-950 text-rose-300 border border-rose-700' :
                              'bg-amber-950 text-amber-300 border border-amber-700'
                            }`}>
                              {comp.status === 'approved' ? '✓ ĐÃ DUYỆT' :
                               comp.status === 'rejected' ? '✕ TỪ CHỐI' : '⏳ CHỜ DUYỆT'}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Quick Status toggle */}
                              {comp.status !== 'approved' ? (
                                <button
                                  type="button"
                                  onClick={() => handleQuickChangeB2BStatus(comp, 'approved')}
                                  className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-[10px] font-bold"
                                  title="Phê duyệt đại lý này ngay"
                                >
                                  Duyệt
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleQuickChangeB2BStatus(comp, 'pending')}
                                  className="px-2 py-1 rounded bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-300 text-[10px] font-bold"
                                  title="Đưa về trạng thái chờ xét duyệt"
                                >
                                  Chờ
                                </button>
                              )}

                              {/* Edit Company Name / Info button */}
                              <button
                                type="button"
                                onClick={() => handleStartEditB2B(comp)}
                                className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-300 hover:text-white transition-all"
                                title="Sửa tên công ty, MST, người liên hệ, chiết khấu"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete Company Permanently button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteB2BCompany(comp.id, comp.companyName)}
                                className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white transition-all"
                                title="Xóa vĩnh viễn doanh nghiệp này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: ADMIN LOGIN FORM (UNAUTHENTICATED GUESTS ONLY)                   */}
          {/* ========================================================================= */}
          {!currentUserSession && activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 max-w-md mx-auto py-2">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                <p className="font-bold">Đăng nhập tài khoản Quản Trị Viên (Admin):</p>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  Sau khi đăng nhập, Quản trị viên cao cấp duy nhất có toàn quyền xem, sửa tên, phân quyền và xóa nhân viên hoặc công ty B2B.
                </p>
              </div>

              {adminError && (
                <div className="p-3 bg-rose-950/60 border border-rose-600 text-rose-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{adminError}</span>
                </div>
              )}

              {adminSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{adminSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Quản Trị Viên:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    placeholder="trong.luu@industracorp.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mật Khẩu Quản Trị:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    placeholder="Nhập mật khẩu quản trị viên"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-white"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Đăng Nhập Cổng Quản Trị Admin
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: MEMBER LOGIN FORM (UNAUTHENTICATED GUESTS ONLY)                  */}
          {/* ========================================================================= */}
          {!currentUserSession && activeTab === 'member' && (
            <form onSubmit={handleMemberSubmit} className="space-y-4 max-w-md mx-auto py-2">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300">
                <p className="font-bold">Đăng nhập Thành Viên Đại Lý B2B:</p>
                <p className="text-[11px] text-blue-200/80 mt-0.5">
                  Đại lý đã được phê duyệt đăng nhập bằng Email và Mã Số Thuế để lấy bảng báo giá PDF có chiết khấu.
                </p>
              </div>

              {memberError && (
                <div className="p-3 bg-rose-950/60 border border-rose-600 text-rose-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{memberError}</span>
                </div>
              )}

              {memberSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{memberSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Đại Lý Đã Đăng Ký:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
                    placeholder="VD: minh.nguyen@vinaflow.vn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mã Số Thuế Doanh Nghiệp (MST):</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={memberTaxCode}
                    onChange={(e) => setMemberTaxCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none font-mono"
                    placeholder="VD: 0317899988"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                Đăng Nhập Thành Viên Đại Lý
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: CHANGE PASSWORD (ADMIN ONLY - STRICTLY GUARDED)                   */}
          {/* ========================================================================= */}
          {isAdminLoggedIn && activeTab === 'change_password' && (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md mx-auto py-2">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                <p className="font-bold">Đổi Mật Khẩu Quản Trị Viên (Xác Nhận 3 Bước & Email):</p>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  Xác nhận mật khẩu cũ → Điền mật khẩu mới → Xác nhận lại. Hỗ trợ OTP qua Email.
                </p>
              </div>

              {pwError && (
                <div className="p-3 bg-rose-950/60 border border-rose-600 text-rose-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{pwError}</span>
                </div>
              )}

              {pwSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-600 text-emerald-200 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{pwSuccess}</span>
                </div>
              )}

              {otpSentMessage && (
                <div className="p-3 bg-blue-950/60 border border-blue-600 text-blue-200 text-xs rounded-xl flex items-center gap-2 font-mono">
                  <Mail className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>{otpSentMessage}</span>
                </div>
              )}

              {/* Step 1: Email OTP Verification (Mandatory) */}
              <div className="bg-slate-950 border border-amber-500/40 p-3 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-amber-300 font-mono">
                    1. Xác minh qua Email Admin (Bắt buộc):
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">trong.luu@industracorp.com</span>
                </div>
                
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-300">
                    Bấm để gửi mã OTP 6 số về hòm thư:
                  </span>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {isSendingOtp ? 'Đang gửi...' : '✉ Gửi OTP qua Email'}
                  </button>
                </div>

                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Mã xác thực OTP từ Email (bắt buộc):</label>
                  <input
                    type="text"
                    required
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-400 focus:outline-none tracking-widest text-center"
                    placeholder="Nhập 6 chữ số OTP từ email"
                  />
                </div>
              </div>

              {/* Step 2: New Password */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
                <label className="block text-xs font-bold text-emerald-300 font-mono">
                  2. Điền mật khẩu mới:
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  placeholder="Nhập mật khẩu mới (tối thiểu 3 ký tự)"
                />
              </div>

              {/* Step 3: Confirm New Password */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
                <label className="block text-xs font-bold text-blue-300 font-mono">
                  3. Xác nhận lại mật khẩu mới:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
                  placeholder="Nhập lại chính xác mật khẩu mới"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-95"
              >
                Xác Nhận & Cập Nhật Mật Khẩu Mới
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: B2B MEMBER PROFILE & ACCESS PERMISSION (LOGGED-IN MEMBER/STAFF)    */}
          {/* ========================================================================= */}
          {isMemberLoggedIn && activeTab === 'my_profile' && (
            <div className="space-y-4 max-w-2xl mx-auto py-2">
              {/* Strict Security Enforcement Card */}
              <div className="p-4 bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border border-amber-500/50 rounded-2xl shadow-xl space-y-2">
                <div className="flex items-center gap-2.5 text-amber-300">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider font-mono">
                    Quy Định Bảo Mật Cổng Quản Trị & Phân Quyền Hệ Thống
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Chỉ riêng <strong>Quản Trị Viên Tối Cao (Super Admin trong.luu@industracorp.com)</strong> mới xem được và có toàn quyền chỉnh sửa, xoá dữ liệu danh sách nhân viên và các công ty B2B.
                </p>
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-amber-200/90 font-mono">
                  🔒 <strong>Quyền hạn tài khoản của bạn:</strong> Nhân viên và các công ty B2B <strong>không nhìn thấy được danh sách nhân viên và danh sách cty B2B</strong> nhằm bảo mật tuyệt đối thông tin nội bộ và đối tác cạnh tranh.
                </div>
              </div>

              {/* Member Profile Details */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                      Thông Tin Tài Khoản Doanh Nghiệp B2B
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ✓ ĐÃ PHÊ DUYỆT ĐẠI LÝ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px] mb-1">Tên Doanh Nghiệp / Đơn Vị:</span>
                    <span className="text-white font-bold block">{currentUserSession?.companyName || 'Công Ty Thành Viên Đại Lý B2B'}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px] mb-1">Mã Số Thuế (MST):</span>
                    <span className="text-amber-300 font-mono font-bold block">{currentUserSession?.taxCode || '0317899988'}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px] mb-1">Người Đại Diện / Quản Lý:</span>
                    <span className="text-white font-bold block">{currentUserSession?.displayName}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px] mb-1">Email Đăng Nhập:</span>
                    <span className="text-blue-300 font-mono block">{currentUserSession?.email}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px] mb-1">Mức Chiết Khấu Được Phê Duyệt:</span>
                    <span className="text-emerald-400 font-mono font-black text-sm">25% (Hạng 1 - Đại lý / Tổng thầu EPC)</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px] mb-1">Thời Gian Đăng Nhập:</span>
                    <span className="text-slate-300 font-mono text-[11px]">{currentUserSession?.loginTime || new Date().toLocaleString('vi-VN')}</span>
                  </div>
                </div>

                {/* Privileges & Restrictions */}
                <div className="p-3 bg-blue-950/30 border border-blue-800/50 rounded-xl space-y-1.5 text-xs text-blue-200">
                  <span className="font-bold text-blue-300 block">Quyền hạn đại lý B2B được kích hoạt:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    <li>Xem bảng báo giá chiết khấu 15% - 25% cho tất cả các chủng loại van công nghiệp.</li>
                    <li>Tải file Báo Giá PDF Dự Án hoàn chỉnh có mộc dấu điện tử và chữ ký Industracorp.</li>
                    <li>Truy cập thư viện tài liệu kỹ thuật, bản vẽ CAD/3D và tiêu chuẩn PCCC / Lò hơi.</li>
                  </ul>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setCurrentSession(null);
                      setActiveTab('admin');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng Xuất Tài Khoản</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer text-center"
                  >
                    Tiếp Tục Xem Danh Mục & Báo Giá
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACCESS DENIED FALLBACK (IF NON-ADMIN ATTEMPTS RESTRICTED DIRECTORIES)     */}
          {/* ========================================================================= */}
          {!isAdminLoggedIn && (activeTab === 'manage_employees' || activeTab === 'manage_b2b' || activeTab === 'change_password') && (
            <div className="py-12 px-6 max-w-lg mx-auto text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-black text-rose-300 uppercase tracking-wide">
                  ⛔ TRUY CẬP BỊ TỪ CHỐI (ACCESS DENIED)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cổng Quản Trị Nội Bộ & Dữ Liệu Doanh Nghiệp quy định: Bắt buộc phải đăng nhập và <strong>chỉ riêng Quản Trị Viên (Super Admin trong.luu@industracorp.com)</strong> mới xem được và có toàn quyền chỉnh sửa và xoá dữ liệu công ty B2B và nhân viên.
                </p>
                <p className="text-xs text-amber-300/90 font-medium">
                  Nhân viên và công ty B2B <strong>không nhìn thấy được danh sách nhân viên và danh sách cty B2B</strong>.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab(currentUserSession ? 'my_profile' : 'admin')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {currentUserSession ? '← Về thông tin tài khoản của bạn' : '← Về màn hình đăng nhập'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
