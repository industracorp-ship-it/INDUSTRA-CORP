import { parseSemanticQuery } from './semanticSearch';
import { UTD_CATALOGUE_FIGURE_PRESETS, UtdCatalogueFigPreset } from './cataloguePresets';
import { ValveProduct, SupportedLanguage, ValveCategory } from '../types/valve';
import { VALVES_DATA } from '../data/valvesData';

export interface EngineerAdvisorResponse {
  answerVi: string;
  answerEn: string;
  recommendedFig?: UtdCatalogueFigPreset;
  recommendedFigCode?: string;
  recommendedModelName?: string;
  recommendedValves?: ValveProduct[];
  primaryValve?: ValveProduct;
  citations: string[];
  fieldTipsVi?: string;
  fieldTipsEn?: string;
  mode?: 'chat' | 'explore' | 'features' | 'advise';
  featureHighlights?: string[];
  flowSizingAdvice?: {
    estimatedKv?: number;
    recommendedDn?: string;
    velocityNoticeVi?: string;
    velocityNoticeEn?: string;
  };
}

/**
 * Global technical literature and standard citations database
 */
export const GLOBAL_CITATIONS = [
  'ASME B16.34: Valves - Flanged, Threaded and Welding End (Pressure-Temperature Ratings)',
  'API 598: Valve Inspection and Testing (Hydrostatic Shell & Seat Leak Rates)',
  'Crane Technical Paper 410: Flow of Fluids Through Valves, Fittings and Pipe (Eq. 4-1 & 4-2)',
  'Spirax Sarco Engineering Principles: Heat Transfer & Steam Distribution Loops',
  'NFPA 13: Standard for the Installation of Sprinkler Systems (Section 8.16 & 16.9)',
  'ISO 5208: Industrial Valves - Pressure Testing of Metallic Valves (Rate A Bubble-Tight)',
  'AWWA C504: Rubber-Seated Butterfly Valves for Municipal Water Systems',
  'API 607 / ISO 10497: Fire Test for Quarter-Turn Valves and Non-Metallic Seated Valves',
  'DIN EN 1092-1 / EN 1092-2: Flanges and their joints - Circular flanges for pipes',
  'MSS SP-81: Stainless Steel, Bonnetless, Flanged Knife Gate Valves',
  'Tài liệu & Sổ tay Kỹ thuật Dòng Chảy Độc Quyền do UTDCORP cung cấp (UTDCORP Valves & Flow Engineering Standards - utdcorp.com)'
];

/**
 * Normalizes text for accent-insensitive search in Vietnamese
 */
function normalizeText(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Category breakdown helper for customer product discovery
 */
export function exploreCatalogCategories(
  availableValves: ValveProduct[] = VALVES_DATA,
  lang: SupportedLanguage = 'vi'
) {
  const categoryMap = new Map<string, { labelVi: string; labelEn: string; valves: ValveProduct[] }>();

  availableValves.forEach((v) => {
    const cat = v.category || 'other';
    const labelVi = v.categoryLabel || cat;
    const labelEn = v.categoryLabelEn || cat;

    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, { labelVi, labelEn, valves: [] });
    }
    categoryMap.get(cat)!.valves.push(v);
  });

  return Array.from(categoryMap.entries()).map(([catKey, data]) => ({
    category: catKey as ValveCategory,
    label: lang === 'vi' ? data.labelVi : data.labelEn,
    count: data.valves.length,
    sampleValves: data.valves.slice(0, 4)
  }));
}

/**
 * Feature introduction generator for a specific valve
 */
export function getDetailedValveFeatureAnalysis(
  valve: ValveProduct,
  lang: SupportedLanguage = 'vi'
): EngineerAdvisorResponse {
  const isVi = lang === 'vi';
  const name = isVi ? valve.name : (valve.nameEn || valve.name);
  const material = isVi ? valve.material : (valve.materialEn || valve.material);
  const desc = isVi ? valve.description : (valve.descriptionEn || valve.description);
  const highlights = (isVi ? valve.highlightFeatures : valve.highlightFeaturesEn) || valve.highlightFeatures || [];

  const answerVi = `🔍 **Giới thiệu tính năng kỹ thuật chi tiết: ${valve.code} - ${valve.name}**

📌 **Tổng quan & Thiết kế:**
${desc}

⚙️ **Vật liệu chế tạo & Cấu trúc:**
- **Thân van & Đĩa:** ${material}
- **Cấp áp lực làm việc:** ${valve.pressure} (Áp thử thân: ${valve.testPressureShell || '1.5 x PN'}, áp thử đệm kín: ${valve.testPressureSeat || '1.1 x PN'})
- **Dải nhiệt độ chịu đựng:** ${valve.tempRange}
- **Dải kích cỡ danh định:** ${valve.sizeRange}
- **Chuẩn kết nối:** ${valve.connection}
- **Cấp độ kín khít rò rỉ:** ${valve.leakageClass || 'ISO 5208 Rate A (Không rò rỉ bọt khí)'}

🌟 **Tính năng công nghệ vượt trội:**
${highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

🎯 **Môi chất & Ứng dụng khuyên dùng:**
${valve.applicableMedia.join(', ')}

🏷️ **Tiêu chuẩn kiểm định quốc tế:**
${valve.standards?.join(' • ') || 'ASME, EN, ISO, API 598'}`;

  const answerEn = `🔍 **Comprehensive Technical Feature Breakdown: ${valve.code} - ${valve.nameEn || valve.name}**

📌 **Overview & Architecture:**
${desc}

⚙️ **Metallurgy & Pressure-Temperature Envelope:**
- **Body & Disc:** ${material}
- **Pressure Class:** ${valve.pressure} (Shell Test: ${valve.testPressureShell || '1.5 x PN'}, Seat Test: ${valve.testPressureSeat || '1.1 x PN'})
- **Temperature Limits:** ${valve.tempRange}
- **Nominal Diameter Range:** ${valve.sizeRange}
- **Connection Style:** ${valve.connection}
- **Seat Leakage Rate:** ${valve.leakageClass || 'ISO 5208 Rate A (Zero bubble tight)'}

🌟 **Distinguished Technological Highlights:**
${highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

🎯 **Recommended Fluid Applications:**
${(valve.applicableMediaEn || valve.applicableMedia).join(', ')}

🏷️ **Certified Engineering Standards:**
${valve.standards?.join(' • ') || 'ASME, EN, ISO, API 598'}`;

  // Citations
  const citations = [
    'ISO 5208: Industrial Valves - Pressure Testing of Metallic Valves (Rate A)',
    valve.standards?.[0] ? `Certified standard: ${valve.standards[0]}` : 'ASME B16.34: Valves - Flanged, Threaded and Welding End',
    'API 598: Valve Inspection and Testing'
  ];

  const fieldTipsVi = `Mẹo vận hành cho ${valve.code}: Kiểm tra đối xứng mặt bích và siết bulong chéo đều tay (star pattern) theo chuẩn DIN/ANSI, bôi trơn ty van định kỳ 6 tháng/lần.`;
  const fieldTipsEn = `Field installation tip for ${valve.code}: Follow cross-diagonal torque tightening sequence on flange bolts and lubricate stem threads semi-annually.`;

  return {
    answerVi,
    answerEn,
    recommendedFigCode: valve.code,
    recommendedModelName: name,
    primaryValve: valve,
    recommendedValves: [valve],
    citations,
    fieldTipsVi,
    fieldTipsEn,
    mode: 'features',
    featureHighlights: highlights
  };
}

/**
 * Parameter-based valve recommendation & sizing advisor
 */
export function adviseByEngineeringParameters(
  params: {
    media: string;
    pressure?: string;
    temp?: number;
    dn?: string;
    functionType?: string;
  },
  availableValves: ValveProduct[] = VALVES_DATA,
  lang: SupportedLanguage = 'vi'
): EngineerAdvisorResponse {
  const isVi = lang === 'vi';
  const mediaNorm = normalizeText(params.media || '');
  const pressureNorm = normalizeText(params.pressure || 'pn16');
  const funcNorm = normalizeText(params.functionType || 'on_off');

  // Score candidate valves
  const scored = availableValves.map((v) => {
    let score = 0;
    const vText = normalizeText(`${v.name} ${v.nameEn || ''} ${v.category} ${v.categoryLabel} ${v.material} ${v.applicableMedia.join(' ')} ${v.description}`);

    // Media matching
    if (mediaNorm.includes('steam') || mediaNorm.includes('hoi') || mediaNorm.includes('lo hoi')) {
      if (vText.includes('hoi') || vText.includes('steam') || vText.includes('triple') || v.category === 'globe') score += 50;
      if (v.materialGroup === 'cast_steel' || v.material.includes('WCB') || v.material.includes('1.0619')) score += 20;
    } else if (mediaNorm.includes('chiller') || mediaNorm.includes('nuoc lanh') || mediaNorm.includes('hvac')) {
      if (vText.includes('chiller') || vText.includes('nuoc lanh') || v.category === 'butterfly' || v.category === 'balancing') score += 50;
      if (vText.includes('cach nhiet') || vText.includes('extended neck')) score += 25;
    } else if (mediaNorm.includes('hoa chat') || mediaNorm.includes('chemical') || mediaNorm.includes('axit') || mediaNorm.includes('acid')) {
      if (vText.includes('hoa chat') || vText.includes('chemical') || v.materialGroup === 'ss304_316' || v.material.includes('CF8M') || v.material.includes('316')) score += 50;
    } else if (mediaNorm.includes('pccc') || mediaNorm.includes('chua chay') || mediaNorm.includes('fire') || mediaNorm.includes('sprinkler')) {
      if (v.systemGroup === 'firefighting' || vText.includes('pccc') || vText.includes('os&y') || vText.includes('alarm') || vText.includes('riser')) score += 50;
    } else if (mediaNorm.includes('bun') || mediaNorm.includes('rac') || mediaNorm.includes('nuoc thai') || mediaNorm.includes('slurry') || mediaNorm.includes('waste')) {
      if (v.category === 'knife_gate' || vText.includes('dao') || vText.includes('slurry') || vText.includes('nuoc thai')) score += 55;
    } else if (mediaNorm.includes('bua nuoc') || mediaNorm.includes('nuoc sach') || mediaNorm.includes('water')) {
      if (v.category === 'check' || v.category === 'butterfly' || v.category === 'gate') score += 40;
    }

    // Function matching
    if (funcNorm.includes('dieu tiet') || funcNorm.includes('throttling') || funcNorm.includes('balancing') || funcNorm.includes('can bang')) {
      if (v.category === 'balancing' || v.category === 'globe' || v.category === 'water_control') score += 40;
    } else if (funcNorm.includes('mot chieu') || funcNorm.includes('chong chay nguoc') || funcNorm.includes('check')) {
      if (v.category === 'check') score += 50;
    } else if (funcNorm.includes('dong ngat') || funcNorm.includes('on_off') || funcNorm.includes('on off')) {
      if (v.category === 'ball' || v.category === 'butterfly' || v.category === 'gate' || v.category === 'knife_gate') score += 30;
    }

    // Pressure matching
    if (pressureNorm.includes('pn25') || pressureNorm.includes('pn40') || pressureNorm.includes('300')) {
      if (v.pressureGroup === 'pn25' || v.pressureGroup === 'pn40' || v.pressure.includes('PN25') || v.pressure.includes('PN40')) score += 20;
    } else {
      if (v.pressureGroup === 'pn16' || v.pressure.includes('PN16')) score += 15;
    }

    // DN matching if available
    if (params.dn && v.specs && v.specs.length > 0) {
      const matchDn = v.specs.some(s => normalizeText(s.dn).includes(normalizeText(params.dn!)));
      if (matchDn) score += 25;
    }

    return { valve: v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const bestMatch = scored[0]?.valve || availableValves[0];
  const secondaryMatches = scored.slice(1, 4).map(s => s.valve);

  // Sizing estimate calculation
  let estimatedKv: number | undefined;
  if (params.dn && bestMatch.specs) {
    const specItem = bestMatch.specs.find(s => normalizeText(s.dn).includes(normalizeText(params.dn!)));
    if (specItem && specItem.kvFlow) {
      estimatedKv = specItem.kvFlow;
    }
  }

  const answerVi = `🎯 **Tư vấn lựa chọn van chuyên sâu từ Kỹ sư trực tuyến UTD**

Dựa trên yêu cầu của Quý Khách:
- **Môi chất:** ${params.media || 'Tiêu chuẩn'}
- **Cấp áp lực:** ${params.pressure || 'PN16'}
- **Nhiệt độ dự kiến:** ${params.temp ? `${params.temp}°C` : 'Bình thường'}
- **Kích thước ống:** ${params.dn || 'Tùy chọn'}
- **Chức năng:** ${params.functionType || 'Đóng ngắt / Cách ly'}

✅ **Giải pháp đề xuất tối ưu số 1:**
**${bestMatch.code} - ${bestMatch.name}**
- **Vật liệu khuyến nghị:** ${bestMatch.material}
- **Lý do lựa chọn:** Thiết kế đạt cấp áp ${bestMatch.pressure}, dải nhiệt ${bestMatch.tempRange}, kết hợp cùng đệm kín ${bestMatch.leakageClass || 'ISO 5208 Rate A'} chống rò rỉ triệt để trong môi trường ${params.media}.
- **Độ tin cậy vận hành:** Tuân thủ tiêu chuẩn ${bestMatch.standards?.join(', ') || 'ASME B16.34, API 598'}.

${estimatedKv ? `📊 **Ước tính thông số thủy lực tại cỡ ống ${params.dn}:**
- Hệ số lưu lượng danh định: **Kv = ${estimatedKv} m³/h**
- Vận tốc dòng chảy kinh tế khuyến nghị: 1.5 - 2.2 m/s (cho nước/chiller) hoặc 20 - 35 m/s (cho hơi bão hòa).` : ''}

💡 **Các phương án thay thế dự phòng:**
${secondaryMatches.map((m, i) => `${i + 1}. **${m.code}**: ${m.name} (${m.pressure})`).join('\n')}`;

  const answerEn = `🎯 **Comprehensive Valve Engineering Selection Advisory**

Based on your design conditions:
- **Media:** ${params.media || 'Standard'}
- **Pressure Class:** ${params.pressure || 'PN16'}
- **Temperature:** ${params.temp ? `${params.temp}°C` : 'Ambient'}
- **Pipe Size:** ${params.dn || 'Configurable'}
- **Function:** ${params.functionType || 'Isolation'}

✅ **Primary Recommended Valve:**
**${bestMatch.code} - ${bestMatch.nameEn || bestMatch.name}**
- **Metallurgy:** ${bestMatch.materialEn || bestMatch.material}
- **Engineering Rationale:** Rated for ${bestMatch.pressure} with temperature range ${bestMatch.tempRange}, featuring ${bestMatch.leakageClass || 'ISO 5208 Rate A'} tight shutoff perfectly suited for ${params.media}.
- **Certified Compliance:** ${bestMatch.standards?.join(', ') || 'ASME B16.34, API 598'}.

${estimatedKv ? `📊 **Hydraulic Flow Sizing Estimate at ${params.dn}:**
- Nominal Flow Coefficient: **Kv = ${estimatedKv} m³/h**
- Recommended Velocity Window: 1.5 - 2.2 m/s (Liquids/Chilled water) or 20 - 35 m/s (Saturated steam).` : ''}

💡 **Alternative Engineering Options:**
${secondaryMatches.map((m, i) => `${i + 1}. **${m.code}**: ${m.nameEn || m.name} (${m.pressure})`).join('\n')}`;

  const citations = [
    'ASME B16.34: Section 2 P-T Ratings',
    'Crane Technical Paper 410: Fluid Flow through Valves and Sizing Formulas',
    'ISO 5208: Industrial Valves Pressure Testing'
  ];

  const fieldTipsVi = `Khuyến nghị lắp đặt: Đảm bảo có đoạn ống thẳng tối thiểu 3-5 x DN trước và sau van. Đối với van bướm và van bi, kiểm tra độ vuông góc của mặt bích để tránh bó kẹt đĩa/bi van khi xiết chặt.`;
  const fieldTipsEn = `Installation guideline: Provide at least 3-5 x DN straight run upstream/downstream. Verify flange alignment before torquing to avoid disc/ball binding.`;

  return {
    answerVi,
    answerEn,
    recommendedFigCode: bestMatch.code,
    recommendedModelName: isVi ? bestMatch.name : (bestMatch.nameEn || bestMatch.name),
    primaryValve: bestMatch,
    recommendedValves: [bestMatch, ...secondaryMatches],
    citations,
    fieldTipsVi,
    fieldTipsEn,
    mode: 'advise',
    flowSizingAdvice: {
      estimatedKv,
      recommendedDn: params.dn,
      velocityNoticeVi: 'Vận tốc dòng chảy kinh tế nước sạch/chiller: 1.5 - 2.5 m/s; hơi nóng: 25 - 35 m/s',
      velocityNoticeEn: 'Economic fluid velocity: Liquids 1.5 - 2.5 m/s; Steam 25 - 35 m/s'
    }
  };
}

/**
 * Online UTD Valve Engineer AI Synthesis Engine
 * Covers:
 * 1. Product exploration on the page
 * 2. Feature introduction for any valve
 * 3. Selection advisory & sizing
 * 4. Standards & technical inquiries
 */
export function consultOnlineValveEngineer(
  query: string,
  lang: SupportedLanguage = 'vi',
  availableValves: ValveProduct[] = VALVES_DATA
): EngineerAdvisorResponse {
  const isVi = lang === 'vi';
  const qClean = (query || '').trim();
  const qNorm = normalizeText(qClean);
  const parsed = parseSemanticQuery(query);

  // =========================================================================
  // SCENARIO 1: EXPLORE PRODUCTS ON THE PAGE (Tìm hiểu sản phẩm trong trang)
  // =========================================================================
  const isExploreQuery = 
    qNorm.includes('tim hieu san pham') ||
    qNorm.includes('san pham trong trang') ||
    qNorm.includes('co nhung van nao') ||
    qNorm.includes('danh muc van') ||
    qNorm.includes('tat ca san pham') ||
    qNorm.includes('gioi thieu danh muc') ||
    qNorm.includes('cac loai van') ||
    qNorm.includes('danh sach van') ||
    qNorm.includes('explore products') ||
    qNorm.includes('all valves') ||
    qNorm.includes('what valves');

  if (isExploreQuery) {
    const categories = exploreCatalogCategories(availableValves, lang);
    const totalValves = availableValves.length;

    const answerVi = `👋 **Chào Quý Kỹ sư! Tôi là Kỹ Sư Trực Tuyến UTD.**
Hiện tại trên website và catalog UTD đang có **${totalValves} dòng sản phẩm van công nghiệp chính hãng**, bao gồm:

${categories.map((c, i) => `${i + 1}. **${c.label}** (${c.count} sản phẩm):
   - Đại diện: ${c.sampleValves.map(v => `\`${v.code}\``).join(', ')}`).join('\n')}

🌐 **Tiêu chuẩn chất lượng toàn bộ sản phẩm:**
- Dải kích cỡ đa dạng từ **DN15 (1/2") đến DN1200 (48")**.
- Dải áp lực phong phú từ **PN10, PN16, PN25, PN40** đến **ANSI Class 150/300**.
- Vật liệu cao cấp: **Gang cầu GGG50 dẻo dai, Thép đúc WCB chịu nhiệt 425°C, Inox 304 / Inox 316 CF8M chống hóa chất**.
- 100% qua thử nghiệm thủy tĩnh và kiểm định độ kín theo **ISO 5208 Rate A & API 598**.

👉 Quý Khách có thể nhấn trực tiếp vào bất kỳ model nào dưới đây để xem thông số chi tiết, bản vẽ 3D xoay được, hoặc hỏi tôi: *"Giới thiệu tính năng van [Tên model]"* hoặc *"Tư vấn chọn van cho hệ thống [Môi chất]"*!`;

    const answerEn = `👋 **Welcome! I am the UTD Online Valve Engineer.**
Our current web catalog features **${totalValves} authentic industrial valve products** across core engineering categories:

${categories.map((c, i) => `${i + 1}. **${c.label}** (${c.count} models):
   - Highlights: ${c.sampleValves.map(v => `\`${v.code}\``).join(', ')}`).join('\n')}

🌐 **Engineering Specifications across the catalog:**
- Size coverage: **DN15 (1/2") through DN1200 (48")**.
- Pressure classes: **PN10, PN16, PN25, PN40, ANSI Class 150/300**.
- Metallurgy: **Ductile Iron GGG50, Cast Steel WCB (up to 425°C), Stainless Steel 304/316 (CF8M)**.
- 100% factory hydrostatic shell and seat tested to **ISO 5208 Rate A & API 598**.

👉 Select any model card below to inspect technical specifications, rotate the interactive 3D model, or ask me for advice on specific fluids!`;

    return {
      answerVi,
      answerEn,
      recommendedValves: availableValves.slice(0, 6),
      citations: [GLOBAL_CITATIONS[0], GLOBAL_CITATIONS[1], GLOBAL_CITATIONS[5]],
      fieldTipsVi: 'Mẹo: Bạn có thể chọn xem mô hình 3D tương tác hoặc biểu đồ lưu lượng D3 của từng van ngay trong mục SpecModal.',
      fieldTipsEn: 'Tip: You can inspect interactive 3D models and D3 flow rate curves inside the SpecModal.',
      mode: 'explore'
    };
  }

  // =========================================================================
  // SCENARIO 2: INTRODUCE SPECIFIC VALVE FEATURES (Giới thiệu tính năng)
  // =========================================================================
  // Check if query is asking for features of a valve, or specifically mentions a valve code/name
  const isFeatureQuery = 
    qNorm.includes('tinh nang') || 
    qNorm.includes('dac diem') || 
    qNorm.includes('gioi thieu van') || 
    qNorm.includes('gioi thieu tinh nang') ||
    qNorm.includes('features') ||
    qNorm.includes('thong so') ||
    qNorm.includes('cau tao');

  // Find if query directly matches any valve in availableValves
  const directMatch = availableValves.find((v) => {
    const codeMatch = qNorm.includes(normalizeText(v.code));
    const nameMatch = qNorm.includes(normalizeText(v.name));
    const nameEnMatch = v.nameEn ? qNorm.includes(normalizeText(v.nameEn)) : false;
    const idMatch = qNorm.includes(normalizeText(v.id));
    return codeMatch || nameMatch || nameEnMatch || idMatch;
  });

  if (directMatch && (isFeatureQuery || qNorm.length < 40)) {
    return getDetailedValveFeatureAnalysis(directMatch, lang);
  }

  // Check specific categories if requested: "Tính năng van cổng dao", "Tính năng van bướm lệch tâm"...
  if (isFeatureQuery) {
    let targetValve: ValveProduct | undefined;
    if (qNorm.includes('dao') || qNorm.includes('slurry') || qNorm.includes('kgv')) {
      targetValve = availableValves.find(v => v.category === 'knife_gate');
    } else if (qNorm.includes('lech tam 3') || qNorm.includes('triple') || qNorm.includes('h402')) {
      targetValve = availableValves.find(v => v.code.includes('H402') || normalizeText(v.name).includes('lech tam 3'));
    } else if (qNorm.includes('lech tam 2') || qNorm.includes('double') || qNorm.includes('h401')) {
      targetValve = availableValves.find(v => v.code.includes('H401') || normalizeText(v.name).includes('lech tam 2') || normalizeText(v.name).includes('chiller'));
    } else if (qNorm.includes('bi') || qNorm.includes('ball') || qNorm.includes('102tf')) {
      targetValve = availableValves.find(v => v.category === 'ball');
    } else if (qNorm.includes('cong') || qNorm.includes('gate') || qNorm.includes('g101')) {
      targetValve = availableValves.find(v => v.category === 'gate' || v.category === 'resilient_gate');
    } else if (qNorm.includes('1 chieu') || qNorm.includes('mot chieu') || qNorm.includes('check') || qNorm.includes('c101')) {
      targetValve = availableValves.find(v => v.category === 'check');
    } else if (qNorm.includes('picv') || qNorm.includes('can bang')) {
      targetValve = availableValves.find(v => v.category === 'balancing');
    }

    if (targetValve) {
      return getDetailedValveFeatureAnalysis(targetValve, lang);
    }
  }

  // =========================================================================
  // SCENARIO 3: VALVE SELECTION ADVISORY (Tư vấn chọn van cho khách hàng)
  // =========================================================================

  // 0. UTDCORP IOM Standards & High Performance Butterfly Valve Inquiries
  if (
    qNorm.includes('utdcorp') || 
    qNorm.includes('hieu suat cao') || 
    qNorm.includes('high performance') || 
    qNorm.includes('neldisc') || 
    qNorm.includes('wafer-sphere') || 
    qNorm.includes('valmet') || 
    (qNorm.includes('buom') && (qNorm.includes('tai lieu') || qNorm.includes('iom') || qNorm.includes('lap dat') || qNorm.includes('van hanh') || qNorm.includes('moi chat')))
  ) {
    const matchedValves = availableValves.filter(v => v.code.includes('H401') || v.code.includes('H402') || v.isHighPerformance || v.category === 'butterfly');
    const primary = matchedValves.find(v => v.code.includes('H401')) || matchedValves[0] || availableValves[0];

    return {
      answerVi: `📘 **Tài liệu Kỹ thuật Bổ sung cho Van Bướm Hiệu Suất Cao UTD (${primary.code}) do UTDCORP Cung Cấp**
(Nguồn & Tài liệu kỹ thuật độc quyền do UTDCORP cung cấp - Viện Nghiên Cứu Công Nghệ Dòng Chảy & Van Công Nghiệp UTDCORP - utdcorp.com)

1. **Môi chất sử dụng tiêu chuẩn (Media Suitability):**
- Bột giấy (Pulp slurries 4-5% consistency), dịch đen (Black liquor), dịch trắng trong ngành Giấy & Bột giấy.
- Hơi quá nhiệt lên tới 450°C, hơi bão hòa trạm chính lò hơi (Superheated & saturated steam).
- Dầu khí, khí gas tự nhiên, hydrocarbon và hóa chất ăn mòn (chuẩn NACE MR0175).
- Khí lạnh âm sâu Cryogenic LNG (-196°C) và khí Oxy tinh khiết (làm sạch chuẩn ASTM G93 Level A).
- Nước lạnh Chiller HVAC 5-7°C với cổ cách nhiệt dài chống đọng sương.

2. **Quy trình Lắp đặt chuẩn UTDCORP IOM (Installation Guidelines):**
- **Nâng hạ an toàn:** Tuyệt đối không cẩu móc vào actuator hoặc ty van. Dùng dây đai nylon quấn quanh thân van.
- **Hướng trục van:** Khuyến nghị trục van nằm ngang (Horizontal stem) để dòng chảy tự cuốn trôi cặn lắng đáy ống. CẤM lắp actuator chúc đầu xuống đất.
- **Cảnh báo hàn bích:** TUYỆT ĐỐI KHÔNG HÀN MẶT BÍCH KHI VAN ĐANG KẸP. Phải đính điểm -> Tháo van ra -> Hàn hoàn tất -> Đợi nguội hoàn toàn mới lắp lại.
- **Trình tự siết bu lông:** Siết chéo đối xứng hình sao 5 bước (Snug-tight -> 30% -> 60% -> 100% -> Vòng kiểm tra cuối).

3. **Vận hành & Chạy thử (Commissioning):**
- Cân chỉnh cữ chặn cơ khí (Mechanical travel stops) trên actuator dừng đúng góc 90° (đóng) và 0° (mở).
- Đóng theo chiều kim đồng hồ (Clockwise to close).
- Thổi rửa đường ống (Flushing): Phải mở van ở vị trí 100% góc 90° để tránh xỉ hàn cào rách đệm kín.`,
      answerEn: `📘 **UTDCORP Standard Technical Manual for UTD High Performance Butterfly Valves (${primary.code})**
(Source & Proprietary Engineering Documentation provided by UTDCORP - Flow Technology Institute - utdcorp.com)

1. **Media Applications:**
- Pulp & Paper (Pulp slurries 4-5% consistency, Black & White liquor).
- Superheated Steam up to 450°C, Saturated steam header distribution.
- Hydrocarbons, Sour Gas (NACE MR0175), aggressive chemical reagents.
- Cryogenic LNG (-196°C) & High Purity Oxygen (ASTM G93 clean).
- HVAC Central Chiller loops with extended insulation neck.

2. **UTDCORP IOM Installation Rules:**
- **Rigging:** Never lift by actuator or stem. Use nylon slings around the valve body.
- **Shaft Orientation:** Horizontal shaft orientation is recommended to self-flush bottom pipeline debris. NEVER mount actuator inverted underneath pipe.
- **Welding Warning:** NEVER weld flanges with valve clamped in line. Tack weld -> Disassemble valve -> Complete welding & cool down -> Re-install valve.
- **Bolting Sequence:** Criss-cross star pattern in 5 passes (Snug -> 30% -> 60% -> 100% -> Final pass).

3. **Operation & Commissioning:**
- Calibrate mechanical travel stops on actuator for exact 90° seat closure.
- Clockwise to close rotation.
- Pipeline flushing: ALWAYS cycle valve to 100% FULL OPEN (90°) during line blowdown.`,
      recommendedFigCode: primary.code,
      recommendedModelName: primary.name,
      primaryValve: primary,
      recommendedValves: matchedValves.slice(0, 3),
      citations: [
        'Sổ tay Kỹ thuật Lắp đặt & Vận hành Van Bướm Hiệu Suất Cao UTDCORP Series H401/H402 do UTDCORP cung cấp',
        'Tiêu chuẩn Thiết kế Độc quyền & Kiểm định Áp Lực UTDCORP Valves (utdcorp.com)',
        'ISO 5208 Rate A: Industrial Metallic Valve Bubble-Tight Pressure Testing',
        'API 607 / ISO 10497: Fire Test for Soft and Metal-Seated Quarter-Turn Valves'
      ],
      fieldTipsVi: 'Mẹo chuẩn UTDCORP: Thường xuyên kiểm tra đệm cổ ty Live-Loaded Packing; nếu rò rỉ vi mô chỉ cần siết đều đai ốc 1/4 vòng, không siết quá lực làm bó cứng trục.',
      fieldTipsEn: 'UTDCORP field tip: Live-loaded stem packing only requires 1/4 turn tightening increments if minor leakage occurs; avoid overtightening which increases friction torque.',
      mode: 'advise'
    };
  }

  // 1. High-Temp Steam & Boiler Loops (>= 200°C or "hơi nóng", "lò hơi", "steam")
  if (
    qNorm.includes('hoi') || 
    qNorm.includes('steam') || 
    qNorm.includes('lo hoi') || 
    qNorm.includes('noi hoi') || 
    (parsed.targetTemperature && parsed.targetTemperature.value >= 200) ||
    parsed.targetMedia?.key === 'steam'
  ) {
    const matchedValves = availableValves.filter(v => 
      v.category === 'butterfly' || 
      v.category === 'globe' || 
      v.materialGroup === 'cast_steel' || 
      v.applicableMedia.some(m => normalizeText(m).includes('hoi'))
    );
    const primary = matchedValves[0] || availableValves.find(v => v.code.includes('H402')) || availableValves[0];
    const figPreset = UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode === 'Fig. H402') || UTD_CATALOGUE_FIGURE_PRESETS[1];

    return {
      answerVi: `Đối với hệ thống hơi nóng lò hơi (${parsed.targetTemperature ? parsed.targetTemperature.value + '°C' : 'nhiệt độ cao'}):
Để đảm bảo an toàn tuyệt đối và triệt tiêu rò rỉ nhiệt, UTD khuyến nghị sử dụng dòng **${primary.name} (Model: ${primary.code})** hoặc **Van Cầu Hơi Bellows Seal**. 
- Thân van thép đúc WCB chịu nhiệt lên tới 425°C, áp suất PN25 / PN40 / ANSI Class 300.
- Vòng làm kín kim loại xếp lớp đa tầng (Laminated Inox 316 + Flexible Graphite) chống mài mòn và không bị biến dạng nhiệt như cao su.
- Đạt chuẩn kiểm định chống cháy nổ API 607 và độ kín khít Zero-Leakage theo ISO 5208 Rate A.`,
      answerEn: `For steam and high-temperature boiler systems (${parsed.targetTemperature ? parsed.targetTemperature.value + '°C' : 'high-temp'}):
To eliminate fugitive steam leaks and thermal expansion damage, UTD recommends **${primary.nameEn || primary.name} (Model: ${primary.code})** or **Bellows Sealed Globe Valve**.
- Cast Steel WCB body rated up to 425°C, PN25 / PN40 / ANSI Class 300.
- Laminated multi-layer SS316 + Flexible Graphite metal-to-metal seating impervious to steam wire-drawing.
- Certified Fire-Safe API 607 with ISO 5208 Rate A bubble-tight shutoff.`,
      recommendedFig: figPreset,
      recommendedFigCode: primary.code,
      recommendedModelName: primary.name,
      primaryValve: primary,
      recommendedValves: matchedValves.slice(0, 3),
      citations: [
        'ASME B16.34: Section 2.1 Table 2-1.1 Cast Steel WCB Ratings',
        'Spirax Sarco Technical Paper: Steam Header Valve Isolation & Water Hammer Prevention',
        'ISO 5208 Rate A: Industrial Metallic Valve Zero Leakage Testing'
      ],
      fieldTipsVi: 'Lưu ý lắp đặt: Trước van hơi phải bố trí cụm bẫy hơi (Steam Trap) và bộ lọc Y để xả sạch nước ngưng tụ đọng đáy ống trước khi mở van, tránh hiện tượng thủy kích (Water Hammer).',
      fieldTipsEn: 'Field installation tip: Always install a steam trap station and Y-strainer upstream to purge condensate prior to valve opening, preventing destructive water hammer shocks.',
      mode: 'advise'
    };
  }

  // 2. Corrosive Chemicals & Acids ("hóa chất", "axit", "ăn mòn", "inox 316", "cf8m")
  if (
    qNorm.includes('hoa chat') || 
    qNorm.includes('axit') || 
    qNorm.includes('acid') || 
    qNorm.includes('an mon') || 
    qNorm.includes('inox 316') ||
    qNorm.includes('cf8m') ||
    parsed.targetMaterial?.key === 'ss316' ||
    parsed.targetMedia?.key === 'chemical'
  ) {
    const matchedValves = availableValves.filter(v => 
      v.materialGroup === 'ss304_316' || 
      v.material.includes('CF8M') || 
      v.material.includes('316') ||
      v.applicableMedia.some(m => normalizeText(m).includes('hoa chat'))
    );
    const primary = matchedValves[0] || availableValves[1];
    const figPreset = UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode === 'Fig. BF201') || UTD_CATALOGUE_FIGURE_PRESETS[3];

    return {
      answerVi: `Đối với môi chất hóa chất ăn mòn, axit loãng và dung môi công nghiệp:
UTD khuyến nghị dòng **${primary.name} (Model: ${primary.code})** hoặc **Van Bi Inox 3 Ngã Full Port**.
- Thân và đĩa van đúc từ thép không gỉ Austenitic CF8M (Inox 316) có chứa 2-3% Molybdenum kháng rỗ bề mặt (Pitting Resistance) cực cao trong môi trường ion Cl-.
- Đệm làm kín Pure PTFE / R-PTFE trơ hóa học 100% với hầu hết axit, kiềm và dung môi hữu cơ.
- Trục van Inox 316 gia công tiện CNC liền khối, chống rò rỉ đệm cổ ty van.`,
      answerEn: `For corrosive chemical media, acids, and aggressive process fluids:
UTD recommends the **${primary.nameEn || primary.name} (Model: ${primary.code})** or **Full Port SS316 Ball Valve**.
- Cast Austenitic CF8M (SS316) body and disc containing 2-3% Molybdenum for exceptional pitting resistance against chloride ions.
- Pure PTFE / R-PTFE resilient seat chemically inert to virtually all acids, alkalis, and organic solvents.
- One-piece SS316 precision CNC machined stem with double O-ring packing preventing external leaks.`,
      recommendedFig: figPreset,
      recommendedFigCode: primary.code,
      recommendedModelName: primary.name,
      primaryValve: primary,
      recommendedValves: matchedValves.slice(0, 3),
      citations: [
        'ASTM A351 / A351M: Standard Specification for Castings, Austenitic, for Pressure-Containing Parts (CF8M)',
        'NACE MR0175 / ISO 15156: Materials for Use in H2S-containing Environments',
        'API 598: Chemical Service Valve Closure Testing'
      ],
      fieldTipsVi: 'Lưu ý lắp đặt: Với axit nồng độ đậm đặc (>50% H2SO4 hoặc HCl), khuyến nghị liên hệ kỹ sư UTD để kiểm tra bảng tương thích màng lót lót PFA/PTFE toàn phần.',
      fieldTipsEn: 'Field installation tip: For concentrated acids (>50% H2SO4/HCl), verify lining compatibility with fully fluoropolymer lined PFA/PTFE valves.',
      mode: 'advise'
    };
  }

  // 3. Fire Protection (PCCC, "pccc", "chữa cháy", "sprinkler", "shotgun riser", "alarm check")
  if (
    qNorm.includes('pccc') || 
    qNorm.includes('chua chay') || 
    qNorm.includes('sprinkler') || 
    qNorm.includes('riser') || 
    qNorm.includes('alarm') ||
    parsed.targetMedia?.key === 'fire'
  ) {
    const isRiserCompare = qNorm.includes('shotgun') || qNorm.includes('so sanh') || qNorm.includes('khac');
    const matchedValves = availableValves.filter(v => v.systemGroup === 'firefighting' || normalizeText(v.name).includes('pccc') || normalizeText(v.code).includes('g101'));
    const primary = matchedValves[0] || availableValves.find(v => v.code.includes('G101')) || availableValves[0];
    const figPreset = UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode === 'Fig. G101') || UTD_CATALOGUE_FIGURE_PRESETS[4];

    return {
      answerVi: isRiserCompare 
        ? `Về so sánh **Shotgun Riser Manifold** và **Alarm Check Valve** cho hệ PCCC:
1. **Shotgun Riser (Floor Control Assembly)**: Dành riêng cho phân vùng từng tầng hoặc khối căn hộ/văn phòng. Tích hợp gọn trong 1 cụm: van bướm giám sát tín hiệu điện, van một chiều cao tốc, công tắc dòng chảy Flow Switch và cụm xả Test & Drain. Tiết kiệm 65% không gian hộp gen kỹ thuật.
2. **Alarm Check Valve (Wet Alarm Valve)**: Lắp đặt tại chân trục đứng cấp nước chính từ phòng bơm. Có rãnh trích tín hiệu kết nối bình làm chậm (Retard Chamber) và chuông nước cơ khí (Water Motor Alarm Gong) reo bằng thủy lực không cần điện.
UTD cung cấp cả hai dòng chuẩn UL/FM và kiểm định PCCC theo TCVN 7336:2021.`
        : `Đối với mạng lưới cấp nước PCCC cứu hỏa (Fire Fighting Network):
UTD khuyến nghị dòng **${primary.name} (Model: ${primary.code})** kết hợp cụm **Shotgun Riser UTD-SGR16**:
- Thân gang cầu GGG50 dẻo dai, nêm van bọc cao su EPDM 100%, sơn phủ Epoxy đỏ chuẩn PCCC dày ≥ 250 µm.
- Áp lực làm việc 300 PSI (PN25 / 20.7 Bar) chịu áp đề-pa máy bơm chữa cháy.
- Ty van nổi OS&Y quan sát trực quan trạng thái van từ xa theo quy định NFPA 13 và TCVN 3890.`,
      answerEn: isRiserCompare
        ? `Regarding **Shotgun Riser Manifold vs Alarm Check Valve** comparison:
1. **Shotgun Riser (Floor Control)**: Compact assembly for individual floor zoning (supervised butterfly valve, riser check, flow switch with electronic retard, inspector's test & drain). Saves 65% shaft footprint.
2. **Alarm Check Valve**: Installed at main pump discharge risers with mechanical Retard Chamber and hydro-powered Water Motor Alarm Gong requiring zero electrical supply.
Both systems are fully supplied by UTD with UL/FM listings and NFPA 13 compliance.`
        : `For Fire Protection Networks (UL/FM listed):
UTD recommends the **${primary.nameEn || primary.name} (Model: ${primary.code})** and **Shotgun Riser Manifold**:
- Ductile iron GGG50 body, 100% EPDM vulcanized wedge, red fusion-bonded epoxy coating >= 250 microns.
- Rated 300 PSI (PN25 / 20.7 bar) to absorb fire pump starting hydraulic surges.
- Outside Screw & Yoke rising stem allows immediate visual inspection complying with NFPA 13 / 14 standards.`,
      recommendedFig: figPreset,
      recommendedFigCode: primary.code,
      recommendedModelName: primary.name,
      primaryValve: primary,
      recommendedValves: matchedValves.slice(0, 3),
      citations: [
        'NFPA 13: Standard for the Installation of Sprinkler Systems (Chapters 8 & 16)',
        'UL 193 / FM 1020: Alarm Valves and Riser Manifold Standards',
        'TCVN 7336:2021: Phòng cháy chữa cháy - Hệ thống Sprinkler tự động'
      ],
      fieldTipsVi: 'Lưu ý lắp đặt: Công tắc giám sát vị trí mở (Tamper Switch) trên van PCCC phải được đấu dây về Tủ báo cháy trung tâm để phát chuông cảnh báo nếu có ai vô tình đóng van.',
      fieldTipsEn: 'Field installation tip: Tamper switches on fire isolation valves must be connected to the central fire alarm panel to trigger supervisory signals if valve is closed.',
      mode: 'advise'
    };
  }

  // 4. Heavy Slurry, Pulp & Wastewater ("bùn", "rác", "cổng dao", "nước thải thô")
  if (
    qNorm.includes('bun') || 
    qNorm.includes('bot giay') || 
    qNorm.includes('cong dao') || 
    qNorm.includes('dao') || 
    qNorm.includes('rac') ||
    qNorm.includes('slurry') ||
    qNorm.includes('pulp')
  ) {
    const matchedValves = availableValves.filter(v => v.category === 'knife_gate' || normalizeText(v.name).includes('dao'));
    const primary = matchedValves[0] || availableValves[0];
    const figPreset = UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode === 'Fig. KG101') || UTD_CATALOGUE_FIGURE_PRESETS[5];

    return {
      answerVi: `Đối với môi chất bùn khoáng, bột giấy, nước thải lẫn xơ rác và chất rắn lơ lửng:
UTD khuyến nghị dòng **${primary.name} (Model: ${primary.code})**:
- Lưỡi dao bằng Inox 304/316 vát cạnh nghiêng 45° sắc bén có khả năng cắt đứt rác hữu cơ, sợi dệt và lắng cặn mà không bị kẹt.
- Bộ gạt bùn (Scraper) làm sạch lưỡi dao liên tục khi chuyển động đóng mở.
- Đệm chữ U cao su EPDM cho phép đóng mở 2 chiều kín nước tuyệt đối mà không cần hốc rãnh ở đáy van.`,
      answerEn: `For heavy slurry, mineral tailings, pulp & paper, and high-solid wastewater:
UTD recommends the **${primary.nameEn || primary.name} (Model: ${primary.code})**:
- Beveled stainless steel 304/316 knife edge engineered to shear through solids, fibrous slurries, and pulp without clogging.
- Dual scraping blades keep knife gate face clean and prevent packing gland damage.
- Full perimeter U-seat delivers bidirectional bubble-tight shutoff without bottom cavity jamming.`,
      recommendedFig: figPreset,
      recommendedFigCode: primary.code,
      recommendedModelName: primary.name,
      primaryValve: primary,
      recommendedValves: matchedValves.slice(0, 3),
      citations: [
        'MSS SP-81: Stainless Steel, Bonnetless, Flanged Knife Gate Valves',
        'TAPPI TIS 405-8: Technical Association of the Pulp and Paper Industry',
        'ISO 5208 Rate A: Slurry Isolation Pressure Standards'
      ],
      fieldTipsVi: 'Lưu ý lắp đặt: Với đường ống bùn có độ mài mòn cao, nên lắp van theo hướng mũi tên chỉ dòng chảy ưu tiên để tối ưu độ bền của bộ làm kín.',
      fieldTipsEn: 'Field installation tip: On abrasive slurry lines, orient the valve with flow arrow to minimize wear on the sealing gate interface.',
      mode: 'advise'
    };
  }

  // 5. HVAC Chiller & Water Balancing ("chiller", "nước lạnh", "fcu", "ahu", "cân bằng")
  if (
    qNorm.includes('chiller') || 
    qNorm.includes('nuoc lanh') || 
    qNorm.includes('hvac') || 
    qNorm.includes('can bang') || 
    qNorm.includes('picv') ||
    parsed.targetMedia?.key === 'chiller'
  ) {
    const matchedValves = availableValves.filter(v => 
      v.category === 'butterfly' || 
      v.category === 'balancing' || 
      normalizeText(v.name).includes('chiller') ||
      normalizeText(v.description).includes('chiller')
    );
    const primary = matchedValves[0] || availableValves[0];
    const figPreset = UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode === 'Fig. H401') || UTD_CATALOGUE_FIGURE_PRESETS[0];

    return {
      answerVi: `Đối với hệ thống Chiller điều hòa trung tâm & Nước lạnh HVAC:
UTD khuyến nghị dòng **${primary.name} (Model: ${primary.code})** hoặc **Van Cân Bằng Tự Động PICV**:
- Cổ van vươn dài (Extended neck) cho phép bọc lớp xốp cách nhiệt Aeroflex/Armaflex dày 50mm mà không bị che khuất cần gạt hoặc bộ truyền động điều khiển.
- Đĩa Inox 316 mài bóng gương kết hợp đệm EPDM chống đọng sương và ngăn rỉ sét ngưng tụ.
- Hệ số lưu lượng Kvs lớn, độ cản dòng thủy lực thấp giúp tiết kiệm điện năng cho máy bơm tuần hoàn.`,
      answerEn: `For Central HVAC Chiller & Chilled Water Loops:
UTD recommends the **${primary.nameEn || primary.name} (Model: ${primary.code})**:
- Extended neck design provides ample clearance for 50mm insulation cladding without interfering with actuator mounting.
- Mirror-polished SS316 disc on resilient high-density EPDM prevents condensation rusting and sticking.
- Generous Kvs capacity minimizes system head loss, lowering continuous pump energy consumption.`,
      recommendedFig: figPreset,
      recommendedFigCode: primary.code,
      recommendedModelName: primary.name,
      primaryValve: primary,
      recommendedValves: matchedValves.slice(0, 3),
      citations: [
        'ASHRAE 90.1: Energy Standard for Buildings Except Low-Rise Residential',
        'EN 593: Industrial Valves - Metallic Butterfly Valves',
        'AMCA Standard 500-D: Laboratory Methods of Testing Dampers/Valves'
      ],
      fieldTipsVi: 'Lưu ý lắp đặt: Cần bọc kín gioăng cách nhiệt quanh cổ van để tránh cầu nhiệt (thermal bridge) gây đọng nước nhỏ giọt xuống trần thạch cao.',
      fieldTipsEn: 'Field installation tip: Ensure vapor-barrier insulation seals tightly around valve neck to avoid condensation dripping above false ceilings.',
      mode: 'advise'
    };
  }

  // 6. Non-Slam Check & Pump Discharge ("búa nước", "máy bơm", "một chiều", "lá lật", "bướm 2 cánh")
  if (
    qNorm.includes('bua nuoc') || 
    qNorm.includes('may bom') || 
    qNorm.includes('mot chieu') || 
    qNorm.includes('1 chieu') || 
    qNorm.includes('check') || 
    qNorm.includes('c101')
  ) {
    const matchedValves = availableValves.filter(v => v.category === 'check' || normalizeText(v.code).includes('c101'));
    const primary = matchedValves[0] || availableValves[0];
    const figPreset = UTD_CATALOGUE_FIGURE_PRESETS.find(p => p.figCode === 'Fig. C101') || UTD_CATALOGUE_FIGURE_PRESETS[6];

    return {
      answerVi: `Đối với vị trí đầu đẩy máy bơm cần triệt tiêu búa nước và chống chảy ngược:
UTD khuyến nghị dòng **${primary.name} (Model: ${primary.code})**:
- Thiết kế đĩa kép cánh bướm (Dual Plate) có lò xo xoắn trợ lực bằng hợp kim Inconel giúp cánh van đóng lại ngay lập tức khi dòng chảy bắt đầu giảm tốc, trước khi nước kịp đảo chiều.
- Triệt tiêu 95% tiếng va đập và xung kích thủy lực búa nước (Water Hammer) phá hủy đường ống.
- Thân van siêu mỏng dạng kẹp Wafer nhẹ hơn van lá lật truyền thống 75%, tiết kiệm giá đỡ ống.`,
      answerEn: `For pump discharge lines requiring water hammer suppression and reverse flow protection:
UTD recommends the **${primary.nameEn || primary.name} (Model: ${primary.code})**:
- Dual-plate architecture with Inconel heavy torsion springs accelerates closure prior to reverse flow velocity onset.
- Suppresses 95% of destructive hydraulic shockwaves and water hammer slams.
- Compact wafer body is 75% lighter than swing check valves, reducing structural pipe hanging loads.`,
      recommendedFig: figPreset,
      recommendedFigCode: primary.code,
      recommendedModelName: primary.name,
      primaryValve: primary,
      recommendedValves: matchedValves.slice(0, 3),
      citations: [
        'API 594: Check Valves - Flanged, Lug, Wafer and Butt-welding',
        'Crane TP 410 Chapter 3: Dynamic Check Valve Closure Dynamics',
        'ISO 5208 Rate A: Hydrostatic Seat Tightness Testing'
      ],
      fieldTipsVi: 'Lưu ý lắp đặt: Khoảng cách tối thiểu từ đầu đẩy máy bơm đến van một chiều nên bằng ít nhất 5 lần đường kính ống (5 x DN) để dòng chảy ổn định, không gây rung lắc cánh van.',
      fieldTipsEn: 'Field installation tip: Install check valve at least 5 pipe diameters (5 x DN) downstream of pump outlet to ensure steady laminar flow and avoid fluttering.',
      mode: 'advise'
    };
  }

  // 7. Generic Intelligent Match or Fallback
  // Try parameter advisory based on whatever text we have
  const fallback = adviseByEngineeringParameters(
    { media: query, pressure: 'PN16' },
    availableValves,
    lang
  );
  return fallback;
}
