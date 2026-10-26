export type UserRoleType = 'SUPER_ADMIN' | 'WAREHOUSE_STAFF' | 'QUOTATION_SPECIALIST' | 'BUSINESS_PLANNER' | 'GUEST';

export type ProjectCode = 
  | 'PROJECT_INVENTORY' 
  | 'PROJECT_QUOTATIONS' 
  | 'PROJECT_QUOTATION'
  | 'PROJECT_PLANNING' 
  | 'PROJECT_ADMIN'
  | 'PROJECT_AI_SETTINGS';

export interface PortalUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRoleType;
  roleNameVi: string;
  avatar?: string;
  assignedProjects: ProjectCode[]; // '*' or explicit list
  department?: string;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface ProjectDefinition {
  code: ProjectCode;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  iconName: string;
  routePath: string;
  status: 'active' | 'maintenance' | 'beta';
  requiredRole: UserRoleType[];
}

export interface InventoryItemRecord {
  id: string;
  sku: string;
  name: string;
  category: string;
  sizeDn: string;
  standard: string;
  quantityInStock: number;
  minReorderLevel: number;
  locationBin: string;
  unitPriceVnd: number;
  unit: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastUpdated: string;
}

export interface QuotationItemRecord {
  id: string;
  sku: string;
  name: string;
  specs: string;
  quantity: number;
  unitPriceVnd: number;
  discountPercent: number;
  subtotalVnd: number;
}

export interface QuotationRecord {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  items: QuotationItemRecord[];
  subtotalVnd: number;
  discountVnd: number;
  vatRatePercent: number;
  vatAmountVnd: number;
  totalVnd: number;
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'EXPIRED';
  aiGeneratedDescription?: string;
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
  validUntil: string;
  pdfExported: boolean;
  pdfExportedAt?: string;
}

export interface AISettingRecord {
  projectCode: ProjectCode;
  projectNameVi: string;
  modelName: string;
  systemInstruction: string;
  temperature: number; // 0.0 to 2.0
  topP: number; // 0.0 to 1.0
  maxOutputTokens: number;
  isEnabled: boolean;
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface SwotItem {
  id: string;
  category: 'STRENGTHS' | 'WEAKNESSES' | 'OPPORTUNITIES' | 'THREATS';
  text: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface BusinessPlanRecord {
  id: string;
  planTitle: string;
  period: string;
  targetRevenueVnd: number;
  breakEvenVnd: number;
  estimatedFixedCostVnd: number;
  grossMarginPercent: number;
  swotItems: SwotItem[];
  aiStrategicAdvice?: string;
  updatedAt: string;
}

export interface BackupRecord {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  backupType: 'DAILY_AUTOMATED' | 'MANUAL_SNAPSHOT' | 'PRE_DEPLOYMENT';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  checksumSha256: string;
  createdAt: string;
}

export interface RawMaterialIndex {
  id: string;
  code: 'ss304_316' | 'ductile_iron' | 'cast_steel' | 'bronze' | 'special_alloy';
  nameVi: string;
  nameEn: string;
  baselinePriceVndPerKg: number;
  currentPriceVndPerKg: number;
  fluctuationPercent: number;
  alertThresholdPercent: number;
  isAlertTriggered: boolean;
  lastUpdated: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  notesVi: string;
}

export type AuditCategory = 
  | 'PRODUCT' 
  | 'PROJECT' 
  | 'SYSTEM_CONFIG' 
  | 'PRICING' 
  | 'AUTH_SECURITY' 
  | 'BACKUP_DEPLOY';

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  user: string;
  role?: string;
  category: AuditCategory;
  action: string;
  target: string;
  details: string;
  status: 'SUCCESS' | 'DENIED' | 'WARN';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  metadata?: Record<string, any>;
}
