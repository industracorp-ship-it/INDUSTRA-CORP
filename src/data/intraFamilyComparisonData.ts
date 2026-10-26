export interface IntraFamilyComparisonItem {
  id: string;
  categoryKey: string;
  categoryNameVi: string;
  categoryNameEn: string;
  valveA: {
    nameVi: string;
    nameEn: string;
    designType: string;
    shortDescVi: string;
    shortDescEn: string;
    sealingMechanismVi: string;
    sealingMechanismEn: string;
    tempRating: string;
    pressureRating: string;
    leakageClass: string;
    cycleLife: string;
    actuatorTorque: string;
    bestSuitedVi: string[];
    bestSuitedEn: string[];
    limitationsVi: string[];
    limitationsEn: string[];
  };
  valveB: {
    nameVi: string;
    nameEn: string;
    designType: string;
    shortDescVi: string;
    shortDescEn: string;
    sealingMechanismVi: string;
    sealingMechanismEn: string;
    tempRating: string;
    pressureRating: string;
    leakageClass: string;
    cycleLife: string;
    actuatorTorque: string;
    bestSuitedVi: string[];
    bestSuitedEn: string[];
    limitationsVi: string[];
    limitationsEn: string[];
  };
  metrics: {
    labelVi: string;
    labelEn: string;
    scoreA: number; // 0-100
    scoreB: number; // 0-100
    advantage: 'A' | 'B' | 'EQUAL';
    explanationVi: string;
    explanationEn: string;
  }[];
  aiVerdict: {
    summaryVi: string;
    summaryEn: string;
    capexOpexComparisonVi: string;
    capexOpexComparisonEn: string;
    engineeringAdviceVi: string;
    engineeringAdviceEn: string;
    standardsRef: string[];
  };
}

export const INTRA_FAMILY_COMPARISONS: IntraFamilyComparisonItem[] = [
  {
    id: 'butterfly-concentric-vs-high-performance',
    categoryKey: 'butterfly',
    categoryNameVi: 'Van Bướm (Butterfly Valves)',
    categoryNameEn: 'Butterfly Valves',
    valveA: {
      nameVi: 'Van Bướm Đồng Tâm (Concentric Butterfly Valve)',
      nameEn: 'Concentric Resilient Seated Butterfly Valve',
      designType: 'Rubber-Lined Concentric (Trục xuyên tâm đĩa)',
      shortDescVi: 'Trục van nằm chính giữa đường kính đĩa và thân van. Đệm làm kín bằng cao su mềm (EPDM/NBR/Viton) bao bọc toàn bộ chu vi thân.',
      shortDescEn: 'Shaft passes through the centerline of disc and body. Resilient elastomer seat (EPDM/NBR) lines the full wetted internal body.',
      sealingMechanismVi: 'Ma sát chà xát liên tục (Interference friction) giữa đĩa kim loại và đệm cao su trong toàn bộ hành trình quay 0° - 90°.',
      sealingMechanismEn: 'Continuous sliding friction between disc edge and rubber liner throughout entire 0° - 90° rotation.',
      tempRating: '-15°C đến +120°C (Giới hạn bởi cao su EPDM/NBR)',
      pressureRating: 'PN10 - PN16 (150 - 200 PSI max)',
      leakageClass: 'ISO 5208 Rate A (Zero leakage ở áp thấp)',
      cycleLife: '50,000 - 100,000 chu trình (Đệm cao su biến tính theo thời gian)',
      actuatorTorque: 'Mô-men đóng mở trung bình đến cao do ma sát đệm cao su liên tục',
      bestSuitedVi: [
        'Hệ thống cấp thoát nước tòa nhà & nhà máy (Water utility)',
        'Hệ thống nước làm mát giải nhiệt Chiller HVAC (áp suất dưới 16 Bar)',
        'Hệ thống PCCC Sprinkler thông thường (tiết kiệm chi phí đầu tư)',
        'Xử lý nước thải sinh hoạt và nước tưới tiêu'
      ],
      bestSuitedEn: [
        'Municipal water distribution & treatment plants',
        'HVAC chilled & condenser water lines under 16 Bar',
        'Standard sprinkler fire protection systems (budget friendly)',
        'General domestic effluent and irrigation'
      ],
      limitationsVi: [
        'Không chịu được hơi nóng nhiệt độ cao (trên 120°C cao su bị chai cứng hoặc rách)',
        'Không chịu được hóa chất hữu cơ và dung môi ăn mòn mạnh',
        'Tần suất đóng mở cao dẫn đến nhanh mòn đệm và kẹt đĩa',
        'Giới hạn áp suất làm việc tối đa PN16'
      ],
      limitationsEn: [
        'Cannot handle steam or media above 120°C (elastomer degradation)',
        'Incompatible with aggressive hydrocarbons and aromatic solvents',
        'High operating cycling causes accelerated liner wear and seat deformation',
        'Limited to maximum PN16 / 200 PSI working pressure'
      ]
    },
    valveB: {
      nameVi: 'Van Bướm Lệch Tâm Kép Hiệu Năng Cao (High Performance Double-Offset Valve)',
      nameEn: 'High Performance Double Offset Butterfly Valve',
      designType: 'Double-Offset Eccentric (Lệch tâm trục & đĩa)',
      shortDescVi: 'Trục van được bố trí lệch tâm kép khỏi bề mặt làm kín và tâm ống. Đệm PTFE/RTFE hoặc Kim loại Stellite chịu áp lực và nhiệt độ khắc nghiệt.',
      shortDescEn: 'Shaft is offset from sealing surface and pipe centerline (cam action). Uses PTFE/R-PTFE or metal Stellite seats for extreme duty.',
      sealingMechanismVi: 'Chuyển động Cam (Camming action): Đĩa chỉ tiếp xúc đệm ở vài độ cuối cùng khi đóng kín; khi mở van, đĩa nhấc bổng khỏi đệm lập tức, triệt tiêu ma sát mài mòn.',
      sealingMechanismEn: 'Camming action: Disc disengages seat within first few degrees of opening, eliminating seat scrubbing and friction wear.',
      tempRating: '-50°C đến +260°C (Đệm RTFE) / lên tới +450°C (Đệm Kim loại Stellite)',
      pressureRating: 'Class 150 / Class 300 / Class 600 (PN25 - PN100)',
      leakageClass: 'ANSI/FCI 70-2 Class VI / ISO 5208 Rate A Bubble-Tight',
      cycleLife: '500,000 - 1,000,000 chu trình (Bền gấp 5 - 10 lần van đồng tâm)',
      actuatorTorque: 'Mô-men xoắn thấp và ổn định, tiết kiệm 30% công suất bộ điều khiển khí nén/điện',
      bestSuitedVi: [
        'Hệ thống hơi bão hòa và hơi nóng lò hơi (Steam lines)',
        'Hệ thống Chiller cao tầng áp lực cao PN25/Class 150',
        'Nhà máy lọc hóa dầu, khí công nghiệp, dung môi hóa chất',
        'Tuyến ống van đóng ngắt ESD tự động SCADA cần độ tin cậy tuyệt đối',
        'Môi trường chu trình đóng mở hàng trăm lần mỗi ngày'
      ],
      bestSuitedEn: [
        'Saturated steam and thermal boiler loops',
        'High-rise HVAC chiller circuits requiring PN25 / Class 150/300',
        'Petrochemical processing, refinery and industrial solvents',
        'Automated SCADA / ESD emergency shutoff loops',
        'High-cycling process plants requiring 500,000+ operations'
      ],
      limitationsVi: [
        'Chi phí đầu tư ban đầu cao hơn khoảng 2.0 - 2.8 lần so với van đồng tâm',
        'Cần kỹ thuật căn chỉnh đúng tâm mặt bích khi lắp đặt (ASME B16.5)'
      ],
      limitationsEn: [
        'Higher initial capital cost (approx 2.0x - 2.8x concentric valve)',
        'Requires proper pipe alignment and matching ASME B16.5 flanges'
      ]
    },
    metrics: [
      {
        labelVi: 'Tuổi thọ & Số chu trình đóng mở (Cycle Life)',
        labelEn: 'Cycle Life Durability',
        scoreA: 55,
        scoreB: 98,
        advantage: 'B',
        explanationVi: 'Nhờ cơ chế lệch tâm Camming Action, đĩa van High Performance không chà sát đệm cao su, đạt tới 1,000,000 chu trình mà không rò rỉ.',
        explanationEn: 'Camming action lifts disc off seat instantly upon opening, preventing friction wear and achieving 1,000,000 cycles.'
      },
      {
        labelVi: 'Khả năng chịu nhiệt độ & Hơi nóng (Temp Range)',
        labelEn: 'Temperature Resistance (Steam/Thermal)',
        scoreA: 40,
        scoreB: 95,
        advantage: 'B',
        explanationVi: 'Van đồng tâm chỉ chịu tối đa 120°C do cao su EPDM. Van High Performance chịu tới 260°C (RTFE) hoặc 450°C (kim loại), đáp ứng hoàn hảo hệ thống Steam.',
        explanationEn: 'Concentric is capped at 120°C due to EPDM. High Performance handles 260°C (RTFE) or 450°C (metal), ideal for steam applications.'
      },
      {
        labelVi: 'Áp suất làm việc tối đa (Pressure Rating)',
        labelEn: 'Maximum Working Pressure',
        scoreA: 50,
        scoreB: 92,
        advantage: 'B',
        explanationVi: 'Van đồng tâm chỉ chịu tối đa PN16 (16 Bar). Van High Performance chịu áp Class 150/300 (20 - 50 Bar), phù hợp tòa nhà siêu cao tầng.',
        explanationEn: 'Concentric is rated max PN16 (16 Bar). High Performance handles Class 150/300 (20 - 50 Bar) for supertall risers.'
      },
      {
        labelVi: 'Độ kín khít không rò rỉ (Bubble-Tight Sealing)',
        labelEn: 'Bubble-Tight Sealing Integrity',
        scoreA: 85,
        scoreB: 96,
        advantage: 'B',
        explanationVi: 'Cả hai đều đạt độ kín bọt khí khi mới lắp, nhưng van High Performance duy trì độ kín liên tục sau nhiều năm vận hành áp cao.',
        explanationEn: 'Both provide bubble-tight shutoff when new, but High Performance preserves it after years under high pressure.'
      },
      {
        labelVi: 'Tối ưu công suất bộ điều khiển (Actuator Sizing)',
        labelEn: 'Actuator Torque & Sizing Optimization',
        scoreA: 60,
        scoreB: 90,
        advantage: 'B',
        explanationVi: 'Mô-men xoắn của van High Performance giảm 30-40%, cho phép chọn actuator điện/khí nén nhỏ hơn, tiết kiệm chi phí tự động hóa.',
        explanationEn: 'Torque demand is 30-40% lower, enabling smaller pneumatic/electric actuators and reducing automation cost.'
      },
      {
        labelVi: 'Hiệu quả chi phí đầu tư ban đầu (CAPEX Economy)',
        labelEn: 'Initial CAPEX Affordability',
        scoreA: 95,
        scoreB: 50,
        advantage: 'A',
        explanationVi: 'Van đồng tâm có giá thành rẻ hơn đáng kể, lý tưởng cho các tuyến ống nước sinh hoạt và PCCC tiêu chuẩn.',
        explanationEn: 'Concentric valve has significantly lower purchase price, optimal for low-pressure potable water and standard sprinkler lines.'
      }
    ],
    aiVerdict: {
      summaryVi: 'Chọn Van Bướm Đồng Tâm (Concentric) khi môi chất là Nước lạnh / Nước sinh hoạt / PCCC dưới 16 Bar và ngân sách tối ưu. BẮT BUỘC chọn High Performance Double-Offset khi vận hành hệ Hơi nóng (Steam), Tòa nhà cao tầng áp lực PN25+, hoặc hệ thống đóng mở tự động liên tục.',
      summaryEn: 'Specify Concentric for chilled water, domestic potable water and fire sprinkler lines under 16 Bar. MANDATORY to select High Performance Double Offset for steam lines, high-pressure risers PN25+, chemical loops, or continuous SCADA modulating duties.',
      capexOpexComparisonVi: 'CAPEX ban đầu của van High Performance cao hơn 2.2x, nhưng tổng chi phí sở hữu (TCO) sau 5 năm thấp hơn 45% do không phải thay thế đệm cao su, không rò rỉ gây dừng máy và tiết kiệm chi phí actuator.',
      capexOpexComparisonEn: 'Initial CAPEX is 2.2x higher, but 5-year Total Cost of Ownership (TCO) is 45% lower due to zero seat replacement downtime and lower torque actuator requirements.',
      engineeringAdviceVi: 'Khuyến cáo kỹ thuật UTD: Đối với đường ống Steam từ DN50 trở lên, tuyệt đối không dùng van bướm đồng tâm lót cao su vì nguy cơ nổ đệm cao. Nên ưu tiên High Performance đệm RTFE hoặc Triple Offset kim loại.',
      engineeringAdviceEn: 'UTD Engineering Rule: Never specify rubber-lined concentric valves for steam service regardless of pressure. Always deploy double-offset RTFE or triple-offset metal seated valves.',
      standardsRef: ['API 609 Category B', 'ASME B16.34', 'MSS-SP-68', 'ISO 5752 Series 20']
    }
  },
  {
    id: 'ball-floating-vs-trunnion',
    categoryKey: 'ball',
    categoryNameVi: 'Van Bi (Ball Valves)',
    categoryNameEn: 'Ball Valves',
    valveA: {
      nameVi: 'Van Bi Nổi (Floating Ball Valve)',
      nameEn: 'Floating Ball Valve (2-PC / 3-PC)',
      designType: 'Bi nổi tự do giữa 2 vòng đệm (Floating Ball)',
      shortDescVi: 'Bi van không có trục giữ đáy, được giữ lơ lửng giữa 2 đệm PTFE. Dưới áp lực dòng chảy, bi bị đẩy tự do tỳ chặt vào đệm phía hạ lưu để tạo độ kín.',
      shortDescEn: 'Ball is suspended between two resilient seats without bottom support. Upstream line pressure pushes ball against downstream seat to seal.',
      sealingMechanismVi: 'Áp lực dòng chảy tự đẩy bi ép vào đệm hạ lưu (Upstream pressure driven sealing).',
      sealingMechanismEn: 'Differential line pressure drives the ball downstream into the resilient seat.',
      tempRating: '-29°C đến +180°C (Đệm PTFE/R-PTFE)',
      pressureRating: 'Class 150 - Class 300 (PN16 - PN40)',
      leakageClass: 'API 598 / ISO 5208 Rate A (Zero Leakage)',
      cycleLife: '100,000 chu trình ở dải kích thước DN15 - DN100',
      actuatorTorque: 'Mô-men tăng vọt khi áp suất chênh lệch cao hoặc kích thước trên DN100',
      bestSuitedVi: [
        'Đường ống size nhỏ đến trung bình (DN15 - DN100 / 1/2" - 4")',
        'Đường dẫn dầu, khí gas, nước sạch áp lực trung bình',
        'Các ứng dụng đóng mở nhanh 1/4 vòng cần chi phí hợp lý',
        'Hệ thống công nghiệp vừa và nhỏ'
      ],
      bestSuitedEn: [
        'Small to medium bore piping (DN15 - DN100 / 1/2" - 4")',
        'General petroleum, compressed air, industrial water',
        'Quarter-turn fast isolation on reasonable budget',
        'Commercial and light industrial systems'
      ],
      limitationsVi: [
        'Ở kích thước lớn (trên DN150) hoặc áp lực cao (Class 600+), lực đẩy ép bi quá mạnh làm biến dạng đệm và kẹt trục',
        'Cần lực vặn tay gạt / actuator cực lớn khi chênh áp cao'
      ],
      limitationsEn: [
        'Above DN150 or Class 600+, hydraulic force overloads downstream seat causing crushing and stem binding',
        'Extremely high operating torque under high differential pressure'
      ]
    },
    valveB: {
      nameVi: 'Van Bi Trục Cố Định (Trunnion Mounted Ball Valve)',
      nameEn: 'Trunnion Mounted Ball Valve',
      designType: 'Bi có trục cố định 2 đầu trên dưới (Trunnion Supported)',
      shortDescVi: 'Bi van được định vị cơ học bằng trục trên (stem) và trục đáy (trunnion) cố định vào thân van. Đệm van là loại lò xo tự đẩy (spring-energized) ép vào bi.',
      shortDescEn: 'Ball is anchored by stem and lower trunnion bearing plates. Spring-loaded floating seats move against the anchored ball to form seal.',
      sealingMechanismVi: 'Đệm chuyển động độc lập (Floating Seats) được đẩy bởi lò xo và áp lực chất lỏng ép chặt vào quả bi cố định. Cả 2 phía thượng lưu và hạ lưu đều kín (Double Block & Bleed).',
      sealingMechanismEn: 'Floating spring-energized seats are pushed by line pressure against fixed ball. Provides certified Double Block and Bleed (DBB).',
      tempRating: '-50°C đến +250°C (RTFE/PEEK) / lên tới +400°C (Metal seated)',
      pressureRating: 'Class 150 - Class 2500 (PN25 - PN420)',
      leakageClass: 'API 6D / ISO 5208 Rate A Zero Leakage',
      cycleLife: '500,000+ chu trình kể cả ở đường kính lớn DN200 - DN600',
      actuatorTorque: 'Mô-men xoắn nhẹ và đồng đều, không phụ thuộc vào áp suất đường ống',
      bestSuitedVi: [
        'Đường kính lớn từ DN100 đến DN600+ (4" đến 24"+)',
        'Đường ống truyền dẫn Dầu khí & Khí đốt tự nhiên áp lực cao (Class 300 - 1500)',
        'Hệ thống ngắt khẩn cấp ESD / SCADA yêu cầu kiểm tra xả đáy Double Block & Bleed',
        'Nền tảng vận hành liên tục không cho phép dừng máy'
      ],
      bestSuitedEn: [
        'Large bore diameters from DN100 to DN600+ (4" to 24"+)',
        'High-pressure oil & natural gas transmission pipelines (Class 300 - 1500)',
        'Emergency Shutdown (ESD) valves requiring Double Block & Bleed (DBB)',
        'Critical continuous petrochemical processing'
      ],
      limitationsVi: [
        'Cấu tạo cơ khí phức tạp, trọng lượng nặng hơn 30-50%',
        'Chi phí đầu tư ban đầu cao hơn so với van bi nổi ở cùng kích thước'
      ],
      limitationsEn: [
        'Complex mechanical construction with heavier weight (30-50% heavier)',
        'Substantially higher initial cost compared to floating design in small sizes'
      ]
    },
    metrics: [
      {
        labelVi: 'Khả năng chịu áp suất siêu cao (High Pressure Class)',
        labelEn: 'High Pressure Rating (Class 600 - 2500)',
        scoreA: 50,
        scoreB: 99,
        advantage: 'B',
        explanationVi: 'Trunnion chịu áp suất tới Class 2500 (420 Bar) mà không làm kẹt bi vì tải trọng thủy lực được hấp thụ bởi 2 vòng bi ổ trục trên dưới.',
        explanationEn: 'Trunnion easily handles Class 2500 (420 Bar) without stem binding because hydraulic load is absorbed by dual trunnion bearings.'
      },
      {
        labelVi: 'Vận hành êm ái & Mô-men xoắn (Low Operating Torque)',
        labelEn: 'Smooth Torque & Actuator Efficiency',
        scoreA: 60,
        scoreB: 95,
        advantage: 'B',
        explanationVi: 'Bi cố định giúp giảm đáng kể mô-men xoắn ở kích thước lớn, giúp vận hành nhẹ nhàng và tiết kiệm chi phí motor điện.',
        explanationEn: 'Anchored ball dramatically lowers break-away torque, requiring smaller actuators on large bore pipelines.'
      },
      {
        labelVi: 'Tính năng xả cách ly kép (Double Block & Bleed - DBB)',
        labelEn: 'Certified Double Block and Bleed (DBB)',
        scoreA: 30,
        scoreB: 98,
        advantage: 'B',
        explanationVi: 'Chỉ có van Trunnion mới đạt chuẩn API 6D DBB với cổng xả thân van, cho phép xả áp kiểm tra rò rỉ khi van đang đóng.',
        explanationEn: 'Trunnion design provides certified API 6D DBB cavity relief, allowing online verification of seat integrity.'
      },
      {
        labelVi: 'Kinh tế cho đường ống nhỏ (Small Bore Economy DN15-DN80)',
        labelEn: 'Small Bore Economy (DN15 - DN80)',
        scoreA: 98,
        scoreB: 45,
        advantage: 'A',
        explanationVi: 'Van bi nổi có giá thành cạnh tranh, cấu tạo đơn giản, là lựa chọn số 1 cho các đường ống từ DN15 đến DN80.',
        explanationEn: 'Floating ball valve offers unmatched price-to-performance ratio for sizes DN15 through DN80.'
      }
    ],
    aiVerdict: {
      summaryVi: 'Dùng Van Bi Nổi (Floating) cho các đường ống DN15 - DN80 áp suất dưới Class 300. BẮT BUỘC dùng Van Bi Trục Cố Định (Trunnion) khi kích thước từ DN100 trở lên hoặc áp lực từ Class 300 đến Class 1500 trong Dầu khí & Trạm bơm chính.',
      summaryEn: 'Specify Floating Ball for pipe diameters DN15 - DN80 under Class 300. MANDATORY to select Trunnion Mounted Ball for sizes DN100+ or pressures Class 300 - 1500 in oil, gas and critical high-pressure risers.',
      capexOpexComparisonVi: 'Với kích thước nhỏ (DN15-DN50), van Floating rẻ hơn 60% và hoàn toàn đủ tin cậy. Với size lớn (DN150+), chọn Floating sẽ nhanh hỏng đệm dẫn tới chi phí thay thế đắt gấp 3 lần chọn Trunnion ngay từ đầu.',
      capexOpexComparisonEn: 'For small sizes (DN15-DN50), Floating is 60% cheaper with excellent reliability. For large sizes (DN150+), choosing Floating results in rapid seat failure costing 3x more in replacement downtime.',
      engineeringAdviceVi: 'Khuyến cáo kỹ sư: Khi thiết kế trạm cấp khí hoặc dầu áp suất trên 25 Bar, luôn chỉ định van bi Trunnion theo chuẩn API 6D và thử nghiệm Fire-Safe API 607.',
      engineeringAdviceEn: 'Engineering Recommendation: For gas & hydrocarbon services above 25 Bar, always specify API 6D Trunnion valves with API 607 Fire-Safe certification.',
      standardsRef: ['API 6D', 'ASME B16.34', 'API 607 / API 6FA Fire-Safe', 'ISO 14313']
    }
  },
  {
    id: 'gate-resilient-vs-wedge',
    categoryKey: 'gate',
    categoryNameVi: 'Van Cổng (Gate Valves)',
    categoryNameEn: 'Gate Valves',
    valveA: {
      nameVi: 'Van Cổng Ty Chìm Nêm Bọc Cao Su (Resilient Seated Gate Valve)',
      nameEn: 'Resilient Seated Gate Valve (Soft Seated)',
      designType: 'Non-Rising Stem (NRS) with EPDM Encapsulated Wedge',
      shortDescVi: 'Nêm van bằng gang cầu được đúc bọc kín 100% bằng cao su EPDM lưu hóa. Đáy thân van bằng phẳng trơn láng, không có rãnh lắng cặn.',
      shortDescEn: 'Ductile iron wedge fully encapsulated in vulcanized EPDM elastomer. Straight-through flat bottom passage without sediment pocket.',
      sealingMechanismVi: 'Cao su đàn hồi ép chặt vào bề mặt kim loại thân van nhẵn bóng, đạt độ kín tuyệt đối không bọt khí.',
      sealingMechanismEn: 'Resilient elastomer compression against precision-machined epoxy body walls for zero leakage.',
      tempRating: '0°C đến +70°C (Tiêu chuẩn nước sạch & PCCC)',
      pressureRating: 'PN10 / PN16 / 300 PSI (PCCC UL/FM)',
      leakageClass: 'ISO 5208 Rate A (Zero Leakage 100%)',
      cycleLife: '100,000 chu trình trong môi trường nước sạch và bùn loãng',
      actuatorTorque: 'Mô-men xoắn nhẹ nhàng, êm ái',
      bestSuitedVi: [
        'Mạng lưới cấp thoát nước đô thị và nhà máy (Water Supply)',
        'Hệ thống PCCC cứu hỏa tòa nhà và hạ tầng công nghiệp (UL/FM)',
        'Đường ống chôn ngầm dưới đất (không cần bảo trì hố van thường xuyên)',
        'Hệ thống nước có chứa cặn lắng và cát mịn'
      ],
      bestSuitedEn: [
        'Municipal water distribution and treatment networks',
        'Fire protection underground mains and indoor sprinkler systems (UL/FM)',
        'Buried direct service pipelines (zero maintenance cavity)',
        'Raw water containing light silt and suspended solids'
      ],
      limitationsVi: [
        'Giới hạn nhiệt độ tối đa 70°C, tuyệt đối không dùng cho nước nóng hay lò hơi',
        'Không dùng cho môi chất chứa dầu khoáng, dung môi hóa chất ăn mòn EPDM'
      ],
      limitationsEn: [
        'Maximum temperature limited to 70°C; unsuitable for hot water or boilers',
        'Cannot handle hydrocarbons or chemicals destructive to EPDM'
      ]
    },
    valveB: {
      nameVi: 'Van Cổng Ty Nổi Nêm Thép Nẹp Kim Loại (OS&Y Solid Wedge Gate Valve)',
      nameEn: 'OS&Y Cast Steel Solid Wedge Gate Valve',
      designType: 'Outside Screw & Yoke (OS&Y) with Stellite Metal Seats',
      shortDescVi: 'Ty nổi bên ngoài giá đỡ (OS&Y), nêm đúc bằng thép Carbon WCB hoặc Inox với vành làm kín kim loại Stellite hàn đắp.',
      shortDescEn: 'Outside Screw and Yoke design with visual stem position. Solid wedge with hard-faced Stellite metal-to-metal seating faces.',
      sealingMechanismVi: 'Kim loại ép kim loại (Metal-to-Metal wedge seal) chịu áp lực và nhiệt độ cực cao.',
      sealingMechanismEn: 'Metal-to-metal wedge seating under mechanical spindle thrust for severe service containment.',
      tempRating: '-29°C đến +425°C (Hơi nóng nhiệt độ cao)',
      pressureRating: 'Class 150 / Class 300 / Class 600 (PN25 - PN100)',
      leakageClass: 'API 598 Metal Seated (Tối đa 1-3 giọt/phút theo chuẩn)',
      cycleLife: '200,000 chu trình trong môi trường hơi nhiệt độ cao',
      actuatorTorque: 'Mô-men xoắn cao hơn, cần tay quay lớn hoặc hộp số trợ lực',
      bestSuitedVi: [
        'Hệ thống hơi nóng lò hơi (Steam & Superheated Steam lines)',
        'Nhà máy lọc hóa dầu, nhiệt điện, chế biến hóa chất nặng',
        'Hệ thống PCCC phòng máy bơm cần quan sát trực quan vị trí Đóng/Mở (OS&Y)',
        'Hệ thống nhiệt độ cao trên 100°C'
      ],
      bestSuitedEn: [
        'Industrial steam and superheated boiler piping',
        'Petrochemical refineries, thermal power generation',
        'Fire pump room suction/discharge with visual position indication (OS&Y)',
        'High temperature thermal loops above 100°C'
      ],
      limitationsVi: [
        'Đáy thân van có rãnh lõm (pocket), dễ bị kẹt cát sỏi làm hỏng đĩa kim loại',
        'Trọng lượng nặng hơn, kích thước ty nổi chiếm không gian lắp đặt lớn',
        'Giá thành cao hơn khoảng 1.8 - 2.5 lần so with van nêm cao su'
      ],
      limitationsEn: [
        'Bottom seat pocket tends to trap debris, risking metal seat scratching',
        'Heavier weight and tall rising stem requires large vertical clearance',
        'Higher cost (1.8x - 2.5x higher than soft seated gate valve)'
      ]
    },
    metrics: [
      {
        labelVi: 'Độ kín khít dòng chảy (Zero Leakage Sealing)',
        labelEn: 'Bubble-Tight Zero Leakage Rate',
        scoreA: 99,
        scoreB: 85,
        advantage: 'A',
        explanationVi: 'Van nêm cao su đạt chuẩn kín tuyệt đối 100% Rate A (không nhỏ giọt). Van nêm kim loại theo chuẩn API 598 cho phép rò rỉ vi mô.',
        explanationEn: 'Resilient seated valve achieves 100% Rate A bubble-tight closure. Metal seated allows permissible API 598 weepage.'
      },
      {
        labelVi: 'Khả năng chịu nhiệt độ cao & Steam (Thermal Resistance)',
        labelEn: 'Thermal Limit & Steam Suitability',
        scoreA: 35,
        scoreB: 98,
        advantage: 'B',
        explanationVi: 'Van nêm kim loại OS&Y chịu tới 425°C, chuyên dụng cho hơi nóng lò hơi. Van nêm cao su bị hỏng hoàn toàn trên 80°C.',
        explanationEn: 'OS&Y metal-seated valve operates up to 425°C for superheated steam, whereas elastomer wedge fails above 80°C.'
      },
      {
        labelVi: 'Chống kẹt cặn & Bùn cát (Debris Clog Resistance)',
        labelEn: 'Flat Bottom Debris Clog Resistance',
        scoreA: 95,
        scoreB: 50,
        advantage: 'A',
        explanationVi: 'Đáy van nêm cao su phẳng 100% như ống dẫn, cát sỏi trôi thẳng. Đáy van kim loại có rãnh dễ đọng sỏi làm nứt nêm.',
        explanationEn: 'Resilient valve has smooth flat bottom without seat pocket, sweeping silt cleanly without entrapment.'
      },
      {
        labelVi: 'Chỉ báo trạng thái Đóng/Mở trực quan (Position Indicator)',
        labelEn: 'Visual Stem Position Indication',
        scoreA: 40,
        scoreB: 95,
        advantage: 'B',
        explanationVi: 'Ty nổi OS&Y nhô cao khi mở giúp nhân viên cứu hỏa & kỹ sư nhìn từ xa 50m biết ngay van đang mở hay đóng.',
        explanationEn: 'Rising stem on OS&Y valve visually indicates valve open/closed status from 50 meters away, essential for NFPA fire pump rooms.'
      }
    ],
    aiVerdict: {
      summaryVi: 'Dùng Van Cổng Nêm Bọc Cao Su (Resilient NRS) cho Nước sạch, Thoát nước và Mạng PCCC ngầm (chống kẹt cặn, kín tuyệt đối). Dùng Van Cổng Ty Nổi Nêm Thép (OS&Y Solid Wedge) cho Hệ thống Hơi nóng (Steam) và Phòng bơm PCCC chính theo chuẩn NFPA.',
      summaryEn: 'Specify Resilient Seated Gate Valve for potable water, sewage and buried fire mains (zero maintenance, flat bottom). Specify OS&Y Cast Steel Wedge Valve for steam circuits and NFPA fire pump suction/discharge headers.',
      capexOpexComparisonVi: 'Van nêm cao su có giá thành kinh tế hơn 40%, không cần bảo dưỡng rãnh đáy. Tuy nhiên ở hệ thống hơi nóng, chỉ có nêm kim loại OS&Y mới chịu được nhiệt độ và áp suất.',
      capexOpexComparisonEn: 'Resilient gate valve is 40% more economical with zero pocket clogging. However on thermal circuits, only OS&Y metal-seated valves deliver safety compliance.',
      engineeringAdviceVi: 'Khuyến cáo: Tại phòng máy bơm PCCC theo tiêu chuẩn NFPA 20, bắt buộc phải dùng van cổng ty nổi OS&Y để kiểm soát trực quan trạng thái cấp nước.',
      engineeringAdviceEn: 'Rule of Thumb: For fire pump headers per NFPA 20, OS&Y rising stem valves are mandatory to provide immediate visual confirmation of open status.',
      standardsRef: ['AWWA C509 / C515', 'BS 5163', 'API 600 / ASME B16.34', 'NFPA 20 / UL 262']
    }
  },
  {
    id: 'check-dual-plate-vs-silent',
    categoryKey: 'check',
    categoryNameVi: 'Van 1 Chiều (Check Valves)',
    categoryNameEn: 'Check Valves',
    valveA: {
      nameVi: 'Van 1 Chiều Cánh Bướm Kẹp Bích (Dual Plate Wafer Check Valve)',
      nameEn: 'Dual Plate Wafer Check Valve',
      designType: 'Wafer Dual Plate Butterfly with Torsion Springs',
      shortDescVi: 'Thân kẹp bích Wafer siêu mỏng, 2 cánh đĩa hình bán nguyệt gắn trên chốt lò xo xoắn trung tâm. Đóng nhanh nhờ lực lò xo trợ lực.',
      shortDescEn: 'Ultra-compact wafer body with two semicircular plates mounted on central hinge pin with torsion springs.',
      sealingMechanismVi: 'Lò xo xoắn đẩy 2 cánh đĩa áp vào đệm cao su hoặc kim loại ngay khi dòng chảy bắt đầu giảm tốc.',
      sealingMechanismEn: 'Torsion springs snap dual plates against rubber/metal seat as flow decelerates.',
      tempRating: '-10°C đến +150°C (Đệm EPDM/NBR/Viton)',
      pressureRating: 'PN16 / PN25 / Class 150 - 300',
      leakageClass: 'API 598 / ISO 5208 Rate A (Đệm mềm)',
      cycleLife: '200,000 chu trình',
      actuatorTorque: 'Tự động vận hành bằng dòng chảy thủy lực',
      bestSuitedVi: [
        'Không gian lắp đặt chật hẹp, phòng kỹ thuật trần thấp',
        'Tuyến ống cấp nước sinh hoạt, tuần hoàn chiller HVAC',
        'Lắp đặt theo phương ngang hoặc phương đứng (chiều dòng chảy hướng lên)',
        'Tiết kiệm 70% trọng lượng so với van 1 chiều lá lật bích truyền thống'
      ],
      bestSuitedEn: [
        'Constrained piping shafts and low-ceiling mechanical rooms',
        'General HVAC condenser water and building booster pumps',
        'Horizontal and vertical upward flow configurations',
        'Saves up to 70% physical weight compared to swing flanged valves'
      ],
      limitationsVi: [
        'Tổn thất áp lực (Delta P) cao hơn do chốt giữa cản dòng chảy',
        'Không thích hợp cho nước thải chứa nhiều sợi rác dài (dễ quấn vào chốt)'
      ],
      limitationsEn: [
        'Slightly higher head loss due to central hinge post in flow path',
        'Unsuitable for raw sewage with stringy rags that catch on central pin'
      ]
    },
    valveB: {
      nameVi: 'Van 1 Chiều Lò Xo Chống Búa Nước (Silent Non-Slam Lift Check Valve)',
      nameEn: 'Silent Non-Slam Spring Lift Check Valve',
      designType: 'Center Guided Poppet with Heavy-Duty Axial Spring',
      shortDescVi: 'Thân van dạng bầu khí động học (Hydrodynamic globe), đĩa van hình nón dẫn hướng trục tâm có lò xo nén thẳng cực mạnh.',
      shortDescEn: 'Hydrodynamic diffuser body with center-guided poppet actuated by heavy-duty axial stainless spring.',
      sealingMechanismVi: 'Cơ chế đóng trước dòng chảy ngược (Pre-zero closing): Lò xo nén đẩy đĩa van đóng kín hoàn toàn TRƯỚC KHI dòng chảy đảo chiều.',
      sealingMechanismEn: 'Closes prior to flow reversal at zero velocity, completely eliminating water hammer shockwaves.',
      tempRating: '-20°C đến +180°C',
      pressureRating: 'PN16 / PN25 / PN40 (Class 150 - 300)',
      leakageClass: 'ISO 5208 Rate A / API 598 Bubble-Tight',
      cycleLife: '500,000 chu trình liên tục tại đầu đẩy máy bơm',
      actuatorTorque: 'Tự động phản ứng siêu tốc < 0.05 giây',
      bestSuitedVi: [
        'Ngay tại họng đẩy của các máy bơm tăng áp công suất lớn (Pump discharge)',
        'Đường ống cấp nước đẩy lên các tòa tháp cao tầng (chống búa nước giật sập ống)',
        'Trạm bơm nước thô và trạm bơm chính khu công nghiệp',
        'Hệ thống bơm PCCC áp lực cao yêu cầu độ êm tuyệt đối'
      ],
      bestSuitedEn: [
        'High-capacity centrifugal pump discharge ports',
        'High-rise vertical riser pumping mains prone to water hammer column separation',
        'Municipal water booster stations and raw water intake headers',
        'High-pressure fire pump discharge lines demanding zero noise'
      ],
      limitationsVi: [
        'Kích thước chiều dài và trọng lượng lớn hơn van bướm kẹp wafer',
        'Chi phí đầu tư ban đầu cao hơn khoảng 1.6 - 2.2 lần'
      ],
      limitationsEn: [
        'Larger face-to-face dimensions and heavier weight',
        'Higher equipment cost (1.6x - 2.2x over wafer check)'
      ]
    },
    metrics: [
      {
        labelVi: 'Khả năng triệt tiêu búa nước (Water Hammer Elimination)',
        labelEn: 'Water Hammer & Surge Elimination',
        scoreA: 70,
        scoreB: 99,
        advantage: 'B',
        explanationVi: 'Van Silent đóng kín trước khi dòng nước kịp chảy ngược (tốc độ < 0.05s), triệt tiêu 100% tiếng va đập "ầm" làm nứt vỡ ống.',
        explanationEn: 'Silent check closes before flow reversal at zero velocity, eliminating 100% of destructive hydraulic shockwaves.'
      },
      {
        labelVi: 'Tiết kiệm không gian & Trọng lượng (Compact Space)',
        labelEn: 'Space & Structural Weight Savings',
        scoreA: 98,
        scoreB: 50,
        advantage: 'A',
        explanationVi: 'Van kẹp bích Dual Plate mỏng chỉ 40-70mm, nhẹ hơn 70%, lắp đặt cực kỳ dễ dàng trong hộp gen chật chội.',
        explanationEn: 'Dual plate wafer is only 40-70mm thin and 70% lighter, ideal for crowded MEP shafts.'
      },
      {
        labelVi: 'Độ bền đầu đẩy máy bơm cao tầng (High-Rise Pump Duty)',
        labelEn: 'High-Rise Riser Pump Duty Reliability',
        scoreA: 65,
        scoreB: 96,
        advantage: 'B',
        explanationVi: 'Lò xo nén trục tâm của van Silent chịu được hàng triệu chu trình bật tắt máy bơm cao tầng mà không bị gãy chốt.',
        explanationEn: 'Heavy axial spring and center guide withstand continuous pump start/stop cycles without hinge fatigue.'
      },
      {
        labelVi: 'Chi phí mua sắm & Lắp đặt (Initial CAPEX)',
        labelEn: 'Initial Purchase & Installation CAPEX',
        scoreA: 92,
        scoreB: 55,
        advantage: 'A',
        explanationVi: 'Van Dual Plate tiết kiệm cả tiền van lẫn bu-lông mặt bích, là giải pháp kinh tế cho tuyến ống thứ cấp.',
        explanationEn: 'Dual plate reduces initial valve and flange stud costs, perfect for secondary loops.'
      }
    ],
    aiVerdict: {
      summaryVi: 'Dùng Van 1 Chiều Cánh Bướm (Dual Plate Wafer) cho các nhánh ống phụ, hệ thống Chiller và phòng máy chật hẹp. BẮT BUỘC dùng Van 1 Chiều Lò Xo Chống Búa Nước (Silent Non-Slam) ngay tại đầu đẩy máy bơm cao tầng để bảo vệ toàn bộ mạng lưới đường ống khỏi nứt vỡ.',
      summaryEn: 'Specify Dual Plate Wafer Check for secondary loops, compact spaces and general chilled water distribution. MANDATORY to install Silent Non-Slam Check directly on high-head pump discharge nozzles to protect piping from catastrophic water hammer.',
      capexOpexComparisonVi: 'Trang bị van Silent Check đắt hơn vài triệu đồng nhưng bảo vệ được cả hệ thống đường ống trị giá hàng tỷ đồng không bị rung giật gãy mối hàn khi cúp điện đột ngột.',
      capexOpexComparisonEn: 'Investing in Silent check costs marginally more, but safeguards multi-million dollar piping risers from devastating surge rupture during emergency power outages.',
      engineeringAdviceVi: 'Khuyến cáo: Với các tòa nhà trên 15 tầng hoặc cột áp máy bơm trên 60 mét, tuyệt đối không dùng van lá lật thông thường ở đầu bơm vì búa nước sẽ làm bung mặt bích trong 6 tháng.',
      engineeringAdviceEn: 'Rule: On high-rise buildings over 15 floors or pump heads above 60 meters, never use basic swing checks at pump discharge; specify center-guided non-slam silent check valves.',
      standardsRef: ['API 594', 'ASME B16.34', 'FM 1210', 'BS EN 12334']
    }
  }
];
