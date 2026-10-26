import { ValveProduct } from '../types/valve';

export interface SemanticParsedQuery {
  rawQuery: string;
  hasSemanticIntent: boolean;
  targetTemperature?: {
    value: number;
    rawText: string;
    description: string;
  };
  targetMedia?: {
    key: string;
    labelVi: string;
    labelEn: string;
    aliases: string[];
  };
  targetMaterial?: {
    key: string;
    labelVi: string;
    labelEn: string;
    aliases: string[];
  };
  targetPressure?: {
    key: string;
    rawText: string;
  };
  targetCategory?: {
    key: string;
    labelVi: string;
  };
  semanticTokens: string[];
  summaryLabelVi: string;
  summaryLabelEn: string;
}

export interface SemanticMatchResult {
  matches: boolean;
  score: number;
  matchedAttributes: string[];
}

const STOP_WORDS = new Set([
  'cho', 'dùng', 'dành', 'loại', 'các', 'và', 'của', 'với', 'trong', 'ở', 'tại',
  'khi', 'theo', 'nào', 'được', 'cần', 'mua', 'tìm', 'báo', 'giá', 'hãng',
  'for', 'use', 'used', 'with', 'and', 'the', 'valve', 'valves', 'in', 'at'
]);

const MEDIA_DICTIONARY = [
  {
    key: 'steam',
    labelVi: 'Hơi nóng / Lò hơi (Steam)',
    labelEn: 'High-Temp Steam',
    aliases: ['hơi nóng', 'steam', 'lò hơi', 'nồi hơi', 'hơi bão hòa', 'hơi quá nhiệt', 'condensate', 'nước ngưng']
  },
  {
    key: 'chemical',
    labelVi: 'Hóa chất / Axit (Chemicals)',
    labelEn: 'Chemicals & Corrosive',
    aliases: ['hóa chất', 'hoa chat', 'axit', 'acid', 'kiềm', 'ăn mòn', 'corrosive', 'dung môi', 'hóa dầu']
  },
  {
    key: 'chiller',
    labelVi: 'Nước lạnh Chiller / HVAC',
    labelEn: 'Chilled Water & HVAC',
    aliases: ['chiller', 'nước lạnh', 'nuoc lanh', 'hvac', 'điều hòa', 'tháp giải nhiệt', 'fcu', 'ahu']
  },
  {
    key: 'fire',
    labelVi: 'PCCC Cứu hỏa (Fire Protection)',
    labelEn: 'Fire Protection (UL/FM)',
    aliases: ['pccc', 'chữa cháy', 'chua chay', 'cứu hỏa', 'cuu hoa', 'sprinkler', 'foam', 'ul/fm', 'ul', 'fm']
  },
  {
    key: 'water',
    labelVi: 'Cấp thoát nước sạch / Nước thải',
    labelEn: 'Potable / Wastewater',
    aliases: ['nước sạch', 'nuoc sach', 'cấp nước', 'thoát nước', 'nước thải', 'nuoc thai', 'thủy cục', 'sinh hoạt']
  },
  {
    key: 'oilgas',
    labelVi: 'Dầu khí / Hydrocarbon',
    labelEn: 'Oil & Gas Petroleum',
    aliases: ['dầu khí', 'dau khi', 'xăng dầu', 'xang dau', 'dầu thô', 'petroleum', 'hydrocarbon', 'gas']
  },
  {
    key: 'cryo',
    labelVi: 'Khí hóa lỏng LNG / Khí âm sâu',
    labelEn: 'Cryogenic & LNG',
    aliases: ['lng', 'cryogenic', 'âm sâu', 'khí lỏng', 'nitơ lỏng', 'oxy lỏng']
  },
  {
    key: 'slurry',
    labelVi: 'Bùn khoáng / Bột giấy',
    labelEn: 'Slurry & Paper Pulp',
    aliases: ['bùn', 'bun', 'bột giấy', 'bot giay', 'bột than', 'slurry', 'hạt rắn', 'lơ lửng']
  }
];

const MATERIAL_DICTIONARY = [
  {
    key: 'ss316',
    labelVi: 'Inox 316 / CF8M (Thép không gỉ 316)',
    labelEn: 'Stainless Steel 316 / CF8M',
    aliases: ['inox 316', 'inox316', '316', 'cf8m', 'ss316', 'sus316', 'thép không gỉ 316', 'a351 cf8m']
  },
  {
    key: 'ss304',
    labelVi: 'Inox 304 / CF8',
    labelEn: 'Stainless Steel 304 / CF8',
    aliases: ['inox 304', 'inox304', '304', 'cf8', 'ss304', 'sus304', 'thép không gỉ 304']
  },
  {
    key: 'cast_steel',
    labelVi: 'Thép đúc / Thép rèn WCB / A105',
    labelEn: 'Carbon Cast Steel WCB',
    aliases: ['thép đúc', 'thep duc', 'thép rèn', 'thep ren', 'wcb', 'a105', 'carbon steel', 'thép carbon', 'gs-c25']
  },
  {
    key: 'ductile_iron',
    labelVi: 'Gang cầu / Ductile Iron GGG50',
    labelEn: 'Ductile Iron GGG50',
    aliases: ['gang cầu', 'gang cau', 'ductile iron', 'ggg50', 'gang dẻo', 'a536', 'qt450']
  },
  {
    key: 'cast_iron',
    labelVi: 'Gang xám GG25 / FC200',
    labelEn: 'Cast Iron GG25',
    aliases: ['gang xám', 'gang xam', 'cast iron', 'gg25', 'fc200']
  },
  {
    key: 'bronze',
    labelVi: 'Đồng Bronze / Brass B62',
    labelEn: 'Bronze Alloy',
    aliases: ['đồng', 'dong', 'bronze', 'brass', 'thau', 'b62']
  }
];

const CATEGORY_DICTIONARY = [
  { key: 'ball', labelVi: 'Van bi', aliases: ['van bi', 'ball valve', 'bi inox', 'bi gang', 'bi 3 ngã'] },
  { key: 'butterfly', labelVi: 'Van bướm', aliases: ['van bướm', 'van buom', 'butterfly valve', 'bướm lệch tâm', 'bướm tay gạt'] },
  { key: 'gate', labelVi: 'Van cổng / Van cửa', aliases: ['van cổng', 'van cong', 'van cửa', 'van cua', 'gate valve', 'ty nổi', 'ty chìm'] },
  { key: 'knife_gate', labelVi: 'Van cổng dao', aliases: ['van cổng dao', 'van cong dao', 'cổng dao', 'knife gate'] },
  { key: 'globe', labelVi: 'Van cầu hơi', aliases: ['van cầu', 'van cau', 'globe valve', 'van hơi', 'bellows seal'] },
  { key: 'check', labelVi: 'Van một chiều', aliases: ['van một chiều', 'van 1 chiều', 'van mot chieu', 'check valve', 'lá lật', 'bướm 2 cánh', 'dual plate'] },
  { key: 'safety_valve', labelVi: 'Van an toàn', aliases: ['van an toàn', 'van an toan', 'safety valve', 'xả áp'] },
  { key: 'prv', labelVi: 'Van giảm áp', aliases: ['van giảm áp', 'van giam ap', 'reducing valve', 'prv'] },
  { key: 'strainer', labelVi: 'Y-lọc / Lọc rọ', aliases: ['lọc y', 'loc y', 'y lọc', 'strainer', 'lọc rác'] },
  { key: 'balancing', labelVi: 'Van cân bằng', aliases: ['van cân bằng', 'van can bang', 'balancing valve', 'picv'] },
  { key: 'flexible_joint', labelVi: 'Khớp nối mềm / Chống rung', aliases: ['khớp nối mềm', 'khop noi mem', 'chống rung', 'flexible joint'] },
];

/**
 * Parses natural language search query into semantic engineering parameters
 */
export function parseSemanticQuery(rawQuery: string): SemanticParsedQuery {
  const qLower = (rawQuery || '').toLowerCase().trim();
  const summaryPartsVi: string[] = [];
  const summaryPartsEn: string[] = [];

  // 1. Detect Temperature Intent (e.g. "300 độ", "350°C", "chịu nhiệt 300 độ", "400 độ c")
  let targetTemperature: SemanticParsedQuery['targetTemperature'] = undefined;
  const tempNumberMatch = qLower.match(/(\d{2,3})\s*(?:độ|do|°c|deg|c|độ c)/i);
  if (tempNumberMatch) {
    const val = parseInt(tempNumberMatch[1], 10);
    targetTemperature = {
      value: val,
      rawText: tempNumberMatch[0],
      description: `Nhiệt độ làm việc chịu được ≥ ${val}°C`
    };
    summaryPartsVi.push(`Nhiệt độ ≥ ${val}°C`);
    summaryPartsEn.push(`Temp ≥ ${val}°C`);
  } else if (qLower.includes('chịu nhiệt') || qLower.includes('chiu nhiet') || qLower.includes('nhiệt độ cao') || qLower.includes('high temp')) {
    targetTemperature = {
      value: 200,
      rawText: 'chịu nhiệt',
      description: 'Chịu nhiệt độ cao công nghiệp (≥ 200°C)'
    };
    summaryPartsVi.push('Chịu nhiệt độ cao');
    summaryPartsEn.push('High Temperature');
  }

  // 2. Detect Media Intent (e.g. "cho hơi nóng", "dùng cho hóa chất", "chiller", "pccc")
  let targetMedia: SemanticParsedQuery['targetMedia'] = undefined;
  for (const media of MEDIA_DICTIONARY) {
    if (media.aliases.some(alias => qLower.includes(alias))) {
      targetMedia = media;
      summaryPartsVi.push(`Môi chất: ${media.labelVi.split('(')[0].trim()}`);
      summaryPartsEn.push(`Media: ${media.labelEn}`);
      break;
    }
  }

  // 3. Detect Material Intent (e.g. "inox 316", "gang cầu", "thép đúc")
  let targetMaterial: SemanticParsedQuery['targetMaterial'] = undefined;
  for (const mat of MATERIAL_DICTIONARY) {
    if (mat.aliases.some(alias => qLower.includes(alias))) {
      targetMaterial = mat;
      summaryPartsVi.push(`Vật liệu: ${mat.labelVi.split('/')[0].trim()}`);
      summaryPartsEn.push(`Material: ${mat.labelEn.split('/')[0].trim()}`);
      break;
    }
  }

  // 4. Detect Category Intent (e.g. "van bi", "van bướm", "van cầu")
  let targetCategory: SemanticParsedQuery['targetCategory'] = undefined;
  for (const cat of CATEGORY_DICTIONARY) {
    if (cat.aliases.some(alias => qLower.includes(alias))) {
      targetCategory = cat;
      summaryPartsVi.push(`Dòng: ${cat.labelVi}`);
      break;
    }
  }

  // 5. Detect Pressure Intent (e.g. "pn16", "pn25", "pn40", "class 150", "class 300", "300 psi", "áp cao")
  let targetPressure: SemanticParsedQuery['targetPressure'] = undefined;
  const pressMatch = qLower.match(/(pn\s*\d+|class\s*\d+|\d+\s*psi|\d+\s*bar|áp lực cao|ap luc cao)/i);
  if (pressMatch) {
    targetPressure = {
      key: pressMatch[0].replace(/\s+/g, '').toUpperCase(),
      rawText: pressMatch[0]
    };
    summaryPartsVi.push(`Cấp áp: ${pressMatch[0].toUpperCase()}`);
    summaryPartsEn.push(`Pressure: ${pressMatch[0].toUpperCase()}`);
  }

  // Extract non-stopword tokens
  const words = qLower.split(/[\s,+/–-]+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
  const hasSemanticIntent = Boolean(targetTemperature || targetMedia || targetMaterial || targetPressure);

  return {
    rawQuery,
    hasSemanticIntent,
    targetTemperature,
    targetMedia,
    targetMaterial,
    targetCategory,
    targetPressure,
    semanticTokens: words,
    summaryLabelVi: summaryPartsVi.join(' • '),
    summaryLabelEn: summaryPartsEn.join(' • ')
  };
}

/**
 * Extracts max temperature limit in °C from a temperature range string
 */
function extractMaxTemp(tempStr: string): number {
  if (!tempStr) return 80;
  // Look for patterns like "+350°C", "Max 425°C", "350°C", "đến 300"
  const matches = tempStr.match(/(?:max|\+|đến|to|\-)?\s*(\d{2,3})\s*(?:°c|c)?/gi);
  if (!matches) return 80;
  let maxFound = 80;
  for (const m of matches) {
    const numMatch = m.match(/\d{2,3}/);
    if (numMatch) {
      const val = parseInt(numMatch[0], 10);
      if (val > maxFound && val <= 1000) {
        maxFound = val;
      }
    }
  }
  return maxFound;
}

/**
 * Evaluates whether a product satisfies the natural language semantic query
 */
export function evaluateProductSemantic(item: ValveProduct, parsed: SemanticParsedQuery): SemanticMatchResult {
  const qLower = parsed.rawQuery.toLowerCase().trim();
  const matchedAttributes: string[] = [];
  let score = 0;

  // 0. Exact Substring Match Check across key attributes (Direct bonus)
  const fullText = [
    item.name,
    item.nameEn,
    item.code,
    item.brand || 'UTD',
    item.material,
    item.materialEn,
    item.categoryLabel,
    item.categoryLabelEn,
    item.pressure,
    item.sizeRange,
    item.tempRange,
    item.description || '',
    item.descriptionEn || '',
    ...(item.applicableMedia || []),
    ...(item.applicableMediaEn || []),
    item.characteristics?.lifecycle || '',
    item.characteristics?.tempLimits || '',
    item.characteristics?.sealIntegrity || '',
    item.characteristics?.mediaApplications || '',
    item.characteristics?.aiSummaryNotes || ''
  ].join(' ').toLowerCase();

  // If entire string is found literally
  if (fullText.includes(qLower)) {
    return {
      matches: true,
      score: 100,
      matchedAttributes: ['Exact Match (Khớp toàn chuỗi)']
    };
  }

  // If query is semantic (e.g. "van chịu nhiệt 300 độ cho hơi nóng" or "van inox 316 dùng cho hóa chất")
  let passedTemperature = true;
  let passedMedia = true;
  let passedMaterial = true;
  let passedPressure = true;
  let passedCategory = true;

  // 1. Evaluate Temperature Condition
  if (parsed.targetTemperature) {
    const targetVal = parsed.targetTemperature.value;
    const itemMaxTemp = Math.max(
      extractMaxTemp(item.tempRange),
      item.characteristics?.tempLimits ? extractMaxTemp(item.characteristics.tempLimits) : 0
    );

    // Valve matches if its rating covers the requested temperature
    if (itemMaxTemp >= targetVal || item.tempRange.includes(targetVal.toString())) {
      matchedAttributes.push(`Nhiệt độ (Chịu tối đa ${itemMaxTemp}°C ≥ ${targetVal}°C)`);
      score += 30;
    } else if (item.systemGroup === 'steam' && targetVal <= 350) {
      // Steam valves naturally handle high heat
      matchedAttributes.push(`Hệ hơi nóng (Chịu nhiệt lò hơi ${itemMaxTemp}°C)`);
      score += 20;
    } else {
      passedTemperature = false;
    }
  }

  // 2. Evaluate Media Condition (e.g. "hơi nóng", "hóa chất", "chiller", "pccc")
  if (parsed.targetMedia) {
    const targetKey = parsed.targetMedia.key;
    const mediaText = [
      ...(item.applicableMedia || []),
      ...(item.applicableMediaEn || []),
      item.characteristics?.mediaApplications || '',
      item.characteristics?.mediaApplicationsEn || '',
      item.systemGroup,
      item.description || '',
      item.descriptionEn || ''
    ].join(' ').toLowerCase();

    let mediaMatched = false;
    // Check aliases
    for (const alias of parsed.targetMedia.aliases) {
      if (mediaText.includes(alias)) {
        mediaMatched = true;
        break;
      }
    }

    // Category / SystemGroup semantic equivalence
    if (!mediaMatched) {
      if (targetKey === 'steam' && (item.systemGroup === 'steam' || item.category === 'globe' || item.category === 'safety_valve' || item.category === 'prv')) {
        mediaMatched = true;
      } else if (targetKey === 'chemical' && (item.materialGroup === 'ss304_316' || item.material.toLowerCase().includes('316') || item.material.toLowerCase().includes('cf8m'))) {
        mediaMatched = true;
      } else if (targetKey === 'fire' && (item.systemGroup === 'firefighting' || item.code.includes('400DEF') || item.pressure.includes('300 PSI'))) {
        mediaMatched = true;
      } else if (targetKey === 'chiller' && (item.systemGroup === 'hvac' || item.systemGroup === 'water')) {
        mediaMatched = true;
      } else if (targetKey === 'slurry' && item.category === 'knife_gate') {
        mediaMatched = true;
      }
    }

    if (mediaMatched) {
      matchedAttributes.push(`Môi chất (${parsed.targetMedia.labelVi.split('(')[0].trim()})`);
      score += 30;
    } else {
      passedMedia = false;
    }
  }

  // 3. Evaluate Material Condition (e.g. "inox 316", "gang cầu", "thép đúc")
  if (parsed.targetMaterial) {
    const matText = (item.material + ' ' + item.materialEn + ' ' + item.materialGroup + ' ' + item.name + ' ' + item.code).toLowerCase();
    let matMatched = false;
    for (const alias of parsed.targetMaterial.aliases) {
      if (matText.includes(alias)) {
        matMatched = true;
        break;
      }
    }

    if (matMatched) {
      matchedAttributes.push(`Vật liệu (${parsed.targetMaterial.labelVi.split('/')[0].trim()})`);
      score += 30;
    } else {
      passedMaterial = false;
    }
  }

  // 4. Evaluate Pressure Condition
  if (parsed.targetPressure) {
    const pressText = (item.pressure + ' ' + item.pressureGroup + ' ' + item.testPressureShell + ' ' + item.description).toLowerCase();
    const targetQ = parsed.targetPressure.rawText.toLowerCase().replace(/\s+/g, '');
    if (pressText.replace(/\s+/g, '').includes(targetQ) || (targetQ.includes('áp lực cao') && (item.pressure.includes('PN25') || item.pressure.includes('PN40') || item.pressure.includes('Class')))) {
      matchedAttributes.push(`Áp suất (${parsed.targetPressure.rawText})`);
      score += 20;
    } else {
      passedPressure = false;
    }
  }

  // 5. Evaluate Category Condition (e.g. "van bi", "van bướm")
  if (parsed.targetCategory) {
    const catText = (item.category + ' ' + item.categoryLabel + ' ' + item.categoryLabelEn + ' ' + item.name + ' ' + item.nameEn).toLowerCase();
    if (parsed.targetCategory.key === item.category || catText.includes(parsed.targetCategory.key)) {
      matchedAttributes.push(`Dòng van (${parsed.targetCategory.labelVi})`);
      score += 15;
    } else {
      // If user explicitly asked for "van bướm" and product is "van bi", reject
      passedCategory = false;
    }
  }

  // If all detected semantic intents passed
  if (parsed.hasSemanticIntent) {
    if (passedTemperature && passedMedia && passedMaterial && passedPressure && passedCategory) {
      return {
        matches: true,
        score: Math.min(100, score + 40),
        matchedAttributes
      };
    }
  }

  // Fallback: Check if majority of non-stopword tokens match
  if (parsed.semanticTokens.length > 0) {
    let matchedTokenCount = 0;
    for (const token of parsed.semanticTokens) {
      if (fullText.includes(token)) {
        matchedTokenCount++;
      }
    }

    // If query has multiple words, require high token coverage (at least 75% or all meaningful tokens)
    const ratio = matchedTokenCount / parsed.semanticTokens.length;
    if (ratio >= 0.75 || (parsed.semanticTokens.length <= 2 && matchedTokenCount === parsed.semanticTokens.length)) {
      return {
        matches: true,
        score: Math.round(ratio * 80),
        matchedAttributes: [...matchedAttributes, `${matchedTokenCount}/${parsed.semanticTokens.length} từ khóa phù hợp`]
      };
    }
  }

  return {
    matches: false,
    score: 0,
    matchedAttributes: []
  };
}
