/**
 * AI-Driven Mechanical Design Feature Advisor & Comparative Valve Intelligence
 * Analyzes valve function, category, pressure class, and metallurgy to formulate
 * standard-compliant mechanical design highlights (ASME, API, ISO, EN, NFPA).
 */

export interface MechanicalFeaturesSuggestion {
  category: string;
  functionalTitleVi: string;
  functionalTitleEn: string;
  highlightsVi: string[];
  highlightsEn: string[];
  recommendedMediaVi: string[];
  recommendedMediaEn: string[];
  engineeringRationale: string;
  standardsCited: string[];
}

export function suggestMechanicalDesignFeatures(input: {
  name: string;
  nameEn?: string;
  code?: string;
  category: string;
  material: string;
  pressure: string;
  connection?: string;
}): MechanicalFeaturesSuggestion {
  const cat = (input.category || '').toLowerCase();
  const name = (input.name || '').toLowerCase();
  const code = (input.code || '').toUpperCase();
  const mat = (input.material || '').toLowerCase();

  // 1. Knife Gate Valve (Van Cổng Dao)
  if (cat.includes('knife') || name.includes('dao') || code.includes('KG')) {
    return {
      category: 'knife_gate',
      functionalTitleVi: 'Cơ Tính Van Cổng Dao Chuyên Dụng Xử Lý Rác & Bùn Quặng',
      functionalTitleEn: 'Knife Gate Valve Mechanical Design (Slurry & Solid Shear)',
      highlightsVi: [
        'Lưỡi dao bằng thép không gỉ SUS304/SUS316 vát mép vát nghiêng 45° cắt đứt sợi dệt, xơ rác và bột giấy mịn',
        'Bộ gạt bùn (Stainless steel scraper) ép sát hai mặt lưỡi dao ngăn kẹt rác buồng làm kín',
        'Cấu trúc thân đúc liền khối dạng Wafer hoặc Lug mỏng nhẹ, tiết kiệm không gian lắp đặt đường ống',
        'Gioăng làm kín chữ U (U-shaped elastomer seat) bằng EPDM hoặc PTFE cho khả năng đóng kín 2 chiều Bi-directional',
        'Ty van Inox chống ăn mòn kết hợp ổ bi trợ lực mở van nhẹ nhàng kể cả khi chịu chênh áp lớn'
      ],
      highlightsEn: [
        'Beveled knife gate edge in SS304/SS316 sheared for cutting pulp fibers and heavy solids',
        'Double-sided stainless steel scrapers preventing particulate jamming into stuffing box',
        'Monoblock compact wafer/lug casting body for optimal space-saving installation',
        'U-shaped perimeter EPDM/PTFE resilient seat ensuring bi-directional bubble-tight shutoff',
        'Heavy-duty stainless steel rising stem with thrust bearings for low torque actuation'
      ],
      recommendedMediaVi: ['Bùn khoáng quặng', 'Bột giấy', 'Nước thải thô', 'Bột than', 'Hạt nhựa silo', 'Chất lỏng nhớt'],
      recommendedMediaEn: ['Mineral Slurry', 'Pulp & Paper', 'Raw Wastewater', 'Coal Slurry', 'Plastic Pellets', 'Viscous Fluids'],
      engineeringRationale: 'Van cổng dao thiết kế cơ khí đặc biệt lưỡi vát để cắt đứt các tạp chất lơ lửng mà van bướm hoặc van cổng thông thường không làm được.',
      standardsCited: ['MSS SP-81', 'ASME B16.34', 'TAPPI TIS 405-8', 'ISO 5208 Rate A']
    };
  }

  // 2. High Performance Butterfly Valve (Van Bướm Lệch Tâm Kép / Lệch Tâm 3)
  if (cat.includes('butterfly') || name.includes('bướm') || code.includes('BF') || code.includes('H401') || code.includes('H402')) {
    const isTriple = name.includes('lệch tâm 3') || name.includes('triple') || code.includes('H402');
    if (isTriple) {
      return {
        category: 'triple_offset_butterfly',
        functionalTitleVi: 'Cơ Tính Van Bướm Lệch Tâm Ba (Triple Offset) - Không Ma Sát',
        functionalTitleEn: 'Triple Offset Butterfly Valve (Zero Friction Metal Seated)',
        highlightsVi: [
          'Hình học lệch tâm 3 trục (Triple Offset Geometry) triệt tiêu hoàn toàn ma sát khi quay, kéo dài tuổi thọ đệm kín',
          'Vòng làm kín kim loại xếp lớp nhiều lá Inox 316 + Graphite đàn hồi (Laminated Metal-to-Metal Seal)',
          'Đạt chứng nhận chống cháy nổ Fire-Safe theo tiêu chuẩn quốc tế API 607 / ISO 10497',
          'Độ kín khít tuyệt đối Bubble-Tight (Zero Leakage) ở cả chiều thuận và chiều nghịch theo ISO 5208 Rate A',
          'Trục van thiết kế chống văng thổi (Anti-blowout stem design) đạt chuẩn an toàn API 609'
        ],
        highlightsEn: [
          'Triple offset geometry eliminates seat friction during 90-degree rotary travel',
          'Laminated SS316 + Flexible Graphite multi-layer seal ring with solid Stellite hardfaced seat',
          'Fire-safe certified according to API 607 / ISO 10497 fire test standards',
          'Bidirectional zero-leakage bubble-tight shutoff complying with ISO 5208 Rate A',
          'One-piece anti-blowout stem design complying with API 609 safety parameters'
        ],
        recommendedMediaVi: ['Hơi quá nhiệt 350°C - 450°C', 'Dầu truyền nhiệt', 'Khí đốt hydrocarbon', 'Khí hóa lỏng LNG', 'Hóa chất ăn mòn'],
        recommendedMediaEn: ['Superheated Steam', 'Thermal Oil', 'Hydrocarbon Gas', 'Cryogenic LNG', 'Corrosive Chemicals'],
        engineeringRationale: 'Lệch tâm 3 trục góc nón là công nghệ đỉnh cao loại bỏ ma sát trượt của cánh van, cho phép làm kín kim loại ở nhiệt độ lên đến 450°C.',
        standardsCited: ['API 609 Category B', 'API 607 7th Edition', 'ASME B16.34', 'ISO 5208 Rate A']
      };
    } else {
      return {
        category: 'butterfly',
        functionalTitleVi: 'Cơ Tính Van Bướm Lệch Tâm Kép & Đệm Cao Su Hiệu Suất Cao',
        functionalTitleEn: 'High Performance Double Offset / Resilient Seated Butterfly Valve',
        highlightsVi: [
          'Đĩa van thiết kế lệch tâm đôi (Double Eccentric) tách ly khỏi vòng đệm ngay tại 5° mở đầu tiên, giảm mô-men xoắn',
          'Trục van kết nối chốt xuyên hoặc chốt âm không rơ lắc, gia công CNC chính xác 100%',
          'Đệm làm kín có thể thay thế dễ dàng (PTFE gia cường sợi thủy tinh hoặc EPDM chịu nhiệt cao)',
          'Đế gắn bộ truyền động chuẩn ISO 5211 tích hợp sẵn, dễ lắp Actuator khí nén hoặc mô tơ điện ON/OFF',
          'Cổ van vươn dài (Extended neck) thuận tiện bọc bảo ôn cách nhiệt đường ống Chiller/HVAC'
        ],
        highlightsEn: [
          'Double eccentric cam-action lifts disc off seal within first 5 degrees of rotation',
          'Precision CNC-machined through-shaft with spline connection eliminates operating backlash',
          'Field-replaceable resilient PTFE / High-grade EPDM vulcanized seat for smooth torque',
          'Direct mount ISO 5211 top flange for seamless pneumatic/electric actuator automation',
          'Extended neck architecture for thermal pipe insulation clearance on chilled water systems'
        ],
        recommendedMediaVi: ['Nước lạnh Chiller', 'Hệ cấp thoát nước sạch', 'PCCC Sprinkler', 'Nước làm mát tuần hoàn', 'Hóa chất nồng độ thấp'],
        recommendedMediaEn: ['Chilled Water HVAC', 'Potable Water Distribution', 'Fire Sprinklers', 'Cooling Tower Water', 'Mild Chemicals'],
        engineeringRationale: 'Van bướm lệch tâm kép cân bằng hoàn hảo giữa lực kéo mở nhẹ và độ bền kín nước phục vụ tòa nhà cao tầng và khu công nghiệp.',
        standardsCited: ['EN 593', 'API 609 Category A/B', 'ISO 5211', 'BS 5155']
      };
    }
  }

  // 3. Globe Valve (Van Cầu Hơi)
  if (cat.includes('globe') || name.includes('cầu') || code.includes('GLV') || name.includes('hơi')) {
    return {
      category: 'globe',
      functionalTitleVi: 'Cơ Tính Van Cầu Hơi Nóng - Điều Tiết Tuyến Tính & Kín Bellows',
      functionalTitleEn: 'Globe Valve Mechanical Characteristics (Throttling & Bellows Seal)',
      highlightsVi: [
        'Đĩa van hình nón (Parabolic plug disc) tôi cứng bề mặt Stellite chống xâm thực dòng hơi tốc độ cao',
        'Cụm ống xếp kim loại Inox nhiều lớp (Bellows Seal) triệt tiêu 100% rò rỉ khí độc và hơi nóng qua cổ ty',
        'Cặp bề mặt làm kín đĩa - bệ ngồi mài rà chính xác đạt độ phẳng quang học Micro-finish',
        'Vô lăng tay quay đúc chắc chắn tích hợp kim chỉ thị vị trí mở % hành trình trực quan',
        'Cổ nắp bắt bu lông (Bolted Bonnet) với gioăng xoắn kim loại inox đệm chì graphite chống bục áp'
      ],
      highlightsEn: [
        'Parabolic hardened Stellite-faced plug disc engineered for precision linear flow throttling',
        'Multi-ply stainless steel bellows seal hermetically seals stem preventing fugitive emissions',
        'Micro-finished optical flat seat and disc seating interfaces for zero steam wire-drawing',
        'Ergonomic cast handwheel with visual stroke percentage position indicator',
        'Heavy-duty bolted bonnet joint with spiral-wound SS316 + flexible graphite gasket'
      ],
      recommendedMediaVi: ['Hơi bão hòa', 'Hơi quá nhiệt lò hơi (Steam)', 'Dầu truyền nhiệt nóng', 'Khí nén áp cao', 'Nước nóng ngưng tụ'],
      recommendedMediaEn: ['Saturated Steam', 'Superheated Boiler Steam', 'Thermal Heat Transfer Oil', 'High-Pressure Air', 'Condensate'],
      engineeringRationale: 'Van cầu là dòng van tối ưu nhất để điều tiết lưu lượng và triệt tiêu búa áp hơi nóng nhờ hành trình đóng vuông góc với dòng chảy.',
      standardsCited: ['ASME B16.34', 'BS 1873', 'DIN 3356', 'EN 13709']
    };
  }

  // 4. Ball Valve (Van Bi)
  if (cat.includes('ball') || name.includes('bi') || code.includes('BV') || code.includes('UTD-BV')) {
    return {
      category: 'ball',
      functionalTitleVi: 'Cơ Tính Van Bi Trunnion / Floating Siêu Kín Full Bore',
      functionalTitleEn: 'Ball Valve Full Bore Precision Characteristics',
      highlightsVi: [
        'Bi van Inox 316 đúc chính xác gia công cầu tiện CNC đánh bóng gương Ra < 0.2 µm',
        'Lỗ khoét thông dòng toàn phần (Full Bore) cho lưu lượng 100%, không gây tụt áp đường ống',
        'Ty van chống thổi tung (Anti-blowout stem) đảm bảo an toàn tuyệt đối khi đường ống tăng áp đột ngột',
        'Cơ cấu chống tĩnh điện (Anti-static device) tiếp đất tia lửa sinh ra do ma sát dòng chảy',
        'Đệm ghế làm kín R-PTFE gia cường sợi Carbon / Devlon chịu áp cao và hóa chất ăn mòn'
      ],
      highlightsEn: [
        'Precision SS316 solid ball CNC ground and mirror-polished to Ra < 0.2 µm surface finish',
        'Full port flow bore delivers unrestricted Cv capacity with virtually zero line pressure drop',
        'Internally assembled anti-blowout stem prevents stem ejection under system overpressure',
        'Built-in grounding anti-static spring device dissipates electrostatic charges from media friction',
        'Reinforced R-PTFE / PEEK / Devlon seat rings for extreme chemical and pressure endurance'
      ],
      recommendedMediaVi: ['Hóa chất & Axit', 'Xăng dầu nhiên liệu', 'Khí thiên nhiên gas', 'Nước tinh khiết RO', 'Dược phẩm & Thực phẩm'],
      recommendedMediaEn: ['Chemicals & Acids', 'Petroleum Fuel', 'Natural Gas', 'Pure RO Water', 'Pharma & Food Processing'],
      engineeringRationale: 'Van bi đóng mở góc 90 độ cho phép thao tác nhanh tức thì với dòng chảy thẳng không cản trở, phù hợp cho hệ thống tự động hóa.',
      standardsCited: ['API 6D', 'ASME B16.34', 'ISO 17292', 'API 607 Fire-Safe']
    };
  }

  // 5. Gate Valve (Van Cổng)
  if (cat.includes('gate') || name.includes('cổng') || name.includes('cửa') || code.includes('G101')) {
    return {
      category: 'gate',
      functionalTitleVi: 'Cơ Tính Van Cổng Ty Nổi / Ty Chìm Nêm Cao Su EPDM',
      functionalTitleEn: 'Resilient Seated & Solid Wedge Gate Valve Characteristics',
      highlightsVi: [
        'Nêm van bọc cao su EPDM vulcanized 100% không để lộ kim loại, đóng kín nước tuyệt đối',
        'Đáy van dạng phẳng thẳng (Straight-through flat bottom) không có hốc rãnh, chống đọng cát sỏi kẹt van',
        'Ty van ren ngoài ty nổi (OS&Y) quan sát được ngay trạng thái đóng/mở van từ xa (chuẩn NFPA)',
        'Sơn phủ Epoxy tĩnh điện độ dày tối thiểu 250 - 300 µm cả trong lẫn ngoài chống ăn mòn đất ngầm',
        'Trục van Inox 410/420 cán ren nguội gia tăng độ cứng và mô men xoắn xoay nhẹ'
      ],
      highlightsEn: [
        'Ductile iron wedge encapsulated in 100% vulcanized high-grade EPDM for bubble-tight shutoff',
        'Straight-through flat cavity bottom eliminates particulate silt pockets and jamming',
        'Outside Screw & Yoke (OS&Y) rising stem indicates open/closed position visually (NFPA compliant)',
        'Fusion-bonded epoxy coating (min 250-300 microns) inside and out for underground soil protection',
        'Cold-rolled stainless steel 410/420 stem delivers exceptional tensile strength and smooth torque'
      ],
      recommendedMediaVi: ['Hệ cấp nước sạch đô thị', 'Mạng lưới PCCC ngầm', 'Nước thải xử lý', 'Trạm bơm tăng áp', 'Thủy lợi'],
      recommendedMediaEn: ['Municipal Potable Water', 'Underground Fire Water', 'Treated Wastewater', 'Booster Pumping', 'Irrigation'],
      engineeringRationale: 'Van cổng cho phép cách ly đường ống chính với sức cản thủy lực bằng 0, đáy phẳng chống kẹt sỏi đá bùn cát.',
      standardsCited: ['AWWA C509 / C515', 'BS 5163', 'EN 1074-1/2', 'ISO 7259']
    };
  }

  // 6. Check Valve (Van Một Chiều: Lá Lật, Cánh Bướm, Lò Xo)
  if (cat.includes('check') || name.includes('một chiều') || name.includes('1 chiều') || code.includes('C101')) {
    return {
      category: 'check',
      functionalTitleVi: 'Cơ Tính Van Một Chiều Triệt Tiêu Búa Nước (Non-Slam Silent Check)',
      functionalTitleEn: 'Non-Slam Dual Plate & Silent Spring Check Valve Characteristics',
      highlightsVi: [
        'Cánh van đôi cánh bướm (Dual Plate) có lò xo xoắn trợ lực hồi vị cực nhanh trước khi dòng chảy đảo chiều',
        'Triệt tiêu tiếng va đập và xung kích thủy lực búa nước (Anti-water hammer non-slam design)',
        'Bản lề chốt âm định vị vững chắc chống rung lắc khi lưu lượng nước dao động mạnh',
        'Mặt đệm bọc cao su EPDM hoặc đúc đồng Bronze cho độ kín nước 100% ở chênh áp thấp',
        'Chiều dài lắp đặt ngắn gọn (Short face-to-face wafer), nhẹ hơn van lá lật truyền thống 75%'
      ],
      highlightsEn: [
        'Dual plate disc with torsion springs accelerates closure before reverse flow sets in',
        'Non-slam dynamic response eliminates destructive hydraulic water hammer shocks',
        'Internal retainerless pin design eliminates potential external leak pathways through body',
        'Resilient EPDM or bronze trim seal provides positive shutoff even at low differential pressures',
        'Ultra-compact wafer face-to-face saves up to 75% weight compared to conventional swing checks'
      ],
      recommendedMediaVi: ['Sau máy bơm tăng áp', 'Đường ống đẩy trạm xử lý nước', 'Hệ thống chiller', 'Trục đứng PCCC', 'Tháp giải nhiệt'],
      recommendedMediaEn: ['Pump Discharge Outlets', 'Water Treatment Effluent', 'HVAC Chiller Loops', 'Fire Riser Lines', 'Cooling Towers'],
      engineeringRationale: 'Van một chiều bướm lò xo đóng êm bảo vệ tuyệt đối máy bơm và đường ống khỏi áp suất va đập búa nước khi ngắt bơm đột ngột.',
      standardsCited: ['API 594', 'ASME B16.34', 'EN 12334', 'ISO 5208 Rate A']
    };
  }

  // 7. General Default Fallback
  return {
    category: 'general_valve',
    functionalTitleVi: 'Cơ Tính Cơ Khí Đúc Chính Xác & Gia Công CNC Van UTD',
    functionalTitleEn: 'Precision Casting & CNC Machining Mechanical Features',
    highlightsVi: [
      'Thân van đúc chính xác theo tiêu chuẩn hình học ASME B16.34, loại bỏ rỗ khí và nứt ngầm',
      'Gia công cơ khí trên trung tâm tiện phay CNC đa trục đạt độ đồng tâm và độ bóng bề mặt cao',
      'Độ kín khít tuyệt đối Bubble-Tight theo tiêu chuẩn thử áp quốc tế ISO 5208 Rate A / API 598',
      'Đế ISO 5211 tích hợp sẵn, dễ lắp cụm điều khiển tự động khí nén hoặc động cơ điện',
      '100% sản phẩm được thử nghiệm áp lực thủy tĩnh vỏ và đệm trước khi dán tem xuất xưởng'
    ],
    highlightsEn: [
      'Precision investment cast body conforming to ASME B16.34 wall thickness criteria',
      'Multi-axis CNC precision machined for optimal alignment and low operating torque',
      'Bubble-tight shutoff integrity verified against ISO 5208 Rate A and API 598 standards',
      'Direct mount ISO 5211 actuator mounting platform for electric/pneumatic automation',
      '100% factory hydrostatic shell and seat pressure tested prior to shipment authorization'
    ],
    recommendedMediaVi: ['Nước sạch', 'Nước thải', 'Dầu', 'Khí nén', 'Hóa chất công nghiệp'],
    recommendedMediaEn: ['Water Utilities', 'Wastewater', 'Oil & Petroleum', 'Compressed Air', 'Industrial Chemicals'],
    engineeringRationale: 'Đặc tính thiết kế tổng hợp đảm bảo độ bền cơ học cao, dễ lắp đặt vận hành và tương thích mọi hệ thống đường ống công nghiệp.',
    standardsCited: ['ASME B16.34', 'ISO 5208', 'API 598', 'ISO 9001:2015']
  };
}
