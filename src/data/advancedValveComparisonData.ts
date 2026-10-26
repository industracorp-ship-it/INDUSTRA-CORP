/**
 * Comprehensive Technical Comparison Datasets for Valve Engineering
 * Covering:
 * 1. Butterfly Offsets (Concentric Zero-Offset vs Double-Offset vs Triple-Offset TOV)
 * 2. Seating Technology (Soft-Seated vs Metal-to-Metal Seated)
 * 3. Globe Valve Body Patterns (T-Pattern Z-Body vs Y-Pattern Oblique vs Angle Pattern vs 3-Way)
 * 4. Globe Valve Disc/Plug Types (Flat Seat vs Plug/Tapered vs Needle Disc vs Ball-End Disc)
 * 5. Cross-Family Head-to-Head (Globe vs Butterfly vs Ball vs Gate)
 */

export interface DetailedComparisonItem {
  id: string;
  nameVi: string;
  nameEn: string;
  designPrincipleVi: string;
  designPrincipleEn: string;
  tempLimit: string;
  pressureLimit: string;
  sealingGrade: string; // ISO 5208
  flowCharacteristics: string;
  headLossFactorCv: 'Very High' | 'High' | 'Medium' | 'Low' | 'Negligible';
  headLossFactorCvVi: string;
  strengthsVi: string[];
  strengthsEn: string[];
  limitationsVi: string[];
  limitationsEn: string[];
  recommendedApplicationsVi: string;
  recommendedApplicationsEn: string;
  costIndex: number; // 1 (lowest) to 5 (highest)
}

export interface AdvancedComparisonGroup {
  id: string;
  tabKey: 'butterfly_offsets' | 'seating_tech' | 'globe_patterns' | 'disc_types' | 'globe_vs_butterfly' | 'custom_builder';
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  items: DetailedComparisonItem[];
  engineeringSummaryVi: string;
  engineeringSummaryEn: string;
}

export const ADVANCED_COMPARISON_GROUPS: AdvancedComparisonGroup[] = [
  {
    id: 'group_butterfly_offsets',
    tabKey: 'butterfly_offsets',
    titleVi: '1. Cấu Trúc Lệch Tâm Van Bướm (Concentric vs Double vs Triple-Offset)',
    titleEn: '1. Butterfly Valve Offsets (Zero vs Double vs Triple Eccentric)',
    descriptionVi: 'Phân tích cơ học tiếp xúc giữa đĩa và gioăng: Từ ma sát liên tục (Đồng tâm) đến tách rời hoàn toàn bằng hình học nón lệch tâm 3 cấp (TOV).',
    descriptionEn: 'Mechanical contact dynamics from continuous rub (Concentric) to cam-action camming and right-angled conical seating (TOV).',
    engineeringSummaryVi: 'Khuyến cáo: Chọn Concentric cho cấp nước đô thị & HVAC (áp <16 bar, nhiệt <120°C); chọn Double-Offset cho hệ chiller áp cao và dầu nhẹ (áp <25 bar, nhiệt <200°C); bắt buộc chọn Triple-Offset TOV cho hơi nóng, khí hydrocarbon và hóa chất độc hại yêu cầu độ kín bọt khí tuyệt đối Metal-to-Metal.',
    engineeringSummaryEn: 'Recommendation: Specify Concentric for municipal water/HVAC (<16 bar, <120°C); Double-Offset for high-head chillers/light hydrocarbons (<25 bar, <200°C); mandate Triple-Offset TOV for high-temp steam, gas loops and fugitive emission prevention.',
    items: [
      {
        id: 'bf_concentric',
        nameVi: 'Van Bướm Đồng Tâm (Zero-Offset / Concentric)',
        nameEn: 'Concentric (Zero-Offset) Butterfly Valve',
        designPrincipleVi: 'Trục van nằm chính giữa đường tâm đĩa và tâm ống. Đĩa van tiếp xúc ma sát liên tục 360° với đệm cao su đúc trong suốt toàn bộ góc quay 90°.',
        designPrincipleEn: 'Stem passes through the center of the disc and bore. Disc rubs against the rubber liner through the entire 90° stroke.',
        tempLimit: '-15°C đến +120°C (EPDM / NBR)',
        pressureLimit: 'PN10 - PN16 (Tối đa 16 bar)',
        sealingGrade: 'ISO 5208 Rate A (Kín tuyệt đối bọt khí)',
        flowCharacteristics: 'Gần tuyến tính ở góc mở 20° - 70°',
        headLossFactorCv: 'Medium',
        headLossFactorCvVi: 'Trở lực trung bình (đĩa cản một phần dòng chảy)',
        strengthsVi: [
          'Chi phí đầu tư thấp nhất trong tất cả các dòng van cùng kích cỡ DN.',
          'Trọng lượng siêu nhẹ, kết cấu kẹp Wafer chiếm diện tích lắp đặt tối thiểu.',
          'Đệm cao su đúc thay thế dễ dàng, làm kín hai chiều (Bi-directional).'
        ],
        strengthsEn: [
          'Lowest capital cost among all quarter-turn valves at equal bore sizes.',
          'Compact face-to-face wafer dimension saves structural piping space.',
          'Replaceable elastomeric liner, bi-directional sealing capability.'
        ],
        limitationsVi: [
          'Giới hạn nhiệt độ thấp (<120°C), không dùng được cho hơi nóng hoặc hóa chất mạnh.',
          'Mô-men xoắn ma sát cao do đĩa miết liên tục vào cao su, dễ mòn đệm tại vị trí cổ trục.'
        ],
        limitationsEn: [
          'Limited to temperatures below 120°C; unsuitable for steam or aggressive media.',
          'Higher operating torque due to continuous seat interference at shaft penetrations.'
        ],
        recommendedApplicationsVi: 'Cấp thoát nước đô thị, xử lý nước thải, hệ thống PCCC, đường ống làm mát Chiller HVAC.',
        recommendedApplicationsEn: 'Municipal waterworks, wastewater, fire protection sprinkler headers, HVAC chilled water loops.',
        costIndex: 1
      },
      {
        id: 'bf_double_offset',
        nameVi: 'Van Bướm Lệch Tâm Kép (Double-Offset / High-Performance)',
        nameEn: 'Double-Offset (High-Performance) Butterfly Valve',
        designPrincipleVi: 'Offset 1: Trục van dịch về phía sau bề mặt làm kín; Offset 2: Trục van lệch khỏi tâm đường ống. Khi quay, đĩa hoạt động như cơ cấu Cam, chỉ chạm đệm ở 3° - 5° cuối cùng của hành trình đóng.',
        designPrincipleEn: 'Offset 1: Shaft behind seat plane; Offset 2: Shaft off bore centerline. Cam action lifts disc off seat within 3°-5° of opening.',
        tempLimit: '-50°C đến +260°C (PTFE / RPTFE)',
        pressureLimit: 'PN16 - PN25 / Class 150 - 300 (Tối đa 40 bar)',
        sealingGrade: 'ISO 5208 Rate A (Bubble-Tight)',
        flowCharacteristics: 'Đặc tính phần trăm bằng nhau (Equal Percentage)',
        headLossFactorCv: 'Low',
        headLossFactorCvVi: 'Trở lực thấp hơn dòng đồng tâm',
        strengthsVi: [
          'Triệt tiêu 95% ma sát trượt, tuổi thọ đệm van đạt trên 500,000 chu trình đóng mở.',
          'Mô-men xoắn vận hành nhỏ hơn 30% so với van đồng tâm, tiết kiệm chi phí mua mô-tơ điện/khí nén.',
          'Chịu được áp suất cao PN25 - PN40 và nhiệt độ tới 260°C với đệm PTFE gia cường.'
        ],
        strengthsEn: [
          'Eliminates 95% of rubbing friction, extending seal lifespan past 500,000 cycles.',
          '30% lower break-away torque reduces actuator sizing capital costs.',
          'Handles pressures up to Class 300 and temperatures up to 260°C with RPTFE seat.'
        ],
        limitationsVi: [
          'Giá thành cao gấp 2.5 - 3.5 lần so với van bướm đồng tâm thông thường.',
          'Làm kín một chiều ưu tiên (cần lưu ý chiều mũi tên áp suất khi lắp đặt).'
        ],
        limitationsEn: [
          'Cost index 2.5x to 3.5x higher than concentric wafer variants.',
          'Preferred unidirectional sealing orientation requires careful field alignment.'
        ],
        recommendedApplicationsVi: 'Đường ống Chiller áp lực cao, hơi nóng áp suất thấp, dầu nhờn, trạm bơm nước tuần hoàn công nghiệp.',
        recommendedApplicationsEn: 'High-pressure chilled water risers, low-pressure saturated steam, lube oils, district energy plants.',
        costIndex: 3
      },
      {
        id: 'bf_triple_offset',
        nameVi: 'Van Bướm Lệch Tâm 3 (Triple-Offset / TOV Metal-to-Metal)',
        nameEn: 'Triple-Offset (TOV) Metal-to-Metal Butterfly Valve',
        designPrincipleVi: 'Bổ sung Offset 3: Trục nón làm kín nghiêng góc lệch so với tâm ống. Đĩa và ghế van tiếp xúc hoàn toàn góc vuông (Right-Angled Conical Seating), triệt tiêu 100% ma sát trượt cơ học.',
        designPrincipleEn: 'Offset 3: Conical axis tilted relative to bore axis. True right-angled cam-action seating with zero scrubbing across entire travel.',
        tempLimit: '-196°C (Cryogenic) đến +550°C (Hơi quá nhiệt)',
        pressureLimit: 'Class 150 - Class 600 / PN40 - PN100 (Tối đa 100 bar)',
        sealingGrade: 'ISO 5208 Rate A (Zero Leakage kim loại với kim loại)',
        flowCharacteristics: 'Điều tiết tuyến tính chính xác cao, không rung lắc',
        headLossFactorCv: 'Low',
        headLossFactorCvVi: 'Trở lực thấp, lưu lượng thông qua Kv cực lớn',
        strengthsVi: [
          'Làm kín kim loại - kim loại (Stellite Gr.6 / Inox nhiều lớp) đạt cấp độ kín tuyệt đối Zero Leakage.',
          'Chịu nhiệt độ cực đoan từ khí hóa lỏng âm sâu (-196°C) đến hơi quá nhiệt (+550°C).',
          'Chuẩn an toàn chống cháy tuyệt đối Fire-Safe API 607 và kiểm soát khí rò rỉ ISO 15848-1 Cấp AH.'
        ],
        strengthsEn: [
          'True bubble-tight Metal-to-Metal zero leakage meeting ISO 5208 Rate A.',
          'Withstands extreme operating ranges from cryogenic LNG (-196°C) to superheated steam (+550°C).',
          'Inherent Fire-Safe certification to API 607 and fugitive emission compliance to ISO 15848-1.'
        ],
        limitationsVi: [
          'Giá thành cao nhất trong các loại van bướm, đòi hỏi độ chính xác gia công CNC vi mô.',
          'Yêu cầu kỹ sư bảo dưỡng có tay nghề cao khi hiệu chỉnh lại vị trí dừng của hộp số.'
        ],
        limitationsEn: [
          'Premium capital expenditure requiring micron-precision 5-axis CNC machining.',
          'Requires trained technicians to calibrate gearbox travel stops during commissioning.'
        ],
        recommendedApplicationsVi: 'Nhà máy lọc hóa dầu, hệ thống hơi quá nhiệt lò hơi, khí đốt tự nhiên LNG, trạm phân phối hóa chất nguy hiểm.',
        recommendedApplicationsEn: 'Petrochemical refineries, superheated steam headers, LNG cryogenic transport, offshore platforms.',
        costIndex: 5
      }
    ]
  },
  {
    id: 'group_seating_tech',
    tabKey: 'seating_tech',
    titleVi: '2. Công Nghệ Làm Kín: Đệm Mềm (Soft-Seated) vs Đệm Kim Loại (Metal-to-Metal)',
    titleEn: '2. Seating Metallurgy: Soft-Seated vs Metal-to-Metal Hardfacing',
    descriptionVi: 'So sánh cơ chế làm kín bằng biến dạng đàn hồi phi kim (Elastomer/PTFE) và cơ chế tiếp xúc kim loại tôi cứng Stellite Gr.6.',
    descriptionEn: 'Comparative evaluation between elastomeric deformation sealing and hardened cobalt-alloy metal seating.',
    engineeringSummaryVi: 'Khuyến cáo: Chọn Soft-Seated khi môi chất sạch hoặc khí nén ở nhiệt độ <180°C yêu cầu đóng ngắt tuyệt đối không rò rỉ bọt khí; Chọn Metal-to-Metal Seated khi môi chất có hạt rắn lơ lửng, cát sạn, bùn xỉ, dầu truyền nhiệt hoặc nhiệt độ >200°C.',
    engineeringSummaryEn: 'Recommendation: Select Soft-Seated for clean fluid, potable water and air below 180°C requiring bubble-tight shutoff; Select Metal-to-Metal for abrasive slurry, steam, thermal fluid or high temperatures exceeding 200°C.',
    items: [
      {
        id: 'seat_soft',
        nameVi: 'Công Nghệ Đệm Mềm Phi Kim (Soft-Seated: EPDM / PTFE / Viton)',
        nameEn: 'Resilient Soft-Seated (EPDM / PTFE / FKM / NBR)',
        designPrincipleVi: 'Sử dụng vật liệu đàn hồi phi kim (cao su EPDM, NBR, Viton hoặc nhựa PTFE/RPTFE) để điền đầy vi khuyết tật trên bề mặt kim loại khi bị nén.',
        designPrincipleEn: 'Utilizes compliant polymeric materials to deform elastically and fill microscopic asperities on mating metallic surfaces.',
        tempLimit: '-20°C đến +180°C (PTFE: max 200°C)',
        pressureLimit: 'Tối ưu ở dải PN10 - PN25 (Giảm áp khi nhiệt độ tăng)',
        sealingGrade: 'ISO 5208 Rate A (Bubble-Tight, 0 giọt / 0 bọt khí)',
        flowCharacteristics: 'Đóng/ngắt On-Off tuyệt đối',
        headLossFactorCv: 'Low',
        headLossFactorCvVi: 'Trở lực thấp',
        strengthsVi: [
          'Độ kín khít tuyệt đối 100% bọt khí ngay cả ở chênh áp thấp (Low ΔP sealing).',
          'Lực đóng mô-men xoắn nhẹ nhàng, chi phí bảo trì thay thế đệm kinh tế.',
          'Kháng ăn mòn hóa chất cực tốt với đệm PTFE / Teflon nguyên sinh.'
        ],
        strengthsEn: [
          'True bubble-tight zero leakage shutoff even under minimal differential pressures.',
          'Lower seating torque requirements allow smaller, cost-effective actuators.',
          'Superior chemical inertness with virgin PTFE liners.'
        ],
        limitationsVi: [
          'Dễ bị rách hoặc biến dạng trôi (Cold flow/Extrusion) khi gặp hạt rắn cứng hoặc chênh áp quá cao.',
          'Giới hạn nhiệt độ thấp: cao su hỏng ở >120°C, PTFE bắt đầu mềm và phân hủy ở >220°C.'
        ],
        limitationsEn: [
          'Susceptible to tearing, scouring, and cold flow extrusion from particulate slurries.',
          'Strict thermal ceiling: elastomers degrade above 120°C; PTFE softens above 220°C.'
        ],
        recommendedApplicationsVi: 'Hệ thống nước sạch, nước uống, khí nén sạch, đường ống chiller HVAC, hóa chất loãng, nước sinh hoạt.',
        recommendedApplicationsEn: 'Potable water networks, clean compressed air, HVAC hydronic loops, dilute chemicals.',
        costIndex: 2
      },
      {
        id: 'seat_metal',
        nameVi: 'Công Nghệ Đệm Kim Loại Tôi Cứng (Metal-to-Metal Seated: Stellite Gr.6)',
        nameEn: 'Hardened Metal-to-Metal Seated (Stellite Gr.6 Hardfacing)',
        designPrincipleVi: 'Hai bề mặt kim loại đối ứng được mài rà (lapping) với độ bóng gương (Ra < 0.2 µm) và tôi phủ hợp kim Stellite Gr.6 hoặc Tungsten Carbide độ cứng >42 HRC.',
        designPrincipleEn: 'Precision-lapped metallic surfaces with mirror finish (Ra < 0.2 µm) hardfaced with Stellite Gr.6 or Tungsten Carbide (>42 HRC).',
        tempLimit: '-196°C đến +650°C (Chịu nhiệt độ cực đoan)',
        pressureLimit: 'Chịu áp lực siêu cao: Class 150 - Class 2500 (PN420)',
        sealingGrade: 'ISO 5208 Rate B / Rate C / Rate A (với công nghệ TOV tiên tiến)',
        flowCharacteristics: 'Vừa đóng ngắt vừa điều tiết dòng xói lở tốt',
        headLossFactorCv: 'Low',
        headLossFactorCvVi: 'Trở lực thấp, chịu được dòng chảy vận tốc cao',
        strengthsVi: [
          'Kháng mài mòn, chống xói lở và chống kẹt cứng (Anti-galling) vượt trội.',
          'Không bị phá hủy bởi hạt cát, xỉ kim loại, cặn đường ống hay dòng bọt khí xâm thực.',
          'Đạt chuẩn chống cháy tuyệt đối Fire-Safe tự nhiên (không có bộ phận bị nóng chảy khi cháy).'
        ],
        strengthsEn: [
          'Exceptional erosion, abrasion and galling resistance under severe fluid velocities.',
          'Unaffected by entrained sand, pipe scale, boiler sludge or cavitation impingement.',
          'Inherent Fire-Safe performance without polymer components to melt during fires.'
        ],
        limitationsVi: [
          'Giá thành sản xuất và gia công mài rà cao gấp 3 - 5 lần so với đệm mềm.',
          'Cần lực mô-men xoắn đóng van lớn hơn để ép kín bề mặt kim loại.'
        ],
        limitationsEn: [
          'Capital manufacturing cost 3x to 5x higher due to precision CNC lapping.',
          'Higher seating torque demands heavy-duty pneumatic or electric actuation.'
        ],
        recommendedApplicationsVi: 'Lò hơi quá nhiệt, trạm xả đáy lò hơi, đường ống dẫn than bùn/quặng xỉ, dầu truyền nhiệt 350°C, khí hydro áp cao.',
        recommendedApplicationsEn: 'Superheated steam, boiler blowdown, abrasive mining slurries, 350°C thermal oil, high-pressure hydrogen.',
        costIndex: 5
      }
    ]
  },
  {
    id: 'group_globe_patterns',
    tabKey: 'globe_patterns',
    titleVi: '3. Cấu Trúc Thân Van Cầu (T-Pattern vs Y-Pattern vs Angle vs 3-Way)',
    titleEn: '3. Globe Valve Body Patterns (T-Pattern vs Y-Pattern vs Angle vs 3-Way)',
    descriptionVi: 'So sánh đường dẫn dòng chảy cơ học bên trong thân van cầu: Từ chuyển hướng chữ S (T-Pattern) đến dòng thẳng xiên 45° (Y-Pattern) và đổi hướng góc vuông (Angle).',
    descriptionEn: 'Internal hydrodynamic flow geometry comparison: S-curve path (T-Pattern), 45° inclined oblique path (Y-Pattern), and right-angle diversion.',
    engineeringSummaryVi: 'Khuyến cáo: T-Pattern phù hợp nhất cho điều tiết vi chỉnh lưu lượng chính xác cao; Y-Pattern là giải pháp tối ưu cho lò hơi áp suất cao để giảm 60% tổn thất áp lực; Angle Pattern là lựa chọn bắt buộc cho môi chất bẩn, nhớt hoặc vị trí góc cua 90° để tiết kiệm cút nối.',
    engineeringSummaryEn: 'Recommendation: T-Pattern is optimal for high-precision throttling; Y-Pattern cuts parasitic head loss by 60% on high-pressure steam; Angle Pattern handles viscous/slurry fluids while eliminating 90° piping elbows.',
    items: [
      {
        id: 'globe_t_pattern',
        nameVi: 'Van Cầu Thân Chữ T (T-Pattern / Z-Body / Straight-Through)',
        nameEn: 'T-Pattern (Z-Body / Straight-Through) Globe Valve',
        designPrincipleVi: 'Vách ngăn hình chữ S nằm ngang bên trong thân van, buộc dòng lưu chất phải chuyển hướng 90° đi lên qua ghế van rồi lại chuyển hướng 90° đi tiếp.',
        designPrincipleEn: 'Horizontal S-shaped diaphragm forcing fluid through two 90° turns up through the seat orifice.',
        tempLimit: '-29°C đến +425°C (Thép WCB / CF8M)',
        pressureLimit: 'Class 150 - Class 900 (PN16 - PN160)',
        sealingGrade: 'ISO 5208 Rate A hoặc Rate B',
        flowCharacteristics: 'Độ chính xác điều tiết tuyến tính cao nhất',
        headLossFactorCv: 'Very High',
        headLossFactorCvVi: 'Tổn thất áp suất cao nhất trong các kiểu van (Hệ số trở lực K ~ 5.5 - 6.0)',
        strengthsVi: [
          'Độ nhạy và khả năng điều tiết lưu lượng cực kỳ chính xác theo từng bước dịch chuyển trục.',
          'Cấu trúc đúc chuẩn hóa phổ biến nhất, phụ tùng thay thế và đóng đệm có sẵn trên toàn cầu.',
          'Hành trình đóng mở ngắn hơn van cổng, thuận tiện tích hợp bộ điều khiển vị trí tuyến tính.'
        ],
        strengthsEn: [
          'Finest throttling resolution and precise linear flow characteristics.',
          'Globally standardized manufacturing with readily available replacement trims.',
          'Shorter stroke length than gate valves, ideal for linear positioner automation.'
        ],
        limitationsVi: [
          'Tổn thất áp lực (Pressure Drop) rất lớn do dòng chảy bị bẻ cong 2 lần chữ S.',
          'Nguy cơ lắng đọng bùn cặn và xỉ rỉ sét tại các góc chết dưới vách ngăn.'
        ],
        limitationsEn: [
          'Severe pressure drop due to double 90° directional change (Resistance coefficient K ~ 5.5-6.0).',
          'Stagnant dead zones under diaphragm trap particulate debris and boiler scale.'
        ],
        recommendedApplicationsVi: 'Van bypass giảm áp, van điều chỉnh lưu lượng nước lạnh FCU/AHU, van kiểm soát cấp hóa chất chính xác.',
        recommendedApplicationsEn: 'Pressure reducing station bypasses, precise FCU/AHU hydronic balancing, chemical dosing injection.',
        costIndex: 3
      },
      {
        id: 'globe_y_pattern',
        nameVi: 'Van Cầu Thân Xiên (Y-Pattern / Y-Body / Oblique)',
        nameEn: 'Y-Pattern (Y-Body / Oblique) Globe Valve',
        designPrincipleVi: 'Trục van và ghế van được đặt nghiêng một góc 45° so với phương dòng chảy, giúp đường đi của chất lỏng gần như là một đường thẳng mượt mà.',
        designPrincipleEn: 'Stem and seat oriented at an oblique 45° angle relative to centerline, creating a near-linear streamline waterway.',
        tempLimit: '-29°C đến +550°C (Thép hợp kim WC6/WC9)',
        pressureLimit: 'Class 150 - Class 2500 (PN16 - PN420)',
        sealingGrade: 'ISO 5208 Rate A',
        flowCharacteristics: 'Điều tiết dòng mượt mà với chênh áp lớn',
        headLossFactorCv: 'Medium',
        headLossFactorCvVi: 'Tổn thất áp suất giảm 60% so với van thân chữ T (K ~ 1.5 - 2.0)',
        strengthsVi: [
          'Giảm 60% trở lực dòng chảy, tiết kiệm hàng trăm triệu đồng điện năng bơm tuần hoàn mỗi năm.',
          'Chống xói lở và chống búa nước tuyệt hảo trong các đường ống hơi nóng áp suất cao.',
          'Độ bền chu trình vượt trội khi lắp đặt làm van xả đáy lò hơi (Boiler Blowdown Valve).'
        ],
        strengthsEn: [
          'Cuts flow resistance by 60% compared to T-Pattern, generating significant pumping energy savings.',
          'Superior resistance to cavitation erosion on high-pressure superheated steam headers.',
          'Ideal endurance when deployed on severe-service boiler blowdown applications.'
        ],
        limitationsVi: [
          'Kích thước bao ngoài dài hơn và góc lắp trục van nghiêng 45° đòi hỏi không gian thao tác rộng.',
          'Chi phí đúc thân nghiêng đắt hơn khoảng 30% - 40% so với thân chữ T thông thường.'
        ],
        limitationsEn: [
          'Longer face-to-face and 45° angled bonnet clearance require greater installation headroom.',
          'Foundry casting complexity adds 30%-40% premium over conventional T-patterns.'
        ],
        recommendedApplicationsVi: 'Đường ống hơi quá nhiệt lò hơi, đường xả đáy lò hơi áp suất cao, trạm nhiệt điện turbine.',
        recommendedApplicationsEn: 'Superheated boiler mains, high-pressure boiler blowoff, thermal power turbine steam loops.',
        costIndex: 4
      },
      {
        id: 'globe_angle_pattern',
        nameVi: 'Van Cầu Thân Góc 90° (Angle Pattern Globe Valve)',
        nameEn: 'Angle Pattern (90° Body) Globe Valve',
        designPrincipleVi: 'Đầu vào và đầu ra của van vuông góc 90° với nhau, dòng chảy đi vào từ đáy và xả ngang vuông góc, hoặc ngược lại.',
        designPrincipleEn: 'Inlet and outlet oriented at a 90° right angle, routing fluid directly around a single turning bend.',
        tempLimit: '-40°C đến +450°C',
        pressureLimit: 'Class 150 - Class 1500 (PN16 - PN250)',
        sealingGrade: 'ISO 5208 Rate A',
        flowCharacteristics: 'Điều tiết dòng xoáy mòn có hạt rắn cực tốt',
        headLossFactorCv: 'Low',
        headLossFactorCvVi: 'Trở lực thấp hơn thân T-Pattern (Hệ số K ~ 2.0)',
        strengthsVi: [
          'Đóng vai trò như một cút nối 90° (Elbow), tiết kiệm chi phí mua phụ kiện và mối hàn ống.',
          'Dòng chảy thoát nhanh thẳng xuống dưới giúp tự làm sạch cặn bẩn, không bị đọng bùn đất.',
          'Cực kỳ hiệu quả trong việc triệt tiêu xung lực xâm thực (Cavitation) và chống kẹt đĩa.'
        ],
        strengthsEn: [
          'Serves simultaneously as a 90° elbow, eliminating redundant pipe fittings and welds.',
          'Self-scouring downward drainage prevents sediment buildup in slurry duty.',
          'Expels cavitation implosions directly down the downstream axis away from body walls.'
        ],
        limitationsVi: [
          'Chỉ có thể lắp đặt tại vị trí đường ống bẻ góc vuông 90°, không lắp được trên đường ống thẳng.'
        ],
        limitationsEn: [
          'Restricted strictly to 90° piping elbows; cannot be integrated into straight runs.'
        ],
        recommendedApplicationsVi: 'Đầu vào bồn áp lực, trạm phân phối hơi nóng đổi hướng, hệ thống dung dịch nhớt và bùn xỉ quặng.',
        recommendedApplicationsEn: 'Pressure vessel nozzles, steam header drop legs, viscous syrups, erosive slurry lines.',
        costIndex: 3
      },
      {
        id: 'globe_3way_pattern',
        nameVi: 'Van Cầu 3 Ngã Pha/Chia Dòng (3-Way Mixing & Diverting Globe Valve)',
        nameEn: '3-Way Mixing & Diverting Globe Valve',
        designPrincipleVi: 'Thân van có 3 cổng kết nối với 2 ghế van đối xứng: Pha trộn 2 dòng vào thành 1 dòng ra (Mixing) hoặc Chia 1 dòng vào thành 2 dòng ra (Diverting).',
        designPrincipleEn: 'Three-port body with opposing seats designed for mixing two inlets or diverting one inlet into two outlets.',
        tempLimit: '-10°C đến +220°C',
        pressureLimit: 'PN16 - PN25',
        sealingGrade: 'ISO 5208 Rate B / C',
        flowCharacteristics: 'Đặc tính điều tiết bù nhiệt độ đối xứng',
        headLossFactorCv: 'Medium',
        headLossFactorCvVi: 'Trở lực trung bình tùy tỉ lệ pha trộn',
        strengthsVi: [
          'Thay thế cụm 2 van 2 ngã độc lập, giảm thiểu số lượng thiết bị điều khiển và dây cáp SCADA.',
          'Kiểm soát nhiệt độ nước làm mát Chiller và dàn trao đổi nhiệt calorife cực kỳ mượt mà.'
        ],
        strengthsEn: [
          'Replaces two independent 2-way control valves, slashing field wiring and PLC I/O points.',
          'Delivers seamless thermostatic modulation for HVAC AHU coils and plate heat exchangers.'
        ],
        limitationsVi: [
          'Cần phân biệt chính xác van Pha Trộn (Mixing) và van Chia Dòng (Diverting) để tránh hiện tượng áp lực nước đóng sập đĩa van (Slam).'
        ],
        limitationsEn: [
          'Strict distinction between Mixing and Diverting trims required to prevent hydraulic plug slam.'
        ],
        recommendedApplicationsVi: 'Hệ thống điều hòa trung tâm HVAC Chiller, kiểm soát nhiệt độ bồn gia nhiệt nước nóng trung tâm, lò sấy.',
        recommendedApplicationsEn: 'HVAC Chiller AHU temperature control, domestic hot water generation, industrial drying kilns.',
        costIndex: 4
      }
    ]
  },
  {
    id: 'group_disc_types',
    tabKey: 'disc_types',
    titleVi: '4. Thiết Kế Đĩa Van (By Disc / Plug Type: Đĩa Phẳng vs Hình Côn vs Hình Kim vs Đầu Bi)',
    titleEn: '4. Disc & Plug Geometries (Flat Seat vs Plug/Tapered vs Needle vs Ball-End)',
    descriptionVi: 'Phân loại hình học tiết diện đĩa van quyết định năng lực điều tiết lưu lượng và khả năng chống xói mòn bề mặt tiếp xúc.',
    descriptionEn: 'Geometry of the throttling plug governing volumetric flow profiling and erosion resistance under high shear velocities.',
    engineeringSummaryVi: 'Khuyến cáo: Dùng Đĩa Phẳng (Flat Disc) khi chỉ cần đóng/ngắt On-Off nhanh; Dùng Đĩa Hình Côn (Plug/Tapered) cho van điều tiết hơi nóng & dầu khí có áp lực cao; Dùng Đĩa Hình Kim (Needle Disc) cho đồng hồ áp suất & đo lường vi chỉnh; Dùng Đĩa Đầu Bi (Ball-End) cho môi chất chứa cặn bẩn bám dính.',
    engineeringSummaryEn: 'Recommendation: Deploy Flat Discs for rapid on/off isolation; Tapered Plugs for severe throttling steam/gas loops; Needle Discs for precision instrument calibration; Ball-End Discs for scaling/slurry fluids.',
    items: [
      {
        id: 'disc_flat',
        nameVi: 'Đĩa Phẳng (Flat Disc / Flat Seat)',
        nameEn: 'Flat Disc / Flat Seat Geometry',
        designPrincipleVi: 'Bề mặt tiếp xúc giữa đĩa van và ghế van là một mặt phẳng tròn nằm ngang, tựa sát vào nhau khi đóng.',
        designPrincipleEn: 'Mating surface between disc and seat is a flat parallel horizontal plane.',
        tempLimit: '-20°C đến +200°C',
        pressureLimit: 'PN16 - PN25',
        sealingGrade: 'ISO 5208 Rate A (khi dùng đệm mềm) hoặc Rate B',
        flowCharacteristics: 'Mở nhanh (Quick Opening), không thích hợp điều tiết',
        headLossFactorCv: 'Medium',
        headLossFactorCvVi: 'Lưu lượng đạt tối đa ngay từ 30% hành trình mở',
        strengthsVi: [
          'Hành trình đóng mở ngắn nhất, đóng ngắt dòng chất lỏng nhanh chóng.',
          'Gia công cơ khí đơn giản, chi phí thay thế sửa chữa rẻ nhất.'
        ],
        strengthsEn: [
          'Shortest actuation travel stroke for rapid process isolation.',
          'Simplest manufacturing profile resulting in lowest trim replacement cost.'
        ],
        limitationsVi: [
          'Không được dùng để điều tiết lưu lượng: Dòng chảy ở khe hẹp sẽ làm rung giật đĩa van và phá hủy mặt phẳng làm kín.',
          'Dễ bị kẹt hạt sạn giữa 2 mặt phẳng gây rò rỉ.'
        ],
        limitationsEn: [
          'Unsuitable for throttling: high velocity across the flat crevice induces destructive flutter.',
          'Entrained particles trapped across flat planes cause seat scoring.'
        ],
        recommendedApplicationsVi: 'Van chặn On-Off đường ống nước, van xả đáy thông thường, hệ thống khí nén áp thấp.',
        recommendedApplicationsEn: 'General On-Off water isolation, low-pressure compressed air, utility shutoff.',
        costIndex: 1
      },
      {
        id: 'disc_plug_tapered',
        nameVi: 'Đĩa Hình Côn / Dạng Nút (Plug / Tapered Disc)',
        nameEn: 'Plug / Tapered Disc (Contoured Plug)',
        designPrincipleVi: 'Đĩa van có dạng hình nón thuôn dài, cắm sâu vào lỗ ghế van. Khi đĩa dịch chuyển lên xuống, diện tích khe hở hình vành khăn thay đổi đều đặn.',
        designPrincipleEn: 'Elongated conical cone mating deep into the seat bore, modulating annular flow area linearly.',
        tempLimit: '-40°C đến +550°C',
        pressureLimit: 'Class 150 - Class 2500 (PN16 - PN420)',
        sealingGrade: 'ISO 5208 Rate A (với Stellite Gr.6 mài bóng)',
        flowCharacteristics: 'Đặc tính điều tiết tuyến tính hoặc phần trăm bằng nhau lý tưởng',
        headLossFactorCv: 'Low',
        headLossFactorCvVi: 'Dòng chảy được hướng mượt mà, giảm xoáy cuộn',
        strengthsVi: [
          'Khả năng điều tiết lưu lượng bền bỉ nhất trong các môi trường chênh áp cao và hơi nóng khắc nghiệt.',
          'Kháng xói lở vượt trội: Bề mặt nón dốc làm hạt cặn trượt đi mà không gây xước mặt tiếp xúc.',
          'Bảo toàn tuổi thọ làm kín gấp 4 lần so với đĩa phẳng.'
        ],
        strengthsEn: [
          'Gold standard for severe throttling under extreme differential pressures and steam service.',
          'Superior scour resistance: tapered profile sheds particulates without scratching seating lines.',
          'Extends seat sealing integrity 4x longer than flat designs.'
        ],
        limitationsVi: [
          'Hành trình nâng trục dài hơn đòi hỏi thời gian quay tay gạt hoặc mô-tơ lâu hơn.',
          'Yêu cầu độ đồng tâm tuyệt đối giữa trục và ghế van khi lắp ráp.'
        ],
        limitationsEn: [
          'Longer lift stroke requires extended multi-turn actuation time.',
          'Requires precision stem-to-seat concentric alignment during assembly.'
        ],
        recommendedApplicationsVi: 'Van điều áp hơi nóng lò hơi, van điều khiển dầu truyền nhiệt, trạm giảm áp hơi nước công nghiệp.',
        recommendedApplicationsEn: 'Boiler steam throttling, thermal oil modulation, high-pressure steam pressure reduction.',
        costIndex: 4
      },
      {
        id: 'disc_needle',
        nameVi: 'Đĩa Hình Kim (Needle Disc / Micro-Metering Plug)',
        nameEn: 'Needle Disc / Micro-Metering Needle',
        designPrincipleVi: 'Đầu đĩa van được vuốt nhọn hoắt như mũi kim với góc côn cực nhỏ (10° - 15°), cho phép vi chỉnh lưu lượng ở mức mililit/phút.',
        designPrincipleEn: 'Extremely acute conical needle point (10°-15° angle) delivering micro-metering fluid control.',
        tempLimit: '-50°C đến +300°C',
        pressureLimit: 'Chịu áp lực cực cao: 3000 psi - 10,000 psi (PN200 - PN600)',
        sealingGrade: 'ISO 5208 Rate A (Độ kín bọt khí tuyệt đối)',
        flowCharacteristics: 'Vi chỉnh lưu lượng siêu chính xác (Micro-Flow)',
        headLossFactorCv: 'Very High',
        headLossFactorCvVi: 'Hệ số lưu lượng Cv rất nhỏ để kiểm soát giọt lỏng',
        strengthsVi: [
          'Độ chính xác đo lường và điều tiết lưu lượng cực vi mô mà không loại van nào khác đạt được.',
          'Chịu được áp suất cực đại lên tới 700 bar (10,000 psi) trong các khối van rèn nguyên khối.',
          'Bảo vệ an toàn cho các thiết bị đo lường nhạy cảm như đồng hồ đo áp suất, cảm biến áp suất.'
        ],
        strengthsEn: [
          'Unrivaled precision for micro-metering flows down to fractions of a liter per minute.',
          'Handles extreme pressures up to 10,000 psi (700 bar) in forged barstock bodies.',
          'Safeguards delicate pressure transmitters and gauge instrumentation from pressure shocks.'
        ],
        limitationsVi: [
          'Lỗ van rất nhỏ nên dễ bị tắc nghẽn nếu chất lỏng có cặn bẩn thô (bắt buộc lắp Y-lọc siêu mịn phía trước).',
          'Không dùng được cho đường ống truyền dẫn lưu lượng lớn.'
        ],
        limitationsEn: [
          'Susceptible to clogging from pipeline particulate (demands fine upstream filtration).',
          'Restricted strictly to instrument tubing lines (typically 1/4" to 1").'
        ],
        recommendedApplicationsVi: 'Van cách ly đồng hồ áp suất (Gauge Valve), van lấy mẫu phòng thí nghiệm, đường dẫn khí phân tích SCADA.',
        recommendedApplicationsEn: 'Pressure gauge isolation, analytical laboratory sampling, hydraulic test benches, chromatograph feeds.',
        costIndex: 3
      },
      {
        id: 'disc_ball_end',
        nameVi: 'Đĩa Đầu Bi (Ball-End Disc / Spherical Plug)',
        nameEn: 'Ball-End Disc / Spherical Plug',
        designPrincipleVi: 'Đầu đĩa van có dạng chỏm cầu bi xoay tự do, tiếp xúc theo đường tròn với ghế van côn.',
        designPrincipleEn: 'Disc tip incorporates a free-aligning spherical ball matching against a conical tapered seat.',
        tempLimit: '-29°C đến +400°C',
        pressureLimit: 'PN25 - PN64 / Class 300 - 600',
        sealingGrade: 'ISO 5208 Rate A',
        flowCharacteristics: 'Đóng kín tự lựa chống lệch tâm',
        headLossFactorCv: 'Medium',
        headLossFactorCvVi: 'Trở lực trung bình',
        strengthsVi: [
          'Cơ chế chỏm cầu tự lựa tâm (Self-aligning): Đĩa tự tìm điểm kín khít tối ưu ngay cả khi trục van hơi cong nhẹ.',
          'Hạn chế tối đa hiện tượng kẹt dính khi van đóng mở trong môi trường bùn cặn hoặc nhựa đường.',
          'Khả năng tự xoay của đầu bi giúp phân bố đều độ mài mòn, kéo dài tuổi thọ mặt làm kín.'
        ],
        strengthsEn: [
          'Self-aligning ball geometry seals tight even under slight thermal stem deflection.',
          'Minimizes sticking and galling in asphalt, viscous resin and scaling fluid streams.',
          'Free-rotating ball end distributes wear evenly around 360° seating circumference.'
        ],
        limitationsVi: [
          'Chi phí gia công hình học chỏm cầu bi tôi cứng đắt hơn đĩa phẳng.',
          'Không đạt độ tuyến tính cao bằng đĩa hình côn kéo dài.'
        ],
        limitationsEn: [
          'Higher manufacturing costs for precision ground spherical surfaces.',
          'Less linear flow modulation than elongated contoured plug designs.'
        ],
        recommendedApplicationsVi: 'Van xả đáy bể chứa, đường dẫn nhựa đường nóng, chất lỏng kết tinh và dầu nặng FO.',
        recommendedApplicationsEn: 'Tank bottom drain valves, hot bitumen/asphalt transfer, crystallizing slurries, heavy fuel oil.',
        costIndex: 3
      }
    ]
  },
  {
    id: 'group_globe_vs_butterfly',
    tabKey: 'globe_vs_butterfly',
    titleVi: '5. So Sánh Đối Đầu: Van Cầu (Globe) vs Van Bướm (Butterfly)',
    titleEn: '5. Direct Head-to-Head: Globe Valve vs Butterfly Valve',
    descriptionVi: 'Đối chiếu toàn diện giữa 2 dòng van phổ biến nhất trong hệ thống nhiệt lạnh và công nghiệp xử lý.',
    descriptionEn: 'Definitive engineering trade-off comparison between Globe Valves and Butterfly Valves.',
    engineeringSummaryVi: 'Khuyến cáo: Chọn Van Cầu khi cần kiểm soát lưu lượng/nhiệt độ chính xác cao và đường kính ống nhỏ (DN15 - DN100); Chọn Van Bướm khi đường kính ống lớn (DN100 - DN1200) để tiết kiệm 70% chi phí đầu tư, giảm 80% tải trọng giá đỡ ống và tối ưu hóa không gian lắp đặt.',
    engineeringSummaryEn: 'Recommendation: Select Globe Valves for fine control precision and smaller pipe sizes (DN15-DN100); Select Butterfly Valves for large diameters (DN100-DN1200) to slash capital expense by 70% and reduce structural pipe rack loading by 80%.',
    items: [
      {
        id: 'head_globe',
        nameVi: 'Dòng Van Cầu Tiêu Chuẩn (Globe Valve)',
        nameEn: 'Standard Globe Valve',
        designPrincipleVi: 'Chuyển động tịnh tiến thẳng đứng vuông góc với ghế van, điều tiết dòng chảy bằng cách thu hẹp khe hở vòng xuyến.',
        designPrincipleEn: 'Linear rising stem mechanism with disc moving perpendicular to horizontal seat ring.',
        tempLimit: '-196°C đến +550°C',
        pressureLimit: 'Tới Class 2500 (PN420)',
        sealingGrade: 'ISO 5208 Rate A',
        flowCharacteristics: 'Độ chính xác điều tiết số 1 (Đặc tính Tuyến tính / Equal %)',
        headLossFactorCv: 'High',
        headLossFactorCvVi: 'Trở lực lớn (Tổn thất cột áp máy bơm)',
        strengthsVi: [
          'Khả năng điều tiết lưu lượng mượt mà, chính xác vượt trội nhất trong ngành van công nghiệp.',
          'Chịu được nhiệt độ và áp suất cực đoan tốt hơn van bướm thông thường.',
          'Dễ dàng mài rà sửa chữa ghế van tại chỗ mà không cần tháo toàn bộ thân van khỏi đường ống.'
        ],
        strengthsEn: [
          'Industry gold standard for precise, repeatable throttling and temperature control.',
          'Superior endurance under extreme high-pressure drop and high-temperature steam.',
          'Inline seat re-machining and lapping capability without removing body from line.'
        ],
        limitationsVi: [
          'Tổn thất áp lực qua van rất cao, làm tăng điện năng tiêu thụ của máy bơm.',
          'Trọng lượng rất nặng và giá thành tăng vọt khi đường kính ống > DN150 (6 inch).'
        ],
        limitationsEn: [
          'Substantial parasitic pressure drop increases lifecycle pumping electrical bills.',
          'Heavy cast construction becomes prohibitively costly and cumbersome above DN150.'
        ],
        recommendedApplicationsVi: 'Trạm cấp nhiệt hơi lò hơi, trạm giảm áp, van nhánh vi chỉnh lưu lượng chất lỏng chính xác.',
        recommendedApplicationsEn: 'Boiler steam throttling stations, PRV bypasses, fine process metering branches.',
        costIndex: 4
      },
      {
        id: 'head_butterfly',
        nameVi: 'Dòng Van Bướm (Butterfly Valve)',
        nameEn: 'Butterfly Valve (Quarter-Turn Disc)',
        designPrincipleVi: 'Đĩa tròn quay góc 90° quanh trục nằm ngang hoặc thẳng đứng bên trong lòng ống.',
        designPrincipleEn: 'Rotary quarter-turn circular disc pivoting on a central or offset shaft within the waterway.',
        tempLimit: '-50°C đến +550°C (với dòng Triple-Offset TOV)',
        pressureLimit: 'PN16 - PN100 / Class 150 - 600',
        sealingGrade: 'ISO 5208 Rate A (Bubble-Tight)',
        flowCharacteristics: 'Gần tuyến tính ở góc 30° - 70°, lưu lượng thông qua cực lớn',
        headLossFactorCv: 'Low',
        headLossFactorCvVi: 'Trở lực thấp, hệ số lưu lượng Cv cao gấp 3-4 lần van cầu',
        strengthsVi: [
          'Hệ số lưu lượng Cv lớn gấp 3 - 4 lần van cầu cùng kích cỡ, tổn thất áp suất không đáng kể.',
          'Giá thành chỉ bằng 25% - 40% so với van cầu khi ở kích thước lớn từ DN100 đến DN1200.',
          'Trọng lượng siêu nhẹ, kích thước mỏng gọn tiết kiệm không gian lắp đặt phòng máy.'
        ],
        strengthsEn: [
          'Flow coefficient Cv is 3x to 4x higher than an equivalent globe valve, slashing pumping losses.',
          'Costs only 25% to 40% of a globe valve at large bore sizes (DN100-DN1200).',
          'Ultra-compact wafer envelope minimizes pipe rack structural support requirements.'
        ],
        limitationsVi: [
          'Không thể điều tiết lưu lượng ở góc mở dưới 15° do dòng chất lỏng sẽ gây rung giật đĩa van.',
          'Đĩa van nằm thường trực trong lòng ống cản trở việc chui dọn vệ sinh đường ống (Pigging).'
        ],
        limitationsEn: [
          'Unsuitable for micro-throttling below 15° stroke due to aerodynamic disc buffeting.',
          'Permanent disc presence in flow center prevents internal pipeline pigging.'
        ],
        recommendedApplicationsVi: 'Hệ thống chiller làm mát tòa nhà, đường ống cấp nước đô thị, mạng lưới PCCC cứu hỏa, trạm xử lý nước.',
        recommendedApplicationsEn: 'Building HVAC chillers, municipal water pipelines, fire sprinkler mains, wastewater plants.',
        costIndex: 2
      }
    ]
  }
];

export interface CustomValveOptionConfig {
  valveType: string;
  valveTypeVi: string;
  bodyMaterial: string;
  bodyMaterialVi: string;
  discMaterial: string;
  discMaterialVi: string;
  connection: string;
  connectionVi: string;
  pressure: string;
  tempRange: string;
  media: string;
  mediaVi: string;
}

export const CUSTOM_VALVE_TYPES = [
  { id: 'butterfly_concentric', nameVi: 'Van Bướm Đồng Tâm (Concentric)', nameEn: 'Concentric Butterfly Valve' },
  { id: 'butterfly_hp', nameVi: 'Van Bướm Hiệu Suất Cao (Double-Offset)', nameEn: 'Double-Offset High Performance Butterfly' },
  { id: 'butterfly_tov', nameVi: 'Van Bướm Lệch Tâm 3 (Triple-Offset TOV)', nameEn: 'Triple-Offset Butterfly Valve (TOV)' },
  { id: 'globe_t_pattern', nameVi: 'Van Cầu Thân Chữ T (T-Pattern Globe)', nameEn: 'T-Pattern Globe Valve' },
  { id: 'globe_y_pattern', nameVi: 'Van Cầu Thân Xiên (Y-Pattern Oblique)', nameEn: 'Y-Pattern Oblique Globe Valve' },
  { id: 'globe_angle', nameVi: 'Van Cầu Thân Góc 90° (Angle Globe)', nameEn: 'Angle Pattern Globe Valve' },
  { id: 'ball_floating', nameVi: 'Van Bi Trục Nổi (Floating Ball)', nameEn: 'Floating Ball Valve' },
  { id: 'ball_trunnion', nameVi: 'Van Bi Trục Cố Định (Trunnion Mounted)', nameEn: 'Trunnion Mounted Ball Valve' },
  { id: 'gate_resilient', nameVi: 'Van Cổng Nêm Bọc Cao Su (Resilient NRS)', nameEn: 'Resilient Wedge Gate Valve' },
  { id: 'gate_wedge', nameVi: 'Van Cổng Thép Nêm Cứng (OS&Y Solid Wedge)', nameEn: 'OS&Y Cast Steel Gate Valve' },
  { id: 'check_silent', nameVi: 'Van 1 Chiều Chống Búa Nước (Silent Non-Slam)', nameEn: 'Silent Non-Slam Check Valve' },
  { id: 'check_dual_plate', nameVi: 'Van 1 Chiều Cánh Bướm Đôi (Dual Plate)', nameEn: 'Dual Plate Wafer Check Valve' }
];

export const CUSTOM_BODY_MATERIALS = [
  { id: 'ductile_iron', nameVi: 'Gang cầu Ductile Iron GGG50 / EN-GJS-500', nameEn: 'Ductile Iron GGG50' },
  { id: 'cast_steel_wcb', nameVi: 'Thép đúc Carbon Steel ASTM A216 WCB', nameEn: 'Carbon Steel WCB' },
  { id: 'forged_steel_a105', nameVi: 'Thép rèn Forged Steel ASTM A105', nameEn: 'Forged Steel A105' },
  { id: 'stainless_cf8m', nameVi: 'Inox 316 / CF8M (Thép không gỉ austenit)', nameEn: 'Stainless Steel CF8M (SS316)' },
  { id: 'stainless_cf8', nameVi: 'Inox 304 / CF8 chống ăn mòn hóa chất', nameEn: 'Stainless Steel CF8 (SS304)' },
  { id: 'bronze_b62', nameVi: 'Đồng hợp kim Bronze ASTM B62 / RG5', nameEn: 'Bronze Alloy RG5' },
  { id: 'alloy_super_duplex', nameVi: 'Hợp kim đặc biệt Super Duplex / Monel', nameEn: 'Super Duplex / Monel' }
];

export const CUSTOM_DISC_SEALS = [
  { id: 'epdm_soft', nameVi: 'Đệm mềm Cao su EPDM nguyên sinh (Max 120°C)', nameEn: 'Virgin EPDM Soft Seat (Max 120°C)' },
  { id: 'nbr_nitrile', nameVi: 'Đệm mềm Cao su Nitrile NBR kháng dầu (Max 90°C)', nameEn: 'NBR Nitrile Oil-Resistant Seat (Max 90°C)' },
  { id: 'ptfe_teflon', nameVi: 'Đệm mềm Nhựa tinh khiết PTFE / Teflon (Max 180°C)', nameEn: 'Virgin PTFE / Teflon Seat (Max 180°C)' },
  { id: 'rptfe_reinforced', nameVi: 'Đệm mềm RPTFE gia cường sợi thủy tinh (Max 220°C)', nameEn: 'Reinforced RPTFE Seat (Max 220°C)' },
  { id: 'fkm_viton', nameVi: 'Đệm mềm Cao su FKM / Viton kháng hóa chất (Max 200°C)', nameEn: 'FKM / Viton Fluoropolymer Seat (Max 200°C)' },
  { id: 'stellite_hardface', nameVi: 'Đệm kim loại tôi cứng Stellite Gr.6 (>42 HRC, Max 550°C)', nameEn: 'Stellite Gr.6 Metal-to-Metal Hardfacing' },
  { id: 'stainless_metal', nameVi: 'Đệm kim loại Inox SS316 nhiều lớp (Laminated Metal)', nameEn: 'Laminated Stainless SS316 Metal Seat' }
];

export const CUSTOM_CONNECTIONS = [
  { id: 'flange_pn16', nameVi: 'Mặt bích tiêu chuẩn DIN / EN 1092-1 PN16 RF', nameEn: 'Flanged EN 1092-1 PN16 RF' },
  { id: 'flange_pn25', nameVi: 'Mặt bích tiêu chuẩn DIN / EN 1092-1 PN25 RF', nameEn: 'Flanged EN 1092-1 PN25 RF' },
  { id: 'flange_ansi150', nameVi: 'Mặt bích ASME B16.5 Class 150 RF', nameEn: 'ASME B16.5 Class 150 RF' },
  { id: 'flange_ansi300', nameVi: 'Mặt bích ASME B16.5 Class 300 RF / RTJ', nameEn: 'ASME B16.5 Class 300 RF/RTJ' },
  { id: 'wafer_multi', nameVi: 'Kẹp bích kiểu Wafer đa tiêu chuẩn (PN10/16, Class 150)', nameEn: 'Universal Multi-Flange Wafer' },
  { id: 'lug_threaded', nameVi: 'Tai bích có ren Lugged type (Kết nối cuối ống Dead-End)', nameEn: 'Lugged Type Threaded Body' },
  { id: 'thread_npt', nameVi: 'Nối ren tiêu chuẩn NPT / BSPT (Ống nhỏ DN15-DN50)', nameEn: 'Threaded NPT / BSPT' },
  { id: 'socket_weld', nameVi: 'Hàn lồng Socket Weld (SW) áp lực cao ASME B16.11', nameEn: 'Socket Weld (SW) ASME B16.11' }
];

export const CUSTOM_MEDIA_LIST = [
  { id: 'clean_water', nameVi: 'Nước sạch sinh hoạt & Cấp nước đô thị (Waterworks)', nameEn: 'Potable & Municipal Water' },
  { id: 'chilled_water', nameVi: 'Nước lạnh Chiller HVAC & Nước tuần hoàn làm mát', nameEn: 'HVAC Chilled & Condenser Water' },
  { id: 'steam_saturated', nameVi: 'Hơi nóng bão hòa lò hơi (Saturated Steam 150°C - 200°C)', nameEn: 'Saturated Steam (150°C - 200°C)' },
  { id: 'steam_superheated', nameVi: 'Hơi quá nhiệt nhiệt độ cao (Superheated Steam >350°C)', nameEn: 'Superheated Steam (>350°C)' },
  { id: 'thermal_oil', nameVi: 'Dầu truyền nhiệt lò dầu nóng (Thermal Oil 250°C - 350°C)', nameEn: 'Thermal Heat Transfer Oil' },
  { id: 'compressed_air', nameVi: 'Khí nén công nghiệp & Khí ni tơ áp lực (Compressed Air)', nameEn: 'Industrial Compressed Air & N2' },
  { id: 'oil_gas', nameVi: 'Dầu mỏ, khí đốt thiên nhiên & Hydrocarbon (Oil & Gas)', nameEn: 'Petroleum & Natural Gas' },
  { id: 'corrosive_chemical', nameVi: 'Hóa chất ăn mòn, axit loãng & dung dịch kiềm', nameEn: 'Corrosive Acid & Alkali Solutions' }
];
