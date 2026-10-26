import { PortalUser, ProjectDefinition, InventoryItemRecord, QuotationRecord, AISettingRecord, BusinessPlanRecord, BackupRecord } from '../types/portal';

export const PORTAL_PROJECTS: ProjectDefinition[] = [
  {
    code: 'PROJECT_INVENTORY',
    nameVi: 'Hệ thống Quản lý Kho',
    nameEn: 'Warehouse & Inventory Management',
    descriptionVi: 'Quản lý tồn kho theo thời gian thực, vị trí lô hàng, cảnh báo tồn kho an toàn và tự động đề xuất nhập hàng qua AI.',
    iconName: 'Package',
    routePath: '/portal/inventory',
    status: 'active',
    requiredRole: ['SUPER_ADMIN', 'WAREHOUSE_STAFF']
  },
  {
    code: 'PROJECT_QUOTATIONS',
    nameVi: 'Hệ thống Báo giá Dự án',
    nameEn: 'Commercial Quotation Engine',
    descriptionVi: 'Tạo lập báo giá kỹ thuật công nghiệp, tự động sinh thư chào hàng bằng AI và bảo mật quy trình xuất file PDF.',
    iconName: 'FileSpreadsheet',
    routePath: '/portal/quotations',
    status: 'active',
    requiredRole: ['SUPER_ADMIN', 'QUOTATION_SPECIALIST']
  },
  {
    code: 'PROJECT_PLANNING',
    nameVi: 'Kế hoạch Kinh doanh & SWOT',
    nameEn: 'Strategic Business Planning & SWOT',
    descriptionVi: 'Môi trường phân tích SWOT chuyên sâu, dự phóng doanh thu, tính toán điểm hòa vốn và tư vấn chiến lược bằng AI.',
    iconName: 'TrendingUp',
    routePath: '/portal/planning',
    status: 'active',
    requiredRole: ['SUPER_ADMIN', 'BUSINESS_PLANNER']
  },
  {
    code: 'PROJECT_ADMIN',
    nameVi: 'Cổng Quản trị Super Admin & Cấu hình AI',
    nameEn: 'Master Admin & Dynamic AI Settings',
    descriptionVi: 'Quản lý người dùng, phân quyền module, cấu hình System Prompt và tham số AI độc lập cho từng dự án.',
    iconName: 'Sliders',
    routePath: '/portal/admin',
    status: 'active',
    requiredRole: ['SUPER_ADMIN']
  }
];

export const PORTAL_USERS: PortalUser[] = [
  {
    id: 'usr-admin-01',
    username: 'trong.luu',
    email: 'trong.luu@industracorp.com',
    fullName: 'Trọng Lưu (Quản trị viên Cao cấp)',
    role: 'SUPER_ADMIN',
    roleNameVi: 'Quản trị viên Cao cấp',
    assignedProjects: ['PROJECT_INVENTORY', 'PROJECT_QUOTATIONS', 'PROJECT_PLANNING', 'PROJECT_ADMIN'],
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-warehouse-02',
    username: 'thukho',
    email: 'thukho@industracorp.com',
    fullName: 'Nguyễn Văn Minh (Thủ kho Trưởng)',
    role: 'WAREHOUSE_STAFF',
    roleNameVi: 'Thủ kho / Quản lý Tồn kho',
    assignedProjects: ['PROJECT_INVENTORY'],
    isActive: true,
    createdAt: '2026-01-15T08:30:00Z'
  },
  {
    id: 'usr-sales-03',
    username: 'sales_bao_gia',
    email: 'sales@industracorp.com',
    fullName: 'Trần Thị Mỹ Duyên (Chuyên viên Báo giá)',
    role: 'QUOTATION_SPECIALIST',
    roleNameVi: 'Chuyên viên Báo giá & RFQ',
    assignedProjects: ['PROJECT_QUOTATIONS'],
    isActive: true,
    createdAt: '2026-02-01T09:00:00Z'
  },
  {
    id: 'usr-planner-04',
    username: 'ke_hoach_kinh_doanh',
    email: 'planner@industracorp.com',
    fullName: 'Đặng Tuấn Anh (Giám đốc Kế hoạch)',
    role: 'BUSINESS_PLANNER',
    roleNameVi: 'Chuyên gia Kế hoạch Chiến lược',
    assignedProjects: ['PROJECT_PLANNING'],
    isActive: true,
    createdAt: '2026-02-10T10:15:00Z'
  },
  {
    id: 'usr-guest-05',
    username: 'khach_hang',
    email: 'guest@khachhang.vn',
    fullName: 'Khách hàng Khảo sát (Guest)',
    role: 'GUEST',
    roleNameVi: 'Khách vãng lai (Chưa phân quyền)',
    assignedProjects: [],
    isActive: true,
    createdAt: '2026-03-01T14:00:00Z'
  }
];

export const INITIAL_AI_SETTINGS: Record<string, AISettingRecord> = {
  PROJECT_INVENTORY: {
    projectCode: 'PROJECT_INVENTORY',
    projectNameVi: 'Phân hệ Quản lý Kho',
    modelName: 'gemini-2.5-flash',
    systemInstruction: `Bạn là Trợ lý AI Quản lý Kho Công Nghiệp Chuyên Nghiệp của Công ty Cổ phần Industracorp.
Nhiệm vụ của bạn:
1. Tra cứu tồn kho chính xác theo mã SKU, tên van, kích thước DN và vị trí kệ kho.
2. Khi phát hiện số lượng tồn kho <= ngưỡng an toàn (minReorderLevel), lập tức đưa ra CẢNH BÁO MÀU ĐỎ và lý do cần nhập gấp.
3. Đề xuất số lượng đặt hàng kinh tế (EOQ) dựa trên tốc độ tiêu thụ dự án công nghiệp.
4. Giữ phong cách trả lời ngắn gọn, rành mạch, chuẩn xác số liệu kỹ thuật dạng bảng biểu Markdown.`,
    temperature: 0.2,
    topP: 0.9,
    maxOutputTokens: 2048,
    isEnabled: true,
    lastUpdatedBy: 'superadmin',
    updatedAt: '2026-10-18T00:00:00Z'
  },
  PROJECT_QUOTATIONS: {
    projectCode: 'PROJECT_QUOTATIONS',
    projectNameVi: 'Phân hệ Báo giá Dự án',
    modelName: 'gemini-2.5-flash',
    systemInstruction: `Bạn là Chuyên gia Kỹ thuật Thương mại & Soạn thảo Báo giá Dự án Cấp cao (Senior Commercial Proposal Specialist).
Nhiệm vụ của bạn:
1. Đọc thông số kỹ thuật sản phẩm (vật liệu gang cầu, inox 316, áp lực PN16/Class 150, tiêu chuẩn kết nối JIS/DIN).
2. Viết thư chào giá trang trọng, nêu bật ưu điểm độ bền, chứng chỉ CO/CQ và bảo hành 18 tháng.
3. Phân tích giá cạnh tranh, giải thích cơ cấu chiết khấu đại lý B2B rõ ràng, chuyên nghiệp.
4. Tuyệt đối nhấn mạnh: Mọi bản báo giá chính thức phải xuất file PDF có mã số định danh và chữ ký điện tử hợp lệ sau khi đăng nhập.`,
    temperature: 0.4,
    topP: 0.92,
    maxOutputTokens: 2048,
    isEnabled: true,
    lastUpdatedBy: 'superadmin',
    updatedAt: '2026-10-18T00:00:00Z'
  },
  PROJECT_PLANNING: {
    projectCode: 'PROJECT_PLANNING',
    projectNameVi: 'Phân hệ Kế hoạch Kinh doanh',
    modelName: 'gemini-2.5-flash',
    systemInstruction: `Bạn là Chuyên gia Tư vấn Chiến lược Doanh nghiệp & Quản trị Kinh doanh B2B (Senior Business Strategy Consultant).
Nhiệm vụ của bạn:
1. Phân tích SWOT (Điểm mạnh, Điểm yếu, Cơ hội, Thách thức) toàn diện cho các dự án cung cấp thiết bị công nghiệp.
2. Xây dựng kịch bản tài chính: Doanh thu mục tiêu, Điểm hòa vốn (Break-even Analysis), Tỷ suất lợi nhuận gộp.
3. Đề xuất chiến lược thâm nhập thị trường nhà máy lọc hóa dầu, nhiệt điện, và các khu công nghiệp trọng điểm tại Việt Nam.
4. Trình bày lập luận sắc bén, logic, có số liệu và bước hành động khả thi (Actionable Roadmap).`,
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 3072,
    isEnabled: true,
    lastUpdatedBy: 'superadmin',
    updatedAt: '2026-10-18T00:00:00Z'
  }
};

export const INITIAL_INVENTORY_ITEMS: InventoryItemRecord[] = [
  {
    id: 'inv-001',
    sku: 'BV-FLG-SS316-DN50',
    name: 'Van Bi Mặt Bích Inox 316 Hai Thân',
    category: 'Van Bi (Ball Valves)',
    sizeDn: 'DN50 (2 Inch)',
    standard: 'JIS 10K / ANSI 150#',
    quantityInStock: 42,
    minReorderLevel: 20,
    locationBin: 'KHO-HN: K1-A04',
    unitPriceVnd: 1850000,
    unit: 'Bộ',
    status: 'IN_STOCK',
    lastUpdated: '2026-10-17T14:20:00Z'
  },
  {
    id: 'inv-002',
    sku: 'BFV-WAFER-CI-DN100',
    name: 'Van Bướm Tay Gạt Gang Cầu Đệm EPDM',
    category: 'Van Bướm (Butterfly Valves)',
    sizeDn: 'DN100 (4 Inch)',
    standard: 'DIN PN16',
    quantityInStock: 8,
    minReorderLevel: 25,
    locationBin: 'KHO-HN: K2-B02',
    unitPriceVnd: 1200000,
    unit: 'Bộ',
    status: 'LOW_STOCK',
    lastUpdated: '2026-10-17T16:45:00Z'
  },
  {
    id: 'inv-003',
    sku: 'GV-FLG-WCB-DN150',
    name: 'Van Cổng Ty Chìm Thép Đúc WCB',
    category: 'Van Cổng (Gate Valves)',
    sizeDn: 'DN150 (6 Inch)',
    standard: 'ASME B16.34 Class 150',
    quantityInStock: 3,
    minReorderLevel: 10,
    locationBin: 'KHO-SG: S1-C08',
    unitPriceVnd: 4650000,
    unit: 'Bộ',
    status: 'LOW_STOCK',
    lastUpdated: '2026-10-16T11:00:00Z'
  },
  {
    id: 'inv-004',
    sku: 'GLV-BELLOW-SS304-DN40',
    name: 'Van Cầu Hơi Bellow Seal Chống Rò Rỉ',
    category: 'Van Cầu (Globe Valves)',
    sizeDn: 'DN40 (1.5 Inch)',
    standard: 'DIN PN25',
    quantityInStock: 0,
    minReorderLevel: 15,
    locationBin: 'KHO-HN: K3-A01',
    unitPriceVnd: 2950000,
    unit: 'Bộ',
    status: 'OUT_OF_STOCK',
    lastUpdated: '2026-10-15T09:30:00Z'
  },
  {
    id: 'inv-005',
    sku: 'CKV-SWING-CI-DN80',
    name: 'Van Một Chiều Lá Lật Gang Cầu',
    category: 'Van Một Chiều (Check Valves)',
    sizeDn: 'DN80 (3 Inch)',
    standard: 'JIS 10K',
    quantityInStock: 56,
    minReorderLevel: 15,
    locationBin: 'KHO-SG: S2-D03',
    unitPriceVnd: 1650000,
    unit: 'Bộ',
    status: 'IN_STOCK',
    lastUpdated: '2026-10-18T01:10:00Z'
  },
  {
    id: 'inv-006',
    sku: 'PRV-PILOT-BRONZE-DN25',
    name: 'Van Giảm Áp Hơi Nóng Đồng Bronze',
    category: 'Van Điều Khiển & Phụ Kiện',
    sizeDn: 'DN25 (1 Inch)',
    standard: 'ANSI Class 300',
    quantityInStock: 19,
    minReorderLevel: 12,
    locationBin: 'KHO-HN: K1-C05',
    unitPriceVnd: 3400000,
    unit: 'Bộ',
    status: 'IN_STOCK',
    lastUpdated: '2026-10-17T18:00:00Z'
  }
];

export const INITIAL_QUOTATIONS: QuotationRecord[] = [
  {
    id: 'quo-2026-001',
    quoteNumber: 'QTE-2026-1088',
    customerName: 'Kỹ sư Vũ Thành Long',
    customerCompany: 'Tập đoàn Xây dựng & Lắp máy Dầu khí PV-ME',
    customerEmail: 'long.vt@pvme-engineering.com.vn',
    customerPhone: '0913.488.291',
    items: [
      {
        id: 'qitem-1',
        sku: 'BV-FLG-SS316-DN50',
        name: 'Van Bi Mặt Bích Inox 316 Hai Thân DN50',
        specs: 'Thân CF8M, Bi SS316, Seat R-PTFE, Mặt bích JIS 10K',
        quantity: 12,
        unitPriceVnd: 1850000,
        discountPercent: 10,
        subtotalVnd: 19980000
      },
      {
        id: 'qitem-2',
        sku: 'BFV-WAFER-CI-DN100',
        name: 'Van Bướm Tay Gạt Gang Cầu Đệm EPDM DN100',
        specs: 'Thân GGG40, Đĩa CF8, Seat EPDM, Kết nối Wafer PN16',
        quantity: 20,
        unitPriceVnd: 1200000,
        discountPercent: 10,
        subtotalVnd: 21600000
      }
    ],
    subtotalVnd: 46200000,
    discountVnd: 4620000,
    vatRatePercent: 8,
    vatAmountVnd: 3326400,
    totalVnd: 44906400,
    status: 'APPROVED',
    aiGeneratedDescription: 'Bảng chào giá kỹ thuật cho gói thầu hệ thống đường ống làm mát Chiller Phase 2. Toàn bộ thiết bị đạt chuẩn chứng chỉ CO/CQ và áp suất thử kín 1.5x PN16.',
    createdByUserId: 'usr-sales-03',
    createdByUserName: 'Trần Thị Mỹ Duyên',
    createdAt: '2026-10-15T10:30:00Z',
    validUntil: '2026-11-15T23:59:59Z',
    pdfExported: true,
    pdfExportedAt: '2026-10-15T14:15:00Z'
  },
  {
    id: 'quo-2026-002',
    quoteNumber: 'QTE-2026-1092',
    customerName: 'Nguyễn Đình Trọng',
    customerCompany: 'Nhà máy Bia & Nước giải khát Heineken Vũng Tàu',
    customerEmail: 'trong.nd@brewery-vietnam.vn',
    customerPhone: '0988.122.903',
    items: [
      {
        id: 'qitem-3',
        sku: 'GLV-BELLOW-SS304-DN40',
        name: 'Van Cầu Hơi Bellow Seal Chống Rò Rỉ DN40',
        specs: 'Inox vi sinh SS304, seal kim loại chịu nhiệt 300°C',
        quantity: 6,
        unitPriceVnd: 2950000,
        discountPercent: 5,
        subtotalVnd: 16815000
      }
    ],
    subtotalVnd: 17700000,
    discountVnd: 885000,
    vatRatePercent: 8,
    vatAmountVnd: 1345200,
    totalVnd: 18160200,
    status: 'DRAFT',
    aiGeneratedDescription: 'Đề xuất thay thế van hơi tại cụm nồi hơi CIP vệ sinh đường ống tự động. Đảm bảo triệt tiêu thất thoát hơi nhiệt và bảo vệ môi trường lao động.',
    createdByUserId: 'usr-sales-03',
    createdByUserName: 'Trần Thị Mỹ Duyên',
    createdAt: '2026-10-17T09:15:00Z',
    validUntil: '2026-11-17T23:59:59Z',
    pdfExported: false
  }
];

export const INITIAL_BUSINESS_PLAN: BusinessPlanRecord = {
  id: 'plan-2026-q4',
  planTitle: 'Kế Hoạch Mở Rộng Cung Ứng Van Công Nghiệp Dự Án Lọc Hóa Dầu & Nhà Máy FDI 2026 - 2027',
  period: 'Quý 4/2026 - Năm 2027',
  targetRevenueVnd: 28500000000, // 28.5 Tỷ VND
  breakEvenVnd: 14200000000, // 14.2 Tỷ VND
  estimatedFixedCostVnd: 4260000000, // 4.26 Tỷ VND
  grossMarginPercent: 30, // 30%
  swotItems: [
    {
      id: 'swot-1',
      category: 'STRENGTHS',
      text: 'Kho bãi sẵn có tại 2 đầu Bắc - Nam (Hà Nội & TP.HCM), giao hàng nhanh trong 24h với các size thông dụng DN15 - DN200.',
      impact: 'HIGH'
    },
    {
      id: 'swot-2',
      category: 'STRENGTHS',
      text: 'Đầy đủ hồ sơ năng lực, chứng chỉ CO/CQ chuẩn ASME, DIN, JIS và biên bản thử áp Hydrostatic Test từng con van.',
      impact: 'HIGH'
    },
    {
      id: 'swot-3',
      category: 'WEAKNESSES',
      text: 'Thời gian nhập hàng các van size lớn (DN300 trở lên) hoặc vật liệu đặc biệt (Inconel, Monel) còn phụ thuộc chuỗi cung ứng quốc tế (6 - 8 tuần).',
      impact: 'MEDIUM'
    },
    {
      id: 'swot-4',
      category: 'OPPORTUNITIES',
      text: 'Làn sóng đầu tư nhà máy bán dẫn, trung tâm dữ liệu (Data Center) và mở rộng kho xăng dầu đòi hỏi tiêu chuẩn phòng cháy chữa cháy (PCCC) và van điều khiển tự động rất cao.',
      impact: 'HIGH'
    },
    {
      id: 'swot-5',
      category: 'THREATS',
      text: 'Cạnh tranh gay gắt về giá từ các đơn vị thương mại nhập khẩu tiểu ngạch kém chất lượng hoặc thiếu chứng chỉ xuất xứ chính hãng.',
      impact: 'HIGH'
    }
  ],
  aiStrategicAdvice: 'Tập trung định vị vào phân khúc "Dự Án Đòi Hỏi Độ Tin Cậy Khắt Khe" với cam kết thử áp 100% trước khi xuất xưởng và bảo hành 18 tháng. Tận dụng tính năng Báo giá AI & Tồn kho tự động để rút ngắn thời gian phản hồi RFQ từ 48 giờ xuống dưới 15 phút, chiếm ưu thế đấu thầu đầu tiên.',
  updatedAt: '2026-10-17T15:30:00Z'
};

export const INITIAL_BACKUPS: BackupRecord[] = [
  {
    id: 'bak-20261018-0200',
    fileName: 'industracorp_db_20261018_020000.sql.gz',
    fileSizeBytes: 1428520,
    backupType: 'DAILY_AUTOMATED',
    status: 'SUCCESS',
    checksumSha256: '9f83b2a5c4d1e6f0b7c8d9e2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    createdAt: '2026-10-18T02:00:00Z'
  },
  {
    id: 'bak-20261017-0200',
    fileName: 'industracorp_db_20261017_020000.sql.gz',
    fileSizeBytes: 1412090,
    backupType: 'DAILY_AUTOMATED',
    status: 'SUCCESS',
    checksumSha256: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4',
    createdAt: '2026-10-17T02:00:00Z'
  },
  {
    id: 'bak-pre-deploy-v2',
    fileName: 'industracorp_db_predeploy_v2_20261016.sql.gz',
    fileSizeBytes: 1398400,
    backupType: 'PRE_DEPLOYMENT',
    status: 'SUCCESS',
    checksumSha256: '8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7',
    createdAt: '2026-10-16T17:45:00Z'
  }
];
