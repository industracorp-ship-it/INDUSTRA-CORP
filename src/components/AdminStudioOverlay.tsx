import React, { useState, useRef } from 'react';
import { 
  GripVertical,
  Tag,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  FileCheck,
  Sparkles, 
  UploadCloud, 
  Crop, 
  Sliders, 
  Save, 
  X, 
  Check, 
  Trash2, 
  Image as ImageIcon, 
  Sun, 
  Contrast, 
  RefreshCcw, 
  FileText, 
  Layers, 
  AlertTriangle,
  Plus,
  BookOpen,
  FileSpreadsheet,
  Download,
  FileUp,
  Search,
  Lock,
  Unlock,
  Bell,
  Flame,
  TrendingUp,
  Pin,
  Zap,
  Globe,
  Eye,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Gauge,
  Cpu,
  Languages,
  Droplet,
  Wrench
} from 'lucide-react';
import { ValveProduct, ProjectRecord, ValveCategory, SystemGroup, MaterialType, PressureRating, ValveDimensionSpec, CategoryItem, CustomCharacteristic, ValveCharacteristics, ValveImageVariants, SupportedLanguage } from '../types/valve';
import { optimizeImageFile, bakeStudioEnhancement, processMultiResolutionImagePipeline, OptimizedImageSet, convertToWebPAndOptimize, WebPOptimizeResult } from '../utils/imageOptimizer';
import { portalStorage } from '../services/portalStorage';
import { resolveProductImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';
import { DEFAULT_CATEGORIES } from '../data/categoryData';
import { synthesizeValveCharacteristics } from '../utils/aiCharacteristics';
import { auditProductSeo } from '../utils/seoAuditEngine';
import { analyzeSmartCategorization, SmartCategorizationResult } from '../utils/smartCategorization';
import { translateDescriptionSmart, translateKeywordsSmart, translateMetaTitleAndDescription, translateTechString } from '../utils/engineeringTranslator';
import { UTD_CATALOGUE_FIGURE_PRESETS, findMatchingFigPreset, UtdCatalogueFigPreset } from '../utils/cataloguePresets';
import { suggestMechanicalDesignFeatures } from '../utils/mechanicalDesignAdvisor';
import { getAdminOverrideMode, setAdminOverrideMode } from '../utils/enterpriseSecurityEngine';
import { 
  getHighDemandAlerts, 
  prioritizeValveInCatalog, 
  dismissDemandAlert, 
  resetDemandAlerts, 
  HighDemandAlertItem 
} from '../utils/valveDemandAlertEngine';

interface AdminStudioOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: ValveProduct | null;
  onSaveProduct: (updated: ValveProduct) => void;
  onDeleteProduct?: (id: string) => void;
  isCreateNew?: boolean;
  lang: SupportedLanguage;
  categories?: CategoryItem[];
  projects?: ProjectRecord[];
  allProducts?: ValveProduct[];
  onBatchUpdateValves?: (updatedValves: ValveProduct[]) => void;
  onReorderProjects?: (reordered: ProjectRecord[]) => void;
  onBatchUpdateProjects?: (updatedProjects: ProjectRecord[]) => void;
  initialTab?: 'editor' | 'projects_timeline' | 'seo_audit' | 'demand_alerts';
  isAdminOverride?: boolean;
  onToggleAdminOverride?: () => void;
  onOpenExportCatalogModal?: () => void;
  onOpenNotificationSettings?: () => void;
}

export const AdminStudioOverlay: React.FC<AdminStudioOverlayProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSaveProduct,
  onDeleteProduct,
  isCreateNew = false,
  lang,
  categories = DEFAULT_CATEGORIES,
  projects = [],
  allProducts = [],
  onBatchUpdateValves,
  onReorderProjects,
  onBatchUpdateProjects,
  initialTab = 'editor',
  isAdminOverride,
  onToggleAdminOverride,
  onOpenExportCatalogModal,
  onOpenNotificationSettings,
}) => {
  if (!isOpen) return null;

  const defaultEmptyProduct: ValveProduct = {
    id: `utd-new-${Date.now()}`,
    code: 'UTD-VALVE-NEW',
    name: 'Van Công Nghiệp UTD Mới',
    nameEn: 'UTD New Industrial Valve',
    category: 'ball',
    categoryLabel: 'Ball valves (Van bi)',
    categoryLabelEn: 'Ball Valves',
    systemGroup: 'water',
    systemGroupLabel: 'Water Supply System',
    image: '/uploads/studio_ball_valve.jpg',
    badge: 'Sản phẩm mới (New Model)',
    material: 'Inox 316 / CF8M (Gioăng PTFE)',
    materialEn: 'Stainless Steel SS316 / CF8M',
    materialGroup: 'ss304_316',
    pressure: 'PN16 / PN25',
    pressureGroup: 'pn25',
    sizeRange: 'DN15 - DN300 (1/2" - 12")',
    tempRange: '-20°C đến +180°C',
    connection: 'Mặt bích tiêu chuẩn DIN / ANSI / JIS',
    applicableMedia: ['Nước', 'Dầu', 'Khí nén', 'Hóa chất'],
    applicableMediaEn: ['Water', 'Oil', 'Compressed Air'],
    standards: ['ASME B16.34', 'ISO 9001:2015', 'API 598'],
    description: 'Dòng van công nghiệp UTD chế tạo đúc chính xác, đạt chuẩn kín khít tuyệt đối, chống ăn mòn hóa chất và áp suất cao.',
    descriptionEn: 'High performance industrial valve with precision casting and zero leakage sealing.',
    highlightFeatures: [
      'Gia công cơ khí CNC chuẩn xác 100%, chống kẹt rác',
      'Đế ISO 5211 tích hợp sẵn, dễ lắp actuator khí nén hoặc điện',
      'Độ kín khít tuyệt đối Bubble-Tight theo ISO 5208 Rate A',
      'Thử áp lực thủy tĩnh 100% trước khi xuất xưởng'
    ],
    highlightFeaturesEn: [
      '100% precision CNC machined',
      'ISO 5211 platform for easy actuator mounting',
      'Bubble-tight shutoff ISO 5208 Rate A',
      'Hydrostatic tested'
    ],
    leakageClass: 'ISO 5208 Rate A / ANSI Class VI',
    testPressureShell: '1.5 x PN',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 2200000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 150, height: 130, weightKg: 8.5, kvFlow: 380, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 180, height: 165, weightKg: 16.0, kvFlow: 1050, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 190, height: 188, weightKg: 24.0, kvFlow: 1800, flangeHoles: 8 },
    ]
  };

  const initial = productToEdit || defaultEmptyProduct;

  const [name, setName] = useState(initial.name);
  const [badge, setBadge] = useState(initial.badge || 'Sản phẩm mới (New Model)');
  const [code, setCode] = useState(initial.code);
  const [brand, setBrand] = useState(initial.brand || 'UTD');
  const [price, setPrice] = useState(initial.referencePriceVnd);
  const [pressure, setPressure] = useState(initial.pressure);
  const [material, setMaterial] = useState(initial.material);
  const [category, setCategory] = useState<ValveCategory>(initial.category);
  const [systemGroup, setSystemGroup] = useState<SystemGroup>(initial.systemGroup);
  const [imageSrc, setImageSrc] = useState(initial.image);
  const [imagesList, setImagesList] = useState<string[]>(() => {
    if (initial.images && initial.images.length > 0) return initial.images;
    return initial.image ? [initial.image] : ['/uploads/studio_ball_valve.jpg'];
  });
  const [imageVariantsMap, setImageVariantsMap] = useState<ValveImageVariants[]>(
    initial.imagesVariants || (initial.imageVariants ? [initial.imageVariants] : [])
  );
  const [optPipelineStatus, setOptPipelineStatus] = useState<string | null>(null);
  const [activeImageSlot, setActiveImageSlot] = useState<number>(0);
  // Automated WebP Conversion & Dimension Optimization state
  const [webpQuality, setWebpQuality] = useState<number>(0.82);
  const [webpMaxDim, setWebpMaxDim] = useState<number>(1280);
  const [webpStats, setWebpStats] = useState<WebPOptimizeResult | null>(null);
  const [isWebpBatchConverting, setIsWebpBatchConverting] = useState(false);
  const [nameEn, setNameEn] = useState(initial.nameEn || '');
  const [descriptionEn, setDescriptionEn] = useState(initial.descriptionEn || '');
  const [adminStudioTab, setAdminStudioTab] = useState<'editor' | 'projects_timeline' | 'seo_audit' | 'demand_alerts'>(initialTab || 'editor');

  // Automated High-Demand Valve Alert System state (PICV & HP Butterfly)
  const [demandAlerts, setDemandAlerts] = useState<HighDemandAlertItem[]>(getHighDemandAlerts);
  const [demandAlertToast, setDemandAlertToast] = useState<string | null>(null);

  // Admin Override Mode state
  const [localOverride, setLocalOverride] = useState<boolean>(getAdminOverrideMode);
  const isOverrideModeActive = isAdminOverride !== undefined ? isAdminOverride : localOverride;

  const handleToggleAdminOverrideMode = () => {
    if (onToggleAdminOverride) {
      onToggleAdminOverride();
    } else {
      const next = !isOverrideModeActive;
      setAdminOverrideMode(next);
      setLocalOverride(next);
    }
  };

  React.useEffect(() => {
    const handleAlertsUpdate = () => {
      setDemandAlerts(getHighDemandAlerts());
    };
    const handleOverrideUpdate = () => {
      setLocalOverride(getAdminOverrideMode());
    };
    window.addEventListener('storage', handleAlertsUpdate);
    window.addEventListener('utd_demand_alerts_updated' as any, handleAlertsUpdate);
    window.addEventListener('utd_admin_override_change' as any, handleOverrideUpdate);
    return () => {
      window.removeEventListener('storage', handleAlertsUpdate);
      window.removeEventListener('utd_demand_alerts_updated' as any, handleAlertsUpdate);
      window.removeEventListener('utd_admin_override_change' as any, handleOverrideUpdate);
    };
  }, []);

  const handlePrioritizeAlertValve = (alertId: string) => {
    if (allProducts && allProducts.length > 0) {
      const { updatedValves, updatedAlert } = prioritizeValveInCatalog(alertId, allProducts);
      if (onBatchUpdateValves) {
        onBatchUpdateValves(updatedValves);
      }
      setDemandAlerts(getHighDemandAlerts());
      setDemandAlertToast(
        lang === 'vi' 
          ? `✓ Đã ghim thành công model van ${updatedAlert?.valveCode} lên vị trí VIP đầu danh mục catalogue!` 
          : `✓ Successfully prioritized ${updatedAlert?.valveCode} to top of catalogue!`
      );
    } else {
      const { updatedAlert } = prioritizeValveInCatalog(alertId, []);
      setDemandAlerts(getHighDemandAlerts());
      setDemandAlertToast(
        lang === 'vi' 
          ? `✓ Đã xác nhận ưu tiên model ${updatedAlert?.valveCode} trong hệ thống danh mục!` 
          : `✓ Model ${updatedAlert?.valveCode} prioritized in catalog!`
      );
    }
    setTimeout(() => setDemandAlertToast(null), 4000);
  };

  const handleDismissAlert = (alertId: string) => {
    dismissDemandAlert(alertId);
    setDemandAlerts(getHighDemandAlerts());
  };

  const handleResetAlerts = () => {
    const res = resetDemandAlerts();
    setDemandAlerts(res);
  };

  // Interactive Drag & Drop Timeline & Batch CSV state
  const [timelineProjects, setTimelineProjects] = useState<ProjectRecord[]>(projects || []);
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [dragOverProjectIndex, setDragOverProjectIndex] = useState<number | null>(null);
  const [batchCsvMessage, setBatchCsvMessage] = useState<string | null>(null);
  const batchCsvFileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (projects) {
      setTimelineProjects(projects);
    }
  }, [projects]);
  

  // SEO metadata state
  const [metaTitle, setMetaTitle] = useState(initial.seoMetadata?.metaTitle || '');
  const [metaTitleEn, setMetaTitleEn] = useState(initial.seoMetadata?.metaTitleEn || '');
  const [metaDescription, setMetaDescription] = useState(initial.seoMetadata?.metaDescription || '');
  const [metaDescriptionEn, setMetaDescriptionEn] = useState(initial.seoMetadata?.metaDescriptionEn || '');
  const [targetKeywords, setTargetKeywords] = useState<string[]>(initial.seoMetadata?.targetKeywords || []);
  const [targetKeywordsEn, setTargetKeywordsEn] = useState<string[]>(initial.seoMetadata?.targetKeywordsEn || []);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordInputEn, setKeywordInputEn] = useState('');
  const [serpPreviewMode, setSerpPreviewMode] = useState<'vi' | 'en'>('vi');
  const [seoOptimizedNotice, setSeoOptimizedNotice] = useState<string | null>(null);
  const [isAutoTranslateSeo, setIsAutoTranslateSeo] = useState<boolean>(true);

  // Auto description translation & UTD Figure presets state
  const [isAutoTranslateDesc, setIsAutoTranslateDesc] = useState<boolean>(true);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState<boolean>(false);
  const [figPresetNotice, setFigPresetNotice] = useState<string | null>(null);
  const [selectedFigCode, setSelectedFigCode] = useState<string>('');

  const [description, setDescription] = useState(initial.description);
  const [sizeRange, setSizeRange] = useState(initial.sizeRange);
  const [tempRange, setTempRange] = useState(initial.tempRange);
  const [connection, setConnection] = useState(initial.connection);
  const [leakageClass, setLeakageClass] = useState(initial.leakageClass || 'ISO 5208 Rate A (Bubble-Tight)');
  const [testPressureShell, setTestPressureShell] = useState(initial.testPressureShell || '1.5 x PN');
  const [testPressureSeat, setTestPressureSeat] = useState(initial.testPressureSeat || '1.1 x PN');
  const [standardsText, setStandardsText] = useState((initial.standards || []).join(', '));
  const [specs, setSpecs] = useState<ValveDimensionSpec[]>(initial.specs || []);
  const [specsFileMessage, setSpecsFileMessage] = useState<string | null>(null);
  const specsFileInputRef = useRef<HTMLInputElement>(null);

  // AI Characteristics state
  const initialChar = initial.characteristics || synthesizeValveCharacteristics(initial);
  const [lifecycle, setLifecycle] = useState(initialChar.lifecycle || '');
  const [lifecycleEn, setLifecycleEn] = useState(initialChar.lifecycleEn || '');
  const [tempLimits, setTempLimits] = useState(initialChar.tempLimits || '');
  const [tempLimitsEn, setTempLimitsEn] = useState(initialChar.tempLimitsEn || '');
  const [sealIntegrity, setSealIntegrity] = useState(initialChar.sealIntegrity || '');
  const [sealIntegrityEn, setSealIntegrityEn] = useState(initialChar.sealIntegrityEn || '');
  const [mediaApplications, setMediaApplications] = useState(initialChar.mediaApplications || '');
  const [mediaApplicationsEn, setMediaApplicationsEn] = useState(initialChar.mediaApplicationsEn || '');
  const [aiSummaryNotes, setAiSummaryNotes] = useState(initialChar.aiSummaryNotes || '');
  const [aiSummaryNotesEn, setAiSummaryNotesEn] = useState(initialChar.aiSummaryNotesEn || '');
  const [customAttributes, setCustomAttributes] = useState<CustomCharacteristic[]>(initialChar.customAttributes || []);

  // AI-driven Smart Categorization tool state
  const [smartCatResult, setSmartCatResult] = useState<SmartCategorizationResult | null>(null);
  const [isScanningCat, setIsScanningCat] = useState<boolean>(false);
  const [smartCatAppliedNotice, setSmartCatAppliedNotice] = useState<string | null>(null);
  const [isSmartCatExpanded, setIsSmartCatExpanded] = useState<boolean>(false);

  // Môi chất khuyến nghị sử dụng (Media) state & Admin Approval Lock
  const [applicableMedia, setApplicableMedia] = useState<string[]>(initial.applicableMedia || ['Nước', 'Dầu', 'Khí nén', 'Hóa chất']);
  const [applicableMediaEn, setApplicableMediaEn] = useState<string[]>(initial.applicableMediaEn || ['Water', 'Oil', 'Compressed Air']);
  const [isMediaLocked, setIsMediaLocked] = useState<boolean>(initial.isMediaLocked || false);
  const [mediaLockDate, setMediaLockDate] = useState<string>(initial.mediaApprovedDate || '');
  const [newMediaInput, setNewMediaInput] = useState<string>('');

  // Đặc tính thiết kế cơ khí (Mechanical Highlights) state & Admin Approval Lock
  const [highlightFeatures, setHighlightFeatures] = useState<string[]>(initial.highlightFeatures || []);
  const [highlightFeaturesEn, setHighlightFeaturesEn] = useState<string[]>(initial.highlightFeaturesEn || []);
  const [isMechanicalLocked, setIsMechanicalLocked] = useState<boolean>(initial.isMechanicalFeaturesLocked || false);
  const [mechanicalLockDate, setMechanicalLockDate] = useState<string>(initial.mechanicalFeaturesApprovedDate || '');
  const [newFeatureInput, setNewFeatureInput] = useState<string>('');
  const [newFeatureEnInput, setNewFeatureEnInput] = useState<string>('');
  const [isAiSuggestingMechanical, setIsAiSuggestingMechanical] = useState<boolean>(false);
  const [mechanicalNotice, setMechanicalNotice] = useState<string | null>(null);

  // AI Translation & Multi-language Locking state
  const [isTranslationsLocked, setIsTranslationsLocked] = useState<boolean>(initial.isTranslationsLocked || false);
  const [translationsLockDate, setTranslationsLockDate] = useState<string>(initial.translationsApprovedDate || '');
  const [translationLockNotice, setTranslationLockNotice] = useState<string | null>(null);
  const [transPreviewTab, setTransPreviewTab] = useState<'en' | 'zh' | 'th'>('en');
  const [nameZh, setNameZh] = useState<string>(initial.nameZh || '');
  const [descriptionZh, setDescriptionZh] = useState<string>(initial.descriptionZh || '');
  const [nameTh, setNameTh] = useState<string>(initial.nameTh || '');
  const [descriptionTh, setDescriptionTh] = useState<string>(initial.descriptionTh || '');
  const [hasVietnameseChangedSinceLock, setHasVietnameseChangedSinceLock] = useState<boolean>(false);

  // Synchronize state when switching products or reopening
  React.useEffect(() => {
    setSmartCatResult(null);
    setSmartCatAppliedNotice(null);
    setIsSmartCatExpanded(false);
    if (productToEdit) {
      setName(productToEdit.name);
      setBadge(productToEdit.badge || 'Sản phẩm mới (New Model)');
      setNameEn(productToEdit.nameEn || '');
      setCode(productToEdit.code);
      setBrand(productToEdit.brand || 'UTD');
      setPrice(productToEdit.referencePriceVnd);
      setPressure(productToEdit.pressure);
      setMaterial(productToEdit.material);
      setCategory(productToEdit.category);
      setSystemGroup(productToEdit.systemGroup);
      setImageSrc(productToEdit.image);
      const prodImages = productToEdit.images && productToEdit.images.length > 0 
        ? productToEdit.images 
        : [productToEdit.image || '/uploads/studio_ball_valve.jpg'];
      setImagesList(prodImages);
      setActiveImageSlot(0);
      setMetaTitle(productToEdit.seoMetadata?.metaTitle || '');
      setMetaTitleEn(productToEdit.seoMetadata?.metaTitleEn || '');
      setMetaDescription(productToEdit.seoMetadata?.metaDescription || '');
      setMetaDescriptionEn(productToEdit.seoMetadata?.metaDescriptionEn || '');
      setTargetKeywords(productToEdit.seoMetadata?.targetKeywords || []);
      setTargetKeywordsEn(productToEdit.seoMetadata?.targetKeywordsEn || []);
      setDescription(productToEdit.description);
      setDescriptionEn(productToEdit.descriptionEn || '');
      setSizeRange(productToEdit.sizeRange);
      setTempRange(productToEdit.tempRange);
      setConnection(productToEdit.connection);
      setLeakageClass(productToEdit.leakageClass || 'ISO 5208 Rate A (Bubble-Tight)');
      setTestPressureShell(productToEdit.testPressureShell || '1.5 x PN');
      setTestPressureSeat(productToEdit.testPressureSeat || '1.1 x PN');
      setStandardsText((productToEdit.standards || []).join(', '));
      setSpecs(productToEdit.specs || []);

      const c = productToEdit.characteristics || synthesizeValveCharacteristics(productToEdit);
      setLifecycle(c.lifecycle || '');
      setLifecycleEn(c.lifecycleEn || '');
      setTempLimits(c.tempLimits || '');
      setTempLimitsEn(c.tempLimitsEn || '');
      setSealIntegrity(c.sealIntegrity || '');
      setSealIntegrityEn(c.sealIntegrityEn || '');
      setMediaApplications(c.mediaApplications || '');
      setMediaApplicationsEn(c.mediaApplicationsEn || '');
      setAiSummaryNotes(c.aiSummaryNotes || '');
      setAiSummaryNotesEn(c.aiSummaryNotesEn || '');
      setCustomAttributes(c.customAttributes || []);

      // Sync Media & Locks
      setApplicableMedia(productToEdit.applicableMedia || ['Nước', 'Dầu', 'Khí nén', 'Hóa chất']);
      setApplicableMediaEn(productToEdit.applicableMediaEn || ['Water', 'Oil', 'Compressed Air']);
      setIsMediaLocked(productToEdit.isMediaLocked || false);
      setMediaLockDate(productToEdit.mediaApprovedDate || '');

      // Sync Mechanical Features & Locks
      setHighlightFeatures(productToEdit.highlightFeatures || []);
      setHighlightFeaturesEn(productToEdit.highlightFeaturesEn || []);
      setIsMechanicalLocked(productToEdit.isMechanicalFeaturesLocked || false);
      setMechanicalLockDate(productToEdit.mechanicalFeaturesApprovedDate || '');

      // Sync Translation Lock & Multilingual Fields
      setIsTranslationsLocked(productToEdit.isTranslationsLocked || false);
      setTranslationsLockDate(productToEdit.translationsApprovedDate || '');
      setNameZh(productToEdit.nameZh || translateTechString(productToEdit.name, productToEdit.nameEn, 'zh'));
      setDescriptionZh(productToEdit.descriptionZh || translateTechString(productToEdit.description, productToEdit.descriptionEn, 'zh'));
      setNameTh(productToEdit.nameTh || translateTechString(productToEdit.name, productToEdit.nameEn, 'th'));
      setDescriptionTh(productToEdit.descriptionTh || translateTechString(productToEdit.description, productToEdit.descriptionEn, 'th'));
      setHasVietnameseChangedSinceLock(false);
    } else {
      setName(defaultEmptyProduct.name);
      setBadge(defaultEmptyProduct.badge || 'Sản phẩm mới (New Model)');
      setNameEn(defaultEmptyProduct.nameEn || '');
      setNameZh('');
      setDescriptionZh('');
      setNameTh('');
      setDescriptionTh('');
      setHasVietnameseChangedSinceLock(false);
      setCode(defaultEmptyProduct.code);
      setBrand(defaultEmptyProduct.brand || 'UTD');
      setPrice(defaultEmptyProduct.referencePriceVnd);
      setPressure(defaultEmptyProduct.pressure);
      setMaterial(defaultEmptyProduct.material);
      setCategory(defaultEmptyProduct.category);
      setSystemGroup(defaultEmptyProduct.systemGroup);
      setImageSrc(defaultEmptyProduct.image);
      setImagesList([defaultEmptyProduct.image]);
      setActiveImageSlot(0);
      setMetaTitle('');
      setMetaTitleEn('');
      setMetaDescription('');
      setMetaDescriptionEn('');
      setTargetKeywords([]);
      setTargetKeywordsEn([]);
      setDescription(defaultEmptyProduct.description);
      setDescriptionEn(defaultEmptyProduct.descriptionEn || '');
      setSizeRange(defaultEmptyProduct.sizeRange);
      setTempRange(defaultEmptyProduct.tempRange);
      setConnection(defaultEmptyProduct.connection);
      setLeakageClass(defaultEmptyProduct.leakageClass || 'ISO 5208 Rate A (Bubble-Tight)');
      setTestPressureShell(defaultEmptyProduct.testPressureShell || '1.5 x PN');
      setTestPressureSeat(defaultEmptyProduct.testPressureSeat || '1.1 x PN');
      setStandardsText((defaultEmptyProduct.standards || []).join(', '));
      setSpecs(defaultEmptyProduct.specs || []);

      const c = synthesizeValveCharacteristics(defaultEmptyProduct);
      setLifecycle(c.lifecycle || '');
      setLifecycleEn(c.lifecycleEn || '');
      setTempLimits(c.tempLimits || '');
      setTempLimitsEn(c.tempLimitsEn || '');
      setSealIntegrity(c.sealIntegrity || '');
      setSealIntegrityEn(c.sealIntegrityEn || '');
      setMediaApplications(c.mediaApplications || '');
      setMediaApplicationsEn(c.mediaApplicationsEn || '');
      setAiSummaryNotes(c.aiSummaryNotes || '');
      setAiSummaryNotesEn(c.aiSummaryNotesEn || '');
      setCustomAttributes(c.customAttributes || []);

      setApplicableMedia(['Nước', 'Dầu', 'Khí nén', 'Hóa chất']);
      setApplicableMediaEn(['Water', 'Oil', 'Compressed Air']);
      setIsMediaLocked(false);
      setMediaLockDate('');
      setHighlightFeatures(defaultEmptyProduct.highlightFeatures || []);
      setHighlightFeaturesEn(defaultEmptyProduct.highlightFeaturesEn || []);
      setIsMechanicalLocked(false);
      setMechanicalLockDate('');
      setIsTranslationsLocked(false);
      setTranslationsLockDate('');
    }
  }, [productToEdit, isOpen]);

  const handleAiAutoSynthesizeCharacteristics = () => {
    setIsGeneratingContent(true);
    setTimeout(() => {
      setIsGeneratingContent(false);
      const synth = synthesizeValveCharacteristics({
        name,
        code,
        category,
        material,
        pressure,
        systemGroup,
        tempRange,
        leakageClass,
        brand
      });
      setLifecycle(synth.lifecycle);
      setLifecycleEn(synth.lifecycleEn || '');
      setTempLimits(synth.tempLimits);
      setTempLimitsEn(synth.tempLimitsEn || '');
      setSealIntegrity(synth.sealIntegrity);
      setSealIntegrityEn(synth.sealIntegrityEn || '');
      setMediaApplications(synth.mediaApplications);
      setMediaApplicationsEn(synth.mediaApplicationsEn || '');
      setAiSummaryNotes(synth.aiSummaryNotes || '');
      setAiSummaryNotesEn(synth.aiSummaryNotesEn || '');
      setCustomAttributes(synth.customAttributes || []);
    }, 500);
  };

  const handleAddCustomAttribute = () => {
    setCustomAttributes([
      ...customAttributes,
      {
        id: `attr-${Date.now()}`,
        key: lang === 'vi' ? 'Đặc tính bổ sung' : 'New Characteristic',
        keyEn: 'New Characteristic',
        value: lang === 'vi' ? 'Giá trị tiêu chuẩn' : 'Standard Value',
        valueEn: 'Standard Value',
      }
    ]);
  };

  const handleDeleteCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, idx) => idx !== index));
  };

  const handleUpdateCustomAttribute = (index: number, field: keyof CustomCharacteristic, val: string) => {
    const updated = [...customAttributes];
    updated[index] = { ...updated[index], [field]: val };
    setCustomAttributes(updated);
  };

  const handleUploadSpecsFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text) return;
        try {
          // If JSON
          if (file.name.endsWith('.json') || text.trim().startsWith('[')) {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const formatted: ValveDimensionSpec[] = parsed.map(item => {
                const kv = Number(item.kvFlow || item.kvs || item.kv || item.Kvs || 100);
                const cv = item.cvFlow || item.cv || item.Cv ? Number(item.cvFlow || item.cv || item.Cv) : Math.round(kv * 1.156);
                return {
                  dn: item.dn || item.DN || item.size || 'DN50',
                  pn: item.pn || item.PN || pressure || 'PN16',
                  faceToFace: Number(item.faceToFace || item.L || item.f2f || 150),
                  height: Number(item.height || item.H || 200),
                  weightKg: Number(item.weightKg || item.weight || item.kg || 10),
                  kvFlow: kv,
                  cvFlow: cv,
                  flangeHoles: Number(item.flangeHoles || item.holes || 4),
                };
              });
              setSpecs(formatted);
              setSpecsFileMessage(`✓ Đã nạp thành công ${formatted.length} kích thước từ file JSON: ${file.name}`);
              setTimeout(() => setSpecsFileMessage(null), 3500);
              return;
            }
          }

          // CSV parsing
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          if (lines.length > 0) {
            const firstLine = lines[0].toLowerCase();
            const startIndex = (firstLine.includes('dn') || firstLine.includes('size') || firstLine.includes('kích') || firstLine.includes('l')) ? 1 : 0;
            const parsedRows: ValveDimensionSpec[] = [];

            for (let i = startIndex; i < lines.length; i++) {
              const cols = lines[i].split(/[,;\t]/).map(c => c.trim().replace(/^["']|["']$/g, ''));
              if (cols.length >= 3) {
                const dn = cols[0] || `DN${(i + 1) * 25}`;
                const pn = cols[1] || 'PN16';
                const faceToFace = Number(cols[2]) || 150;
                const height = Number(cols[3]) || 200;
                const weightKg = Number(cols[4]) || 10;
                const kvFlow = Number(cols[5]) || 100;
                const cvFlow = cols[6] && !isNaN(Number(cols[6])) ? Number(cols[6]) : Math.round(kvFlow * 1.156);
                const flangeHoles = Number(cols[7]) || (parseInt(dn.replace(/\D/g, '')) >= 150 ? 8 : 4);

                parsedRows.push({
                  dn,
                  pn,
                  faceToFace,
                  height,
                  weightKg,
                  kvFlow,
                  cvFlow,
                  flangeHoles,
                });
              }
            }

            if (parsedRows.length > 0) {
              setSpecs(parsedRows);
              setSpecsFileMessage(`✓ Đã nạp thành công ${parsedRows.length} kích thước từ file: ${file.name}`);
              setTimeout(() => setSpecsFileMessage(null), 3500);
            }
          }
        } catch {
          alert('Lỗi định dạng file: Vui lòng kiểm tra lại cấu trúc file CSV / JSON!');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadCsvTemplate = () => {
    const headers = 'DN,PN,FaceToFace_L_mm,Height_H_mm,Weight_Kg,Kvs_Flow,Cv_Flow,Flange_Holes\n';
    const sampleRows = specs.length > 0 
      ? specs.map(s => `${s.dn},${s.pn},${s.faceToFace},${s.height},${s.weightKg},${s.kvFlow},${s.cvFlow || Math.round(s.kvFlow * 1.156)},${s.flangeHoles}`).join('\n')
      : 'DN50 (2"),PN16,150,130,8.5,380,440,4\nDN80 (3"),PN16,180,165,16.0,1050,1214,8\nDN100 (4"),PN16,190,188,24.0,1800,2080,8';
    
    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_specs_${code || 'valve'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddSpecRow = () => {
    const nextDnIndex = specs.length + 1;
    const newRow: ValveDimensionSpec = {
      dn: `DN${nextDnIndex * 25} (${nextDnIndex}")`,
      pn: pressure.includes('PN') ? pressure : 'PN16',
      faceToFace: 150 + nextDnIndex * 20,
      height: 200 + nextDnIndex * 30,
      weightKg: Math.round((5 + nextDnIndex * 6) * 10) / 10,
      kvFlow: nextDnIndex * 250,
      flangeHoles: nextDnIndex > 4 ? 8 : 4
    };
    setSpecs([...specs, newRow]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecs(specs.filter((_, idx) => idx !== index));
  };

  const handleUpdateSpecField = (index: number, field: keyof ValveDimensionSpec, value: string | number) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: value };
    setSpecs(updated);
  };

  // Catalogue Auto-Fill Preset (Yêu cầu 7)
  const handleApplyCataloguePreset = (type: 'water' | 'steam' | 'fire' | 'hp_butterfly') => {
    if (type === 'water') {
      setMaterial('Thân Gang Cầu EN-GJS-450-10, Đĩa Inox 304, Đệm EPDM');
      setPressure('PN16 (16 Bar / 1.6 MPa)');
      setTempRange('-10°C đến +110°C');
      setConnection('Mặt bích tiêu chuẩn BS EN 1092-2 / DIN PN16');
      setSizeRange('DN50 - DN300 (2" - 12")');
      setSystemGroup('water');
    } else if (type === 'steam') {
      setMaterial('Thân Thép đúc GS-C25 / WCB 1.0619, Ống xếp Bellows Inox 316Ti');
      setPressure('PN25 / PN40 (EN 1092-1)');
      setTempRange('-29°C đến +350°C');
      setConnection('Mặt bích tiêu chuẩn DIN 3202-F1 / EN 1092-1');
      setSizeRange('DN15 - DN200 (1/2" - 8")');
      setSystemGroup('steam');
    } else if (type === 'fire') {
      setMaterial('Thân Gang Cầu Ductile Iron, Nêm bọc EPDM, Sơn Epoxy Đỏ PCCC');
      setPressure('300 PSI (20.7 Bar) - Test 600 PSI');
      setTempRange('Tối đa 80°C');
      setConnection('Rãnh ngàm Grooved AWWA C606 & Bích Class 150');
      setSizeRange('DN50 - DN300 (2" - 12")');
      setSystemGroup('firefighting');
    } else if (type === 'hp_butterfly') {
      setMaterial('Thân WCB/CF8M, Đĩa CF8M, Ghế van Stellite Metal-to-Metal');
      setPressure('Class 150 / 300 (PN25 - PN40)');
      setTempRange('-196°C đến +450°C');
      setConnection('Wafer / Lugged ASME B16.5');
      setSizeRange('DN50 - DN600 (2" - 24")');
      setSystemGroup('gas_cryogenic');
    }
  };

  // Auto-fit & AI Enhancement Controls
  const [aspectMode, setAspectMode] = useState<'contain' | 'cover' | 'padded'>('padded');
  const [bgColor, setBgColor] = useState<'slate' | 'white' | 'gradient'>('gradient');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [aiFilterApplied, setAiFilterApplied] = useState<string | null>(null);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const remainingSlots = 3 - imagesList.length;
      if (remainingSlots <= 0) {
        alert(lang === 'vi' ? 'Đã đạt tối đa 3 hình ảnh cho sản phẩm này! Vui lòng xóa bớt ảnh cũ trước khi thêm.' : 'Maximum 3 images reached! Please remove an image before adding more.');
        return;
      }
      const filesToProcess = selectedFiles.slice(0, remainingSlots);
      setIsProcessingAi(true);
      try {
        const optimizedArray: string[] = [];
        const newVariants: ValveImageVariants[] = [...imageVariantsMap];
        let lastWebpStats: WebPOptimizeResult | null = null;

        for (const file of filesToProcess) {
          try {
            // 1. Core Requirement: Automatically convert to WebP format & downscale dimensions
            const webpResult = await convertToWebPAndOptimize(file, {
              maxWidth: webpMaxDim,
              maxHeight: Math.round((webpMaxDim * 3) / 4),
              quality: webpQuality
            });
            lastWebpStats = webpResult;

            // 2. Generate multi-resolution pipeline variants in WebP
            const pipelineResult = await processMultiResolutionImagePipeline(webpResult.dataUrl);
            optimizedArray.push(webpResult.dataUrl);
            newVariants.push(pipelineResult.variants);

            // 3. Log Audit Log for WebP Image Optimization
            portalStorage.addAuditLog(
              'Admin (AdminStudio)',
              'IMAGE_OPTIMIZE_WEBP',
              `Tự động chuyển đổi ảnh sang WebP cho van [${code || 'UTD'}]: Giảm từ ${webpResult.originalKb}KB còn ${webpResult.optimizedKb}KB (tiết kiệm ${webpResult.savedPercent}% dung lượng hosting, phân giải ${webpResult.optimizedDimensions.width}x${webpResult.optimizedDimensions.height}px)`,
              'SUCCESS',
              'PRODUCT',
              code || 'UTD',
              'INFO',
              {
                valveCode: code,
                originalFormat: webpResult.originalFormat,
                originalKb: webpResult.originalKb,
                optimizedKb: webpResult.optimizedKb,
                savedPercent: webpResult.savedPercent,
                dimensions: `${webpResult.optimizedDimensions.width}x${webpResult.optimizedDimensions.height}`
              }
            );
          } catch {
            const fallback = await new Promise<string>((resolve) => {
              const r = new FileReader();
              r.onload = () => resolve(r.result as string);
              r.readAsDataURL(file);
            });
            optimizedArray.push(fallback);
            newVariants.push({ thumbnail: fallback, medium: fallback, high: fallback });
          }
        }

        const updatedImages = [...imagesList, ...optimizedArray].slice(0, 3);
        const updatedVariants = newVariants.slice(0, 3);
        setImagesList(updatedImages);
        setImageVariantsMap(updatedVariants);
        setImageSrc(updatedImages[0]);
        setActiveImageSlot(0);
        setAspectMode('padded');
        setAiFilterApplied('auto-fitted-3slots');
        if (lastWebpStats) {
          setWebpStats(lastWebpStats);
        }
        setOptPipelineStatus(
          lang === 'vi'
            ? `✓ Đã tự động chuyển đổi sang WebP & nén kích thước tối ưu hosting (${lastWebpStats?.optimizedKb || 80}KB, -${lastWebpStats?.savedPercent || 85}%)!`
            : `✓ Converted to WebP format & optimized for fast hosting delivery!`
        );
      } catch (err) {
        console.warn('Image upload error:', err);
      } finally {
        setIsProcessingAi(false);
      }
    }
  };

  /**
   * Batch converts all existing images of this product to WebP format
   */
  const handleBatchConvertExistingToWebP = async () => {
    setIsWebpBatchConverting(true);
    try {
      const convertedImages: string[] = [];
      const convertedVariants: ValveImageVariants[] = [];
      let lastResult: WebPOptimizeResult | null = null;

      for (const img of imagesList) {
        const res = await convertToWebPAndOptimize(img, {
          maxWidth: webpMaxDim,
          maxHeight: Math.round((webpMaxDim * 3) / 4),
          quality: webpQuality
        });
        lastResult = res;
        convertedImages.push(res.dataUrl);

        const pipeline = await processMultiResolutionImagePipeline(res.dataUrl);
        convertedVariants.push(pipeline.variants);
      }

      setImagesList(convertedImages);
      setImageVariantsMap(convertedVariants);
      setImageSrc(convertedImages[0]);
      if (lastResult) {
        setWebpStats(lastResult);
      }

      portalStorage.addAuditLog(
        'Admin (AdminStudio)',
        'BATCH_IMAGE_WEBP',
        `Chuyển đổi hàng loạt ${convertedImages.length} ảnh của van [${code}] sang định dạng WebP (Chất lượng: ${Math.round(webpQuality * 100)}%, Max: ${webpMaxDim}px)`,
        'SUCCESS',
        'PRODUCT',
        code || 'UTD',
        'INFO'
      );

      setOptPipelineStatus(
        lang === 'vi'
          ? `✓ Đã chuyển đổi toàn bộ ${convertedImages.length} ảnh sang định dạng WebP tối ưu tải trang!`
          : `✓ All ${convertedImages.length} images converted to high-speed WebP format!`
      );
    } catch (err) {
      console.warn('Batch WebP convert error:', err);
    } finally {
      setIsWebpBatchConverting(false);
    }
  };

  const handleRemoveImageSlot = (index: number) => {
    const updated = imagesList.filter((_, idx) => idx !== index);
    const updatedVariants = imageVariantsMap.filter((_, idx) => idx !== index);
    const finalImages = updated.length > 0 ? updated : ['/uploads/studio_ball_valve.jpg'];
    setImagesList(finalImages);
    setImageVariantsMap(updatedVariants);
    setImageSrc(finalImages[0]);
    setActiveImageSlot(0);
  };

  const handleSetPrimaryImageSlot = (index: number) => {
    const chosen = imagesList[index];
    const chosenVariant = imageVariantsMap[index];
    const reordered = [chosen, ...imagesList.filter((_, idx) => idx !== index)];
    const reorderedVariants = chosenVariant
      ? [chosenVariant, ...imageVariantsMap.filter((_, idx) => idx !== index)]
      : imageVariantsMap;
    setImagesList(reordered);
    setImageVariantsMap(reorderedVariants);
    setImageSrc(reordered[0]);
    setActiveImageSlot(0);
  };

  const handleDeleteImage = () => {
    setImagesList(['/uploads/studio_ball_valve.jpg']);
    setImageSrc('/uploads/studio_ball_valve.jpg');
    setActiveImageSlot(0);
    setAiFilterApplied('reset-default');
  };

  // Real-time SEO audit computation
  const currentSeoAudit = auditProductSeo({
    ...initial,
    name,
    nameEn,
    code,
    description,
    descriptionEn,
    material,
    materialEn: material,
    pressure,
    standards: standardsText.split(',').map(s => s.trim()).filter(Boolean),
    systemGroup,
    category,
    seoMetadata: {
      metaTitle,
      metaTitleEn,
      metaDescription,
      metaDescriptionEn,
      targetKeywords,
      targetKeywordsEn,
    }
  }, lang);

  const handleApplyAiSeoOptimization = () => {
    setMetaTitle(currentSeoAudit.recommendedTitleVi);
    setMetaTitleEn(currentSeoAudit.recommendedTitleEn);
    setMetaDescription(currentSeoAudit.recommendedDescriptionVi);
    setMetaDescriptionEn(currentSeoAudit.recommendedDescriptionEn);
    setTargetKeywords(currentSeoAudit.recommendedKeywords);
    setTargetKeywordsEn(currentSeoAudit.recommendedKeywordsEn);
    if (!description || description.length < 90) {
      setDescription(currentSeoAudit.recommendedDescriptionVi);
      setDescriptionEn(currentSeoAudit.recommendedDescriptionEn);
    }
    setSeoOptimizedNotice(
      lang === 'vi' 
        ? '✓ Đã tự động tối ưu hóa siêu dữ liệu SEO và từ khóa kỹ thuật chuẩn Google (Tiếng Việt & Tiếng Anh)!' 
        : '✓ Auto-optimized bilingual SEO metadata and keywords for Google SERP!'
    );
    setTimeout(() => setSeoOptimizedNotice(null), 3500);
  };

  const handleAddTargetKeyword = () => {
    if (keywordInput.trim() && !targetKeywords.includes(keywordInput.trim())) {
      setTargetKeywords([...targetKeywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveTargetKeyword = (kw: string) => {
    setTargetKeywords(targetKeywords.filter(k => k !== kw));
  };

  const handleAddTargetKeywordEn = () => {
    if (keywordInputEn.trim() && !targetKeywordsEn.includes(keywordInputEn.trim())) {
      setTargetKeywordsEn([...targetKeywordsEn, keywordInputEn.trim()]);
      setKeywordInputEn('');
    }
  };

  const handleRemoveTargetKeywordEn = (kw: string) => {
    setTargetKeywordsEn(targetKeywordsEn.filter(k => k !== kw));
  };

  // 1-Click English Auto-Translate & Optimization for SEO Title, Description & Keywords
  const handleTranslateSeoToEnglish = () => {
    const { titleEn, descEn } = translateMetaTitleAndDescription(
      metaTitle || currentSeoAudit.recommendedTitleVi,
      metaDescription || description || currentSeoAudit.recommendedDescriptionVi,
      { nameEn, code, material, pressure }
    );
    setMetaTitleEn(titleEn);
    setMetaDescriptionEn(descEn);

    // Auto-translate existing keywords to English technical keywords
    const translatedKws = translateKeywordsSmart(targetKeywords.length > 0 ? targetKeywords : currentSeoAudit.recommendedKeywords);
    const combinedKws = Array.from(new Set([...targetKeywordsEn, ...translatedKws, ...currentSeoAudit.recommendedKeywordsEn]));
    setTargetKeywordsEn(combinedKws);

    setSeoOptimizedNotice(
      lang === 'vi'
        ? '✓ Đã tự động dịch và tối ưu hóa tiêu đề, mô tả và từ khóa SEO sang tiếng Anh chuẩn quốc tế!'
        : '✓ Auto-translated and optimized Meta Title, Description & Keywords to English!'
    );
    setTimeout(() => setSeoOptimizedNotice(null), 3500);
  };

  // Real-time debounced auto-translation from Vietnamese Meta Title and Description to English
  const handleMetaTitleChange = (val: string) => {
    setMetaTitle(val);
    if (isAutoTranslateSeo && val.trim().length > 3) {
      const { titleEn } = translateMetaTitleAndDescription(
        val,
        metaDescription || description,
        { nameEn, code, material, pressure }
      );
      setMetaTitleEn(titleEn);
    }
  };

  const handleMetaDescriptionChange = (val: string) => {
    setMetaDescription(val);
    if (isAutoTranslateSeo && val.trim().length > 10) {
      const { descEn } = translateMetaTitleAndDescription(
        metaTitle,
        val,
        { nameEn, code, material, pressure }
      );
      setMetaDescriptionEn(descEn);
    }
  };

  // Real-time debounced auto-translation from Vietnamese description to English, Chinese, Thai
  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (isTranslationsLocked) {
      setHasVietnameseChangedSinceLock(true);
    }
    if (isAutoTranslateDesc && val.trim().length > 5) {
      setIsTranslatingDesc(true);
      const en = translateDescriptionSmart(val, {
        name: nameEn || name,
        code,
        material,
        pressure
      });
      setDescriptionEn(en);
      const zh = translateTechString(val, en, 'zh');
      setDescriptionZh(zh);
      const th = translateTechString(val, en, 'th');
      setDescriptionTh(th);
      setIsTranslatingDesc(false);
    }
  };

  const handleManualTranslateDescription = (targetLanguage: 'en' | 'zh' | 'th' = 'en') => {
    setIsTranslatingDesc(true);
    setTimeout(() => {
      if (targetLanguage === 'en') {
        const en = translateDescriptionSmart(description, {
          name: nameEn || name,
          code,
          material,
          pressure
        });
        setDescriptionEn(en);
      } else if (targetLanguage === 'zh') {
        const transZh = translateTechString(description, descriptionEn, 'zh');
        setDescriptionZh(transZh);
      } else if (targetLanguage === 'th') {
        const transTh = translateTechString(description, descriptionEn, 'th');
        setDescriptionTh(transTh);
      }
      setIsTranslatingDesc(false);
    }, 200);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (isTranslationsLocked) {
      setHasVietnameseChangedSinceLock(true);
    }
    if (val.trim().length > 2) {
      const en = translateTechString(val, undefined, 'en');
      setNameEn(en);
      setNameZh(translateTechString(val, en, 'zh'));
      setNameTh(translateTechString(val, en, 'th'));
    }
  };

  // UTD Catalogue Presets by Figure Model
  const handleApplyFigPreset = (preset: UtdCatalogueFigPreset) => {
    setMaterial(preset.material);
    setPressure(preset.pressure);
    setTempRange(preset.tempRange);
    setConnection(preset.connection);
    setSizeRange(preset.sizeRange);
    setLeakageClass(preset.leakageClass);
    setTestPressureShell(preset.testPressureShell);
    setTestPressureSeat(preset.testPressureSeat);
    setStandardsText(preset.standards.join(', '));
    setDescription(preset.descriptionVi);
    setDescriptionEn(preset.descriptionEn);
    setCategory(preset.category);
    setSystemGroup(preset.systemGroup);
    if (preset.badge) setBadge(preset.badge);
    setSelectedFigCode(preset.figCode);

    // Only update media if NOT locked by admin
    if (!isMediaLocked) {
      const mech = suggestMechanicalDesignFeatures({
        name: preset.nameVi,
        code: preset.figCode,
        category: preset.category,
        material: preset.material,
        pressure: preset.pressure
      });
      setApplicableMedia(mech.recommendedMediaVi);
      setApplicableMediaEn(mech.recommendedMediaEn);
    }

    // Only update mechanical design features if NOT locked by admin
    if (!isMechanicalLocked) {
      const mech = suggestMechanicalDesignFeatures({
        name: preset.nameVi,
        code: preset.figCode,
        category: preset.category,
        material: preset.material,
        pressure: preset.pressure
      });
      setHighlightFeatures(mech.highlightsVi);
      setHighlightFeaturesEn(mech.highlightsEn);
    }

    setFigPresetNotice(
      lang === 'vi'
        ? `✓ Đã tự động nạp toàn diện catalogue chuẩn UTD: ${preset.figCode}! ${isMediaLocked || isMechanicalLocked ? '(Bảo toàn các mục Admin đã khóa)' : ''}`
        : `✓ Successfully loaded UTD catalogue standard for ${preset.figCode}!`
    );
    setTimeout(() => setFigPresetNotice(null), 3500);
  };

  // Media Handlers (Requirement 2)
  const handleAddMedia = (mediaVi: string, mediaEn?: string) => {
    if (!mediaVi.trim()) return;
    if (!applicableMedia.includes(mediaVi.trim())) {
      setApplicableMedia([...applicableMedia, mediaVi.trim()]);
      const en = mediaEn || translateTechString(mediaVi.trim(), undefined, 'en');
      setApplicableMediaEn([...applicableMediaEn, en]);
    }
    setNewMediaInput('');
  };

  const handleRemoveMedia = (index: number) => {
    setApplicableMedia(applicableMedia.filter((_, i) => i !== index));
    setApplicableMediaEn(applicableMediaEn.filter((_, i) => i !== index));
  };

  const handleToggleLockMedia = () => {
    const next = !isMediaLocked;
    setIsMediaLocked(next);
    if (next) {
      setMediaLockDate(new Date().toLocaleDateString('vi-VN'));
    }
  };

  // Mechanical Highlights Handlers (Requirement 3)
  const handleAiSuggestMechanical = () => {
    setIsAiSuggestingMechanical(true);
    setTimeout(() => {
      const suggested = suggestMechanicalDesignFeatures({
        name,
        nameEn,
        code,
        category,
        material,
        pressure,
        connection
      });
      setHighlightFeatures(suggested.highlightsVi);
      setHighlightFeaturesEn(suggested.highlightsEn);
      if (!isMediaLocked) {
        setApplicableMedia(suggested.recommendedMediaVi);
        setApplicableMediaEn(suggested.recommendedMediaEn);
      }
      setIsAiSuggestingMechanical(false);
      setMechanicalNotice(
        lang === 'vi'
          ? `✓ AI đã tự động thu thập & đối chiếu cơ tính theo chức năng: ${suggested.functionalTitleVi}!`
          : `✓ AI collected & compared mechanical features for: ${suggested.functionalTitleEn}!`
      );
      setTimeout(() => setMechanicalNotice(null), 3500);
    }, 400);
  };

  const handleAddHighlightFeature = (featVi: string, featEn?: string) => {
    if (!featVi.trim()) return;
    setHighlightFeatures([...highlightFeatures, featVi.trim()]);
    setHighlightFeaturesEn([...highlightFeaturesEn, featEn?.trim() || translateTechString(featVi.trim(), undefined, 'en')]);
    setNewFeatureInput('');
    setNewFeatureEnInput('');
  };

  const handleRemoveHighlightFeature = (idx: number) => {
    setHighlightFeatures(highlightFeatures.filter((_, i) => i !== idx));
    setHighlightFeaturesEn(highlightFeaturesEn.filter((_, i) => i !== idx));
  };

  const handleToggleLockMechanical = () => {
    const next = !isMechanicalLocked;
    setIsMechanicalLocked(next);
    if (next) {
      setMechanicalLockDate(new Date().toLocaleDateString('vi-VN'));
    }
  };

  // AI Translation & Multi-language Locking Handlers (Requirement 6)
  const handleApproveAndLockTranslations = () => {
    setIsTranslationsLocked(true);
    setHasVietnameseChangedSinceLock(false);
    const dateStr = new Date().toLocaleDateString('vi-VN');
    setTranslationsLockDate(dateStr);
    setTranslationLockNotice(
      lang === 'vi'
        ? `✓ Đã phê duyệt và khóa toàn bộ bản dịch đa ngôn ngữ (${dateStr})! Khi khách hàng quốc tế chọn bất kỳ ngôn ngữ nào (EN, ZH, TH), hệ thống sẽ hiển thị bản dịch chuẩn xác đã được duyệt này.`
        : `✓ Approved and locked all translations (${dateStr})!`
    );
    setTimeout(() => setTranslationLockNotice(null), 4000);
  };

  const handleUnlockTranslations = () => {
    setIsTranslationsLocked(false);
  };

  const handleAiTranslateAllLanguages = () => {
    // 1. Valve Name
    const transNameEn = nameEn || translateTechString(name, undefined, 'en');
    setNameEn(transNameEn);
    const transNameZh = translateTechString(name, transNameEn, 'zh');
    setNameZh(transNameZh);
    const transNameTh = translateTechString(name, transNameEn, 'th');
    setNameTh(transNameTh);

    // 2. Description
    const transDescEn = descriptionEn || translateDescriptionSmart(description, { name: transNameEn, code, material, pressure });
    setDescriptionEn(transDescEn);
    const transDescZh = translateTechString(description, transDescEn, 'zh');
    setDescriptionZh(transDescZh);
    const transDescTh = translateTechString(description, transDescEn, 'th');
    setDescriptionTh(transDescTh);

    // 3. Media
    const updatedMediaEn = applicableMedia.map((m, idx) => applicableMediaEn[idx] || translateTechString(m, undefined, 'en'));
    setApplicableMediaEn(updatedMediaEn);

    // 4. Highlights
    const updatedFeatsEn = highlightFeatures.map((f, idx) => highlightFeaturesEn[idx] || translateTechString(f, undefined, 'en'));
    setHighlightFeaturesEn(updatedFeatsEn);

    // 5. SEO
    handleTranslateSeoToEnglish();

    setHasVietnameseChangedSinceLock(false);
    setTranslationLockNotice(
      lang === 'vi'
        ? '✓ AI đã tự động rà soát nội dung tiếng Việt và đề xuất đầy đủ bản dịch chuẩn xác cho Tiếng Anh (EN), Tiếng Trung (ZH - 中文) và Tiếng Thái (TH)!'
        : '✓ AI scanned Vietnamese content and synthesized translations for English, Chinese (ZH), and Thai (TH)!'
    );
    setTimeout(() => setTranslationLockNotice(null), 4000);
  };

  // AI Content Generator & SEO Optimizer
  const handleAiGenerateContent = () => {
    setIsGeneratingContent(true);
    setTimeout(() => {
      setIsGeneratingContent(false);
      const generatedDesc = `Dòng van ${name} (${code}) sản xuất theo tiêu chuẩn quốc tế ASME B16.34 và ISO 9001:2015. Thân van đúc từ ${material}, thiết kế chuyên dụng cho ${systemGroup === 'firefighting' ? 'hệ thống PCCC cứu hỏa' : (systemGroup === 'steam' ? 'hệ thống hơi nóng lò hơi nhiệt độ cao' : 'mạng lưới cấp thoát nước và công nghiệp hóa chất')}. Đạt độ kín tuyệt đối Zero-Leakage Class VI và kiểm tra áp lực thủy tĩnh 100% trước khi xuất xưởng.`;
      setDescription(generatedDesc);
    }, 700);
  };

  // AI-Driven Smart Categorization: scans pressure, media compatibility & metallurgy specs
  const handleRunSmartCategorization = () => {
    setIsScanningCat(true);
    setIsSmartCatExpanded(true);
    setTimeout(() => {
      const res = analyzeSmartCategorization(
        {
          name,
          nameEn,
          code,
          material,
          pressure,
          tempRange,
          connection,
          applicableMedia: initial.applicableMedia,
          mediaApplications,
          mediaApplicationsEn,
          description,
          standardsText,
          currentCategory: category,
          currentSystemGroup: systemGroup,
        },
        categories
      );
      setSmartCatResult(res);
      setIsScanningCat(false);
    }, 380);
  };

  const handleApplySmartCategorization = (targetCat?: ValveCategory, targetSys?: SystemGroup) => {
    const selectedCat = targetCat || smartCatResult?.suggestedCategory;
    const selectedSys = targetSys || smartCatResult?.suggestedSystemGroup;

    if (selectedCat) {
      setCategory(selectedCat);
      const matched = categories.find((c) => c.value === selectedCat);
      if (matched?.systemGroup && !targetSys) {
        setSystemGroup(matched.systemGroup);
      }
    }
    if (selectedSys) {
      setSystemGroup(selectedSys);
    }

    setSmartCatAppliedNotice(
      lang === 'vi'
        ? `✓ Đã áp dụng phân loại thông minh: ${smartCatResult?.suggestedCategoryLabel || selectedCat} (${smartCatResult?.suggestedSystemGroupLabel || selectedSys})`
        : `✓ Applied smart categorization: ${smartCatResult?.suggestedCategoryLabelEn || selectedCat} (${selectedSys})`
    );
    setTimeout(() => setSmartCatAppliedNotice(null), 3500);
  };

  const applyAiEnhance = async (mode: 'studio' | 'clean_bg' | 'metallic' | 'perspective') => {
    setIsProcessingAi(true);
    try {
      // Bake the enhancement directly into the image canvas so it is permanent and displays outside immediately!
      const currentImg = imagesList[activeImageSlot] || imageSrc;
      const baked = await bakeStudioEnhancement(currentImg, mode);
      const nextList = [...imagesList];
      nextList[activeImageSlot] = baked;
      setImagesList(nextList);
      setImageSrc(baked);
      setAiFilterApplied(
        mode === 'studio' ? 'Đã Cân Bằng Studio' :
        mode === 'clean_bg' ? 'Đã Tách Nền Trắng' :
        mode === 'metallic' ? 'Đã Tôn Ánh Kim' : 'Đã Căn Giữa 3D'
      );
      setBrightness(100);
      setContrast(100);
      setAspectMode('padded');
    } catch (err) {
      console.warn('AI enhancement fallback:', err);
    } finally {
      setIsProcessingAi(false);
    }
  };

  
  // Drag and drop handlers for timeline projects
  const handleProjectDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedProjectIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleProjectDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverProjectIndex !== idx) {
      setDragOverProjectIndex(idx);
    }
  };

  const handleProjectDragLeave = () => {
    setDragOverProjectIndex(null);
  };

  const handleProjectDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedProjectIndex === null || draggedProjectIndex === targetIdx) {
      setDraggedProjectIndex(null);
      setDragOverProjectIndex(null);
      return;
    }
    const updated = [...timelineProjects];
    const [moved] = updated.splice(draggedProjectIndex, 1);
    updated.splice(targetIdx, 0, moved);
    setTimelineProjects(updated);
    setDraggedProjectIndex(null);
    setDragOverProjectIndex(null);
    if (onReorderProjects) {
      onReorderProjects(updated);
    }
    setBatchCsvMessage(
      lang === 'vi'
        ? `✓ Đã di chuyển dự án "${moved.name}" tới vị trí #${targetIdx + 1} và lưu thứ tự thành công!`
        : (lang === 'zh' ? `✓ 已成功移动工程案例 "${moved.name}" 至第 #${targetIdx + 1} 位！` : `✓ Moved project to position #${targetIdx + 1} and saved order!`)
    );
    setTimeout(() => setBatchCsvMessage(null), 3000);
  };

  const handleMoveProjectStep = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= timelineProjects.length) return;
    const updated = [...timelineProjects];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTimelineProjects(updated);
    if (onReorderProjects) {
      onReorderProjects(updated);
    }
  };

  // CSV Export & Import handlers for projects
  const handleExportProjectsCsv = () => {
    const headers = 'id,name,nameEn,year,clientInvestor,location,industry,contractValueVnd,brandsUsed,summary\n';
    const rows = timelineProjects.map(p => {
      const cleanSummary = (p.summary || '').replace(/"/g, '""');
      const cleanBrands = (p.brandsUsed || []).join(';');
      return `"${p.id}","${p.name}","${p.nameEn || p.name}","${p.year}","${p.clientInvestor}","${p.location}","${p.industry}","${p.contractValueVnd}","${cleanBrands}","${cleanSummary}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `industracorp_projects_timeline_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadProjectsTemplateCsv = () => {
    const headers = 'id,name,nameEn,year,clientInvestor,location,industry,contractValueVnd,brandsUsed,summary\n';
    const sample = '"proj-sample-1","Dự Án Nhà Máy Lọc Hóa Dầu Tiêu Chuẩn","Standard Refinery Plant Project","2026","Tập đoàn Dầu khí","Bà Rịa - Vũng Tàu","oil_gas","25.8 Tỷ VNĐ","UTD;VYC-Spain","Cung cấp gói thầu van bi, van bướm và van cầu hơi nóng cao áp"';
    const blob = new Blob([headers + sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_projects_batch_metadata.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadProjectsBatchCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        if (file.name.endsWith('.json') || text.trim().startsWith('[')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTimelineProjects(parsed);
            if (onBatchUpdateProjects) onBatchUpdateProjects(parsed);
            setBatchCsvMessage(
              lang === 'vi'
                ? `✓ Đã nạp và cập nhật thành công ${parsed.length} dự án từ file JSON!`
                : (lang === 'zh' ? `✓ 成功批量更新 ${parsed.length} 个工程案例！` : `✓ Batch updated ${parsed.length} projects!`)
            );
            setTimeout(() => setBatchCsvMessage(null), 3500);
            return;
          }
        }

        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length <= 1) return;
        const startIndex = lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('id') ? 1 : 0;
        
        let updatedCount = 0;
        let newCount = 0;
        const currentMap = new Map(timelineProjects.map(p => [p.id, { ...p }]));
        const mergedList = [...timelineProjects];

        for (let i = startIndex; i < lines.length; i++) {
          const row = lines[i];
          const cols = [];
          let match;
          const reg = /(?:"([^"]*(?:""[^"]*)*)"|([^",]+)|(?<=,|^)(?=,|$))/g;
          while ((match = reg.exec(row)) !== null) {
            if (match.index === reg.lastIndex) reg.lastIndex++;
            const val = match[1] !== undefined ? match[1].replace(/""/g, '"') : (match[2] || '');
            cols.push(val.trim());
          }

          if (cols.length >= 4) {
            const rowId = cols[0] || `proj-csv-${Date.now()}-${i}`;
            const rowName = cols[1];
            const rowNameEn = cols[2] || rowName;
            const rowYear = Number(cols[3]) || new Date().getFullYear();
            const rowClient = cols[4] || 'Chủ đầu tư dự án';
            const rowLocation = cols[5] || 'Việt Nam';
            const rowIndustry = cols[6] || 'oil_gas';
            const rowValue = cols[7] || 'Theo Hợp Đồng';
            const rowBrands = cols[8] ? cols[8].split(';').map(b => b.trim()) : ['UTD'];
            const rowSummary = cols[9] || `Dự án cung cấp van công nghiệp tiêu chuẩn cho ${rowName}`;

            if (currentMap.has(rowId)) {
              const existing = currentMap.get(rowId)!;
              existing.name = rowName;
              existing.nameEn = rowNameEn;
              existing.year = rowYear;
              existing.clientInvestor = rowClient;
              existing.location = rowLocation;
              existing.industry = rowIndustry as any;
              existing.contractValueVnd = rowValue;
              existing.brandsUsed = rowBrands;
              existing.summary = rowSummary;
              updatedCount++;
            } else {
              const newProj: ProjectRecord = {
                id: rowId,
                name: rowName,
                nameEn: rowNameEn,
                year: rowYear,
                completionDate: `Năm ${rowYear}`,
                industry: rowIndustry as any,
                industryLabel: 'Công nghiệp & Năng lượng',
                industryLabelEn: 'Industry & Energy',
                clientInvestor: rowClient,
                epcContractor: 'Tổng thầu EPC',
                location: rowLocation,
                contractValueVnd: rowValue,
                brandsUsed: rowBrands,
                suppliedValves: [
                  { brand: rowBrands[0] || 'UTD', valveType: 'Van Bi & Van Bướm Chuẩn Dự Án', quantity: 'Hàng ngàn chiếc', specs: 'ASME / API' }
                ],
                summary: rowSummary,
                summaryEn: rowSummary,
                articleContent: rowSummary,
                articleContentEn: rowSummary,
                imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1200&q=80'
              };
              mergedList.unshift(newProj);
              currentMap.set(rowId, newProj);
              newCount++;
            }
          }
        }

        const finalList = Array.from(currentMap.values());
        setTimelineProjects(finalList);
        if (onBatchUpdateProjects) {
          onBatchUpdateProjects(finalList);
        }
        setBatchCsvMessage(
          lang === 'vi'
            ? `✓ Cập nhật thành công: Đã sửa ${updatedCount} dự án và thêm mới ${newCount} dự án!`
            : (lang === 'zh' ? `✓ 批量更新成功：已修改 ${updatedCount} 个项目，新增 ${newCount} 个项目！` : `✓ Batch updated ${updatedCount} projects, added ${newCount} new projects!`)
        );
        setTimeout(() => setBatchCsvMessage(null), 4000);
      } catch (err) {
        alert('Lỗi định dạng file CSV: Vui lòng kiểm tra lại cấu trúc hàng và cột.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSave = () => {
    const parsedStandards = standardsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const matchedCategory = categories.find(c => c.value === category);
    const categoryLabel = matchedCategory?.label || initial.categoryLabel;
    const categoryLabelEn = matchedCategory?.labelEn || initial.categoryLabelEn;

    // Detect materialGroup from material
    let matGroup: MaterialType = initial.materialGroup || 'ss304_316';
    const matLower = (material || '').toLowerCase();
    if (matLower.includes('gang') || matLower.includes('ductile') || matLower.includes('cast iron') || matLower.includes('ggg')) {
      matGroup = 'ductile_iron';
    } else if (matLower.includes('thép') || matLower.includes('wcb') || matLower.includes('carbon steel') || matLower.includes('gs-c25')) {
      matGroup = 'cast_steel';
    } else if (matLower.includes('đồng') || matLower.includes('bronze') || matLower.includes('brass')) {
      matGroup = 'bronze';
    } else if (matLower.includes('inox') || matLower.includes('cf8') || matLower.includes('ss304') || matLower.includes('ss316')) {
      matGroup = 'ss304_316';
    }

    // Detect pressureGroup from pressure
    let pressGroup: PressureRating = initial.pressureGroup || 'pn16';
    const pressLower = (pressure || '').toLowerCase();
    if (pressLower.includes('pn10') || pressLower.includes('10 bar')) {
      pressGroup = 'pn10';
    } else if (pressLower.includes('pn16') || pressLower.includes('16 bar') || pressLower.includes('150 psi') || pressLower.includes('200 psi')) {
      pressGroup = 'pn16';
    } else if (pressLower.includes('pn25') || pressLower.includes('25 bar') || pressLower.includes('300 psi')) {
      pressGroup = 'pn25';
    } else if (pressLower.includes('pn40') || pressLower.includes('40 bar') || pressLower.includes('class 300')) {
      pressGroup = 'pn40';
    } else if (pressLower.includes('pn63') || pressLower.includes('pn100') || pressLower.includes('class 600') || pressLower.includes('class 900')) {
      pressGroup = 'ansi600';
    }

    const productId = isCreateNew
      ? (initial.id && initial.id.startsWith('utd-new-') ? initial.id : `utd-new-${Date.now()}`)
      : initial.id;

    const updated: ValveProduct = {
      ...initial,
      id: productId,
      name,
      nameEn: nameEn || initial.nameEn || name,
      code,
      brand: brand || 'UTD',
      referencePriceVnd: Number(price) || 0,
      pressure,
      pressureGroup: pressGroup,
      material,
      materialGroup: matGroup,
      category,
      categoryLabel,
      categoryLabelEn,
      systemGroup,
      badge: badge.trim() || initial.badge,
      image: imagesList[0] || imageSrc || '/uploads/studio_ball_valve.jpg',
      images: imagesList.length > 0 ? imagesList : [imageSrc],
      imageVariants: imageVariantsMap[0] || initial.imageVariants,
      imagesVariants: imageVariantsMap.length > 0 ? imageVariantsMap : initial.imagesVariants,
      isCustomized: true, // Permanent lock by Admin against deletion or reset
      seoMetadata: {
        metaTitle: metaTitle || `${name} ${code} [${pressure}] | ${brand || 'UTD'} Valve`,
        metaTitleEn: metaTitleEn || currentSeoAudit.recommendedTitleEn,
        metaDescription: metaDescription || description,
        metaDescriptionEn: metaDescriptionEn || currentSeoAudit.recommendedDescriptionEn,
        targetKeywords: targetKeywords.length > 0 ? targetKeywords : [name.toLowerCase(), code.toLowerCase(), category, pressure.toLowerCase(), material.toLowerCase()],
        targetKeywordsEn: targetKeywordsEn.length > 0 ? targetKeywordsEn : currentSeoAudit.recommendedKeywordsEn,
        seoScore: currentSeoAudit.seoScore,
        searchIntent: currentSeoAudit.searchIntent
      },
      description,
      descriptionEn: descriptionEn || initial.descriptionEn || description,
      sizeRange,
      tempRange,
      connection,
      leakageClass,
      testPressureShell,
      testPressureSeat,
      standards: parsedStandards.length > 0 ? parsedStandards : initial.standards,
      specs: specs && specs.length > 0 ? specs : initial.specs,
      characteristics: {
        lifecycle,
        lifecycleEn,
        tempLimits,
        tempLimitsEn,
        sealIntegrity,
        sealIntegrityEn,
        mediaApplications,
        mediaApplicationsEn,
        aiSummaryNotes,
        aiSummaryNotesEn,
        customAttributes,
      },
      applicableMedia,
      applicableMediaEn,
      isMediaLocked,
      mediaApprovedDate: isMediaLocked ? (mediaLockDate || new Date().toLocaleDateString('vi-VN')) : undefined,
      highlightFeatures,
      highlightFeaturesEn,
      isMechanicalFeaturesLocked: isMechanicalLocked,
      mechanicalFeaturesApprovedDate: isMechanicalLocked ? (mechanicalLockDate || new Date().toLocaleDateString('vi-VN')) : undefined,
      isTranslationsLocked,
      translationsApprovedDate: isTranslationsLocked ? (translationsLockDate || new Date().toLocaleDateString('vi-VN')) : undefined,
      nameZh: nameZh || translateTechString(name, nameEn, 'zh'),
      descriptionZh: descriptionZh || translateTechString(description, descriptionEn, 'zh'),
      nameTh: nameTh || translateTechString(name, nameEn, 'th'),
      descriptionTh: descriptionTh || translateTechString(description, descriptionEn, 'th'),
      applicableMediaZh: applicableMedia.map((m, idx) => translateTechString(m, applicableMediaEn[idx], 'zh')),
      highlightFeaturesZh: highlightFeatures.map((f, idx) => translateTechString(f, highlightFeaturesEn[idx], 'zh')),
    };
    onSaveProduct(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const handleDelete = () => {
    if (onDeleteProduct && productToEdit) {
      if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${productToEdit.code} (${productToEdit.name}) khỏi hệ thống website?`)) {
        onDeleteProduct(productToEdit.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-amber-500/60 w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{isCreateNew ? 'THÊM SẢN PHẨM MỚI VÀO WEBSITE' : `CHỈNH SỬA SẢN PHẨM: ${initial.code}`}</span>
                <span className="text-[10px] font-mono bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                  ADMIN STUDIO & BỘ TỐI ƯU SEO
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Toàn quyền thêm, sửa, xóa sản phẩm • Hệ thống tự động tối ưu hóa nội dung SEO & co giãn hình ảnh studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Admin Override Mode toggle */}
            <button
              type="button"
              onClick={handleToggleAdminOverrideMode}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black font-mono flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 ${
                isOverrideModeActive
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30 ring-2 ring-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title={lang === 'vi' ? 'Tắt tạm thời chống copy, click chuột phải và F12' : 'Toggle off copy and inspect listeners'}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{isOverrideModeActive ? 'OVERRIDE: BẬT' : 'OVERRIDE: TẮT'}</span>
            </button>

            {/* Quick High Demand Alerts Badge Button */}
            <button
              type="button"
              onClick={() => setAdminStudioTab('demand_alerts')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 ${
                adminStudioTab === 'demand_alerts'
                  ? 'bg-red-600 text-white shadow-red-900/50 ring-2 ring-red-400'
                  : 'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-600/70'
              }`}
              title="Xem cảnh báo các model van nhu cầu cao (PICV, Van Bướm Triple-Offset)"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'vi' ? 'Nhu Cầu Cao' : 'High Demand'}</span>
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center">
                {demandAlerts.filter(a => a.status === 'active').length}
              </span>
            </button>

            {/* Export Translated CSV (EN/ZH) Button */}
            {onOpenExportCatalogModal && (
              <button
                type="button"
                onClick={onOpenExportCatalogModal}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/70"
                title={lang === 'vi' ? 'Tự động hóa xuất toàn bộ danh mục sang file CSV đã dịch (Anh/Trung) hỗ trợ xuất khẩu' : 'Export Translated Catalog CSV (EN/ZH)'}
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{lang === 'vi' ? 'Xuất CSV Anh/Trung' : 'Export CSV (EN/ZH)'}</span>
                <span className="sm:hidden">CSV EN/ZH</span>
              </button>
            )}

            {onOpenNotificationSettings && (
              <button
                type="button"
                onClick={onOpenNotificationSettings}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono flex items-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-600/70"
                title={lang === 'vi' ? 'Cấu hình thông báo tự động (Email & Telegram) khi có đại lý B2B hoặc báo giá khẩn' : 'Alerts Settings (Email & Telegram)'}
              >
                <Bell className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="hidden sm:inline">{lang === 'vi' ? 'Thông Báo (Telegram/Email)' : 'Alerts'}</span>
                <span className="sm:hidden">Alerts</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Automated Alert Ribbon for High-Demand Valves (PICV / HP Butterfly) */}
        {demandAlerts.some(a => a.status === 'active') && (
          <div className="bg-gradient-to-r from-red-950/95 via-amber-950/90 to-slate-950 border-b border-red-500/50 px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping shrink-0" />
              <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span className="font-extrabold text-white uppercase font-mono tracking-wide">
                {lang === 'vi' ? '🚨 CẢNH BÁO NHU CẦU VAN CAO:' : '🚨 HIGH-DEMAND VALVE ALERT:'}
              </span>
              <span className="text-amber-200 font-medium">
                {demandAlerts
                  .filter(a => a.status === 'active')
                  .map(a => `${a.valveCode} (${a.trendingRate} - ${a.queryCount} lượt tìm)`)
                  .join(' • ')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setAdminStudioTab('demand_alerts')}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg shadow text-[11px] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer font-mono"
            >
              <Pin className="w-3 h-3" />
              <span>{lang === 'vi' ? 'Xem Chi Tiết & Ghim Đầu Danh Mục →' : 'View & Prioritize in Catalog →'}</span>
            </button>
          </div>
        )}

        {/* Studio View Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-2 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          <button
            type="button"
            onClick={() => setAdminStudioTab('editor')}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
              adminStudioTab === 'editor'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '1. Chỉnh Sửa Sản Phẩm (Bố Cục Ô Kẻ CSS Grid)' : (lang === 'zh' ? '1. 产品参数编辑 (CSS Grid 网格)' : '1. Product Specs (CSS Grid Layout)')}</span>
          </button>
          <button
            type="button"
            onClick={() => setAdminStudioTab('projects_timeline')}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
              adminStudioTab === 'projects_timeline'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '2. Sắp Xếp Dòng Thời Gian (Drag & Drop) & CSV Batch' : (lang === 'zh' ? '2. 拖拽排序时间轴 & 批量CSV更新' : '2. Timeline Drag & Drop & Batch CSV')}</span>
            <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-700">
              {timelineProjects.length} DA
            </span>
          </button>
          <button
            type="button"
            onClick={() => setAdminStudioTab('seo_audit')}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
              adminStudioTab === 'seo_audit'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '3. Công Cụ SEO Audit & Từ Khóa Kỹ Thuật' : (lang === 'zh' ? '3. SEO 审查与技术关键词' : '3. SEO Audit & Tech Keywords')}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-black ${
              currentSeoAudit.seoScore >= 80 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
            }`}>
              {currentSeoAudit.seoScore}/100
            </span>
          </button>
          <button
            type="button"
            onClick={() => setAdminStudioTab('demand_alerts')}
            className={`px-4 py-2.5 border-b-2 font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
              adminStudioTab === 'demand_alerts'
                ? 'border-red-500 text-red-300 bg-red-950/40'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'vi' ? '4. Cảnh Báo Nhu Cầu Van Cao (PICV & Van Bướm)' : '4. High-Demand Valve Alerts (PICV & HP Butterfly)'}</span>
            <span className="text-[10px] font-mono bg-red-600 text-white px-1.5 py-0.2 rounded font-black">
              {demandAlerts.filter(a => a.status === 'active').length} HOT
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {demandAlertToast && (
            <div className="bg-emerald-950/95 border-2 border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl font-bold flex items-center justify-between shadow-2xl animate-fade-in ring-4 ring-emerald-500/20">
              <div className="flex items-center gap-2.5">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs">{demandAlertToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setDemandAlertToast(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {saveSuccess && (
            <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 p-3 rounded-xl flex items-center gap-2 font-bold animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Đã lưu thành công vào cơ sở dữ liệu website!</span>
            </div>
          )}

          {seoOptimizedNotice && (
            <div className="bg-blue-950 border border-blue-500 text-blue-200 p-3 rounded-xl flex items-center gap-2 font-bold animate-fade-in">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>{seoOptimizedNotice}</span>
            </div>
          )}

          {adminStudioTab === 'editor' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Product 1-3 Images Upload & Staging Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Crop className="w-3.5 h-3.5 text-amber-400" />
                    Hình Ảnh Sản Phẩm ({imagesList.length}/3)
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">3s/ảnh khi rê chuột</span>
                </div>

                {/* Staging Container */}
                <div 
                  className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 border-dashed border-slate-700 flex items-center justify-center p-3 transition-colors ${
                    bgColor === 'white' 
                      ? 'bg-white' 
                      : (bgColor === 'slate' ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950')
                  }`}
                >
                  <img
                    src={resolveProductImageUrl(imagesList[activeImageSlot] || imageSrc)}
                    alt="Product preview"
                    className={`max-w-full max-h-full transition-all duration-300 ${
                      aspectMode === 'cover' ? 'w-full h-full object-cover' : 'object-contain'
                    }`}
                    style={{
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    }}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                    }}
                  />

                  <div className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    Hình #{activeImageSlot + 1} {activeImageSlot === 0 ? '(Ảnh chính)' : '(Ảnh bổ sung)'}
                  </div>

                  {aiFilterApplied && (
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md border border-amber-500/50 text-amber-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Bộ Lọc: {aiFilterApplied}
                    </div>
                  )}

                  {isProcessingAi && (
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-amber-400 font-bold">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span>Đang nén & tối ưu hóa ảnh...</span>
                    </div>
                  )}
                </div>

                {/* 3 Thumbnails Strip */}
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((slotIdx) => {
                    const img = imagesList[slotIdx];
                    const isActive = activeImageSlot === slotIdx;
                    return (
                      <div 
                        key={slotIdx}
                        className={`relative rounded-lg border p-1 text-center transition-all ${
                          isActive ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        {img ? (
                          <div className="relative group/thumb">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveImageSlot(slotIdx);
                                setImageSrc(img);
                              }}
                              className="w-full aspect-square rounded overflow-hidden flex items-center justify-center bg-slate-900"
                            >
                              <img 
                                src={resolveProductImageUrl(img)} 
                                alt={`Slot ${slotIdx + 1}`} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = DEFAULT_VALVE_FALLBACK_IMAGE;
                                }}
                              />
                            </button>

                            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 px-0.5">
                              <span className="font-mono">#{slotIdx + 1}{slotIdx === 0 ? ' ⭐' : ''}</span>
                              <div className="flex items-center gap-1">
                                {slotIdx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImageSlot(slotIdx)}
                                    className="text-amber-400 hover:text-amber-300 text-[9px]"
                                    title="Đặt làm ảnh chính"
                                  >
                                    Set #1
                                  </button>
                                )}
                                {imagesList.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImageSlot(slotIdx)}
                                    className="text-red-400 hover:text-red-300 p-0.5"
                                    title="Xóa ảnh này"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-square rounded border border-dashed border-slate-700 hover:border-amber-400 flex flex-col items-center justify-center text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[9px] mt-0.5 font-mono">Thêm ảnh #{slotIdx + 1}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Upload & Actions */}
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleMultiFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imagesList.length >= 3}
                    className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 shadow transition-all ${
                      imagesList.length >= 3
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{imagesList.length >= 3 ? 'Đã đủ 3 ảnh (Tối đa)' : 'Upload Thêm Ảnh (1-3 Hình)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="p-2 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 border border-slate-700 rounded-lg"
                    title="Đặt lại ảnh mặc định"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Automated WebP Multi-Resolution Pipeline & Dimension Optimizer Banner */}
                <div className="bg-slate-950/95 border border-emerald-500/40 p-3 rounded-xl flex flex-col gap-2.5 text-[11px] font-mono shadow-lg">
                  <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-emerald-950/80 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-white font-extrabold text-xs">Tự Động Nén WebP & Tối Ưu Kích Thước Ảnh (Hosting Speed)</span>
                    </span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                      Chuẩn Google PageSpeed
                    </span>
                  </div>

                  {/* WebP Live Compression Statistics */}
                  {webpStats ? (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px]">Định dạng & Dung lượng gốc:</span>
                        <span className="text-slate-300 font-bold">{webpStats.originalFormat.replace('image/', '').toUpperCase()} • {webpStats.originalKb} KB ({webpStats.originalDimensions.width}x{webpStats.originalDimensions.height}px)</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span className="text-[11px]">Sau khi chuyển đổi WebP:</span>
                        <span className="text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50">
                          WEBP • {webpStats.optimizedKb} KB ({webpStats.optimizedDimensions.width}x{webpStats.optimizedDimensions.height}px)
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                        <span className="text-amber-400 font-bold">Tiết kiệm dung lượng:</span>
                        <span className="text-amber-300 font-black">-{webpStats.savedPercent}% (Giảm {Math.max(0, webpStats.originalKb - webpStats.optimizedKb)} KB)</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-[10px] leading-relaxed">
                      Mọi ảnh upload (PNG/JPG) tự động chuyển sang <strong>WebP</strong> và nén kích thước tối ưu (Max {webpMaxDim}px), giảm tới <strong>85-95% dung lượng</strong>, giúp website tải siêu tốc trên Hosting.
                    </p>
                  )}

                  {/* Controls for WebP Quality & Max Dimensions */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 text-[10px]">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Chất lượng WebP:</span>
                        <span className="text-emerald-400 font-bold">{Math.round(webpQuality * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.70"
                        max="0.95"
                        step="0.02"
                        value={webpQuality}
                        onChange={(e) => setWebpQuality(parseFloat(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Kích thước tối đa:</span>
                        <span className="text-blue-400 font-bold">{webpMaxDim}px</span>
                      </div>
                      <div className="flex gap-1">
                        {[800, 1280, 1600].map((dim) => (
                          <button
                            key={dim}
                            type="button"
                            onClick={() => setWebpMaxDim(dim)}
                            className={`flex-1 py-0.5 rounded text-[9px] font-bold transition-colors ${
                              webpMaxDim === dim
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {dim}p
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Batch WebP Converter Button for current product */}
                  <button
                    type="button"
                    onClick={handleBatchConvertExistingToWebP}
                    disabled={isWebpBatchConverting}
                    className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-98 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>
                      {isWebpBatchConverting
                        ? 'Đang nén & chuyển đổi WebP...'
                        : `Chuyển Đổi ${imagesList.length} Ảnh Sang WebP (${Math.round(webpQuality * 100)}% • ${webpMaxDim}px)`}
                    </span>
                  </button>

                  {optPipelineStatus && (
                    <span className="text-emerald-300 font-bold animate-fade-in text-[10px] bg-emerald-950/60 p-1.5 rounded border border-emerald-800/40">
                      {optPipelineStatus}
                    </span>
                  )}
                </div>

                {/* Explanation Card */}
                <div className="p-2.5 bg-blue-950/40 border border-blue-600/30 rounded-lg text-[10px] text-blue-200 space-y-1">
                  <p className="font-semibold text-blue-300 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Cơ chế hiển thị ảnh trên website:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    <li>Khách rê chuột vào thẻ sản phẩm: Ảnh tự chuyển động <strong>3 giây một hình</strong>.</li>
                    <li>Khách click vào ảnh: Mở Lightbox xem ảnh lớn độ phân giải cao.</li>
                  </ul>
                </div>

                {/* AI Auto Enhancement Quick Action Bar */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    Tự Động Bố Trí Góc Ảnh & Cân Chỉnh Studio:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => applyAiEnhance('studio')}
                      className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-left"
                    >
                      <strong className="block text-white text-[11px]">1. Studio Chuẩn</strong>
                      <span className="text-[10px] text-slate-400">Cân bằng sáng & tương phản</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyAiEnhance('clean_bg')}
                      className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-left"
                    >
                      <strong className="block text-white text-[11px]">2. Phông Trắng</strong>
                      <span className="text-[10px] text-slate-400">Tách nền catalogue trắng</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyAiEnhance('metallic')}
                      className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-left"
                    >
                      <strong className="block text-white text-[11px]">3. Ánh Kim Inox</strong>
                      <span className="text-[10px] text-slate-400">Tôn độ bóng kim loại bi van</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyAiEnhance('perspective')}
                      className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-left"
                    >
                      <strong className="block text-white text-[11px]">4. Căn Giữa 3D</strong>
                      <span className="text-[10px] text-slate-400">Khung ảnh cân đối không méo</span>
                    </button>
                  </div>
                </div>
              </div>

            {/* Right: Product Technical Fields & AI SEO Generator (Refactored CSS Grid Layout) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Header Action Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-white font-mono">
                      {lang === 'vi' ? 'Bố Cục Kỹ Thuật Sản Phẩm (CSS Grid Dàn Đều)' : (lang === 'zh' ? '产品技术规格布局 (CSS Grid 严密对齐)' : 'Product Technical Specs (CSS Grid Layout)')}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {lang === 'vi' ? 'Các ô bản kẻ phân tách logic, khoa học, chống chồng chéo chữ & co giãn hoàn hảo' : 'Logically grouped grid cells, non-overlapping inputs and full table borders'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunSmartCategorization}
                    disabled={isScanningCat}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow"
                    title="Quét áp suất, môi chất & vật liệu để tự động đề xuất phân loại"
                  >
                    <Cpu className="w-3.5 h-3.5 text-indigo-200" />
                    <span>{isScanningCat ? (lang === 'vi' ? 'Đang Quét...' : 'Scanning...') : (lang === 'vi' ? 'AI Smart Categorization' : 'AI Smart Categorization')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAiGenerateContent}
                    disabled={isGeneratingContent}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isGeneratingContent ? (lang === 'vi' ? 'Đang Soạn Thảo...' : 'Generating...') : (lang === 'vi' ? 'Tự Động Soạn Thảo & Tối Ưu SEO' : 'Auto-Generate Specs & SEO')}</span>
                  </button>
                </div>
              </div>

              {/* Card 1: THÔNG TIN ĐỊNH DANH & THƯƠNG MẠI (CSS Grid 12 Columns với đầy đủ ô bản kẻ) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide font-mono">
                      {lang === 'vi' ? '1. Định Danh Sản Phẩm & Phân Loại Thương Mại' : (lang === 'zh' ? '1. 产品基本标识与商业分类' : '1. Product Identity & Commercial Classification')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Bố Cục Ô Kẻ CSS Grid 12 Cột
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                  {/* Ô 1: Tên tiếng Việt */}
                  <div className="col-span-12 md:col-span-6 border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-200 font-bold text-[11px] uppercase tracking-wider font-mono">
                        {lang === 'vi' ? 'Tên Dòng Van (Tiếng Việt) *:' : 'Product Name (Vietnamese) *:'}
                      </label>
                      <span className="text-[10px] text-amber-400 font-mono font-bold">Bắt buộc</span>
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="VD: Van Bi Inox 316 Nối Bích DIN PN16"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:border-amber-400 focus:outline-none text-xs"
                    />
                  </div>

                  {/* Ô 2: Tên tiếng Anh */}
                  <div className="col-span-12 md:col-span-6 border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-200 font-bold text-[11px] uppercase tracking-wider font-mono">
                        {lang === 'vi' ? 'Tên Quốc Tế (English Name):' : 'International English Name:'}
                      </label>
                      <span className="text-[10px] text-blue-400 font-mono">Quốc tế</span>
                    </div>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      placeholder="e.g. Stainless Steel SS316 Ball Valve Flanged PN16"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-amber-400 focus:outline-none text-xs"
                    />
                  </div>

                  {/* Ô 3: Mã Model */}
                  <div className="col-span-12 sm:col-span-6 md:col-span-3 border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <label className="text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider font-mono">
                      {lang === 'vi' ? 'Mã Hiệu (Model Code) *:' : 'Model Code *:'}
                    </label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono font-bold focus:border-amber-400 focus:outline-none text-xs"
                    />
                  </div>

                  {/* Ô 4: Thương hiệu hãng */}
                  <div className="col-span-12 sm:col-span-6 md:col-span-3 border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <label className="text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider font-mono">
                      {lang === 'vi' ? 'Hãng Sản Xuất (Brand):' : 'Manufacturer Brand:'}
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-bold focus:border-amber-400 focus:outline-none text-xs"
                    >
                      <option value="UTD">UTD Valves (Brand USA)</option>
                      <option value="JMV-Korea">JMV-Korea (Hàn Quốc)</option>
                      <option value="Johnson Controls">Johnson Controls (Mỹ)</option>
                      <option value="Tyco">Tyco (UL/FM PCCC)</option>
                      <option value="Shield Valve UK">Shield Valve UK (Anh)</option>
                      <option value="VYC-Spain">VYC-Spain (Tây Ban Nha)</option>
                    </select>
                  </div>

                  {/* Ô 5: Giá dự án */}
                  <div className="col-span-12 sm:col-span-6 md:col-span-3 border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <label className="text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider font-mono">
                      {lang === 'vi' ? 'Giá Dự Án (VNĐ):' : 'Project Price (VND):'}
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold focus:border-amber-400 focus:outline-none text-xs"
                    />
                  </div>

                  {/* Ô 6: Nhãn Tag Badge */}
                  <div className="col-span-12 sm:col-span-6 md:col-span-3 border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <label className="text-slate-300 font-semibold mb-1.5 text-[11px] uppercase tracking-wider font-mono">
                      {lang === 'vi' ? 'Nhãn Tag (Product Badge):' : 'Product Badge:'}
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="VD: Sản phẩm mới (New Model)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-mono text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* AI SMART CATEGORIZATION: Quét Dải Áp Suất, Môi Chất Tương Thích & Vật Liệu (Chiếm toàn bộ 12 cột) */}
                  <div className="col-span-12 rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-900 p-4 space-y-3.5 shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/60 flex items-center justify-center text-indigo-400 shadow-inner">
                          <Cpu className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
                              {lang === 'vi' ? 'CÔNG CỤ PHÂN LOẠI THÔNG MINH AI (SMART CATEGORIZATION)' : (lang === 'zh' ? 'AI 智能参数分类工具' : 'AI SMART CATEGORIZATION TOOL')}
                            </span>
                            <span className="text-[10px] bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-700/80 font-bold">
                              Pressure • Media • Metallurgy
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {lang === 'vi' 
                              ? 'Tự động quét dải áp suất, môi chất tương thích & thông số kim loại để đề xuất danh mục và nhóm hệ thống chuẩn'
                              : 'Scans pressure range, media compatibility & metallurgy specs to automatically deduce best category & system group'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {smartCatResult && (
                          <button
                            type="button"
                            onClick={() => setIsSmartCatExpanded(!isSmartCatExpanded)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-mono font-bold"
                          >
                            {isSmartCatExpanded ? (lang === 'vi' ? 'Thu gọn ▲' : 'Collapse ▲') : (lang === 'vi' ? 'Xem kết quả ▼' : 'Expand ▼')}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleRunSmartCategorization}
                          disabled={isScanningCat}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                        >
                          {isScanningCat ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          )}
                          <span>{isScanningCat ? (lang === 'vi' ? 'Đang Quét Thông Số...' : 'Scanning Specs...') : (lang === 'vi' ? 'Quét Phân Loại Kỹ Thuật AI' : 'Scan & Categorize')}</span>
                        </button>
                      </div>
                    </div>

                    {smartCatAppliedNotice && (
                      <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold animate-fade-in flex items-center gap-2 shadow-sm">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{smartCatAppliedNotice}</span>
                      </div>
                    )}

                    {/* Result Detailed Breakdown */}
                    {smartCatResult && isSmartCatExpanded && (
                      <div className="bg-slate-950/80 rounded-xl border border-indigo-500/40 p-4 space-y-4 animate-fade-in">
                        {/* Recommendation Highlight Bar */}
                        <div className="flex items-center justify-between flex-wrap gap-3 bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-500/30">
                          <div className="space-y-1">
                            <span className="text-[10px] text-indigo-300 uppercase tracking-widest font-mono font-bold block">
                              {lang === 'vi' ? '★ KẾT QUẢ ĐỀ XUẤT CHÍNH XÁC:' : '★ RECOMMENDED CLASSIFICATION:'}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-black text-amber-300 font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/40">
                                {smartCatResult.suggestedCategoryLabel}
                              </span>
                              <span className="text-slate-400 text-xs font-bold font-mono">→</span>
                              <span className="text-xs font-bold text-blue-300 font-mono bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/40">
                                {smartCatResult.suggestedSystemGroupLabel}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block font-mono">{lang === 'vi' ? 'Độ Phù Hợp Kỹ Thuật' : 'Technical Match'}</span>
                              <span className="text-xs font-black text-emerald-400 font-mono">
                                {smartCatResult.confidence}% CONFIDENCE
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleApplySmartCategorization()}
                              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-lg text-xs flex items-center gap-1.5 shadow-lg active:scale-95"
                            >
                              <Check className="w-4 h-4 text-emerald-200" />
                              <span>{lang === 'vi' ? 'Áp Dụng Phân Loại Này' : 'Apply Recommendation'}</span>
                            </button>
                          </div>
                        </div>

                        {/* 4 Detected Signals Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {/* 1. Pressure signal */}
                          <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl flex flex-col justify-between space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
                              <span className="flex items-center gap-1 text-blue-400 font-bold">
                                <Gauge className="w-3 h-3" />
                                {lang === 'vi' ? '1. Dải Áp Suất' : '1. Pressure Rating'}
                              </span>
                              <span className="text-amber-400 font-bold">{pressure || 'PN16'}</span>
                            </div>
                            <p className="text-xs font-bold text-white leading-snug">
                              {smartCatResult.detectedSignals.pressureRatingCategory}
                            </p>
                          </div>

                          {/* 2. Media compatibility */}
                          <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl flex flex-col justify-between space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
                              <span className="flex items-center gap-1 text-cyan-400 font-bold">
                                💧 {lang === 'vi' ? '2. Môi Chất' : '2. Media Compatibility'}
                              </span>
                              <span className="text-cyan-300 font-bold">Tương Thích</span>
                            </div>
                            <p className="text-xs font-bold text-white leading-snug">
                              {smartCatResult.detectedSignals.primaryMediaCategory}
                            </p>
                          </div>

                          {/* 3. Metallurgy specs */}
                          <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl flex flex-col justify-between space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
                              <span className="flex items-center gap-1 text-amber-400 font-bold">
                                🛡️ {lang === 'vi' ? '3. Vật Liệu Thân' : '3. Metallurgy Specs'}
                              </span>
                              <span className="text-amber-300 font-bold">{material ? material.slice(0, 10) : 'CF8M'}</span>
                            </div>
                            <p className="text-xs font-bold text-white leading-snug">
                              {smartCatResult.detectedSignals.metallurgyProfile}
                            </p>
                          </div>

                          {/* 4. Temperature & Connection */}
                          <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl flex flex-col justify-between space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase">
                              <span className="flex items-center gap-1 text-red-400 font-bold">
                                🌡️ {lang === 'vi' ? '4. Nhiệt Độ & Nối' : '4. Temp & Connect'}
                              </span>
                              <span className="text-slate-300">{tempRange ? tempRange.slice(0, 8) : 'Ambient'}</span>
                            </div>
                            <p className="text-xs font-bold text-white leading-snug">
                              {smartCatResult.detectedSignals.temperatureProfile}
                            </p>
                          </div>
                        </div>

                        {/* Engineering Drivers */}
                        {smartCatResult.keyDrivers && smartCatResult.keyDrivers.length > 0 && (
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                              {lang === 'vi' ? 'Căn Cứ Kỹ Thuật Cơ Khí Xác Định:' : 'Engineering Logic & Rules Applied:'}
                            </span>
                            <ul className="space-y-1 text-xs text-slate-300 pl-1">
                              {smartCatResult.keyDrivers.map((driver, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-indigo-400 font-bold font-mono">▸</span>
                                  <span>{driver}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Candidate Alternatives */}
                        {smartCatResult.alternativeSuggestions && smartCatResult.alternativeSuggestions.length > 0 && (
                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[10px] text-slate-400 font-mono uppercase">
                              {lang === 'vi' ? 'Lựa chọn thay thế ứng cử viên:' : 'Alternative Candidates:'}
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              {smartCatResult.alternativeSuggestions.map((alt, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleApplySmartCategorization(alt.category, alt.systemGroup)}
                                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-colors"
                                  title={alt.reason}
                                >
                                  <span className="font-bold text-amber-300">{alt.label}</span>
                                  <span className="text-[9px] text-emerald-400">({alt.confidence}%)</span>
                                  <span className="text-slate-500 hover:text-white">Áp dụng →</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ô 7: Danh mục loại van */}
                  <div className="col-span-12 md:col-span-6 border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-amber-300 font-bold text-[11px] uppercase tracking-wider font-mono">
                        {lang === 'vi' ? 'Danh Mục Sản Phẩm (Loại Van) *:' : 'Valve Category *:'}
                      </label>
                      {smartCatResult && smartCatResult.suggestedCategory === category && (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-600/40">
                          ✓ Khớp Đề Xuất AI
                        </span>
                      )}
                    </div>
                    <select
                      value={category}
                      onChange={(e) => {
                        const newCat = e.target.value as ValveCategory;
                        setCategory(newCat);
                        const matched = categories.find(c => c.value === newCat);
                        if (matched?.systemGroup) {
                          setSystemGroup(matched.systemGroup);
                        }
                      }}
                      className="w-full bg-slate-950 border border-amber-500/60 rounded-lg px-3 py-2 text-amber-300 font-bold text-xs focus:border-amber-400 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value} className="bg-slate-900 text-slate-200">
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ô 8: Hệ thống ứng dụng */}
                  <div className="col-span-12 md:col-span-6 border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-300 font-semibold text-[11px] uppercase tracking-wider font-mono">
                        {lang === 'vi' ? 'Hệ Thống Ứng Dụng (System Group):' : 'Application System:'}
                      </label>
                      {smartCatResult && smartCatResult.suggestedSystemGroup === systemGroup && (
                        <span className="text-[10px] text-blue-400 font-mono font-bold flex items-center gap-1 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-600/40">
                          ✓ Khớp Hệ Thống AI
                        </span>
                      )}
                    </div>
                    <select
                      value={systemGroup}
                      onChange={(e) => setSystemGroup(e.target.value as SystemGroup)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="water">Water (Cấp Thoát Nước & Xử Lý Nước)</option>
                      <option value="firefighting">Fire Fighting (Hệ PCCC Cứu Hỏa UL/FM)</option>
                      <option value="steam">Steam (Hệ Hơi Nóng & Lò Hơi Áp Lực)</option>
                      <option value="hvac">HVAC (Chiller & Tòa Nhà Cao Tầng)</option>
                      <option value="oilgas">Oil & Gas (Dầu Khí & Hóa Chất)</option>
                      <option value="gas_cryogenic">Gas & Cryogenic (Khí Âm Sâu / LNG)</option>
                      <option value="instrument">Instrument (Đo Lường & Tự Động Hóa)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Card 2: THÔNG SỐ VẬT LIỆU CỐT LÕI (BẢO VỆ KHÓA VĨNH VIỄN) */}
              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-amber-500/50 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-mono font-bold text-xs text-amber-300 uppercase">
                      {lang === 'vi' ? '2. Thông Số Kỹ Thuật Cốt Lõi (Khóa Bảo Vệ Vĩnh Viễn Khi Lưu)' : '2. Core Technical Specifications (Permanent Admin Lock)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-600/40 font-bold">
                    Khóa Bảo Vệ Vĩnh Viễn
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="border border-amber-500/40 bg-slate-900/80 p-3.5 rounded-xl flex flex-col justify-between hover:border-amber-400 transition-colors shadow-sm">
                    <label className="block text-slate-200 font-bold mb-1.5 text-[11px] uppercase font-mono">
                      {lang === 'vi' ? '1. Vật Liệu Thân (Material) *:' : '1. Body Metallurgy *:'}
                    </label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                      placeholder="Inox 316 / CF8M / Gang cầu GGG50 / Thép WCB"
                    />
                  </div>

                  <div className="border border-amber-500/40 bg-slate-900/80 p-3.5 rounded-xl flex flex-col justify-between hover:border-amber-400 transition-colors shadow-sm">
                    <label className="block text-slate-200 font-bold mb-1.5 text-[11px] uppercase font-mono">
                      {lang === 'vi' ? '2. Nhiệt Độ Làm Việc (Temp) *:' : '2. Working Temperature *:'}
                    </label>
                    <input
                      type="text"
                      value={tempRange}
                      onChange={(e) => setTempRange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                      placeholder="-20°C đến +180°C / Max 425°C"
                    />
                  </div>

                  <div className="border border-amber-500/40 bg-slate-900/80 p-3.5 rounded-xl flex flex-col justify-between hover:border-amber-400 transition-colors shadow-sm">
                    <label className="block text-slate-200 font-bold mb-1.5 text-[11px] uppercase font-mono">
                      {lang === 'vi' ? '3. Kiểu Kết Nối (Connection) *:' : '3. End Connection *:'}
                    </label>
                    <input
                      type="text"
                      value={connection}
                      onChange={(e) => setConnection(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                      placeholder="Mặt bích BS EN 1092-2 / DIN PN16 / Grooved"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                  * Admin toàn quyền chỉnh sửa Vật liệu, Nhiệt độ và Kết nối. Khi lưu sản phẩm, hệ thống ghi nhận khóa bảo vệ vĩnh viễn (isCustomized: true), tuyệt đối không bị reset.
                </p>
              </div>

              {/* Card 3: CẤP ÁP SUẤT & THỬ NGHIỆM THỦY TĨNH */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
                      <Gauge className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wide font-mono">
                      {lang === 'vi' ? '3. Cấp Áp Suất Danh Định, Dải Kích Cỡ & Tiêu Chuẩn Thử Nghiệm' : '3. Pressure Ratings, Size Range & Hydrostatic Test Standards'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Bố Cục 4 Ô Bản Kẻ Dàn Đều
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div className="border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-blue-400/50 transition-colors shadow-sm">
                    <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase font-mono">
                      {lang === 'vi' ? 'Cấp Áp Suất (Pressure):' : 'Nominal Pressure:'}
                    </label>
                    <input
                      type="text"
                      value={pressure}
                      onChange={(e) => setPressure(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 focus:border-amber-400 focus:outline-none font-mono text-xs font-bold"
                      placeholder="PN16 / PN25 / Class 150"
                    />
                  </div>

                  <div className="border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-blue-400/50 transition-colors shadow-sm">
                    <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase font-mono">
                      {lang === 'vi' ? 'Dải Kích Cỡ Tiêu Chuẩn (Size):' : 'Nominal Size Range:'}
                    </label>
                    <input
                      type="text"
                      value={sizeRange}
                      onChange={(e) => setSizeRange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none font-mono text-xs"
                      placeholder={'DN15 - DN300 (1/2" - 12")'}
                    />
                  </div>

                  <div className="border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-blue-400/50 transition-colors shadow-sm">
                    <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase font-mono">
                      {lang === 'vi' ? 'Cấp Độ Kín Rò Rỉ (Leakage):' : 'Leakage Class:'}
                    </label>
                    <input
                      type="text"
                      value={leakageClass}
                      onChange={(e) => setLeakageClass(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="ISO 5208 Rate A (Bubble-Tight)"
                    />
                  </div>

                  <div className="border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-blue-400/50 transition-colors shadow-sm">
                    <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase font-mono">
                      {lang === 'vi' ? 'Thử Áp Vỏ & Đệm (Shell/Seat):' : 'Hydrostatic Shell/Seat:'}
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={testPressureShell}
                        onChange={(e) => setTestPressureShell(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-slate-200 text-[11px] focus:border-amber-400 focus:outline-none font-mono"
                        placeholder="1.5 x PN"
                        title="Thử áp lực vỏ (Shell Test)"
                      />
                      <input
                        type="text"
                        value={testPressureSeat}
                        onChange={(e) => setTestPressureSeat(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-slate-200 text-[11px] focus:border-amber-400 focus:outline-none font-mono"
                        placeholder="1.1 x PN"
                        title="Thử áp lực đệm (Seat Test)"
                      />
                    </div>
                  </div>

                  <div className="col-span-full border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-blue-400/50 transition-colors shadow-sm">
                    <label className="block text-slate-300 font-semibold mb-1.5 text-[11px] uppercase font-mono">
                      {lang === 'vi' ? 'Tiêu Chuẩn Sản Xuất (phân cách bằng dấu phẩy):' : 'Manufacturing Standards (comma separated):'}
                    </label>
                    <input
                      type="text"
                      value={standardsText}
                      onChange={(e) => setStandardsText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                      placeholder="ASME B16.34, EN 1092-1, API 607, ISO 9001:2015, API 598"
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: MÔ TẢ KỸ THUẬT & CATALOGUE PRESETS */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono flex items-center gap-2">
                        <span>{lang === 'vi' ? '4. Mô Tả Kỹ Thuật Chi Tiết & Tối Ưu SEO' : '4. Technical Description & SEO Summary'}</span>
                        <span className="text-[10px] font-normal font-mono bg-blue-950 text-blue-300 px-2 py-0.2 rounded border border-blue-700/60">
                          Bilingual Auto-Sync
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isTranslatingDesc ? (
                      <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1.5 bg-amber-950/70 px-2 py-0.5 rounded-lg border border-amber-600/40">
                        <span className="w-2.5 h-2.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        AI Đang dịch sang tiếng Anh...
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-600/40">
                        ✓ AI Tự Động Dịch Hoạt Động
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Ô 1: Mô tả tiếng Việt */}
                  <div className="border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-300 font-bold text-[11px] uppercase font-mono">
                        {lang === 'vi' ? 'Mô Tả Tiếng Việt (SEO Description):' : 'Vietnamese Description:'}
                      </label>
                      <span className="text-[10px] text-slate-400 font-mono">{description.length} ký tự</span>
                    </div>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-400 text-xs leading-relaxed"
                      placeholder="Mô tả kỹ thuật chuyên sâu về cấu tạo và ứng dụng của dòng van..."
                    />
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="italic">💡 Gõ tiếng Việt, AI sẽ tự động học hỏi & dịch sang tiếng Anh bên cạnh.</span>
                      <label className="flex items-center gap-1 cursor-pointer text-amber-400 font-mono">
                        <input
                          type="checkbox"
                          checked={isAutoTranslateDesc}
                          onChange={(e) => setIsAutoTranslateDesc(e.target.checked)}
                          className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                        />
                        <span>Tự động dịch</span>
                      </label>
                    </div>
                  </div>

                  {/* Ô 2: Mô tả tiếng Anh (AI Tự Học Hỏi Thông Minh) */}
                  <div className="border border-slate-700/80 bg-slate-900/70 p-3 rounded-xl flex flex-col justify-between hover:border-amber-500/50 transition-colors shadow-sm">
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <div className="flex items-center gap-1.5">
                        <label className="text-slate-300 font-bold text-[11px] uppercase font-mono">
                          {lang === 'vi' ? 'Mô Tả Tiếng Anh (English Description):' : 'English Description:'}
                        </label>
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-1.5 py-0.2 rounded border border-indigo-700">
                          AI Auto
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleManualTranslateDescription('en')}
                          disabled={isTranslatingDesc}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow"
                          title="Dịch lại ngay lập tức sang tiếng Anh"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          <span>Dịch lại EN</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleManualTranslateDescription('zh')}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono"
                          title="Dịch sang tiếng Trung"
                        >
                          🇨🇳 Trung
                        </button>
                        <button
                          type="button"
                          onClick={() => handleManualTranslateDescription('th')}
                          className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono"
                          title="Dịch sang tiếng Thái"
                        >
                          🇹🇭 Thái
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={4}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-amber-400 text-xs leading-relaxed"
                      placeholder="High performance industrial valve with precision casting and zero leakage sealing..."
                    />
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono">{descriptionEn.length} characters (ASME/ISO technical terminology)</span>
                      <span className="text-emerald-400 font-mono">✓ Chuẩn xuất khẩu</span>
                    </div>
                  </div>
                </div>

                {/* Detected Figure Model Banner */}
                {(() => {
                  const detected = findMatchingFigPreset(code);
                  if (!detected) return null;
                  return (
                    <div className="bg-indigo-950/40 border border-indigo-500/40 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs animate-fade-in">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        <div>
                          <span className="font-bold text-white font-mono">
                            Phát hiện mã Catalogue UTD: <strong className="text-amber-300">{detected.figCode}</strong>
                          </span>
                          <p className="text-[11px] text-slate-300">
                            {detected.nameVi} ({detected.pressure} • {detected.material.slice(0, 35)}...)
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplyFigPreset(detected)}
                        className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Nạp Đúng Thông Số Chuẩn UTD {detected.figCode}</span>
                      </button>
                    </div>
                  );
                })()}

                {figPresetNotice && (
                  <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{figPresetNotice}</span>
                  </div>
                )}

                {/* UTD Figure Catalogue Quick Presets */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-amber-400 uppercase font-mono flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      {lang === 'vi' ? 'Nạp Nhanh Chuẩn Catalogue UTD theo Fig:' : 'Load UTD Catalogue Specs by Fig:'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Tự động nạp: Vật liệu, Áp suất, Nhiệt độ, Kết nối, Tiêu chuẩn & Mô tả EN
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {UTD_CATALOGUE_FIGURE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyFigPreset(preset)}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          selectedFigCode === preset.figCode
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                            : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-[11px] text-amber-300">{preset.figCode}</span>
                          <span className="text-[9px] font-mono px-1 rounded bg-slate-950 text-slate-400 uppercase">
                            {preset.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-white line-clamp-1 font-semibold">{preset.nameVi.split('(')[0]}</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">{preset.pressure} • {preset.tempRange}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4B: MÔI CHẤT KHUYẾN NGHỊ SỬ DỤNG & KHÓA PHÊ DUYỆT ADMIN (Requirement 2) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-blue-500/40 space-y-4 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400">
                      <Droplet className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white uppercase tracking-wide font-mono flex items-center gap-2">
                        <span>{lang === 'vi' ? '4B. Môi Chất Khuyến Nghị Sử Dụng (Applicable Media)' : '4B. Recommended Applicable Media'}</span>
                        {isMediaLocked ? (
                          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-600/60 font-bold flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-emerald-400" />
                            {lang === 'vi' ? `🔒 ĐÃ DUYỆT & KHÓA (${mediaLockDate || 'Admin Approved'})` : '🔒 APPROVED & LOCKED'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-600/40">
                            🔓 Đang Mở (Chưa Khóa)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleLockMedia}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
                        isMediaLocked
                          ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-900/30 ring-1 ring-emerald-400'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/20'
                      }`}
                      title={isMediaLocked ? 'Bấm để mở khóa chỉnh sửa' : 'Bấm để duyệt và khóa môi chất theo ý admin'}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isMediaLocked ? (lang === 'vi' ? '🔒 Đã Phê Duyệt & Khóa (Click mở khóa)' : '🔒 Locked (Click to Unlock)') : (lang === 'vi' ? '🔒 Phê Duyệt & Khóa Môi Chất' : '🔒 Approve & Lock Media')}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    {lang === 'vi' 
                      ? 'Admin có toàn quyền thêm, sửa, xóa môi chất khuyến nghị sử dụng. Khi khóa lại, các thao tác nạp catalogue tự động sẽ không làm mất danh sách đã duyệt.'
                      : 'Admin can adjust, replace, and lock recommended media. Once locked, automated presets will preserve approved entries.'}
                  </p>

                  {/* Add Media Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMediaInput}
                      onChange={(e) => setNewMediaInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMedia(newMediaInput);
                        }
                      }}
                      placeholder={lang === 'vi' ? 'Nhập tên môi chất (VD: Nước nóng 120°C, Axit H2SO4 10%, Khí nén...)' : 'Enter media name...'}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddMedia(newMediaInput)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Thêm Môi Chất' : 'Add Media'}</span>
                    </button>
                  </div>

                  {/* Tag Chips Grid */}
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800 min-h-[50px] items-center">
                    {applicableMedia.map((m, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                          isMediaLocked
                            ? 'bg-emerald-950/80 border border-emerald-600/50 text-emerald-200'
                            : 'bg-blue-950/80 border border-blue-500/40 text-blue-200 hover:border-amber-400'
                        }`}
                      >
                        <Droplet className="w-3 h-3 text-blue-400" />
                        <span>{m}</span>
                        {applicableMediaEn[idx] && (
                          <span className="text-[10px] text-slate-400 font-normal">({applicableMediaEn[idx]})</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="text-slate-400 hover:text-red-400 ml-1 font-bold text-sm"
                          title="Xóa môi chất này"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Quick AI Presets for Media */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {lang === 'vi' ? 'Gợi ý nhanh:' : 'Quick Add:'}
                    </span>
                    {[
                      { vi: 'Nước sạch sinh hoạt', en: 'Potable Water' },
                      { vi: 'Hơi nóng (Steam 250°C)', en: 'Steam (250°C)' },
                      { vi: 'Hóa chất & Axit ăn mòn', en: 'Chemicals & Acids' },
                      { vi: 'Nước lạnh Chiller / HVAC', en: 'Chilled Water HVAC' },
                      { vi: 'PCCC Sprinkler 300 PSI', en: 'Fire Sprinkler 300 PSI' },
                      { vi: 'Bùn khoáng & Nước thải thô', en: 'Mineral Slurry & Wastewater' },
                      { vi: 'Khí gas / Hydrocarbon', en: 'Hydrocarbon Gas' }
                    ].map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddMedia(item.vi, item.en)}
                        className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-300 border border-slate-700/80 font-mono text-[10px]"
                      >
                        + {item.vi}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4C: ĐẶC TÍNH THIẾT KẾ CƠ KHÍ & AI GỢI Ý SO SÁNH THEO CHỨC NĂNG VAN (Requirement 3) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-4 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                      <Wrench className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white uppercase tracking-wide font-mono flex items-center gap-2">
                        <span>{lang === 'vi' ? '4C. Đặc Tính Thiết Kế Cơ Khí (Mechanical Highlights)' : '4C. Mechanical Design Features'}</span>
                        {isMechanicalLocked ? (
                          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-600/60 font-bold flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-emerald-400" />
                            {lang === 'vi' ? `🔒 ĐÃ DUYỆT & KHÓA (${mechanicalLockDate || 'Admin Approved'})` : '🔒 APPROVED & LOCKED'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-600/40">
                            🔓 Đang Mở (Chưa Khóa)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAiSuggestMechanical}
                      disabled={isAiSuggestingMechanical}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                      title="AI tự thu thập và so sánh đúng theo tên gọi chức năng từng van mà gợi ý chính xác"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isAiSuggestingMechanical ? 'AI Đang Thu Thập...' : (lang === 'vi' ? '⚡ AI Thu Thập & Gợi Ý Cơ Tính' : '⚡ AI Suggest Highlights')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleLockMechanical}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
                        isMechanicalLocked
                          ? 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-900/30 ring-1 ring-emerald-400'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/20'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isMechanicalLocked ? (lang === 'vi' ? '🔒 Đã Phê Duyệt & Khóa Cơ Tính' : '🔒 Mechanical Locked') : (lang === 'vi' ? '🔒 Phê Duyệt & Khóa Cơ Tính' : '🔒 Approve & Lock')}</span>
                    </button>
                  </div>
                </div>

                {mechanicalNotice && (
                  <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{mechanicalNotice}</span>
                  </div>
                )}

                <p className="text-xs text-slate-400">
                  {lang === 'vi'
                    ? 'AI tự động rà soát tên gọi, chức năng van (Van cổng dao, Van bướm lệch tâm, Van cầu hơi, Van bi...) để tổng hợp chính xác các điểm nổi bật cơ khí. Admin có thể chỉnh sửa trực tiếp và khoá lại.'
                    : 'AI auto-compares and gathers precise mechanical design highlights based on valve model and category. Admin can customize and lock permanently.'}
                </p>

                {/* List of Features */}
                <div className="space-y-2.5">
                  {highlightFeatures.map((feat, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-amber-400 flex items-center gap-1">
                          <span>#{idx + 1}</span>
                          <span className="text-slate-400 font-normal">Đặc tính cơ khí:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlightFeature(idx)}
                          className="text-slate-500 hover:text-red-400 text-xs font-bold"
                          title="Xóa đặc tính này"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">Tiếng Việt:</span>
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const updated = [...highlightFeatures];
                              updated[idx] = e.target.value;
                              setHighlightFeatures(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">English (International):</span>
                          <input
                            type="text"
                            value={highlightFeaturesEn[idx] || ''}
                            onChange={(e) => {
                              const updated = [...highlightFeaturesEn];
                              updated[idx] = e.target.value;
                              setHighlightFeaturesEn(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-400 text-xs focus:border-indigo-400 focus:outline-none"
                            placeholder="English description..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add New Feature Line */}
                  <div className="bg-slate-900/40 p-3 rounded-xl border border-dashed border-slate-800 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-slate-300 block">
                      + Thêm đặc tính thiết kế mới:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newFeatureInput}
                        onChange={(e) => setNewFeatureInput(e.target.value)}
                        placeholder="Nội dung tiếng Việt (VD: Đĩa van mài bóng gương Ra < 0.2 µm...)"
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newFeatureEnInput}
                        onChange={(e) => setNewFeatureEnInput(e.target.value)}
                        placeholder="Nội dung tiếng Anh (e.g. Mirror polished disc Ra < 0.2 µm...)"
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddHighlightFeature(newFeatureInput, newFeatureEnInput)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      + Thêm Đặc Tính Cơ Khí
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 4D: AI RÀ SOÁT & ĐỀ XUẤT DỊCH ĐA NGÔN NGỮ & KHÓA BẢN DỊCH (Requirement 6) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-indigo-500/50 space-y-4 shadow-xl">
                {/* Header with Title and Global Approval Controls */}
                <div className="flex items-center justify-between flex-wrap gap-2.5 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white uppercase tracking-wide font-mono">
                          {lang === 'vi' ? '4D. Bảng Rà Soát Đề Xuất Dịch Đa Ngôn Ngữ & Phê Duyệt Khóa' : '4D. AI Multilingual Translation Proposal & Approval Lock'}
                        </span>
                        {isTranslationsLocked ? (
                          hasVietnameseChangedSinceLock ? (
                            <span className="text-[10px] font-mono bg-amber-950/90 text-amber-300 px-2 py-0.5 rounded border border-amber-500/60 font-bold flex items-center gap-1 animate-pulse">
                              <span>⚠️</span>
                              <span>{lang === 'vi' ? 'Tiếng Việt Vừa Sửa - Cần Duyệt Lại' : 'VI Modified - Re-Approval Required'}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-600/60 font-bold flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-emerald-400" />
                              <span>{lang === 'vi' ? `🔒 ĐÃ DUYỆT & KHÓA (${translationsLockDate || 'Admin Approved'})` : '🔒 TRANSLATIONS LOCKED'}</span>
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] font-mono bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded border border-blue-600/40 font-bold">
                            🔓 Đang Mở (AI Tự Động Đồng Bộ)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'vi' 
                          ? 'AI tự động rà soát nội dung tiếng Việt của admin để dịch sang Tiếng Anh, Tiếng Trung (ZH), Tiếng Thái (TH) và khóa lại theo ý admin.' 
                          : 'AI scans Vietnamese text and provides verified translations for English, Chinese (ZH), and Thai (TH).'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAiTranslateAllLanguages}
                      className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                      title="AI rà soát lại toàn bộ tiếng Việt và tạo bản dịch mới cho EN, ZH, TH"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{lang === 'vi' ? '⚡ AI Rà Soát & Cập Nhật Dịch' : '⚡ AI Re-Scan & Translate'}</span>
                    </button>

                    {isTranslationsLocked ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleApproveAndLockTranslations}
                          className="px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-1.5"
                          title="Cập nhật khóa lại bản dịch mới nhất"
                        >
                          <Lock className="w-3.5 h-3.5 text-white" />
                          <span>{lang === 'vi' ? '🔒 Khóa Lại Bản Dịch Mới' : '🔒 Re-Lock Translations'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleUnlockTranslations}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        >
                          🔓 Mở Khóa
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApproveAndLockTranslations}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 flex items-center gap-1.5 ring-1 ring-indigo-400"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>{lang === 'vi' ? '🔒 Phê Duyệt & Khóa Toàn Bộ Bản Dịch' : '🔒 Approve & Lock Translations'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Warning Alert if Vietnamese content changed since last lock */}
                {hasVietnameseChangedSinceLock && (
                  <div className="bg-amber-950/80 border border-amber-500/70 text-amber-200 px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between gap-2 animate-fade-in shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚠️</span>
                      <span>
                        <strong>{lang === 'vi' ? 'Phát hiện nội dung tiếng Việt vừa thay đổi:' : 'Vietnamese content modified:'}</strong>{' '}
                        {lang === 'vi'
                          ? 'AI đã tự động đề xuất bản dịch EN/ZH mới tương ứng. Bấm "Khóa Lại Bản Dịch Mới" để hoàn tất duyệt.'
                          : 'AI updated translations accordingly. Click "Re-Lock Translations" to seal.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleApproveAndLockTranslations}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[11px] shrink-0"
                    >
                      Duyệt & Khóa Ngay →
                    </button>
                  </div>
                )}

                {translationLockNotice && (
                  <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 px-3.5 py-2 rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{translationLockNotice}</span>
                  </div>
                )}

                {/* Language Switcher Tabs for Previewing & Editing AI Proposals */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 mr-1 font-mono">
                      {lang === 'vi' ? 'Xem & Chỉnh sửa bản dịch:' : 'Target Language:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTransPreviewTab('en')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        transPreviewTab === 'en'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>🇺🇸</span>
                      <span>English (Tiếng Anh)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransPreviewTab('zh')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        transPreviewTab === 'zh'
                          ? 'bg-red-700 text-white shadow-md shadow-red-900/40 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>🇨🇳</span>
                      <span>中文 - Tiếng Trung (ZH)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransPreviewTab('th')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        transPreviewTab === 'th'
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>🇹🇭</span>
                      <span>ภาษาไทย - Tiếng Thái (TH)</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/50">
                    {transPreviewTab === 'en' ? 'Export Standard: ASME / API' : (transPreviewTab === 'zh' ? '中国国家标准: GB / JB 阀门术语' : 'Thai Industrial Standard (TIS)')}
                  </span>
                </div>

                {/* Comparative Proposal Table / Fields */}
                <div className="space-y-3.5 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
                  {/* Field 1: Valve Name Proposal */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 font-mono flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        <span>1. Tên Dòng Van:</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Bản gốc VI: <strong className="text-white">{name}</strong></span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-3 text-[11px] text-slate-400 font-mono">
                        {transPreviewTab === 'en' ? 'Bản dịch EN đề xuất:' : (transPreviewTab === 'zh' ? 'Bản dịch Tiếng Trung đề xuất:' : 'Bản dịch Tiếng Thái đề xuất:')}
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={
                            transPreviewTab === 'en'
                              ? nameEn
                              : (transPreviewTab === 'zh' ? (nameZh || translateTechString(name, nameEn, 'zh')) : (nameTh || translateTechString(name, nameEn, 'th')))
                          }
                          onChange={(e) => {
                            if (transPreviewTab === 'en') setNameEn(e.target.value);
                            else if (transPreviewTab === 'zh') setNameZh(e.target.value);
                            else setNameTh(e.target.value);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:border-indigo-400 focus:outline-none font-medium"
                          placeholder="Nhập bản dịch..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Field 2: Technical Description Proposal */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 font-mono flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>2. Mô Tả Kỹ Thuật (SEO Description):</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {transPreviewTab === 'en' ? `${descriptionEn.length} ký tự` : (transPreviewTab === 'zh' ? `${(descriptionZh || '').length} ký tự` : `${(descriptionTh || '').length} ký tự`)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-mono block mb-1">Bản gốc Tiếng Việt:</span>
                        <p className="text-slate-300 text-xs leading-relaxed italic line-clamp-4">
                          {description || '(Chưa có mô tả tiếng Việt)'}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-indigo-300 font-mono">
                            {transPreviewTab === 'en' ? 'Bản dịch English (Admin có thể sửa trực tiếp):' : (transPreviewTab === 'zh' ? 'Bản dịch Tiếng Trung 中文 (Admin có thể sửa trực tiếp):' : 'Bản dịch Tiếng Thái (Admin có thể sửa trực tiếp):')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleManualTranslateDescription(transPreviewTab)}
                            className="text-[10px] text-amber-400 hover:underline font-mono"
                          >
                            Dịch lại mục này ↺
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={
                            transPreviewTab === 'en'
                              ? descriptionEn
                              : (transPreviewTab === 'zh' ? (descriptionZh || translateTechString(description, descriptionEn, 'zh')) : (descriptionTh || translateTechString(description, descriptionEn, 'th')))
                          }
                          onChange={(e) => {
                            if (transPreviewTab === 'en') setDescriptionEn(e.target.value);
                            else if (transPreviewTab === 'zh') setDescriptionZh(e.target.value);
                            else setDescriptionTh(e.target.value);
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:border-indigo-400 focus:outline-none leading-relaxed"
                          placeholder="Nội dung dịch..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Field 3: Recommended Fluids Proposal */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 font-mono flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-sky-400" />
                        <span>3. Môi Chất Khuyến Nghị Sử Dụng:</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {applicableMedia.length} môi chất được cấu hình
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {applicableMedia.map((m, idx) => {
                        let translated = '';
                        if (transPreviewTab === 'en') {
                          translated = applicableMediaEn[idx] || translateTechString(m, undefined, 'en');
                        } else if (transPreviewTab === 'zh') {
                          translated = translateTechString(m, applicableMediaEn[idx], 'zh');
                        } else {
                          translated = translateTechString(m, applicableMediaEn[idx], 'th');
                        }

                        return (
                          <div
                            key={idx}
                            className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-mono flex items-center gap-1.5"
                          >
                            <span className="text-slate-400">{m} ➔</span>
                            <span className="text-amber-300 font-bold">{translated}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Field 4: Mechanical Design Features Proposal */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 font-mono flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        <span>4. Đặc Tính Thiết Kế Cơ Khí (Mechanical Highlights):</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {highlightFeatures.length} đặc tính cơ khí
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {highlightFeatures.map((f, idx) => {
                        let translated = '';
                        if (transPreviewTab === 'en') {
                          translated = highlightFeaturesEn[idx] || translateTechString(f, undefined, 'en');
                        } else if (transPreviewTab === 'zh') {
                          translated = translateTechString(f, highlightFeaturesEn[idx], 'zh');
                        } else {
                          translated = translateTechString(f, highlightFeaturesEn[idx], 'th');
                        }

                        return (
                          <div
                            key={idx}
                            className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2"
                          >
                            <div className="text-slate-300">
                              <span className="text-amber-400 font-bold mr-1.5">• #{idx + 1}</span>
                              <span>{f}</span>
                            </div>
                            <div className="text-indigo-200 font-medium">
                              <span className="text-slate-400 mr-1.5 font-mono">➔</span>
                              <span>{translated}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Permanent Lock Notice */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-slate-300 text-[11px] leading-relaxed">
                      {lang === 'vi' 
                        ? '💡 Bản dịch sau khi admin duyệt và khóa lại sẽ được lưu vĩnh viễn vào sản phẩm. Khi khách quốc tế đổi ngôn ngữ, hệ thống hiển thị ngay lập tức không cần chờ đợi.'
                        : '💡 Once approved and locked, translations are permanently stored with the product for immediate international viewing.'}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-400 font-bold">
                    {isTranslationsLocked ? 'STATUS: LOCKED & CERTIFIED ✓' : 'STATUS: LIVE SYNC ACTIVE'}
                  </div>
                </div>
              </div>

              {/* Card 5: BỘ ĐẶC TÍNH KỸ THUẬT VẬN HÀNH (AI CHARACTERISTICS) */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-4 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-amber-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {lang === 'vi' ? '5. Bộ Đặc Tính Kỹ Thuật & Vận Hành Chuyên Sâu (Ô Kẻ Khoa Học)' : '5. Valve Technical Operational Characteristics'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAiAutoSynthesizeCharacteristics}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-[11px] flex items-center gap-1.5 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? '⚡ Tự Động Tổng Hợp' : '⚡ Auto-Synthesize'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustomAttribute}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? '+ Thêm Đặc Tính' : '+ Add Attribute'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  {/* 1. Lifecycle */}
                  <div className="border border-slate-700/80 bg-slate-900/70 p-3.5 rounded-xl space-y-2 hover:border-amber-400/50 transition-colors shadow-sm">
                    <label className="block text-amber-400 font-bold text-[11px] uppercase font-mono">
                      ⏱️ {lang === 'vi' ? 'Tuổi Thọ & Chu Trình Đóng Mở (Lifecycle):' : 'Lifecycle & Cycles:'}
                    </label>
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Tiếng Việt:</span>
                        <input
                          type="text"
                          value={lifecycle}
                          onChange={(e) => setLifecycle(e.target.value)}
                          placeholder="VD: 500,000 chu trình • 15-20 năm"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">English:</span>
                        <input
                          type="text"
                          value={lifecycleEn}
                          onChange={(e) => setLifecycleEn(e.target.value)}
                          placeholder="English: 500,000 cycles • 15-20 years design life"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 text-[11px] focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Temperature Limits */}
                  <div className="border border-slate-700/80 bg-slate-900/70 p-3.5 rounded-xl space-y-2 hover:border-red-400/50 transition-colors shadow-sm">
                    <label className="block text-red-400 font-bold text-[11px] uppercase font-mono">
                      🌡️ {lang === 'vi' ? 'Giới Hạn Nhiệt Độ Hoạt Động (Temp Range):' : 'Operating Temperature Range:'}
                    </label>
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Tiếng Việt:</span>
                        <input
                          type="text"
                          value={tempLimits}
                          onChange={(e) => setTempLimits(e.target.value)}
                          placeholder="VD: -20°C đến +350°C (theo gioăng)"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">English:</span>
                        <input
                          type="text"
                          value={tempLimitsEn}
                          onChange={(e) => setTempLimitsEn(e.target.value)}
                          placeholder="English: -20°C to +350°C"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 text-[11px] focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Sealing Integrity */}
                  <div className="border border-slate-700/80 bg-slate-900/70 p-3.5 rounded-xl space-y-2 hover:border-emerald-400/50 transition-colors shadow-sm">
                    <label className="block text-emerald-400 font-bold text-[11px] uppercase font-mono">
                      🛡️ {lang === 'vi' ? 'Cấp Độ Kín & Chống Rò Rỉ (Sealing Integrity):' : 'Sealing Integrity & Leak Rate:'}
                    </label>
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Tiếng Việt:</span>
                        <input
                          type="text"
                          value={sealIntegrity}
                          onChange={(e) => setSealIntegrity(e.target.value)}
                          placeholder="VD: ISO 5208 Rate A Bubble-Tight / Zero Leakage"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">English:</span>
                        <input
                          type="text"
                          value={sealIntegrityEn}
                          onChange={(e) => setSealIntegrityEn(e.target.value)}
                          placeholder="English: ISO 5208 Rate A Bubble-Tight"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 text-[11px] focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Media Applications */}
                  <div className="border border-slate-700/80 bg-slate-900/70 p-3.5 rounded-xl space-y-2 hover:border-blue-400/50 transition-colors shadow-sm">
                    <label className="block text-blue-400 font-bold text-[11px] uppercase font-mono">
                      💧 {lang === 'vi' ? 'Môi Chất Khuyến Nghị (Applicable Fluids):' : 'Applicable Fluids & Media:'}
                    </label>
                    <div className="space-y-1.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">Tiếng Việt:</span>
                        <input
                          type="text"
                          value={mediaApplications}
                          onChange={(e) => setMediaApplications(e.target.value)}
                          placeholder="VD: Nước sạch, Nước lạnh Chiller, Khí nén"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-0.5">English:</span>
                        <input
                          type="text"
                          value={mediaApplicationsEn}
                          onChange={(e) => setMediaApplicationsEn(e.target.value)}
                          placeholder="English: Potable water, Chilled water, Compressed air"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-400 text-[11px] focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Summary Notes */}
                  <div className="col-span-full border border-slate-700/80 bg-slate-900/70 p-3.5 rounded-xl space-y-1.5 hover:border-amber-400/50 transition-colors shadow-sm">
                    <label className="block text-slate-200 font-bold text-[11px] uppercase font-mono">
                      🤖 {lang === 'vi' ? 'Nhận Định & Khuyến Cáo Kỹ Thuật Chuyên Gia:' : 'Engineering Expert Assessment:'}
                    </label>
                    <textarea
                      rows={2}
                      value={aiSummaryNotes}
                      onChange={(e) => setAiSummaryNotes(e.target.value)}
                      placeholder="Nhận định chuyên sâu ưu điểm cơ khí..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-400 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Custom Attributes List */}
                {customAttributes && customAttributes.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      {lang === 'vi' ? 'Đặc Tính Tùy Biến Thêm Mới:' : 'Custom Technical Attributes:'}
                    </span>
                    <div className="space-y-2">
                      {customAttributes.map((attr, idx) => (
                        <div key={attr.id || idx} className="grid grid-cols-12 gap-2.5 bg-slate-900 p-2.5 rounded-xl border border-slate-700 items-center">
                          <input
                            type="text"
                            value={attr.key}
                            onChange={(e) => handleUpdateCustomAttribute(idx, 'key', e.target.value)}
                            placeholder="Tên tiêu chí (VD: Kháng ăn mòn)"
                            className="col-span-4 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => handleUpdateCustomAttribute(idx, 'value', e.target.value)}
                            placeholder="Giá trị tiêu chuẩn"
                            className="col-span-7 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomAttribute(idx)}
                            className="col-span-1 p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition-colors flex justify-center"
                            title="Xóa tiêu chí này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card 6: BẢNG KÍCH THƯỚC ĐƯỜNG ỐNG & LƯU LƯỢNG Kvs/Cv (BẢN KẺ Ô DÀN ĐỀU 100%) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3.5 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide font-mono">
                      {lang === 'vi' ? `6. Bảng Kích Thước Đường Ống & Lưu Lượng Kvs / Cv (${specs.length} Sizes Model)` : `6. Dimensional Specs & Flow Table (${specs.length} Sizes)`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <input
                      ref={specsFileInputRef}
                      type="file"
                      accept=".csv,.json,.txt"
                      onChange={handleUploadSpecsFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => specsFileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow"
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      <span>Upload File (CSV/JSON)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadCsvTemplate}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tải File Mẫu</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-bold flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm Size</span>
                    </button>
                  </div>
                </div>

                {specsFileMessage && (
                  <div className="bg-emerald-950 border border-emerald-500/80 text-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{specsFileMessage}</span>
                  </div>
                )}

                {/* Full Grid Table With Explicit Cell Borders and Non-overlapping Inputs */}
                <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 shadow-inner max-h-72 overflow-y-auto">
                  <table className="w-full text-xs text-left border-collapse border border-slate-700 divide-x divide-y divide-slate-700">
                    <thead className="bg-slate-800 text-slate-200 sticky top-0 z-10 font-mono text-[11px] uppercase tracking-wider">
                      <tr className="divide-x divide-slate-700">
                        <th className="py-2.5 px-2 text-center w-12 bg-slate-800">STT</th>
                        <th className="py-2.5 px-3 font-bold text-center min-w-[110px] bg-slate-800 text-amber-300">Size DN</th>
                        <th className="py-2.5 px-2 text-center min-w-[85px] bg-slate-800">Áp PN</th>
                        <th className="py-2.5 px-2 text-center min-w-[95px] bg-slate-800">Dài L (mm)</th>
                        <th className="py-2.5 px-2 text-center min-w-[95px] bg-slate-800">Cao H (mm)</th>
                        <th className="py-2.5 px-2 text-center min-w-[90px] bg-slate-800">Kg (Nặng)</th>
                        <th className="py-2.5 px-2 text-center min-w-[105px] bg-slate-800 text-emerald-400 font-bold">Kvs (m³/h)</th>
                        <th className="py-2.5 px-2 text-center min-w-[105px] bg-slate-800 text-blue-400 font-bold">Cv (GPM)</th>
                        <th className="py-2.5 px-2 text-center min-w-[80px] bg-slate-800">Số Lỗ Bích</th>
                        <th className="py-2.5 px-2 text-center w-16 bg-slate-800">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 font-mono text-xs bg-slate-950">
                      {specs.map((row, idx) => (
                        <tr key={idx} className="divide-x divide-slate-700 hover:bg-blue-950/30 transition-colors">
                          <td className="py-2 px-2 text-center text-slate-400 font-bold bg-slate-900/50">
                            #{idx + 1}
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.dn}
                              onChange={(e) => handleUpdateSpecField(idx, 'dn', e.target.value)}
                              className="w-full bg-slate-900 text-amber-300 font-bold border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-amber-400 focus:outline-none"
                              placeholder="DN50"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="text"
                              value={row.pn}
                              onChange={(e) => handleUpdateSpecField(idx, 'pn', e.target.value)}
                              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-amber-400 focus:outline-none"
                              placeholder="PN16"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="number"
                              value={row.faceToFace}
                              onChange={(e) => handleUpdateSpecField(idx, 'faceToFace', Number(e.target.value))}
                              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-amber-400 focus:outline-none"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="number"
                              value={row.height}
                              onChange={(e) => handleUpdateSpecField(idx, 'height', Number(e.target.value))}
                              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-amber-400 focus:outline-none"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="number"
                              value={row.weightKg}
                              onChange={(e) => handleUpdateSpecField(idx, 'weightKg', Number(e.target.value))}
                              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-amber-400 focus:outline-none"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="number"
                              value={row.kvFlow}
                              onChange={(e) => {
                                const kv = Number(e.target.value);
                                handleUpdateSpecField(idx, 'kvFlow', kv);
                                handleUpdateSpecField(idx, 'cvFlow', Math.round(kv * 1.156));
                              }}
                              className="w-full bg-slate-900 text-emerald-400 font-bold border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-emerald-400 focus:outline-none"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="number"
                              value={row.cvFlow || Math.round(row.kvFlow * 1.156)}
                              onChange={(e) => handleUpdateSpecField(idx, 'cvFlow', Number(e.target.value))}
                              className="w-full bg-slate-900 text-blue-400 font-bold border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-blue-400 focus:outline-none"
                            />
                          </td>
                          <td className="p-1.5">
                            <input
                              type="number"
                              value={row.flangeHoles}
                              onChange={(e) => handleUpdateSpecField(idx, 'flangeHoles', Number(e.target.value))}
                              className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 text-center text-xs focus:border-amber-400 focus:outline-none"
                            />
                          </td>
                          <td className="p-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecRow(idx)}
                              className="p-1 rounded bg-red-950/80 text-red-400 hover:text-red-300 hover:bg-red-900 transition-colors"
                              title="Xóa model size này"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          ) : adminStudioTab === 'projects_timeline' ? (
            /* Tab 2: Interactive Drag & Drop Timeline Reordering & Batch CSV Upload */
            <div className="space-y-6 animate-fade-in">
              {/* Top Banner & Batch Action Controls */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950/40 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 font-bold">
                    <ArrowUpDown className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {lang === 'vi' ? 'Quản Lý Thứ Tự Dòng Thời Gian Dự Án (Drag & Drop) & Cập Nhật CSV' : (lang === 'zh' ? '工程时间轴拖拽排序与批量CSV元数据管理' : 'Timeline Drag-and-Drop Reorder & Batch CSV Manager')}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'vi' 
                        ? `Kéo thả thẻ dự án để đổi vị trí hiển thị trên dòng thời gian (${timelineProjects.length} dự án) • Hỗ trợ cập nhật hàng loạt metadata qua CSV/Storage`
                        : `Drag and drop cards to reorder interactive timeline (${timelineProjects.length} projects) • Batch CSV metadata updates supported`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    ref={batchCsvFileInputRef}
                    type="file"
                    accept=".csv,.json,.txt"
                    onChange={handleUploadProjectsBatchCsv}
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={() => batchCsvFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/30 transition-all"
                    title="Upload file CSV để thêm hoặc cập nhật hàng loạt metadata dự án"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>{lang === 'vi' ? 'Upload CSV Hàng Loạt' : 'Upload Batch CSV'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportProjectsCsv}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Xuất file CSV chứa toàn bộ dự án hiện tại"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'vi' ? 'Xuất CSV Dự Án' : 'Export CSV'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadProjectsTemplateCsv}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Tải cấu trúc file CSV mẫu"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'vi' ? 'Tải Mẫu CSV' : 'CSV Template'}</span>
                  </button>
                </div>
              </div>

              {batchCsvMessage && (
                <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{batchCsvMessage}</span>
                </div>
              )}

              {/* Drag and Drop Project Cards List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
                  <span>DANH SÁCH THỨ TỰ TRÊN TIMELINE (KÉO TAY CẦM HOẶC BẤM MŨI TÊN):</span>
                  <span>Tổng số: {timelineProjects.length} công trình</span>
                </div>

                <div className="space-y-2.5">
                  {timelineProjects.map((proj, idx) => {
                    const isDragging = draggedProjectIndex === idx;
                    const isOver = dragOverProjectIndex === idx;

                    return (
                      <div
                        key={proj.id}
                        draggable={true}
                        onDragStart={(e) => handleProjectDragStart(e, idx)}
                        onDragOver={(e) => handleProjectDragOver(e, idx)}
                        onDragLeave={handleProjectDragLeave}
                        onDrop={(e) => handleProjectDrop(e, idx)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 ${
                          isDragging
                            ? 'opacity-40 border-amber-500 border-dashed bg-amber-950/20 scale-[0.99]'
                            : isOver
                              ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/50 scale-[1.01]'
                              : 'bg-slate-950/90 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Drag Handle & Position Badge */}
                        <div className="flex items-center gap-3">
                          <div 
                            className="cursor-grab active:cursor-grabbing p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                            title="Kéo thả để đổi thứ tự"
                          >
                            <GripVertical className="w-5 h-5" />
                          </div>

                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 font-mono font-black text-amber-400 text-xs">
                            #{idx + 1}
                          </div>

                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700/60">
                            {proj.year}
                          </span>

                          <div className="space-y-0.5">
                            <h4 className="text-xs font-extrabold text-white line-clamp-1">
                              {proj.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              🏢 {proj.clientInvestor} • 📍 {proj.location} • 💰 <span className="text-emerald-400 font-mono font-semibold">{proj.contractValueVnd}</span>
                            </p>
                          </div>
                        </div>

                        {/* Reorder Buttons & Brands */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="hidden sm:flex items-center gap-1">
                            {(proj.brandsUsed || []).slice(0, 2).map((b, bi) => (
                              <span key={bi} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-300">
                                {b}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveProjectStep(idx, 'up')}
                              disabled={idx === 0}
                              className={`p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 transition-colors ${
                                idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 hover:text-amber-400'
                              }`}
                              title="Di chuyển lên trên 1 vị trí"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveProjectStep(idx, 'down')}
                              disabled={idx === timelineProjects.length - 1}
                              className={`p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 transition-colors ${
                                idx === timelineProjects.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-800 hover:text-amber-400'
                              }`}
                              title="Di chuyển xuống dưới 1 vị trí"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 italic">
                    * Mọi thay đổi thứ tự khi kéo thả được tự động lưu trữ và đồng bộ tức thì vào bộ nhớ website.
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onReorderProjects) {
                        onReorderProjects(timelineProjects);
                        setBatchCsvMessage(lang === 'vi' ? '✓ Đã lưu toàn bộ thứ tự mới của các dự án vào cơ sở dữ liệu!' : '✓ Saved new timeline project order successfully!');
                        setTimeout(() => setBatchCsvMessage(null), 3000);
                      }
                    }}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === 'vi' ? 'Lưu Thứ Tự Timeline' : 'Save Timeline Order'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : adminStudioTab === 'seo_audit' ? (
            /* SEO Audit Tool View */
            <div className="space-y-6">
              {/* Notification Banner when SEO is optimized or translated */}
              {seoOptimizedNotice && (
                <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 px-4 py-2.5 rounded-xl text-xs font-semibold animate-fade-in flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{seoOptimizedNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSeoOptimizedNotice(null)}
                    className="text-emerald-400 hover:text-white text-xs font-mono"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Top SEO Health Score Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950/40 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black border shadow-lg ${
                    currentSeoAudit.seoScore >= 80 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60 shadow-emerald-500/10'
                      : (currentSeoAudit.seoScore >= 60 
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-amber-500/10'
                          : 'bg-red-500/20 text-red-400 border-red-500/60 shadow-red-500/10')
                  }`}>
                    <span className="text-2xl font-mono leading-none">{currentSeoAudit.seoScore}</span>
                    <span className="text-[10px] uppercase font-mono mt-0.5">/100 Điểm</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">
                        {lang === 'vi' ? 'Đánh Giá Sức Khỏe SEO & Từ Khóa Kỹ Thuật' : 'Technical SEO & Keyword Audit'}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                        currentSeoAudit.seoScore >= 80 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}>
                        {currentSeoAudit.status === 'excellent' ? 'Xuất Sắc (Ready for Top SERP)' : (currentSeoAudit.status === 'good' ? 'Tốt (Good Reach)' : 'Cần Tối Ưu Thêm')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'vi' 
                        ? `Phân tích tìm kiếm theo mục đích người mua: "${currentSeoAudit.searchIntent}"` 
                        : `Targeted search intent: "${currentSeoAudit.searchIntent}"`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleTranslateSeoToEnglish}
                    className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-900/30 active:scale-95 transition-all"
                    title="Tự động dịch tiêu đề, mô tả và từ khóa kỹ thuật sang tiếng Anh"
                  >
                    <Languages className="w-4 h-4 text-amber-300" />
                    <span>{lang === 'vi' ? '⚡ Tự Động Dịch Sang EN' : '⚡ Auto-Translate to EN'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyAiSeoOptimization}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{lang === 'vi' ? '⚡ 1-Click: Tự Động Tối Ưu Toàn Diện' : '⚡ 1-Click: Auto-Optimize All'}</span>
                  </button>
                </div>
              </div>

              {/* Google SERP Search Snippet Preview with Bilingual Switcher */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-400" />
                    {lang === 'vi' ? 'Mô Phỏng Hiển Thị Trên Google Tìm Kiếm (SERP Preview):' : 'Google Search Snippet Preview:'}
                  </span>

                  {/* Bilingual SERP Toggle */}
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSerpPreviewMode('vi')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        serpPreviewMode === 'vi'
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🇻🇳 SERP Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => setSerpPreviewMode('en')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        serpPreviewMode === 'en'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🇬🇧 SERP International (English)
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl text-left font-sans shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 text-[11px] text-[#202124] mb-1">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">U</span>
                    <span className="font-semibold text-slate-800">Industracorp UTD Valves</span>
                    <span className="text-slate-400">›</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {serpPreviewMode === 'vi' 
                        ? `https://industracorp.com/valves/${code.toLowerCase()}` 
                        : `https://industracorp.com/en/valves/${code.toLowerCase()}`}
                    </span>
                  </div>
                  <h4 className="text-base text-[#1a0dab] font-medium hover:underline cursor-pointer leading-tight mb-1">
                    {serpPreviewMode === 'vi' 
                      ? (metaTitle || currentSeoAudit.recommendedTitleVi) 
                      : (metaTitleEn || currentSeoAudit.recommendedTitleEn)}
                  </h4>
                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {serpPreviewMode === 'vi' 
                      ? (metaDescription || description || currentSeoAudit.recommendedDescriptionVi) 
                      : (metaDescriptionEn || descriptionEn || currentSeoAudit.recommendedDescriptionEn)}
                  </p>
                </div>
              </div>

              {/* SEO Checklist & Issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {lang === 'vi' ? 'Danh Sách Kiểm Tra & Khuyến Nghị Kỹ Thuật:' : 'SEO Audit Inspection Checklist:'}
                  </span>

                  <div className="space-y-2.5">
                    {currentSeoAudit.issues.map((issue, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          issue.type === 'critical'
                            ? 'bg-red-950/40 border-red-800/60 text-red-200'
                            : (issue.type === 'warning'
                                ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200')
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{issue.type === 'critical' ? '🔴 Cần Khắc Phục' : (issue.type === 'warning' ? '🟡 Chú Ý' : '🟢 Đạt Chuẩn')}</span>
                          <span className="text-[10px] font-mono uppercase text-slate-400">{issue.field}</span>
                        </div>
                        <p className="text-[11px]">{lang === 'vi' ? issue.messageVi : issue.messageEn}</p>
                        <p className="text-[10px] text-slate-300 italic">💡 {lang === 'vi' ? issue.recommendationVi : issue.recommendationEn}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Keywords Tags Manager (Dual Vietnamese & English) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wide font-mono flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" />
                      {lang === 'vi' ? 'Quản Lý Từ Khóa Mục Tiêu (Target Keywords):' : 'Target Keywords Manager:'}
                    </span>
                    <button
                      type="button"
                      onClick={handleTranslateSeoToEnglish}
                      className="text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700/60 flex items-center gap-1 transition-colors"
                      title="Dịch toàn bộ từ khóa tiếng Việt sang từ khóa kỹ thuật tiếng Anh"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      <span>{lang === 'vi' ? 'Dịch từ khóa sang EN' : 'Sync keywords to EN'}</span>
                    </button>
                  </div>

                  {/* 1. Vietnamese Target Keywords */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <span>🇻🇳 Từ Khóa Mục Tiêu Tiếng Việt:</span>
                      <span className="text-[10px] text-slate-500 font-mono">({targetKeywords.length} từ khóa)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTargetKeyword();
                          }
                        }}
                        placeholder={lang === 'vi' ? 'Nhập từ khóa VI và bấm Thêm (e.g. van bướm inox, van chịu nhiệt 300 độ...)' : 'Enter VI technical keyword...'}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTargetKeyword}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs"
                      >
                        {lang === 'vi' ? 'Thêm' : 'Add'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[44px] p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                      {targetKeywords.length > 0 ? (
                        targetKeywords.map((kw, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 text-[11px]">
                            <span>#{kw}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTargetKeyword(kw)}
                              className="hover:text-red-400 text-slate-400 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-xs italic p-1">
                          {lang === 'vi' ? 'Chưa có từ khóa VI. Bấm nút Tự Động Tối Ưu để nạp.' : 'No VI keywords added.'}
                        </span>
                      )}
                    </div>

                    {/* Quick Suggestions for Vietnamese */}
                    {currentSeoAudit.recommendedKeywords.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">Gợi ý AI:</span>
                        {currentSeoAudit.recommendedKeywords.slice(0, 4).map((kw, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!targetKeywords.includes(kw)) {
                                setTargetKeywords(prev => [...prev, kw]);
                              }
                            }}
                            className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono flex items-center gap-0.5"
                          >
                            <span>+ {kw}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. English Technical Keywords */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <label className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <span>🇬🇧 English Technical Keywords (Chuẩn Quốc Tế):</span>
                      <span className="text-[10px] text-slate-500 font-mono">({targetKeywordsEn.length} keywords)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={keywordInputEn}
                        onChange={(e) => setKeywordInputEn(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTargetKeywordEn();
                          }
                        }}
                        placeholder="Enter EN keyword (e.g. SS316 Butterfly Valve, High Temp Steam Valve...)"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-indigo-200 focus:border-indigo-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddTargetKeywordEn}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs"
                      >
                        + Add EN
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[44px] p-2 bg-slate-900/60 rounded-lg border border-slate-800">
                      {targetKeywordsEn.length > 0 ? (
                        targetKeywordsEn.map((kw, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-[11px]">
                            <span>#{kw}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTargetKeywordEn(kw)}
                              className="hover:text-red-400 text-slate-400 ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-xs italic p-1">
                          {lang === 'vi' ? 'Bấm "Dịch từ khóa sang EN" để tự động sinh từ khóa tiếng Anh.' : 'No EN keywords configured yet.'}
                        </span>
                      )}
                    </div>

                    {/* Quick Suggestions for English */}
                    {currentSeoAudit.recommendedKeywordsEn.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">AI Suggestions:</span>
                        {currentSeoAudit.recommendedKeywordsEn.slice(0, 4).map((kw, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (!targetKeywordsEn.includes(kw)) {
                                setTargetKeywordsEn(prev => [...prev, kw]);
                              }
                            }}
                            className="text-[10px] bg-slate-900 hover:bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700/50 font-mono flex items-center gap-0.5"
                          >
                            <span>+ {kw}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Manual Editable Bilingual Meta Title & Meta Description */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 uppercase font-mono">
                        {lang === 'vi' ? 'Tùy Chỉnh Meta Title & Meta Description (VI / EN):' : 'Custom Meta Title & Description (VI / EN):'}
                      </span>
                      <label className="flex items-center gap-1 cursor-pointer text-amber-400 font-mono text-[10px]">
                        <input
                          type="checkbox"
                          checked={isAutoTranslateSeo}
                          onChange={(e) => setIsAutoTranslateSeo(e.target.checked)}
                          className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                        />
                        <span>Tự động dịch sang EN khi gõ</span>
                      </label>
                    </div>

                    {/* 1. Meta Titles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-300">
                            Meta Title (Tiếng Việt):
                          </label>
                          <span className={`text-[10px] font-mono ${
                            (metaTitle || '').length > 65 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {(metaTitle || '').length}/60 ký tự
                          </span>
                        </div>
                        <input
                          type="text"
                          value={metaTitle}
                          onChange={(e) => handleMetaTitleChange(e.target.value)}
                          placeholder={currentSeoAudit.recommendedTitleVi}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-indigo-300">
                            Meta Title (English Export):
                          </label>
                          <span className={`text-[10px] font-mono ${
                            (metaTitleEn || '').length > 65 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {(metaTitleEn || '').length}/60 chars
                          </span>
                        </div>
                        <input
                          type="text"
                          value={metaTitleEn}
                          onChange={(e) => setMetaTitleEn(e.target.value)}
                          placeholder={currentSeoAudit.recommendedTitleEn}
                          className="w-full bg-slate-900 border border-indigo-700/60 rounded-lg px-2.5 py-1.5 text-indigo-200 text-xs focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 2. Meta Descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-300">
                            Meta Description (Tiếng Việt):
                          </label>
                          <span className={`text-[10px] font-mono ${
                            (metaDescription || '').length > 165 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {(metaDescription || '').length}/160 ký tự
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={metaDescription}
                          onChange={(e) => handleMetaDescriptionChange(e.target.value)}
                          placeholder={currentSeoAudit.recommendedDescriptionVi}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:border-amber-400 focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-indigo-300">
                            Meta Description (English Export):
                          </label>
                          <span className={`text-[10px] font-mono ${
                            (metaDescriptionEn || '').length > 165 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {(metaDescriptionEn || '').length}/160 chars
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={metaDescriptionEn}
                          onChange={(e) => setMetaDescriptionEn(e.target.value)}
                          placeholder={currentSeoAudit.recommendedDescriptionEn}
                          className="w-full bg-slate-900 border border-indigo-700/60 rounded-lg px-2.5 py-1.5 text-indigo-200 text-xs focus:border-indigo-400 focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 4: AUTOMATED HIGH-DEMAND VALVE ALERT SYSTEM (PICV & HP BUTTERFLY) */
            <div className="space-y-6 animate-fade-in">
              {/* Top Overview & Real-Time Intelligence Banner */}
              <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/50 p-5 rounded-2xl border-2 border-red-500/50 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-900/50 shrink-0">
                      <Flame className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold bg-red-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          REAL-TIME TELEMETRY ALERT ENGINE
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                          ● GIÁM SÁT TRUY VẤN TỰ ĐỘNG
                        </span>
                      </div>
                      <h3 className="text-base font-black text-white mt-1">
                        {lang === 'vi' 
                          ? 'HỆ THỐNG TỰ ĐỘNG CẢNH BÁO NHU CẦU VAN CAO (HIGH-DEMAND VALVE ALERT)' 
                          : 'AUTOMATED HIGH-DEMAND VALVE ALERT SYSTEM'}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                        {lang === 'vi' 
                          ? 'Tự động theo dõi các model van kỹ thuật cao (như Van cân bằng động PICV & Van bướm Triple-Offset chịu nhiệt cao) khi có tần suất truy vấn đột biến từ nhà thầu MEP/PCCC, giúp Quản trị viên nhanh chóng ghim ưu tiên hiển thị đầu danh mục (Catalog Prioritization) và sẵn sàng tồn kho.'
                          : 'Monitors real-time query surges for high-spec valve models (such as PICV balancing and High-Performance Triple Offset Butterfly valves), alerting admins to prioritize catalog placement.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleResetAlerts}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer"
                      title="Làm mới dữ liệu cảnh báo về trạng thái ban đầu"
                    >
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'vi' ? 'Làm Mới Cảnh Báo' : 'Reset Alerts'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleAdminOverrideMode}
                      className={`px-3.5 py-2 rounded-xl font-mono text-xs font-black flex items-center gap-1.5 transition-all shadow cursor-pointer ${
                        isOverrideModeActive
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                      }`}
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{isOverrideModeActive ? 'OVERRIDE: BẬT' : 'Bật Admin Override'}</span>
                    </button>
                  </div>
                </div>

                {/* Demand Overview Metric Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-red-500/20">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Tổng Cảnh Báo Nhu Cầu:</span>
                    <span className="text-base font-black text-amber-400 font-mono">
                      {demandAlerts.length} Dòng Sản Phẩm
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Cảnh Báo Đang Chờ Xử Lý:</span>
                    <span className="text-base font-black text-red-400 font-mono">
                      {demandAlerts.filter(a => a.status === 'active').length} Khẩn Cấp (Active)
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Đã Ghim Đầu Danh Mục:</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {demandAlerts.filter(a => a.isCatalogPrioritized).length} Model Ghim VIP
                    </span>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Tốc Độ Tăng Trưởng Max:</span>
                    <span className="text-base font-black text-indigo-400 font-mono">
                      +178% (PICV HVAC)
                    </span>
                  </div>
                </div>
              </div>

              {/* High Demand Valve Cards List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-white text-xs uppercase font-mono flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'vi' ? 'DANH SÁCH MODEL VAN ĐANG CÓ LƯỢNG TRUY VẤN ĐỘT BIẾN:' : 'HIGH-DEMAND SURGING MODELS:'}</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Tự động nhận diện từ khóa "picv", "cân bằng", "bướm hiệu năng cao", "triple offset"
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {demandAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                        alert.isCatalogPrioritized
                          ? 'bg-emerald-950/30 border-emerald-500/70 shadow-emerald-950/20'
                          : alert.urgency === 'critical'
                            ? 'bg-red-950/40 border-red-500/80 shadow-red-950/30 ring-2 ring-red-500/20'
                            : 'bg-amber-950/40 border-amber-500/80 shadow-amber-950/30'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top Card Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                                alert.isCatalogPrioritized
                                  ? 'bg-emerald-500 text-slate-950'
                                  : alert.urgency === 'critical'
                                    ? 'bg-red-600 text-white animate-pulse'
                                    : 'bg-amber-500 text-slate-950'
                              }`}>
                                {alert.isCatalogPrioritized 
                                  ? '★ ĐÃ GHIM ĐẦU DANH MỤC' 
                                  : (alert.urgency === 'critical' ? '🔴 CRITICAL SURGE' : '🟡 HIGH DEMAND')}
                              </span>
                              <span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-bold">
                                {alert.trendingRate} TUẦN NÀY
                              </span>
                            </div>

                            <h5 className="text-sm font-black text-white mt-1.5 flex items-center gap-1.5">
                              <span>{lang === 'vi' ? alert.valveNameVi : alert.valveNameEn}</span>
                            </h5>
                            <span className="text-xs font-mono font-bold text-amber-300">
                              Mã Model: {alert.valveCode}
                            </span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xl font-black font-mono text-white block">
                              {alert.queryCount}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block uppercase">
                              Lượt Tra Cứu/24h
                            </span>
                          </div>
                        </div>

                        {/* Reason & Description */}
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          {lang === 'vi' ? alert.descriptionVi : alert.descriptionEn}
                        </p>

                        {/* Search Terms Tracked */}
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                            {lang === 'vi' ? 'Từ khóa kỹ thuật kích hoạt cảnh báo:' : 'Triggered search keywords:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {alert.searchTerms.map((term, tIdx) => (
                              <span 
                                key={tIdx}
                                className="text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-md"
                              >
                                #{term}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Controls */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePrioritizeAlertValve(alert.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-black font-mono uppercase tracking-wide flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg ${
                              alert.isCatalogPrioritized
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                            <span>
                              {alert.isCatalogPrioritized 
                                ? (lang === 'vi' ? '✓ Đã Ghim Vị Trí VIP' : '✓ Pinned at Top') 
                                : (lang === 'vi' ? '⚡ Ghim Lên Đầu Catalogue' : '⚡ Prioritize in Catalog')}
                            </span>
                          </button>

                          {alert.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => handleDismissAlert(alert.id)}
                              className="px-2.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                              title="Ẩn cảnh báo này"
                            >
                              Bỏ qua
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(alert.lastTriggered).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Architecture Info Card */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  {lang === 'vi'
                    ? 'Cơ chế hoạt động: Khi người dùng tìm kiếm trên thanh công cụ hoặc tra cứu thông số van PICV / Van Bướm Triple-Offset trong Catalogue, hệ thống tự động lưu telemetry và gửi tín hiệu ưu tiên lên AdminStudio. Khi admin bấm "Ghim Lên Đầu Catalogue", sản phẩm sẽ được gán huy hiệu "★ Ưu Tiên Nhu Cầu Cao" và đẩy lên đầu tiên trong danh mục.'
                    : 'How it works: When engineers query PICV or Triple Offset Butterfly valves, search telemetry logs real-time spikes and triggers AdminStudio alerts. Pinning the product automatically elevates it to the top position in the catalog with a VIP badge.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div>
            {!isCreateNew && onDeleteProduct && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Sản Phẩm Này</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isCreateNew ? 'Tạo Sản Phẩm Mới' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
