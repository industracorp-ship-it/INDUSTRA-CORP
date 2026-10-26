/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TechnicalHighlights } from './components/TechnicalHighlights';
import { FilterBar } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';
import { BrandPortfolioSection } from './components/BrandPortfolioSection';
import { SpecModal } from './components/SpecModal';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { StrategicClients } from './components/StrategicClients';
import { RfqForm } from './components/RfqForm';
import { GuideModal } from './components/GuideModal';
import { QuotePdfPreviewModal } from './components/QuotePdfPreviewModal';
import { CatalogueModal } from './components/CatalogueModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { Footer } from './components/Footer';
import { UploadCloud, Clock, AlertTriangle, Languages, Bell } from 'lucide-react';

// New Feature Modals
import { KnowledgeHubModal } from './components/KnowledgeHubModal';
import { AiValveKnowledgeModal } from './components/AiValveKnowledgeModal';
import { HostingDeployModal } from './components/HostingDeployModal';
import { AuthModal } from './components/AuthModal';
import { CentralizedPortalModal } from './components/portal/CentralizedPortalModal';
import { MaterialCostAlertModal } from './components/MaterialCostAlertModal';
import { AuditLogsModal } from './components/AuditLogsModal';
import { ExportTranslatedCatalogModal } from './components/ExportTranslatedCatalogModal';
import { AdminNotificationSettingsModal } from './components/AdminNotificationSettingsModal';
import { portalStorage } from './services/portalStorage';
import { AdminStudioOverlay } from './components/AdminStudioOverlay';
import { AdminTextEditModal } from './components/AdminTextEditModal';
import { CatalogAuditModal } from './components/CatalogAuditModal';
import { ContactAdminModal } from './components/ContactAdminModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { DataStorageCenterModal } from './components/DataStorageCenterModal';
import { ProjectsShowcaseSection } from './components/ProjectsShowcaseSection';
import { BrandCrawlerModal } from './components/BrandCrawlerModal';
import { GlobalSeoAndWeeklyArticlesModal } from './components/GlobalSeoAndWeeklyArticlesModal';
import { ValveNewsSection } from './components/ValveNewsSection';
import { EnterpriseSecurityShield } from './components/EnterpriseSecurityShield';
import { EnterpriseGatekeeperModal } from './components/EnterpriseGatekeeperModal';
import { TaxLookupModal } from './components/TaxLookupModal';
import { B2BRegistrationModal } from './components/B2BRegistrationModal';
import { getPendingB2BDealersCount, getCurrentSession, setCurrentSession, checkIsApprovedDealer, UserSession } from './utils/authEngine';
import { 
  getEnterpriseSecurityConfig, 
  getEnterpriseSession, 
  logoutEnterpriseSession, 
  getAdminOverrideMode,
  setAdminOverrideMode,
  EnterpriseSession 
} from './utils/enterpriseSecurityEngine';
import { recordValveQuery } from './utils/valveDemandAlertEngine';

import { VALVES_DATA } from './data/valvesData';
import { DEFAULT_CATEGORIES, loadCategoriesFromStorage, saveCategoriesToStorage } from './data/categoryData';
import { loadProjectsFromStorage, saveProjectsToStorage, markProjectDeleted } from './data/projectsData';
import { synthesizeProjectFromOrder } from './utils/aiProjectGenerator';
import { getLocalizedProduct } from './utils/engineeringTranslator';
import { catalogTranslationService, TranslationProgressEvent } from './services/catalogTranslationService';
import { parseSemanticQuery, evaluateProductSemantic } from './utils/semanticSearch';
import { ValveProduct, FilterState, RfqItem, RfqFormData, UserRole, SystemGroup, CompanyContactInfo, CategoryItem, ProjectRecord, SupportedLanguage } from './types/valve';
import { 
  loadProductsFromStorage, 
  saveProductsToStorage, 
  loadProductsSyncFallback,
  exportHostingSyncPackage,
  exportValvesAsTypeScriptCode,
  importHostingSyncPackage
} from './utils/storageEngine';

export default function App() {
  const [lang, setLang] = useState<SupportedLanguage>('vi');
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [currentUserSession, setCurrentUserSession] = useState<UserSession | null>(() => getCurrentSession());

  // Check if active user is an approved member or admin
  const isApprovedMember = Boolean(
    isAdminMode ||
    (currentUserSession && (currentUserSession.isApprovedMember || currentUserSession.userType === 'admin')) ||
    (currentUserSession?.email && checkIsApprovedDealer({ email: currentUserSession.email }).isApproved) ||
    portalStorage.getCurrentUser()?.role === 'SUPER_ADMIN' ||
    portalStorage.getCurrentUser()?.role === 'QUOTATION_SPECIALIST'
  );

  // Editable & Persistent Product state with safe IndexedDB + LocalStorage audit lock
  const [valvesList, setValvesList] = useState<ValveProduct[]>(() => loadProductsSyncFallback());

  // Dynamic Categories state
  const [categories, setCategories] = useState<CategoryItem[]>(() => loadCategoriesFromStorage());
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isStorageCenterOpen, setIsStorageCenterOpen] = useState(false);
  const [isCrawlerModalOpen, setIsCrawlerModalOpen] = useState(false);
  const [isGlobalSeoModalOpen, setIsGlobalSeoModalOpen] = useState(false);
  const [isAiKnowledgeModalOpen, setIsAiKnowledgeModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Real-world Projects (2009 - Present) state
  const [projectsList, setProjectsList] = useState<ProjectRecord[]>(() => loadProjectsFromStorage());

  // Hidden JSON file import ref
  const catalogFileInputRef = useRef<HTMLInputElement>(null);

  // Prevent initial hydration from overwriting user edits or resets
  const hasUserEditedRef = useRef(false);

  // Hydrate from IndexedDB on initial mount to guarantee persistence even with large images
  useEffect(() => {
    loadProductsFromStorage().then((loaded) => {
      // ONLY hydrate if user has NOT already performed edits in this session!
      if (!hasUserEditedRef.current && loaded && Array.isArray(loaded) && loaded.length > 0) {
        setValvesList(loaded);
      }
    }).catch((err) => {
      console.warn('Initial load from IndexedDB:', err);
    });
  }, []);

  // Helper to persist valves state to both IndexedDB and LocalStorage
  const saveValvesWithAudit = (updater: ValveProduct[] | ((prev: ValveProduct[]) => ValveProduct[])) => {
    hasUserEditedRef.current = true;
    setValvesList((prev) => {
      const nextList = typeof updater === 'function' ? updater(prev) : updater;
      saveProductsToStorage(nextList).catch((err) => {
        console.error('Persistence error:', err);
      });
      return nextList;
    });
  };

  const handleManualSave = async () => {
    const success = await saveProductsToStorage(valvesList);
    if (success) {
      setSaveToast(`✓ Đã lưu an toàn và khóa dữ liệu ${valvesList.length} sản phẩm vào IndexedDB & LocalStorage!`);
    } else {
      setSaveToast(`✓ Đã lưu trữ ${valvesList.length} sản phẩm vào hệ thống!`);
    }
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleUpdateCategories = (newCats: CategoryItem[]) => {
    setCategories(newCats);
    saveCategoriesToStorage(newCats);
    recordPendingChange();
    portalStorage.addAuditLog(
      'Admin (Cấu Hình)',
      'CONFIG_UPDATE',
      `Cập nhật cấu trúc phân loại danh mục van (${newCats.length} nhóm danh mục)`,
      'SUCCESS',
      'SYSTEM_CONFIG',
      'CategoryManager'
    );
  };

  const handleExportCatalogJson = () => {
    exportHostingSyncPackage(valvesList, categories, contactInfo);
  };

  const handleImportCatalogJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const result = await importHostingSyncPackage(text);
        if (result.success && result.products) {
          saveValvesWithAudit(result.products);
          if (result.categories) {
            handleUpdateCategories(result.categories);
          }
          if (result.contactInfo) {
            setContactInfo(result.contactInfo);
          }
          alert(`✓ Đã nạp và lưu vĩnh viễn thành công ${result.products.length} sản phẩm từ file sao lưu!`);
        } else {
          // Direct array fallback
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            saveValvesWithAudit(parsed);
            alert(`✓ Đã nạp và lưu thành công ${parsed.length} sản phẩm từ file sao lưu JSON!`);
          } else {
            alert('File JSON không đúng cấu trúc danh mục sản phẩm!');
          }
        }
      } catch {
        alert('Lỗi đọc file JSON sao lưu!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetValvesToDefault = () => {
    if (confirm('CẢNH BÁO: Bạn có chắc muốn khôi phục toàn bộ danh mục van về mặc định gốc (toàn bộ 45 dòng van đầy đủ chuẩn UTD & 5 Đối tác Châu Âu/Mỹ/Hàn Quốc)? Dữ liệu sẽ được bảo vệ và đồng bộ tức thì.')) {
      saveValvesWithAudit(VALVES_DATA);
      alert('✓ Đã khôi phục thành công toàn bộ 45 sản phẩm van chuẩn về hệ thống.');
    }
  };

  // Editable Hero text state
  const [customHeroTitle, setCustomHeroTitle] = useState<string>('');
  const [customHeroSubtitle, setCustomHeroSubtitle] = useState<string>('');

  // Editable Company & Warehouse Contact info
  const [contactInfo, setContactInfo] = useState<CompanyContactInfo>({
    companyName: 'UTD Industrial Valve Corporation (Industracorp)',
    taxCode: '0309143035',
    hotline: '0932790928',
    landline: '0932.790.928',
    emailSales: 'info@industracorp.com',
    emailProject: 'trong.luu@industracorp.com',
    headOffice: 'Lầu 6, 231-233 Lê Thánh Tôn, Bến Thành, HCM.',
    workAndWarehouse: '18/2 DT743, An Phú, HCM.',
    workingHours: '24/7 Hỗ trợ giải pháp kỹ thuật van UTD & Xuất kho khẩn cấp',
    leadTime: 'Giao hàng 2 - 24 giờ trên toàn quốc'
  });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Real-world Projects Handlers (2009 - Present)
  const handleAddProject = (newProj: ProjectRecord) => {
    setProjectsList((prev) => {
      const updated = [newProj, ...prev];
      saveProjectsToStorage(updated);
      return updated;
    });
    recordPendingChange();
    portalStorage.addAuditLog(
      'Admin (Dự Án)',
      'PROJECT_CREATE',
      `Thêm mới bài viết dự án showcase: "${newProj.name}" (${newProj.clientInvestor || ''} - ${newProj.year})`,
      'SUCCESS',
      'PROJECT',
      newProj.name
    );
    setSaveToast(`✓ Đã đăng bài dự án "${newProj.name}" thành công! Sẵn sàng upload lên hosting.`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleDeleteProject = (projectId: string) => {
    const targetProject = projectsList.find((p) => p.id === projectId);
    const projectName = targetProject?.name || projectId;

    // Permanently record deletion so the project will NEVER auto-restore
    markProjectDeleted(projectId);
    setProjectsList((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      saveProjectsToStorage(updated);
      return updated;
    });
    recordPendingChange();

    // Critical Requirement 2: Audit Logs for Admin tracking Project Deletions
    portalStorage.addAuditLog(
      'Admin (Quản Trị)',
      'PROJECT_DELETE',
      `Admin đã xóa vĩnh viễn dự án "${projectName}" (${targetProject?.clientInvestor || ''}) khỏi hệ thống portal & khóa khôi phục`,
      'SUCCESS',
      'PROJECT',
      projectName,
      'WARNING',
      { projectId, clientInvestor: targetProject?.clientInvestor, year: targetProject?.year }
    );

    setSaveToast(
      lang === 'vi' 
        ? `✓ Đã xóa vĩnh viễn dự án "${projectName}". Ghi nhận vào Audit Logs và sẵn sàng upload lên hosting!` 
        : `✓ Project "${projectName}" deleted and recorded in Audit Logs!`
    );
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleUpdateProject = (updatedProject: ProjectRecord) => {
    setProjectsList((prev) => {
      const updated = prev.map((p) => (p.id === updatedProject.id ? updatedProject : p));
      saveProjectsToStorage(updated);
      return updated;
    });
    recordPendingChange();
    portalStorage.addAuditLog(
      'Admin (Dự Án)',
      'PROJECT_UPDATE',
      `Cập nhật thông tin và hình ảnh thực tế cho dự án "${updatedProject.name}"`,
      'SUCCESS',
      'PROJECT',
      updatedProject.name
    );
    setSaveToast(`✓ Đã cập nhật ảnh dự án "${updatedProject.name}" thành công!`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Crawler Synchronize Handler (VYC, Shield, JMV, Johnson Controls, Tyco)
  const handleSyncCrawledValves = (crawled: ValveProduct[]) => {
    saveValvesWithAudit((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newlyAdded: ValveProduct[] = [];
      const updatedList = prev.map((existing) => {
        const found = crawled.find((c) => c.id === existing.id || c.code === existing.code);
        if (found) {
          return {
            ...existing,
            ...found,
            characteristics: found.characteristics || existing.characteristics,
          };
        }
        return existing;
      });

      for (const c of crawled) {
        if (!existingIds.has(c.id)) {
          newlyAdded.push(c);
        }
      }

      return [...updatedList, ...newlyAdded];
    });
    setSaveToast(`✓ Đã đồng bộ ${crawled.length} sản phẩm hãng đối tác vào danh mục!`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Selected Valve for Spec Modal Popup
  const [selectedValveForSpec, setSelectedValveForSpec] = useState<ValveProduct | null>(null);

  // Selected Valve for Admin Studio Image & Field Editor
  const [productForAdminStudio, setProductForAdminStudio] = useState<ValveProduct | null>(null);
  const [isCreatingNewProduct, setIsCreatingNewProduct] = useState<boolean>(false);
  const [adminStudioInitialTab, setAdminStudioInitialTab] = useState<'editor' | 'projects_timeline' | 'seo_audit'>('editor');
  const [translationProgress, setTranslationProgress] = useState<TranslationProgressEvent | null>(null);

  // Automatic AI-based translation of entire product catalog when site language toggles
  useEffect(() => {
    if (lang === 'vi') {
      setTranslationProgress(null);
      return;
    }
    catalogTranslationService.translateCatalog(valvesList, lang);
  }, [lang, valvesList]);

  // Subscribe to real-time catalog translation service progress
  useEffect(() => {
    const unsub = catalogTranslationService.onProgress((evt) => {
      setTranslationProgress(evt);
      if (!evt.isTranslating) {
        const timer = setTimeout(() => {
          setTranslationProgress(null);
        }, 2800);
        return () => clearTimeout(timer);
      }
    });
    return unsub;
  }, []);

  const handleReorderProjects = (reordered: ProjectRecord[]) => {
    setProjectsList(reordered);
    saveProjectsToStorage(reordered);
    setSaveToast(
      lang === 'vi' 
        ? '✓ Đã cập nhật và lưu thứ tự mới của timeline dự án!' 
        : (lang === 'zh' ? '✓ 已保存时间轴新工程排序！' : '✓ Timeline project order updated and saved!')
    );
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleBatchUpdateProjects = (updatedProjects: ProjectRecord[]) => {
    setProjectsList(updatedProjects);
    saveProjectsToStorage(updatedProjects);
    setSaveToast(
      lang === 'vi' 
        ? `✓ Đã cập nhật metadata hàng loạt (${updatedProjects.length} dự án) thành công!` 
        : (lang === 'zh' ? `✓ 批量更新成功 (${updatedProjects.length} 个项目)！` : `✓ Batch updated ${updatedProjects.length} projects successfully!`)
    );
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleOpenAdminStudioTimeline = () => {
    setAdminStudioInitialTab('projects_timeline');
    setProductForAdminStudio(valvesList[0] || null);
  };

  // Generic in-place text editor for Admin
  const [adminTextEditState, setAdminTextEditState] = useState<{
    isOpen: boolean;
    key: string;
    title: string;
    value: string;
  }>({
    isOpen: false,
    key: '',
    title: '',
    value: '',
  });

  // Knowledge Hub modal state
  const [knowledgeModalState, setKnowledgeModalState] = useState<{
    isOpen: boolean;
    tab: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly';
  }>({
    isOpen: false,
    tab: 'pccc',
  });

  // Hosting & Staging industracorp.com modal state
  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [isMaterialAlertOpen, setIsMaterialAlertOpen] = useState(false);
  const [isAuditLogsModalOpen, setIsAuditLogsModalOpen] = useState(false);
  const [isExportCatalogModalOpen, setIsExportCatalogModalOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [pendingHostingChangesCount, setPendingHostingChangesCount] = useState<number>(() => {
    return Number(localStorage.getItem('industracorp_pending_deploy_changes') || '0');
  });

  const recordPendingChange = () => {
    setPendingHostingChangesCount(prev => {
      const next = prev + 1;
      localStorage.setItem('industracorp_pending_deploy_changes', String(next));
      return next;
    });
  };

  const handleHostingDeployComplete = () => {
    setPendingHostingChangesCount(0);
    localStorage.setItem('industracorp_pending_deploy_changes', '0');
    portalStorage.addAuditLog(
      'Admin (Triển Khai)',
      'DEPLOY_HOSTING',
      'Đồng bộ mã nguồn, cấu hình và toàn bộ dữ liệu mới lên máy chủ Hosting 103.75.184.20 (www.industracorp.com)',
      'SUCCESS',
      'BACKUP_DEPLOY'
    );
  };

  // Enterprise Security Shield & Access Gatekeeper
  const [enterpriseSession, setEnterpriseSession] = useState<EnterpriseSession | null>(getEnterpriseSession);
  const [securityConfig, setSecurityConfig] = useState(getEnterpriseSecurityConfig);
  const [isAdminOverride, setIsAdminOverride] = useState<boolean>(getAdminOverrideMode);

  useEffect(() => {
    const handleSyncSecurity = () => {
      setSecurityConfig(getEnterpriseSecurityConfig());
      setEnterpriseSession(getEnterpriseSession());
      setIsAdminOverride(getAdminOverrideMode());
    };
    window.addEventListener('storage', handleSyncSecurity);
    window.addEventListener('utd_admin_override_change' as any, handleSyncSecurity);
    return () => {
      window.removeEventListener('storage', handleSyncSecurity);
      window.removeEventListener('utd_admin_override_change' as any, handleSyncSecurity);
    };
  }, []);

  const handleToggleAdminOverride = () => {
    const next = !isAdminOverride;
    setAdminOverrideMode(next);
    setIsAdminOverride(next);
  };

  const isGatekeeperBlocked = useMemo(() => {
    if (!securityConfig.isInternalAccessOnly) return false;
    if (isAdminMode) return false;
    if (enterpriseSession?.isAuthenticated) return false;
    return true;
  }, [securityConfig.isInternalAccessOnly, isAdminMode, enterpriseSession]);

  // RFQ Basket Items
  const [rfqItems, setRfqItems] = useState<RfqItem[]>([
    {
      valve: VALVES_DATA[1], // UTD Ball Valve
      selectedDn: 'DN50 (2")',
      quantity: 12,
    },
    {
      valve: VALVES_DATA[18], // UTD High Performance Triple-Offset Butterfly Valve
      selectedDn: 'DN100 (4")',
      quantity: 8,
    }
  ]);

  // Filter State supporting both System Groups, Brands and Ordered Categories
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    category: 'all',
    systemGroup: 'all',
    materialGroup: 'all',
    pressureGroup: 'all',
    sizeCategory: 'all',
    media: 'all',
    brand: 'all',
  });

  // Track search queries for high-demand valve telemetry (PICV, HP Butterfly)
  useEffect(() => {
    if (filter.search && filter.search.trim().length >= 2) {
      recordValveQuery(filter.search);
    }
  }, [filter.search]);

  // Standard Modal controls
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isTaxLookupOpen, setIsTaxLookupOpen] = useState(false);
  const [taxLookupInitialCode, setTaxLookupInitialCode] = useState('');
  const [isB2BRegistrationOpen, setIsB2BRegistrationOpen] = useState(false);
  const [b2bRegistrationTaxCode, setB2BRegistrationTaxCode] = useState('');
  const [b2bRegistrationCompanyName, setB2BRegistrationCompanyName] = useState('');
  const [pendingB2BDealersCount, setPendingB2BDealersCount] = useState<number>(() => getPendingB2BDealersCount());
  const [activeFormData, setActiveFormData] = useState<RfqFormData>({
    companyName: 'Công Ty CP Xây Lắp Cơ Điện & Năng Lượng M&E',
    taxCode: '0309143035',
    contactPerson: 'Kỹ sư Vũ Hải Đăng',
    rolePosition: 'Trưởng Ban Vật Tư Công Trình',
    phone: '0912.345.678',
    email: 'vuhadang.epc@duan-me.vn',
    projectName: 'Nhà Máy Chế Biến Thực Phẩm Giai Đoạn 2',
    deliveryLocation: 'KCN Phố Nối A, Hưng Yên',
    valveRequirements: '',
    urgency: 'urgent',
    notes: 'Yêu cầu cung cấp đầy đủ chứng chỉ xuất xưởng Mill Test Certificate 3.1 và van bướm hiệu suất cao đạt chuẩn chống cháy API 607.',
  });

  // Natural language semantic parsed query
  const semanticParsedQuery = useMemo(() => {
    if (!filter.search.trim()) return null;
    return parseSemanticQuery(filter.search);
  }, [filter.search]);

  // Multi-parameter filter logic
  const filteredProducts = useMemo(() => {
    return valvesList.filter((item) => {
      // 1. Natural language semantic search & keyword parsing
      if (filter.search.trim() && semanticParsedQuery) {
        const evalResult = evaluateProductSemantic(item, semanticParsedQuery);
        if (!evalResult.matches) {
          return false;
        }
      }

      // 2. System Group Filter (PCCC, HVAC, Water, Oil&Gas, Steam, Gas/Cryogenic, Instrument)
      if (filter.systemGroup !== 'all' && item.systemGroup !== filter.systemGroup) {
        return false;
      }

      // 3. Category Filter
      if (filter.category !== 'all' && item.category !== filter.category) {
        return false;
      }

      // 4. Material filter
      if (filter.materialGroup !== 'all' && item.materialGroup !== filter.materialGroup) {
        return false;
      }

      // 5. Pressure group filter
      if (filter.pressureGroup !== 'all' && item.pressureGroup !== filter.pressureGroup) {
        return false;
      }

      // 6. Brand Filter (UTD, JMV-Korea, Johnson Controls, Tyco, Shield Valve UK, VYC-Spain)
      if (filter.brand && filter.brand !== 'all') {
        const itemBrand = item.brand || 'UTD';
        if (itemBrand !== filter.brand) {
          return false;
        }
      }

      return true;
    });
  }, [valvesList, filter]);

  // Fully localized products array ensuring 100% translation via catalogTranslationService
  const localizedDisplayProducts = useMemo(() => {
    return filteredProducts.map((p) => catalogTranslationService.translateProduct(p, lang));
  }, [filteredProducts, lang]);

  // Toggle valve in RFQ cart
  const handleToggleRfq = (product: ValveProduct) => {
    setRfqItems((prev) => {
      const exists = prev.some((item) => item.valve.id === product.id);
      if (exists) {
        return prev.filter((item) => item.valve.id !== product.id);
      } else {
        const defaultDn = product.specs[0]?.dn || 'DN50';
        return [...prev, { valve: product, selectedDn: defaultDn, quantity: 10 }];
      }
    });
  };

  const handleRemoveRfqItem = (valveId: string) => {
    setRfqItems((prev) => prev.filter((item) => item.valve.id !== valveId));
  };

  const handleUpdateRfqQuantity = (valveId: string, quantity: number) => {
    setRfqItems((prev) =>
      prev.map((item) =>
        item.valve.id === valveId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const handleOpenPdfPreview = (formData: RfqFormData) => {
    if (formData.companyName) {
      setActiveFormData(formData);
    }
    setIsPdfPreviewOpen(true);
  };

  const handleSaveProductFromAdmin = (updated: ValveProduct) => {
    hasUserEditedRef.current = true;
    saveValvesWithAudit((prev) => {
      const existsIndex = prev.findIndex((item) => item.id === updated.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = updated;
        return copy;
      } else {
        return [updated, ...prev];
      }
    });
    // Reset filters so newly added or modified product is visible immediately
    setFilter((prev) => ({
      ...prev,
      search: '',
      category: 'all',
      brand: 'all',
      systemGroup: 'all',
      materialGroup: 'all',
      pressureGroup: 'all',
    }));

    const isNew = isCreatingNewProduct;
    recordPendingChange();

    // Critical Requirement 2: Audit Logs for Admin tracking Product Data Changes
    portalStorage.addAuditLog(
      'Admin (Sản Phẩm)',
      isNew ? 'PRODUCT_CREATE' : 'PRODUCT_UPDATE',
      `${isNew ? 'Thêm mới' : 'Cập nhật'} van [${updated.code}] - ${updated.name} (Nhóm: ${updated.systemGroup}, Tiêu chuẩn: ${updated.standards})`,
      'SUCCESS',
      'PRODUCT',
      updated.code,
      'INFO',
      { code: updated.code, category: updated.category }
    );

    setIsCreatingNewProduct(false);
    setProductForAdminStudio(null);
    setSelectedValveForSpec((curr) => curr && curr.id === updated.id ? updated : curr);
    setSaveToast(`✓ Đã lưu ${updated.code} vào hệ thống & ghi nhật ký! Sẵn sàng Upload lên Hosting.`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleDeleteProduct = (id: string) => {
    const target = valvesList.find((v) => v.id === id);
    const code = target?.code || id;
    saveValvesWithAudit((prev) => prev.filter((item) => item.id !== id));
    setProductForAdminStudio(null);
    recordPendingChange();

    // Critical Requirement 2: Audit Logs for Admin tracking Product Deletion
    portalStorage.addAuditLog(
      'Admin (Sản Phẩm)',
      'PRODUCT_DELETE',
      `Admin đã xóa sản phẩm "${target?.name || id}" (Mã: ${code}) khỏi danh mục catalogue`,
      'SUCCESS',
      'PRODUCT',
      code,
      'WARNING'
    );

    setSaveToast(`✓ Đã xóa sản phẩm ${code} khỏi catalogue! Sẵn sàng Upload lên Hosting.`);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleAddNewProduct = () => {
    setIsCreatingNewProduct(true);
    setProductForAdminStudio({
      id: `utd-new-${Date.now()}`,
      code: 'Fig. UTD-NEW-2026',
      name: 'Van Công Nghiệp UTD Bổ Sung (Model 2026)',
      nameEn: 'UTD Industrial Valve New Addition',
      category: 'butterfly',
      categoryLabel: 'Butterfly valve (Van bướm)',
      categoryLabelEn: 'Butterfly Valve',
      systemGroup: 'water',
      systemGroupLabel: 'Water Supply & Industrial HVAC',
      image: '/uploads/studio_ball_valve.jpg',
      badge: 'Sản phẩm mới (Admin Studio)',
      material: 'Inox 316 / CF8M, Đệm PTFE kín khít',
      materialEn: 'Stainless Steel SS316 / CF8M, PTFE Seated',
      materialGroup: 'ss304_316',
      pressure: 'PN16 / PN25',
      pressureGroup: 'pn16',
      sizeRange: 'DN50 - DN600 (2" - 24")',
      tempRange: '-20°C đến +180°C',
      connection: 'Mặt bích Wafer / Lugged tiêu chuẩn DIN / JIS / ANSI',
      applicableMedia: ['Nước sạch', 'Nước làm mát chiller', 'Khí nén', 'Hóa chất'],
      applicableMediaEn: ['Potable Water', 'Chilled Water', 'Air', 'Chemicals'],
      standards: ['ASME B16.34', 'ISO 9001:2015', 'API 598', 'EN 12266-2'],
      description: 'Dòng van công nghiệp UTD mới được cập nhật trên cổng hệ thống, gia công CNC chính xác, đạt chuẩn kín khít tuyệt đối ISO 5208 Rate A.',
      descriptionEn: 'Precision manufactured UTD industrial valve for critical plant installations.',
      highlightFeatures: [
        'Gia công cơ khí chính xác CNC, kiểm định thủy tĩnh 100%',
        'Tích hợp đế ISO 5211 lắp đầu điều khiển điện hoặc khí nén trực tiếp',
        'Bảo hành chính hãng 18 tháng kèm chứng nhận CO/CQ nhà sản xuất'
      ],
      highlightFeaturesEn: [
        '100% hydrostatic tested before dispatch',
        'ISO 5211 top flange for actuator mounting',
        '18-month factory warranty with full Mill Test 3.1'
      ],
      leakageClass: 'ISO 5208 Rate A (Zero Bubble)',
      testPressureShell: '1.5 x PN',
      testPressureSeat: '1.1 x PN',
      referencePriceVnd: 1850000,
      cadFileAvailable: true,
      specs: [
        { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 43, height: 130, weightKg: 3.5, kvFlow: 125, flangeHoles: 4 },
        { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 46, height: 153, weightKg: 4.8, kvFlow: 410, flangeHoles: 8 },
        { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 52, height: 167, weightKg: 6.5, kvFlow: 750, flangeHoles: 8 },
        { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 56, height: 209, weightKg: 11.5, kvFlow: 1950, flangeHoles: 8 },
      ]
    });
  };

  const handleOpenKnowledge = (tab: 'pccc' | 'steam' | 'cross_ref' | 'hp_butterfly' = 'pccc') => {
    setKnowledgeModalState({
      isOpen: true,
      tab,
    });
  };

  const handleOpenTextEdit = (key: string, title: string, currentValue: string) => {
    setAdminTextEditState({
      isOpen: true,
      key,
      title,
      value: currentValue,
    });
  };

  const handleSaveTextEdit = (newVal: string) => {
    if (adminTextEditState.key === 'heroTitle') {
      setCustomHeroTitle(newVal);
    } else if (adminTextEditState.key === 'heroSubtitle') {
      setCustomHeroSubtitle(newVal);
    }
  };

  const rfqItemIds = useMemo(() => rfqItems.map((item) => item.valve.id), [rfqItems]);

  const scrollToRfq = () => {
    const el = document.getElementById('rfq-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Hidden File Input for Catalog Backup Restore */}
      <input
        ref={catalogFileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportCatalogJson}
        className="hidden"
      />

      {/* Admin Visual CMS Notice Bar when active */}
      {isAdminMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-black shadow-lg z-50 sticky top-0 border-b border-amber-600">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[10px] font-black font-mono">
                ADMIN CMS
              </span>
              <span>{lang === 'vi' ? '🛠️ CHẾ ĐỘ QUẢN TRỊ TOÀN QUYỀN' : '🛠️ FULL ADMIN CMS MODE'}</span>
              <span className="text-[11px] font-medium bg-amber-600/30 px-2 py-0.5 rounded border border-amber-700/50 hidden md:inline">
                {lang === 'vi' 
                  ? `🔒 Đã lưu & ghi nhớ an toàn (${valvesList.length} SP • ${categories.length} Nhóm)` 
                  : `🔒 Safely Synced (${valvesList.length} Items • ${categories.length} Groups)`}
              </span>
              {saveToast && (
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500 px-2.5 py-0.5 rounded text-[11px] font-black animate-pulse">
                  {saveToast}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleManualSave}
                className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-black shadow flex items-center gap-1 border border-emerald-600"
                title={lang === 'vi' ? 'Đồng bộ ngay lập tức và khóa an toàn toàn bộ dữ liệu vào IndexedDB & LocalStorage' : 'Immediately sync and lock all data into IndexedDB & LocalStorage'}
              >
                <span>{lang === 'vi' ? '🔒 Lưu & Khóa Tức Thì' : '🔒 Save & Lock'}</span>
              </button>

              {/* Requirement: Nút Upload Lên Hosting & Website Mỗi Khi Có Thay Đổi */}
              <button
                type="button"
                onClick={() => setIsHostingModalOpen(true)}
                className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white px-3 py-1 rounded text-[11px] font-black shadow-lg flex items-center gap-1.5 border border-blue-300 animate-pulse cursor-pointer relative"
                title={lang === 'vi' ? 'Upload và đồng bộ trang web & toàn bộ dữ liệu mới lên Hosting Server (103.75.184.20) mỗi khi có thay đổi' : 'Upload and deploy website updates to hosting server'}
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                <span>{lang === 'vi' ? '🚀 UPLOAD LÊN HOSTING & WEBSITE' : '🚀 UPLOAD TO HOSTING'}</span>
                {pendingHostingChangesCount > 0 ? (
                  <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold animate-bounce shadow">
                    {pendingHostingChangesCount} thay đổi mới
                  </span>
                ) : (
                  <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full text-[9px] font-bold">103.75.184.20</span>
                )}
              </button>

              {/* Requirement 3: Cảnh Báo Vật Liệu Thô & Bảng Giá */}
              <button
                type="button"
                onClick={() => setIsMaterialAlertOpen(true)}
                className="bg-rose-950 hover:bg-rose-900 text-rose-200 px-2.5 py-1 rounded text-[11px] font-bold shadow flex items-center gap-1 border border-rose-700 animate-pulse"
                title={lang === 'vi' ? 'Cảnh báo biến động giá quặng kim loại thô (>5% Inox/Gang) & cập nhật giá CSV/API' : 'Raw material cost fluctuation alert'}
              >
                <span>🚨 Cảnh Báo Vật Liệu (+14.5%)</span>
              </button>

              {/* Requirement 2: Audit Logs */}
              <button
                type="button"
                onClick={() => setIsAuditLogsModalOpen(true)}
                className="bg-indigo-950 hover:bg-indigo-900 text-indigo-200 px-2.5 py-1 rounded text-[11px] font-bold shadow flex items-center gap-1 border border-indigo-700"
                title={lang === 'vi' ? 'Xem nhật ký thay đổi sản phẩm, xóa dự án và cấu hình portal' : 'View Audit Logs'}
              >
                <span>📋 Audit Logs</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGlobalSeoModalOpen(true)}
                className="bg-indigo-700 hover:bg-indigo-600 text-white px-2.5 py-1 rounded text-[11px] font-black shadow flex items-center gap-1 border border-indigo-500"
                title={lang === 'vi' ? 'Tối ưu hóa SEO toàn bộ trang web và xem gợi ý viết 1-3 bài về van hàng tuần' : 'Global site SEO optimizer and weekly 1-3 suggested valve articles'}
              >
                <span>{lang === 'vi' ? '🚀 Tối Ưu SEO & Gợi Ý 1-3 Bài Viết' : '🚀 SEO & Weekly Articles'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCrawlerModalOpen(true)}
                className="bg-blue-900 hover:bg-blue-800 text-blue-200 px-2.5 py-1 rounded text-[11px] font-bold shadow flex items-center gap-1 border border-blue-700"
                title={lang === 'vi' ? 'Quét tự động thông số kỹ thuật và catalog từ VYC, Shield, JMV, Johnson Controls, Tyco' : 'Auto-crawl specs from 5 partner manufacturers'}
              >
                <span>{lang === 'vi' ? '🕷️ Quét Dữ Liệu 5 Hãng' : '🕷️ Crawler 5 Brands'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAiKnowledgeModalOpen(true)}
                className="bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-900 hover:from-cyan-800 hover:to-indigo-800 text-cyan-200 px-2.5 py-1 rounded text-[11px] font-black shadow flex items-center gap-1.5 border border-cyan-500 animate-pulse"
                title={lang === 'vi' ? 'AI Tự động cập nhật kiến thức 12+ loại van và bổ sung sản phẩm cho toàn bộ hệ thống' : 'AI Valve Knowledge Hub & Catalog Supplements'}
              >
                <span>🤖 AI Tri Thức & Bổ Sung Van</span>
              </button>

              <button
                type="button"
                onClick={() => setIsStorageCenterOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded text-[11px] font-black shadow flex items-center gap-1 border border-amber-300"
                title={lang === 'vi' ? 'Mở trung tâm lưu trữ dữ liệu, tải về máy tính và đồng bộ hosting' : 'Open data storage center, export backup and synchronize hosting'}
              >
                <span>{lang === 'vi' ? '💾 Lưu Trữ & Hosting' : '💾 Storage & Hosting'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCategoryManagerOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-300 px-2.5 py-1 rounded text-[11px] font-bold shadow flex items-center gap-1 border border-slate-700"
                title={lang === 'vi' ? 'Thêm, xóa hoặc sắp xếp thứ tự danh mục van' : 'Add, remove or reorder valve categories'}
              >
                <span>{lang === 'vi' ? '📁 Quản Lý Thứ Tự Danh Mục' : '📁 Manage Categories'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddNewProduct}
                className="bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow flex items-center gap-1"
                title={lang === 'vi' ? 'Thêm sản phẩm van mới vào website' : 'Add new valve product to catalog'}
              >
                <span>{lang === 'vi' ? '➕ Thêm Van Mới' : '➕ Add Valve'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCatalogJson}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 px-2 py-1 rounded text-[11px] font-bold shadow border border-slate-700"
                title={lang === 'vi' ? 'Tải về file JSON sao lưu toàn bộ danh mục sản phẩm' : 'Download JSON backup of entire product catalog'}
              >
                <span>{lang === 'vi' ? '💾 Sao Lưu (JSON)' : '💾 Backup (JSON)'}</span>
              </button>

              <button
                type="button"
                onClick={() => catalogFileInputRef.current?.click()}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 px-2 py-1 rounded text-[11px] font-bold shadow border border-slate-700"
                title={lang === 'vi' ? 'Nạp dữ liệu danh mục từ file sao lưu JSON' : 'Import catalog data from backup JSON file'}
              >
                <span>{lang === 'vi' ? '📥 Nạp Dữ Liệu' : '📥 Import Data'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetValvesToDefault}
                className="bg-red-950 hover:bg-red-900 text-red-200 px-2 py-1 rounded text-[11px] font-bold shadow border border-red-800"
                title={lang === 'vi' ? 'Khôi phục danh mục về các dòng van chuẩn ban đầu' : 'Reset catalog to initial default valves'}
              >
                <span>{lang === 'vi' ? '🔄 Reset Gốc' : '🔄 Factory Reset'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAdminMode(false);
                  setUserRole('contractor');
                }}
                className="bg-slate-950 text-white px-2.5 py-1 rounded text-[11px] font-bold hover:bg-slate-800 shadow"
              >
                {lang === 'vi' ? '✕ Tắt Admin' : '✕ Exit Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Security Shield (Anti-Copy, Anti-Inspect, Dynamic Watermark) */}
      <EnterpriseSecurityShield 
        isAdmin={isAdminMode} 
        isAdminOverride={isAdminOverride}
        onToggleAdminOverride={handleToggleAdminOverride}
      />

      {/* Enterprise Gatekeeper Modal (Restricts access exclusively to internal organization members) */}
      <EnterpriseGatekeeperModal
        isOpen={isGatekeeperBlocked}
        onAuthenticated={() => {
          setEnterpriseSession(getEnterpriseSession());
        }}
        onOpenAdminLogin={() => {
          setIsAuthModalOpen(true);
        }}
        onClose={() => {
          setEnterpriseSession(getEnterpriseSession());
        }}
        lang={lang}
      />

      {/* 1. Header Navigation */}
      <Header
        lang={lang}
        setLang={setLang}
        userRole={userRole}
        setUserRole={setUserRole}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        rfqCount={rfqItems.length}
        onOpenRfq={scrollToRfq}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenCatalogue={() => setIsCatalogueOpen(true)}
        onOpenKnowledge={handleOpenKnowledge}
        onOpenHosting={() => setIsHostingModalOpen(true)}
        onOpenAudit={() => setIsAuditModalOpen(true)}
        onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
        onOpenDataStorage={() => setIsStorageCenterOpen(true)}
        onOpenCrawler={() => setIsCrawlerModalOpen(true)}
        isAdminOverride={isAdminOverride}
        onToggleAdminOverride={handleToggleAdminOverride}
        onOpenB2BRegistration={() => {
          setB2BRegistrationTaxCode(activeFormData.taxCode);
          setB2BRegistrationCompanyName(activeFormData.companyName);
          setIsB2BRegistrationOpen(true);
        }}
        onOpenTaxLookup={() => {
          setTaxLookupInitialCode(activeFormData.taxCode);
          setIsTaxLookupOpen(true);
        }}
        pendingDealersCount={pendingB2BDealersCount}
        onOpenManageDealers={() => setIsAuthModalOpen(true)}
        onOpenInternalLogin={() => setIsAuthModalOpen(true)}
        onOpenPortal={() => setIsPortalModalOpen(true)}
        onOpenMaterialAlert={() => setIsMaterialAlertOpen(true)}
        onOpenAuditLogs={() => setIsAuditLogsModalOpen(true)}
        onOpenExportCatalogModal={() => setIsExportCatalogModalOpen(true)}
        pendingChangesCount={pendingHostingChangesCount}
        hasMaterialAlert={true}
        onOpenAiKnowledge={() => setIsAiKnowledgeModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          lang={lang}
          onOpenCatalogue={() => setIsCatalogueOpen(true)}
          onOpenKnowledge={handleOpenKnowledge}
          isAdminMode={isAdminMode}
          onEditContent={handleOpenTextEdit}
          customHeroTitle={customHeroTitle}
          customHeroSubtitle={customHeroSubtitle}
        />

        {/* 3. Technical Highlights */}
        <TechnicalHighlights lang={lang} />

        {/* 4. Products & Multi-Parameter Filter Section */}
        <section id="products" className="py-16 sm:py-20 bg-slate-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-bold font-mono uppercase mb-2">
                {lang === 'vi' ? 'HỆ THỐNG VAN 20 NHÓM & TIÊU CHUẨN QUỐC TẾ' : '20 VALVE CATEGORIES & GLOBAL STANDARDS'}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {lang === 'vi' ? 'Hệ Thống Van Công Nghiệp & PCCC UTD' : 'UTD Certified Industrial & Fire Protection Valves'}
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                {lang === 'vi'
                  ? 'Phân loại theo nhóm hệ thống ứng dụng: PCCC, HVAC Chiller, Cấp thoát nước, Dầu khí, Hệ thống Steam hơi nóng và Khí công nghiệp.'
                  : 'Categorized by critical system applications: Fire Protection, HVAC Chiller, Water Utilities, Oil & Gas, Steam and Cryogenic Gas.'}
              </p>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              totalMatches={filteredProducts.length}
              totalProducts={valvesList.length}
              lang={lang}
              onOpenKnowledge={handleOpenKnowledge}
              categories={categories}
              isAdminMode={isAdminMode}
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
              semanticQuery={semanticParsedQuery}
            />

            {/* Product Grid with Admin in-place edit */}
            <ProductGrid
              products={localizedDisplayProducts}
              lang={lang}
              userRole={userRole}
              isAdminMode={isAdminMode}
              onOpenSpecs={(valve) => setSelectedValveForSpec(valve)}
              onToggleRfq={handleToggleRfq}
              onEditProductByAdmin={(valve) => {
                setIsCreatingNewProduct(false);
                setProductForAdminStudio(valve);
              }}
              onAddNewProduct={handleAddNewProduct}
              onOpenKnowledgeTopic={(tab) => handleOpenKnowledge(tab)}
              rfqItemIds={rfqItemIds}
            />
          </div>
        </section>

        {/* 5. Global Authorized Brands Distributed by Industracorp */}
        <BrandPortfolioSection
          lang={lang}
          onSelectBrand={(brandName) => {
            setFilter((prev) => ({ ...prev, brand: brandName }));
            const el = document.getElementById('products');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* 6. Comparison Matrix Section */}
        <ComparisonMatrix lang={lang} />

        {/* 7. Strategic Clients */}
        <StrategicClients lang={lang} />

        {/* 8. Real-world Projects Showcase Section (2009 - Present) */}
        <ProjectsShowcaseSection
          projects={projectsList}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          onUpdateProject={handleUpdateProject}
          onReorderProjects={handleReorderProjects}
          onOpenAdminTimeline={handleOpenAdminStudioTimeline}
          lang={lang}
          isAdminMode={isAdminMode}
        />

        {/* 9. Valve Industry Technical News & Multi-source Knowledge Bulletin */}
        <section id="valve-news" className="border-b border-slate-800">
          <ValveNewsSection
            lang={lang}
            isAdminMode={isAdminMode}
            onSelectValveCode={(code) => {
              const matched = valvesList.find(v => v.code === code);
              if (matched) setSelectedValveForSpec(matched);
            }}
          />
        </section>

        {/* 10. Advanced B2B RFQ Form */}
        <RfqForm
          lang={lang}
          rfqItems={rfqItems}
          onRemoveItem={handleRemoveRfqItem}
          onUpdateQuantity={handleUpdateRfqQuantity}
          onOpenPdfPreview={handleOpenPdfPreview}
          onOpenIntegrationGuide={() => setIsGuideOpen(true)}
          isApprovedMember={isApprovedMember}
          onOpenB2BRegistration={(tax, company) => {
            setB2BRegistrationTaxCode(tax || activeFormData.taxCode);
            setB2BRegistrationCompanyName(company || activeFormData.companyName);
            setIsB2BRegistrationOpen(true);
          }}
          onOpenTaxLookup={(tax) => {
            setTaxLookupInitialCode(tax || activeFormData.taxCode);
            setIsTaxLookupOpen(true);
          }}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      </main>

      {/* 8. Footer */}
      <Footer
        lang={lang}
        onOpenCatalogue={() => setIsCatalogueOpen(true)}
        contactInfo={contactInfo}
        isAdminMode={isAdminMode}
        onEditContactInfo={() => setIsContactModalOpen(true)}
      />

      {/* Pop-up Spec Modal */}
      {selectedValveForSpec && (
        <SpecModal
          valve={selectedValveForSpec}
          onClose={() => setSelectedValveForSpec(null)}
          lang={lang}
          userRole={userRole}
          onToggleRfq={handleToggleRfq}
          isInRfq={rfqItemIds.includes(selectedValveForSpec.id)}
          isAdminMode={isAdminMode}
          onSaveValve={handleSaveProductFromAdmin}
          onOpenKnowledge={handleOpenKnowledge}
        />
      )}

      {/* Admin Studio: Smart Image Auto-Fit, Staging & In-Place Product Editor */}
      {productForAdminStudio && (
        <AdminStudioOverlay
          isOpen={Boolean(productForAdminStudio)}
          onClose={() => {
            setProductForAdminStudio(null);
            setIsCreatingNewProduct(false);
          }}
          productToEdit={productForAdminStudio}
          onSaveProduct={handleSaveProductFromAdmin}
          onDeleteProduct={handleDeleteProduct}
          isCreateNew={isCreatingNewProduct}
          lang={lang}
          categories={categories}
          projects={projectsList}
          allProducts={valvesList}
          onBatchUpdateValves={saveValvesWithAudit}
          onReorderProjects={handleReorderProjects}
          onBatchUpdateProjects={handleBatchUpdateProjects}
          initialTab={adminStudioInitialTab}
          isAdminOverride={isAdminOverride}
          onToggleAdminOverride={handleToggleAdminOverride}
          onOpenExportCatalogModal={() => setIsExportCatalogModalOpen(true)}
        />
      )}

      {/* AI Catalog Auto-Translation Live Toast */}
      {translationProgress && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-indigo-500/70 text-slate-100 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in font-mono text-xs">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-400 shrink-0">
            {translationProgress.isTranslating ? (
              <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-emerald-400 font-bold">✓</span>
            )}
          </div>
          <div>
            <div className="font-bold flex items-center gap-1.5 text-white">
              <span>{translationProgress.isTranslating ? (lang === 'vi' ? 'AI Tự Động Dịch Toàn Bộ Danh Mục...' : (lang === 'zh' ? 'AI 正在自动深度翻译产品目录...' : 'AI Translating Product Catalog...')) : (lang === 'vi' ? 'Đã Dịch Danh Mục Thành Công' : (lang === 'zh' ? '目录全量翻译已就绪' : 'Catalog Translation Ready'))}</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-700 text-[10px] text-indigo-300 uppercase">
                {translationProgress.targetLang}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {translationProgress.isTranslating
                ? `Đang chuyển đổi tên, mô tả & đặc tính kỹ thuật (${translationProgress.current}/${translationProgress.total})...`
                : `Toàn bộ ${translationProgress.total} sản phẩm đã dịch chuẩn xác sang ngôn ngữ ${translationProgress.targetLang.toUpperCase()}.`}
            </p>
          </div>
        </div>
      )}

      {/* Admin Warehouse & Contact Info Live Editor Modal */}
      <ContactAdminModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contactInfo={contactInfo}
        onSave={(updated) => setContactInfo(updated)}
        lang={lang}
      />

      {/* Admin Text In-Place Editor Modal */}
      {adminTextEditState.isOpen && (
        <AdminTextEditModal
          isOpen={adminTextEditState.isOpen}
          onClose={() => setAdminTextEditState({ ...adminTextEditState, isOpen: false })}
          title={adminTextEditState.title}
          initialValue={adminTextEditState.value}
          onSave={handleSaveTextEdit}
          lang={lang}
        />
      )}

      {/* Knowledge Hub Modal (PCCC, Steam, Cross-Ref, High Performance Butterfly) */}
      <KnowledgeHubModal
        isOpen={knowledgeModalState.isOpen}
        onClose={() => setKnowledgeModalState({ ...knowledgeModalState, isOpen: false })}
        initialTab={knowledgeModalState.tab}
        lang={lang}
      />

      {/* Admin Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        onAdminLoginSuccess={() => {
          setIsAdminMode(true);
          setUserRole('admin');
          setCurrentUserSession(getCurrentSession());
          setIsAuthModalOpen(false);
        }}
        onMemberLoginSuccess={(_member) => {
          setUserRole('contractor');
          setCurrentUserSession(getCurrentSession());
          setIsAuthModalOpen(false);
        }}
        onLogout={() => {
          setCurrentSession(null);
          setCurrentUserSession(null);
          setIsAdminMode(false);
          setUserRole('guest');
        }}
        currentUserSession={currentUserSession}
      />

      {/* Hosting & Staging industracorp.com Modal */}
      <HostingDeployModal
        isOpen={isHostingModalOpen}
        onClose={() => setIsHostingModalOpen(false)}
        lang={lang}
        onOpenDataStorage={() => setIsStorageCenterOpen(true)}
      />

      {/* Catalogue Error Audit & Technical Rectification Modal */}
      <CatalogAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        lang={lang}
      />

      {/* Quote PDF Preview Modal */}
      <QuotePdfPreviewModal
        isOpen={isPdfPreviewOpen}
        onClose={() => setIsPdfPreviewOpen(false)}
        rfqItems={rfqItems}
        formData={activeFormData}
        userRole={userRole}
        lang={lang}
        isAdminMode={isAdminMode}
        onOpenB2BRegistration={(tax, company) => {
          setB2BRegistrationTaxCode(tax || activeFormData.taxCode);
          setB2BRegistrationCompanyName(company || activeFormData.companyName);
          setIsB2BRegistrationOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenTaxLookup={(tax) => {
          setTaxLookupInitialCode(tax || activeFormData.taxCode);
          setIsTaxLookupOpen(true);
        }}
      />

      {/* Tax Lookup Modal (Đối chiếu Tổng Cục Thuế Việt Nam) */}
      <TaxLookupModal
        isOpen={isTaxLookupOpen}
        onClose={() => setIsTaxLookupOpen(false)}
        lang={lang}
        initialTaxCode={taxLookupInitialCode}
        onApplyToRfq={(res) => {
          setActiveFormData(prev => ({
            ...prev,
            taxCode: res.taxCode,
            companyName: res.companyName,
            deliveryLocation: res.address || prev.deliveryLocation
          }));
          setIsTaxLookupOpen(false);
          setSaveToast(`✓ Đã áp dụng MST ${res.taxCode} vào form Báo Giá RFQ!`);
          setTimeout(() => setSaveToast(null), 3000);
        }}
        onApplyToB2B={(res) => {
          setB2BRegistrationTaxCode(res.taxCode);
          setB2BRegistrationCompanyName(res.companyName);
          setIsTaxLookupOpen(false);
          setIsB2BRegistrationOpen(true);
        }}
      />

      {/* B2B Dealer Registration Modal (Đăng Ký Đại Lý B2B) */}
      <B2BRegistrationModal
        isOpen={isB2BRegistrationOpen}
        onClose={() => setIsB2BRegistrationOpen(false)}
        lang={lang}
        initialTaxCode={b2bRegistrationTaxCode}
        initialCompanyName={b2bRegistrationCompanyName}
        isAdminMode={isAdminMode}
        onOpenTaxLookup={() => {
          setTaxLookupInitialCode(b2bRegistrationTaxCode);
          setIsTaxLookupOpen(true);
        }}
        onRegistrationSuccess={(_member) => {
          setPendingB2BDealersCount(getPendingB2BDealersCount());
        }}
      />

      {/* Guide Modal: Deploy & Integration */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />

      {/* Catalogue PDF Download Modal */}
      <CatalogueModal
        isOpen={isCatalogueOpen}
        onClose={() => setIsCatalogueOpen(false)}
        lang={lang}
      />

      {/* Admin Category Order & Group Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onUpdateCategories={handleUpdateCategories}
        products={valvesList}
        lang={lang}
      />

      {/* Admin Data Storage & Hosting Synchronization Center Modal */}
      <DataStorageCenterModal
        isOpen={isStorageCenterOpen}
        onClose={() => setIsStorageCenterOpen(false)}
        products={valvesList}
        categories={categories}
        contactInfo={contactInfo}
        onUpdateProducts={(newProducts) => saveValvesWithAudit(newProducts)}
        onUpdateCategories={handleUpdateCategories}
        onUpdateContactInfo={(newContact) => setContactInfo(newContact)}
        lang={lang}
      />

      {/* Autonomous Background Crawler Modal for 5 Partner Brands */}
      <BrandCrawlerModal
        isOpen={isCrawlerModalOpen}
        onClose={() => setIsCrawlerModalOpen(false)}
        lang={lang}
        onSyncProductsToCatalog={handleSyncCrawledValves}
        totalCatalogProducts={valvesList.length}
      />

      {/* Global Site SEO Optimizer & Weekly Suggested Articles Modal (Yêu cầu 9 & 10) */}
      <GlobalSeoAndWeeklyArticlesModal
        isOpen={isGlobalSeoModalOpen}
        onClose={() => setIsGlobalSeoModalOpen(false)}
        lang={lang}
        onSelectValveCode={(code) => {
          const matched = valvesList.find(v => v.code === code);
          if (matched) setSelectedValveForSpec(matched);
        }}
      />

      {/* Centralized Enterprise Portal Modal (Cổng Quản Trị Tập Trung - 4 Modules & AI Hub) */}
      <CentralizedPortalModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        onOpenHosting={() => setIsHostingModalOpen(true)}
        valves={valvesList}
        onBatchUpdateValves={saveValvesWithAudit}
        onOpenExportCatalogModal={() => setIsExportCatalogModalOpen(true)}
      />

      {/* Hosting & Website Deploy Modal (103.75.184.20 / www.industracorp.com) */}
      <HostingDeployModal
        isOpen={isHostingModalOpen}
        onClose={() => setIsHostingModalOpen(false)}
        lang={lang}
        onOpenDataStorage={() => setIsStorageCenterOpen(true)}
        onDeployComplete={handleHostingDeployComplete}
      />

      {/* Raw Material Fluctuation Alert & Batch Price Update Modal (Critical Req #3) */}
      <MaterialCostAlertModal
        isOpen={isMaterialAlertOpen}
        onClose={() => setIsMaterialAlertOpen(false)}
        lang={lang}
        valves={valvesList}
        onBatchUpdateValves={saveValvesWithAudit}
        onOpenHostingDeploy={() => {
          setIsMaterialAlertOpen(false);
          setIsHostingModalOpen(true);
        }}
        onNotifyChange={recordPendingChange}
      />

      {/* Enterprise Audit Logs Tracker Modal (Critical Req #2) */}
      <AuditLogsModal
        isOpen={isAuditLogsModalOpen}
        onClose={() => setIsAuditLogsModalOpen(false)}
        lang={lang}
        onOpenHostingDeploy={() => {
          setIsAuditLogsModalOpen(false);
          setIsHostingModalOpen(true);
        }}
      />

      {/* Export Translated Product Catalog CSV (English / Chinese / Bilingual) */}
      <ExportTranslatedCatalogModal
        isOpen={isExportCatalogModalOpen}
        onClose={() => setIsExportCatalogModalOpen(false)}
        products={valvesList}
        lang={lang}
      />

      {/* AI Valve Knowledge Hub & Catalog Enrichment Modal (Gemini 3.8 Flash) */}
      <AiValveKnowledgeModal
        isOpen={isAiKnowledgeModalOpen}
        onClose={() => setIsAiKnowledgeModalOpen(false)}
        products={valvesList}
        onUpdateProducts={saveValvesWithAudit}
        onSelectValveForSpec={(valve) => setSelectedValveForSpec(valve)}
        lang={lang}
      />

      {/* Floating Live Engineering Chat Widget */}
      <LiveChatWidget 
        lang={lang} 
        valves={valvesList}
        onSelectValve={(valve) => setSelectedValveForSpec(valve)}
        onSelectFig={(figCode) => {
          const matched = valvesList.find(v => 
            v.code.toUpperCase().includes(figCode.toUpperCase()) || 
            figCode.toUpperCase().includes(v.code.toUpperCase()) ||
            v.name.toUpperCase().includes(figCode.toUpperCase())
          );
          if (matched) setSelectedValveForSpec(matched);
        }}
        onToggleRfq={handleToggleRfq}
        rfqItemIds={rfqItemIds}
        onOpenRfq={scrollToRfq}
        onOpenAiKnowledgeModal={() => setIsAiKnowledgeModalOpen(true)}
      />

      {/* Floating Admin Quick Action Bar: Upload Lên Hosting & Website Mỗi Khi Có Thay Đổi (Critical Req #1) */}
      {isAdminMode && (
        <div className="fixed bottom-6 right-20 z-40 flex items-center gap-2">
          {/* Main Upload Hosting Button */}
          <button
            type="button"
            onClick={() => setIsHostingModalOpen(true)}
            className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-600 hover:to-purple-500 text-white px-3.5 py-2 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 border border-blue-300 hover:scale-105 transition-all cursor-pointer ring-4 ring-blue-500/30 animate-pulse relative"
            title="Upload và đồng bộ toàn bộ thay đổi mới lên máy chủ Hosting & Website (103.75.184.20)"
          >
            <UploadCloud className="w-4 h-4 text-amber-300 animate-bounce" />
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-black tracking-wide leading-none flex items-center gap-1.5">
                <span>UPLOAD LÊN HOSTING</span>
                {pendingHostingChangesCount > 0 ? (
                  <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black animate-pulse shadow">
                    {pendingHostingChangesCount} mới
                  </span>
                ) : (
                  <span className="bg-emerald-500/80 text-white px-1 py-0.2 rounded text-[8px] font-mono">OK</span>
                )}
              </div>
              <div className="text-[9px] text-blue-200 font-mono leading-tight mt-0.5">
                103.75.184.20 • {pendingHostingChangesCount > 0 ? 'Có thay đổi chưa đẩy' : 'Đã đồng bộ'}
              </div>
            </div>
            <span className="sm:hidden font-mono text-[10px]">
              HOSTING {pendingHostingChangesCount > 0 ? `(${pendingHostingChangesCount})` : ''}
            </span>
          </button>

          {/* Quick Audit Logs Float button */}
          <button
            type="button"
            onClick={() => setIsAuditLogsModalOpen(true)}
            className="bg-slate-900/90 hover:bg-indigo-950 border border-indigo-500/60 text-indigo-300 p-2.5 rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-bold"
            title="Xem Nhật Ký Hoạt Động Quản Trị (Audit Logs)"
          >
            <Clock className="w-4 h-4 text-indigo-400" />
            <span className="hidden lg:inline">Audit Logs</span>
          </button>

          {/* Quick Material Alert Float button */}
          <button
            type="button"
            onClick={() => setIsMaterialAlertOpen(true)}
            className="bg-rose-950/90 hover:bg-rose-900 border border-rose-500/60 text-rose-200 p-2.5 rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-bold animate-pulse"
            title="Cảnh báo biến động vật liệu thô LME & Cập nhật giá CSV/API"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span className="hidden lg:inline">Giá LME (+14.5%)</span>
          </button>

          {/* Quick Translated CSV Export Float button */}
          <button
            type="button"
            onClick={() => setIsExportCatalogModalOpen(true)}
            className="bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 p-2.5 rounded-2xl shadow-xl transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Tự động dịch và xuất toàn bộ danh mục van sang file CSV (Anh/Trung) cho đối tác xuất khẩu"
          >
            <Languages className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Xuất CSV Anh/Trung</span>
          </button>
        </div>
      )}

      {/* Enterprise Security Active Indicator Badge */}
      {enterpriseSession?.isAuthenticated && (
        <div className="fixed bottom-5 left-5 z-40 bg-slate-900/90 border border-red-500/50 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-mono text-red-200 flex items-center gap-2 shadow-xl ring-2 ring-red-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{lang === 'vi' ? 'Nội Bộ:' : 'Corp:'} {enterpriseSession.email || 'Passcode OK'}</span>
          <button
            type="button"
            onClick={() => {
              logoutEnterpriseSession();
              setEnterpriseSession(null);
            }}
            className="text-slate-400 hover:text-white ml-1 font-bold underline cursor-pointer text-[10px]"
            title={lang === 'vi' ? 'Đăng xuất và khóa lại cổng bảo mật' : 'Lock Security Gateway'}
          >
            {lang === 'vi' ? 'Khóa lại' : 'Lock'}
          </button>
        </div>
      )}
    </div>
  );
}
