import { ValveProduct } from '../types/valve';

/**
 * Authentic AI-curated High-Value Supplements to enrich the core UTD Catalog
 * (Triple Offset Class 300, PICV Electric, Steam Pilot PRV, Thermodynamic Float Trap, SS316 Slurry Knife Gate)
 */
export const AI_CATALOG_SUPPLEMENTS: ValveProduct[] = [
  {
    id: 'utd-supp-01',
    code: 'UTD-BF-3OFF-CL300',
    name: 'Van Bướm Lệch Tâm Ba Triple Offset Kim Loại Class 300 (450°C)',
    nameEn: 'Triple Offset Metal-to-Metal Butterfly Valve ANSI Class 300',
    brand: 'UTD',
    category: 'butterfly',
    categoryLabel: 'Van Bướm Công Nghiệp',
    categoryLabelEn: 'Industrial Butterfly Valves',
    systemGroup: 'steam',
    systemGroupLabel: 'Steam & Petrochemical',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    material: 'Thép đúc WCB / Đĩa Inox 316 / Bệ kim loại Stellite No.6',
    materialEn: 'Cast Steel WCB / SS316 Disc / Stellite No.6 Metal Seat',
    materialGroup: 'cast_steel',
    pressure: 'ANSI Class 300 / PN50 (Thử bền 7.5 MPa)',
    pressureGroup: 'ansi300',
    sizeRange: 'DN50 - DN1200 (2" - 48")',
    tempRange: '-50°C đến +450°C',
    connection: 'Hai Mặt Bích (Double Flanged) / Lug Type',
    applicableMedia: ['Hơi quá nhiệt', 'Dầu nóng truyền nhiệt', 'Nhà máy lọc hóa dầu', 'Khí đốt cao áp', 'Nhiệt điện'],
    applicableMediaEn: ['Superheated Steam', 'Thermal Oil', 'Petrochemical', 'High Pressure Gas', 'Power Plant'],
    standards: ['API 609 Cat B', 'ASME B16.34', 'ISO 5208 Rate A', 'API 607 Fire-Safe'],
    description: 'Dòng van bướm cao cấp nhất với cấu trúc lệch tâm 3 trục hình học triệt tiêu hoàn toàn ma sát khi quay, bệ đĩa kim loại Stellite chịu mài mòn và nhiệt độ 450°C, đạt độ kín khít Zero-Leakage tuyệt đối cho ngành lọc dầu và hơi lò hơi áp lực cao.',
    descriptionEn: 'Premium triple offset geometry eliminating seal friction, stellite hardfaced seat rated up to 450°C, bubble-tight zero leakage certified for petrochemical and high pressure steam.',
    referencePriceVnd: 18500000,
    highlightFeatures: [
      'Cấu trúc Triple Offset góc vát hình nón lệch tâm 3 chiều triệt tiêu ma sát xoay.',
      'Đệm kim loại xếp lớp Inox 316 + Flexible Graphite chịu nhiệt 450°C.',
      'Chứng chỉ chống cháy nổ API 607 và kiểm định độ kín Rate A (Không bọt khí).'
    ],
    highlightFeaturesEn: [
      'Triple offset conical seal geometry eliminates friction during full 90-degree rotation.',
      'Laminated metal SS316 + Flexible Graphite seat rated for 450°C thermal duty.',
      'Fire-safe certified to API 607 with ISO 5208 Rate A bubble-tight shutoff.'
    ],
    leakageClass: 'ISO 5208 Rate A (Zero Bubble)',
    testPressureShell: '1.5 x PN (7.5 MPa)',
    testPressureSeat: '1.1 x PN (5.5 MPa)',
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'Class 300', faceToFace: 108, height: 260, weightKg: 14.5, kvFlow: 95, flangeHoles: 8 },
      { dn: 'DN80 (3")', pn: 'Class 300', faceToFace: 114, height: 310, weightKg: 22.0, kvFlow: 260, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'Class 300', faceToFace: 127, height: 350, weightKg: 31.0, kvFlow: 490, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'Class 300', faceToFace: 140, height: 430, weightKg: 58.0, kvFlow: 1250, flangeHoles: 12 }
    ]
  },
  {
    id: 'utd-supp-02',
    code: 'UTD-BAL-PICV-ELEC',
    name: 'Van Cân Bằng Tự Động Kết Hợp Điều Khiển Điện Áp Suất Độc Lập PICV',
    nameEn: 'Pressure Independent Control Valve (PICV) with Smart Actuator',
    brand: 'UTD',
    category: 'balancing',
    categoryLabel: 'Van Cân Bằng Thủy Lực',
    categoryLabelEn: 'Hydraulic Balancing Valves',
    systemGroup: 'hvac',
    systemGroupLabel: 'HVAC & Chilled Water',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    material: 'Đồng DZR kháng khử kẽm / Gang dẻo GGG40 / Màng EPDM gia cường',
    materialEn: 'DZR Brass / Ductile Iron GGG40 / Reinforced EPDM Diaphragm',
    materialGroup: 'bronze',
    pressure: 'PN16 / PN25 (Chênh áp làm việc 20 - 400 kPa)',
    pressureGroup: 'pn16',
    sizeRange: 'DN15 - DN250 (1/2" - 10")',
    tempRange: '-10°C đến +120°C',
    connection: 'Nối Ren Trong BSPP (DN15-DN50) / Bích DIN (DN65-DN250)',
    applicableMedia: ['Nước lạnh Chiller HVAC', 'Nước nóng năng lượng mặt trời', 'Hệ thống quạt FCU / AHU cao ốc'],
    applicableMediaEn: ['Chilled Water', 'Hot Water', 'AHU / FCU Building Loop'],
    standards: ['BS 7350', 'EN 12165', 'BSRIA Guidelines', 'CE Marking'],
    description: 'Thiết bị 3-trong-1 tối tân cho công trình xanh (Green Building): Tự động duy trì lưu lượng thiết kế chuẩn xác dù áp lực toàn mạng lưới biến thiên, kèm động cơ điện điều khiển tín hiệu 0-10V / 4-20mA kết nối trực tiếp hệ thống quản lý tòa nhà BMS.',
    descriptionEn: 'All-in-one PICV combining dynamic pressure regulation, control valve, and manual balancing with 0-10V / 4-20mA smart actuator for BMS integration.',
    referencePriceVnd: 8900000,
    highlightFeatures: [
      'Tích hợp 3 chức năng: Cân bằng thủy lực + Điều khiển tuyến tính + Ổn áp chênh lệch.',
      'Đo đạc lưu lượng trực tiếp qua 2 cổng cắm áp lực P/T Ports.',
      'Tiết kiệm từ 20% đến 35% điện năng tiêu thụ cho hệ máy bơm Chiller.'
    ],
    highlightFeaturesEn: [
      '3-in-1 integration: Dynamic balancing, linear modulating control, and differential pressure regulator.',
      'Direct flow verification via dual self-sealing P/T pressure ports.',
      'Saves 20-35% of total pumping energy across building chilled water loops.'
    ],
    leakageClass: 'EN 12266-1 Class A',
    testPressureShell: '1.5 x PN',
    testPressureSeat: '1.1 x PN',
    cadFileAvailable: true,
    specs: [
      { dn: 'DN25 (1")', pn: 'PN16', faceToFace: 120, height: 180, weightKg: 3.2, kvFlow: 3.5, flangeHoles: 0 },
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 160, height: 230, weightKg: 6.8, kvFlow: 12.0, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 210, height: 310, weightKg: 19.5, kvFlow: 35.0, flangeHoles: 8 }
    ]
  },
  {
    id: 'utd-supp-03',
    code: 'UTD-PRV-STEAM-PILOT',
    name: 'Van Giảm Áp Hơi Pilot Trực Tiếp Thép Đúc WCB PN25 (Chuyên Lò Hơi)',
    nameEn: 'Pilot-Operated Steam Pressure Reducing Valve Cast Steel WCB PN25',
    brand: 'UTD',
    category: 'prv',
    categoryLabel: 'Van Giảm Áp & Điều Khiển',
    categoryLabelEn: 'Pressure Reducing & Control Valves',
    systemGroup: 'steam',
    systemGroupLabel: 'Boiler & Steam Loop',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    material: 'Thép đúc WCB / Màng kép Inox 316 / Cụm Pilot Inox nguyên khối',
    materialEn: 'Cast Steel WCB / SS316 Dual Diaphragm / Monoblock SS Pilot Assembly',
    materialGroup: 'cast_steel',
    pressure: 'Áp vào tối đa 25 bar (PN25); Áp ra điều chỉnh 0.5 - 14 bar',
    pressureGroup: 'pn25',
    sizeRange: 'DN15 - DN150 (1/2" - 6")',
    tempRange: '-10°C đến +230°C',
    connection: 'Mặt Bích DIN EN 1092-1 / ANSI Class 150',
    applicableMedia: ['Hơi bão hòa', 'Hơi nóng dệt nhuộm', 'Lò hơi thực phẩm & đồ uống', 'Khí nén công nghiệp'],
    applicableMediaEn: ['Saturated Steam', 'Textile Steam', 'Food & Beverage Boiler', 'Compressed Air'],
    standards: ['ASME B16.34', 'DIN EN 12266-1', 'ISO 9001:2015'],
    description: 'Chuyên dụng cho đường ống hơi nóng áp suất cao từ lò hơi chính giảm xuống các phân xưởng sản xuất. Cụm điều khiển Pilot phản xạ cực nhạy, ổn định áp suất ra chính xác sai số dưới ±0.1 bar bất chấp lưu lượng hơi trồi sụt đột ngột.',
    descriptionEn: 'Heavy-duty pilot-operated steam PRV maintaining stable downstream steam pressure within ±0.1 bar under volatile steam demand loads.',
    referencePriceVnd: 14200000,
    highlightFeatures: [
      'Thân thép đúc WCB dày dặn chịu áp lực cao và xung búa hơi.',
      'Màng kép Inox 316 siêu bền, không bị lão hóa rách màng như cao su.',
      'Điều chỉnh áp lực hạ lưu dễ dàng bằng núm xoay ren thang có đai ốc khóa.'
    ],
    highlightFeaturesEn: [
      'Heavy-wall cast steel WCB body impervious to thermal shock and steam water hammer.',
      'Dual SS316 metal diaphragms eliminating elastomer degradation in steam service.',
      'Fine micro-adjusting knob with locknut for exact downstream setpoints.'
    ],
    leakageClass: 'ANSI/FCI 70-2 Class IV',
    testPressureShell: '1.5 x PN',
    testPressureSeat: '1.1 x PN',
    cadFileAvailable: true,
    specs: [
      { dn: 'DN25 (1")', pn: 'PN25', faceToFace: 160, height: 280, weightKg: 12.0, kvFlow: 6.8, flangeHoles: 4 },
      { dn: 'DN50 (2")', pn: 'PN25', faceToFace: 230, height: 360, weightKg: 26.5, kvFlow: 24.0, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN25', faceToFace: 310, height: 450, weightKg: 48.0, kvFlow: 60.0, flangeHoles: 8 }
    ]
  },
  {
    id: 'utd-supp-04',
    code: 'UTD-ST-THERMO-01',
    name: 'Bẫy Hơi Phao Đa Năng Tích Hợp Xả Khí Nhiệt Động Inox (Steam Trap)',
    nameEn: 'Ball Float & Thermodynamic Multi-Function Steam Trap Inox SS316',
    brand: 'UTD',
    category: 'strainer',
    categoryLabel: 'Bẫy Hơi & Phụ Kiện Lò Hơi',
    categoryLabelEn: 'Steam Traps & Boiler Accessories',
    systemGroup: 'steam',
    systemGroupLabel: 'Boiler & Steam Loop',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    material: 'Thân Gang dẻo GGG40 hoặc Inox 316 / Phao Inox 304 nguyên khối',
    materialEn: 'Ductile Iron GGG40 or SS316 / Stainless Steel Floating Ball',
    materialGroup: 'ss304_316',
    pressure: 'PN16 / PN25 / PN40 (Chênh áp Delta P lên đến 14 bar)',
    pressureGroup: 'pn25',
    sizeRange: 'DN15 - DN50 (1/2" - 2")',
    tempRange: 'Đến +300°C',
    connection: 'Nối Ren NPT/BSPT hoặc Mặt Bích DIN/ANSI',
    applicableMedia: ['Nước ngưng tụ hơi nóng (Condensate)', 'Hệ thống gia nhiệt Reboiler', 'Bộ trao đổi nhiệt PHE'],
    applicableMediaEn: ['Steam Condensate', 'Reboiler System', 'Plate Heat Exchanger'],
    standards: ['ISO 6552', 'EN 26704', 'ASME PTC 39'],
    description: 'Bẫy hơi dạng phao cơ học liên tục xả nước ngưng tụ ở nhiệt độ bão hòa, tích hợp van thông khí bimetal xả sạch bọt khí không ngưng khi khởi động lò hơi, giúp bộ trao đổi nhiệt đạt hiệu suất truyền nhiệt 100% không bị đọng nước.',
    descriptionEn: 'Continuous condensate discharge at steam saturation temperature with integrated bimetallic thermostatic air vent preventing air binding.',
    referencePriceVnd: 5600000,
    highlightFeatures: [
      'Xả nước ngưng liên tục theo mực nước thực tế, không gây dao động áp suất hơi.',
      'Cơ cấu xả khí tự động Bimetal triệt tiêu hiện tượng nghẽn khí (Air Binding).',
      'Tích hợp lưới lọc cặn Inox bên trong bảo vệ cơ cấu đòn bẩy.'
    ],
    highlightFeaturesEn: [
      'Modulating float discharges condensate instantly as it forms without steam loss.',
      'Automatic bimetal air vent eliminates air binding during startup.',
      'Built-in stainless steel strainer protects lever and valve mechanism.'
    ],
    leakageClass: 'Zero Steam Loss',
    testPressureShell: '1.5 x PN',
    testPressureSeat: '1.1 x PN',
    cadFileAvailable: true,
    specs: [
      { dn: 'DN20 (3/4")', pn: 'PN25', faceToFace: 120, height: 160, weightKg: 4.5, kvFlow: 1.8, flangeHoles: 4 },
      { dn: 'DN25 (1")', pn: 'PN25', faceToFace: 140, height: 185, weightKg: 6.2, kvFlow: 3.2, flangeHoles: 4 },
      { dn: 'DN40 (1-1/2")', pn: 'PN25', faceToFace: 190, height: 230, weightKg: 11.0, kvFlow: 8.5, flangeHoles: 4 }
    ]
  },
  {
    id: 'utd-supp-05',
    code: 'UTD-KG-SS316-SLURRY',
    name: 'Van Cổng Dao Thân Inox 316 Đệm Kim Loại Chuyên Bùn Thải & Bột Giấy',
    nameEn: 'Stainless Steel Knife Gate Valve for Slurry & Pulp Applications',
    brand: 'UTD',
    category: 'knife_gate',
    categoryLabel: 'Van Cổng & Cửa Van',
    categoryLabelEn: 'Gate & Knife Gate Valves',
    systemGroup: 'water',
    systemGroupLabel: 'Wastewater & Industrial Slurry',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    material: 'Toàn thân Inox 316 (CF8M) / Lưỡi dao Inox 316 đánh bóng vát mép / Đệm PTFE+Metal',
    materialEn: 'Full SS316 (CF8M) Body / Beveled SS316 Knife Blade / PTFE+Metal Seat',
    materialGroup: 'ss304_316',
    pressure: 'PN10 / PN16 (Một chiều hoặc Hai chiều)',
    pressureGroup: 'pn16',
    sizeRange: 'DN50 - DN600 (2" - 24")',
    tempRange: '-20°C đến +180°C',
    connection: 'Kẹp Bích Wafer / Lug Type tiêu chuẩn DIN/ANSI/JIS',
    applicableMedia: ['Bùn thải nhà máy', 'Bột giấy', 'Bột xi măng khô', 'Nước thải công nghiệp nặng', 'Hóa chất ăn mòn'],
    applicableMediaEn: ['Slurry', 'Pulp', 'Cement Powder', 'Heavy Wastewater', 'Corrosive Chemicals'],
    standards: ['MSS SP-81', 'ASME B16.5', 'ISO 5208'],
    description: 'Lưỡi dao thép không gỉ được mài vát mép sắc bén có khả năng cắt đứt các sợi rác, xơ gỗ và khối bùn đặc khi đóng, thân van hẹp tối đa không tạo hốc giữ cặn, là giải pháp lý tưởng thay thế van bướm hay van cổng truyền thống ở các môi chất có hạt rắn lơ lửng.',
    descriptionEn: 'Sharpened beveled stainless knife gate easily shearing through pulp fibers, dense slurry and solids without clogging.',
    referencePriceVnd: 12500000,
    highlightFeatures: [
      'Lưỡi dao vát góc 30 độ cắt đứt sợi xơ và bùn đặc khi ép đóng.',
      'Thiết kế không hốc lõm ở đáy van, triệt tiêu 100% tình trạng kẹt bùn đất.',
      'Dễ dàng chuyển đổi giữa tay vặn vô lăng và xy-lanh khí nén đóng mở tự động.'
    ],
    highlightFeaturesEn: [
      '30-degree beveled knife edge shears through suspended fibers and pulp cake.',
      'Cavity-free self-cleaning body design prevents particulate accumulation.',
      'Easily convertible between manual handwheel and pneumatic actuator.'
    ],
    leakageClass: 'MSS SP-81 Tight Shutoff',
    testPressureShell: '1.5 x PN',
    testPressureSeat: '1.1 x PN',
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 48, height: 285, weightKg: 8.5, kvFlow: 180, flangeHoles: 4 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 51, height: 380, weightKg: 14.5, kvFlow: 820, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 57, height: 490, weightKg: 24.0, kvFlow: 1950, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 60, height: 580, weightKg: 35.0, kvFlow: 3600, flangeHoles: 8 }
    ]
  }
];
