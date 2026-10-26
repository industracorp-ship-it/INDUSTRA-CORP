import { ValveProduct, SupportedLanguage } from '../types/valve';

export interface SeoIssue {
  type: 'critical' | 'warning' | 'good';
  field: 'metaTitle' | 'metaDescription' | 'targetKeywords' | 'technicalTags';
  messageVi: string;
  messageEn: string;
  recommendationVi: string;
  recommendationEn: string;
}

export interface ProductSeoAuditResult {
  productId: string;
  productCode: string;
  productName: string;
  seoScore: number; // 0 - 100
  status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  issues: SeoIssue[];
  recommendedTitleVi: string;
  recommendedTitleEn: string;
  recommendedDescriptionVi: string;
  recommendedDescriptionEn: string;
  recommendedKeywords: string[];
  recommendedKeywordsEn: string[];
  searchIntent: string;
  searchIntentEn: string;
  desktopPreviewSnippet: {
    title: string;
    url: string;
    description: string;
  };
  desktopPreviewSnippetEn: {
    title: string;
    url: string;
    description: string;
  };
}

const HIGH_VALUE_TECH_KEYWORDS = [
  'ASME B16.34', 'ISO 5208', 'API 598', 'API 6D', 'API 607', 'UL/FM', 'BS EN 1092',
  'PN16', 'PN25', 'PN40', 'Class 150', 'Class 300', '300 PSI',
  'CF8M', 'Inox 316', 'Inox 304', 'WCB', 'Gang cầu', 'Ductile Iron', 'Thép đúc',
  'Mặt bích', 'Flanged', 'Kẹp bích', 'Wafer', 'Grooved', 'Ngàm rãnh',
  'PCCC', 'Fire Protection', 'Chiller', 'HVAC', 'Lò hơi', 'Steam', 'Cấp thoát nước',
  'Zero Leakage', 'Bubble-Tight', 'Rate A'
];

/**
 * Audits a single valve product metadata for technical SEO performance
 */
export function auditProductSeo(product: ValveProduct, lang: SupportedLanguage = 'vi'): ProductSeoAuditResult {
  const issues: SeoIssue[] = [];
  let score = 100;

  const title = product.seoMetadata?.metaTitle || `${product.name} ${product.code} - UTD`;
  const desc = product.seoMetadata?.metaDescription || product.description || '';
  const keywords = product.seoMetadata?.targetKeywords || [];

  // 1. Audit Title
  if (!title || title.length < 35) {
    score -= 20;
    issues.push({
      type: 'critical',
      field: 'metaTitle',
      messageVi: `Tiêu đề quá ngắn (${title?.length || 0} ký tự). Khuyến nghị 50-65 ký tự.`,
      messageEn: `Meta title is too short (${title?.length || 0} chars). Recommended 50-65 chars.`,
      recommendationVi: 'Thêm tên thương hiệu, tiêu chuẩn áp suất (PN16/Class 150) và vật liệu chính vào tiêu đề.',
      recommendationEn: 'Include brand, pressure rating (PN16/Class 150) and primary metallurgy in title.'
    });
  } else if (title.length > 70) {
    score -= 10;
    issues.push({
      type: 'warning',
      field: 'metaTitle',
      messageVi: `Tiêu đề hơi dài (${title.length} ký tự), có thể bị cắt bớt trên Google Tìm Kiếm.`,
      messageEn: `Title is lengthy (${title.length} chars) and may truncate on Google SERP.`,
      recommendationVi: 'Rút gọn lại còn dưới 65 ký tự để hiển thị đầy đủ trên màn hình di động.',
      recommendationEn: 'Shorten to under 65 chars for optimal mobile SERP rendering.'
    });
  } else {
    issues.push({
      type: 'good',
      field: 'metaTitle',
      messageVi: `Độ dài tiêu đề đạt chuẩn (${title.length} ký tự).`,
      messageEn: `Optimal title length (${title.length} chars).`,
      recommendationVi: 'Tiêu đề hiển thị rõ ràng trên mọi kết quả tìm kiếm.',
      recommendationEn: 'Displays cleanly on Google Desktop and Mobile.'
    });
  }

  // 2. Audit Description
  if (!desc || desc.length < 90) {
    score -= 25;
    issues.push({
      type: 'critical',
      field: 'metaDescription',
      messageVi: `Mô tả kỹ thuật quá ngắn (${desc.length} ký tự). Khuyến nghị 130-160 ký tự.`,
      messageEn: `Technical description too brief (${desc.length} chars). Recommended 130-160 chars.`,
      recommendationVi: 'Bổ sung ứng dụng môi chất (PCCC/HVAC/Steam), độ kín ISO 5208 và nguồn gốc xuất xứ.',
      recommendationEn: 'Add media suitability (Fire/HVAC/Steam), ISO 5208 sealing class and origin.'
    });
  } else if (desc.length > 170) {
    score -= 10;
    issues.push({
      type: 'warning',
      field: 'metaDescription',
      messageVi: `Mô tả dài (${desc.length} ký tự), Google sẽ hiển thị dấu "..." ở cuối.`,
      messageEn: `Description exceeds 170 chars and will truncate with ellipsis.`,
      recommendationVi: 'Chỉnh sửa cô đọng trong khoảng 150-160 ký tự.',
      recommendationEn: 'Condense core engineering USP into 150-160 chars.'
    });
  } else {
    issues.push({
      type: 'good',
      field: 'metaDescription',
      messageVi: `Độ dài mô tả xuất sắc (${desc.length} ký tự).`,
      messageEn: `Ideal description length (${desc.length} chars).`,
      recommendationVi: 'Đáp ứng tốt định dạng đoạn trích snippet của Google.',
      recommendationEn: 'Perfect fit for Google rich snippet display.'
    });
  }

  // 3. Technical Keywords Density Scan
  const textCorpus = `${title} ${desc} ${(product.standards || []).join(' ')} ${product.material} ${product.pressure}`.toLowerCase();
  const matchedKeywords = HIGH_VALUE_TECH_KEYWORDS.filter(kw => textCorpus.includes(kw.toLowerCase()));

  if (matchedKeywords.length < 3) {
    score -= 20;
    issues.push({
      type: 'critical',
      field: 'technicalTags',
      messageVi: `Thiếu từ khóa kỹ thuật chuyên ngành quan trọng (mới có ${matchedKeywords.length}/10 tiêu chí).`,
      messageEn: `Lacks essential industrial keywords (only ${matchedKeywords.length} matched).`,
      recommendationVi: `Bổ sung các thuật ngữ như: ASME B16.34, ISO 5208 Rate A, PN16, ${product.material.slice(0, 15)}.`,
      recommendationEn: `Incorporate terms like ASME B16.34, ISO 5208 Rate A, PN16, ${product.material.slice(0, 15)}.`
    });
  } else if (matchedKeywords.length < 6) {
    score -= 10;
    issues.push({
      type: 'warning',
      field: 'technicalTags',
      messageVi: `Mật độ từ khóa kỹ thuật ở mức khá (${matchedKeywords.length} từ khóa chuẩn).`,
      messageEn: `Moderate technical keyword density (${matchedKeywords.length} terms matched).`,
      recommendationVi: 'Bổ sung thêm tiêu chuẩn kiểm tra áp lực thủy tĩnh hoặc ứng dụng PCCC/HVAC.',
      recommendationEn: 'Include hydrostatic testing standards or specific MEP system tags.'
    });
  } else {
    issues.push({
      type: 'good',
      field: 'technicalTags',
      messageVi: `Mật độ từ khóa kỹ thuật rất phong phú (${matchedKeywords.length} từ khóa chuyên sâu).`,
      messageEn: `High technical keyword richness (${matchedKeywords.length} terms detected).`,
      recommendationVi: 'Được ưu tiên xếp hạng cao trong tìm kiếm tìm van của kỹ sư cơ điện.',
      recommendationEn: 'Highly ranked for B2B engineering procurement searches.'
    });
  }

  // 4. Target Keywords metadata
  if (!keywords || keywords.length < 3) {
    score -= 15;
    issues.push({
      type: 'warning',
      field: 'targetKeywords',
      messageVi: `Chưa cấu hình danh sách từ khóa mục tiêu (Target Keywords).`,
      messageEn: `Missing designated Target Keyword tags.`,
      recommendationVi: 'Nhấn "Tối Ưu Tự Động" để nạp ngay bộ 6-8 từ khóa tìm kiếm vàng.',
      recommendationEn: 'Click "Auto-Optimize" to generate targeted technical keywords.'
    });
  }

  // Ensure score is clamped between 0 and 100
  score = Math.max(25, Math.min(100, score));

  let status: 'excellent' | 'good' | 'needs_improvement' | 'poor' = 'good';
  if (score >= 90) status = 'excellent';
  else if (score >= 75) status = 'good';
  else if (score >= 50) status = 'needs_improvement';
  else status = 'poor';

  // AI-generated suggested metadata
  const brandPrefix = product.brand || 'UTD';
  const sizeShort = product.sizeRange ? product.sizeRange.split('(')[0].trim() : 'DN50-DN300';
  const recTitleVi = `${product.name} ${product.code} [${product.pressure}] | ${brandPrefix} Valve`;
  const recTitleEn = `${product.nameEn || product.name} ${product.code} [${product.pressure}] | ${brandPrefix}`;
  
  const recDescVi = `Van ${product.name} (${product.code}) chuẩn ${product.standards?.[0] || 'ASME B16.34'}, vật liệu ${product.material}, cấp áp lực ${product.pressure}. Kín khít ISO 5208 Rate A, xuất xưởng kiểm định 100%, sẵn kho UTD Industracorp.`;
  const recDescEn = `High-grade ${product.nameEn || product.name} (${product.code}) per ${product.standards?.[0] || 'ASME B16.34'}. Metallurgy: ${product.materialEn || product.material}, rating ${product.pressure}. ISO 5208 Rate A tested, ready stock at UTD Industracorp.`;

  const recKeywords = [
    product.name.toLowerCase(),
    `${product.code.toLowerCase()} van`,
    `van công nghiệp ${brandPrefix.toLowerCase()}`,
    `${product.category} valve vietnam`,
    `${product.pressure.toLowerCase()} ${product.material.toLowerCase()}`,
    'tiêu chuẩn asme b16.34',
    'chứng chỉ co cq iso 5208',
    product.systemGroup === 'firefighting' ? 'van pccc ul fm' : (product.systemGroup === 'steam' ? 'van hơi nóng lò hơi' : 'van chiller hvac')
  ];

  const recKeywordsEn = [
    (product.nameEn || product.name).toLowerCase(),
    `${product.code.toLowerCase()} valve`,
    `${brandPrefix.toLowerCase()} industrial valves`,
    `${product.category} valve manufacturer`,
    `${product.pressure.toLowerCase()} ${product.materialEn || product.material}`.toLowerCase(),
    'asme b16.34 standard',
    'iso 5208 bubble tight test',
    product.systemGroup === 'firefighting' ? 'ul fm fire valve' : (product.systemGroup === 'steam' ? 'boiler steam valve 350C' : 'hvac chiller valve')
  ];

  const searchIntentVi = product.systemGroup === 'firefighting' 
    ? 'Mua sắm van PCCC dự án & thẩm duyệt PCCC' 
    : (product.systemGroup === 'steam' ? 'Đấu thầu van hơi lò hơi chịu nhiệt cao' : 'Báo giá van MEP Chiller cấp thoát nước');

  const searchIntentEn = product.systemGroup === 'firefighting'
    ? 'UL/FM Fire Protection Procurement & Engineering Specs'
    : (product.systemGroup === 'steam' ? 'High Temperature Steam Boiler Tender Requirements' : 'MEP Chiller & Potable Water RFQ Engineering');

  return {
    productId: product.id,
    productCode: product.code,
    productName: product.name,
    seoScore: score,
    status,
    issues,
    recommendedTitleVi: recTitleVi,
    recommendedTitleEn: recTitleEn,
    recommendedDescriptionVi: recDescVi,
    recommendedDescriptionEn: recDescEn,
    recommendedKeywords: recKeywords,
    recommendedKeywordsEn: recKeywordsEn,
    searchIntent: searchIntentVi,
    searchIntentEn: searchIntentEn,
    desktopPreviewSnippet: {
      title: recTitleVi,
      url: `https://industracorp.com/valves/${product.code.toLowerCase()}`,
      description: recDescVi
    },
    desktopPreviewSnippetEn: {
      title: recTitleEn,
      url: `https://industracorp.com/en/valves/${product.code.toLowerCase()}`,
      description: recDescEn
    }
  };
}

/**
 * Batch audit all products in the catalog
 */
export function auditAllProductsSeo(products: ValveProduct[], lang: 'vi' | 'en' = 'vi') {
  const results = products.map(p => auditProductSeo(p, lang));
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.seoScore, 0) / (results.length || 1));
  const criticalCount = results.filter(r => r.status === 'poor' || r.status === 'needs_improvement').length;
  const excellentCount = results.filter(r => r.status === 'excellent').length;

  return {
    results,
    avgScore,
    criticalCount,
    excellentCount,
    totalCount: products.length
  };
}
