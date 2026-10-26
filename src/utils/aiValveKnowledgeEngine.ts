import { ValveProduct, ValveCategory } from '../types/valve';
import { VALVES_DATA } from '../data/valvesData';

export interface ValveCategoryKnowledge {
  id: string;
  category: ValveCategory | string;
  titleVi: string;
  titleEn: string;
  icon: string;
  taglineVi: string;
  taglineEn: string;
  workingPrincipleVi: string;
  workingPrincipleEn: string;
  applicableMedia: string[];
  designStandards: string[];
  testStandards: string[];
  temperatureRange: string;
  pressureRange: string;
  recommendedMaterials: {
    component: string;
    material: string;
    advantage: string;
  }[];
  prosVi: string[];
  consVi: string[];
  selectionCriteriaVi: string[];
  maintenanceTipsVi: string[];
  crossRefEquivalents: {
    competitorBrand: string;
    competitorModel: string;
    utdEquivalent: string;
    upgradeBenefit: string;
  }[];
}

export interface SystemGapAnalysis {
  coverageScore: number; // e.g. 82 -> 100
  totalSystemValves: number;
  totalCategoriesRepresented: number;
  missingSegments: {
    segmentTitle: string;
    category: string;
    importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    gapReasonVi: string;
    recommendedSupplement: ValveProduct;
    isAlreadyAdded: boolean;
  }[];
}

/**
 * 12 Comprehensive Engineering Knowledge Modules for all Valve Types
 */
export const VALVE_SYSTEM_KNOWLEDGE: ValveCategoryKnowledge[] = [
  {
    id: 'butterfly',
    category: 'butterfly',
    titleVi: 'Van Bướm Công Nghiệp (Butterfly Valve)',
    titleEn: 'Industrial Butterfly Valves',
    icon: '🦋',
    taglineVi: 'Giải pháp đóng ngắt & điều tiết gọn nhẹ, tiết kiệm không gian và chi phí cho đường ống lớn.',
    taglineEn: 'Compact quarter-turn flow control and shut-off solution for large-diameter piping.',
    workingPrincipleVi: 'Vận hành góc quay 90 độ (Quarter-turn), đĩa van hình tròn xoay quanh trục cố định vuông góc với dòng chảy. Khi mở hoàn toàn đĩa van song song với dòng chảy; khi đóng đĩa ép chặt vào vành làm kín (Seat). Các biến thể lệch tâm đôi (Double Offset) và lệch tâm ba (Triple Offset) cho phép triệt tiêu ma sát xoay và vận hành ở nhiệt độ cực cao lên đến 450°C.',
    workingPrincipleEn: 'Operates via a 90-degree disc rotation perpendicular to the flow axis. Double and triple offset designs eliminate seal friction during rotation, permitting high-temperature duty up to 450°C.',
    applicableMedia: ['Nước lạnh Chiller HVAC', 'Nước sinh hoạt', 'Hơi bão hòa', 'Hóa chất nhẹ', 'Khí nén', 'PCCC Sprinkler'],
    designStandards: ['API 609 Cat A/B', 'ASME B16.34', 'DIN EN 593', 'BS 5155', 'ISO 5752'],
    testStandards: ['API 598', 'ISO 5208 Rate A (Bubble-Tight)', 'BS EN 12266-1', 'API 607 Fire-Safe'],
    temperatureRange: '-29°C đến +425°C (Đệm kim loại) / -10°C đến +120°C (Đệm EPDM/NBR)',
    pressureRange: 'PN10 - PN16 - PN25 - PN40 / ANSI Class 150 - Class 300',
    recommendedMaterials: [
      { component: 'Thân van (Body)', material: 'Gang dẻo GGG40 / Thép đúc WCB / Inox CF8M', advantage: 'Chịu lực uốn ống, chống nứt vỡ khi siết bu-lông mặt bích' },
      { component: 'Đĩa van (Disc)', material: 'Inox 304 / 316 / Nhôm đồng Al-Bronze C95400', advantage: 'Kháng mài mòn xâm thực cavitation & kháng nước biển' },
      { component: 'Đệm làm kín (Seat)', material: 'EPDM / PTFE / Metal Laminated SS316+Graphite', advantage: 'Zero-leakage, chịu hóa chất hoặc nhiệt độ hơi cao áp' }
    ],
    prosVi: [
      'Trọng lượng nhẹ hơn van cổng từ 60% - 70%, giảm tải trọng giá đỡ ống.',
      'Kích thước chiều dài Face-to-Face rất ngắn, tiết kiệm diện tích phòng máy.',
      'Thời gian đóng mở nhanh, dễ dàng gắn bộ điều khiển khí nén hoặc mô tơ điện ON/OFF & Tuyến tính 4-20mA.'
    ],
    consVi: [
      'Đĩa van luôn nằm trong tâm dòng chảy gây tổn thất áp suất $(\\Delta P)$ nhẹ hơn van cổng.',
      'Không thể đưa thoi làm sạch đường ống (Pigging) qua van.'
    ],
    selectionCriteriaVi: [
      'Với hệ Chiller/Nước sạch: Chọn thân gang dẻo, đĩa Inox 304, đệm EPDM (PN16).',
      'Với hệ PCCC: Chọn van bướm tay quay có kèm công tắc giám sát tín hiệu điện đạt chuẩn UL/FM.',
      'Với hệ Hơi nóng/Nhiệt điện: Bắt buộc chọn van bướm Triple Offset thân WCB, đệm Metal-to-Metal Class 150/300.'
    ],
    maintenanceTipsVi: [
      'Định kỳ 6 tháng tra mỡ bò chịu nước vào hộp số tay quay.',
      'Trước khi xả đường ống (Blowdown/Flush), phải mở van 100% để tránh cặn hàn làm xước đệm cao su.'
    ],
    crossRefEquivalents: [
      { competitorBrand: 'Johnson Controls', competitorModel: 'VF7000 Series', utdEquivalent: 'UTD-BF-W101 / UTD-BF-L102', upgradeBenefit: 'Thân gang dẻo GGG40 dày hơn 15%, đĩa Inox 316 tiêu chuẩn, giá tốt hơn 30%' },
      { competitorBrand: 'Bray Controls', competitorModel: 'Series 30/31', utdEquivalent: 'UTD-BF-W101 Wafer', upgradeBenefit: 'Đệm EPDM đúc liền viền gân mặt bích, không cần gioăng đệm phụ' },
      { competitorBrand: 'APC Valve', competitorModel: 'BF-Wafer-EPDM', utdEquivalent: 'UTD-BF-W101', upgradeBenefit: 'Bảo hành 24 tháng chính hãng, sẵn hàng kho Bến Thành & An Phú' }
    ]
  },
  {
    id: 'ball',
    category: 'ball',
    titleVi: 'Van Bi Công Nghiệp (Ball Valve)',
    titleEn: 'Industrial Ball Valves',
    icon: '⚽',
    taglineVi: 'Độ kín khít tuyệt đối Zero Leakage, tổn thất áp suất gần như bằng 0 khi mở toàn phần.',
    taglineEn: 'Bubble-tight zero leakage shutoff with minimal pressure drop at full port.',
    workingPrincipleVi: 'Quả bi rỗng có lỗ xuyên tâm (Bore) xoay 90 độ. Khi lỗ trùng với trục ống, dòng lưu chất đi qua với diện tích tiết diện 100% (Full Bore) không gây cản trở dòng chảy. Có 2 cấu trúc chính: Floating Ball (Bi trôi cho áp suất vừa/nhỏ) và Trunnion Mounted (Bi có chốt định vị trục trên/dưới cho đường ống lớn và áp lực cao Class 600 - 1500).',
    workingPrincipleEn: 'Spherical ball with flow passage rotating 90 degrees. Full bore offers zero flow restriction. Available in floating and trunnion-mounted configurations.',
    applicableMedia: ['Dầu khí', 'Khí gas LPG/CNG', 'Hóa chất ăn mòn', 'Nước sạch cao áp', 'Dung môi dược phẩm'],
    designStandards: ['API 6D', 'ASME B16.34', 'BS 5351', 'ISO 17292'],
    testStandards: ['API 598', 'API 6D Annex B', 'API 607 Fire-Safe Test', 'ISO 5208 Rate A'],
    temperatureRange: '-40°C đến +260°C (R-PTFE / PEEK) / Đến +450°C (Metal Seated)',
    pressureRange: '1000 WOG - 2000 WOG - 6000 PSI / ANSI Class 150 - Class 1500',
    recommendedMaterials: [
      { component: 'Thân van (Body)', material: 'Inox 316 (CF8M) / Inox 304 (CF8) / Thép rèn A105', advantage: 'Kháng ăn mòn axit, chịu áp suất shock va đập đường ống' },
      { component: 'Quả bi (Ball)', material: 'SS316 đánh bóng gương Ra < 0.2µm / Mạ Crom cứng', advantage: 'Giảm mô-men xoắn đóng mở, chống trầy xước đệm làm kín' },
      { component: 'Đệm (Seat)', material: 'PTFE / R-PTFE 15% Glass Fiber / PEEK / Stellite', advantage: 'Chịu mài mòn, độ trơ hóa học tuyệt đối' }
    ],
    prosVi: [
      'Hệ số lưu lượng $C_v$ lớn nhất trong tất cả các loại van cùng kích thước.',
      'Khả năng làm kín vượt trội hai chiều (Bidirectional sealing).',
      'Đa dạng cấu hình kết nối: Ren trong NPT/BSPT, Hàn SW/BW, Mặt bích ANSI/DIN/JIS.'
    ],
    consVi: [
      'Không tối ưu cho điều tiết lưu lượng mịn (Throttling) vì dễ gây xoáy xói mòn vành đệm (trừ loại van bi V-Port chuyên dụng).',
      'Giá thành ở kích thước lớn (> DN200) cao hơn van bướm.'
    ],
    selectionCriteriaVi: [
      'Hệ hơi nóng hoặc dầu truyền nhiệt: Chọn van bi 3 mảnh (3-piece) inox đệm PTFE chịu nhiệt.',
      'Hệ khí nén nhà xưởng: Chọn van bi 2 mảnh (2-piece) Full Port inox 304 có khóa an toàn Padlock.',
      'Hệ điều tiết lưu lượng: Bắt buộc chọn van bi góc V (V-Port 30° / 60°) điều khiển khí nén/điện.'
    ],
    maintenanceTipsVi: [
      'Kiểm tra đệm cổ ty (Stem packing); nếu có rò rỉ vi mô hãy siết nhẹ đai ốc cổ ty van.',
      'Không để van bi mở lửng 45 độ trong thời gian dài nếu môi chất có cặn cát.'
    ],
    crossRefEquivalents: [
      { competitorBrand: 'Kitz Corporation', competitorModel: '10UTB / 150UTB', utdEquivalent: 'UTD-BV-F201 / UTD-BV-F150', upgradeBenefit: 'Thân CF8M đúc dày, đệm PTFE nguyên chất, kiểm định test áp lực 100% từng con' },
      { competitorBrand: 'Honeywell', competitorModel: 'V5011 / V5013 Series', utdEquivalent: 'UTD-BV-3W-SS', upgradeBenefit: 'Kết nối mặt bích hoặc ren inox nguyên khối, mô men xoắn nhẹ' }
    ]
  },
  {
    id: 'gate',
    category: 'gate',
    titleVi: 'Van Cổng / Van Cửa (Gate Valve)',
    titleEn: 'Industrial Gate Valves',
    icon: '⛩️',
    taglineVi: 'Tiêu chuẩn vàng cho nhiệm vụ cô lập đường ống chính, tổn thất áp suất bằng 0 khi mở.',
    taglineEn: 'The gold standard for main line pipeline isolation with zero pressure drop.',
    workingPrincipleVi: 'Cửa van hình nêm (Wedge) di chuyển tịnh tiến lên xuống vuông góc với phương dòng chảy. Khi mở hết, đĩa nêm rút hoàn toàn lên khỏi lòng ống, cho dòng chảy thẳng tắp và thông suốt. Có 2 dạng trục: Ty nổi (OS&Y - Outside Screw and Yoke: quan sát được vị trí đóng/mở bằng mắt) và Ty chìm (NRS - Non-Rising Stem: gọn gàng cho hố ngầm).',
    workingPrincipleEn: 'Wedge gate moves vertically perpendicular to flow. Full bore passage. Available in OS&Y (Outside Screw & Yoke) and NRS (Non-Rising Stem) variants.',
    applicableMedia: ['Nước cấp đô thị', 'Hệ thống PCCC ngầm', 'Dầu mỏ thô', 'Nước thải thô', 'Hơi bão hòa'],
    designStandards: ['API 600', 'BS 5163', 'AWWA C509 / C515', 'ASME B16.34', 'DIN 3352'],
    testStandards: ['API 598', 'ISO 5208', 'BS EN 12266-1', 'UL 262 / FM 1120/1130 (PCCC)'],
    temperatureRange: '-20°C đến +425°C (WCB) / -10°C đến +80°C (Gang dẻo bọc cao su EPDM)',
    pressureRange: 'PN10 - PN16 - PN25 / ANSI Class 150 - Class 300 - Class 600',
    recommendedMaterials: [
      { component: 'Thân van (Body)', material: 'Gang dẻo GGG50 / Thép đúc ASTM A216 WCB', advantage: 'Độ bền cơ học cao, chống búa nước và biến dạng nền đất' },
      { component: 'Đĩa nêm (Wedge)', material: 'Gang dẻo bọc 100% cao su EPDM / Đĩa thép mạ Stellite', advantage: 'Kín nước 100% không đọng rác dưới đáy van' },
      { component: 'Ty van (Stem)', material: 'Inox 410 / Inox 304 / Đồng đúc', advantage: 'Chống rỉ sét, ren thang chịu lực xoay nhẹ nhàng' }
    ],
    prosVi: [
      'Dòng chảy đi thẳng, áp lực tổn thất bằng 0, tiết kiệm điện năng cho máy bơm.',
      'Khả năng chịu áp lực cao và chống va đập búa nước cực tốt.',
      'Loại nêm bọc cao su không có hốc lõm ở đáy, triệt tiêu tình trạng kẹt đá sỏi.'
    ],
    consVi: [
      'Thời gian đóng mở lâu do phải quay nhiều vòng tay vặn.',
      'Kích thước chiều cao lớn, đặc biệt là loại van ty nổi OS&Y.',
      'Tuyệt đối không dùng để tiết lưu điều chỉnh lưu lượng (dễ gãy đĩa van do rung lắc).'
    ],
    selectionCriteriaVi: [
      'Công trình PCCC tòa nhà: Bắt buộc chọn van cổng ty nổi OS&Y đạt chuẩn UL/FM có gắn công tắc giám sát.',
      'Hệ cấp thoát nước ngầm: Chọn van cổng ty chìm NRS thân gang dẻo, nêm bọc EPDM, nắp chụp ty van để thao tác bằng khóa T.',
      'Đường ống hơi quá nhiệt: Bắt buộc chọn van cổng thép đúc WCB Class 300 nêm cứng Stellite.'
    ],
    maintenanceTipsVi: [
      'Hàng tháng phải tra mỡ bò vào phần ty van lộ thiên (đối với van OS&Y).',
      'Định kỳ 3-6 tháng nên vận hành quay đóng/mở van 1 lần để tránh kẹt cặn bám.'
    ],
    crossRefEquivalents: [
      { competitorBrand: 'Shield Protection', competitorModel: 'OS&Y Gate Valve UL/FM', utdEquivalent: 'UTD-GV-OSY-ULFM', upgradeBenefit: 'Sơn Epoxy nhiệt kết dính Fusion Bonded dày 300µm cả trong và ngoài, chống gỉ sét trọn đời' },
      { competitorBrand: 'VYC Industrial', competitorModel: 'Model 004 Gate Valve', utdEquivalent: 'UTD-GV-WCB-CL150', upgradeBenefit: 'Chuẩn mặt bích ASME B16.5, thân đúc nguyên khối dày dặn' }
    ]
  },
  {
    id: 'globe',
    category: 'globe',
    titleVi: 'Van Cầu / Van Chữ Ngã (Globe Valve)',
    titleEn: 'Industrial Globe Valves',
    icon: '🌐',
    taglineVi: 'Đỉnh cao điều tiết lưu lượng và cô lập an toàn cho hơi nóng lò hơi nhiệt độ cao.',
    taglineEn: 'Master of precise flow throttling and high-temperature steam isolation.',
    workingPrincipleVi: 'Dòng chảy chuyển hướng hình chữ S (chữ ngã) bên trong thân van. Đĩa van di chuyển thẳng góc ép xuống bệ van phẳng. Vì khoảng cách dịch chuyển ngắn và dòng chảy đi qua tiết diện vòng tròn đều, van cầu là lựa chọn số 1 cho điều tiết áp suất, lưu lượng và chịu được vận tốc dòng chảy cao mà không bị rung giật.',
    workingPrincipleEn: 'S-shaped internal flow path. Disc moves directly onto the seat. Ideal for precise throttling and high differential pressure service.',
    applicableMedia: ['Hơi bão hòa (Steam)', 'Hơi quá nhiệt (Superheated Steam)', 'Dầu truyền nhiệt (Hot Thermal Oil)', 'Nước ngưng tụ', 'Khí nén cao áp'],
    designStandards: ['BS 1873', 'ASME B16.34', 'DIN EN 13709', 'API 623'],
    testStandards: ['API 598', 'ISO 5208 Rate A', 'DIN EN 12266-1'],
    temperatureRange: '-29°C đến +450°C (WCB) / -50°C đến +550°C (Thép hợp kim WC6/WC9)',
    pressureRange: 'PN16 - PN25 - PN40 - PN64 / ANSI Class 150 - Class 300 - Class 600',
    recommendedMaterials: [
      { component: 'Thân van (Body)', material: 'Thép đúc ASTM A216 WCB / Thép rèn A105', advantage: 'Kháng mỏi nhiệt, chống rò rỉ rạn nứt dưới chu kỳ nhiệt độ cao' },
      { component: 'Đĩa & Bệ (Disc & Seat)', material: 'Inox 410 / Inox 316 hàn phủ Stellite No.6', advantage: 'Chống xói mòn cắt rãnh (Wire Drawing) do tia hơi nước tốc độ cao' },
      { component: 'Bộ ống xếp (Bellows)', material: 'Inox nhiều lớp SS316Ti / Inconel', advantage: 'Triệt tiêu 100% rò rỉ hơi ra môi trường qua cổ ty van' }
    ],
    prosVi: [
      'Khả năng điều tiết lưu lượng chính xác và ổn định nhất.',
      'Hành trình đóng mở ngắn hơn van cổng rất nhiều (ít mòn bề mặt làm kín).',
      'Độ kín cực cao, dễ bảo dưỡng phục hồi rà lại mặt bệ đĩa.'
    ],
    consVi: [
      'Tổn thất áp lực qua van cao hơn do đường đi zíc-zắc.',
      'Lực đóng van tương đối lớn vì áp suất dòng chảy tác động trực tiếp vào diện tích đĩa.'
    ],
    selectionCriteriaVi: [
      'Hệ lò hơi dệt may, thực phẩm, sấy: Chọn van cầu Bellows Seal thân WCB PN25 / PN40 chống thất thoát nhiệt.',
      'Hệ dầu truyền nhiệt 300°C: Bắt buộc chọn van cầu có đệm ống xếp Bellows Seal đa lớp.',
      'Đường xả đáy nồi hơi: Chọn van cầu chữ ngã Blowdown chuyên dụng chịu áp suất sốc.'
    ],
    maintenanceTipsVi: [
      'Tuyệt đối không dùng đòn bẩy quá dài để siết tay vặn (dễ làm cong ty van).',
      'Nếu là loại van cầu packing thường, cần kiểm tra siết lại packing sau khi hệ thống đạt nhiệt độ làm việc ổn định (Hot torquing).'
    ],
    crossRefEquivalents: [
      { competitorBrand: 'Spirax Sarco', competitorModel: 'BSA Series Bellows Sealed Globe Valve', utdEquivalent: 'UTD-GL-BS01', upgradeBenefit: 'Tương thích 100% chiều dài Face-to-Face DIN EN 558, đệm Bellows Seal Inox 316Ti, bảo hành 2 năm' },
      { competitorBrand: 'Kitz Corporation', competitorModel: '10SP / 20SY Globe Valve', utdEquivalent: 'UTD-GL-WCB-PN25', upgradeBenefit: 'Thân đúc thép WCB chất lượng cao, bệ hàn Stellite chống xói mòn' }
    ]
  },
  {
    id: 'check',
    category: 'check',
    titleVi: 'Van Một Chiều (Check Valve)',
    titleEn: 'Industrial Check Valves',
    icon: '↩️',
    taglineVi: 'Bảo vệ máy bơm và đường ống tự động, ngăn chặn hiện tượng búa nước và dòng chảy ngược.',
    taglineEn: 'Automatic reverse flow prevention protecting pumps and pipelines against water hammer.',
    workingPrincipleVi: 'Tự động mở khi áp lực đầu vào lớn hơn đầu ra, và tự động đóng lại khi dòng chảy dừng hoặc đảo chiều. Các dòng phổ biến: Lá lật (Swing Check), Cánh bướm 2 cánh lò xo (Dual Plate Wafer Check: đóng siêu êm chống búa nước), Dạng đĩa nâng (Lift/Piston Check cho đường ống hơi nhỏ) và Van hút cối rọ bơm (Foot Valve).',
    workingPrincipleEn: 'Automatic operation based on flow differential. Prevents backflow damage. Types: Swing, Dual Plate Wafer, Lift, and Silent check.',
    applicableMedia: ['Nước cấp sau máy bơm', 'Hệ thống Chiller', 'Hơi bão hòa', 'Hệ thống cứu hỏa', 'Xử lý nước thải'],
    designStandards: ['API 594', 'API 6D', 'BS 5153', 'ASME B16.34', 'DIN EN 12334'],
    testStandards: ['API 598', 'ISO 5208', 'BS EN 12266-1'],
    temperatureRange: '-20°C đến +350°C (Kim loại) / -10°C đến +100°C (Đệm EPDM/NBR)',
    pressureRange: 'PN10 - PN16 - PN25 - PN40 / ANSI Class 150 - Class 300',
    recommendedMaterials: [
      { component: 'Thân van (Body)', material: 'Gang dẻo GGG40 / Thép đúc WCB / Inox 316', advantage: 'Kháng áp lực dội ngược của búa nước cực đại' },
      { component: 'Đĩa van (Plates/Disc)', material: 'Inox 304 / Inox 316 / Nhôm đồng Al-Bronze', advantage: 'Trọng lượng nhẹ, phản xạ đóng tức thì khi dòng chảy dừng' },
      { component: 'Lò xo (Spring)', material: 'Inconel X-750 / Inox 316', advantage: 'Chống mỏi đàn hồi, đảm bảo đóng trước khi dòng nước kịp đảo chiều' }
    ],
    prosVi: [
      'Hoàn toàn tự động, không cần cấp nguồn điện hay khí nén.',
      'Dòng Dual Plate Wafer đóng cực êm (Silent non-slam), triệt tiêu tiếng va đập búa nước trong trạm bơm cao ốc.',
      'Bảo vệ cánh quạt máy bơm không bị quay ngược gây cháy động cơ.'
    ],
    consVi: [
      'Nếu chọn sai kích thước quá lớn, đĩa van sẽ bị dao động rung lắc liên tục (Chattering) gây mòn bản lề.',
      'Không quan sát được trực tiếp vị trí đóng mở từ bên ngoài (trừ loại lá lật có cần đối trọng).'
    ],
    selectionCriteriaVi: [
      'Cửa đẩy máy bơm cao ốc / chung cư: Bắt buộc dùng Van một chiều cánh bướm lò xo Dual Plate (Silent Check) để chống tiếng ồn búa nước.',
      'Đường ống nước thải lẫn rác: Dùng Van một chiều bi trượt bọc cao su (Ball Check Valve) để rác trôi qua không mắc kẹt.',
      'Đường ống hơi sau bẫy hơi: Dùng Van một chiều dạng đĩa nâng lò xo Inox (Disco Check Valve).'
    ],
    maintenanceTipsVi: [
      'Lắp đặt cách cửa đẩy máy bơm tối thiểu 5 lần đường kính ống ($5 \\times D$) để dòng chảy ổn định, không gây xoáy gãy lò xo.',
      'Kiểm tra định kỳ độ đàn hồi của lò xo và gioăng cao su.'
    ],
    crossRefEquivalents: [
      { competitorBrand: 'Johnson Controls', competitorModel: 'Check Valve JV Series', utdEquivalent: 'UTD-CK-DUAL-PN16', upgradeBenefit: 'Lò xo Inconel đàn hồi cao cấp, đệm cao su EPDM đúc áp lực kín khít tuyệt đối' },
      { competitorBrand: 'Danfoss', competitorModel: 'Socla Type 402', utdEquivalent: 'UTD-CK-SILENT-01', upgradeBenefit: 'Đóng êm triệt tiêu búa nước, giá thành tối ưu cho nhà thầu EPC' }
    ]
  },
  {
    id: 'prv',
    category: 'pressure_reducing',
    titleVi: 'Van Giảm Áp Thủy Lực & Hơi Nóng (PRV)',
    titleEn: 'Pressure Reducing Valves',
    icon: '📉',
    taglineVi: 'Ổn định áp suất hạ lưu chuẩn xác, bảo vệ toàn bộ mạng lưới đường ống và thiết bị tiêu thụ.',
    taglineEn: 'Precise downstream pressure regulation protecting pipelines and equipment.',
    workingPrincipleVi: 'Hoạt động theo nguyên lý cân bằng áp suất giữa lò xo điều chỉnh và màng áp lực thủy lực. Khi áp suất hạ lưu tăng, màng đẩy đĩa van đóng bớt; khi áp suất hạ lưu giảm, lò xo ép mở đĩa van để cấp thêm lưu chất. Loại Pilot-operated cho phép điều khiển áp lực chính xác đến từng 0.1 bar bất kể lưu lượng biến thiên.',
    workingPrincipleEn: 'Direct-acting or pilot-operated pressure balancing mechanism stabilizing downstream setpoint pressure regardless of upstream fluctuations.',
    applicableMedia: ['Nước sinh hoạt tòa nhà cao tầng', 'Mạng lưới PCCC', 'Hơi bão hòa lò hơi', 'Khí nén trung tâm'],
    designStandards: ['EN 1074-5', 'AWWA C530', 'ASME B16.34', 'DIN 3822'],
    testStandards: ['ISO 5208', 'EN 12266-1', 'UL 1739'],
    temperatureRange: '0°C đến +80°C (Hệ nước) / Đến +220°C (Hệ hơi nước nóng)',
    pressureRange: 'Áp lực vào PN16 / PN25; Áp lực ra điều chỉnh từ 1.0 đến 12.0 bar',
    recommendedMaterials: [
      { component: 'Thân van (Body)', material: 'Gang dẻo GGG50 / Thép đúc WCB / Đồng Bronze', advantage: 'Kháng áp suất cao, chịu được chênh áp lớn mà không bị rỗ' },
      { component: 'Cụm Pilot điều khiển', material: 'Inox 304 / Đồng thau mạ Crom', advantage: 'Phản ứng nhanh nhạy, không bị đóng cặn rỉ sét làm kẹt van' },
      { component: 'Màng van (Diaphragm)', material: 'EPDM gia cường sợi Nylon đàn hồi', advantage: 'Độ bền uốn trên 500,000 chu kỳ dao động áp lực' }
    ],
    prosVi: [
      'Giữ áp suất hạ lưu luôn ổn định chính xác, chống vỡ đường ống và thiết bị vệ sinh cao cấp.',
      'Có van kim (Needle valve) điều chỉnh tốc độ đóng mở, triệt tiêu xung áp lực.',
      'Dễ dàng tích hợp đồng hồ đo áp suất trước và sau van để theo dõi trực quan.'
    ],
    consVi: [
      'Cần có bộ lọc Y phía trước vì cặn bẩn nhỏ có thể làm tắc đường ống Pilot.',
      'Cần có chênh lệch áp suất tối thiểu (thường là 0.5 - 1.0 bar) để van hoạt động mượt mà.'
    ],
    selectionCriteriaVi: [
      'Hệ thống cấp nước tòa nhà cao tầng: Chọn van giảm áp thủy lực Pilot thân gang dẻo PN16/PN25.',
      'Hệ thống hơi lò hơi: Bắt buộc chọn van giảm áp hơi dạng Pilot thân thép đúc WCB, màng Inox chịu nhiệt.',
      'Căn hộ chung cư cao cấp: Dùng van giảm áp tác động trực tiếp thân đồng ren mạ Niken.'
    ],
    maintenanceTipsVi: [
      'Bắt buộc lắp van lọc Y trước van giảm áp và xả cặn định kỳ 3 tháng/lần.',
      'Lắp đồng hồ áp suất trước và sau van để căn chỉnh núm vặn áp lực chính xác theo thực tế.'
    ],
    crossRefEquivalents: [
      { competitorBrand: 'Spirax Sarco', competitorModel: 'DP27 / DP143 Steam PRV', utdEquivalent: 'UTD-PRV-STEAM-PILOT', upgradeBenefit: 'Màng inox kép chịu nhiệt, bệ van Stellite, chi phí thay thế tiết kiệm 40%' },
      { competitorBrand: 'Johnson Controls', competitorModel: 'PRV Hydraulic Series', utdEquivalent: 'UTD-PRV-HYD-PN16', upgradeBenefit: 'Pilot inox 304 nguyên khối, điều chỉnh dải áp rộng 1.5 - 12 bar' }
    ]
  },
  {
    id: 'balancing',
    category: 'balancing',
    titleVi: 'Van Cân Bằng Thủy Lực (Balancing Valve / PICV)',
    titleEn: 'Hydraulic Balancing Valves & PICV',
    icon: '⚖️',
    taglineVi: 'Tối ưu hóa phân phối lưu lượng cho hệ HVAC Chiller, tiết kiệm 20% - 35% điện năng bơm.',
    taglineEn: 'Optimum flow distribution for chilled water systems saving 20-35% pump energy.',
    workingPrincipleVi: 'Điều chỉnh lưu lượng chính xác đến từng dàn lạnh FCU/AHU trong hệ Chiller. Dạng tĩnh (Manual) sử dụng lỗ đo chênh áp để đo đạc bằng máy đo lưu lượng. Dạng động tự động (PICV - Pressure Independent Control Valve) tích hợp van chênh áp tự động bên trong, tự triệt tiêu biến thiên áp suất và giữ lưu lượng chuẩn xác 100% khi kết hợp với actuator điều khiển BMS.',
    workingPrincipleEn: 'Ensures designed flow distribution across HVAC hydronic coils. PICV automatically compensates for system pressure fluctuations.',
    applicableMedia: ['Nước lạnh Chiller', 'Nước nóng sưởi ấm', 'Nước tháp giải nhiệt Cooling Tower'],
    designStandards: ['BS 7350', 'EN 12165', 'ASHRAE 90.1'],
    testStandards: ['ISO 5208', 'EN 12266-1', 'BSRIA Application Guide'],
    temperatureRange: '-10°C đến +120°C',
    pressureRange: 'PN16 - PN25',
    recommendedMaterials: [
      { component: 'Thân van (Body)', material: 'Đồng DZR (Kháng khử kẽm) / Gang dẻo GGG40', advantage: 'Chống ăn mòn điện hóa, chịu áp lực nước tuần hoàn liên tục' },
      { component: 'Cổng đo chênh áp', material: 'Đồng thau kèm van tự bịt kín (Self-sealing)', advantage: 'Cắm kim đo lưu lượng nhanh mà không bị rò rỉ nước' }
    ],
    prosVi: [
      'Giải quyết dứt điểm tình trạng tầng gần bơm thì quá lạnh, tầng xa bơm thì không đủ lạnh.',
      'Tiết kiệm từ 20% đến 35% năng lượng tiêu thụ của hệ thống máy bơm Chiller.',
      'Dòng PICV thay thế cùng lúc 3 thiết bị: Van cân bằng + Van điều khiển tuyến tính + Van chênh áp.'
    ],
    consVi: [
      'Yêu cầu kỹ sư vận hành phải biết sử dụng máy đo lưu lượng thủy lực chuyên dụng.',
      'Chất lượng nước tuần hoàn cần được xử lý khử cặn để đảm bảo màng áp lực PICV bền bỉ.'
    ],
    selectionCriteriaVi: [
      'Hệ thống FCU văn phòng: Chọn van cân bằng tự động PICV ren đồng DZR DN20 - DN50.',
      'Hệ thống AHU trung tâm / Đường nhánh tầng: Dùng van cân bằng tĩnh mặt bích gang dẻo DN65 - DN300.'
    ],
    maintenanceTipsVi: [
      'Gắn nắp đậy bảo vệ cổng cắm kim đo áp để tránh bụi bẩn làm nghẹt cổng đo.',
      'Ghi lại thông số áp suất và độ mở vạch chia sau khi nghiệm thu cân chỉnh hệ thống.'
    ],
    crossRefEquivalents: [
      { competitorBrand: 'Danfoss', competitorModel: 'AB-QM PICV Series', utdEquivalent: 'UTD-BAL-PICV-ELEC', upgradeBenefit: 'Tích hợp động cơ bước tuyến tính 0-10V, độ chính xác lưu lượng sai số < 3%' },
      { competitorBrand: 'Honeywell', competitorModel: 'V5004T Kombi-QM', utdEquivalent: 'UTD-BAL-PICV-ELEC', upgradeBenefit: 'Tương thích mọi giao thức BMS BACnet / Modbus RTU' }
    ]
  }
];

import { AI_CATALOG_SUPPLEMENTS } from '../data/supplementValvesData';
export { AI_CATALOG_SUPPLEMENTS };

/**
 * Performs AI System Gap Analysis on the catalog
 */
export function analyzeProductSystemGaps(currentProducts: ValveProduct[] = VALVES_DATA): SystemGapAnalysis {
  const currentCodes = new Set(currentProducts.map(p => p.code.toUpperCase()));
  const currentCategories = new Set(currentProducts.map(p => p.category));

  const missingSegments: SystemGapAnalysis['missingSegments'] = [];

  AI_CATALOG_SUPPLEMENTS.forEach(supp => {
    const isAlreadyAdded = currentCodes.has(supp.code.toUpperCase());
    let importance: 'CRITICAL' | 'HIGH' | 'MEDIUM' = 'HIGH';
    let gapReasonVi = '';

    if (supp.code.includes('3OFF')) {
      importance = 'CRITICAL';
      gapReasonVi = 'Hệ thống thiếu dòng Van Bướm Lệch Tâm Ba Triple Offset Class 300 chịu nhiệt 450°C kim loại cho nhà máy nhiệt điện, lọc hóa dầu và hơi lò hơi áp lực cao.';
    } else if (supp.code.includes('PICV')) {
      importance = 'CRITICAL';
      gapReasonVi = 'Hệ thống thiếu Van Cân Bằng Tự Động Kết Hợp Điều Khiển Điện Áp Suất Độc Lập PICV cho các công trình HVAC Chiller tòa nhà xanh tiết kiệm năng lượng.';
    } else if (supp.code.includes('STEAM-PILOT')) {
      importance = 'HIGH';
      gapReasonVi = 'Hệ thống thiếu Van Giảm Áp Hơi Pilot Trực Tiếp Thân Thép Đúc WCB PN25 cho phân xưởng lò hơi công nghiệp.';
    } else if (supp.code.includes('ST-THERMO')) {
      importance = 'HIGH';
      gapReasonVi = 'Hệ thống thiếu Bẫy Hơi Phao Cơ Học Xả Khí Tự Động Inox thu hồi nước ngưng lò hơi.';
    } else if (supp.code.includes('SLURRY')) {
      importance = 'MEDIUM';
      gapReasonVi = 'Hệ thống thiếu Van Cổng Dao Thân Inox 316 chống kẹt rác chuyên dụng cho xử lý bùn đặc và bột giấy.';
    }

    missingSegments.push({
      segmentTitle: supp.name,
      category: supp.category,
      importance,
      gapReasonVi,
      recommendedSupplement: supp,
      isAlreadyAdded
    });
  });

  const addedCount = missingSegments.filter(s => s.isAlreadyAdded).length;
  const coverageScore = Math.min(100, Math.round(75 + (addedCount / missingSegments.length) * 25));

  return {
    coverageScore,
    totalSystemValves: currentProducts.length,
    totalCategoriesRepresented: currentCategories.size,
    missingSegments
  };
}

/**
 * Supplements missing high-performance valve lines to the system
 */
export function supplementSystemCatalog(
  currentProducts: ValveProduct[],
  selectedSupplementCodes?: string[]
): {
  updatedProducts: ValveProduct[];
  addedCount: number;
  addedProducts: ValveProduct[];
} {
  const currentCodes = new Set(currentProducts.map(p => p.code.toUpperCase()));
  const supplementsToAdd = AI_CATALOG_SUPPLEMENTS.filter(supp => {
    if (currentCodes.has(supp.code.toUpperCase())) return false;
    if (selectedSupplementCodes && selectedSupplementCodes.length > 0) {
      return selectedSupplementCodes.includes(supp.code);
    }
    return true;
  });

  if (supplementsToAdd.length === 0) {
    return {
      updatedProducts: currentProducts,
      addedCount: 0,
      addedProducts: []
    };
  }

  const updatedProducts = [...supplementsToAdd, ...currentProducts];
  return {
    updatedProducts,
    addedCount: supplementsToAdd.length,
    addedProducts: supplementsToAdd
  };
}
