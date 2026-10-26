export type SupportedLanguage = 'vi' | 'en' | 'th' | 'zh' | 'pt' | 'ar';

export type ValveCategory = 
  | 'knife_gate'
  | 'ball'
  | 'check'
  | 'instrument'
  | 'strainer'
  | 'solenoid'
  | 'resilient_gate'
  | 'foot_valve'
  | 'gate'
  | 'water_control'
  | 'auto_air_vent'
  | 'actuator'
  | 'flexible_joint'
  | 'globe'
  | 'rubber_joint'
  | 'expansion_joint'
  | 'prv'
  | 'balancing'
  | 'butterfly'
  | 'safety_valve';

export type SystemGroup = 
  | 'all'
  | 'firefighting'
  | 'hvac'
  | 'water'
  | 'oilgas'
  | 'steam'
  | 'gas_cryogenic'
  | 'instrument';

export type MaterialType = 'all' | 'ss304_316' | 'ductile_iron' | 'cast_steel' | 'bronze' | 'special_alloy';

export type PressureRating = 'all' | 'pn10' | 'pn16' | 'pn25' | 'pn40' | 'ansi150' | 'ansi300' | 'ansi600';

export type UserRole = 'guest' | 'engineer' | 'contractor' | 'admin';

export interface ValveDimensionSpec {
  dn: string; // e.g., "DN50 (2\")"
  pn: string; // e.g., "PN16 / PN25"
  faceToFace: number; // mm
  height: number; // mm
  weightKg: number; // kg
  kvFlow: number; // m3/h (Kvs)
  cvFlow?: number; // US GPM (Cv = Kv * 1.156)
  flangeHoles: number;
}

export interface CategoryItem {
  value: string;
  label: string;
  labelEn: string;
  systemGroup?: SystemGroup;
  description?: string;
  isCustom?: boolean;
}

export interface EquivalentBrand {
  brand: string; // e.g. "Johnson Controls", "Spirax Sarco", "Bray", "Danfoss", "Tyco", "JMV-Korea", "Shield Valve UK", "VYC-Spain"
  modelCode: string; // e.g. "VG7000 Series", "DP27", "Series 30/31"
  comparisonNote: string;
}

export interface CustomCharacteristic {
  id?: string;
  key: string;
  keyEn?: string;
  value: string;
  valueEn?: string;
}

export interface ValveCharacteristics {
  lifecycle: string; // Tuổi thọ (ví dụ: 1,000,000 chu trình / 15-20 năm)
  lifecycleEn?: string;
  tempLimits: string; // Giới hạn nhiệt độ (ví dụ: -20°C đến +350°C)
  tempLimitsEn?: string;
  sealIntegrity: string; // Cấp độ kín (ví dụ: ISO 5208 Rate A Bubble-Tight / Zero Leakage)
  sealIntegrityEn?: string;
  mediaApplications: string; // Ứng dụng môi chất (ví dụ: Nước, Hơi nóng, Hóa chất ăn mòn, Gas)
  mediaApplicationsEn?: string;
  aiSummaryNotes?: string; // Phân tích & khuyến cáo kỹ thuật do AI tổng hợp
  aiSummaryNotesEn?: string;
  customAttributes?: CustomCharacteristic[]; // Admin tự do thêm/xóa đặc tính bổ sung
}

export interface ValveImageVariants {
  thumbnail: string; // WebP thumbnail ~180px
  medium: string;    // WebP display ~640px
  high: string;      // WebP high-resolution ~1280px
}

export interface ValveProduct {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  brand?: string; // "UTD" | "JMV-Korea" | "Johnson Controls" | "Tyco" | "Shield Valve UK" | "VYC-Spain"
  category: ValveCategory;
  categoryLabel: string;
  categoryLabelEn: string;
  systemGroup: SystemGroup;
  systemGroupLabel: string;
  image: string;
  images?: string[]; // 1 to 3 images for gallery, 3s hover carousel and lightbox
  imageVariants?: ValveImageVariants; // Automated WebP pipeline variants (thumbnail, medium, high)
  imagesVariants?: ValveImageVariants[]; // Multi-resolution variants for all uploaded images
  isCustomized?: boolean; // Marked when edited by admin to lock & protect permanently against reset
  seoMetadata?: {
    metaTitle?: string;
    metaTitleEn?: string;
    metaDescription?: string;
    metaDescriptionEn?: string;
    targetKeywords?: string[];
    targetKeywordsEn?: string[];
    seoScore?: number;
    searchIntent?: string;
  };
  badge?: string;
  material: string;
  materialEn: string;
  materialGroup: MaterialType;
  pressure: string;
  pressureGroup: PressureRating;
  sizeRange: string;
  tempRange: string;
  connection: string;
  applicableMedia: string[];
  applicableMediaEn: string[];
  standards: string[];
  description: string;
  descriptionEn: string;
  nameZh?: string;
  descriptionZh?: string;
  nameTh?: string;
  descriptionTh?: string;
  highlightFeatures: string[];
  highlightFeaturesEn: string[];
  applicableMediaZh?: string[];
  highlightFeaturesZh?: string[];
  specs: ValveDimensionSpec[];
  leakageClass: string;
  testPressureShell: string;
  testPressureSeat: string;
  referencePriceVnd: number;
  cadFileAvailable: boolean;
  characteristics?: ValveCharacteristics; // Ô Đặc Tính do AI tổng hợp và admin kiểm tra/thêm/xóa
  equivalents?: EquivalentBrand[];
  isHighPerformance?: boolean;
  highPerformanceStats?: {
    offsetType: 'Double-Offset' | 'Triple-Offset (Lệch tâm 3)';
    cycleLife: string; // e.g. "1,000,000 chu trình"
    gasLeakRate: string; // e.g. "ISO 5208 Rate A Bubble-tight"
    cryogenicTemp: string; // e.g. "-196°C đến +450°C"
    specialGases: string[]; // e.g. ["Oxygen", "Nitrogen", "Argon", "LPG/LNG", "Hydrogen"]
  };
  isMediaLocked?: boolean;
  mediaApprovedDate?: string;
  isMechanicalFeaturesLocked?: boolean;
  mechanicalFeaturesApprovedDate?: string;
  isTranslationsLocked?: boolean;
  translationsApprovedDate?: string;
  isPinned?: boolean;
  isPrioritized?: boolean;
}

export interface FilterState {
  search: string;
  category: string;
  systemGroup: SystemGroup;
  materialGroup: string;
  pressureGroup: string;
  sizeCategory: string;
  media: string;
  brand: string;
}

export interface RfqItem {
  valve: ValveProduct;
  selectedDn: string;
  quantity: number;
  notes?: string;
}

export interface RfqFormData {
  companyName: string;
  taxCode: string;
  contactPerson: string;
  rolePosition: string;
  phone: string;
  email: string;
  projectName: string;
  deliveryLocation: string;
  valveRequirements: string;
  fileName?: string;
  urgency: 'standard' | 'urgent' | 'tender';
  notes: string;
}

export interface EditableBlock {
  key: string;
  title: string;
  value: string;
}

export interface CompanyContactInfo {
  companyName: string;
  taxCode: string;
  hotline: string;
  landline: string;
  emailSales: string;
  emailProject: string;
  headOffice: string;
  workAndWarehouse: string;
  warehouseHanoi?: string;
  warehouseHcm?: string;
  warehouseDanang?: string;
  workingHours: string;
  leadTime: string;
}

// =========================================================================
// Real-world Projects (2009 to Present) Types
// =========================================================================
export type ProjectIndustry = 
  | 'oil_gas' 
  | 'power_energy' 
  | 'hvac_bldg' 
  | 'fire_protection' 
  | 'fnb_pharma' 
  | 'water_utility' 
  | 'heavy_industry';

export interface ProjectSuppliedValve {
  brand: string;
  valveType: string;
  valveTypeEn?: string;
  quantity: string;
  specs: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  nameEn: string;
  year: number; // 2009 up to current dynamic year
  completionDate: string; // e.g. "Q3/2009" or "Tháng 04/2026 (Hiện tại)"
  isOngoing?: boolean;
  industry: ProjectIndustry;
  industryLabel: string;
  industryLabelEn: string;
  clientInvestor: string;
  clientInvestorEn?: string;
  epcContractor: string;
  location: string;
  contractValueVnd: string;
  brandsUsed: string[]; // e.g. ['UTD', 'VYC-Spain', 'Johnson Controls', 'Tyco']
  suppliedValves: ProjectSuppliedValve[];
  summary: string;
  summaryEn: string;
  articleContent: string;
  articleContentEn: string;
  imageUrl?: string;
  orderReference?: string;
  createdAt?: string;
}

// =========================================================================
// Background Crawler Types for Partner Manufacturers
// =========================================================================
export interface CrawlerSiteConfig {
  id: string;
  name: string;
  url: string;
  brand: 'VYC-Spain' | 'Shield Valve UK' | 'JMV-Korea' | 'Johnson Controls' | 'Tyco' | 'APC Valve' | string;
  flag: string;
  focus: string;
  focusEn: string;
  itemsFound: number;
  lastCrawledAt?: string;
  status: 'idle' | 'crawling' | 'success' | 'error';
  docLinks: string[];
}

export interface CrawlLogItem {
  id: string;
  timestamp: string;
  siteName: string;
  message: string;
  messageEn: string;
  level: 'info' | 'success' | 'warn' | 'error';
}

export interface CrawlerState {
  isRunning: boolean;
  currentSiteIndex: number;
  progressPercent: number;
  totalItemsExtracted: number;
  autoSchedule: boolean; // periodic background crawl
  scheduleIntervalMinutes: number;
  lastRunAt?: string;
  logs: CrawlLogItem[];
}

// =========================================================================
// Intra-Category / Intra-Family Valve Comparison Types
// =========================================================================
export interface ValveFamilyComparisonItem {
  id: string;
  categoryFamily: string; // 'butterfly' | 'ball' | 'check' | 'control_balancing' | 'gate_globe'
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  designPrinciple: string;
  designPrincipleEn: string;
  sealingMechanism: string;
  sealingMechanismEn: string;
  cycleLife: string;
  cycleLifeEn: string;
  tempRange: string;
  pressureLimit: string;
  leakageIntegrity: string;
  leakageIntegrityEn: string;
  cavitationAndWear: string;
  cavitationAndWearEn: string;
  recommendedApplications: string[];
  recommendedApplicationsEn: string[];
  pros: string[];
  prosEn: string[];
  cons: string[];
  consEn: string[];
  relativeCostScore: number; // 1 to 5 stars
  exampleModels: string[];
}


