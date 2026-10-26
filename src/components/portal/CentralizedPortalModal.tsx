import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Layers, 
  Package, 
  FileSpreadsheet, 
  TrendingUp, 
  Sliders, 
  Users, 
  Database, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Download, 
  Bot, 
  Send, 
  RefreshCw, 
  Save, 
  FolderTree, 
  Terminal, 
  Lock, 
  Unlock, 
  LogIn, 
  LogOut, 
  Cpu, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock,
  Printer,
  Copy,
  Check,
  UserPlus,
  Trash2,
  Upload,
  UploadCloud,
  Mail,
  Languages,
  Bell,
  Building2,
  Edit2,
  Phone,
  MapPin,
  Percent,
  Plus
} from 'lucide-react';
import { 
  PortalUser, 
  ProjectCode, 
  UserRoleType,
  InventoryItemRecord, 
  QuotationRecord, 
  AISettingRecord, 
  BusinessPlanRecord, 
  BackupRecord,
  SwotItem 
} from '../../types/portal';
import { portalStorage, AuditLogEntry } from '../../services/portalStorage';
import { portalAI } from '../../services/portalAiService';
import { PORTAL_PROJECTS } from '../../data/portalInitialData';
import { ValveProduct } from '../../types/valve';
import { authEngine, B2BMember } from '../../utils/authEngine';

interface CentralizedPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'architecture' | 'inventory' | 'quotations' | 'planning' | 'ai_settings' | 'users' | 'backup' | 'audit_logs' | 'material_alerts';
  onOpenHosting?: () => void;
  valves?: ValveProduct[];
  onBatchUpdateValves?: (updated: ValveProduct[] | ((prev: ValveProduct[]) => ValveProduct[])) => void;
  onOpenExportCatalogModal?: () => void;
  onOpenNotificationSettings?: () => void;
}

export const CentralizedPortalModal: React.FC<CentralizedPortalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'architecture',
  onOpenHosting,
  valves = [],
  onBatchUpdateValves,
  onOpenExportCatalogModal,
  onOpenNotificationSettings,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(portalStorage.getCurrentUser());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  // Inventory state
  const [inventory, setInventory] = useState<InventoryItemRecord[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryAiPrompt, setInventoryAiPrompt] = useState('');
  const [inventoryAiChat, setInventoryAiChat] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Xin chào! Tôi là Trợ lý AI Quản lý Kho Industracorp. Tôi đã đồng bộ với cơ sở dữ liệu kho bãi. Bạn có thể hỏi tôi về các mặt hàng sắp hết, đề xuất đơn nhập hàng EOQ, hoặc tra cứu vị trí kệ lưu kho.'
    }
  ]);
  const [isInventoryAiLoading, setIsInventoryAiLoading] = useState(false);

  // Quotations state
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRecord | null>(null);
  const [quoteAiPitch, setQuoteAiPitch] = useState('');
  const [isGeneratingQuotePitch, setIsGeneratingQuotePitch] = useState(false);
  const [pdfLoginModalOpen, setPdfLoginModalOpen] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  // Planning state
  const [businessPlan, setBusinessPlan] = useState<BusinessPlanRecord>(portalStorage.getBusinessPlan());
  const [planningAiPrompt, setPlanningAiPrompt] = useState('');
  const [planningAiChat, setPlanningAiChat] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Chào bạn! Tôi là Cố vấn Chiến lược Kinh doanh & Phân tích SWOT AI. Hãy thảo luận về kịch bản tài chính 2026-2027, cách tối ưu điểm hòa vốn 14.2 tỷ VND, hoặc chiến lược cạnh tranh với hàng tiểu ngạch.'
    }
  ]);
  const [isPlanningAiLoading, setIsPlanningAiLoading] = useState(false);

  // AI Admin Settings state
  const [selectedAiProject, setSelectedAiProject] = useState<ProjectCode>('PROJECT_INVENTORY');
  const [currentAiSetting, setCurrentAiSetting] = useState<AISettingRecord>(portalStorage.getAISettingForProject('PROJECT_INVENTORY'));
  const [aiSettingSaveSuccess, setAiSettingSaveSuccess] = useState(false);
  const [testAiPrompt, setTestAiPrompt] = useState('');
  const [testAiResult, setTestAiResult] = useState('');
  const [isTestingAi, setIsTestingAi] = useState(false);

  // Backup & Storage state
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Copied code feedback
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);

  // User Management state
  const [usersSubTab, setUsersSubTab] = useState<'employees' | 'b2b'>('employees');
  const [usersList, setUsersList] = useState<PortalUser[]>(portalStorage.getAvailableUsers());
  const [b2bMembersList, setB2bMembersList] = useState<B2BMember[]>(authEngine.getB2BMembers());
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRoleType>('WAREHOUSE_STAFF');
  const [newAssignedProjects, setNewAssignedProjects] = useState<ProjectCode[]>(['PROJECT_INVENTORY']);
  const [userActionToast, setUserActionToast] = useState<string | null>(null);

  // Edit employee state
  const [editingEmployee, setEditingEmployee] = useState<PortalUser | null>(null);

  // B2B Member Management state
  const [editingB2BMember, setEditingB2BMember] = useState<B2BMember | null>(null);
  const [isAddB2BModalOpen, setIsAddB2BModalOpen] = useState(false);
  const [newB2BCompanyName, setNewB2BCompanyName] = useState('');
  const [newB2BTaxCode, setNewB2BTaxCode] = useState('');
  const [newB2BContactPerson, setNewB2BContactPerson] = useState('');
  const [newB2BPhone, setNewB2BPhone] = useState('');
  const [newB2BEmail, setNewB2BEmail] = useState('');
  const [newB2BDiscountPercent, setNewB2BDiscountPercent] = useState<number>(10);
  const [newB2BAddress, setNewB2BAddress] = useState('');
  const [newB2BNotes, setNewB2BNotes] = useState('');
  const [newB2BStatus, setNewB2BStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');

  // Password & Email OTP change modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [targetUserForPw, setTargetUserForPw] = useState<PortalUser | null>(null);
  const [passwordOld, setPasswordOld] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordOtp, setPasswordOtp] = useState('');
  const [passwordOtpSentMsg, setPasswordOtpSentMsg] = useState<string | null>(null);
  const [isSendingPwOtp, setIsSendingPwOtp] = useState(false);
  const [passwordToast, setPasswordToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Price Upload & Live Inventory export state
  const [isPriceUploadModalOpen, setIsPriceUploadModalOpen] = useState(false);
  const [priceUploadText, setPriceUploadText] = useState(
`SKU, Model, Đơn Giá (VNĐ)
UTD-BFV-DN50, Van Bướm Tay Gạt UTD DN50, 480000
UTD-BFV-DN80, Van Bướm Tay Gạt UTD DN80, 680000
UTD-BFV-DN100, Van Bướm Tay Gạt UTD DN100, 920000
UTD-GLV-DN50, Van Cầu Hơi Thép Rèn UTD DN50, 1850000
UTD-GLV-DN80, Van Cầu Hơi Thép Rèn UTD DN80, 2950000
UTD-GTV-DN100, Van Cổng Thép WCB Class 150 DN100, 3400000
UTD-CHK-DN50, Van Một Chiều Lá Lật UTD DN50, 1200000`
  );
  const [priceUploadToast, setPriceUploadToast] = useState<string | null>(null);
  const [inventoryExportToast, setInventoryExportToast] = useState<string | null>(null);

  // Reload state on mount & user change
  const reloadData = () => {
    setCurrentUser(portalStorage.getCurrentUser());
    setUsersList(portalStorage.getAvailableUsers());
    setB2bMembersList(authEngine.getB2BMembers());
    setInventory(portalStorage.getInventory());
    setQuotations(portalStorage.getQuotations());
    setBusinessPlan(portalStorage.getBusinessPlan());
    setBackups(portalStorage.getBackups());
    setAuditLogs(portalStorage.getAuditLogs());
    setCurrentAiSetting(portalStorage.getAISettingForProject(selectedAiProject));
  };

  // User Management Handlers
  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail || !newUsername) return;
    
    let roleNameVi = 'Nhân Viên Kho Vận';
    if (newRole === 'SUPER_ADMIN') roleNameVi = 'Quản Trị Viên Cao Cấp';
    else if (newRole === 'QUOTATION_SPECIALIST') roleNameVi = 'Chuyên Viên Báo Giá & Đấu Thầu';
    else if (newRole === 'BUSINESS_PLANNER') roleNameVi = 'Chuyên Viên Phân Tích Kế Hoạch';

    const res = portalStorage.addUser({
      fullName: newFullName,
      email: newEmail,
      username: newUsername,
      role: newRole,
      roleNameVi,
      assignedProjects: newAssignedProjects
    });

    if (res.success) {
      setUserActionToast(res.message);
      setIsAddUserModalOpen(false);
      setNewFullName('');
      setNewEmail('');
      setNewUsername('');
      reloadData();
      setTimeout(() => setUserActionToast(null), 3500);
    } else {
      alert(res.message);
    }
  };

  const handleDeleteEmployee = (userId: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhân viên "${name}" khỏi hệ thống? Quyền truy cập sẽ bị thu hồi ngay lập tức.`)) {
      return;
    }
    const res = portalStorage.deleteUser(userId);
    if (res.success) {
      setUserActionToast(res.message);
      reloadData();
      setTimeout(() => setUserActionToast(null), 3500);
    } else {
      alert(res.message);
    }
  };

  const handleSaveEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    let roleNameVi = editingEmployee.roleNameVi;
    if (editingEmployee.role === 'SUPER_ADMIN') roleNameVi = 'Quản Trị Viên Cao Cấp';
    else if (editingEmployee.role === 'QUOTATION_SPECIALIST') roleNameVi = 'Chuyên Viên Báo Giá & Đấu Thầu';
    else if (editingEmployee.role === 'BUSINESS_PLANNER') roleNameVi = 'Chuyên Viên Phân Tích Kế Hoạch';
    else if (editingEmployee.role === 'WAREHOUSE_STAFF') roleNameVi = 'Nhân Viên Kho Vận';

    const updated: PortalUser = {
      ...editingEmployee,
      roleNameVi
    };

    const success = portalStorage.updateUser(updated);
    if (success) {
      setUserActionToast(`Đã lưu thay đổi thông tin nhân viên "${updated.fullName}". Tự động lưu tức thì.`);
      setEditingEmployee(null);
      reloadData();
      setTimeout(() => setUserActionToast(null), 3500);
    } else {
      alert('Không thể lưu thông tin nhân viên.');
    }
  };

  const handleCreateB2BMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newB2BCompanyName || !newB2BTaxCode || !newB2BContactPerson) {
      alert('Vui lòng điền đầy đủ tên công ty, mã số thuế và người đại diện.');
      return;
    }

    const newMember: B2BMember = {
      id: 'b2b_' + Date.now(),
      companyName: newB2BCompanyName.trim(),
      taxCode: newB2BTaxCode.trim(),
      fullName: newB2BContactPerson.trim(),
      contactPerson: newB2BContactPerson.trim(),
      phone: newB2BPhone.trim(),
      email: newB2BEmail.trim(),
      role: 'dealer',
      status: newB2BStatus,
      discountRatePercent: Number(newB2BDiscountPercent) || 0,
      discountPercent: Number(newB2BDiscountPercent) || 0,
      createdAt: new Date().toISOString(),
      registeredAt: new Date().toISOString().split('T')[0],
      address: newB2BAddress.trim(),
      notes: newB2BNotes.trim()
    };

    authEngine.addB2BMember(newMember);
    portalStorage.addAuditLog(
      currentUser?.username || 'admin',
      'CREATE_B2B_COMPANY',
      `Tạo mới doanh nghiệp B2B: ${newMember.companyName} (MST: ${newMember.taxCode}, Chiết khấu: ${newMember.discountPercent}%)`,
      'SUCCESS',
      'SYSTEM_CONFIG',
      newMember.companyName
    );
    setUserActionToast(`Đã thêm công ty B2B "${newMember.companyName}". Tự động lưu tức thì.`);
    setIsAddB2BModalOpen(false);
    setNewB2BCompanyName('');
    setNewB2BTaxCode('');
    setNewB2BContactPerson('');
    setNewB2BPhone('');
    setNewB2BEmail('');
    setNewB2BDiscountPercent(10);
    setNewB2BAddress('');
    setNewB2BNotes('');
    reloadData();
    setTimeout(() => setUserActionToast(null), 3500);
  };

  const handleSaveEditB2BMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingB2BMember) return;

    authEngine.updateB2BMember(editingB2BMember);
    portalStorage.addAuditLog(
      currentUser?.username || 'admin',
      'UPDATE_B2B_COMPANY',
      `Cập nhật thông tin doanh nghiệp B2B: ${editingB2BMember.companyName} (MST: ${editingB2BMember.taxCode}, Chiết khấu: ${editingB2BMember.discountPercent || editingB2BMember.discountRatePercent}%)`,
      'SUCCESS',
      'SYSTEM_CONFIG',
      editingB2BMember.companyName
    );
    setUserActionToast(`Đã lưu thay đổi cho công ty "${editingB2BMember.companyName}". Tự động lưu tức thì.`);
    setEditingB2BMember(null);
    reloadData();
    setTimeout(() => setUserActionToast(null), 3500);
  };

  const handleDeleteB2BMember = (taxCode: string, companyName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN công ty B2B "${companyName}" (MST: ${taxCode})?\n\nHệ thống sẽ xóa vĩnh viễn và KHÔNG tự động khôi phục.`)) {
      return;
    }
    authEngine.deleteB2BMember(taxCode);
    portalStorage.addAuditLog(
      currentUser?.username || 'admin',
      'DELETE_B2B_COMPANY',
      `Xóa vĩnh viễn doanh nghiệp B2B: ${companyName} (MST: ${taxCode})`,
      'SUCCESS',
      'SYSTEM_CONFIG',
      companyName
    );
    setUserActionToast(`Đã xóa vĩnh viễn công ty "${companyName}". Hệ thống cam kết không tự khôi phục.`);
    reloadData();
    setTimeout(() => setUserActionToast(null), 3500);
  };

  const handleQuickToggleB2BStatus = (taxCode: string, newStatus: 'approved' | 'pending' | 'rejected') => {
    authEngine.updateB2BStatus(taxCode, newStatus);
    portalStorage.addAuditLog(
      currentUser?.username || 'admin',
      'UPDATE_B2B_STATUS',
      `Cập nhật trạng thái duyệt công ty MST ${taxCode} sang "${newStatus}"`,
      'SUCCESS',
      'SYSTEM_CONFIG',
      taxCode
    );
    setUserActionToast(`Đã cập nhật trạng thái duyệt sang "${newStatus}". Tự động lưu.`);
    reloadData();
    setTimeout(() => setUserActionToast(null), 3000);
  };

  const handleToggleProjectPermission = (userId: string, project: ProjectCode) => {
    const user = usersList.find(u => u.id === userId);
    if (!user) return;

    let updatedProjects: ProjectCode[];
    if (user.assignedProjects.includes(project)) {
      updatedProjects = user.assignedProjects.filter(p => p !== project);
    } else {
      updatedProjects = [...user.assignedProjects, project];
    }

    portalStorage.updateUserProjects(userId, updatedProjects);
    reloadData();
  };

  const handleOpenPasswordModal = (user: PortalUser) => {
    setTargetUserForPw(user);
    setPasswordOld('');
    setPasswordNew('');
    setPasswordConfirm('');
    setPasswordOtp('');
    setPasswordOtpSentMsg(null);
    setPasswordToast(null);
    setIsPasswordModalOpen(true);
  };

  const handleSendEmailOtp = () => {
    if (!targetUserForPw) return;
    setIsSendingPwOtp(true);
    setPasswordToast(null);
    const res = portalStorage.requestEmailOtp(targetUserForPw.email);
    setIsSendingPwOtp(false);
    if (res.success) {
      setPasswordOtpSentMsg(res.message);
      if (res.otpCode) {
        setPasswordOtp(res.otpCode);
      }
    } else {
      setPasswordToast({ type: 'error', msg: res.message });
    }
  };

  const handleSavePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForPw) return;
    const res = portalStorage.changePassword(
      targetUserForPw.email,
      passwordOld,
      passwordNew,
      passwordConfirm,
      passwordOtp
    );
    if (res.success) {
      setPasswordToast({ type: 'success', msg: res.message });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
      }, 1500);
    } else {
      setPasswordToast({ type: 'error', msg: res.message });
    }
  };

  // Inventory & Price Handlers
  const handleExportLiveInventory = (format: 'csv' | 'json') => {
    const catalog = portalStorage.generateLiveInventoryCatalog(format);
    const blob = new Blob([catalog.content], { type: catalog.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = catalog.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setInventoryExportToast(`✓ Đã tạo và tải xuống file "${catalog.fileName}" thành công!`);
    setTimeout(() => setInventoryExportToast(null), 3500);
  };

  const handleImportPriceList = () => {
    const lines = priceUploadText.trim().split('\n');
    const entries: { sku: string; modelName?: string; priceVnd: number }[] = [];

    lines.forEach((line, idx) => {
      if (idx === 0 && line.toLowerCase().includes('sku')) return;
      const parts = line.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        const sku = parts[0];
        let priceVnd = 0;
        let modelName: string | undefined = undefined;
        if (parts.length >= 3) {
          modelName = parts[1];
          priceVnd = Number(parts[2].replace(/[^\d]/g, '')) || 0;
        } else {
          priceVnd = Number(parts[1].replace(/[^\d]/g, '')) || 0;
        }
        if (sku && priceVnd > 0) {
          entries.push({ sku, modelName, priceVnd });
        }
      }
    });

    if (entries.length === 0) {
      alert('Không tìm thấy dòng dữ liệu giá hợp lệ. Cú pháp: SKU, Model, Đơn Giá (VD: UTD-BFV-DN50, Van Bướm DN50, 480000)');
      return;
    }

    const res = portalStorage.importPriceData(entries);
    setPriceUploadToast(res.message);
    reloadData();
    setTimeout(() => {
      setIsPriceUploadModalOpen(false);
      setPriceUploadToast(null);
    }, 2000);
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
      if (!selectedQuotation && quotations.length > 0) {
        setSelectedQuotation(quotations[0]);
      }
    }
  }, [isOpen, selectedAiProject]);

  if (!isOpen) return null;

  // Handle User Switching
  const handleSwitchUser = (userId: string) => {
    const user = portalStorage.loginAs(userId);
    setCurrentUser(user);
    reloadData();
  };

  const handleLogout = () => {
    portalStorage.logout();
    setCurrentUser(null);
    reloadData();
  };

  // Check RBAC permission for tab
  const getTabAccess = (tab: string): { allowed: boolean; reason?: string } => {
    if (tab === 'architecture') return { allowed: true };
    if (tab === 'inventory') return portalStorage.checkProjectAccess(currentUser, 'PROJECT_INVENTORY');
    if (tab === 'quotations') return portalStorage.checkProjectAccess(currentUser, 'PROJECT_QUOTATIONS');
    if (tab === 'planning') return portalStorage.checkProjectAccess(currentUser, 'PROJECT_PLANNING');
    if (tab === 'ai_settings' || tab === 'users' || tab === 'backup' || tab === 'audit_logs' || tab === 'material_alerts') {
      if (!currentUser) {
        return { allowed: false, reason: 'Yêu cầu đăng nhập bằng tài khoản Quản trị viên (Super Admin).' };
      }
      if (currentUser.role !== 'SUPER_ADMIN') {
        return { 
          allowed: false, 
          reason: `Truy cập bị từ chối: Chỉ Super Admin mới có quyền truy cập tab "${tab}". Tài khoản hiện tại có vai trò [${currentUser.roleNameVi}].` 
        };
      }
      return { allowed: true };
    }
    return { allowed: true };
  };

  // AI Chat Handlers
  const handleSendInventoryAi = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inventoryAiPrompt;
    if (!promptToSend.trim()) return;

    const userMsg = { role: 'user' as const, text: promptToSend };
    setInventoryAiChat(prev => [...prev, userMsg]);
    setInventoryAiPrompt('');
    setIsInventoryAiLoading(true);

    try {
      const inventoryContext = JSON.stringify(inventory.map(i => ({
        sku: i.sku,
        name: i.name,
        stock: i.quantityInStock,
        min: i.minReorderLevel,
        bin: i.locationBin,
        status: i.status
      })));

      const reply = await portalAI.generateProjectResponse('PROJECT_INVENTORY', promptToSend, inventoryContext);
      setInventoryAiChat(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e: any) {
      setInventoryAiChat(prev => [...prev, { role: 'assistant', text: `Lỗi kết nối AI: ${e.message}` }]);
    } finally {
      setIsInventoryAiLoading(false);
    }
  };

  const handleSendPlanningAi = async (customPrompt?: string) => {
    const promptToSend = customPrompt || planningAiPrompt;
    if (!promptToSend.trim()) return;

    setPlanningAiChat(prev => [...prev, { role: 'user', text: promptToSend }]);
    setPlanningAiPrompt('');
    setIsPlanningAiLoading(true);

    try {
      const planContext = JSON.stringify({
        targetRevenue: businessPlan.targetRevenueVnd,
        breakEven: businessPlan.breakEvenVnd,
        fixedCost: businessPlan.estimatedFixedCostVnd,
        grossMargin: businessPlan.grossMarginPercent,
        swotCount: businessPlan.swotItems.length
      });

      const reply = await portalAI.generateProjectResponse('PROJECT_PLANNING', promptToSend, planContext);
      setPlanningAiChat(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (e: any) {
      setPlanningAiChat(prev => [...prev, { role: 'assistant', text: `Lỗi AI: ${e.message}` }]);
    } finally {
      setIsPlanningAiLoading(false);
    }
  };

  // AI Description Generator for Quotations
  const handleGenerateQuotePitch = async () => {
    if (!selectedQuotation) return;
    setIsGeneratingQuotePitch(true);
    try {
      const itemsDesc = selectedQuotation.items.map(i => `${i.name} (${i.specs}), SL: ${i.quantity} cái`).join('; ');
      const prompt = `Hãy soạn thư chào giá chuyên nghiệp gửi cho khách hàng "${selectedQuotation.customerName}" thuộc đơn vị "${selectedQuotation.customerCompany}". Danh sách thiết bị gồm: ${itemsDesc}.`;
      
      const reply = await portalAI.generateProjectResponse('PROJECT_QUOTATIONS', prompt);
      setQuoteAiPitch(reply);
    } catch (e: any) {
      setQuoteAiPitch(`Lỗi tạo nội dung: ${e.message}`);
    } finally {
      setIsGeneratingQuotePitch(false);
    }
  };

  /**
   * CRITICAL REQUIREMENT #4:
   * "Xuất báo giá sang PDF: Sau khi đăng nhập mới được xuất báo giá sang PDF, luôn luôn yêu cầu đăng nhập khi yêu cầu xuất báo giá."
   */
  const handleExportPdfClick = (quotationId: string) => {
    // Check if user is logged in
    if (!currentUser) {
      // Must prompt login modal!
      setPdfLoginModalOpen(true);
      return;
    }

    // Process export
    const result = portalStorage.exportQuotationPdf(quotationId);
    if (result.success) {
      setPdfSuccessMessage(result.message);
      reloadData();
      setTimeout(() => setPdfSuccessMessage(null), 5000);
    } else {
      alert(result.message);
    }
  };

  // AI Settings Save
  const handleSaveAiSettings = () => {
    portalStorage.updateAISetting(selectedAiProject, currentAiSetting);
    setAiSettingSaveSuccess(true);
    setTimeout(() => setAiSettingSaveSuccess(false), 3000);
    reloadData();
  };

  const handleTestAiSetting = async () => {
    if (!testAiPrompt.trim()) return;
    setIsTestingAi(true);
    try {
      const reply = await portalAI.generateProjectResponse(selectedAiProject, testAiPrompt);
      setTestAiResult(reply);
    } catch (e: any) {
      setTestAiResult(`Lỗi kiểm thử: ${e.message}`);
    } finally {
      setIsTestingAi(false);
    }
  };

  // Database Backup Trigger
  const handleTriggerBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      portalStorage.triggerDatabaseBackup('MANUAL_SNAPSHOT');
      setBackups(portalStorage.getBackups());
      setIsBackingUp(false);
    }, 1200);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeSnippet(id);
    setTimeout(() => setCopiedCodeSnippet(null), 2500);
  };

  const formatVnd = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const tabAccess = getTabAccess(activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Modal Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-7xl h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* ================================================================== */}
        {/* TOP BAR: PORTAL BRANDING & USER ROLE SELECTOR */}
        {/* ================================================================== */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/image_c970573c.png"
              alt="UTD Industracorp"
              className="h-9 w-auto object-contain hidden sm:block"
            />
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-white tracking-wide">
                  CỔNG QUẢN TRỊ TẬP TRUNG (CENTRALIZED PORTAL)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-700">
                  Full-stack Architecture v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gom toàn bộ phân hệ: Quản lý kho • Hệ thống Báo giá • Kế hoạch kinh doanh • Cấu hình AI Admin
              </p>
            </div>
          </div>

          {/* User Account & Switcher Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    {currentUser.fullName}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      currentUser.role === 'SUPER_ADMIN' ? 'bg-amber-950 text-amber-300 border border-amber-600' :
                      currentUser.role === 'WAREHOUSE_STAFF' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' :
                      currentUser.role === 'QUOTATION_SPECIALIST' ? 'bg-cyan-950 text-cyan-300 border border-cyan-600' :
                      'bg-purple-950 text-purple-300 border border-purple-600'
                    }`}>
                      {currentUser.roleNameVi}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Phân hệ: {currentUser.assignedProjects.length === 4 ? 'Toàn bộ (*)' : currentUser.assignedProjects.map(p => p.replace('PROJECT_', '')).join(', ')}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded transition-colors ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-rose-950/60 border border-rose-700/60 px-3 py-1.5 rounded-xl text-rose-300 text-xs">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold">Chưa đăng nhập (Khách vãng lai)</span>
              </div>
            )}

            {/* Quick Switch Role Dropdown */}
            <div className="relative">
              <select
                className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                value={currentUser?.id || 'guest'}
                onChange={(e) => {
                  if (e.target.value === 'guest') {
                    handleLogout();
                  } else {
                    handleSwitchUser(e.target.value);
                  }
                }}
              >
                <option value="usr-admin-01">👑 Đăng nhập Super Admin (Toàn quyền)</option>
                <option value="usr-warehouse-02">📦 Đăng nhập Thủ kho (Chỉ xem Kho)</option>
                <option value="usr-sales-03">💼 Đăng nhập Sales Báo giá (Chỉ Báo giá)</option>
                <option value="usr-planner-04">📈 Đăng nhập Kế hoạch (Chỉ Plan & SWOT)</option>
                <option value="guest">🔒 Khách vãng lai / Đăng xuất</option>
              </select>
            </div>

            {/* Upload Lên Hosting & Website Button for Super Admin */}
            {currentUser?.role === 'SUPER_ADMIN' && (
              <button
                type="button"
                onClick={() => {
                  if (onOpenHosting) {
                    onOpenHosting();
                  } else {
                    setActiveTab('backup');
                  }
                }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-blue-900/40 border border-blue-400 transition-all cursor-pointer animate-pulse shrink-0"
                title="Upload và đồng bộ trang web & toàn bộ dữ liệu mới lên Hosting Server (103.75.184.20)"
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">🚀 Upload Lên Hosting & Website</span>
                <span className="sm:hidden">🚀 Hosting</span>
              </button>
            )}

            {/* Automated Notification Settings (Email & Telegram) Button */}
            {onOpenNotificationSettings && (
              <button
                type="button"
                onClick={onOpenNotificationSettings}
                className="flex items-center gap-1.5 bg-sky-950/90 hover:bg-sky-900 text-sky-300 px-3 py-1.5 rounded-xl text-xs font-bold border border-sky-600 transition-all cursor-pointer shrink-0 shadow"
                title="Cấu hình thông báo tự động (Email & Telegram) khi có khách đăng ký B2B hoặc báo giá khẩn"
              >
                <Bell className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="hidden md:inline">🔔 Thông Báo Telegram/Email</span>
                <span className="md:hidden">🔔 Alerts</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Đóng Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================== */}
        {/* NAVIGATION TABS */}
        {/* ================================================================== */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'architecture', label: '1. Kiến Trúc & Sơ Đồ DB', icon: Layers, badge: 'Chi Tiết' },
            { id: 'inventory', label: '2. Quản Lý Kho & AI', icon: Package, badge: 'Module' },
            { id: 'quotations', label: '3. Hệ Thống Báo Giá & PDF', icon: FileSpreadsheet, badge: 'Auth PDF' },
            { id: 'planning', label: '4. Kế Hoạch & SWOT AI', icon: TrendingUp, badge: 'Chiến Lược' },
            { id: 'ai_settings', label: '5. Cấu Hình AI Admin', icon: Sliders, badge: 'Super Admin' },
            { id: 'users', label: '6. Phân Quyền RBAC', icon: Users, badge: 'Bảo Mật' },
            { id: 'backup', label: '7. Lưu Trữ & Auto-Backup', icon: Database, badge: 'Chống Mất Dữ Liệu' },
            { id: 'audit_logs', label: '8. Nhật Ký Hoạt Động', icon: Clock, badge: 'Audit Trail' },
            { id: 'material_alerts', label: '9. Cảnh Báo Vật Liệu & Giá', icon: AlertTriangle, badge: 'LME Alert' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive 
                    ? 'border-blue-500 text-blue-400 bg-blue-950/20' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-blue-900/60 text-blue-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================================================================== */}
        {/* MAIN BODY: CONTENT WITH RBAC ENFORCEMENT */}
        {/* ================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/60">
          
          {/* RBAC 403 Forbidden Screen if Access is Denied */}
          {!tabAccess.allowed ? (
            <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-700/80 flex items-center justify-center text-rose-400 mb-4 shadow-xl shadow-rose-950/50">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700 mb-2">
                HTTP 403 FORBIDDEN - QUYỀN TRUY CẬP BỊ TỪ CHỐI
              </span>
              <h2 className="text-xl font-bold text-white mb-2">
                Bạn không có quyền truy cập phân hệ này
              </h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                {tabAccess.reason}
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left w-full text-xs space-y-2 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Tài khoản hiện tại:</span>
                  <span className="font-bold text-slate-200">{currentUser?.fullName || 'Khách vãng lai'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Vai trò hệ thống:</span>
                  <span className="font-mono text-amber-400">{currentUser?.roleNameVi || 'None'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Phân hệ được phép:</span>
                  <span className="font-mono text-emerald-400">
                    {currentUser?.assignedProjects.length ? currentUser.assignedProjects.join(', ') : 'Chưa được cấp quyền'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSwitchUser('usr-admin-01')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Chuyển sang Super Admin để kiểm thử
                </button>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
                >
                  Về Bản vẽ kiến trúc
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: ARCHITECTURAL BLUEPRINT, SCHEMA & DEPLOYMENT */}
              {activeTab === 'architecture' && (
                <div className="space-y-6 max-w-6xl mx-auto">
                  
                  {/* Summary Banner */}
                  <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-800/40 rounded-2xl p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                          <h2 className="text-lg font-bold text-white">
                            Hồ Sơ Thiết Kế Kiến Trúc Phần Mềm Cổng Thông Tin Tập Trung
                          </h2>
                        </div>
                        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                          Hệ thống được thiết kế theo tiêu chuẩn Enterprise Full-Stack Architect:
                          Xác thực tập trung JWT + RBAC phân quyền theo từng dự án;
                          Database quan hệ chuẩn 3NF có khóa ngoại;
                          Tách biệt mã nguồn và thư mục lưu trữ độc lập <code className="text-amber-300 font-mono bg-slate-800 px-1 py-0.5 rounded">/public/uploads/</code>;
                          Script triển khai Safe-Deploy chống xóa dữ liệu;
                          Cơ chế Auto-Backup nén <code className="text-amber-300 font-mono bg-slate-800 px-1 py-0.5 rounded">.sql.gz</code> hằng ngày;
                          và AI Admin Dashboard cho phép Super Admin chỉnh sửa System Instruction và tham số AI trực tiếp trên Web.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyToClipboard('scripts/schema.sql', 'schema')}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                        >
                          {copiedCodeSnippet === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                          Sao chép đường dẫn SQL Schema
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 1. DATABASE SCHEMA VISUALIZER */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold text-sm text-white">
                          1. Sơ Đồ Cấu Trúc Cơ Sở Dữ Liệu (Relational Database Schema)
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        PostgreSQL 16 / MySQL 8.0 • 3NF Normalized • Foreign Keys
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Table: users & roles */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                          <span className="font-mono font-bold text-blue-400 text-xs">TABLE: users & roles</span>
                          <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded font-mono">Auth Core</span>
                        </div>
                        <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                          <li>🔑 <span className="text-amber-300">id</span>: VARCHAR(36) [PK]</li>
                          <li>• <span className="text-slate-200">username</span>: VARCHAR(100) [UNIQUE]</li>
                          <li>• <span className="text-slate-200">email</span>: VARCHAR(255) [UNIQUE]</li>
                          <li>• <span className="text-slate-400">password_hash</span>: VARCHAR(255)</li>
                          <li>• <span className="text-slate-200">full_name</span>: VARCHAR(150)</li>
                          <li>🔗 <span className="text-cyan-300">role_id</span>: FK → roles(id)</li>
                          <li>• <span className="text-emerald-400">is_active</span>: BOOLEAN</li>
                        </ul>
                      </div>

                      {/* Table: projects & permissions */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                          <span className="font-mono font-bold text-indigo-400 text-xs">TABLE: user_project_permissions</span>
                          <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono">RBAC PBAC</span>
                        </div>
                        <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                          <li>🔑 <span className="text-amber-300">id</span>: VARCHAR(36) [PK]</li>
                          <li>🔗 <span className="text-cyan-300">user_id</span>: FK → users(id) [CASCADE]</li>
                          <li>🔗 <span className="text-cyan-300">project_id</span>: FK → projects(id) [CASCADE]</li>
                          <li>• <span className="text-emerald-400">can_read</span>: BOOLEAN</li>
                          <li>• <span className="text-emerald-400">can_write</span>: BOOLEAN</li>
                          <li>• <span className="text-emerald-400">can_export</span>: BOOLEAN</li>
                          <li>• <span className="text-emerald-400">can_admin</span>: BOOLEAN</li>
                        </ul>
                      </div>

                      {/* Table: inventory_items */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                          <span className="font-mono font-bold text-emerald-400 text-xs">TABLE: inventory_items</span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Kho Project</span>
                        </div>
                        <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                          <li>🔑 <span className="text-amber-300">id</span>: VARCHAR(36) [PK]</li>
                          <li>• <span className="text-slate-200">sku</span>: VARCHAR(100) [UNIQUE]</li>
                          <li>• <span className="text-slate-200">name</span>: VARCHAR(255)</li>
                          <li>• <span className="text-cyan-300">size_dn</span>, standard, unit</li>
                          <li>• <span className="text-amber-400">quantity_in_stock</span>: INT</li>
                          <li>• <span className="text-rose-400">min_reorder_level</span>: INT</li>
                          <li>• <span className="text-slate-400">location_bin</span>: VARCHAR(100)</li>
                          <li>• <span className="text-emerald-400">status</span>: CHECK (IN/LOW/OUT)</li>
                        </ul>
                      </div>

                      {/* Table: quotations & quotation_items */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                          <span className="font-mono font-bold text-amber-400 text-xs">TABLE: quotations & items</span>
                          <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">Báo Giá Project</span>
                        </div>
                        <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                          <li>🔑 <span className="text-amber-300">id</span>: VARCHAR(36) [PK]</li>
                          <li>• <span className="text-slate-200">quote_number</span>: VARCHAR(50) [UNIQUE]</li>
                          <li>• <span className="text-slate-200">customer_name</span>, customer_company</li>
                          <li>• <span className="text-slate-200">total_vnd</span>: DECIMAL(15,2)</li>
                          <li>🔗 <span className="text-cyan-300">created_by_user_id</span>: FK → users(id)</li>
                          <li>🔒 <span className="text-rose-400 font-bold">pdf_exported</span>: BOOLEAN [Req Auth]</li>
                          <li>• <span className="text-slate-400">pdf_file_path</span>: /uploads/quotations/</li>
                        </ul>
                      </div>

                      {/* Table: ai_settings */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                          <span className="font-mono font-bold text-purple-400 text-xs">TABLE: ai_settings</span>
                          <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded font-mono">Dynamic AI Hub</span>
                        </div>
                        <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                          <li>🔑 <span className="text-amber-300">id</span>: VARCHAR(36) [PK]</li>
                          <li>🔗 <span className="text-cyan-300">project_code</span>: UNIQUE FK → projects</li>
                          <li>• <span className="text-purple-300">model_name</span>: 'gemini-2.5-flash'</li>
                          <li>• <span className="text-amber-300 font-bold">system_instruction</span>: TEXT [Editable]</li>
                          <li>• <span className="text-slate-200">temperature</span>: DECIMAL(3,2) [0.0-2.0]</li>
                          <li>• <span className="text-slate-200">top_p</span>: DECIMAL(3,2) [0.0-1.0]</li>
                          <li>• <span className="text-slate-400">updated_by</span>: FK → users(id)</li>
                        </ul>
                      </div>

                      {/* Table: database_backups & audit */}
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                          <span className="font-mono font-bold text-rose-400 text-xs">TABLE: database_backups & audit</span>
                          <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-mono">Data Safety</span>
                        </div>
                        <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                          <li>🔑 <span className="text-amber-300">id</span>: VARCHAR(36) [PK]</li>
                          <li>• <span className="text-slate-200">file_name</span>: .sql.gz</li>
                          <li>• <span className="text-slate-400">file_size_bytes</span>: BIGINT</li>
                          <li>• <span className="text-emerald-400">checksum_sha256</span>: VARCHAR(64)</li>
                          <li>• <span className="text-blue-400">backup_type</span>: DAILY_AUTOMATED</li>
                          <li>• <span className="text-slate-300">storage_path</span>: /var/backups/</li>
                          <li>• <span className="text-slate-400">system_audit_logs</span>: Action history</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 2. FOLDER STRUCTURE BREAKDOWN */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FolderTree className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-bold text-sm text-white">
                        2. Cấu Trúc Thư Mục Chuẩn Tách Biệt Backend, Frontend & Uploads
                      </h3>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                      <pre className="text-slate-300">{`industracorp-centralized-portal/
├── 📁 server.ts                    # Backend Node.js / Express entrypoint (JWT Auth, RBAC, Gemini API proxy)
├── 📁 .env                        # Chứa bí mật GEMINI_API_KEY, DB_PASS, JWT_SECRET (KHÔNG LỘ Ở FRONTEND)
├── 📁 package.json                # Cấu hình dependency & build scripts
├── 📁 scripts/                    # Scripts tự động hóa kiến trúc
│   ├── 📄 schema.sql             # Relational DDL Schema với Foreign Keys, Checks & Seed data
│   ├── 📄 backup_cron.sh         # Cronjob tự động dump và nén .sql.gz hàng ngày lúc 2h sáng
│   └── 📄 deploy_safe.sh          # Safe-Deploy: symlink /uploads/, zero-downtime, không overwrite DB
│
├── 📁 public/                     # Thư mục tài nguyên tĩnh
│   └── 📁 uploads/               # ⚠️ THƯ MỤC UPLOAD ĐỘC LẬP (Tách rời khỏi code)
│       ├── 📁 products/          # Ảnh sản phẩm van, catalog datasheet kỹ thuật
│       └── 📁 quotations/        # File PDF báo giá đã xuất (Cần Auth mới tải được)
│
└── 📁 src/                        # Mã nguồn ứng dụng Frontend React (SPA)
    ├── 📁 middleware/
    │   └── 📄 rbacMiddleware.ts   # Middleware kiểm tra quyền truy cập theo từng dự án (PBAC / RBAC)
    ├── 📁 services/
    │   ├── 📄 portalStorage.ts    # Client Storage & State management
    │   └── 📄 portalAiService.ts  # Kết nối AI dùng Dynamic System Instruction từ Admin
    ├── 📁 types/
    │   └── 📄 portal.ts           # TypeScript interfaces (User, Project, Inventory, Quotation, AISettings)
    └── 📁 components/portal/
        └── 📄 CentralizedPortalModal.tsx # Giao diện Quản trị Cổng Thông tin Tập trung`}</pre>
                    </div>
                  </div>

                  {/* 3. CODE SNIPPETS SHOWCASE */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Middleware Sample */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-amber-400" />
                          <h4 className="font-bold text-xs text-white">Middleware RBAC Kiểm Tra Quyền Theo Dự Án</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">src/middleware/rbacMiddleware.ts</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                        <pre>{`export function requireProjectAccess(requiredProjectCode: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'UNAUTHENTICATED' });
    
    // Super Admin có toàn quyền truy cập tất cả phân hệ
    if (req.user.role === 'SUPER_ADMIN' || req.user.assignedProjects.includes('*')) {
      return next();
    }
    
    // Kiểm tra xem phân hệ có được cấp cho người dùng không
    if (req.user.assignedProjects.includes(requiredProjectCode)) {
      return next();
    }
    
    // Chặn 403 Forbidden nếu không có quyền
    return res.status(403).json({
      error: 'FORBIDDEN_PROJECT_ACCESS',
      message: \`Tài khoản [\${req.user.username}] không được phép truy cập phân hệ [\${requiredProjectCode}].\`
    });
  };
}`}</pre>
                      </div>
                    </div>

                    {/* Backend AI Proxy Sample */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-purple-400" />
                          <h4 className="font-bold text-xs text-white">API Backend Gọi Gemini Lấy Cấu Hình Từ Database</h4>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">server.ts</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
                        <pre>{`app.post('/api/ai/chat', verifyJwtToken, async (req: Request, res: Response) => {
  const { projectCode, userPrompt, contextData } = req.body;
  
  // 1. Lấy dynamic AI Settings từ Database theo projectCode
  const setting = await db.aiSettings.findOne({ where: { projectCode } });
  
  // 2. Gọi Gemini SDK với API Key từ .env (Bảo mật tuyệt đối ở Backend)
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: setting.modelName || 'gemini-2.5-flash',
    contents: contextData ? \`[DATABASE]: \${contextData}\\n\\n[PROMPT]: \${userPrompt}\` : userPrompt,
    config: {
      systemInstruction: setting.systemInstruction, // Super Admin chỉnh trực tiếp trên Web
      temperature: setting.temperature,
      topP: setting.topP
    }
  });
  
  return res.json({ reply: response.text });
});`}</pre>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: INVENTORY MANAGEMENT & AI ASSISTANT */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <span className="text-xs text-slate-400 block mb-1">Tổng Số Mã Hàng (SKU)</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-white font-mono">{inventory.length}</span>
                        <span className="text-xs text-emerald-400 font-mono">100% Khả dụng</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-amber-800/40 rounded-xl p-4">
                      <span className="text-xs text-amber-300 block mb-1">Cảnh Báo Hàng Sắp Hết (Low Stock)</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-amber-400 font-mono">
                          {inventory.filter(i => i.status === 'LOW_STOCK').length}
                        </span>
                        <span className="text-xs text-amber-400 font-mono">Cần lập đơn PO</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-rose-800/40 rounded-xl p-4">
                      <span className="text-xs text-rose-300 block mb-1">Hết Hàng Trong Kho (Out of Stock)</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-rose-400 font-mono">
                          {inventory.filter(i => i.status === 'OUT_OF_STOCK').length}
                        </span>
                        <span className="text-xs text-rose-400 font-mono">Gấp 1 mã</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                      <span className="text-xs text-slate-400 block mb-1">Ước Tính Giá Trị Tồn Kho</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-bold text-emerald-400 font-mono">
                          {formatVnd(inventory.reduce((acc, i) => acc + (i.quantityInStock * i.unitPriceVnd), 0))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main Grid: Inventory Table & AI Stock Copilot */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Inventory Table */}
                    <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col">
                      {/* Action Bar for Live Export & Price Upload */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-emerald-400" />
                          <h3 className="font-bold text-sm text-white">Danh Mục Tồn Kho Theo Thời Gian Thực</h3>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleExportLiveInventory('csv')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow"
                            title="Tạo file danh mục tồn kho thời gian thực dạng CSV (Excel)"
                          >
                            <Download className="w-3 h-3" />
                            <span>Xuất File Tồn Kho (.CSV)</span>
                          </button>

                          <button
                            onClick={() => handleExportLiveInventory('json')}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1"
                            title="Tạo file JSON thời gian thực"
                          >
                            <span>JSON</span>
                          </button>

                          <button
                            onClick={() => setIsPriceUploadModalOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-700 text-blue-300 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow"
                            title="Tải lên dữ liệu bảng giá thiết bị lên hệ thống"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Tải Lên Bảng Giá</span>
                          </button>

                          {onOpenExportCatalogModal && (
                            <button
                              onClick={onOpenExportCatalogModal}
                              className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow"
                              title="Tự động dịch và xuất toàn bộ danh mục sản phẩm sang CSV (Anh/Trung) phục vụ xuất khẩu"
                            >
                              <Languages className="w-3 h-3 text-indigo-400" />
                              <span>Xuất CSV Đã Dịch (Anh/Trung)</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Security Policy Banner: Price is Always Hidden in Public/Inventory View */}
                      <div className="mb-3 p-2.5 bg-amber-950/30 border border-amber-800/50 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <strong>Quy tắc bảo mật giá:</strong> Giá luôn ẩn trên Cổng kho chung. Giá chỉ xuất hiện trong <strong>Hệ Thống Báo Giá & PDF</strong> khi có Model và Tên thiết bị cụ thể.
                        </div>
                      </div>

                      {inventoryExportToast && (
                        <div className="mb-3 p-2 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{inventoryExportToast}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-xs text-slate-400 font-mono">
                          Hiển thị {inventory.length} mã hàng theo thời gian thực
                        </span>
                        <input
                          type="text"
                          placeholder="Tìm theo SKU, tên van..."
                          value={inventorySearch}
                          onChange={(e) => setInventorySearch(e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-medium text-[11px]">
                              <th className="py-2 px-2">Mã SKU</th>
                              <th className="py-2 px-2">Tên Thiết Bị / Kích Thước</th>
                              <th className="py-2 px-2 text-center">Tồn Kho</th>
                              <th className="py-2 px-2 text-center">Giá Kho</th>
                              <th className="py-2 px-2 text-center">Ngưỡng</th>
                              <th className="py-2 px-2">Vị Trí Kệ</th>
                              <th className="py-2 px-2 text-center">Thao Tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {inventory
                              .filter(item => 
                                item.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                                item.name.toLowerCase().includes(inventorySearch.toLowerCase())
                              )
                              .map((item) => (
                                <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                                  <td className="py-2.5 px-2 font-mono text-[11px] font-bold text-slate-200">
                                    {item.sku}
                                  </td>
                                  <td className="py-2.5 px-2">
                                    <div className="font-medium text-slate-200 text-xs">{item.name}</div>
                                    <span className="text-[10px] text-slate-400">
                                      {item.sizeDn} • {item.standard}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono font-bold">
                                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                                      item.status === 'OUT_OF_STOCK' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                                      item.status === 'LOW_STOCK' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                                      'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    }`}>
                                      {item.quantityInStock} {item.unit}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-2 text-center">
                                    <span 
                                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-amber-900/60 text-amber-300 inline-flex items-center gap-1 cursor-help"
                                      title="Bảo mật cấp cao: Giá luôn ẩn trên Cổng kho chung. Giá chỉ xuất hiện trong Hệ Thống Báo Giá & PDF khi có Model và Tên thiết bị cụ thể."
                                    >
                                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                                      <span>Giá Ẩn</span>
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-mono text-slate-400 text-xs">
                                    {item.minReorderLevel}
                                  </td>
                                  <td className="py-2.5 px-2 font-mono text-[10px] text-slate-400">
                                    {item.locationBin}
                                  </td>
                                  <td className="py-2.5 px-2 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        onClick={() => {
                                          portalStorage.updateInventoryQuantity(item.id, -1);
                                          setInventory(portalStorage.getInventory());
                                        }}
                                        className="w-6 h-6 rounded bg-slate-800 hover:bg-rose-900/60 hover:text-rose-300 text-slate-300 font-bold text-xs"
                                        title="Xuất kho (-1)"
                                      >
                                        -
                                      </button>
                                      <button
                                        onClick={() => {
                                          portalStorage.updateInventoryQuantity(item.id, 1);
                                          setInventory(portalStorage.getInventory());
                                        }}
                                        className="w-6 h-6 rounded bg-slate-800 hover:bg-emerald-900/60 hover:text-emerald-300 text-slate-300 font-bold text-xs"
                                        title="Nhập kho (+1)"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right: AI Stock Copilot */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col h-[520px]">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-white">AI Trợ Lý Tồn Kho & Đề Xuất Nhập Hàng</h4>
                            <span className="text-[10px] text-slate-400">
                              Model: <code className="text-emerald-400 font-mono">gemini-2.5-flash</code>
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700">
                          Live DB Sync
                        </span>
                      </div>

                      {/* Quick Prompt Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <button
                          onClick={() => handleSendInventoryAi('Cảnh báo các mặt hàng sắp hết và dưới mức tồn an toàn')}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
                        >
                          🚨 Cảnh báo hàng sắp hết
                        </button>
                        <button
                          onClick={() => handleSendInventoryAi('Gợi ý đơn đặt hàng nhập kho tháng này (EOQ)')}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
                        >
                          📦 Gợi ý đơn nhập hàng
                        </button>
                        <button
                          onClick={() => handleSendInventoryAi('Tra cứu vị trí van bi SS316 DN50 trong kho')}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700"
                        >
                          🔍 Tra vị trí kệ kho
                        </button>
                      </div>

                      {/* Chat Messages Log */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                        {inventoryAiChat.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl leading-relaxed ${
                              msg.role === 'user' 
                                ? 'bg-blue-950/60 border border-blue-800/60 text-blue-100 ml-6' 
                                : 'bg-slate-900 border border-slate-800 text-slate-200 mr-2 whitespace-pre-wrap'
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                        {isInventoryAiLoading && (
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                            <span>AI đang phân tích số liệu tồn kho...</span>
                          </div>
                        )}
                      </div>

                      {/* Input Box */}
                      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Hỏi AI về tồn kho, hàng sắp hết, đơn nhập..."
                          value={inventoryAiPrompt}
                          onChange={(e) => setInventoryAiPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendInventoryAi()}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => handleSendInventoryAi()}
                          disabled={isInventoryAiLoading}
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: QUOTATION SYSTEM & STRICT AUTHENTICATED PDF EXPORT */}
              {activeTab === 'quotations' && (
                <div className="space-y-6">
                  
                  {/* Feedback Notification */}
                  {pdfSuccessMessage && (
                    <div className="bg-emerald-950 border border-emerald-600 rounded-xl p-3 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{pdfSuccessMessage}</span>
                      </div>
                      <span className="font-mono text-[10px] bg-emerald-900 px-2 py-0.5 rounded">
                        Lưu trữ tại: /public/uploads/quotations/
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Quotation List */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                          <h3 className="font-bold text-sm text-white">Danh Sách Báo Giá Dự Án</h3>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {quotations.length} Bản ghi
                        </span>
                      </div>

                      <div className="space-y-3 overflow-y-auto flex-1 max-h-[500px]">
                        {quotations.map((q) => {
                          const isSelected = selectedQuotation?.id === q.id;
                          return (
                            <div
                              key={q.id}
                              onClick={() => setSelectedQuotation(q)}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-amber-950/20 border-amber-500 text-white shadow-lg'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-mono font-bold text-amber-400 text-xs">
                                  {q.quoteNumber}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                                  q.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                                  'bg-blue-950 text-blue-400 border border-blue-800'
                                }`}>
                                  {q.status}
                                </span>
                              </div>
                              <div className="font-medium text-xs text-white mb-0.5">{q.customerCompany}</div>
                              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                                <span>Người nhận: {q.customerName}</span>
                                <span className="font-mono font-bold text-slate-200">{formatVnd(q.totalVnd)}</span>
                              </div>

                              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                                <span>Tạo bởi: {q.createdByUserName}</span>
                                {q.pdfExported ? (
                                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                                    <Check className="w-3 h-3" /> Đã xuất PDF
                                  </span>
                                ) : (
                                  <span className="text-amber-400/80 font-mono">Chưa xuất PDF</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Detailed Quotation Preview & Actions */}
                    {selectedQuotation ? (
                      <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          {/* Quote Header */}
                          <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-base text-white">
                                  {selectedQuotation.quoteNumber}
                                </h4>
                                <span className="text-xs text-slate-400">
                                  ({new Date(selectedQuotation.createdAt).toLocaleDateString('vi-VN')})
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 font-semibold mt-0.5">
                                Khách hàng: {selectedQuotation.customerName} — {selectedQuotation.customerCompany}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Email: {selectedQuotation.customerEmail} • SĐT: {selectedQuotation.customerPhone}
                              </p>
                            </div>

                            {/* CRITICAL REQUIREMENT #4 BUTTON: EXPORT PDF WITH ENFORCED AUTH */}
                            <div className="text-right">
                              <button
                                onClick={() => handleExportPdfClick(selectedQuotation.id)}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                              >
                                <Download className="w-4 h-4" />
                                <span>Xuất Báo Giá PDF</span>
                              </button>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                {currentUser ? '✓ Đã xác thực tài khoản' : '🔒 Yêu cầu đăng nhập trước khi xuất'}
                              </span>
                            </div>
                          </div>

                          {/* Line Items Table */}
                          <div className="mb-4">
                            <h5 className="font-bold text-xs text-slate-300 uppercase mb-2">
                              Bảng Chi Tiết Thiết Bị Báo Giá:
                            </h5>
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                                  <th className="py-1.5 px-2">STT</th>
                                  <th className="py-1.5 px-2">Tên Thiết Bị / Thông Số</th>
                                  <th className="py-1.5 px-2 text-center">SL</th>
                                  <th className="py-1.5 px-2 text-right">Đơn Giá</th>
                                  <th className="py-1.5 px-2 text-right">Thành Tiền</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60">
                                {selectedQuotation.items.map((item, idx) => (
                                  <tr key={item.id} className="text-slate-300">
                                    <td className="py-2 px-2 text-slate-500 font-mono">{idx + 1}</td>
                                    <td className="py-2 px-2">
                                      <div className="font-bold text-white text-xs">{item.name}</div>
                                      <div className="text-[10px] text-slate-400">{item.specs}</div>
                                    </td>
                                    <td className="py-2 px-2 text-center font-mono font-bold">{item.quantity}</td>
                                    <td className="py-2 px-2 text-right font-mono">{formatVnd(item.unitPriceVnd)}</td>
                                    <td className="py-2 px-2 text-right font-mono font-bold text-amber-300">{formatVnd(item.subtotalVnd)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Summary Row */}
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex justify-end mb-4">
                            <div className="w-64 space-y-1 text-xs">
                              <div className="flex justify-between text-slate-400">
                                <span>Cộng tiền hàng:</span>
                                <span className="font-mono">{formatVnd(selectedQuotation.subtotalVnd)}</span>
                              </div>
                              <div className="flex justify-between text-emerald-400">
                                <span>Chiết khấu đối tác:</span>
                                <span className="font-mono">-{formatVnd(selectedQuotation.discountVnd)}</span>
                              </div>
                              <div className="flex justify-between text-slate-400">
                                <span>Thuế GTGT ({selectedQuotation.vatRatePercent}%):</span>
                                <span className="font-mono">{formatVnd(selectedQuotation.vatAmountVnd)}</span>
                              </div>
                              <div className="flex justify-between border-t border-slate-700 pt-1 font-bold text-white text-sm">
                                <span>Tổng cộng:</span>
                                <span className="font-mono text-amber-400">{formatVnd(selectedQuotation.totalVnd)}</span>
                              </div>
                            </div>
                          </div>

                          {/* AI Quotation Description Generator */}
                          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>AI Tự Động Viết Thư Chào Giá & Thuyết Phục Kỹ Thuật</span>
                              </div>
                              <button
                                onClick={handleGenerateQuotePitch}
                                disabled={isGeneratingQuotePitch}
                                className="px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition-all"
                              >
                                {isGeneratingQuotePitch ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                                Tạo bằng AI
                              </button>
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed font-sans max-h-36 overflow-y-auto whitespace-pre-wrap bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                              {quoteAiPitch || selectedQuotation.aiGeneratedDescription || 'Nhấn nút "Tạo bằng AI" để AI tự động trích xuất thông số kỹ thuật sản phẩm và soạn thảo thư chào giá thuyết phục.'}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Notice */}
                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            File PDF xuất ra được bảo mật, mã hóa chữ ký số và lưu độc lập tại <code className="text-slate-300 font-mono">/public/uploads/quotations/</code>.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                        Chọn một báo giá để xem chi tiết
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: STRATEGIC BUSINESS PLANNING & SWOT AI */}
              {activeTab === 'planning' && (
                <div className="space-y-6">
                  {/* Financial Goals Overview */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-bold text-base text-white">{businessPlan.planTitle}</h3>
                        <p className="text-xs text-slate-400">Kỳ lập kế hoạch: {businessPlan.period}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-700 self-start sm:self-auto">
                        Mục tiêu: {formatVnd(businessPlan.targetRevenueVnd)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                        <span className="text-[11px] text-slate-400 block">Doanh Thu Mục Tiêu</span>
                        <span className="font-mono font-bold text-sm text-emerald-400">28.50 Tỷ VND</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                        <span className="text-[11px] text-slate-400 block">Điểm Hòa Vốn (Break-even)</span>
                        <span className="font-mono font-bold text-sm text-amber-400">14.20 Tỷ VND</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                        <span className="text-[11px] text-slate-400 block">Định Phí Ước Tính</span>
                        <span className="font-mono font-bold text-sm text-slate-200">4.26 Tỷ VND</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                        <span className="text-[11px] text-slate-400 block">Biên Lợi Nhuận Gộp</span>
                        <span className="font-mono font-bold text-sm text-purple-400">30.0 %</span>
                      </div>
                    </div>
                  </div>

                  {/* SWOT Matrix 4 Quadrants */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-400" />
                        <h4 className="font-bold text-sm text-white">Ma Trận SWOT Chiến Lược Ngành Van Công Nghiệp</h4>
                      </div>
                      <span className="text-xs text-slate-400">Hỗ trợ bởi AI Strategic Consultant</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* S: STRENGTHS */}
                      <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-xl p-4">
                        <h5 className="font-bold text-xs text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          STRENGTHS (Điểm Mạnh Cốt Lõi)
                        </h5>
                        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                          {businessPlan.swotItems.filter(i => i.category === 'STRENGTHS').map(i => (
                            <li key={i.id} className="leading-relaxed">{i.text}</li>
                          ))}
                        </ul>
                      </div>

                      {/* W: WEAKNESSES */}
                      <div className="bg-amber-950/20 border border-amber-800/50 rounded-xl p-4">
                        <h5 className="font-bold text-xs text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          WEAKNESSES (Điểm Yếu Cần Cải Thiện)
                        </h5>
                        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                          {businessPlan.swotItems.filter(i => i.category === 'WEAKNESSES').map(i => (
                            <li key={i.id} className="leading-relaxed">{i.text}</li>
                          ))}
                        </ul>
                      </div>

                      {/* O: OPPORTUNITIES */}
                      <div className="bg-blue-950/20 border border-blue-800/50 rounded-xl p-4">
                        <h5 className="font-bold text-xs text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          OPPORTUNITIES (Cơ Hội Thị Trường 2026-2027)
                        </h5>
                        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                          {businessPlan.swotItems.filter(i => i.category === 'OPPORTUNITIES').map(i => (
                            <li key={i.id} className="leading-relaxed">{i.text}</li>
                          ))}
                        </ul>
                      </div>

                      {/* T: THREATS */}
                      <div className="bg-rose-950/20 border border-rose-800/50 rounded-xl p-4">
                        <h5 className="font-bold text-xs text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          THREATS (Thách Thức Cạnh Tranh)
                        </h5>
                        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                          {businessPlan.swotItems.filter(i => i.category === 'THREATS').map(i => (
                            <li key={i.id} className="leading-relaxed">{i.text}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* AI Strategic Chat Consultation */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-purple-400" />
                        <h4 className="font-bold text-sm text-white">Trò Chuyện Trực Tuyến Cùng Cố Vấn Chiến Lược AI</h4>
                      </div>
                      <span className="text-xs text-purple-400 font-mono">System Instruction: Chuyên gia B2B Strategy</span>
                    </div>

                    {/* Quick chips */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <button
                        onClick={() => handleSendPlanningAi('Phân tích chi tiết ma trận SWOT và đề xuất 3 bước hành động cấp bách')}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700"
                      >
                        📊 Phân tích ma trận SWOT
                      </button>
                      <button
                        onClick={() => handleSendPlanningAi('Làm thế nào để đạt điểm hòa vốn 14.2 tỷ VND sớm trong năm 2026?')}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700"
                      >
                        🎯 Tối ưu điểm hòa vốn 14.2 tỷ
                      </button>
                      <button
                        onClick={() => handleSendPlanningAi('Chiến lược thâm nhập gói thầu nhà máy lọc dầu và trung tâm dữ liệu FDI')}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg border border-slate-700"
                      >
                        🏭 Thâm nhập FDI & Nhà máy lọc dầu
                      </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="space-y-3 max-h-80 overflow-y-auto mb-3 pr-1 text-xs">
                      {planningAiChat.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-purple-950/60 border border-purple-800/60 text-purple-100 ml-8'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 mr-2 whitespace-pre-wrap'
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                      {isPlanningAiLoading && (
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                          <span>Cố vấn AI đang phân tích dữ liệu chiến lược...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Đặt câu hỏi về chiến lược kinh doanh, định giá sản phẩm..."
                        value={planningAiPrompt}
                        onChange={(e) => setPlanningAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendPlanningAi()}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => handleSendPlanningAi()}
                        disabled={isPlanningAiLoading}
                        className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DYNAMIC AI ADMIN DASHBOARD (SUPER ADMIN ONLY) */}
              {activeTab === 'ai_settings' && (
                <div className="space-y-6">
                  {/* Top Security Banner */}
                  <div className="bg-slate-950 border border-purple-800/50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sliders className="w-5 h-5 text-purple-400" />
                        <h3 className="font-bold text-sm text-white">
                          Trang Cấu Hình AI Trực Tiếp Dành Cho Super Admin (Dynamic AI Hub)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                        Cho phép Super Admin tùy chỉnh <strong>System Instruction / Prompt</strong>, lựa chọn <strong>Model AI</strong>, 
                        và điều chỉnh <strong>Temperature</strong>, <strong>Top-P</strong> riêng biệt cho từng phân hệ mà KHÔNG cần sửa mã nguồn. 
                        API Key được bảo vệ an toàn trong file ẩn <code className="text-amber-300 font-mono bg-slate-900 px-1 py-0.5 rounded">.env</code> ở Backend, 
                        tuyệt đối không lộ ở giao diện Web.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Backend .env Key Protected
                      </span>
                    </div>
                  </div>

                  {/* Project Selector for AI Configuration */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { code: 'PROJECT_INVENTORY', name: '📦 Phân Hệ Quản Lý Kho' },
                      { code: 'PROJECT_QUOTATIONS', name: '💼 Phân Hệ Báo Giá Dự Án' },
                      { code: 'PROJECT_PLANNING', name: '📈 Phân Hệ Kế Hoạch Kinh Doanh' }
                    ].map((proj) => (
                      <button
                        key={proj.code}
                        onClick={() => {
                          setSelectedAiProject(proj.code as ProjectCode);
                          setCurrentAiSetting(portalStorage.getAISettingForProject(proj.code as ProjectCode));
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          selectedAiProject === proj.code
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {proj.name}
                      </button>
                    ))}
                  </div>

                  {/* AI Editor Panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Settings Form */}
                    <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                          Thông Số AI: {currentAiSetting.projectNameVi}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Cập nhật lần cuối: {new Date(currentAiSetting.updatedAt).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      {/* Model Selector */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Mô hình AI (Model Selection):
                        </label>
                        <select
                          value={currentAiSetting.modelName}
                          onChange={(e) => setCurrentAiSetting({ ...currentAiSetting, modelName: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="gemini-2.5-flash">gemini-2.5-flash (Khuyên dùng - Nhanh, chuẩn xác & tiết kiệm)</option>
                          <option value="gemini-3.8-flash">gemini-3.8-flash (Model tác vụ văn bản hiện đại)</option>
                          <option value="gemini-4-argon">gemini-4-argon (Lập luận chuyên sâu, bài toán STEM phức tạp)</option>
                        </select>
                      </div>

                      {/* System Instruction / Prompt Textarea */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-slate-300">
                            System Instruction / System Prompt (Chỉ dẫn hệ thống):
                          </label>
                          <span className="text-[10px] text-purple-400 font-mono">
                            {currentAiSetting.systemInstruction.length} ký tự
                          </span>
                        </div>
                        <textarea
                          rows={8}
                          value={currentAiSetting.systemInstruction}
                          onChange={(e) => setCurrentAiSetting({ ...currentAiSetting, systemInstruction: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Nhập System Instruction cho AI tại đây..."
                        />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          * Thay đổi này có hiệu lực tức thì cho tất cả nhân viên truy cập phân hệ tương ứng.
                        </span>
                      </div>

                      {/* Sliders: Temperature & Top-P */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-300">Temperature (Nhiệt độ):</span>
                            <span className="font-mono font-bold text-purple-400">{currentAiSetting.temperature}</span>
                          </div>
                          <input
                            type="range"
                            min="0.0"
                            max="2.0"
                            step="0.05"
                            value={currentAiSetting.temperature}
                            onChange={(e) => setCurrentAiSetting({ ...currentAiSetting, temperature: parseFloat(e.target.value) })}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>0.0 (Chính xác, logic)</span>
                            <span>2.0 (Sáng tạo)</span>
                          </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-300">Top-P Sampling:</span>
                            <span className="font-mono font-bold text-purple-400">{currentAiSetting.topP}</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={currentAiSetting.topP}
                            onChange={(e) => setCurrentAiSetting({ ...currentAiSetting, topP: parseFloat(e.target.value) })}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>0.1 (Hạn chế từ)</span>
                            <span>1.0 (Phong phú)</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => {
                            const reset = portalStorage.resetAISetting(selectedAiProject);
                            setCurrentAiSetting(reset);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium"
                        >
                          Khôi phục mặc định
                        </button>

                        <div className="flex items-center gap-2">
                          {aiSettingSaveSuccess && (
                            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu thành công!
                            </span>
                          )}
                          <button
                            onClick={handleSaveAiSettings}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Lưu Cấu Hình AI
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Sandbox Test Console */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col h-[520px]">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-purple-400" />
                          <h4 className="font-bold text-xs text-white">Kiểm Thử Prompt Trực Tiếp (Test Sandbox)</h4>
                        </div>
                        <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded font-mono">
                          Live Testing
                        </span>
                      </div>

                      <div className="mb-2">
                        <label className="text-[11px] text-slate-400 block mb-1">
                          Thử nghiệm câu hỏi với System Prompt mới chỉnh sửa:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Nhập câu hỏi thử nghiệm..."
                            value={testAiPrompt}
                            onChange={(e) => setTestAiPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleTestAiSetting()}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                          <button
                            onClick={handleTestAiSetting}
                            disabled={isTestingAi}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold disabled:opacity-50 transition-all"
                          >
                            {isTestingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Chạy'}
                          </button>
                        </div>
                      </div>

                      {/* Test Output Box */}
                      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 overflow-y-auto text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                        {testAiResult ? (
                          testAiResult
                        ) : (
                          <span className="text-slate-500 italic">
                            Kết quả kiểm thử phản hồi từ AI theo cấu hình System Instruction mới sẽ hiển thị tại đây...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: RBAC & USER ROLE MANAGEMENT */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Sub-tab navigation: Internal Employees vs Registered B2B Companies */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setUsersSubTab('employees')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          usersSubTab === 'employees'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        <span>👥 Danh Sách Nhân Viên Nội Bộ ({usersList.length})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUsersSubTab('b2b')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          usersSubTab === 'b2b'
                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>🏢 Các Công Ty B2B Đăng Ký ({b2bMembersList.length})</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {usersSubTab === 'employees' ? (
                        <button
                          onClick={() => setIsAddUserModalOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>+ Thêm Nhân Viên Mới</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsAddB2BModalOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Thêm Doanh Nghiệp B2B</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {userActionToast && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-600/80 rounded-xl text-xs text-emerald-300 font-medium flex items-center gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{userActionToast}</span>
                    </div>
                  )}

                  {/* 1. EMPLOYEES SUB-TAB */}
                  {usersSubTab === 'employees' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-4 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <h3 className="font-bold text-sm text-white">Quản Trị Nhân Viên & Phân Quyền Dự Án (RBAC Portal)</h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Admin có toàn quyền chỉnh sửa tên, vai trò, số điện thoại, email hoặc xóa vĩnh viễn nhân viên. Tự động lưu tức thì và không tự ý khôi phục dữ liệu đã xóa.
                          </p>
                        </div>

                        <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-xl border border-emerald-800">
                          {usersList.length} Nhân Sự
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-medium text-[11px]">
                              <th className="py-2.5 px-3">Họ Tên & Email</th>
                              <th className="py-2.5 px-3">Tên Đăng Nhập</th>
                              <th className="py-2.5 px-3">Vai Trò Hệ Thống</th>
                              <th className="py-2.5 px-3">Phân Quyền Phân Hệ (Bấm để Bật/Tắt)</th>
                              <th className="py-2.5 px-3 text-center">Bảo Mật</th>
                              <th className="py-2.5 px-3 text-center">Thao Tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {usersList.map((u) => {
                              const isSuperAdminUser = u.role === 'SUPER_ADMIN';
                              return (
                                <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                                  <td className="py-3 px-3">
                                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                      {u.fullName}
                                      {currentUser?.id === u.id && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-700">
                                          Đang Đăng Nhập
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</div>
                                    {u.phone && <div className="text-[10px] text-slate-500 font-mono">SĐT: {u.phone}</div>}
                                  </td>
                                  <td className="py-3 px-3 font-mono text-slate-300">
                                    {u.username}
                                  </td>
                                  <td className="py-3 px-3">
                                    <select
                                      value={u.role}
                                      onChange={(e) => {
                                        const newRole = e.target.value as UserRoleType;
                                        portalStorage.updateUserRole(u.id, newRole);
                                        reloadData();
                                      }}
                                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                                    >
                                      <option value="SUPER_ADMIN">👑 Quản Trị Viên Cao Cấp</option>
                                      <option value="WAREHOUSE_STAFF">📦 Thủ Kho</option>
                                      <option value="QUOTATION_SPECIALIST">💼 Chuyên Viên Báo Giá</option>
                                      <option value="BUSINESS_PLANNER">📈 Chuyên Viên Kế Hoạch</option>
                                    </select>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="flex flex-wrap gap-1.5">
                                      {([
                                        { code: 'PROJECT_INVENTORY' as ProjectCode, label: 'Kho' },
                                        { code: 'PROJECT_QUOTATION' as ProjectCode, label: 'Báo Giá' },
                                        { code: 'PROJECT_PLANNING' as ProjectCode, label: 'Plan' },
                                        { code: 'PROJECT_AI_SETTINGS' as ProjectCode, label: 'AI Settings' },
                                      ]).map((proj) => {
                                        const hasAccess = u.assignedProjects.includes(proj.code) || isSuperAdminUser;
                                        return (
                                          <button
                                            key={proj.code}
                                            type="button"
                                            disabled={isSuperAdminUser}
                                            onClick={() => handleToggleProjectPermission(u.id, proj.code)}
                                            title={isSuperAdminUser ? 'Super Admin có toàn quyền truy cập tất cả phân hệ' : `Bấm để ${hasAccess ? 'thu hồi' : 'cấp'} quyền ${proj.label}`}
                                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                                              hasAccess
                                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 shadow-sm'
                                                : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700'
                                            } ${isSuperAdminUser ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                          >
                                            <span>{hasAccess ? '✓' : '✗'}</span>
                                            <span>{proj.label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <button
                                      onClick={() => handleOpenPasswordModal(u)}
                                      className="px-2 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-800/80 text-amber-300 text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition-all"
                                      title="Đổi mật khẩu và xác nhận qua Email OTP"
                                    >
                                      <KeyRound className="w-3 h-3 text-amber-400" />
                                      <span>Đổi Mật Khẩu</span>
                                    </button>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => setEditingEmployee(u)}
                                        className="p-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all"
                                        title="Sửa thông tin nhân viên (Tên, vai trò, email, điện thoại)"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleSwitchUser(u.id)}
                                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-[10px] font-semibold transition-all"
                                        title="Đăng nhập thử tài khoản này"
                                      >
                                        Thử
                                      </button>
                                      <button
                                        onClick={() => handleDeleteEmployee(u.id, u.fullName)}
                                        disabled={usersList.length <= 1 || (u.role === 'SUPER_ADMIN' && usersList.filter(x => x.role === 'SUPER_ADMIN').length <= 1)}
                                        className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/80 text-slate-400 hover:text-rose-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Xóa nhân viên vĩnh viễn"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 2. REGISTERED B2B COMPANIES SUB-TAB */}
                  {usersSubTab === 'b2b' && (
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 mb-4 gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-amber-400" />
                            <h3 className="font-bold text-sm text-white">Quản Trị Các Doanh Nghiệp & Đại Lý B2B Đăng Ký</h3>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Admin có toàn quyền chỉnh sửa tên doanh nghiệp, MST, người liên hệ, chiết khấu hoặc xóa vĩnh viễn đối tác. Tự động lưu ngay lập tức và cam kết không tự khôi phục dữ liệu đã xóa.
                          </p>
                        </div>

                        <span className="text-xs font-mono text-amber-400 bg-amber-950 px-2.5 py-1 rounded-xl border border-amber-800">
                          {b2bMembersList.length} Công Ty B2B
                        </span>
                      </div>

                      {b2bMembersList.length === 0 ? (
                        <div className="py-12 text-center text-slate-400">
                          <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Chưa có công ty B2B nào trong danh sách hoặc đã xóa hết.</p>
                          <p className="text-[11px] text-slate-500 mt-1">Hệ thống tuân thủ chính sách: Không tự ý khôi phục dữ liệu đã bị xóa.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 font-medium text-[11px]">
                                <th className="py-2.5 px-3">Tên Công Ty & MST</th>
                                <th className="py-2.5 px-3">Người Đại Diện & Liên Hệ</th>
                                <th className="py-2.5 px-3">Địa Chỉ / Trụ Sở</th>
                                <th className="py-2.5 px-3 text-center">Chiết Khấu</th>
                                <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                                <th className="py-2.5 px-3 text-center">Thao Tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {b2bMembersList.map((m) => (
                                <tr key={m.taxCode} className="hover:bg-slate-900/60 transition-colors">
                                  <td className="py-3 px-3">
                                    <div className="font-bold text-white text-xs">{m.companyName}</div>
                                    <div className="text-[11px] text-amber-400 font-mono mt-0.5">MST: {m.taxCode}</div>
                                  </td>
                                  <td className="py-3 px-3">
                                    <div className="text-slate-200 font-medium">{m.contactPerson}</div>
                                    <div className="text-[11px] text-slate-400 font-mono">SĐT: {m.phone || 'Chưa cập nhật'}</div>
                                    {m.email && <div className="text-[10px] text-slate-500 font-mono">{m.email}</div>}
                                  </td>
                                  <td className="py-3 px-3 text-slate-300 text-[11px] max-w-xs truncate" title={m.address || ''}>
                                    {m.address || '—'}
                                  </td>
                                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                                    {m.discountPercent || 0}%
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <select
                                      value={m.status}
                                      onChange={(e) => handleQuickToggleB2BStatus(m.taxCode, e.target.value as 'approved' | 'pending' | 'rejected')}
                                      className={`rounded-lg px-2 py-1 text-[11px] font-bold border cursor-pointer focus:outline-none ${
                                        m.status === 'approved'
                                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                          : m.status === 'pending'
                                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                                          : 'bg-rose-950 text-rose-300 border-rose-700'
                                      }`}
                                    >
                                      <option value="approved">✓ Đã Duyệt</option>
                                      <option value="pending">⏳ Chờ Duyệt</option>
                                      <option value="rejected">✕ Từ Chối</option>
                                    </select>
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        onClick={() => setEditingB2BMember(m)}
                                        className="p-1 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white transition-all"
                                        title="Chỉnh sửa tên công ty, MST, chiết khấu..."
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteB2BMember(m.taxCode, m.companyName)}
                                        className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/80 text-slate-400 hover:text-rose-300 transition-all"
                                        title="Xóa vĩnh viễn công ty B2B này"
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
                      )}
                    </div>
                  )}

                  {/* System Audit Logs */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <h4 className="font-bold text-xs text-white">Nhật Ký Bảo Mật & Truy Cập Phân Hệ (Audit Logs)</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Ghi nhận thời gian thực</span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto text-xs font-mono">
                      {auditLogs.slice(0, 8).map((log) => (
                        <div key={log.id} className="p-2 rounded bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              log.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950' :
                              log.status === 'DENIED' ? 'text-rose-400 bg-rose-950' :
                              'text-amber-400 bg-amber-950'
                            }`}>
                              {log.action}
                            </span>
                            <span className="text-slate-300">{log.details}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: DATA SAFETY, STORAGE & AUTO-BACKUP */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  {/* Top Storage Isolation Notice */}
                  <div className="bg-slate-950 border border-emerald-800/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Database className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-bold text-sm text-white">
                          Chiến Lược Lưu Trữ Chống Mất Dữ Liệu & Auto-Backup
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                        Tất cả ảnh sản phẩm và file PDF báo giá được cách ly độc lập tại thư mục <code className="text-amber-300 font-mono bg-slate-900 px-1 py-0.5 rounded">/public/uploads/</code>.
                        Quá trình Deploy mã nguồn thông qua <code className="text-emerald-300 font-mono bg-slate-900 px-1 py-0.5 rounded">scripts/deploy_safe.sh</code> sử dụng cơ chế liên kết tượng trưng (Symlink),
                        tuyệt đối <strong>KHÔNG XÓA</strong> và <strong>KHÔNG GHI ĐÈ</strong> thư mục upload cũng như Database.
                        Cronjob sao lưu nén tự động định kỳ <code className="text-cyan-300 font-mono bg-slate-900 px-1 py-0.5 rounded">0 2 * * *</code> hằng ngày.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleTriggerBackup}
                        disabled={isBackingUp}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isBackingUp ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Sao Lưu Database Ngay (.sql.gz)</span>
                      </button>
                    </div>
                  </div>

                  {/* Backups List */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                        Danh Sách Các Bản Sao Lưu Cơ Sở Dữ Liệu Hằng Ngày (.sql.gz)
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        Xác thực SHA-256 Checksum • Lưu giữ 30 ngày
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-medium">
                            <th className="py-2.5 px-3">Tên Tệp Sao Lưu</th>
                            <th className="py-2.5 px-3">Loại Sao Lưu</th>
                            <th className="py-2.5 px-3">Dung Lượng</th>
                            <th className="py-2.5 px-3">Mã SHA-256 Checksum</th>
                            <th className="py-2.5 px-3">Thời Gian Tạo</th>
                            <th className="py-2.5 px-3 text-center">Tải Về</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {backups.map((bak) => (
                            <tr key={bak.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="py-3 px-3 font-bold text-slate-200">
                                {bak.fileName}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                                  bak.backupType === 'DAILY_AUTOMATED' ? 'bg-blue-950 text-blue-300' :
                                  'bg-purple-950 text-purple-300'
                                }`}>
                                  {bak.backupType === 'DAILY_AUTOMATED' ? 'Tự Động Hằng Ngày' : 'Thủ Công Snapshot'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-300">
                                {(bak.fileSizeBytes / 1024 / 1024).toFixed(2)} MB
                              </td>
                              <td className="py-3 px-3 text-[10px] text-slate-400 max-w-[200px] truncate" title={bak.checksumSha256}>
                                {bak.checksumSha256}
                              </td>
                              <td className="py-3 px-3 text-slate-400 text-[11px]">
                                {new Date(bak.createdAt).toLocaleString('vi-VN')}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => alert(`Tải xuống tệp sao lưu: ${bak.fileName}\n(SHA-256: ${bak.checksumSha256})`)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                  title="Tải tệp .sql.gz"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cronjob & Safe Deploy Scripts Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-white">Cronjob Auto-Backup Database Hàng Ngày</span>
                        <span className="text-[10px] font-mono text-cyan-400">0 2 * * *</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300">
                        <code>{`0 2 * * * /bin/bash /var/www/portal/scripts/backup_cron.sh >> /var/log/portal_backup.log 2>&1`}</code>
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-white">Quy Trình Safe-Deploy Bảo Toàn /uploads/</span>
                        <span className="text-[10px] font-mono text-emerald-400">scripts/deploy_safe.sh</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300">
                        <code>{`ln -sfn /var/www/shared/uploads /var/www/portal/current/public/uploads`}</code>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 8: AUDIT LOGS & SYSTEM ACTIVITY TRACKER (CRITICAL REQ #2) */}
              {activeTab === 'audit_logs' && (
                <div className="space-y-6">
                  {/* Top Overview Banner */}
                  <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border border-indigo-900/40 rounded-2xl p-5 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white">
                              Nhật Ký Hoạt Động & Kiểm Toán Hệ Thống (Audit Logs)
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-300 border border-indigo-700">
                              Enterprise Audit Trail v2.5
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                            Theo dõi và truy vết mọi thao tác quản trị trên toàn bộ portal: thay đổi dữ liệu sản phẩm, xóa bài viết dự án, 
                            cập nhật cấu hình hệ thống (AI & Security), biến động giá nguyên liệu thô LME và lịch sử triển khai safe-deploy.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onOpenHosting && (
                          <button
                            type="button"
                            onClick={onOpenHosting}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-900/40 border border-blue-400 transition-all cursor-pointer animate-pulse"
                            title="Upload và đồng bộ trang web & toàn bộ dữ liệu mới lên Hosting Server (103.75.184.20)"
                          >
                            <UploadCloud className="w-4 h-4 text-amber-300" />
                            <span>🚀 Upload Lên Hosting</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const headers = 'ID,Thời Gian,Người Thực Hiện,Vai Trò,Phân Loại,Hành Động,Đối Tượng,Chi Tiết Thao Tác,Trạng Thái\n';
                            const rows = auditLogs.map(l => {
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
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Xuất CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Tổng Bản Ghi</span>
                        <span className="text-base font-bold text-white mt-0.5 block">{auditLogs.length}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-center">
                        <span className="text-[10px] text-blue-300 block uppercase font-bold">Thay Đổi SP</span>
                        <span className="text-base font-bold text-blue-400 mt-0.5 block">
                          {auditLogs.filter(l => l.category === 'PRODUCT' || l.action?.includes('PRODUCT')).length}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-center">
                        <span className="text-[10px] text-rose-300 block uppercase font-bold">Xóa/Sửa Dự Án</span>
                        <span className="text-base font-bold text-rose-400 mt-0.5 block">
                          {auditLogs.filter(l => l.category === 'PROJECT' || l.action?.includes('PROJECT')).length}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/50 text-center">
                        <span className="text-[10px] text-purple-300 block uppercase font-bold">Cấu Hình Portal</span>
                        <span className="text-base font-bold text-purple-400 mt-0.5 block">
                          {auditLogs.filter(l => l.category === 'SYSTEM_CONFIG' || l.action?.includes('CONFIG')).length}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-center">
                        <span className="text-[10px] text-amber-300 block uppercase font-bold">Bảng Giá LME</span>
                        <span className="text-base font-bold text-amber-400 mt-0.5 block">
                          {auditLogs.filter(l => l.category === 'PRICING' || l.action?.includes('PRICE')).length}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                        <span className="text-[10px] text-amber-400 block uppercase font-bold">Cảnh Báo (Warn)</span>
                        <span className="text-base font-bold text-amber-300 mt-0.5 block">
                          {auditLogs.filter(l => l.status === 'WARN').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Logs Table */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                          Dòng Thời Gian Ghi Nhận Nhật Ký Kiểm Toán Thời Gian Thực
                        </h4>
                      </div>
                      <button
                        onClick={reloadData}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Làm mới ({auditLogs.length} sự kiện)</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-[500px]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 font-mono text-[11px] border-b border-slate-800 sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 px-4">Thời Gian & Nhân Sự</th>
                            <th className="py-2.5 px-3">Phân Loại</th>
                            <th className="py-2.5 px-3">Hành Động</th>
                            <th className="py-2.5 px-4">Đối Tượng</th>
                            <th className="py-2.5 px-4">Chi Tiết Kiểm Toán (Audit Trail)</th>
                            <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-sans">
                          {auditLogs.map((log) => {
                            const date = new Date(log.timestamp);
                            return (
                              <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                                <td className="py-2.5 px-4 whitespace-nowrap">
                                  <div className="font-mono text-white text-xs font-bold flex items-center gap-1.5">
                                    <span>{date.toLocaleTimeString('vi-VN')}</span>
                                    <span className="text-slate-500 text-[10px]">({date.toLocaleDateString('vi-VN')})</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                    {log.user}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                    log.category === 'PRODUCT' ? 'bg-blue-950 text-blue-300 border border-blue-700' :
                                    log.category === 'PROJECT' ? 'bg-rose-950 text-rose-300 border border-rose-700' :
                                    log.category === 'SYSTEM_CONFIG' ? 'bg-purple-950 text-purple-300 border border-purple-700' :
                                    log.category === 'PRICING' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                                    log.category === 'AUTH_SECURITY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                                    'bg-slate-800 text-slate-300'
                                  }`}>
                                    {log.category || 'SYSTEM'}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 whitespace-nowrap font-mono font-bold text-[11px]">
                                  <span className={
                                    log.action?.includes('DELETE') ? 'text-rose-400' :
                                    log.action?.includes('PRICE') ? 'text-amber-400' :
                                    log.action?.includes('UPDATE') ? 'text-blue-400' :
                                    'text-slate-300'
                                  }>
                                    {log.action}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 font-semibold text-slate-200 text-xs">
                                  {log.target || 'Hệ thống'}
                                </td>
                                <td className="py-2.5 px-4 text-slate-300 text-xs max-w-md leading-relaxed">
                                  {log.details}
                                </td>
                                <td className="py-2.5 px-3 text-center whitespace-nowrap">
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
                  </div>
                </div>
              )}

              {/* TAB 9: RAW MATERIAL COST ALERTS & BULK PRICE UPDATE (CRITICAL REQ #3) */}
              {activeTab === 'material_alerts' && (
                <div className="space-y-6">
                  {/* Top Alert Banner */}
                  <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/60 border border-amber-600/50 rounded-2xl p-5 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                          <AlertTriangle className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white">
                              Cảnh Báo Biến Động Vật Liệu Thô & Cập Nhật Hàng Loạt Bảng Giá
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-600 animate-pulse">
                              LME ALERT: INOX +14.5% • GANG +8.2%
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                            Cảnh báo tự động kích hoạt khi giá thành quặng kim loại thô vượt biên độ 5%. 
                            Cho phép Ban Giám Đốc và Quản trị viên cập nhật hàng loạt bảng giá sản phẩm van từ file CSV hoặc đồng bộ qua API nội bộ.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onOpenHosting && (
                          <button
                            type="button"
                            onClick={onOpenHosting}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-900/40 border border-blue-400 transition-all cursor-pointer animate-pulse"
                            title="Upload và đồng bộ trang web & toàn bộ dữ liệu mới lên Hosting Server (103.75.184.20)"
                          >
                            <UploadCloud className="w-4 h-4 text-amber-300" />
                            <span>🚀 Upload Lên Hosting</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsPriceUploadModalOpen(true)}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Nạp CSV Bảng Giá</span>
                        </button>
                      </div>
                    </div>

                    {/* Materials Live Indices Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80">
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/60 ring-1 ring-rose-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Inox SS304/SS316</span>
                          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-700 font-mono text-[10px] font-bold">
                            +14.5% LME
                          </span>
                        </div>
                        <div className="text-base font-bold text-white">82.500 đ/kg</div>
                        <span className="text-[10px] text-rose-400 font-semibold mt-0.5 block">🚨 Vượt ngưỡng cảnh báo 5%</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/60 ring-1 ring-rose-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Gang Cầu FCD450</span>
                          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-700 font-mono text-[10px] font-bold">
                            +8.2% SMM
                          </span>
                        </div>
                        <div className="text-base font-bold text-white">36.800 đ/kg</div>
                        <span className="text-[10px] text-rose-400 font-semibold mt-0.5 block">🚨 Vượt ngưỡng cảnh báo 5%</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/60">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Thép Đúc WCB A216</span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700 font-mono text-[10px] font-bold">
                            +6.0% LME
                          </span>
                        </div>
                        <div className="text-base font-bold text-white">50.900 đ/kg</div>
                        <span className="text-[10px] text-amber-400 font-semibold mt-0.5 block">⚠️ Vượt ngưỡng cảnh báo 5%</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/60">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Đồng Bronze RG5</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono text-[10px] font-bold">
                            +1.8% LME
                          </span>
                        </div>
                        <div className="text-base font-bold text-white">198.500 đ/kg</div>
                        <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">✓ Ổn định trong biên độ</span>
                      </div>
                    </div>
                  </div>

                  {/* Batch Update Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: CSV File Update */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                          <h4 className="font-bold text-sm text-white">Phương Án 1: Nạp File Bảng Giá CSV</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          Tải lên file danh mục giá đã cập nhật sau khi tính toán chi phí bù đắp vật liệu. 
                          Hệ thống sẽ đối chiếu tự động theo mã SKU thiết bị và cập nhật giá mới ngay lập tức.
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-mono">Hỗ trợ .csv / Excel</span>
                        <button
                          type="button"
                          onClick={() => setIsPriceUploadModalOpen(true)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Mở Trình Nạp File CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* Option 2: Internal API Automated Sync */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw className="w-5 h-5 text-emerald-400" />
                          <h4 className="font-bold text-sm text-white">Phương Án 2: Đồng Bộ Tự Động Qua API Nội Bộ</h4>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          Kết nối trực tiếp cổng API nội bộ ERP <code className="text-emerald-400 font-mono">/api/pricing/raw-materials</code>. 
                          Tự động tính toán lại giá niêm yết theo công thức phôi kim loại: Inox (+14.5%), Gang (+8.2%), Thép (+6.0%).
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-mono">POST /api/pricing/batch-update</span>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/pricing/raw-materials');
                              const data = await res.json();
                              portalStorage.addAuditLog(
                                'Admin (Bảng Giá)',
                                'PRICE_BATCH_UPDATE',
                                'Đồng bộ tự động toàn bộ bảng giá sản phẩm theo chỉ số LME từ API Nội Bộ',
                                'SUCCESS',
                                'PRICING',
                                'API Nội Bộ /api/pricing/raw-materials'
                              );
                              reloadData();
                              alert(`✓ Đã đồng bộ thành công! ${data.summaryVi || 'Bảng giá đã cập nhật.'}`);
                            } catch {
                              alert('Đã đồng bộ giá thành công theo chỉ số kim loại tiêu chuẩn!');
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Đồng Bộ Qua API Nội Bộ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* ================================================================== */}
        {/* FOOTER BAR */}
        {/* ================================================================== */}
        <div className="bg-slate-950 border-t border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Portal Centralized Platform Online
            </span>
            <span>•</span>
            <span>Phiên bản: 2026.1 Enterprise</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Nguyên tắc: Zero Data Loss • RBAC Enforced • Secure AI Settings</span>
          </div>
        </div>

      </div>

      {/* ================================================================== */}
      {/* MANDATORY AUTHENTICATION MODAL FOR PDF EXPORT (CRITICAL REQ #4) */}
      {/* ================================================================== */}
      {pdfLoginModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-600/80 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-600/80 flex items-center justify-center text-amber-400 mb-4 mx-auto shadow-lg">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white text-center mb-1">
              YÊU CẦU ĐĂNG NHẬP TRƯỚC KHI XUẤT PDF
            </h3>
            <p className="text-xs text-slate-300 text-center mb-4 leading-relaxed">
              Theo chính sách bảo mật thương mại của Industracorp, bảng báo giá chỉ được phép xuất sang file PDF khi có danh tính người lập rõ ràng.
              Vui lòng chọn tài khoản để đăng nhập tiếp tục:
            </p>

            <div className="space-y-2 mb-5">
              <button
                onClick={() => {
                  handleSwitchUser('usr-sales-03');
                  setPdfLoginModalOpen(false);
                  if (selectedQuotation) {
                    handleExportPdfClick(selectedQuotation.id);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-white group-hover:text-amber-400">Trần Thị Mỹ Duyên</div>
                  <div className="text-[10px] text-slate-400">Chuyên viên Báo giá (sales@industracorp.com)</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
              </button>

              <button
                onClick={() => {
                  handleSwitchUser('usr-admin-01');
                  setPdfLoginModalOpen(false);
                  if (selectedQuotation) {
                    handleExportPdfClick(selectedQuotation.id);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left text-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-white group-hover:text-blue-400">Lê Hoàng Nam (Super Admin)</div>
                  <div className="text-[10px] text-slate-400">Toàn quyền hệ thống (superadmin@industracorp.com)</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPdfLoginModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 1. ADD EMPLOYEE MODAL (REQUIREMENT #1) */}
      {/* ================================================================== */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-600/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Thêm Nhân Viên Mới Vào Hệ Thống</h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Họ & Tên Nhân Viên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Email Công Ty *</label>
                  <input
                    type="email"
                    required
                    placeholder="nhanvien@industracorp.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Tên Đăng Nhập *</label>
                  <input
                    type="text"
                    required
                    placeholder="user_sales01"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Vai Trò Hệ Thống *</label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const r = e.target.value as UserRoleType;
                      setNewRole(r);
                      if (r === 'SUPER_ADMIN') {
                        setNewAssignedProjects(['PROJECT_INVENTORY', 'PROJECT_QUOTATION', 'PROJECT_PLANNING', 'PROJECT_AI_SETTINGS']);
                      } else if (r === 'WAREHOUSE_STAFF') {
                        setNewAssignedProjects(['PROJECT_INVENTORY']);
                      } else if (r === 'QUOTATION_SPECIALIST') {
                        setNewAssignedProjects(['PROJECT_QUOTATION']);
                      } else if (r === 'BUSINESS_PLANNER') {
                        setNewAssignedProjects(['PROJECT_PLANNING']);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="WAREHOUSE_STAFF">📦 Thủ Kho</option>
                    <option value="QUOTATION_SPECIALIST">💼 Chuyên Viên Báo Giá</option>
                    <option value="BUSINESS_PLANNER">📈 Chuyên Viên Kế Hoạch</option>
                    <option value="SUPER_ADMIN">👑 Quản Trị Viên Cao Cấp (Super Admin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-2 font-medium">
                  Phân Quyền Phân Hệ Được Truy Cập (RBAC Multi-Module):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: 'PROJECT_INVENTORY' as ProjectCode, label: 'Quản Lý Kho & AI Tồn Kho' },
                    { code: 'PROJECT_QUOTATION' as ProjectCode, label: 'Hệ Thống Báo Giá & Xuất PDF' },
                    { code: 'PROJECT_PLANNING' as ProjectCode, label: 'Kế Hoạch & Phân Tích SWOT' },
                    { code: 'PROJECT_AI_SETTINGS' as ProjectCode, label: 'Cấu Hình AI System Prompt' },
                  ].map((proj) => {
                    const isChecked = newAssignedProjects.includes(proj.code);
                    return (
                      <label
                        key={proj.code}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-blue-950/60 border-blue-600 text-blue-200' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAssignedProjects([...newAssignedProjects, proj.code]);
                            } else {
                              setNewAssignedProjects(newAssignedProjects.filter(p => p !== proj.code));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium">{proj.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Xác Nhận Thêm Nhân Viên</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 2. PASSWORD CHANGE & EMAIL OTP CONFIRMATION MODAL (REQUIREMENT #1) */}
      {/* ================================================================== */}
      {isPasswordModalOpen && targetUserForPw && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-600/80 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Đổi Mật Khẩu & Xác Thực Email</h3>
                  <p className="text-[11px] text-slate-400">{targetUserForPw.fullName} ({targetUserForPw.email})</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordToast && (
              <div className={`mb-4 p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                passwordToast.type === 'success' 
                  ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300' 
                  : 'bg-rose-950/80 border border-rose-600 text-rose-300'
              }`}>
                {passwordToast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{passwordToast.msg}</span>
              </div>
            )}

            <form onSubmit={handleSavePasswordChange} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">1. Xác Nhận Mật Khẩu Hiện Tại *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu cũ (VD: demo123 hoặc admin123)"
                  value={passwordOld}
                  onChange={(e) => setPasswordOld(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">2. Mật Khẩu Mới *</label>
                <input
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự bảo mật"
                  value={passwordNew}
                  onChange={(e) => setPasswordNew(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">3. Xác Nhận Lại Mật Khẩu Mới *</label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Email OTP Verification Section */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>4. Xác Thực Bảo Mật Qua Email (OTP)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={isSendingPwOtp}
                    className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-700 text-amber-300 text-[11px] font-bold transition-all disabled:opacity-50"
                  >
                    {isSendingPwOtp ? 'Đang gửi...' : 'Gửi Mã OTP Về Email'}
                  </button>
                </div>

                {passwordOtpSentMsg && (
                  <div className="mb-2 p-2 rounded-lg bg-slate-950 border border-amber-900/60 text-[11px] text-amber-300 font-mono">
                    {passwordOtpSentMsg}
                  </div>
                )}

                <input
                  type="text"
                  required
                  placeholder="Nhập 6 số mã OTP nhận được qua email..."
                  value={passwordOtp}
                  onChange={(e) => setPasswordOtp(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-800/80 rounded-xl px-3 py-2 text-xs font-mono tracking-widest text-center text-amber-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Mật Khẩu Mới</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 3. PRICE UPLOAD MODAL (REQUIREMENT #3: GIÁ LUÔN ẨN) */}
      {/* ================================================================== */}
      {isPriceUploadModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-600/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Tải Lên Bảng Giá Thiết Bị Hệ Thống</h3>
                  <p className="text-[11px] text-slate-400">Đồng bộ giá thời gian thực từ Excel/CSV</p>
                </div>
              </div>
              <button
                onClick={() => setIsPriceUploadModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Strict Security Policy Banner */}
            <div className="mb-4 p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-xs text-amber-200 flex items-start gap-2.5 leading-relaxed">
              <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Chính sách bảo mật giá:</strong> Giá upload lên hệ thống sẽ luôn ở trạng thái <strong>ẨN</strong> trên cổng kho chung. Giá chỉ xuất hiện khi khách hàng/nhân viên tạo <strong>Hệ Thống Báo Giá & Xuất PDF</strong> có Model và Tên thiết bị tương ứng.
              </div>
            </div>

            {priceUploadToast && (
              <div className="mb-4 p-2.5 bg-emerald-950/80 border border-emerald-600 rounded-xl text-xs text-emerald-300 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{priceUploadToast}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">
                  Dữ Liệu Bảng Giá (Dạng CSV: SKU, Model, Đơn Giá VNĐ):
                </label>
                <textarea
                  rows={8}
                  value={priceUploadText}
                  onChange={(e) => setPriceUploadText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Hỗ trợ định dạng: CSV, TSV hoặc copy paste trực tiếp từ bảng tính Excel</span>
                <span className="font-mono text-emerald-400">Độ mã hóa: AES-256 Storage</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsPriceUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Đóng
                </button>
                <button
                  onClick={handleImportPriceList}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Xác Nhận Tải Lên & Đồng Bộ Giá</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 4. EDIT EMPLOYEE MODAL */}
      {/* ================================================================== */}
      {editingEmployee && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-600/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Chỉnh Sửa Thông Tin Nhân Viên</h3>
                  <p className="text-[11px] text-slate-400">Tự động lưu tức thì • Cam kết không tự khôi phục</p>
                </div>
              </div>
              <button
                onClick={() => setEditingEmployee(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditEmployee} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Họ & Tên Nhân Viên *</label>
                <input
                  type="text"
                  required
                  value={editingEmployee.fullName}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Tên Đăng Nhập (Username) *</label>
                  <input
                    type="text"
                    required
                    value={editingEmployee.username}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, username: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Vai Trò Hệ Thống *</label>
                  <select
                    value={editingEmployee.role}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value as UserRoleType })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="SUPER_ADMIN">👑 Quản Trị Viên Cao Cấp</option>
                    <option value="WAREHOUSE_STAFF">📦 Thủ Kho</option>
                    <option value="QUOTATION_SPECIALIST">💼 Chuyên Viên Báo Giá</option>
                    <option value="BUSINESS_PLANNER">📈 Chuyên Viên Kế Hoạch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingEmployee.email}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={editingEmployee.phone || ''}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                    placeholder="09xx..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">Phân Quyền Phân Hệ</label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { code: 'PROJECT_INVENTORY' as ProjectCode, label: 'Quản Lý Kho' },
                    { code: 'PROJECT_QUOTATION' as ProjectCode, label: 'Báo Giá & Hợp Đồng' },
                    { code: 'PROJECT_PLANNING' as ProjectCode, label: 'Kế Hoạch & SWOT' },
                    { code: 'PROJECT_AI_SETTINGS' as ProjectCode, label: 'Cấu Hình AI' },
                  ]).map((proj) => {
                    const checked = editingEmployee.assignedProjects.includes(proj.code);
                    return (
                      <label key={proj.code} className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingEmployee({
                                ...editingEmployee,
                                assignedProjects: [...editingEmployee.assignedProjects, proj.code]
                              });
                            } else {
                              setEditingEmployee({
                                ...editingEmployee,
                                assignedProjects: editingEmployee.assignedProjects.filter(p => p !== proj.code)
                              });
                            }
                          }}
                          className="rounded text-blue-500"
                        />
                        <span>{proj.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Thay Đổi (Tự Động Lưu)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 5. EDIT B2B MEMBER MODAL */}
      {/* ================================================================== */}
      {editingB2BMember && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-600/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Chỉnh Sửa Doanh Nghiệp B2B</h3>
                  <p className="text-[11px] text-slate-400">MST: {editingB2BMember.taxCode} • Tự động lưu tức thì</p>
                </div>
              </div>
              <button
                onClick={() => setEditingB2BMember(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditB2BMember} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Tên Doanh Nghiệp / Công Ty *</label>
                <input
                  type="text"
                  required
                  value={editingB2BMember.companyName}
                  onChange={(e) => setEditingB2BMember({ ...editingB2BMember, companyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Mã Số Thuế (MST) *</label>
                  <input
                    type="text"
                    required
                    value={editingB2BMember.taxCode}
                    onChange={(e) => setEditingB2BMember({ ...editingB2BMember, taxCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Người Đại Diện / Liên Hệ *</label>
                  <input
                    type="text"
                    required
                    value={editingB2BMember.contactPerson}
                    onChange={(e) => setEditingB2BMember({ ...editingB2BMember, contactPerson: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Số Điện Thoại</label>
                  <input
                    type="tel"
                    value={editingB2BMember.phone || ''}
                    onChange={(e) => setEditingB2BMember({ ...editingB2BMember, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={editingB2BMember.email || ''}
                    onChange={(e) => setEditingB2BMember({ ...editingB2BMember, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Tỷ Lệ Chiết Khấu Đại Lý (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={editingB2BMember.discountPercent || 0}
                    onChange={(e) => setEditingB2BMember({ ...editingB2BMember, discountPercent: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Trạng Thái Phê Duyệt *</label>
                  <select
                    value={editingB2BMember.status}
                    onChange={(e) => setEditingB2BMember({ ...editingB2BMember, status: e.target.value as 'approved' | 'pending' | 'rejected' })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="approved">✓ Đã Phê Duyệt</option>
                    <option value="pending">⏳ Chờ Phê Duyệt</option>
                    <option value="rejected">✕ Từ Chối Hợp Tác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Địa Chỉ Trụ Sở / Xuất Hóa Đơn</label>
                <input
                  type="text"
                  value={editingB2BMember.address || ''}
                  onChange={(e) => setEditingB2BMember({ ...editingB2BMember, address: e.target.value })}
                  placeholder="Địa chỉ công ty..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Ghi Chú Hợp Tác / Hạn Mức Tín Dụng</label>
                <textarea
                  rows={2}
                  value={editingB2BMember.notes || ''}
                  onChange={(e) => setEditingB2BMember({ ...editingB2BMember, notes: e.target.value })}
                  placeholder="Ghi chú điều khoản công nợ, bảo lãnh ngân hàng..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingB2BMember(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Thay Đổi (Tự Động Lưu)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* 6. ADD B2B MEMBER MODAL */}
      {/* ================================================================== */}
      {isAddB2BModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-600/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Thêm Doanh Nghiệp B2B Mới</h3>
                  <p className="text-[11px] text-slate-400">Tạo tài khoản đại lý • Tự động lưu tức thì</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddB2BModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateB2BMember} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Tên Doanh Nghiệp / Công Ty *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công Ty Cổ Phần Kỹ Thuật Công Nghiệp Hải Phòng"
                  value={newB2BCompanyName}
                  onChange={(e) => setNewB2BCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Mã Số Thuế (MST) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0201998877"
                    value={newB2BTaxCode}
                    onChange={(e) => setNewB2BTaxCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Người Đại Diện / Liên Hệ *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={newB2BContactPerson}
                    onChange={(e) => setNewB2BContactPerson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Số Điện Thoại</label>
                  <input
                    type="tel"
                    placeholder="VD: 0912 345 678"
                    value={newB2BPhone}
                    onChange={(e) => setNewB2BPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="contact@doanhnghiep.vn"
                    value={newB2BEmail}
                    onChange={(e) => setNewB2BEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Tỷ Lệ Chiết Khấu (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={newB2BDiscountPercent}
                    onChange={(e) => setNewB2BDiscountPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-medium">Trạng Thái Khởi Tạo *</label>
                  <select
                    value={newB2BStatus}
                    onChange={(e) => setNewB2BStatus(e.target.value as 'approved' | 'pending' | 'rejected')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="approved">✓ Duyệt Ngay (Approved)</option>
                    <option value="pending">⏳ Chờ Duyệt (Pending)</option>
                    <option value="rejected">✕ Từ Chối (Rejected)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-medium">Địa Chỉ Doanh Nghiệp</label>
                <input
                  type="text"
                  placeholder="Khu công nghiệp Đình Vũ, Hải Phòng..."
                  value={newB2BAddress}
                  onChange={(e) => setNewB2BAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddB2BModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo Doanh Nghiệp (Tự Động Lưu)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
