import { ValveProduct } from '../types/valve';
import { synthesizeValveCharacteristics } from '../utils/aiCharacteristics';
import { HERO_PIPELINE_IMAGE, STUDIO_BALL_VALVE_IMAGE, VALVE_DETAIL_IMAGE } from './imageAssets';
import { PARTNER_BRAND_VALVES } from './partnerBrandValvesData';
import { AI_CATALOG_SUPPLEMENTS } from './supplementValvesData';

export { HERO_PIPELINE_IMAGE, STUDIO_BALL_VALVE_IMAGE, VALVE_DETAIL_IMAGE };

// Comprehensive authentic UTD catalog models indexed from official 244-page manual
const RAW_UTD_VALVES_DATA: ValveProduct[] = [
  // 1. Knife gate valve 
  {
    id: 'utd-knife-gate-fig-kgv',
    code: 'Fig. KGV-10K/PN16',
    name: 'Van Cổng Dao Thép / Inox UTD (Knife Gate Valve - Fig. KGV)',
    nameEn: 'UTD Knife Gate Valve for Slurry & Pulp (Fig. KGV)',
    category: 'knife_gate',
    categoryLabel: 'Knife gate valve (Van cổng dao)',
    categoryLabelEn: 'Knife Gate Valve',
    systemGroup: 'water',
    systemGroupLabel: 'Water, Slurry & Pulp',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'MSS SP-81',
    material: 'Thân WCB / CF8 / CF8M, Lưỡi dao Inox 316 vát cạnh cắt rác, Đệm Metal/PTFE/EPDM',
    materialEn: 'WCB / CF8 / CF8M Body, SS316 Beveled Knife Blade, Metal/PTFE/EPDM Seat',
    materialGroup: 'ss304_316',
    pressure: 'PN10 / PN16 (1.0 - 1.6 MPa)',
    pressureGroup: 'pn16',
    sizeRange: 'DN80 - DN600 (3" - 24")',
    tempRange: '-20°C đến 120°C (EPDM) / 220°C (Metal Seat)',
    connection: 'Mặt bích Wafer EN 1092-2 / JIS B2220 10K',
    applicableMedia: ['Bột giấy (Pulp)', 'Bùn cát (Slurry)', 'Nước thải (Sewage)', 'Xỉ quặng (Slag)'],
    applicableMediaEn: ['Pulp', 'Slurry', 'Sewage', 'Slag'],
    standards: ['EN 1092-2', 'JIS B2220 10K', 'EN 12266-2', 'MSS SP-81'],
    description: 'Cấu tạo thân 2 mảnh (Two-piece body) không có khoang đọng, lưỡi dao vát sắc tự cắt đứt chất rắn sợi, bít kín hai chiều không rò rỉ.',
    descriptionEn: 'Full port knife gate valve with no-cavity design, self-compensating O-ring loaded seat, manual handwheel or pneumatic cylinder actuation.',
    highlightFeatures: [
      'Thân 2 mảnh triệt tiêu hoàn toàn khoang đọng cặn bẩn (No cavities eliminates product build-up)',
      'Tùy chọn đệm kín: Đệm Metal (220°C), Đệm PTFE (150°C), Đệm EPDM (120°C)',
      'Có sẵn phiên bản tay quay vô lăng (Manual) hoặc xi lanh khí nén tác động kép (Pneumatic Actuator)'
    ],
    highlightFeaturesEn: [
      'Two-piece body construction eliminates media accumulation',
      'Seat options: Metal seat (-20 to 220°C), PTFE seat, EPDM seat',
      'Equipped with handwheel or pneumatic cylinder operator'
    ],
    leakageClass: 'EN 12266-2 / ISO 5208 Rate A',
    testPressureShell: '1.5 x PN (2.4 MPa)',
    testPressureSeat: '1.1 x PN (1.76 MPa)',
    referencePriceVnd: 3850000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 51, height: 480, weightKg: 14.5, kvFlow: 450, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 51, height: 530, weightKg: 18.0, kvFlow: 920, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 57, height: 695, weightKg: 28.5, kvFlow: 2100, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 70, height: 820, weightKg: 42.0, kvFlow: 3900, flangeHoles: 8 },
      { dn: 'DN300 (12")', pn: 'PN16', faceToFace: 76, height: 1140, weightKg: 85.0, kvFlow: 9200, flangeHoles: 12 },
    ]
  },

  // 2. Ball valves - Fig. 102TF / 102SF / 102CF 
  {
    id: 'utd-bv-fig102tf-din',
    code: 'Fig. 102TF / 102SF / 102CF',
    name: 'Van Bi Nối Bích DIN Tiêu Chuẩn Châu Âu (Ball Valve - Fig. 102TF)',
    nameEn: 'UTD DIN Standard Flanged Ball Valve (Fig. 102TF)',
    category: 'ball',
    categoryLabel: 'Ball valves (Van bi)',
    categoryLabelEn: 'Ball Valves',
    systemGroup: 'oilgas',
    systemGroupLabel: 'Chemical, Gas & Oil Loop',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'DIN EN 1092-1',
    material: 'Thân đúc 1.4408 (CF8M) / 1.4308 (CF8) / 1.0619 (WCB), Bi Inox 316, Gioăng PTFE/RPTFE/PPL',
    materialEn: 'Body 1.4408 / 1.4308 / 1.0619, Ball SUS316, Seat PTFE/RPTFE/PPL',
    materialGroup: 'ss304_316',
    pressure: 'PN16 / PN40 (EN 1092-1)',
    pressureGroup: 'pn40',
    sizeRange: 'DN15 - DN250 (1/2" - 10")',
    tempRange: '-29°C đến +250°C',
    connection: 'Mặt bích tiêu chuẩn DIN EN 1092-1 Type 21',
    applicableMedia: ['Nước', 'Dầu', 'Khí đốt', 'Hóa chất', 'Hơi nóng'],
    applicableMediaEn: ['Water', 'Oil', 'Gas', 'Chemicals', 'Steam'],
    standards: ['DIN 3357', 'EN 12516-1', 'API 607 Fire Safe', 'DIN 3202', 'EN 12266'],
    description: 'Van bi 2 thân mặt bích chuẩn DIN Châu Âu. Đạt chuẩn chống cháy Fire Safe API 607, bi van khoan lỗ cân bằng áp suất (Pressure balance hole), gioăng PTFE/PPL chịu nhiệt 250°C.',
    descriptionEn: 'Full bore flanged ball valve conforming to DIN 3357 and EN 1092-1 with Fire Safe API 607 certificate and pressure balance hole in ball slot.',
    highlightFeatures: [
      'Gia công theo tiêu chuẩn Đức DIN 3357 / EN 12516-1',
      'Đạt chứng chỉ chống cháy Fire Safe API 607 & ISO 10497',
      'Chiều dài Face to Face chuẩn DIN 3202 F4/F5'
    ],
    highlightFeaturesEn: [
      'Precision manufactured to German standards DIN 3357 and EN 12516-1',
      'Fire-safe certified API 607 / ISO 10497',
      'Face-to-face dimensions strictly comply with DIN 3202'
    ],
    leakageClass: 'ISO 5208 Rate A (Zero Bubble)',
    testPressureShell: '1.5 x PN (6.0 MPa cho PN40)',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 1950000,
    cadFileAvailable: true,
    equivalents: [
      { brand: 'Johnson Controls', modelCode: 'VG1000 Series', comparisonNote: 'Chuẩn DIN thay thế 1:1, vật liệu Inox 316 cao cấp.' }
    ],
    specs: [
      { dn: 'DN15 (1/2")', pn: 'PN40', faceToFace: 115, height: 78, weightKg: 2.5, kvFlow: 22, flangeHoles: 4 },
      { dn: 'DN25 (1")', pn: 'PN40', faceToFace: 125, height: 88, weightKg: 4.8, kvFlow: 85, flangeHoles: 4 },
      { dn: 'DN50 (2")', pn: 'PN16/40', faceToFace: 150, height: 130, weightKg: 9.8, kvFlow: 380, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 180, height: 167, weightKg: 19.5, kvFlow: 1050, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 190, height: 188, weightKg: 28.0, kvFlow: 1800, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 350, height: 288, weightKg: 62.0, kvFlow: 4200, flangeHoles: 8 },
    ]
  },

  // 3. Ball valves - Fig. 102DA1F / 102DF 
  {
    id: 'utd-bv-ductile-fig102df',
    code: 'Fig. 102DF / 102DA1F / 102DJF',
    name: 'Van Bi Gang Cầu Nối Bích UTD (Ductile Iron Ball Valve - Fig. 102DF)',
    nameEn: 'UTD Ductile Iron Ball Valve (Fig. 102DF)',
    category: 'ball',
    categoryLabel: 'Ball valves (Van bi gang)',
    categoryLabelEn: 'Ball Valves',
    systemGroup: 'water',
    systemGroupLabel: 'Water Supply & HVAC',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Gang GGG40',
    material: 'Thân Gang Cầu ASTM A536 / EN-GJS-400-15, Bi Inox 304, Trục Inox 410, Đệm PTFE',
    materialEn: 'Ductile Iron Body (EN-GJS-400-15), Ball AISI 304, Stem AISI 410, Seat PTFE',
    materialGroup: 'ductile_iron',
    pressure: 'PN16 / Class 150 / JIS 10K',
    pressureGroup: 'pn16',
    sizeRange: 'DN15 - DN300 (1/2" - 12")',
    tempRange: '-10°C đến +150°C',
    connection: 'Mặt bích DIN EN 1092-1 / ASME B16.5 / JIS 10K',
    applicableMedia: ['Nước sinh hoạt', 'Dầu', 'Khí nén', 'Hệ thống Chiller'],
    applicableMediaEn: ['Water', 'Oil', 'Compressed Air', 'HVAC Chilled Water'],
    standards: ['DIN 3357', 'ASME B16.34', 'JIS B2002', 'API 598'],
    description: 'Van bi gang cầu sơn phủ Epoxy tĩnh điện. Trục chống bật (Blowout-proof stem), đế gắn động cơ chuẩn ISO 5211 trực tiếp không cần giá đỡ.',
    descriptionEn: 'Ductile iron ball valve with fusion bonded epoxy coating, anti-static design, blowout proof stem and ISO 5211 actuator mounting pad.',
    highlightFeatures: [
      'Đế gắn động cơ ISO 5211 đúc sẵn thuận tiện tự động hóa khí nén/điện',
      'Thân gang cầu EN-GJS-400-15 chịu lực va đập và chống nứt tốt hơn gang xám thông thường 3 lần',
      'Tay vặn gạt Inox kèm bọc nhựa chống trơn trượt'
    ],
    highlightFeaturesEn: [
      'Direct mount ISO 5211 platform for quick actuator mounting',
      'High strength ductile iron body resisting mechanical shock',
      'Stainless steel lever with ergonomic PVC sleeve'
    ],
    leakageClass: 'ISO 5208 Rate A',
    testPressureShell: '2.4 MPa (DIN 3230)',
    testPressureSeat: '1.76 MPa',
    referencePriceVnd: 1450000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 150, height: 146, weightKg: 8.5, kvFlow: 380, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 180, height: 222, weightKg: 17.5, kvFlow: 1050, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 190, height: 222, weightKg: 24.0, kvFlow: 1800, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 350, height: 275, weightKg: 52.0, kvFlow: 4200, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 400, height: 340, weightKg: 88.0, kvFlow: 8100, flangeHoles: 12 },
    ]
  },

  // 4. Butterfly valve - Fig. 401G / G-401G 
  {
    id: 'utd-bfv-fig401g-wafer',
    code: 'Fig. 401G / G-401G',
    name: 'Van Bướm Tay Gạt & Hộp Số UTD (Butterfly Valve - Fig. 401G)',
    nameEn: 'UTD Concentric Wafer Butterfly Valve (Fig. 401G / G-401G)',
    category: 'butterfly',
    categoryLabel: 'Butterfly valve (Van bướm)',
    categoryLabelEn: 'Butterfly Valve',
    systemGroup: 'water',
    systemGroupLabel: 'Water, Air & HVAC',
    image: VALVE_DETAIL_IMAGE,
    badge: 'Concentric Wafer',
    material: 'Thân Gang Cầu FCD-S, Đĩa Inox 304/316, Gioăng EPDM chịu nhiệt, Trục Inox 416',
    materialEn: 'Ductile Iron FCD-S, Disc SS304/SS316, Seat EPDM, Stem SS416',
    materialGroup: 'ductile_iron',
    pressure: 'PN16 (16 Bar)',
    pressureGroup: 'pn16',
    sizeRange: 'DN50 - DN500 (2" - 20")',
    tempRange: '-10°C đến 110°C',
    connection: 'Kẹp bích kiểu Wafer đa tiêu chuẩn (BS EN 1092-1, JIS 10K, ANSI 150)',
    applicableMedia: ['Nước sạch', 'Nước làm mát Chiller', 'Khí nén', 'Hệ thống PCCC'],
    applicableMediaEn: ['Water', 'Air', 'Chilled Water', 'Fire Fighting'],
    standards: ['BS 5155', 'EN 593', 'MSS SP-67', 'API 609', 'EN 12266-2'],
    description: 'Van bướm đồng tâm ty van xuyên đĩa có chốt Pin cố định. Thân gang dẻo sơn phủ Epoxy, đệm EPDM đúc gờ làm kín bích không cần gioăng đệm phụ.',
    descriptionEn: 'Concentric wafer butterfly valve with pinned disc, ductile iron body, EPDM liner and ISO 5211 top flange.',
    highlightFeatures: [
      'Đĩa van Inox 304/316 gia công tinh bóng, giảm ma sát đóng mở và kéo dài tuổi thọ gioăng',
      'Khớp kẹp Wafer đa năng bắt vừa các bước bulong tiêu chuẩn Châu Âu DIN, Nhật JIS và Mỹ ANSI'
    ],
    highlightFeaturesEn: [
      'Polished SS304/SS316 disc reduces operational torque',
      'Universal wafer bolt hole alignment for DIN, JIS, ANSI flanges'
    ],
    leakageClass: 'EN 12266-2 Rate A (Bubble Tight)',
    testPressureShell: '2.4 MPa (24 Bar)',
    testPressureSeat: '1.76 MPa (17.6 Bar)',
    referencePriceVnd: 1250000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 43, height: 129, weightKg: 3.2, kvFlow: 125, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 46, height: 153, weightKg: 4.5, kvFlow: 410, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 52, height: 167, weightKg: 6.2, kvFlow: 750, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 56, height: 209, weightKg: 11.2, kvFlow: 1950, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 60, height: 251, weightKg: 18.5, kvFlow: 3800, flangeHoles: 8 },
      { dn: 'DN300 (12")', pn: 'PN16', faceToFace: 78, height: 357, weightKg: 39.0, kvFlow: 9500, flangeHoles: 12 },
    ]
  },

  // 5. High Performance Butterfly Valve - Fig. H401 Series 
  {
    id: 'utd-hpbv-fig-h401',
    code: 'Fig. H401 / H401P Series',
    name: 'Van Bướm Hiệu Suất Cao Triple-Offset UTD (Fig. H401)',
    nameEn: 'UTD High Performance Triple Offset Butterfly Valve (Fig. H401)',
    category: 'butterfly',
    categoryLabel: 'High Performance Butterfly',
    categoryLabelEn: 'High Performance Butterfly',
    systemGroup: 'gas_cryogenic',
    systemGroupLabel: 'Cryogenic, Oxygen, Gas & Steam',
    image: VALVE_DETAIL_IMAGE,
    badge: 'Triple Offset 1.000.000 Cycles',
    material: 'Thân WCB / CF8M / CF3M, Đĩa CF8M, Ghế van PTFE / PEEK / Stellite Metal-to-Metal, Trục 17-4PH',
    materialEn: 'Body WCB/CF8M/CF3M, Disc CF8M, Seat PEEK/PTFE/Stellite, Stem 17-4PH',
    materialGroup: 'special_alloy',
    pressure: 'Class 150LB / Class 300LB (PN16 - PN40)',
    pressureGroup: 'ansi300',
    sizeRange: 'DN50 - DN1500 (2" - 60")',
    tempRange: '-196°C (Cryogenic LNG) đến +450°C (Steam quá nhiệt)',
    connection: 'Wafer / Lugged / Double Flanged ASME B16.5',
    applicableMedia: [
      'Bột giấy huyền phù (Pulp slurries 4-5% consistency - Chuẩn UTDCORP)',
      'Dịch đen (Black liquor) & Dịch trắng nhà máy giấy',
      'Hơi quá nhiệt (Superheated steam lên tới 450°C)',
      'Khí Oxy (Oxygen service - tẩy dầu ASTM G93)',
      'LNG hóa lỏng âm sâu (-196°C)',
      'Hydrocarbon & Khí chua H2S (NACE MR0175)'
    ],
    applicableMediaEn: [
      'Pulp slurries (up to 4-5% consistency - UTDCORP benchmark)',
      'Black & White chemical liquor',
      'Superheated steam up to 450°C',
      'Oxygen service (ASTM G93 clean)',
      'Cryogenic LNG (-196°C)',
      'Hydrocarbons & Sour gas (NACE MR0175)'
    ],
    standards: ['API 609 Cat. B', 'ASME B16.34', 'API 607 Fire Safe', 'ISO 5208 Rate A', 'UTDCORP Heavy-Duty', 'ISO 15848-1'],
    description: 'Dòng van bướm hiệu suất cao lệch tâm ba Laminated Metal Seal triệt tiêu ma sát trượt, nguồn và tài liệu kỹ thuật độc quyền do UTDCORP cung cấp (utdcorp.com). Chịu 1.000.000 chu trình vận hành trong bột giấy, hơi quá nhiệt 450°C và khí lạnh LNG -196°C.',
    descriptionEn: 'High Performance triple eccentric butterfly valve engineered according to proprietary UTDCORP heavy-duty standards (utdcorp.com) for severe pulp slurries, superheated steam, cryogenic LNG and chemical processing.',
    highlightFeatures: [
      'Cấu trúc lệch tâm ba Triple Offset kết hợp tài liệu kỹ thuật độc quyền do UTDCORP cung cấp chịu 1.000.000 chu trình',
      'Trục van 17-4PH độ cứng cao, khuyến nghị hướng trục nằm ngang (horizontal) tự xả cặn đáy đường ống',
      'Hệ thống đệm tự siết Emission-Pak Live-Loaded Packing đạt chuẩn chống rò rỉ khí quyển nghiêm ngặt ISO 15848-1 Class AH',
      'Phiên bản Fire-Safe kim loại đa tầng Inox 316 + Flexible Graphite đạt chuẩn API 607 và ISO 10497'
    ],
    highlightFeaturesEn: [
      'Triple Offset architecture aligned with UTDCORP heavy-duty engineering standards tested for 1,000,000 cycles',
      'High strength 17-4PH stem with recommended horizontal orientation for bottom sediment self-flushing',
      'Emission-Pak live-loaded packing for zero fugitive emissions complying with ISO 15848-1 Class AH',
      'Fire-safe laminated 316SS + Flexible Graphite seat certified to API 607 and ISO 10497'
    ],
    leakageClass: 'ANSI FCI 70-2 Class VI / MSS-SP61 Bubble-tight',
    testPressureShell: 'Hydrostatic 1.5 x Class Rating (1125 PSI cho Class 300)',
    testPressureSeat: 'Khí Nitơ áp lực cao Zero Leakage',
    referencePriceVnd: 6800000,
    cadFileAvailable: true,
    isHighPerformance: true,
    highPerformanceStats: {
      offsetType: 'Triple-Offset (Lệch tâm 3)',
      cycleLife: '1.000.000+ chu trình',
      gasLeakRate: 'Bubble-tight MSS-SP61 / Class VI',
      cryogenicTemp: '-196°C đến +450°C',
      specialGases: ['Oxygen (ASTM G93 Clean)', 'Nitrogen', 'Chlorine', 'LNG -196°C', 'Steam']
    },
    equivalents: [
      { brand: 'Bray', modelCode: 'Tri Lok Series', comparisonNote: 'Thiết kế lệch tâm 3 tương đương, chuẩn API 609 Cat. B.' },
      { brand: 'Tyco / Vanessa', modelCode: 'Series 30,000', comparisonNote: 'Độ kín kim loại Stellite tương thích hoàn toàn 1:1.' }
    ],
    specs: [
      { dn: 'DN50 (2")', pn: 'Class 150', faceToFace: 43, height: 186, weightKg: 9.5, kvFlow: 52, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'Class 150', faceToFace: 49, height: 297, weightKg: 16.0, kvFlow: 165, flangeHoles: 4 },
      { dn: 'DN100 (4")', pn: 'Class 150', faceToFace: 54, height: 325, weightKg: 22.0, kvFlow: 400, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'Class 150', faceToFace: 57, height: 377, weightKg: 38.0, kvFlow: 1050, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'Class 150', faceToFace: 64, height: 441, weightKg: 65.0, kvFlow: 1800, flangeHoles: 8 },
      { dn: 'DN300 (12")', pn: 'Class 150', faceToFace: 81, height: 595, weightKg: 135.0, kvFlow: 4750, flangeHoles: 12 },
    ]
  },

  // 6. Check Valves - Fig. 400DEF Rubber Flap Check Valve 
  {
    id: 'utd-cv-fig400def-rubber-flap',
    code: 'Fig. 400DEF',
    name: 'Van Một Chiều Lá Lật Cao Su UTD (Rubber Flap Check Valve - Fig. 400DEF)',
    nameEn: 'UTD Rubber Flap Swing Check Valve (Fig. 400DEF)',
    category: 'check',
    categoryLabel: 'Check Valves (Van một chiều)',
    categoryLabelEn: 'Check Valves',
    systemGroup: 'water',
    systemGroupLabel: 'Water Supply & Wastewater',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'BS 5155',
    material: 'Thân Gang Cầu Ductile Iron, Đĩa lá lật Gang bọc cao su EPDM đúc liền',
    materialEn: 'Ductile Iron Body, EPDM Encapsulated Disc, SS304 Hinge Pin',
    materialGroup: 'ductile_iron',
    pressure: 'PN16 (1.6 MPa)',
    pressureGroup: 'pn16',
    sizeRange: 'DN50 - DN400 (2" - 16")',
    tempRange: '-10°C đến 110°C',
    connection: 'Mặt bích tiêu chuẩn BS EN 1092-1 / DIN 3202',
    applicableMedia: ['Nước sạch', 'Nước thải', 'Trạm bơm cấp nước'],
    applicableMediaEn: ['Water', 'Air', 'Wastewater'],
    standards: ['BS 5155', 'BS EN 1092-1', 'DIN 3202', 'EN 12266-2'],
    description: 'Cánh lá lật gang bọc cao su đúc góc nghiêng 45 độ. Hành trình đóng ngắn hơn 50% so với van lá lật thông thường, triệt tiêu va đập búa nước bảo vệ đầu đẩy bơm.',
    descriptionEn: 'Rubber flap swing check valve with inclined seat design for non-slam quiet operation and minimum head loss.',
    highlightFeatures: [
      'Góc nghiêng đĩa 45° giúp đóng nhanh trước khi dòng chảy kịp đảo chiều',
      'Đĩa bọc cao su đúc nguyên khối triệt tiêu tiếng kêu lạch cạch kim loại',
      'Sơn phủ Epoxy tĩnh điện đạt chuẩn an toàn vệ sinh nước sinh hoạt'
    ],
    highlightFeaturesEn: [
      '45° inclined seat design minimizes closing stroke and water hammer',
      'Fully encapsulated rubber flap prevents metal clatter noise',
      'Epoxy powder coated for potable water service'
    ],
    leakageClass: 'EN 12266-2 Rate A (Zero Drip)',
    testPressureShell: '2.4 MPa',
    testPressureSeat: '1.76 MPa',
    referencePriceVnd: 1850000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 203, height: 125, weightKg: 10.5, kvFlow: 95, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 241, height: 160, weightKg: 18.0, kvFlow: 320, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 292, height: 180, weightKg: 26.5, kvFlow: 580, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 356, height: 240, weightKg: 48.0, kvFlow: 1500, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 495, height: 295, weightKg: 85.0, kvFlow: 2950, flangeHoles: 8 },
    ]
  },

  // 7. Gate Valves - Fig. 201DF / 202DF Resilient Seat Gate Valve 
  {
    id: 'utd-gv-fig201df-resilient',
    code: 'Fig. 201DF / 202DF',
    name: 'Van Cổng Ty Chìm Đệm Cao Su Mềm UTD (Fig. 201DF Xanh / Fig. 202DF Đỏ PCCC)',
    nameEn: 'UTD Resilient Seated Gate Valve (Fig. 201DF / 202DF)',
    category: 'resilient_gate',
    categoryLabel: 'Resilient seat gate valves',
    categoryLabelEn: 'Resilient Seat Gate',
    systemGroup: 'water',
    systemGroupLabel: 'Water Supply & PCCC Fire Main',
    image: HERO_PIPELINE_IMAGE,
    badge: 'BS 5163',
    material: 'Thân Gang Cầu Ductile Iron, Nêm gang bọc cao su EPDM, Ty Inox 420, Sơn Epoxy xanh/đỏ',
    materialEn: 'Ductile Iron Body, EPDM Encapsulated Wedge, Stem SS420',
    materialGroup: 'ductile_iron',
    pressure: 'PN16 (232 PSI)',
    pressureGroup: 'pn16',
    sizeRange: 'DN50 - DN600 (2" - 24")',
    tempRange: '0°C đến +80°C',
    connection: 'Mặt bích tiêu chuẩn EN 1092-1 / BS 5163',
    applicableMedia: ['Nước sạch đô thị', 'Hệ thống PCCC cứu hỏa', 'Nước thải sinh hoạt'],
    applicableMediaEn: ['Water', 'Air', 'Fire Water Main'],
    standards: ['BS 5163', 'EN 1092-1', 'EN 12266-1', 'ISO 7259'],
    description: 'Dòng van cửa ty chìm đáy phẳng không có rãnh đọng cát sỏi. Nêm gang cầu bọc cao su EPDM đàn hồi hoàn hảo, có màu xanh (cấp nước) và màu đỏ (PCCC cứu hỏa).',
    descriptionEn: 'Resilient seated gate valve with full bore flat-bottom design, EPDM coated wedge, available in blue (water service) and red (fire protection service).',
    highlightFeatures: [
      'Đáy phẳng không khoang rãnh: Cát đá trôi thẳng, đóng kín tuyệt đối không bị kênh cánh',
      'Nêm gang cầu bọc EPDM dày nguyên khối đúc đúc nhiệt luyện',
      'Đạt chuẩn thử áp EN 12266-1: Thử vỏ 2.4 MPa, thử đệm 1.76 MPa'
    ],
    highlightFeaturesEn: [
      'Pocketless flat bottom eliminates debris clogging',
      'Fully vulcanized EPDM wedge offers 100% drip-tight shutoff',
      'Pressure tested to EN 12266-1: Body 2.4 MPa, Seat 1.76 MPa'
    ],
    leakageClass: 'EN 12266-1 Rate A (Zero Drip)',
    testPressureShell: '2.4 MPa (PN16)',
    testPressureSeat: '1.76 MPa (PN16)',
    referencePriceVnd: 1650000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 178, height: 245, weightKg: 10.5, kvFlow: 290, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 203, height: 290, weightKg: 16.0, kvFlow: 760, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 229, height: 315, weightKg: 21.0, kvFlow: 1350, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 267, height: 410, weightKg: 38.0, kvFlow: 3200, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 292, height: 495, weightKg: 62.0, kvFlow: 6100, flangeHoles: 8 },
      { dn: 'DN300 (12")', pn: 'PN16', faceToFace: 356, height: 680, weightKg: 145.0, kvFlow: 15400, flangeHoles: 12 },
    ]
  },

  // 8. Globe Valves - Fig. 303DF / 301DF Bellows Sealed 
  {
    id: 'utd-glv-fig303df-bellows',
    code: 'Fig. 303DF / 301DF / 301CF',
    name: 'Van Cầu Hơi Ống Xếp Kim Loại Bellows Seal UTD (Fig. 303DF)',
    nameEn: 'UTD Bellows Sealed Globe Valve (Fig. 303DF / 301DF)',
    category: 'globe',
    categoryLabel: 'Globe Valves (Van cầu hơi)',
    categoryLabelEn: 'Globe Valves',
    systemGroup: 'steam',
    systemGroupLabel: 'Steam, Thermal Oil & Hot Gas',
    image: VALVE_DETAIL_IMAGE,
    badge: 'TA-Luft Zero Emission',
    material: 'Thân Gang Cầu EN-GJS-500-7 hoặc Thép đúc 1.0619 (WCB), Đĩa Inox 304, Ống xếp Bellows Inox 304/316Ti',
    materialEn: 'Ductile Iron (EN-GJS-500-7) / 1.0619 WCB, Disc SS304, Bellows SS304/SS316Ti',
    materialGroup: 'cast_steel',
    pressure: 'PN16 (EN 1092-1) / PN25 / PN40',
    pressureGroup: 'pn16',
    sizeRange: 'DN15 - DN200 (1/2" - 8")',
    tempRange: '-29°C đến +350°C (Lưu ý: Gang cầu khuyến nghị tối đa 300°C)',
    connection: 'Mặt bích tiêu chuẩn EN 1092-1 PN16 / DIN 3202',
    applicableMedia: ['Hơi nóng lò hơi (Steam)', 'Dầu truyền nhiệt (Hot Oil)', 'Khí Gas'],
    applicableMediaEn: ['Steam', 'Hot Oil', 'Gas'],
    standards: ['EN 12516', 'EN 558', 'EN 1092-1 PN16', 'EN 12266', 'TA-Luft'],
    description: 'Van cầu hơi trang bị ống xếp kim loại Bellows Seal bằng thép không gỉ. Loại bỏ hoàn toàn sự rò rỉ khí qua trục van ra môi trường, giảm chi phí bảo trì thay tết chèn định kỳ.',
    descriptionEn: 'Maintenance-free bellows sealed globe valve engineered for steam and thermal fluids, delivering zero stem emission to German TA-Luft standards.',
    highlightFeatures: [
      'Công nghệ ống xếp kim loại Inox nhiều lớp thử độ bền mỏi trên 10,000 hành trình',
      'Đĩa van côn dạng điều tiết phân phối lưu lượng tuyến tính chính xác',
      'Mặt bích tiêu chuẩn Châu Âu EN 1092-1 kết hợp gioăng graphite đệm inox'
    ],
    highlightFeaturesEn: [
      'Multi-ply stainless bellows tested for over 10,000 cycles',
      'Conical plug design for precise throttling and shutoff',
      'EN 1092-1 flange connection with graphite spiral-wound gasket'
    ],
    leakageClass: 'EN 12266 Rate A / DIN 3230 BO-1',
    testPressureShell: '2.4 MPa (PN16) / 6.0 MPa (PN40)',
    testPressureSeat: '1.76 MPa (PN16)',
    referencePriceVnd: 2950000,
    cadFileAvailable: true,
    equivalents: [
      { brand: 'Spirax Sarco', modelCode: 'BSA2 / BTM7', comparisonNote: 'Chuẩn bích DIN EN 1092-1 tương thích 100%, bảo hành 24 tháng.' }
    ],
    specs: [
      { dn: 'DN15 (1/2")', pn: 'PN16', faceToFace: 130, height: 190, weightKg: 4.2, kvFlow: 4.2, flangeHoles: 4 },
      { dn: 'DN25 (1")', pn: 'PN16', faceToFace: 160, height: 236, weightKg: 6.8, kvFlow: 12.0, flangeHoles: 4 },
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 230, height: 287, weightKg: 16.5, kvFlow: 48.0, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 310, height: 360, weightKg: 34.0, kvFlow: 130.0, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 350, height: 385, weightKg: 49.0, kvFlow: 210.0, flangeHoles: 8 },
    ]
  },

  // 9. Pressure Reducing Valves - Fig. PRV27 / PRV30 / PRV40 
  {
    id: 'utd-prv-fig-prv27-pilot',
    code: 'Fig. PRV27 / PRV30 / PRV40',
    name: 'Van Giảm Áp Hơi Nóng Màng Pilot UTD (Pressure Reducing Valve - Fig. PRV27)',
    nameEn: 'UTD Pilot-Operated Diaphragm Steam PRV (Fig. PRV27)',
    category: 'prv',
    categoryLabel: 'Pressure Reducing valve',
    categoryLabelEn: 'Pressure Reducing Valve',
    systemGroup: 'steam',
    systemGroupLabel: 'Steam Boiler Distribution',
    image: VALVE_DETAIL_IMAGE,
    badge: 'Pilot Diaphragm',
    material: 'Thân Thép đúc 1.0619 (WCB), Màng điều áp kép Inox, Đĩa & Ghế 2Cr13 tôi cứng Stellite',
    materialEn: 'Carbon Steel 1.0619 Body, Dual Stainless Diaphragm, 2Cr13 Hardened Disc & Seat',
    materialGroup: 'cast_steel',
    pressure: 'Inlet 1.6 - 2.5 MPa / Outlet 0.1 - 1.2 MPa (Class 150/300)',
    pressureGroup: 'pn25',
    sizeRange: 'DN25 - DN200 (1" - 8")',
    tempRange: '0°C đến 285°C',
    connection: 'Mặt bích tiêu chuẩn EN 1092-1 / BS 4504',
    applicableMedia: ['Hơi nóng lò hơi (Steam)', 'Khí nén cao áp'],
    applicableMediaEn: ['Steam System', 'Compressed Air'],
    standards: ['EN 1092-1', 'BS 4504', 'ASME B16.34', 'DIN EN 12516'],
    description: 'Van giảm áp hơi nóng màng pilot tác động gián tiếp có hệ số lưu lượng Cv lớn. Duy trì áp suất ngõ ra ổn định ngay cả khi lưu lượng hơi tiêu thụ biến động mạnh.',
    descriptionEn: 'High capacity pilot operated diaphragm type pressure reducing valve for steam maintaining pinpoint downstream pressure control under heavy loads.',
    highlightFeatures: [
      'Tỷ số giảm áp tối đa 20:1 cho phép giảm áp trực tiếp từ 20 Bar xuống 1 Bar chỉ qua 1 cấp van',
      'Độ chính xác duy trì áp suất sai số cực nhỏ dưới 0.05 Bar',
      'Bộ cẩm nang kèm sơ đồ lắp đặt: Yêu cầu bẫy hơi TSF-14 và bộ tách ẩm nước ngưng phía trước'
    ],
    highlightFeaturesEn: [
      'High 20:1 turndown pressure reduction ratio eliminates dual-stage piping',
      'Tight downstream pressure tolerance under ±0.05 bar',
      'Complete installation loop guidance with upstream separator and trap'
    ],
    leakageClass: 'Leakage Allowance: <0.01% of rated flow',
    testPressureShell: '1.5 x PN (3.8 MPa)',
    testPressureSeat: '2.5 MPa',
    referencePriceVnd: 4650000,
    cadFileAvailable: true,
    equivalents: [
      { brand: 'Spirax Sarco', modelCode: 'DP27 / 25P Series', comparisonNote: 'Kích thước lắp đặt bích tương đương 1:1, màng inox chịu nhiệt cao, tối ưu ngân sách 35%.' }
    ],
    specs: [
      { dn: 'DN25 (1")', pn: 'PN25', faceToFace: 160, height: 235, weightKg: 14.0, kvFlow: 8.5, flangeHoles: 4 },
      { dn: 'DN50 (2")', pn: 'PN25', faceToFace: 230, height: 240, weightKg: 28.0, kvFlow: 35.0, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN25', faceToFace: 310, height: 232, weightKg: 42.0, kvFlow: 85.0, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN25', faceToFace: 350, height: 320, weightKg: 68.0, kvFlow: 140.0, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN25', faceToFace: 450, height: 364, weightKg: 135.0, kvFlow: 320.0, flangeHoles: 8 },
    ]
  },

  // 10. Steam Traps - Fig. TD42 & TSF-14 / TSF-14F 
  {
    id: 'utd-trap-fig-td42-tsf14',
    code: 'Fig. TD42 & TSF-14F',
    name: 'Bẫy Hơi Đồng Tiền TD42 & Bẫy Hơi Phao TSF-14F UTD',
    nameEn: 'UTD Thermodynamic TD42 & Ball Float TSF-14F Steam Traps',
    category: 'water_control',
    categoryLabel: 'Bẫy hơi lò hơi (Steam Traps)',
    categoryLabelEn: 'Steam Traps',
    systemGroup: 'steam',
    systemGroupLabel: 'Steam & Condensate Recovery',
    image: VALVE_DETAIL_IMAGE,
    badge: 'ASME F1139',
    material: 'Thân Thép đúc A216 WCB / Thép rèn A105, Cụm phao & cơ cấu đòn bẩy Inox 304, Đĩa đồng tiền Inox tôi cứng',
    materialEn: 'A216 WCB / A105 Forged Steel, SS304 Float & Mechanism, Hardened SS Disc',
    materialGroup: 'cast_steel',
    pressure: 'PN16 / PN25 / PN40 (PMO 1.6 - 3.2 MPa)',
    pressureGroup: 'pn25',
    sizeRange: 'DN15 - DN100 (1/2" - 4")',
    tempRange: '-20°C đến 425°C',
    connection: 'Nối ren BSPT/NPT hoặc Nối bích EN 1092-1',
    applicableMedia: ['Nước ngưng lò hơi (Steam Condensate)', 'Dàn sấy', 'Áo nhiệt nồi nấu'],
    applicableMediaEn: ['Steam Condensate', 'Heat Exchangers', 'Steam Headers'],
    standards: ['ASTM F1139', 'ISO 6554', 'ISO 6948', 'EN 1092-1'],
    description: 'Bộ đôi bẫy hơi công nghiệp UTD: Bẫy hơi đồng tiền nhiệt động TD42 chịu búa nước cực tốt và Bẫy hơi phao cơ TSF-14F xả nước ngưng liên tục không làm nghẽn nhiệt dàn sấy.',
    descriptionEn: 'Thermodynamic disc trap TD42 and lever ball float steam trap TSF-14F for high-efficiency continuous condensate drainage without live steam loss.',
    highlightFeatures: [
      'TD42 có nắp bọc đệm không khí (Air insulation cap) chống ảnh hưởng của mưa lạnh ngoài trời',
      'TSF-14F tích hợp van xả khí bimetal tự động xả sạch khí lạnh khi khởi động hệ thống',
      'Xả nước ngưng với công suất lên tới 50,000 kg/h cho đường ống cỡ lớn DN100'
    ],
    highlightFeaturesEn: [
      'Insulated cap on TD42 prevents rapid cycle chatter in outdoor rain',
      'Built-in bimetallic air vent ensures rapid system startup air evacuation',
      'High discharge capacity up to 50,000 kg/h for DN100 large processes'
    ],
    leakageClass: 'Zero Steam Loss (Subcooling 10-20°C)',
    testPressureShell: 'Shell Test 1.5 x PN (6.0 MPa cho PN40)',
    testPressureSeat: 'PMO 1.6 MPa - 3.2 MPa',
    referencePriceVnd: 1850000,
    cadFileAvailable: true,
    equivalents: [
      { brand: 'Spirax Sarco', modelCode: 'TD42 / FT14 / FT43', comparisonNote: 'Mã hiệu và kích thước nối tương thích drop-in hoàn toàn.' }
    ],
    specs: [
      { dn: 'TD42 DN15 (1/2")', pn: 'PN25', faceToFace: 155, height: 64, weightKg: 1.8, kvFlow: 18, flangeHoles: 0 },
      { dn: 'TD42 DN25 (1")', pn: 'PN25', faceToFace: 160, height: 67, weightKg: 2.8, kvFlow: 45, flangeHoles: 0 },
      { dn: 'TSF-14F DN25 (1")', pn: 'PN16', faceToFace: 160, height: 120, weightKg: 6.8, kvFlow: 85, flangeHoles: 4 },
      { dn: 'TSF-14F DN50 (2")', pn: 'PN16', faceToFace: 230, height: 150, weightKg: 16.5, kvFlow: 380, flangeHoles: 4 },
      { dn: 'TSF-14F DN100 (4")', pn: 'PN16', faceToFace: 450, height: 240, weightKg: 65.0, kvFlow: 1800, flangeHoles: 8 },
    ]
  },

  // 11. Safety Valves - Fig. ST01CTF / ST01SF 
  {
    id: 'utd-sfv-fig-st01ctf-flanged',
    code: 'Fig. ST01CTF / ST01SF',
    name: 'Van An Toàn Nồi Hơi Mặt Bích UTD (Safety Valve - Fig. ST01CTF)',
    nameEn: 'UTD Flanged Safety Relief Valve (Fig. ST01CTF / ST01SF)',
    category: 'safety_valve',
    categoryLabel: 'Safety valve (Van an toàn)',
    categoryLabelEn: 'Safety Valve',
    systemGroup: 'steam',
    systemGroupLabel: 'Steam Boilers & Pressure Vessels',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'DIN 3220',
    material: 'Thân Thép đúc GS-C25 / CF8, Lò xo 50CrVa chịu nhiệt, Miệng loa Nozzle & Đĩa 2Cr13 + Stellite',
    materialEn: 'Body GS-C25 / CF8, Spring 50CrVa, Disc & Nozzle 2Cr13+Stellite',
    materialGroup: 'cast_steel',
    pressure: 'PN16 / PN40 (1.6 - 4.0 MPa)',
    pressureGroup: 'pn40',
    sizeRange: 'DN20*32 đến DN150*250',
    tempRange: '-20°C đến 300°C',
    connection: 'Mặt bích tiêu chuẩn DIN 2543-2545 / EN 1092-1',
    applicableMedia: ['Hơi bão hòa lò hơi (Steam)', 'Khí nén (Air)', 'Bồn áp lực'],
    applicableMediaEn: ['Steam', 'Air', 'Pressure Vessels'],
    standards: ['DIN 3220', 'DIN 3230', 'DIN 2543', 'ASME Boiler Code'],
    description: 'Van an toàn lò hơi xả áp siêu tốc (Spring Loaded Full Lift). Đầu ra (Outlet) mở rộng hơn đầu vào (Inlet) chống ngạt áp khi xả hơi lưu lượng lớn.',
    descriptionEn: 'Full lift spring loaded flanged safety valve for steam boilers and pressure vessels with oversized discharge outlet.',
    highlightFeatures: [
      'Miệng Nozzle và đĩa van hàn hợp kim cứng Stellite chống xói mòn và kẹt dính khi xả hơi áp cao',
      'Trục dẫn hướng chính xác, có vòng chỉnh (Adjusting ring) điều chỉnh áp suất đóng lại (Blowdown)',
      'Kèm kẹp chì niêm phong áp suất kiểm định an toàn của cơ quan đo lường'
    ],
    highlightFeaturesEn: [
      'Stellite hardfaced nozzle and disc resist high-velocity steam erosion',
      'Precision guided stem with adjustable blowdown ring',
      'Lead sealed pressure setting for accredited safety compliance'
    ],
    leakageClass: 'DIN 3230 Bubble Tight at 90% Set Pressure',
    testPressureShell: '1.5 x PN',
    testPressureSeat: 'Kiểm tra bọt khí 90% áp cài đặt',
    referencePriceVnd: 4950000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN25*40', pn: 'PN40/16', faceToFace: 100, height: 306, weightKg: 12.0, kvFlow: 45, flangeHoles: 4 },
      { dn: 'DN50*80', pn: 'PN40/16', faceToFace: 120, height: 346, weightKg: 24.0, kvFlow: 180, flangeHoles: 4 },
      { dn: 'DN80*125', pn: 'PN40/16', faceToFace: 160, height: 455, weightKg: 42.0, kvFlow: 450, flangeHoles: 8 },
      { dn: 'DN100*150', pn: 'PN40/16', faceToFace: 180, height: 600, weightKg: 68.0, kvFlow: 850, flangeHoles: 8 },
    ]
  },

  // 12. Fire Fighting Valves - Fig. 201F1G / 201FF / 201FG 
  {
    id: 'utd-fire-gate-fig-201f1g',
    code: 'Fig. 201F1G / 201FF / 201FG',
    name: 'Van Cổng PCCC Ty Nổi Rãnh Khớp / Bích UTD (Fire Gate Valve - Fig. 201F1G)',
    nameEn: 'UTD OS&Y Fire Protection Gate Valve Flange-Grooved (Fig. 201F1G)',
    category: 'gate',
    categoryLabel: 'Fire Fighting valve (Van PCCC)',
    categoryLabelEn: 'Fire Protection Valve',
    systemGroup: 'firefighting',
    systemGroupLabel: 'Fire Protection Sprinkler System',
    image: HERO_PIPELINE_IMAGE,
    badge: 'UL/FM 232/300 PSI',
    material: 'Thân Gang Cầu Ductile Iron, Nêm bọc cao su EPDM, Ty Inox 304, Sơn Epoxy đỏ PCCC',
    materialEn: 'Ductile Iron Body, EPDM Resilient Wedge, SS304 Stem, Red Epoxy Coating',
    materialGroup: 'ductile_iron',
    pressure: '232 PSI (16 Bar) & 300 PSI (20.7 Bar) - Test áp 400 - 600 PSI',
    pressureGroup: 'pn25',
    sizeRange: '2" đến 12" (DN50 - DN300)',
    tempRange: 'Tối đa 80°C',
    connection: 'Đầu bích kết hợp rãnh khớp ngàm (Flange-Grooved) hoặc 2 đầu Grooved',
    applicableMedia: ['Nước chữa cháy vách tường', 'Mạng đường ống Sprinkler PCCC'],
    applicableMediaEn: ['Fire Protection Water System'],
    standards: ['ASME B16.42 Class 150', 'BS EN 1092-2 PN16', 'ANSI / AWWA C606', 'ASME B16.10'],
    description: 'Van cổng ty nổi OS&Y chuyên dụng hệ PCCC. Có sẵn đầu kết nối rãnh ngàm cùm nối nhanh (Grooved) và đầu bích, tích hợp lỗ cắm ren NPT gắn công tắc giám sát vị trí.',
    descriptionEn: 'OS&Y resilient wedge fire gate valve available in flanged, grooved or flange-grooved ends rated at 232 PSI and 300 PSI with NPT body plugs.',
    highlightFeatures: [
      'Áp suất làm việc danh định 232 PSI và 300 PSI, thử áp lực xuất xưởng lên đến 600 PSI (40 Bar)',
      'Đầu nối rãnh ngàm cùm Victaulic/AWWA C606 thi công cực nhanh tại công trường không cần hàn',
      'Tương thích lắp đặt công tắc giám sát trạng thái mở van Fig. OSY-1 kết nối tủ trung tâm'
    ],
    highlightFeaturesEn: [
      'Working pressure rated 232 PSI / 300 PSI, factory tested up to 600 PSI',
      'Grooved ends per AWWA C606 for rapid bolt-free jobsite installation',
      'Directly compatible with OSY-1 supervisory tamper switches'
    ],
    leakageClass: 'Zero Leakage Resilient Seat',
    testPressureShell: '400 PSI / 600 PSI',
    testPressureSeat: '232 PSI / 300 PSI',
    referencePriceVnd: 2850000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: '300 PSI', faceToFace: 178, height: 313, weightKg: 12.5, kvFlow: 290, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: '300 PSI', faceToFace: 203, height: 387, weightKg: 19.5, kvFlow: 760, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: '300 PSI', faceToFace: 229, height: 440, weightKg: 28.0, kvFlow: 1350, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: '300 PSI', faceToFace: 267, height: 607, weightKg: 46.0, kvFlow: 3200, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: '300 PSI', faceToFace: 292, height: 786, weightKg: 78.0, kvFlow: 6100, flangeHoles: 8 },
    ]
  },

  // 13. Fire Signal Butterfly & Supervisory Switch 
  {
    id: 'utd-fire-signal-bfv-sn401',
    code: 'Fig. SN401FW3 & OSY-1',
    name: 'Van Bướm Tín Hiệu Điện & Công Tắc Giám Sát PCCC UTD',
    nameEn: 'UTD Signal Butterfly Valve & Supervisory Switch (Fig. SN401FW3 / OSY-1)',
    category: 'butterfly',
    categoryLabel: 'Fire Fighting valve (Van tín hiệu PCCC)',
    categoryLabelEn: 'Signal Butterfly Valve',
    systemGroup: 'firefighting',
    systemGroupLabel: 'Fire Alarm & Supervisory Network',
    image: VALVE_DETAIL_IMAGE,
    badge: '300 PSI Signal',
    material: 'Thân Gang Cầu Ductile Iron, Đĩa bọc cao su EPDM, Hộp số gắn sẵn vi công tắc báo trạng thái',
    materialEn: 'Ductile Iron Body, EPDM Encapsulated Disc, Internal Microswitch Gearbox',
    materialGroup: 'ductile_iron',
    pressure: '300 PSI (20.7 Bar) - Test áp 600 PSI',
    pressureGroup: 'pn25',
    sizeRange: 'DN50 - DN300 (2" - 12")',
    tempRange: 'Tối đa 80°C (176°F)',
    connection: 'Kẹp bích kiểu Wafer ANSI 150 / DIN PN16',
    applicableMedia: ['Đường ống cấp nước sprinkler PCCC trong nhà và ngoài trời'],
    applicableMediaEn: ['Fire Protection Sprinkler Lines'],
    standards: ['ANSI 150', 'DIN 2501', 'ISO 5211', 'UL 346 & FM 3132'],
    description: 'Van bướm tín hiệu điện PCCC tích hợp cặp tiếp điểm vi công tắc SPDT trong hộp số tay quay. Khi có người tự ý vặn đóng van quá 1/5 hành trình, van lập tức truyền tín hiệu cảnh báo về tủ báo cháy trung tâm.',
    descriptionEn: 'Signal gear box butterfly valve with integrated dual SPDT supervisory switches monitoring open/close position for building fire alarm panels.',
    highlightFeatures: [
      'Tích hợp sẵn 2 bộ tiếp điểm giám sát (Supervisory Switch) chống nghịch phá van',
      'Đĩa van gang cầu bọc cao su EPDM toàn phần không tạo xoáy cản dòng',
      'Vỏ hộp số kín đạt chuẩn NEMA 4 chống thấm nước lắp đặt ngoài trời'
    ],
    highlightFeaturesEn: [
      'Pre-wired dual internal SPDT supervisory tamper switches',
      'Full EPDM encapsulated disc for maximum hydrodynamic flow',
      'NEMA 4 weatherproof enclosure suitable for indoor/outdoor risers'
    ],
    leakageClass: 'Bubble-tight Zero Leakage',
    testPressureShell: '600 PSI (40 Bar)',
    testPressureSeat: '300 PSI (20.7 Bar)',
    referencePriceVnd: 2650000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: '300 PSI', faceToFace: 42, height: 111, weightKg: 8.5, kvFlow: 125, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: '300 PSI', faceToFace: 45.3, height: 111, weightKg: 10.2, kvFlow: 410, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: '300 PSI', faceToFace: 52, height: 111, weightKg: 13.5, kvFlow: 750, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: '300 PSI', faceToFace: 55.8, height: 111, weightKg: 19.8, kvFlow: 1950, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: '300 PSI', faceToFace: 60.5, height: 126, weightKg: 32.0, kvFlow: 3800, flangeHoles: 8 },
    ]
  },

  // 14. Fire Hose Valve & Test/Drain Valve 
  {
    id: 'utd-fire-ahv-tp102b',
    code: 'Fig. AHV & Fig. TP102B',
    name: 'Van Góc Cứu Hỏa AHV & Van Thử Nghiệm Xả Đáy TP102B UTD',
    nameEn: 'UTD Angle Hose Valve AHV & Test/Drain Ball Valve TP102B',
    category: 'water_control',
    categoryLabel: 'Fire Fighting valve (Van góc & xả test)',
    categoryLabelEn: 'Hose & Test Drain Valves',
    systemGroup: 'firefighting',
    systemGroupLabel: 'Fire Cabinets & Sprinkler Zonal Test',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Forged Brass 300 PSI',
    material: 'Thân Đồng Thau Rèn Forged Brass CuZn40Pb2, Tay vặn nhôm sơn đỏ, Đĩa thử kính nhìn trong suốt Polycarbonate',
    materialEn: 'Forged Brass CuZn40Pb2 Body, Aluminum Red Handwheel, Polycarbonate Sight Glasses',
    materialGroup: 'bronze',
    pressure: '300 PSI (20.7 Bar)',
    pressureGroup: 'pn25',
    sizeRange: 'DN25, DN32, DN40x40, DN65x65 (1" - 2.5")',
    tempRange: '-10°C đến 80°C',
    connection: 'Ren trong BSPT / NPT kết nối họng tiếp nước hoặc cuộn vòi',
    applicableMedia: ['Tủ chữa cháy vách tường', 'Cụm van kiểm tra Zone Sprinkler tầng'],
    applicableMediaEn: ['Fire Hose Cabinets', 'Sprinkler Inspector Test Lines'],
    standards: ['BSPT / NPT', 'UL/FM Standard', 'NFPA 13'],
    description: 'Van góc lấy nước chữa cháy cuộn vòi cứu hỏa AHV và Van bi 3 vị trí (Test, Drain, Off) TP102B tích hợp lỗ Orifice chuẩn kích thước đầu phun Sprinkler kèm 2 mắt kính quan sát dòng chảy.',
    descriptionEn: 'Heavy duty forged brass angle hose valve and 3-position test/drain ball valve with calibrated orifice and dual sight glasses for sprinkler inspection.',
    highlightFeatures: [
      'Van góc AHV đồng rèn chịu lực giật áp vòi rồng lên đến 300 PSI không rò rỉ chân ren',
      'Van TP102B có 3 vị trí gạt: TEST (thử hệ thống), DRAIN (xả cạn đường ống) và OFF (đóng kín)',
      'Tích hợp 2 mắt kính quan sát (Sight glasses) kiểm tra lưu lượng xả trực quan'
    ],
    highlightFeaturesEn: [
      'Forged brass angle valve rated at 300 PSI withstanding high-pressure hose kickback',
      '3-position test & drain handle: Test, Drain, and Off',
      'Dual polycarbonate sight glasses for instantaneous flow observation'
    ],
    leakageClass: 'Bubble-tight Zero Leakage',
    testPressureShell: '450 PSI',
    testPressureSeat: '300 PSI',
    referencePriceVnd: 1250000,
    cadFileAvailable: true,
    specs: [
      { dn: 'AHV DN40x40 (1.5")', pn: '300 PSI', faceToFace: 102, height: 193, weightKg: 2.4, kvFlow: 45, flangeHoles: 0 },
      { dn: 'AHV DN65x65 (2.5")', pn: '300 PSI', faceToFace: 130, height: 269, weightKg: 4.8, kvFlow: 120, flangeHoles: 0 },
      { dn: 'TP102B DN25 (1")', pn: '300 PSI', faceToFace: 128, height: 74.5, weightKg: 1.8, kvFlow: 25, flangeHoles: 0 },
      { dn: 'TP102B DN32 (1.25")', pn: '300 PSI', faceToFace: 128, height: 74.5, weightKg: 2.1, kvFlow: 42, flangeHoles: 0 },
    ]
  },

  // 15. Y-Strainers - Fig. W501FD & Fig. 501D / 501S 
  {
    id: 'utd-str-fig-w501fd-din',
    code: 'Fig. W501FD & Fig. 501DA1F',
    name: 'Lọc Y Nối Bích DIN & ANSI UTD (Y-Strainer - Fig. W501FD)',
    nameEn: 'UTD Flanged Y-Strainer (Fig. W501FD / 501DA1F)',
    category: 'strainer',
    categoryLabel: 'Strainers (Lọc Y / Lọc rọ)',
    categoryLabelEn: 'Strainers',
    systemGroup: 'water',
    systemGroupLabel: 'Water, Steam & HVAC Protection',
    image: VALVE_DETAIL_IMAGE,
    badge: 'DIN 3202-F1',
    material: 'Thân Gang Cầu Ductile Iron / Thép A216 WCB, Lưới lọc kép Inox 304, Bu lông thép mạ kẽm',
    materialEn: 'Ductile Iron / WCB Body, Stainless Steel 304 Double Screen, Carbon Steel Bolts',
    materialGroup: 'ductile_iron',
    pressure: 'PN16 / Class 150LB (PN16 - PN25)',
    pressureGroup: 'pn16',
    sizeRange: 'DN50 - DN500 (2" - 20")',
    tempRange: '0°C đến 120°C (Sơn WARS) / 350°C (Thép WCB)',
    connection: 'Mặt bích tiêu chuẩn BS EN 1092-1 / ASME B16.5',
    applicableMedia: ['Nước sạch', 'Nước thải', 'Dầu khí', 'Bảo vệ máy bơm'],
    applicableMediaEn: ['Water', 'Air', 'Oil', 'Steam'],
    standards: ['EN 1074', 'DIN 3202-F1', 'EN 588-1', 'ASME B16.34', 'EN 12266-2'],
    description: 'Lọc Y nối bích thân gang dẻo sơn phủ Epoxy tĩnh điện. Nắp tháo lắp nhanh có nút xả cặn đáy (Blowoff plug) thuận tiện xả rửa lưới lọc cặn mà không cần tháo cả cụm van.',
    descriptionEn: 'Flanged ductile iron Y-strainer with stainless steel mesh screen and threaded drain blowoff plug for inline debris cleanout.',
    highlightFeatures: [
      'Lưới lọc Inox 304 gia cường chịu áp lực va đập, mắt lưới lọc tiêu chuẩn 40 - 80 mesh',
      'Đạt chuẩn vệ sinh nước sinh hoạt WARS và tiêu chuẩn mặt bích DIN EN 1092-1',
      'Nắp có nút xả đáy thuận tiện súc xả ngược cát sỏi'
    ],
    highlightFeaturesEn: [
      'Heavy duty reinforced SS304 strainer screen with 40-80 mesh rating',
      'Certified drinking water safe with WARS epoxy coating',
      'Threaded drain plug allows inline blowdown flushing'
    ],
    leakageClass: '100% Hydrostatic Shell Tested',
    testPressureShell: '2.4 MPa (PN16)',
    testPressureSeat: 'N/A',
    referencePriceVnd: 1550000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 230, height: 140, weightKg: 10.5, kvFlow: 45, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 310, height: 178, weightKg: 19.0, kvFlow: 120, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 350, height: 196, weightKg: 28.0, kvFlow: 180, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 480, height: 287, weightKg: 58.0, kvFlow: 420, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 600, height: 354, weightKg: 95.0, kvFlow: 750, flangeHoles: 8 },
    ]
  },

  // 16. Expansion Joints & Flexible Joints 
  {
    id: 'utd-exp-fig-ej01cf-ss316',
    code: 'Fig. EJ01CF / EJ02CF / S701SF',
    name: 'Khớp Giãn Nở Kim Loại & Khớp Nối Mềm Inox UTD',
    nameEn: 'UTD Expansion Joint EJ01 & Stainless Flexible Hose S701',
    category: 'expansion_joint',
    categoryLabel: 'Expansion Joint (Khớp giãn nở)',
    categoryLabelEn: 'Expansion Joint',
    systemGroup: 'steam',
    systemGroupLabel: 'Thermal Piping & LNG Distribution',
    image: HERO_PIPELINE_IMAGE,
    badge: '2-Ply Bellows EJMA',
    material: 'Ruột ống xếp Inox 304/316 2 lớp (2-Ply Bellows), Vỏ bọc Carbon Steel, Ống lót dẫn dòng Inox 301/316',
    materialEn: 'SS304/SS316 2-Ply Bellows, Carbon Steel Housing, Internal Guide Sleeve',
    materialGroup: 'ss304_316',
    pressure: 'PN10 / PN16 (1.0 - 1.6 MPa)',
    pressureGroup: 'pn16',
    sizeRange: 'DN32 - DN350 (1.25" - 14")',
    tempRange: '-20°C đến +250°C',
    connection: 'Mặt bích tiêu chuẩn JIS / DIN / ANSI',
    applicableMedia: ['Đường ống phân phối hơi nóng (Steam)', 'Khí tự nhiên hóa lỏng (LNG)', 'Đường ống dầu'],
    applicableMediaEn: ['Steam Distribution Systems', 'LNG', 'Petroleum'],
    standards: ['EJMA Standards', 'ISO 9001:2015', 'DIN EN 1092-1'],
    description: 'Khớp giãn nở kim loại ống xếp 2 lớp inox bọc vỏ thép chống vặn xoắn. Khả năng hấp thụ chuyển vị dọc trục (Axial Movement) từ ±50mm đến ±110mm, bảo vệ toàn vẹn tuyến ống hơi nóng khỏi nứt gãy nhiệt.',
    descriptionEn: 'Engineered expansion joint with 2-ply stainless steel bellows, internal guide ring, carbon steel protective housing absorbing large thermal axial movements up to ±110mm.',
    highlightFeatures: [
      'Cấu tạo 2 lớp ống xếp Inox 304/316 (2-Ply Bellows) tăng gấp đôi khả năng chịu áp và độ bền mỏi',
      'Có ống lót dẫn dòng bên trong (Internal Guide Ring) ngăn xoáy lốc và lắng đọng chất cặn',
      'Tích hợp tai cẩu nâng hạ (Lifting Lug) giúp lắp đặt an toàn tại công trường'
    ],
    highlightFeaturesEn: [
      '2-ply stainless steel bellows doubles pressure containment and cycle endurance',
      'Internal sleeve eliminates flow turbulence and residue entrapment',
      'Built-in lifting lugs for safe and convenient jobsite rigging'
    ],
    leakageClass: '100% X-Ray & Pressure Tested Zero Leakage',
    testPressureShell: '2.4 MPa',
    testPressureSeat: 'N/A',
    referencePriceVnd: 2850000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 600, height: 76, weightKg: 12.5, kvFlow: 380, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 700, height: 106, weightKg: 22.0, kvFlow: 1050, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 700, height: 133, weightKg: 31.0, kvFlow: 1800, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 800, height: 190, weightKg: 58.0, kvFlow: 4200, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 800, height: 252, weightKg: 95.0, kvFlow: 8100, flangeHoles: 8 },
    ]
  },

  // 17. Pneumatic Angle Seat & Shuttle Valves 
  {
    id: 'utd-pneu-asav-shuttle',
    code: 'Fig. ASAV / ATAV & Fig. UDSV',
    name: 'Van Xi Lanh Góc & Van Con Thoi Khí Nén UTD',
    nameEn: 'UTD Pneumatic Angle Seat & Shuttle Valves (Fig. ASAV / UDSV)',
    category: 'actuator',
    categoryLabel: 'Actuators – instruments (Van khí nén)',
    categoryLabelEn: 'Pneumatic Valves',
    systemGroup: 'instrument',
    systemGroupLabel: 'Factory Automation, Brewery & F&B',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Góc Y Tăng 30% Lưu Lượng',
    material: 'Thân CF8 (Inox 304) / CF8M (Inox 316), Đầu actuator nhôm đúc hoặc Inox xoay 360°, Phốt chặn PTFE',
    materialEn: 'Body CF8/CF8M, Actuator Aluminum / Stainless Steel, PTFE Packings',
    materialGroup: 'ss304_316',
    pressure: 'Áp suất làm việc 0-16 Bar / Áp khí điều khiển 3-8 Bar',
    pressureGroup: 'pn16',
    sizeRange: 'DN8 - DN80 (1/4" - 3")',
    tempRange: '-10°C đến +180°C / Max 220°C',
    connection: 'Nối ren BSP / NPT hoặc đầu hàn vi sinh Tri-clamp',
    applicableMedia: ['Dây chuyền bia rượu F&B', 'Dệt nhuộm', 'Chiết rót tự động', 'Hơi tiệt trùng Autoclave'],
    applicableMediaEn: ['Breweries', 'Textile Dyeing', 'Sterilization', 'Filling Machines'],
    standards: ['EN 12266 Class A', 'ISO 9001:2015', 'FDA Food Grade'],
    description: 'Dòng van xi lanh góc chữ Y (Angle Seat Valve) tăng 30% lưu lượng dòng chảy và triệt tiêu búa nước. Đóng mở siêu tốc dưới 0.1 giây trong các nhà máy bia, sữa và dệt nhuộm.',
    descriptionEn: 'Y-pattern pneumatic angle seat valve raising flow coefficient by 30% and eliminating water hammer with self-lubricating stem seals.',
    highlightFeatures: [
      'Dạng thân chữ Y giúp tăng lưu lượng dòng chảy thêm 30% so với van cầu cùng cỡ',
      'Đầu điều khiển bằng Inox hoặc Nhôm có thể xoay tròn 360° thuận tiện bố trí đường ống khí nén',
      'Ty van tự bôi trơn và tự bù áp lực, tuổi thọ lên tới 3.000.000 chu trình làm việc'
    ],
    highlightFeaturesEn: [
      'Y-type geometry raises flow capacity by 30% with minimal pressure loss',
      'Stainless actuator head rotates 360 degrees for flexible pneumatic piping layout',
      'Self-adjusting stem packing delivers up to 3,000,000 maintenance-free cycles'
    ],
    leakageClass: 'EN 12266 Class A (Zero Bubble)',
    testPressureShell: '2.4 MPa',
    testPressureSeat: '1.6 MPa',
    referencePriceVnd: 1750000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN15 (1/2")', pn: 'PN16', faceToFace: 68, height: 99, weightKg: 1.2, kvFlow: 3.5, flangeHoles: 0 },
      { dn: 'DN25 (1")', pn: 'PN16', faceToFace: 90, height: 110, weightKg: 1.8, kvFlow: 9.9, flangeHoles: 0 },
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 138, height: 183, weightKg: 4.8, kvFlow: 47.2, flangeHoles: 0 },
    ]
  },

  // 18. Instruments - Pressure Transmitter & Switches 
  {
    id: 'utd-inst-transmitter-switch',
    code: 'UPMD & PS-FW / PS-SW',
    name: 'Cảm Biến Áp Suất 4-20mA & Rơ Le Áp Suất UTD',
    nameEn: 'UTD Explosion-Proof Pressure Transmitter & Pressure Switches',
    category: 'instrument',
    categoryLabel: 'Instrument (Thiết bị đo lường)',
    categoryLabelEn: 'Instrumentation & Switches',
    systemGroup: 'instrument',
    systemGroupLabel: 'SCADA, Monitoring & Automation',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'IP65 / ATEX Ex',
    material: 'Vỏ nhôm đúc áp lực chống cháy nổ / Đầu cảm biến màng Inox 316L / Ngõ ra 4-20mA & RS485 Modbus',
    materialEn: 'Die-cast Aluminum Housing, SS316L Diaphragm Sensor, 4-20mA & RS485 Modbus',
    materialGroup: 'ss304_316',
    pressure: 'Dải đo 0-100 MPa / Quá áp an toàn 150%',
    pressureGroup: 'all',
    sizeRange: 'Ren nối G1/2, NPT 1/2',
    tempRange: '-40°C đến +150°C',
    connection: 'Ren kết nối chuẩn G1/2, NPT 1/2',
    applicableMedia: ['Đường ống cấp nước biến tần', 'Áp suất bao hơi lò hơi', 'Khí nén', 'Dầu khí'],
    applicableMediaEn: ['Constant Water Pressure', 'Boilers', 'CNG Gas', 'Pipelines'],
    standards: ['IP65 / IP67', 'ATEX Explosion-proof Ex d', 'CE Marking'],
    description: 'Cảm biến áp suất công nghiệp độ chính xác cao 0.25% F.S ngõ ra 4-20mA 2 dây, hỗ trợ giao thức truyền thông HART/RS485 và rơ-le áp suất tiếp điểm SPDT.',
    descriptionEn: 'High-precision explosion-proof pressure transmitter with 4-20mA/HART output and SPDT industrial pressure switches for automatic pump and boiler control.',
    highlightFeatures: [
      'Độ chính xác cao 0.25% F.S, chống nhiễu điện từ công nghiệp EMC',
      'Đạt chứng chỉ phòng chống cháy nổ ATEX cho khu vực dầu khí hóa chất Zone 1 & 2',
      'Màn hình hiển thị số LED/LCD 4 chữ số trực tiếp tại chỗ'
    ],
    highlightFeaturesEn: [
      'High accuracy 0.25% F.S with excellent industrial electromagnetic immunity',
      'ATEX explosion-proof certified for hazardous chemical areas',
      'Optional local 4-digit digital LED/LCD display unit'
    ],
    leakageClass: 'IP65 Weatherproof',
    testPressureShell: '150% F.S Overload Capacity',
    testPressureSeat: 'N/A',
    referencePriceVnd: 2450000,
    cadFileAvailable: true,
    specs: [
      { dn: 'UPMD-105 (4-20mA)', pn: '0-25 Bar', faceToFace: 75, height: 180, weightKg: 1.1, kvFlow: 0, flangeHoles: 0 },
      { dn: 'PS-FW16 (Rơ-le)', pn: '3-16 Bar', faceToFace: 85, height: 140, weightKg: 0.6, kvFlow: 0, flangeHoles: 0 },
    ]
  },

  // 19. Water Meters - Fig. ISXSLC & ISXLC 
  {
    id: 'utd-meter-fig-isxlc-woltman',
    code: 'Fig. ISXSLC & Fig. ISXLC',
    name: 'Đồng Hồ Đo Lưu Lượng Nước Sạch & Nước Nóng UTD',
    nameEn: 'UTD Woltman & Multi-Jet Water Flow Meters (Fig. ISXLC)',
    category: 'water_control',
    categoryLabel: 'Thiết bị đo nước (Water Meter)',
    categoryLabelEn: 'Water Flow Meter',
    systemGroup: 'water',
    systemGroupLabel: 'Water Supply & Billing Utilities',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Woltman ISO 4064',
    material: 'Thân Gang Cầu sơn tĩnh điện Epoxy / Cụm cánh tuabin Polymer chống kẹt / Mặt số hút chân không',
    materialEn: 'Ductile Iron Body, Polymer Impeller, Vacuum Sealed Register',
    materialGroup: 'ductile_iron',
    pressure: 'PN16 (1.6 MPa) / PN25',
    pressureGroup: 'pn16',
    sizeRange: 'DN15 - DN500 (1/2" - 20")',
    tempRange: '0.1°C đến 50°C (Nước lạnh) / 90°C (Nước nóng)',
    connection: 'Nối rắc co ren (DN15-50) hoặc Nối bích (DN50-500)',
    applicableMedia: ['Mạng lưới cấp nước sạch đô thị', 'Hệ thống chiller tuần hoàn', 'Đồng hồ tổng nhà máy'],
    applicableMediaEn: ['Municipal Water', 'Chiller Loops', 'Industrial Plant Mains'],
    standards: ['ISO 4064 Class B / Class C', 'EN 14154', 'OIML R49'],
    description: 'Dòng đồng hồ nước tuabin Woltman tháo lắp ruột ngang và đồng hồ đa tia Multi-Jet. Mặt số hút chân không vĩnh cửu không mờ sương, tích hợp ngõ ra xung Pulse Output kết nối hệ thống AMR/SCADA.',
    descriptionEn: 'Woltman turbine water meter with removable measuring element and multi-jet meters conforming to ISO 4064 with pulse output for remote AMR data logging.',
    highlightFeatures: [
      'Ruột đo Woltman tháo rời độc lập (Removable element): Dễ bảo dưỡng hiệu chuẩn không cần cắt ống',
      'Mặt số khô hút chân không chống đọng sương và từ trường ngoài (Anti-magnetic shield)',
      'Hỗ trợ ngõ ra phát xung Reed Switch (10/100/1000 L/xung) và Modbus RS485 thu thập dữ liệu từ xa'
    ],
    highlightFeaturesEn: [
      'Removable Woltman measuring mechanism simplifies calibration without pipe removal',
      'Hermetically vacuum sealed dial eliminates fogging with magnetic tampering protection',
      'Pulse output sensor ready for AMR and smart building management integration'
    ],
    leakageClass: 'Pressure Loss < 0.063 MPa',
    testPressureShell: '2.4 MPa',
    testPressureSeat: 'N/A',
    referencePriceVnd: 2850000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 200, height: 261, weightKg: 12.0, kvFlow: 40, flangeHoles: 4 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 250, height: 289, weightKg: 19.0, kvFlow: 100, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 300, height: 319, weightKg: 32.0, kvFlow: 250, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 350, height: 346, weightKg: 45.0, kvFlow: 400, flangeHoles: 12 },
    ]
  },

  // 20. Solenoid Valves - Fig. SS / S02S Series 
  {
    id: 'utd-sol-fig-s02s-steam',
    code: 'Fig. SS / S02S Series',
    name: 'Van Điện Từ Inox Chịu Hơi Nóng & Hóa Chất UTD (Fig. S02S)',
    nameEn: 'UTD Stainless Steel High-Temperature Solenoid Valve (Fig. S02S)',
    category: 'solenoid',
    categoryLabel: 'Solenoid valves (Van điện từ)',
    categoryLabelEn: 'Solenoid Valves',
    systemGroup: 'steam',
    systemGroupLabel: 'Steam, Hot Water & Chemical Automation',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Inox 304/316 180°C',
    material: 'Thân đúc Inox SUS304 / SUS316, Piston Inox, Đệm làm kín PTFE chịu nhiệt, Cuộn coil bọc đúc cấp H',
    materialEn: 'SUS304/SUS316 Body, Stainless Piston, PTFE Seals, Class H High Temp Coil',
    materialGroup: 'ss304_316',
    pressure: 'PN10 (0.5 - 10 Bar)',
    pressureGroup: 'pn16',
    sizeRange: 'DN15 - DN50 (1/2" - 2")',
    tempRange: '-10°C đến +180°C',
    connection: 'Nối ren tiêu chuẩn BS21 / NPT',
    applicableMedia: ['Hơi nóng lò hơi (Steam)', 'Dầu nóng', 'Hóa chất', 'Nước'],
    applicableMediaEn: ['Steam', 'Hot Oil', 'Chemicals', 'Water'],
    standards: ['IP65 / IP68', 'ISO 9001:2015', 'CE Marking'],
    description: 'Van điện từ 2/2 ngả thường đóng (NC). Cuộn coil đúc chống nước chuẩn cách nhiệt Class H chịu nhiệt độ cao 180°C, gioăng PTFE chống ăn mòn hóa chất và hơi nóng.',
    descriptionEn: 'Pilot operated 2/2-way stainless steel solenoid valve with PTFE sealing and Class H insulated coil designed for steam, thermal oil and corrosive liquids.',
    highlightFeatures: [
      'Cuộn hút cách điện Class H chịu được nhiệt độ cuộn dây lên đến 180°C vận hành liên tục',
      'Toàn bộ chi tiết tiếp xúc lưu chất bằng Inox 304/316 và đệm làm kín PTFE',
      'Độ kín khít chống rò rỉ đạt chuẩn IP65 hoặc tùy chọn chống ngập nước IP68'
    ],
    highlightFeaturesEn: [
      'Class H coil insulation resists up to 180°C continuous steam environments',
      'All wetted parts manufactured from SUS304/SUS316 with pure PTFE seals',
      'Weatherproof IP65 enclosure with optional submersible IP68 rating'
    ],
    leakageClass: 'Zero Leakage Bubble Tight',
    testPressureShell: '1.5 MPa',
    testPressureSeat: '1.0 MPa',
    referencePriceVnd: 1650000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN15 (1/2")', pn: 'PN10', faceToFace: 70, height: 107, weightKg: 1.1, kvFlow: 5.5, flangeHoles: 0 },
      { dn: 'DN20 (3/4")', pn: 'PN10', faceToFace: 82, height: 115, weightKg: 1.4, kvFlow: 9.5, flangeHoles: 0 },
      { dn: 'DN25 (1")', pn: 'PN10', faceToFace: 92, height: 124, weightKg: 1.9, kvFlow: 12.0, flangeHoles: 0 },
      { dn: 'DN50 (2")', pn: 'PN10', faceToFace: 150, height: 177, weightKg: 4.8, kvFlow: 49.0, flangeHoles: 0 },
    ]
  }
,

  {
  "id": "utd-fv-fig-601df-luppe",
  "code": "Fig. 601DF / 602DF",
  "name": "Rọ Bơm Gang Cầu Đệm Kín EPDM UTD (Foot Valve - Fig. 601DF)",
  "nameEn": "UTD Resilient Seated Foot Valve with Stainless Strainer Screen",
  "category": "foot_valve",
  "categoryLabel": "Foot valve (Rọ bơm / Luppe)",
  "categoryLabelEn": "Foot Valve",
  "systemGroup": "water",
  "systemGroupLabel": "Water Intake & Pumping Stations",
  "image": "/uploads/studio_ball_valve_1791245423293.jpg",
  "badge": "Đệm Kín EPDM Zero-Leakage",
  "material": "Thân Gang Cầu ASTM A536, Đĩa van gang bọc cao su EPDM, Lưới lọc Inox 304",
  "materialEn": "Ductile Iron Body, EPDM Coated Disc, SS304 Strainer Screen",
  "materialGroup": "ductile_iron",
  "pressure": "PN10 / PN16 (1.0 - 1.6 MPa)",
  "pressureGroup": "pn16",
  "sizeRange": "DN50 - DN400 (2\" - 16\")",
  "tempRange": "-10°C đến 80°C",
  "connection": "Mặt bích tiêu chuẩn EN 1092-2 / BS 4504 / JIS 10K",
  "applicableMedia": [
    "Nước ngầm",
    "Nước sông hồ thô",
    "Trạm bơm tăng áp",
    "Bể hút PCCC"
  ],
  "applicableMediaEn": [
    "Groundwater",
    "Raw River Water",
    "Booster Stations",
    "Fire Suction Tanks"
  ],
  "standards": [
    "EN 1092-2",
    "BS 5153",
    "ISO 5208",
    "AWWA C508"
  ],
  "description": "Rọ bơm chân hút gang cầu đệm cao su EPDM chống tụt nước mồi trạm bơm. Cụm lưới lọc Inox 304 vòm tròn ngăn rác kích thước lớn hơn 4mm, cánh van tự đóng kín bằng trọng lực và cột áp thủy tĩnh.",
  "descriptionEn": "Foot valve with integrated heavy-duty stainless steel suction screen and resilient EPDM seat preventing pump priming loss.",
  "highlightFeatures": [
    "Đĩa van bọc cao su EPDM đàn hồi đóng kín tuyệt đối, giữ trọn vẹn nước mồi cho máy bơm",
    "Lưới lọc rác bằng Inox 304 không gỉ diện tích thông thủy lớn gấp 3 lần tiết diện ống",
    "Sơn phủ Epoxy tĩnh điện 250 micron màu xanh tiêu chuẩn an toàn nước sinh hoạt"
  ],
  "highlightFeaturesEn": [
    "EPDM encapsulated disc delivers 100% bubble-tight sealing to prevent pump priming loss",
    "SS304 suction strainer with net open area exceeding 300% pipe nominal area",
    "Fusion bonded epoxy coating certified for potable water distribution"
  ],
  "leakageClass": "ISO 5208 Rate A (Zero Bubble)",
  "testPressureShell": "2.4 MPa",
  "testPressureSeat": "1.76 MPa",
  "referencePriceVnd": 1850000,
  "cadFileAvailable": true,
  "specs": [
    {
      "dn": "DN50 (2\")",
      "pn": "PN16",
      "faceToFace": 145,
      "height": 165,
      "weightKg": 8.5,
      "kvFlow": 110,
      "flangeHoles": 4
    },
    {
      "dn": "DN65 (2.5\")",
      "pn": "PN16",
      "faceToFace": 165,
      "height": 185,
      "weightKg": 11,
      "kvFlow": 190,
      "flangeHoles": 4
    },
    {
      "dn": "DN80 (3\")",
      "pn": "PN16",
      "faceToFace": 180,
      "height": 205,
      "weightKg": 14.5,
      "kvFlow": 350,
      "flangeHoles": 8
    },
    {
      "dn": "DN100 (4\")",
      "pn": "PN16",
      "faceToFace": 215,
      "height": 235,
      "weightKg": 20,
      "kvFlow": 620,
      "flangeHoles": 8
    },
    {
      "dn": "DN125 (5\")",
      "pn": "PN16",
      "faceToFace": 245,
      "height": 270,
      "weightKg": 29,
      "kvFlow": 980,
      "flangeHoles": 8
    },
    {
      "dn": "DN150 (6\")",
      "pn": "PN16",
      "faceToFace": 275,
      "height": 310,
      "weightKg": 38.5,
      "kvFlow": 1550,
      "flangeHoles": 8
    },
    {
      "dn": "DN200 (8\")",
      "pn": "PN16",
      "faceToFace": 335,
      "height": 385,
      "weightKg": 62,
      "kvFlow": 2900,
      "flangeHoles": 8
    },
    {
      "dn": "DN250 (10\")",
      "pn": "PN16",
      "faceToFace": 405,
      "height": 460,
      "weightKg": 95,
      "kvFlow": 4600,
      "flangeHoles": 12
    },
    {
      "dn": "DN300 (12\")",
      "pn": "PN16",
      "faceToFace": 470,
      "height": 535,
      "weightKg": 142,
      "kvFlow": 6800,
      "flangeHoles": 12
    }
  ]
},

  {
  "id": "utd-aav-fig-701df-rapid",
  "code": "Fig. 701DF / 702DA",
  "name": "Van Xả Khí Tự Động Kép Tốc Độ Cao UTD (AUTO AIR VALVES - Fig. 701DF)",
  "nameEn": "UTD High-Speed Kinetic Combination Auto Air Release Valve (Fig. 701DF)",
  "category": "auto_air_vent",
  "categoryLabel": "Auto Air Vent valve (Van xả khí tự động)",
  "categoryLabelEn": "Auto Air Vent Valve",
  "systemGroup": "water",
  "systemGroupLabel": "Water Pipeline & High-Rise Riser",
  "image": "/uploads/studio_ball_valve_1791245423293.jpg",
  "badge": "3 Chức Năng (Triple Function)",
  "material": "Thân Gang Cầu Ductile Iron, Cụm phao bóng đôi Inox 304, Ghế van cao su NBR/EPDM",
  "materialEn": "Ductile Iron Body, Dual SS304 Floats, Resilient NBR/EPDM Sealing Seat",
  "materialGroup": "ductile_iron",
  "pressure": "PN10 / PN16 / PN25 (1.0 - 2.5 MPa)",
  "pressureGroup": "pn16",
  "sizeRange": "DN25 - DN200 (1\" - 8\")",
  "tempRange": "-10°C đến 80°C",
  "connection": "Mặt bích tiêu chuẩn EN 1092-2 hoặc Nối ren BSPT (DN25-50)",
  "applicableMedia": [
    "Đỉnh trục đứng cấp nước nhà cao tầng",
    "Đường ống chính truyền dẫn nước",
    "Hệ thống bơm PCCC"
  ],
  "applicableMediaEn": [
    "High-rise Water Risers",
    "Transmission Pipelines",
    "Fire Pumping Loops"
  ],
  "standards": [
    "EN 1074-4",
    "AWWA C512",
    "EN 12266-1",
    "ISO 5208"
  ],
  "description": "Van xả khí tự động đa chức năng (Triple Function) UTD: Tự động xả lượng khí lớn khi nạp đầy đường ống (Air Release), liên tục xả bọt khí li ti trong khi đường ống có áp (Air Venting), và hút lượng khí lớn chống tạo chân không khi xả cạn tuyến ống (Vacuum Break).",
  "descriptionEn": "Triple function kinetic air release valve discharging high air volumes during pipeline filling, releasing entrained micro-bubbles under pressure, and breaking vacuum upon drainage.",
  "highlightFeatures": [
    "Thiết kế buồng kép khí động học (Aerodynamic body) chống hiện tượng bóng phao đóng sớm do luồng khí thổi xiết",
    "Phao bóng Inox 304 hàn kín tuyệt đối, không rỉ sét, chịu được áp lực nước va đập mạnh",
    "Bảo vệ đường ống khỏi nứt vỡ do túi khí nén và chống móp bẹp ống khi xuất hiện áp âm chân không"
  ],
  "highlightFeaturesEn": [
    "Aerodynamic kinetic chamber prevents premature float blowing shut under supersonic air discharge",
    "Dual precision SS304 floats resist pressure hammer and corrosive pipeline media",
    "Eliminates pipeline air pockets that cause pump cavitations and pipe surge rupture"
  ],
  "leakageClass": "Bubble-tight from 0.2 Bar to 25 Bar",
  "testPressureShell": "1.5 x PN (2.4 - 3.8 MPa)",
  "testPressureSeat": "1.1 x PN",
  "referencePriceVnd": 2150000,
  "cadFileAvailable": true,
  "specs": [
    {
      "dn": "DN25 (1\")",
      "pn": "PN16",
      "faceToFace": 120,
      "height": 210,
      "weightKg": 5.5,
      "kvFlow": 0,
      "flangeHoles": 0
    },
    {
      "dn": "DN50 (2\")",
      "pn": "PN16",
      "faceToFace": 185,
      "height": 295,
      "weightKg": 12,
      "kvFlow": 0,
      "flangeHoles": 4
    },
    {
      "dn": "DN80 (3\")",
      "pn": "PN16",
      "faceToFace": 210,
      "height": 345,
      "weightKg": 19.5,
      "kvFlow": 0,
      "flangeHoles": 8
    },
    {
      "dn": "DN100 (4\")",
      "pn": "PN16",
      "faceToFace": 235,
      "height": 410,
      "weightKg": 28,
      "kvFlow": 0,
      "flangeHoles": 8
    },
    {
      "dn": "DN150 (6\")",
      "pn": "PN16",
      "faceToFace": 290,
      "height": 520,
      "weightKg": 46,
      "kvFlow": 0,
      "flangeHoles": 8
    },
    {
      "dn": "DN200 (8\")",
      "pn": "PN16",
      "faceToFace": 350,
      "height": 630,
      "weightKg": 78,
      "kvFlow": 0,
      "flangeHoles": 8
    }
  ]
},

  {
  "id": "utd-flx-fig-s701sf-braided",
  "code": "Fig. S701SF / S702SF",
  "name": "Khớp Nối Mềm Inox Bọc Lưới Chịu Áp Cao UTD (Flexible Joint - Fig. S701SF)",
  "nameEn": "UTD Stainless Steel Braided Flexible Hose Joint with Flanges",
  "category": "flexible_joint",
  "categoryLabel": "Flexible Joint (Khớp nối mềm inox)",
  "categoryLabelEn": "Flexible Joint",
  "systemGroup": "water",
  "systemGroupLabel": "Pump Isolation, HVAC & Steam Piping",
  "image": "/uploads/hero_pipeline_1791245409531.jpg",
  "badge": "Inox 304/316 Chống Rung",
  "material": "Lõi ống ruột gà gợn sóng Inox 304/316, Lớp lưới bện thép không gỉ gia cường, Đầu nối bích Thép mạ kẽm/Inox",
  "materialEn": "Corrugated Stainless Steel SS304/SS316 Bellows, SS Wire Braid, Carbon/SS Flanges",
  "materialGroup": "ss304_316",
  "pressure": "PN16 / PN25 / PN40 (1.6 - 4.0 MPa)",
  "pressureGroup": "pn25",
  "sizeRange": "DN25 - DN300 (1\" - 12\")",
  "tempRange": "-40°C đến +300°C",
  "connection": "Mặt bích xoay (Floating Flange) hoặc Hàn cố định chuẩn DIN / ANSI / JIS",
  "applicableMedia": [
    "Đầu hút xả máy bơm nước",
    "Hệ thống chiller làm mát",
    "Đường ống dẫn hơi nóng lò hơi",
    "Dầu khí"
  ],
  "applicableMediaEn": [
    "Pump Suction/Discharge",
    "HVAC Chillers",
    "Steam Header Pipelines",
    "Fuel Oil"
  ],
  "standards": [
    "EJMA Standards",
    "DIN EN 1092-1",
    "ASME B16.5",
    "ISO 10380"
  ],
  "description": "Khớp nối mềm bằng thép không gỉ bọc lưới bện Inox chịu áp lực cao. Triệt tiêu 95% độ rung lắc và tiếng ồn truyền từ máy bơm vào hệ thống đường ống tòa nhà, chịu được nhiệt độ cao và co giãn nhiệt dọc trục lẫn độ lệch tâm.",
  "descriptionEn": "High pressure stainless steel braided corrugated metal flexible connector designed for severe vibration absorption and thermal pipe movement damping.",
  "highlightFeatures": [
    "Ruột gà Inox 316 gợn sóng sâu uốn cong linh hoạt, triệt tiêu xung động búa nước và rung chấn máy bơm",
    "Lớp lưới đan thép không gỉ cường độ cao chống phồng vỡ khi vận hành ở áp suất PN25 - PN40",
    "Mặt bích xoay tự do (Lap Joint Flange) giúp thợ lắp ráp dễ dàng xoay đúng lỗ bulong không bị vặn xoắn ruột gà"
  ],
  "highlightFeaturesEn": [
    "Deep pitch corrugated stainless bellows dampens mechanical equipment resonance and acoustic noise",
    "High-tensile stainless wire braid jacket withstands working pressures up to 40 Bar",
    "Floating flange ends enable effortless bolt hole alignment without twisting the hose core"
  ],
  "leakageClass": "100% Helium Leak Tested Zero Leakage",
  "testPressureShell": "1.5 x PN (2.4 - 6.0 MPa)",
  "testPressureSeat": "N/A",
  "referencePriceVnd": 1450000,
  "cadFileAvailable": true,
  "specs": [
    {
      "dn": "DN25 (1\")",
      "pn": "PN25",
      "faceToFace": 300,
      "height": 115,
      "weightKg": 3.2,
      "kvFlow": 85,
      "flangeHoles": 4
    },
    {
      "dn": "DN32 (1.25\")",
      "pn": "PN25",
      "faceToFace": 300,
      "height": 140,
      "weightKg": 4,
      "kvFlow": 140,
      "flangeHoles": 4
    },
    {
      "dn": "DN40 (1.5\")",
      "pn": "PN25",
      "faceToFace": 300,
      "height": 150,
      "weightKg": 4.8,
      "kvFlow": 220,
      "flangeHoles": 4
    },
    {
      "dn": "DN50 (2\")",
      "pn": "PN25",
      "faceToFace": 300,
      "height": 165,
      "weightKg": 6.5,
      "kvFlow": 380,
      "flangeHoles": 4
    },
    {
      "dn": "DN65 (2.5\")",
      "pn": "PN25",
      "faceToFace": 300,
      "height": 185,
      "weightKg": 8.2,
      "kvFlow": 650,
      "flangeHoles": 4
    },
    {
      "dn": "DN80 (3\")",
      "pn": "PN25",
      "faceToFace": 300,
      "height": 200,
      "weightKg": 10.5,
      "kvFlow": 1050,
      "flangeHoles": 8
    },
    {
      "dn": "DN100 (4\")",
      "pn": "PN25",
      "faceToFace": 350,
      "height": 220,
      "weightKg": 14.8,
      "kvFlow": 1800,
      "flangeHoles": 8
    },
    {
      "dn": "DN125 (5\")",
      "pn": "PN25",
      "faceToFace": 350,
      "height": 250,
      "weightKg": 19.5,
      "kvFlow": 2800,
      "flangeHoles": 8
    },
    {
      "dn": "DN150 (6\")",
      "pn": "PN16",
      "faceToFace": 350,
      "height": 285,
      "weightKg": 26,
      "kvFlow": 4200,
      "flangeHoles": 8
    },
    {
      "dn": "DN200 (8\")",
      "pn": "PN16",
      "faceToFace": 400,
      "height": 340,
      "weightKg": 42,
      "kvFlow": 8100,
      "flangeHoles": 8
    },
    {
      "dn": "DN250 (10\")",
      "pn": "PN16",
      "faceToFace": 450,
      "height": 405,
      "weightKg": 65,
      "kvFlow": 13500,
      "flangeHoles": 12
    },
    {
      "dn": "DN300 (12\")",
      "pn": "PN16",
      "faceToFace": 500,
      "height": 460,
      "weightKg": 92,
      "kvFlow": 19500,
      "flangeHoles": 12
    }
  ]
},

  {
  "id": "utd-rbj-fig-rj01df-epdm",
  "code": "Fig. RJ01DF / RJ02DF (Cầu đơn / Cầu đôi)",
  "name": "Khớp Nối Cao Su Chống Rung Cầu Đơn & Cầu Đôi UTD (Rubber Joints - Fig. RJ01DF)",
  "nameEn": "UTD Single & Twin Sphere Resilient Rubber Expansion Joint",
  "category": "rubber_joint",
  "categoryLabel": "Rubber joints (Khớp nối cao su)",
  "categoryLabelEn": "Rubber Joint",
  "systemGroup": "water",
  "systemGroupLabel": "HVAC Chiller & Pumping Vibration Damping",
  "image": "/uploads/studio_ball_valve_1791245423293.jpg",
  "badge": "Cầu Đơn / Cầu Đôi EPDM",
  "material": "Thân cao su tổng hợp EPDM nhiều lớp cốt sợi bố Nylon và vành thép cường lực, Mặt bích Thép carbon mạ kẽm",
  "materialEn": "EPDM Rubber with Nylon Cord Reinforcement and Steel Ring, Galvanized Flanges",
  "materialGroup": "ductile_iron",
  "pressure": "PN16 (16 Bar) / Chịu chân không -0.8 Bar",
  "pressureGroup": "pn16",
  "sizeRange": "DN25 - DN600 (1\" - 24\")",
  "tempRange": "-10°C đến +115°C",
  "connection": "Mặt bích tiêu chuẩn BS EN 1092-1 / JIS 10K / ANSI 150",
  "applicableMedia": [
    "Nước tuần hoàn Chiller",
    "Hệ thống bơm cấp thoát nước",
    "Tháp giải nhiệt Cooling Tower"
  ],
  "applicableMediaEn": [
    "Chilled Water",
    "Cooling Tower Loops",
    "Municipal Water Pumping"
  ],
  "standards": [
    "BS EN 1092-1",
    "ISO 9001",
    "JIS B2220",
    "ANSI B16.5"
  ],
  "description": "Khớp nối cao su mềm cầu đơn (Single sphere) và cầu đôi (Twin sphere) UTD sản xuất từ cao su EPDM lưu hóa chất lượng cao, cốt bố nylon đa lớp. Khả năng hấp thụ chuyển vị co giãn nhiệt, chuyển vị góc và giảm tiếng ồn máy bơm vượt trội.",
  "descriptionEn": "Single and twin sphere molded rubber expansion joint designed to compensate for thermal pipe expansion, lateral offset, and isolate pump vibration noise.",
  "highlightFeatures": [
    "Gân lồi cầu cao su chịu áp lực nổ vỡ lên đến 60 Bar, độ đàn hồi tự phục hồi hình dáng ban đầu hoàn hảo",
    "Đệm gờ cao su đúc liền mặt bích giúp bít kín hoàn toàn mà không cần lót thêm gioăng đệm phụ",
    "Khả năng hấp thụ độ co giãn nén dọc trục 15-22mm và độ lệch tâm ngang 12-25mm"
  ],
  "highlightFeaturesEn": [
    "Burst pressure rated exceeding 60 Bar with resilient memory shape retention",
    "Integral self-sealing rubber beads eliminate the necessity of separate flange gaskets",
    "Accommodates large axial compression up to 22mm and lateral deflection up to 25mm"
  ],
  "leakageClass": "Zero Leakage 100% Hydrostatic Tested",
  "testPressureShell": "2.4 MPa (24 Bar)",
  "testPressureSeat": "1.76 MPa",
  "referencePriceVnd": 950000,
  "cadFileAvailable": true,
  "specs": [
    {
      "dn": "DN32 (1.25\")",
      "pn": "PN16",
      "faceToFace": 95,
      "height": 140,
      "weightKg": 2.8,
      "kvFlow": 140,
      "flangeHoles": 4
    },
    {
      "dn": "DN40 (1.5\")",
      "pn": "PN16",
      "faceToFace": 95,
      "height": 150,
      "weightKg": 3.4,
      "kvFlow": 220,
      "flangeHoles": 4
    },
    {
      "dn": "DN50 (2\")",
      "pn": "PN16",
      "faceToFace": 105,
      "height": 165,
      "weightKg": 4.5,
      "kvFlow": 380,
      "flangeHoles": 4
    },
    {
      "dn": "DN65 (2.5\")",
      "pn": "PN16",
      "faceToFace": 115,
      "height": 185,
      "weightKg": 5.8,
      "kvFlow": 650,
      "flangeHoles": 4
    },
    {
      "dn": "DN80 (3\")",
      "pn": "PN16",
      "faceToFace": 130,
      "height": 200,
      "weightKg": 7.2,
      "kvFlow": 1050,
      "flangeHoles": 8
    },
    {
      "dn": "DN100 (4\")",
      "pn": "PN16",
      "faceToFace": 135,
      "height": 220,
      "weightKg": 9.5,
      "kvFlow": 1800,
      "flangeHoles": 8
    },
    {
      "dn": "DN125 (5\")",
      "pn": "PN16",
      "faceToFace": 165,
      "height": 250,
      "weightKg": 13,
      "kvFlow": 2800,
      "flangeHoles": 8
    },
    {
      "dn": "DN150 (6\")",
      "pn": "PN16",
      "faceToFace": 180,
      "height": 285,
      "weightKg": 17.5,
      "kvFlow": 4200,
      "flangeHoles": 8
    },
    {
      "dn": "DN200 (8\")",
      "pn": "PN16",
      "faceToFace": 210,
      "height": 340,
      "weightKg": 26,
      "kvFlow": 8100,
      "flangeHoles": 8
    },
    {
      "dn": "DN250 (10\")",
      "pn": "PN16",
      "faceToFace": 240,
      "height": 405,
      "weightKg": 39,
      "kvFlow": 13500,
      "flangeHoles": 12
    },
    {
      "dn": "DN300 (12\")",
      "pn": "PN16",
      "faceToFace": 260,
      "height": 460,
      "weightKg": 55,
      "kvFlow": 19500,
      "flangeHoles": 12
    }
  ]
},

  {
  "id": "utd-blv-fig-bv101-static",
  "code": "Fig. BV101DF / PICV-SMART",
  "name": "Van Cân Bằng Cơ Học Nối Bích Có Cổng Đo Lưu Lượng UTD (Balancing valves)",
  "nameEn": "UTD Static Manual & Dynamic PICV Balancing Valve with Test Ports",
  "category": "balancing",
  "categoryLabel": "Balancing valves (Van cân bằng)",
  "categoryLabelEn": "Balancing Valve",
  "systemGroup": "hvac",
  "systemGroupLabel": "HVAC Chilled Water & District Heating",
  "image": "/uploads/valve_detail_1791245434603.jpg",
  "badge": "Có Cổng Đo Lưu Lượng (Dual Test Ports)",
  "material": "Thân Gang Cầu EN-GJS-450-10, Đĩa van đồng/inox đệm PTFE, Cổng đo áp suất ren đồng thau tích hợp van tự bít",
  "materialEn": "Ductile Iron EN-GJS-450-10, Bronze/SS Trim, Brass P/T Needle Test Ports",
  "materialGroup": "ductile_iron",
  "pressure": "PN16 / PN25 (1.6 - 2.5 MPa)",
  "pressureGroup": "pn16",
  "sizeRange": "DN50 - DN400 (2\" - 16\")",
  "tempRange": "-10°C đến +130°C",
  "connection": "Mặt bích tiêu chuẩn BS EN 1092-2 / DIN 3202-F1",
  "applicableMedia": [
    "Nước lạnh chiller HVAC",
    "Nước nóng sưởi trung tâm",
    "Hệ thống AHU / FCU"
  ],
  "applicableMediaEn": [
    "HVAC Chilled Water",
    "District Heating",
    "AHU / FCU Coils"
  ],
  "standards": [
    "BS 7350",
    "EN 1092-2",
    "ISO 5208",
    "ASHRAE 90.1"
  ],
  "description": "Van cân bằng tĩnh nối bích trang bị 2 cổng cắm đồng hồ đo chênh áp P/T ports. Cung cấp đường cong đặc tính lưu lượng tuyến tính chính xác, tay vặn có vành chia số hiển thị độ mở và chốt hãm nhớ vị trí cài đặt (Memory stop) sau khi bảo trì.",
  "descriptionEn": "Static manual flanged balancing valve with dual needle pressure test ports, digital vernier handwheel scale, and memory stop feature ensuring balance flow setting retention.",
  "highlightFeatures": [
    "Tích hợp 2 cổng đo áp suất P/T tự làm kín: Kết nối nhanh máy đo lưu lượng điện tử để hiệu chuẩn",
    "Cơ cấu khóa nhớ hành trình (Memory Stop) giúp đóng van để bảo trì và mở lại đúng chính xác độ mở đã cân chỉnh",
    "Độ chính xác lưu lượng đạt ±5% trên toàn bộ dải hành trình theo tiêu chuẩn BS 7350"
  ],
  "highlightFeaturesEn": [
    "Integrated self-sealing pressure test ports for direct computerized manometer flow verification",
    "Mechanical memory stop feature allows shutoff for maintenance and exact return to balanced preset",
    "High flow measurement accuracy within ±5% conforming to BS 7350 standards"
  ],
  "leakageClass": "EN 12266-1 Rate A (Tight Shutoff)",
  "testPressureShell": "2.4 MPa",
  "testPressureSeat": "1.76 MPa",
  "referencePriceVnd": 2850000,
  "cadFileAvailable": true,
  "equivalents": [
    {
      "brand": "Johnson Controls",
      "modelCode": "VP1000 / VG Series",
      "comparisonNote": "Độ chính xác cân bằng lưu lượng tương đương 1:1, cổng đo P/T chuẩn quốc tế."
    },
    {
      "brand": "Danfoss",
      "modelCode": "MSV-F2 Series",
      "comparisonNote": "Chuẩn bích DIN EN 1092-2 thay thế drop-in, tiết kiệm chi phí 30%."
    }
  ],
  "specs": [
    {
      "dn": "DN50 (2\")",
      "pn": "PN16",
      "faceToFace": 230,
      "height": 265,
      "weightKg": 12,
      "kvFlow": 45,
      "flangeHoles": 4
    },
    {
      "dn": "DN65 (2.5\")",
      "pn": "PN16",
      "faceToFace": 290,
      "height": 285,
      "weightKg": 16.5,
      "kvFlow": 75,
      "flangeHoles": 4
    },
    {
      "dn": "DN80 (3\")",
      "pn": "PN16",
      "faceToFace": 310,
      "height": 310,
      "weightKg": 22,
      "kvFlow": 125,
      "flangeHoles": 8
    },
    {
      "dn": "DN100 (4\")",
      "pn": "PN16",
      "faceToFace": 350,
      "height": 345,
      "weightKg": 34,
      "kvFlow": 215,
      "flangeHoles": 8
    },
    {
      "dn": "DN125 (5\")",
      "pn": "PN16",
      "faceToFace": 400,
      "height": 385,
      "weightKg": 49,
      "kvFlow": 330,
      "flangeHoles": 8
    },
    {
      "dn": "DN150 (6\")",
      "pn": "PN16",
      "faceToFace": 480,
      "height": 435,
      "weightKg": 68,
      "kvFlow": 490,
      "flangeHoles": 8
    },
    {
      "dn": "DN200 (8\")",
      "pn": "PN16",
      "faceToFace": 600,
      "height": 530,
      "weightKg": 125,
      "kvFlow": 850,
      "flangeHoles": 8
    },
    {
      "dn": "DN250 (10\")",
      "pn": "PN16",
      "faceToFace": 730,
      "height": 635,
      "weightKg": 195,
      "kvFlow": 1350,
      "flangeHoles": 12
    },
    {
      "dn": "DN300 (12\")",
      "pn": "PN16",
      "faceToFace": 850,
      "height": 720,
      "weightKg": 280,
      "kvFlow": 1950,
      "flangeHoles": 12
    }
  ]
},

  // 26. Hydraulic Water Control Valve - Fig. 500X / 100X / 200X
  {
    id: 'utd-wcv-fig500x-hydraulic',
    code: 'Fig. 500X / 100X / 200X Series',
    name: 'Van Điều Khiển Thủy Lực Đa Năng Xả Áp & Chống Va UTD (Fig. 500X)',
    nameEn: 'UTD Diaphragm Hydraulic Water Control Valve (Fig. 500X / 100X / 200X)',
    category: 'water_control',
    categoryLabel: 'Water Control Valve (Thủy lực)',
    categoryLabelEn: 'Hydraulic Water Control Valve',
    systemGroup: 'water',
    systemGroupLabel: 'Water Main, Pump Surge & Pressure Relief',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Màng Đàn Hồi EPDM Tự Động',
    material: 'Thân Gang Cầu EN-GJS-450-10, Màng cao su EPDM gia cường bố vải nylon, Cụm van Pilot Inox 304/Đồng',
    materialEn: 'Ductile Iron Body EN-GJS-450-10, Nylon Reinforced EPDM Diaphragm, SS304/Bronze Pilot System',
    materialGroup: 'ductile_iron',
    pressure: 'PN16 / PN25 (1.6 - 2.5 MPa)',
    pressureGroup: 'pn16',
    sizeRange: 'DN50 - DN400 (2" - 16")',
    tempRange: '0°C đến 80°C',
    connection: 'Mặt bích tiêu chuẩn BS EN 1092-2 / DIN 3202-F1 / ISO 7005-2',
    applicableMedia: ['Trạm bơm tăng áp cấp nước', 'Hệ thống triệt tiêu xung búa nước', 'Bồn bể điều tiết mực nước'],
    applicableMediaEn: ['Water Booster Stations', 'Surge Anticipator Systems', 'Water Storage Reservoirs'],
    standards: ['EN 1074-5', 'AWWA C530', 'ISO 5208', 'BS EN 1092-2'],
    description: 'Dòng van điều khiển thủy lực dạng màng ngăn tự động vận hành bằng chính áp lực của dòng nước mà không cần nguồn điện ngoài. Tùy biến linh hoạt thành van xả áp nhanh (500X), van phao điều tiết mực nước bể (100X), van giảm áp thủy lực (200X) hoặc van chống va đập nước (600X).',
    descriptionEn: 'Diaphragm actuated multi-function hydraulic control valve powered by pipeline pressure. Configurable as pressure relief (500X), remote float level control (100X), pressure reducing (200X), or surge anticipator (600X).',
    highlightFeatures: [
      'Vận hành hoàn toàn tự động bằng áp lực dòng nước, không phụ thuộc nguồn điện dự phòng',
      'Màng ngăn cao su EPDM đúc gia cường cốt sợi nylon chịu hơn 1.000.000 chu kỳ dao động áp suất',
      'Đóng mở êm dịu, triệt tiêu hoàn toàn hiện tượng búa nước phá hủy hệ thống bơm cao tầng'
    ],
    highlightFeaturesEn: [
      'Self-operated hydraulic diaphragm mechanism requires zero external electric power',
      'Heavy-duty nylon reinforced EPDM diaphragm tested for over 1,000,000 pressure cycles',
      'Modulated slow closing speed completely eliminates destructive hydraulic water hammer'
    ],
    leakageClass: 'ISO 5208 Rate A (Bubble-Tight)',
    testPressureShell: '1.5 x PN (2.4 - 3.8 MPa)',
    testPressureSeat: '1.1 x PN (1.76 MPa)',
    referencePriceVnd: 4200000,
    cadFileAvailable: true,
    equivalents: [
      {
        brand: 'Cla-Val',
        modelCode: '50-01 / 100-01 Series',
        comparisonNote: 'Thiết kế buồng màng và cụm van pilot tương thích 1:1, tiết kiệm 40% chi phí dự án.'
      },
      {
        brand: 'Bermad',
        modelCode: '700 / 800 Series',
        comparisonNote: 'Kích thước lắp đặt tiêu chuẩn ISO/DIN thay thế drop-in hoàn toàn.'
      }
    ],
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 203, height: 260, weightKg: 14.5, kvFlow: 45, flangeHoles: 4 },
      { dn: 'DN65 (2.5")', pn: 'PN16', faceToFace: 216, height: 285, weightKg: 18.0, kvFlow: 75, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 241, height: 320, weightKg: 24.5, kvFlow: 125, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 292, height: 360, weightKg: 38.0, kvFlow: 215, flangeHoles: 8 },
      { dn: 'DN125 (5")', pn: 'PN16', faceToFace: 330, height: 410, weightKg: 52.0, kvFlow: 330, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 356, height: 470, weightKg: 76.0, kvFlow: 490, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 495, height: 580, weightKg: 135.0, kvFlow: 850, flangeHoles: 8 },
      { dn: 'DN250 (10")', pn: 'PN16', faceToFace: 622, height: 690, weightKg: 210.0, kvFlow: 1350, flangeHoles: 12 },
      { dn: 'DN300 (12")', pn: 'PN16', faceToFace: 698, height: 790, weightKg: 310.0, kvFlow: 1950, flangeHoles: 12 },
      { dn: 'DN350 (14")', pn: 'PN16', faceToFace: 787, height: 890, weightKg: 420.0, kvFlow: 2600, flangeHoles: 16 },
      { dn: 'DN400 (16")', pn: 'PN16', faceToFace: 914, height: 980, weightKg: 560.0, kvFlow: 3400, flangeHoles: 16 }
    ]
  }
];

export const VALVES_DATA: ValveProduct[] = [
  ...RAW_UTD_VALVES_DATA.map((v) => ({
    ...v,
    brand: v.brand || 'UTD',
    characteristics: v.characteristics || synthesizeValveCharacteristics(v),
  })),
  ...PARTNER_BRAND_VALVES.map((v) => ({
    ...v,
    characteristics: v.characteristics || synthesizeValveCharacteristics(v),
  })),
  ...AI_CATALOG_SUPPLEMENTS.map((v) => ({
    ...v,
    characteristics: v.characteristics || synthesizeValveCharacteristics(v),
  })),
];
