import { ValveFamilyComparisonItem } from '../types/valve';

/**
 * Expert Mechanical Engineering Comparison Data within Product Families.
 * Compares Concentric vs High Performance Double-Offset vs Triple-Offset Butterfly Valves,
 * Floating vs Trunnion vs Cryogenic Ball Valves, etc.
 */
export const VALVE_FAMILY_COMPARISONS: Record<string, ValveFamilyComparisonItem[]> = {
  butterfly: [
    {
      id: 'bfv-concentric',
      categoryFamily: 'butterfly',
      title: 'Van Bướm Đồng Tâm (Concentric Rubber-Lined)',
      titleEn: 'Concentric Resilient-Seated Butterfly Valve',
      subtitle: 'Trục thẳng hàng tâm đĩa & tâm đường ống, gioăng lót cao su EPDM / NBR / PTFE',
      subtitleEn: 'Disc & stem aligned with body centerline, elastomer lined body',
      designPrinciple: 'Đĩa van quay quanh tâm trùng với trục van. Khi đóng mở, cạnh đĩa van ma sát liên tục 360° lên toàn bộ bề mặt gioăng cao su.',
      designPrincipleEn: 'Disc rotates on the centerline of the bore. The disc rubs against the elastomer seat throughout travel.',
      sealingMechanism: 'Làm kín mềm nhờ lực ép đàn hồi của cao su EPDM/NBR hoặc bọc PTFE bao quanh thân van.',
      sealingMechanismEn: 'Soft interference seal achieved through continuous compression against elastomer body liner.',
      cycleLife: '20,000 - 50,000 chu trình (Gioăng cao su nhanh lão hóa khi đóng mở thường xuyên)',
      cycleLifeEn: '20,000 - 50,000 cycles (Elastomer liner prone to wear with frequent actuation)',
      tempRange: '-10°C đến +120°C (Giới hạn bởi nhiệt độ bền của cao su EPDM)',
      pressureLimit: 'PN10 - PN16 (1.0 - 1.6 MPa)',
      leakageIntegrity: 'ISO 5208 Rate A (Kín hoàn toàn ở nhiệt độ thường khi mới lắp đặt)',
      leakageIntegrityEn: 'ISO 5208 Rate A (Bubble-tight at ambient temp when new)',
      cavitationAndWear: 'Dễ rách gioăng nếu lưu tốc dòng chảy > 3m/s hoặc có lẫn cặn hạt rắn cát sỏi.',
      cavitationAndWearEn: 'Susceptible to liner tearing at velocity > 3m/s or with slurry/particulate debris.',
      recommendedApplications: [
        'Hệ thống cấp thoát nước sinh hoạt đô thị',
        'Đường ống Chiller điều hòa thông gió HVAC cơ bản',
        'Nước làm mát tuần hoàn tháp giải nhiệt Cooling Tower',
        'PCCC áp lực thấp trong nhà xưởng thông thường'
      ],
      recommendedApplicationsEn: [
        'Municipal potable water supply',
        'Standard HVAC chilled water distribution',
        'Cooling tower loop isolation',
        'Low-pressure industrial fire protection lines'
      ],
      pros: [
        'Chi phí đầu tư rẻ nhất trong các dòng van',
        'Trọng lượng nhẹ, dễ dàng lắp đặt kiểu kẹp Wafer',
        'Mô-men xoắn ban đầu tương đối thấp khi còn mới'
      ],
      prosEn: [
        'Lowest upfront capital cost',
        'Lightweight, compact wafer installation',
        'Low initial operating torque when new'
      ],
      cons: [
        'Không chịu được nhiệt độ cao > 130°C và hơi nóng',
        'Ma sát ma sát miết 360° làm mòn gioăng nhanh chóng',
        'Không đạt chuẩn chống cháy Fire-Safe API 607'
      ],
      consEn: [
        'Cannot withstand temperature > 130°C or steam duty',
        'Continuous 360° disc rub accelerates liner wear',
        'Non fire-safe (Liner melts in plant fire)'
      ],
      relativeCostScore: 1,
      exampleModels: ['UTD-BFV-16', 'Shield BFV-Wafer EPDM']
    },
    {
      id: 'bfv-double-offset',
      categoryFamily: 'butterfly',
      title: 'Van Bướm Lệch Tâm Kép (Double-Offset High Performance)',
      titleEn: 'Double-Offset High Performance Butterfly Valve',
      subtitle: 'Trục van lệch 2 tâm so với đường ống & bề mặt làm kín, bệ PTFE gia cường',
      subtitleEn: 'Shaft offset from seat plane & pipe centerline, reinforced PTFE seat',
      designPrinciple: 'Trục van lệch khỏi tâm đường ống (Offset 1) và lệch khỏi bề mặt làm kín (Offset 2). Đĩa van tạo chuyển động hình elip, chỉ tiếp xúc bệ van ở vài độ cuối cùng khi đóng kín.',
      designPrincipleEn: 'Shaft is offset from sealing plane and pipe center. Disc camming action lifts seal off seat after 1-3° rotation.',
      sealingMechanism: 'Bệ làm kín R-PTFE hình nón tự bù áp suất hoặc đĩa kim loại mềm, có vòng đàn hồi Inconel hỗ trợ.',
      sealingMechanismEn: 'Reinforced PTFE conical seat with energized elastomeric or Inconel backing ring.',
      cycleLife: '300,000 - 500,000 chu trình (Giảm 80% ma sát miết so với van đồng tâm)',
      cycleLifeEn: '300,000 - 500,000 cycles (80% less rubbing friction than concentric valves)',
      tempRange: '-40°C đến +220°C (Phù hợp hơi bão hòa nhiệt độ trung bình)',
      pressureLimit: 'Class 150 / Class 300 (PN20 - PN50)',
      leakageIntegrity: 'ANSI Class VI / ISO 5208 Rate A (Bubble-Tight tuyệt đối)',
      leakageIntegrityEn: 'ANSI Class VI / ISO 5208 Rate A (Zero bubble leakage)',
      cavitationAndWear: 'Chống mài mòn tốt, đĩa Inox CF8M gia công cơ khí chính xác chịu lưu tốc dòng chảy cao đến 6m/s.',
      cavitationAndWearEn: 'Excellent wear resistance, precision CF8M disc operates reliably at velocities up to 6m/s.',
      recommendedApplications: [
        'Đường ống hơi bão hòa hạ áp và nước ngưng Condensate',
        'Hệ thống Chiller công suất lớn cho trung tâm thương mại & sân bay',
        'Nhà máy hóa chất xử lý dung môi hữu cơ loãng',
        'Hệ thống PCCC áp lực cao 300 PSI chuẩn NFPA'
      ],
      recommendedApplicationsEn: [
        'Low-pressure saturated steam & condensate lines',
        'Mega chiller hydronic plants for airports and commercial towers',
        'Chemical solvent transfer loops',
        'High-pressure 300 PSI fire fighting infrastructure'
      ],
      pros: [
        'Tuổi thọ cao gấp 10 lần van bướm đồng tâm',
        'Độ kín khít cao hơn, dễ lắp đặt đầu điều khiển khí nén/điện',
        'Có tùy chọn Fire-Safe đạt API 607 với bệ kim loại dự phòng'
      ],
      prosEn: [
        '10x longer service life than concentric valves',
        'Consistent low operating torque for actuation',
        'Fire-safe design available with secondary metal seat'
      ],
      cons: [
        'Giá thành cao hơn van đồng tâm 2.5 - 3 lần',
        'Không thích hợp với hơi quá nhiệt > 250°C'
      ],
      consEn: [
        '2.5x - 3x higher upfront price than concentric',
        'Not suitable for superheated steam > 250°C'
      ],
      relativeCostScore: 3,
      exampleModels: ['UTD-HPBV-150', 'Shield High Performance HPB']
    },
    {
      id: 'bfv-triple-offset',
      categoryFamily: 'butterfly',
      title: 'Van Bướm Lệch Tâm 3 Kim Loại (Triple-Offset Metal-Seated TOV)',
      titleEn: 'Triple-Offset Metal-Seated Butterfly Valve (TOV)',
      subtitle: 'Lệch 3 tâm hình học nón nghiêng, bệ kim loại Stellite chống cháy nổ & siêu lạnh',
      subtitleEn: 'Triple offset conical geometry, Stellite metal seat for extreme severe duty',
      designPrinciple: 'Bổ sung tâm lệch thứ 3 (Offset 3) góc nghiêng hình nón. Đĩa van tiếp xúc bệ hoàn toàn không có ma sát trượt (Zero Rubbing), chỉ tiếp xúc điểm hình học khi đóng chặt.',
      designPrincipleEn: 'Adds third angular offset forming a tilted conical seal. Disc wedges into seat with zero friction and pure camming action.',
      sealingMechanism: 'Làm kín kim loại với kim loại (Metal-to-Metal): Đĩa viền thép nhiều lớp SS316 + Graphite ép chặt vào bệ tôi cứng hợp kim Stellite Gr.21.',
      sealingMechanismEn: 'Metal-to-metal torque-seated seal: Laminated stainless/graphite disc seal wedged into Stellite Gr.21 seat.',
      cycleLife: '1,000,000+ chu trình (Không có chi tiết cao su, tuổi thọ lên tới 25 năm)',
      cycleLifeEn: '1,000,000+ cycles (100% metal metallurgy, lifespan up to 25+ years)',
      tempRange: '-196°C (Cryogenic LNG) đến +550°C (Khí than lò cao & Hơi quá nhiệt)',
      pressureLimit: 'Class 150 / 300 / 600 / 900 (PN20 đến PN150)',
      leakageIntegrity: 'ISO 5208 Rate A (Zero Leakage kim loại) & API 607 Fire-Safe 100%',
      leakageIntegrityEn: 'ISO 5208 Rate A (Zero bubble leakage metal seat) & API 607 certified',
      cavitationAndWear: 'Chống xói mòn tuyệt đối, không bị kẹt bụi than hạt rắn hoặc môi chất hydrocarbon nguy hiểm.',
      cavitationAndWearEn: 'Zero galling, immune to severe erosion, solids, coke slurry and flashing fluids.',
      recommendedApplications: [
        'Nhà máy lọc hóa dầu Long Sơn, Dung Quất, kho khí LNG Thị Vải',
        'Đường ống hơi siêu nhiệt 540°C nhà máy nhiệt điện than & tuabin khí',
        'Luyện kim lò cao thép Hòa Phát Dung Quất',
        'Hệ thống dầu truyền nhiệt công nghiệp 350°C'
      ],
      recommendedApplicationsEn: [
        'Refineries (Dung Quat, Long Son), Thi Vai LNG receiving terminals',
        'Supercritical 540°C steam turbine isolation in power plants',
        'Blast furnace gas isolation in integrated steel mills',
        'High temperature 350°C thermal fluid networks'
      ],
      pros: [
        'Độ bền tối thượng, vận hành vĩnh cửu không cần thay thế gioăng',
        'Kín khít 2 chiều (Bi-directional bubble tight) ở nhiệt độ siêu cao & siêu lạnh',
        'Đạt tiêu chuẩn chống cháy nổ tuyệt đối API 607 & ISO 10497'
      ],
      prosEn: [
        'Ultimate durability, virtually maintenance-free 25-year service',
        'Bi-directional zero bubble-tight shutoff at -196°C to +550°C',
        'Inherent fire-safe protection API 607 & ISO 10497'
      ],
      cons: [
        'Chi phí đầu tư cao (đòi hỏi gia công CNC 5 trục chính xác)',
        'Cần kỹ sư chuyên môn hiệu chuẩn mô-men xoắn đóng van'
      ],
      consEn: [
        'Higher initial capital investment (precision 5-axis CNC)',
        'Requires proper torque calibration on commissioning'
      ],
      relativeCostScore: 5,
      exampleModels: ['UTD-TOV-600', 'VYC Industrial Model 096/TOV']
    }
  ],

  ball: [
    {
      id: 'ball-floating',
      categoryFamily: 'ball',
      title: 'Van Bi Dạng Nổi (Floating Ball Valve 2-Piece / 3-Piece)',
      titleEn: 'Floating Ball Valve (2-Piece / 3-Piece)',
      subtitle: 'Bi van nổi tự do giữa 2 bệ làm kín PTFE, áp lực dòng chảy đẩy bi ép vào bệ hạ lưu',
      subtitleEn: 'Ball suspended between two resilient seats, upstream pressure forces ball downstream',
      designPrinciple: 'Bi van không có trục đỡ phía dưới. Khi có áp suất từ thượng lưu, lực ép đẩy quả bi tỳ chặt vào bệ đỡ phía hạ lưu để tạo độ kín.',
      designPrincipleEn: 'Ball is supported only by the two seats. Line pressure pushes the ball against the downstream seat.',
      sealingMechanism: 'Làm kín mềm PTFE hoặc R-PTFE dựa vào độ chênh áp dòng chảy.',
      sealingMechanismEn: 'Soft PTFE/R-PTFE sealing energized by upstream process differential pressure.',
      cycleLife: '100,000 chu trình (Đường kính nhỏ DN15 - DN150)',
      cycleLifeEn: '100,000 cycles (Optimized for DN15 to DN150 sizes)',
      tempRange: '-20°C đến +180°C',
      pressureLimit: 'PN16 - PN40 (Class 150 / 300)',
      leakageIntegrity: 'ISO 5208 Rate A (Bubble-tight zero leakage)',
      leakageIntegrityEn: 'ISO 5208 Rate A (Bubble-tight zero leakage)',
      cavitationAndWear: 'Mô-men xoắn tăng vọt khi áp suất lớn hoặc đường kính > DN200.',
      cavitationAndWearEn: 'Operating torque spikes significantly under high pressure or sizes > DN200.',
      recommendedApplications: [
        'Đường ống nước, khí nén xưởng công nghiệp',
        'Hóa chất loãng, dung môi nhà máy chế biến',
        'Đường ống cấp dầu diesel phụ trợ'
      ],
      recommendedApplicationsEn: [
        'Plant utility air, water and inert gas distribution',
        'General chemical and pharmaceutical transfer',
        'Auxiliary fuel oil lines'
      ],
      pros: [
        'Cấu tạo đơn giản, nhỏ gọn, giá thành rất kinh tế',
        'Dễ bảo dưỡng thay thế gioăng bệ van tại chỗ'
      ],
      prosEn: [
        'Simple compact construction, highly economical',
        'Easy on-site seat maintenance and replacement'
      ],
      cons: [
        'Giới hạn kích thước ≤ DN200 (khi lớn hơn mô men đóng van quá nặng)',
        'Không thích hợp áp lực cực cao > Class 600'
      ],
      consEn: [
        'Limited practical size ≤ DN200 due to torque loads',
        'Unsuitable for extreme pressures above Class 600'
      ],
      relativeCostScore: 2,
      exampleModels: ['UTD-BV-16', 'JMV Forged 2PC Ball']
    },
    {
      id: 'ball-trunnion',
      categoryFamily: 'ball',
      title: 'Van Bi Trụ Đỡ Trunnion (Trunnion Mounted Ball Valve API 6D)',
      titleEn: 'Trunnion Mounted Ball Valve (API 6D Heavy Duty)',
      subtitle: 'Bi van cố định bằng trục trên & trục dưới, bệ van tự động đẩy ép vào bi (Spring-Loaded)',
      subtitleEn: 'Ball anchored by upper and lower trunnions, spring-energized floating seats',
      designPrinciple: 'Quả bi được cố định cơ học tại 2 đầu trục trên và dưới. Hai bệ van lò xo độc lập tự di chuyển tỳ vào bi, triệt tiêu tải trọng áp lực lên trục van.',
      designPrincipleEn: 'Ball is fixed by upper stem and lower trunnion bearing. Spring-loaded seats move to seal against ball.',
      sealingMechanism: 'Làm kín kép thượng lưu & hạ lưu (Double Block and Bleed - DBB), bệ van có lò xo sóng đàn hồi.',
      sealingMechanismEn: 'Double Block and Bleed (DBB) sealing with independent spring-energized seat rings.',
      cycleLife: '500,000+ chu trình (Mô-men xoắn vận hành thấp và ổn định tuyệt đối)',
      cycleLifeEn: '500,000+ cycles (Consistent low torque regardless of differential pressure)',
      tempRange: '-46°C đến +350°C (Bệ PEEK hoặc Metal-to-Metal)',
      pressureLimit: 'Class 300 / 600 / 900 / 1500 / 2500 (PN50 - PN420)',
      leakageIntegrity: 'API 6D / ISO 5208 Rate A & Fire-Safe API 607 7th Ed',
      leakageIntegrityEn: 'API 6D / ISO 5208 Rate A & Fire-Safe API 607 7th Ed',
      cavitationAndWear: 'Chịu xói mòn và áp suất dòng chảy vận tốc cao trong tuyến ống dẫn dầu khí đường dài.',
      cavitationAndWearEn: 'Withstands high velocity erosion in long-distance hydrocarbon transmission.',
      recommendedApplications: [
        'Tuyến ống dẫn dầu thô & khí thiên nhiên áp lực cao xuyên quốc gia',
        'Trạm phân phối khí áp lực cao City Gate Gas Station',
        'Giàn khoan khai thác ngoài khơi và nhà máy lọc dầu'
      ],
      recommendedApplicationsEn: [
        'High-pressure cross-country crude oil and gas pipelines',
        'City gate gas pressure reduction metering stations',
        'Offshore exploration platforms and petrochemical refineries'
      ],
      pros: [
        'Mô-men đóng mở nhẹ nhàng ngay cả ở áp suất 150 bar',
        'Tính năng DBB cho phép xả áp buồng van khi đang hoạt động',
        'Độ an toàn phòng chống cháy nổ chuẩn mực cao nhất thế giới'
      ],
      prosEn: [
        'Effortless low torque actuation even at 150+ bar pressure',
        'Double Block & Bleed allows in-line body cavity venting',
        'Highest worldwide safety and API 607 fire test integrity'
      ],
      cons: [
        'Trọng lượng lớn, đòi hỏi bệ đỡ móng đường ống',
        'Chi phí đầu tư cao cho chế tạo thép rèn A105 / F316'
      ],
      consEn: [
        'Heavy structural weight requires pipe foundation supports',
        'Higher capital expenditure for forged A105/F316 metallurgy'
      ],
      relativeCostScore: 4,
      exampleModels: ['UTD-TRUNNION-600', 'JMV API 6D Trunnion']
    }
  ]
};

export function getComparisonFamilyForCategory(category: string): ValveFamilyComparisonItem[] | null {
  if (category === 'butterfly') {
    return VALVE_FAMILY_COMPARISONS.butterfly;
  }
  if (category === 'ball') {
    return VALVE_FAMILY_COMPARISONS.ball;
  }
  // Default to butterfly comparison as prime example
  return VALVE_FAMILY_COMPARISONS.butterfly;
}
