export interface SelectableValveSpec {
  id: string;
  nameVi: string;
  nameEn: string;
  badge: string;
  category: 'butterfly' | 'ball' | 'gate' | 'globe' | 'check' | 'balancing';
  color: string;
  accentBg: string;
  maxTemp: string;
  maxPressure: string;
  sealingMechanismVi: string;
  sealingMechanismEn: string;
  bestSuitedVi: string;
  bestSuitedEn: string;
  limitationsVi: string;
  limitationsEn: string;
  scores: {
    leakage: number;      // Độ kín khít (Zero Leakage)
    throttling: number;   // Khả năng điều tiết lưu lượng
    deltaP: number;       // Tối ưu tổn thất áp suất
    speed: number;        // Tốc độ đóng ngắt khẩn cấp
    highTemp: number;     // Khả năng chịu nhiệt độ cao
    highPressure: number; // Khả năng chịu áp lực cao
    capex: number;        // Hiệu quả kinh tế cho size lớn (DN100+)
  };
}

export const SELECTABLE_VALVES: SelectableValveSpec[] = [
  {
    id: 'concentric_butterfly',
    nameVi: 'Van Bướm Đồng Tâm Lót Cao Su (Concentric Butterfly)',
    nameEn: 'Concentric Resilient Seated Butterfly Valve',
    badge: 'Đồng Tâm (EPDM/NBR)',
    category: 'butterfly',
    color: '#3b82f6', // blue
    accentBg: 'bg-blue-500/10 border-blue-500/40 text-blue-300',
    maxTemp: '-15°C đến +120°C',
    maxPressure: 'PN16 (16 Bar / 200 PSI)',
    sealingMechanismVi: 'Ma sát nén giữa đĩa kim loại và đệm cao su mềm toàn phần',
    sealingMechanismEn: 'Continuous compression between disc edge and rubber liner',
    bestSuitedVi: 'Cấp thoát nước đô thị, HVAC Chiller, PCCC thông dụng',
    bestSuitedEn: 'Municipal water, chilled HVAC, standard fire sprinklers',
    limitationsVi: 'Không dùng cho hơi nóng, cao su chai nứt trên 120°C',
    limitationsEn: 'Cannot handle steam, rubber degrades above 120°C',
    scores: {
      leakage: 85,
      throttling: 75,
      deltaP: 80,
      speed: 90,
      highTemp: 40,
      highPressure: 50,
      capex: 95
    }
  },
  {
    id: 'hp_butterfly',
    nameVi: 'Van Bướm Lệch Tâm Kép Hiệu Suất Cao (High Performance)',
    nameEn: 'High Performance Double Offset Butterfly Valve',
    badge: 'Lệch Tâm Kép (RTFE)',
    category: 'butterfly',
    color: '#f59e0b', // amber
    accentBg: 'bg-amber-500/10 border-amber-500/40 text-amber-300',
    maxTemp: '-50°C đến +260°C (Đệm RTFE)',
    maxPressure: 'Class 150 - 300 (PN25 - PN50)',
    sealingMechanismVi: 'Chuyển động Cam (Camming action): Đĩa nhấc bổng khỏi đệm ngay khi mở, triệt tiêu mài mòn',
    sealingMechanismEn: 'Camming action lifts disc off seat instantly, eliminating seat friction',
    bestSuitedVi: 'Hơi nóng (Steam), HVAC cao tầng áp lực cao, tuyến tự động ESD',
    bestSuitedEn: 'Steam loops, high-rise HVAC risers, SCADA automated ESD',
    limitationsVi: 'Chi phí đầu tư ban đầu cao gấp 2.2x van đồng tâm',
    limitationsEn: 'Initial CAPEX is 2.2x higher than concentric type',
    scores: {
      leakage: 96,
      throttling: 88,
      deltaP: 82,
      speed: 90,
      highTemp: 95,
      highPressure: 92,
      capex: 78
    }
  },
  {
    id: 'triple_butterfly',
    nameVi: 'Van Bướm Lệch Tâm 3 Kim Loại (Triple Offset Metal Seated)',
    nameEn: 'Triple Offset Metal-to-Metal Butterfly Valve',
    badge: 'Lệch Tâm 3 (Stellite)',
    category: 'butterfly',
    color: '#a855f7', // purple
    accentBg: 'bg-purple-500/10 border-purple-500/40 text-purple-300',
    maxTemp: '-196°C đến +550°C (Siêu nhiệt & Cryogenic)',
    maxPressure: 'Class 150 - 900 (PN25 - PN150)',
    sealingMechanismVi: 'Hình nón lệch góc 3 chiều: Kim loại ép kim loại Stellite chuẩn không ma sát',
    sealingMechanismEn: 'Triple offset conical geometry for true non-rubbing metal-to-metal shutoff',
    bestSuitedVi: 'Lọc hóa dầu, khí thiên nhiên, lò hơi nhiệt độ cực cao, khí âm sâu',
    bestSuitedEn: 'Petrochemical refineries, superheated steam, cryogenic gas lines',
    limitationsVi: 'Đòi hỏi căn chỉnh mặt bích chính xác tuyệt đối, giá thành cao',
    limitationsEn: 'Requires precise flange alignment, highest initial cost among butterflies',
    scores: {
      leakage: 99,
      throttling: 92,
      deltaP: 80,
      speed: 88,
      highTemp: 99,
      highPressure: 96,
      capex: 70
    }
  },
  {
    id: 'floating_ball',
    nameVi: 'Van Bi Nổi (Floating Ball Valve DN15-DN100)',
    nameEn: 'Floating Ball Valve (Soft Seated)',
    badge: 'Bi Nổi (2-PC/3-PC)',
    category: 'ball',
    color: '#10b981', // emerald
    accentBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300',
    maxTemp: '-29°C đến +180°C (PTFE)',
    maxPressure: 'Class 150 - 300 (PN16 - PN40)',
    sealingMechanismVi: 'Áp lực dòng chảy tự đẩy bi ép chặt vào đệm hạ lưu',
    sealingMechanismEn: 'Line pressure pushes the ball into downstream seat',
    bestSuitedVi: 'Đường ống nhỏ DN15-DN100, cách ly nhanh 1/4 vòng nước, dầu, khí',
    bestSuitedEn: 'Small bore DN15-DN100, rapid quarter-turn isolation',
    limitationsVi: 'Trên DN125 hoặc áp cao bị kẹt trục do lực ép bi quá lớn',
    limitationsEn: 'Above DN125 or high DP, seat crushes and stem binds',
    scores: {
      leakage: 98,
      throttling: 40,
      deltaP: 99,
      speed: 95,
      highTemp: 70,
      highPressure: 65,
      capex: 60
    }
  },
  {
    id: 'trunnion_ball',
    nameVi: 'Van Bi Trục Cố Định (Trunnion Mounted Ball Valve)',
    nameEn: 'Trunnion Mounted Heavy Duty Ball Valve',
    badge: 'Trục Cố Định (API 6D)',
    category: 'ball',
    color: '#14b8a6', // teal
    accentBg: 'bg-teal-500/10 border-teal-500/40 text-teal-300',
    maxTemp: '-50°C đến +250°C (RTFE/PEEK) / +400°C (Kim loại)',
    maxPressure: 'Class 150 - 2500 (PN25 - PN420)',
    sealingMechanismVi: 'Bi cố định 2 đầu, đệm lò xo độc lập tự ép (Double Block & Bleed)',
    sealingMechanismEn: 'Anchored ball with spring-energized floating seats (API 6D DBB)',
    bestSuitedVi: 'Đường ống chính Dầu khí, Khí gas áp lực cao từ DN100 đến DN600+',
    bestSuitedEn: 'Mainline oil & gas pipelines, extreme pressure transmission DN100-DN600',
    limitationsVi: 'Trọng lượng rất nặng, chi phí cao cho kích thước nhỏ',
    limitationsEn: 'Heavier weight, economically impractical for small bore',
    scores: {
      leakage: 99,
      throttling: 50,
      deltaP: 99,
      speed: 95,
      highTemp: 88,
      highPressure: 99,
      capex: 50
    }
  },
  {
    id: 'resilient_gate',
    nameVi: 'Van Cổng Nêm Bọc Cao Su Ty Chìm (Resilient NRS Gate)',
    nameEn: 'Resilient Seated Soft Wedge Gate Valve',
    badge: 'Nêm EPDM Ty Chìm',
    category: 'gate',
    color: '#84cc16', // lime
    accentBg: 'bg-lime-500/10 border-lime-500/40 text-lime-300',
    maxTemp: '0°C đến +70°C (Nước)',
    maxPressure: 'PN10 - PN16 / 300 PSI (UL/FM)',
    sealingMechanismVi: 'Nêm cao su nén vào thành thân van nhẵn, đáy phẳng không rãnh đọng cặn',
    sealingMechanismEn: 'Full vulcanized wedge compression against smooth pocketless bore',
    bestSuitedVi: 'Mạng lưới nước sạch đô thị, PCCC chôn ngầm, nước có cát mịn',
    bestSuitedEn: 'Municipal water distribution, underground fire mains, raw water',
    limitationsVi: 'Không điều tiết lưu lượng, không chịu nhiệt độ trên 80°C',
    limitationsEn: 'Zero throttling capability, strictly unsuitable for steam',
    scores: {
      leakage: 99,
      throttling: 10,
      deltaP: 99,
      speed: 25,
      highTemp: 35,
      highPressure: 55,
      capex: 80
    }
  },
  {
    id: 'osy_gate',
    nameVi: 'Van Cổng Ty Nổi Nêm Thép (OS&Y Cast Steel Gate)',
    nameEn: 'OS&Y Cast Steel Solid Wedge Gate Valve',
    badge: 'Ty Nổi Nêm Thép WCB',
    category: 'gate',
    color: '#f97316', // orange
    accentBg: 'bg-orange-500/10 border-orange-500/40 text-orange-300',
    maxTemp: '-29°C đến +425°C (Hơi nóng)',
    maxPressure: 'Class 150 - 600 (PN25 - PN100)',
    sealingMechanismVi: 'Nêm thép chèn kim loại Stellite, ty ren ngoài nhìn rõ vị trí đóng mở',
    sealingMechanismEn: 'Metal-to-metal Stellite wedging with rising stem position indicator',
    bestSuitedVi: 'Hệ hơi nóng lò hơi (Steam), phòng bơm cứu hỏa NFPA 20',
    bestSuitedEn: 'Industrial boilers, power plants, NFPA 20 fire pump headers',
    limitationsVi: 'Đáy có rãnh dễ đọng sỏi, đóng mở nhiều vòng quay chậm',
    limitationsEn: 'Bottom pocket traps debris, slow multi-turn operation',
    scores: {
      leakage: 85,
      throttling: 15,
      deltaP: 99,
      speed: 25,
      highTemp: 98,
      highPressure: 90,
      capex: 70
    }
  },
  {
    id: 'globe_valve',
    nameVi: 'Van Cầu Tiêu Chuẩn (Globe Valve / Bellows Seal)',
    nameEn: 'Standard Industrial Globe Valve',
    badge: 'Van Cầu Điều Tiết',
    category: 'globe',
    color: '#f43f5e', // rose
    accentBg: 'bg-rose-500/10 border-rose-500/40 text-rose-300',
    maxTemp: '-29°C đến +450°C',
    maxPressure: 'PN16 - PN40 / Class 300',
    sealingMechanismVi: 'Đĩa van di chuyển tịnh tiến vuông góc mặt ghế, tinh chỉnh lưu lượng tuyệt hảo',
    sealingMechanismEn: 'Disc moves perpendicularly to seat for precise linear throttling',
    bestSuitedVi: 'Điều tiết lưu lượng hơi bão hòa, dầu truyền nhiệt, giảm áp chính xác',
    bestSuitedEn: 'Precise linear throttling for steam and thermal oil lines',
    limitationsVi: 'Tổn thất áp suất lớn nhất (Delta P cao), tốn năng lượng bơm',
    limitationsEn: 'Highest pressure drop (high Delta P) among all valve types',
    scores: {
      leakage: 99,
      throttling: 98,
      deltaP: 40,
      speed: 35,
      highTemp: 98,
      highPressure: 95,
      capex: 45
    }
  },
  {
    id: 'balancing_valve',
    nameVi: 'Van Cân Bằng Thủy Lực (Dynamic Balancing Valve)',
    nameEn: 'Hydraulic Balancing Valve',
    badge: 'Cân Bằng HVAC',
    category: 'balancing',
    color: '#06b6d4', // cyan
    accentBg: 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300',
    maxTemp: '-10°C đến +130°C',
    maxPressure: 'PN16 - PN25',
    sealingMechanismVi: 'Lỗ tiết lưu biến thiên định hình kèm cổng đo áp suất vi sai P/T',
    sealingMechanismEn: 'Calibrated variable orifice with dual P/T pressure test ports',
    bestSuitedVi: 'Cân bằng lưu lượng FCU/AHU và tuyến ống Chiller tòa nhà',
    bestSuitedEn: 'Hydronic flow balancing for FCU/AHU and chilled water circuits',
    limitationsVi: 'Chỉ dùng cho hệ nước điều hòa kín, không dùng đóng ngắt khẩn cấp',
    limitationsEn: 'Specialized for hydronics, not intended for emergency shutoff',
    scores: {
      leakage: 80,
      throttling: 99,
      deltaP: 50,
      speed: 40,
      highTemp: 65,
      highPressure: 70,
      capex: 65
    }
  },
  {
    id: 'dual_check',
    nameVi: 'Van 1 Chiều Cánh Bướm Lò Xo (Dual Plate Check)',
    nameEn: 'Dual Plate Wafer Check Valve',
    badge: '1 Chiều Cánh Bướm',
    category: 'check',
    color: '#0284c7', // sky
    accentBg: 'bg-sky-500/10 border-sky-500/40 text-sky-300',
    maxTemp: '-20°C đến +150°C',
    maxPressure: 'PN16 - PN25 (Class 150)',
    sealingMechanismVi: 'Hai nửa cánh bướm gập mở tự động bởi lực đẩy dòng chảy và đóng bằng lò xo xoắn',
    sealingMechanismEn: 'Twin hinged plates closed by torsion springs before flow reverses',
    bestSuitedVi: 'Họng xả máy bơm nước, HVAC, PCCC, lắp đặt kẹp bích Wafer gọn nhẹ',
    bestSuitedEn: 'Pump discharge headers, HVAC, fire lines with compact wafer body',
    limitationsVi: 'Không dùng cho lưu chất có nhiều rác sợi lớn vướng trục giữa',
    limitationsEn: 'Unsuitable for fibrous untreated raw sewage',
    scores: {
      leakage: 90,
      throttling: 0,
      deltaP: 80,
      speed: 95,
      highTemp: 75,
      highPressure: 85,
      capex: 92
    }
  },
  {
    id: 'silent_check',
    nameVi: 'Van 1 Chiều Lò Xo Chống Búa Nước (Silent Lift Check)',
    nameEn: 'Silent Non-Slam Spring Check Valve',
    badge: 'Chống Búa Nước',
    category: 'check',
    color: '#6366f1', // indigo
    accentBg: 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300',
    maxTemp: '-10°C đến +180°C',
    maxPressure: 'PN16 - PN40',
    sealingMechanismVi: 'Nón van nâng hạ theo trục dẫn hướng với lò xo nén phản hồi tức thì 0.05 giây',
    sealingMechanismEn: 'Center guided disc with spring return shuts in 0.05s before reverse flow shock',
    bestSuitedVi: 'Triệt tiêu 100% búa nước đường ống tăng áp tòa nhà cao tầng và trạm bơm chính',
    bestSuitedEn: 'Zero water-hammer protection in high-rise booster pump stations',
    limitationsVi: 'Tổn thất áp lực cao hơn dạng cánh bướm do lực cản lò xo và nón van',
    limitationsEn: 'Higher head loss than swing check due to internal spring resistance',
    scores: {
      leakage: 95,
      throttling: 0,
      deltaP: 65,
      speed: 99,
      highTemp: 85,
      highPressure: 92,
      capex: 70
    }
  }
];

export interface ComparisonMetricMeta {
  key: keyof SelectableValveSpec['scores'];
  labelVi: string;
  labelEn: string;
  descVi: string;
  descEn: string;
}

export const COMPARISON_METRICS_META: ComparisonMetricMeta[] = [
  {
    key: 'leakage',
    labelVi: 'Độ Kín Khít (Zero Leakage)',
    labelEn: 'Bubble-Tight Sealing',
    descVi: 'Khả năng ngăn dòng rò rỉ bọt khí theo ISO 5208 Rate A',
    descEn: 'Zero leakage bubble-tight sealing per ISO 5208 Rate A'
  },
  {
    key: 'throttling',
    labelVi: 'Khả Năng Điều Tiết (Throttling)',
    labelEn: 'Throttling Precision',
    descVi: 'Độ chính xác khi kiểm soát lưu lượng mà không gây xói mòn cavitation',
    descEn: 'Linear flow modulation accuracy without cavitation wear'
  },
  {
    key: 'deltaP',
    labelVi: 'Tối Ưu Trở Lực (Low Delta P)',
    labelEn: 'Low Pressure Loss',
    descVi: 'Tổn thất áp thấp giúp giảm điện năng máy bơm tuần hoàn',
    descEn: 'Low head loss saving pumping energy costs'
  },
  {
    key: 'speed',
    labelVi: 'Tốc Độ Đóng Mở (Speed)',
    labelEn: 'Actuation Speed',
    descVi: 'Khả năng cách ly khẩn cấp 1/4 vòng phù hợp tự động ESD',
    descEn: 'Rapid quarter-turn shutoff for emergency ESD'
  },
  {
    key: 'highTemp',
    labelVi: 'Chịu Nhiệt Độ Cao (Thermal Limit)',
    labelEn: 'High Temperature Duty',
    descVi: 'Vận hành ổn định trong môi trường hơi nóng và lò hơi trên 200°C',
    descEn: 'Steam and thermal boiler loops above 200°C'
  },
  {
    key: 'highPressure',
    labelVi: 'Chịu Áp Suất Cao (High Pressure)',
    labelEn: 'High Pressure Rating',
    descVi: 'Khả năng chịu áp lực Class 300 đến Class 2500 không kẹt trục',
    descEn: 'Operating capability up to Class 2500 without binding'
  },
  {
    key: 'capex',
    labelVi: 'Kinh Tế Size Lớn (CAPEX Efficiency)',
    labelEn: 'Large Bore Economy',
    descVi: 'Tối ưu chi phí đầu tư trên từng mm đường kính ống từ DN100+',
    descEn: 'Initial purchase cost efficiency for DN100+ large bore piping'
  }
];
