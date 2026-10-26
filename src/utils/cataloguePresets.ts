import { ValveCategory, SystemGroup } from '../types/valve';

export interface UtdCatalogueFigPreset {
  figCode: string;
  nameVi: string;
  nameEn: string;
  category: ValveCategory;
  systemGroup: SystemGroup;
  material: string;
  materialEn: string;
  pressure: string;
  tempRange: string;
  connection: string;
  sizeRange: string;
  leakageClass: string;
  testPressureShell: string;
  testPressureSeat: string;
  standards: string[];
  descriptionVi: string;
  descriptionEn: string;
  applicableMedia: string[];
  badge: string;
}

export const UTD_CATALOGUE_FIGURE_PRESETS: UtdCatalogueFigPreset[] = [
  {
    figCode: 'Fig. 102TF / 102SF',
    nameVi: 'Van Bi Inox 316 Nối Bích DIN PN16 / Class 150',
    nameEn: 'Stainless Steel SS316 Flanged Ball Valve PN16 / Class 150',
    category: 'ball',
    systemGroup: 'oilgas',
    material: 'Thân đúc Inox 316 / CF8M, Bi van Inox 316 tráng gương, Đệm PTFE + 15% Carbon',
    materialEn: 'Cast Stainless Steel CF8M (SS316), Mirror-polished 316 Ball, Reinforced R-PTFE Seat',
    pressure: 'PN16 / PN25 / Class 150',
    tempRange: '-20°C đến +200°C',
    connection: 'Mặt bích tiêu chuẩn DIN EN 1092-1 / ASME B16.5 RF',
    sizeRange: 'DN15 - DN300 (1/2" - 12")',
    leakageClass: 'ISO 5208 Rate A (Bubble-Tight zero leakage)',
    testPressureShell: '1.5 x PN (Thủy tĩnh 24 - 37.5 bar)',
    testPressureSeat: '1.1 x PN (Khí nén 6 bar)',
    standards: ['ASME B16.34', 'EN 1092-1', 'API 607 Fire Safe', 'API 598', 'ISO 9001:2015'],
    descriptionVi: 'Van bi inox 316 cao cấp UTD đúc nguyên khối tiêu chuẩn quốc tế CF8M. Thiết kế bi van nổi (Floating Ball) hoặc trunnion gắn trục, gioăng làm kín R-PTFE chống ăn mòn hóa chất và áp suất cao. Chuyên dụng cho nhà máy hóa chất, thực phẩm vi sinh, xăng dầu và khí nén sạch.',
    descriptionEn: 'High-performance UTD SS316 ball valve precision cast to ASTM A351 CF8M. Features anti-blowout stem design, reinforced R-PTFE sealing, and full bore flow passage. Engineered for severe corrosive chemical service, food processing, and high-pressure hydrocarbon networks.',
    applicableMedia: ['Hóa chất ăn mòn', 'Axit hữu cơ', 'Dung môi hóa dầu', 'Hơi nóng bão hòa', 'Nước sạch'],
    badge: 'Inox 316 Chuẩn CF8M'
  },
  {
    figCode: 'Fig. 102DF / 102DA1F',
    nameVi: 'Van Bi Gang Cầu Nối Bích DIN PN16 Chống Va Đập',
    nameEn: 'Ductile Iron Flanged Ball Valve DIN PN16 Shock-Proof',
    category: 'ball',
    systemGroup: 'water',
    material: 'Thân Gang cầu GGG50 (EN-GJS-450-10), Bi Inox 304, Đệm PTFE chịu mài mòn',
    materialEn: 'Ductile Iron GGG50 body, SS304 ball, Virgin PTFE seats',
    pressure: 'PN16 (16 Bar / 1.6 MPa)',
    tempRange: '-10°C đến +120°C',
    connection: 'Mặt bích tiêu chuẩn BS EN 1092-2 / DIN 2501',
    sizeRange: 'DN50 - DN250 (2" - 10")',
    leakageClass: 'ISO 5208 Rate A (Zero Leakage)',
    testPressureShell: '1.5 x PN (24 bar)',
    testPressureSeat: '1.1 x PN (17.6 bar)',
    standards: ['BS EN 1092-2', 'ISO 5208', 'ISO 9001:2015'],
    descriptionVi: 'Dòng van bi thân gang cầu dẻo GGG50 độ bền kéo vượt trội so với gang xám thông thường. Bi van bằng thép không gỉ gia công CNC chính xác, đệm PTFE nguyên chất đóng mở nhẹ nhàng, giảm tối đa mô-men xoắn vận hành.',
    descriptionEn: 'Ductile iron GGG50 flanged ball valve offering superior tensile resistance over cast iron. CNC machined stainless steel ball with low-friction PTFE seating ensures smooth low-torque operation for water and municipal utilities.',
    applicableMedia: ['Nước cấp đô thị', 'Nước làm mát tuần hoàn', 'Dầu nhẹ', 'Khí nén công nghiệp'],
    badge: 'Gang Cầu GGG50 Siêu Bền'
  },
  {
    figCode: 'Fig. 401G / G-401G',
    nameVi: 'Van Bướm Tay Gạt / Tay Quay Đệm Cao Su EPDM',
    nameEn: 'Resilient Seated Butterfly Valve Wafer / Lugged Type',
    category: 'butterfly',
    systemGroup: 'water',
    material: 'Thân Gang cầu GGG50, Đĩa Inox 304 (CF8), Gioăng EPDM chịu nhiệt đúc liền',
    materialEn: 'Ductile Iron GGG50 body, SS304 disc, Vulcanized EPDM seat liner',
    pressure: 'PN16 (16 Bar)',
    tempRange: '-10°C đến +120°C',
    connection: 'Kẹp bích đa tiêu chuẩn Wafer (JIS 10K, DIN PN16, ANSI 150)',
    sizeRange: 'DN50 - DN600 (2" - 24")',
    leakageClass: 'ISO 5208 Rate A (Bubble-Tight Sealing)',
    testPressureShell: '24 Bar',
    testPressureSeat: '17.6 Bar',
    standards: ['BS EN 593', 'API 609', 'ISO 5208', 'BS EN 1092-2'],
    descriptionVi: 'Van bướm đệm mềm UTD Fig. 401G là giải pháp kiểm soát dòng chảy tin cậy cho tòa nhà cao tầng và nhà máy công nghiệp. Đĩa van inox 304 mài vát biên dạng hình học tối ưu lực cản lưu lượng, đệm cao su EPDM đàn hồi cao cho độ kín tuyệt đối 100%.',
    descriptionEn: 'UTD Fig. 401G resilient seated butterfly valve is an industry-standard solution for high-rise buildings and industrial plants. Features contoured 304 stainless steel disc and bonded EPDM liner for bidirectional bubble-tight sealing and minimal pressure drop.',
    applicableMedia: ['Nước sinh hoạt', 'Nước lạnh Chiller', 'Hệ thống HVAC', 'Nước làm mát'],
    badge: 'Chuẩn Bán Chạy Nhất'
  },
  {
    figCode: 'Fig. H401 / H401P Series',
    nameVi: 'Van Bướm Hiệu Suất Cao Lệch Tâm 3 Triple Offset Nhiệt Độ 450°C',
    nameEn: 'High Performance Triple-Offset Butterfly Valve 450°C Fire-Safe',
    category: 'butterfly',
    systemGroup: 'steam',
    material: 'Thân Thép đúc WCB / Inox 316, Đĩa Inox CF8M, Ghế van Kim loại Stellite Grade 21',
    materialEn: 'Cast Steel WCB / CF8M, Hardfaced Stellite metal-to-metal seat',
    pressure: 'Class 150 / 300 / 600 (PN25 - PN100)',
    tempRange: '-196°C đến +450°C (Max 550°C)',
    connection: 'Mặt bích ASME B16.5 hoặc Lugged DIN EN 1092-1',
    sizeRange: 'DN80 - DN1200 (3" - 48")',
    leakageClass: 'ISO 5208 Rate A / FCI 70-2 Class VI (Metal-to-Metal Zero Leakage)',
    testPressureShell: '1.5 x Design Pressure',
    testPressureSeat: '1.1 x Design Pressure',
    standards: ['API 609 Category B', 'ASME B16.34', 'API 607 Fire Safe 6th Edition', 'ISO 10497'],
    descriptionVi: 'Van bướm lệch tâm 3 trục hình nón (Triple-Offset) UTD H401 đáp ứng điều kiện làm việc khắc nghiệt nhất: hơi quá nhiệt lò hơi, hóa chất ăn mòn và khí hóa lỏng âm sâu. Không có ma sát trượt khi đóng mở, triệt tiêu mài mòn đệm kim loại, tuổi thọ lên tới hàng triệu chu trình.',
    descriptionEn: 'UTD H401 Triple-Offset butterfly valve engineered for severe service: superheated steam, petrochemical lines, and cryogenic isolation. Zero-friction camming action eliminates seat galling, providing bi-directional firesafe shutoff across extreme temperature ranges.',
    applicableMedia: ['Hơi nóng quá nhiệt', 'Khí đốt tự nhiên', 'Dầu nóng truyền nhiệt', 'Hóa chất nhiệt độ cao'],
    badge: 'Chịu Nhiệt 450°C Lệch Tâm 3'
  },
  {
    figCode: 'Fig. 400DEF',
    nameVi: 'Van Bướm PCCC Tín Hiệu UL/FM 300 PSI Rãnh Ngàm Grooved',
    nameEn: 'UL/FM Fire Protection Monitored Butterfly Valve 300 PSI Grooved',
    category: 'butterfly',
    systemGroup: 'firefighting',
    material: 'Thân Gang cầu Ductile Iron ASTM A536, Đĩa bọc EPDM PCCC, Hộp số kèm công tắc kép',
    materialEn: 'Ductile Iron ASTM A536 body, EPDM encapsulated disc, Supervisory tamper switch',
    pressure: '300 PSI (20.7 Bar) - Test 600 PSI',
    tempRange: 'Tối đa 80°C',
    connection: 'Rãnh ngàm cùm Grooved AWWA C606 & Bích Class 150',
    sizeRange: 'DN50 - DN300 (2" - 12")',
    leakageClass: 'UL 1091 / FM 1112 Zero Leakage',
    testPressureShell: '600 PSI (41.4 Bar)',
    testPressureSeat: '300 PSI (20.7 Bar)',
    standards: ['UL Listed', 'FM Approved', 'NFPA 13', 'AWWA C606'],
    descriptionVi: 'Van bướm cứu hỏa chuyên dụng đạt chứng chỉ kiểm định chất lượng UL/FM của Mỹ. Trang bị hộp số giám sát tích hợp sẵn công tắc điện kép (Supervisory Tamper Switch) báo vị trí đóng mở về tủ trung tâm báo cháy tòa nhà theo chuẩn NFPA.',
    descriptionEn: 'UL/FM certified fire protection butterfly valve rated for 300 PSI working pressure. Equipped with weatherproof internal supervisory tamper switch for remote electronic monitoring by fire alarm control panels per NFPA standards.',
    applicableMedia: ['Nước chữa cháy vách tường', 'Hệ thống Sprinkler', 'Bọt Foam PCCC'],
    badge: 'Chuẩn UL/FM 300 PSI PCCC'
  },
  {
    figCode: 'Fig. 201DF / 202DF',
    nameVi: 'Van Cổng Đệm Mềm Ty Nổi / Ty Chìm Thân Gang Cầu GGG50',
    nameEn: 'Resilient Seated Ductile Iron Gate Valve Rising/Non-Rising Stem',
    category: 'resilient_gate',
    systemGroup: 'water',
    material: 'Thân Gang cầu GGG50, Cửa van bọc cao su EPDM dày, Trục van Inox 420/304',
    materialEn: 'Ductile Iron GGG50 body, Fully vulcanized EPDM wedge, SS420/SS304 stem',
    pressure: 'PN16 (16 Bar) / PN25',
    tempRange: '-10°C đến +80°C',
    connection: 'Mặt bích tiêu chuẩn DIN EN 1092-2 / BS 5163',
    sizeRange: 'DN50 - DN600 (2" - 24")',
    leakageClass: 'ISO 5208 Rate A (Zero Leakage)',
    testPressureShell: '24 Bar',
    testPressureSeat: '17.6 Bar',
    standards: ['BS 5163', 'EN 1171', 'ISO 5208', 'BS EN 1092-2'],
    descriptionVi: 'Van cổng nêm đệm mềm UTD đáy phẳng hoàn toàn không có hốc giữ cặn, loại bỏ hoàn toàn nguy cơ tắc kẹt cát đá trong đường ống cấp nước đô thị. Nêm van bọc cao su EPDM tiếp xúc đàn hồi êm ái, bảo vệ đường ống khỏi búa nước.',
    descriptionEn: 'Full bore straight-through resilient seated gate valve with flat bottom design preventing sediment build-up. Precision rubber encapsulated wedge ensures bubble-tight drop-tight shutoff for potable water distribution systems.',
    applicableMedia: ['Nước cấp sinh hoạt', 'Mạng lưới truyền tải nước', 'Nước thô', 'Trạm bơm'],
    badge: 'Đệm Mềm Không Kẹt Cặn'
  },
  {
    figCode: 'Fig. 303DF / 301DF',
    nameVi: 'Van Một Chiều Bướm 2 Cánh Dual Plate & Lá Lật Inox',
    nameEn: 'Dual Plate Wafer Check Valve & Swing Check Valve SS316',
    category: 'check',
    systemGroup: 'water',
    material: 'Thân Gang cầu GGG50 / Inox 316, Đĩa Inox CF8M, Lò xo Inox 316 đàn hồi nhanh',
    materialEn: 'Ductile Iron / CF8M body, Dual CF8M discs, SS316 spring',
    pressure: 'PN16 / PN25 / Class 150',
    tempRange: '-10°C đến +150°C',
    connection: 'Kẹp bích Wafer siêu mỏng tiết kiệm diện tích',
    sizeRange: 'DN40 - DN600 (1-1/2" - 24")',
    leakageClass: 'ISO 5208 Rate A',
    testPressureShell: '1.5 x PN',
    testPressureSeat: '1.1 x PN',
    standards: ['API 594', 'BS EN 12334', 'ISO 5208'],
    descriptionVi: 'Van một chiều bướm 2 cánh UTD 303DF đóng kín nhờ lực lò xo trợ lực trước khi dòng chảy đảo chiều, triệt tiêu tiếng ồn và hiện tượng va đập búa nước (Water Hammer) làm vỡ đường ống bơm.',
    descriptionEn: 'UTD 303DF dual plate wafer check valve with spring-assisted disc closure prior to flow reversal, effectively eliminating water hammer noise and piping shock waves in pump discharge headers.',
    applicableMedia: ['Nước cấp đầu đẩy bơm', 'Hệ Chiller nước lạnh', 'Nước làm mát', 'Khí nén'],
    badge: 'Chống Va Đập Búa Nước'
  },
  {
    figCode: 'Fig. PRV27 / PRV30',
    nameVi: 'Van Giảm Áp Hơi & Nước Dạng Màng Pilot Chính Xác Cao',
    nameEn: 'Pilot-Operated Pressure Reducing Valve for Steam & Water',
    category: 'prv',
    systemGroup: 'steam',
    material: 'Thân Gang cầu GGG50 / Thép đúc WCB, Màng ngăn Inox 304, Lò xo hợp kim Cr-V',
    materialEn: 'Ductile Iron / Cast Steel WCB, Stainless steel diaphragm, Alloy spring',
    pressure: 'PN16 / PN25 / PN40 (Đầu vào Max 25 Bar, đầu ra 0.5 - 12 Bar)',
    tempRange: '-10°C đến +220°C',
    connection: 'Mặt bích tiêu chuẩn DIN EN 1092-1 / ANSI Class 150',
    sizeRange: 'DN15 - DN150 (1/2" - 6")',
    leakageClass: 'ANSI/FCI 70-2 Class IV',
    testPressureShell: '1.5 x PN',
    testPressureSeat: '1.1 x PN',
    standards: ['EN 1092-1', 'ASME B16.34', 'ISO 9001:2015'],
    descriptionVi: 'Van giảm áp pilot màng ngăn nhạy áp cực cao, tự động điều chỉnh và duy trì áp suất đầu ra ổn định bất kể biến động lưu lượng và áp suất nguồn cấp. Thiết bị cốt lõi trong hệ thống phân phối hơi nóng và cấp nước tòa nhà cao tầng.',
    descriptionEn: 'High-precision pilot-operated pressure reducing valve maintaining accurate downstream setpoint regardless of upstream pressure fluctuations. Essential component for steam distribution headers and tall building plumbing zones.',
    applicableMedia: ['Hơi nóng công nghiệp', 'Khí nén cao áp', 'Nước sinh hoạt tầng thấp'],
    badge: 'Điều Áp Pilot Chính Xác'
  },
  {
    figCode: 'Fig. KGV-10K/PN16',
    nameVi: 'Van Cổng Dao Lưỡi Cắt Inox 316 Bùn & Hóa Chất',
    nameEn: 'Stainless Steel Knife Gate Valve for Slurry & Paper Pulp',
    category: 'knife_gate',
    systemGroup: 'water',
    material: 'Thân Thép đúc / Inox CF8M, Lưỡi dao Inox 316 mài vát cạnh sắc, Gioăng EPDM / PTFE',
    materialEn: 'Cast Steel / CF8M body, SS316 bevelled knife blade, EPDM/PTFE seat',
    pressure: 'PN10 / PN16 (10 - 16 Bar)',
    tempRange: '-10°C đến +150°C',
    connection: 'Kẹp bích Lugged / Wafer MSS-SP-81',
    sizeRange: 'DN50 - DN600 (2" - 24")',
    leakageClass: 'MSS SP-81 / ISO 5208 Rate A',
    testPressureShell: '15 Bar',
    testPressureSeat: '11 Bar',
    standards: ['MSS SP-81', 'ASME B16.5', 'ISO 5208'],
    descriptionVi: 'Van cổng dao UTD sở hữu lưỡi cắt bằng thép không gỉ 316 gia công vát nghiêng có khả năng cắt đứt các sợi rác, xơ gỗ, bột giấy và bùn thải quánh đặc mà không bị kẹt. Đảm bảo dòng chảy thông suốt không nghẽn cặn.',
    descriptionEn: 'UTD knife gate valve equipped with a heavy-duty beveled SS316 gate designed to shear through dense slurry, cellulose fibers, and municipal sludge without jamming, maintaining unobstructed full-port throughput.',
    applicableMedia: ['Bùn thải quánh', 'Bột giấy', 'Xử lý nước thải công nghiệp', 'Tro xỉ nhà máy nhiệt điện'],
    badge: 'Lưỡi Cắt Chống Kẹt Bùn'
  },
  {
    figCode: 'Fig. ST01CTF / ST01SF',
    nameVi: 'Lọc Y Inox 316 / Gang Lưới Lọc Thép Không Gỉ 40-100 Mesh',
    nameEn: 'Y-Strainer SS316 / Ductile Iron with 40-100 Mesh Screen',
    category: 'strainer',
    systemGroup: 'water',
    material: 'Thân đúc Inox 316 CF8M / Gang cầu GGG50, Lưới lọc Inox SS316 2 lớp',
    materialEn: 'Stainless CF8M / Ductile Iron GGG50 body, Dual-layer SS316 mesh filter',
    pressure: 'PN16 / PN25 / Class 150',
    tempRange: '-20°C đến +200°C',
    connection: 'Mặt bích tiêu chuẩn DIN EN 1092-1 / ANSI B16.5',
    sizeRange: 'DN15 - DN400 (1/2" - 16")',
    leakageClass: 'Body Pressure Proof',
    testPressureShell: '1.5 x PN',
    testPressureSeat: '1.1 x PN',
    standards: ['ASME B16.34', 'DIN EN 1092-1', 'ISO 9001:2015'],
    descriptionVi: 'Lọc Y công nghiệp UTD bảo vệ các thiết bị nhạy cảm như đồng hồ đo lưu lượng, máy bơm và van điều khiển khỏi cặn gỉ hàn và tạp chất cơ học. Có van xả đáy xả cặn nhanh không cần tháo nắp bảo trì.',
    descriptionEn: 'Industrial Y-strainer engineered to protect downstream pumps, flow meters, and control valves from pipe scale and debris. Features clean-out blow-off port for easy maintenance without removing the cap.',
    applicableMedia: ['Nước sạch', 'Hơi nóng', 'Hóa chất nhẹ', 'Dầu nhiên liệu'],
    badge: 'Lưới Lọc SS316 Hai Lớp'
  },
  {
    figCode: 'Fig. SS / S02S Series',
    nameVi: 'Van An Toàn Lò Hơi Hơi Nóng Tay Giật Áp Suất Cao',
    nameEn: 'Full Lift High Pressure Safety Valve for Boilers & Steam',
    category: 'safety_valve',
    systemGroup: 'steam',
    material: 'Thân Thép đúc WCB / Gang cầu, Đĩa van Inox 316 đệm Metal-to-Metal, Lò xo thép hợp kim',
    materialEn: 'Cast Steel WCB body, SS316 disc, High-durability alloy spring',
    pressure: 'PN16 / PN25 / PN40 (Cài đặt xả 0.5 - 32 Bar)',
    tempRange: '-20°C đến +350°C',
    connection: 'Mặt bích tiêu chuẩn DIN EN 1092-1 / ASME B16.5',
    sizeRange: 'DN20 - DN150 (3/4" - 6")',
    leakageClass: 'API 527 Tightness',
    testPressureShell: '1.5 x Set Pressure',
    testPressureSeat: 'API 527 Leak Rate',
    standards: ['ASME Section I & VIII', 'API 526', 'API 527', 'ISO 4126-1'],
    descriptionVi: 'Van an toàn hơi nóng xả toàn phần (Full Lift) đạt tiêu chuẩn khắt khe ASME Boiler and Pressure Vessel Code. Tự động xả lượng hơi lớn tức thì khi áp suất vượt ngưỡng an toàn bảo vệ lò hơi và bình tích áp chống nguy cơ phát nổ.',
    descriptionEn: 'Full-lift safety relief valve meeting ASME Section I & VIII boiler safety codes. Instantly exhausts excess vapor when pressure reaches the setpoint, preventing dangerous over-pressurization of steam boilers and autoclaves.',
    applicableMedia: ['Hơi nóng quá nhiệt', 'Khí nén áp suất cao', 'Hơi bão hòa lò hơi'],
    badge: 'Chuẩn ASME An Toàn Lò Hơi'
  }
];

/**
 * Auto-detects matching Figure preset based on model code or valve name
 */
export function findMatchingFigPreset(codeOrName: string): UtdCatalogueFigPreset | undefined {
  if (!codeOrName) return undefined;
  const search = codeOrName.toLowerCase();

  // 1. Direct code search
  for (const preset of UTD_CATALOGUE_FIGURE_PRESETS) {
    const figNum = preset.figCode.toLowerCase().replace('fig.', '').trim();
    const parts = figNum.split('/').map(p => p.trim());
    if (parts.some(p => search.includes(p) || p.includes(search))) {
      return preset;
    }
  }

  // 2. Keyword heuristic search
  if (search.includes('102tf') || search.includes('102sf') || (search.includes('van bi') && search.includes('inox'))) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('102TF'));
  }
  if (search.includes('102df') || search.includes('102da') || (search.includes('van bi') && search.includes('gang'))) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('102DF'));
  }
  if (search.includes('h401') || search.includes('lệch tâm 3') || search.includes('triple')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('H401'));
  }
  if (search.includes('400def') || search.includes('ul/fm') || search.includes('pccc')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('400DEF'));
  }
  if (search.includes('401g') || search.includes('van bướm') || search.includes('butterfly')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('401G'));
  }
  if (search.includes('201df') || search.includes('202df') || search.includes('van cổng') || search.includes('cổng đệm mềm')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('201DF'));
  }
  if (search.includes('303df') || search.includes('301df') || search.includes('một chiều') || search.includes('check')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('303DF'));
  }
  if (search.includes('prv') || search.includes('giảm áp')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('PRV27'));
  }
  if (search.includes('kgv') || search.includes('cổng dao') || search.includes('dao')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('KGV'));
  }
  if (search.includes('st01') || search.includes('lọc y') || search.includes('strainer')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('ST01CTF'));
  }
  if (search.includes('an toàn') || search.includes('safety')) {
    return UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode.includes('SS'));
  }

  return undefined;
}
