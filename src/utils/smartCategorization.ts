import { ValveCategory, SystemGroup, CategoryItem } from '../types/valve';
import { DEFAULT_CATEGORIES } from '../data/categoryData';

export interface SmartCategorizationInput {
  name: string;
  nameEn?: string;
  code?: string;
  material: string;
  pressure: string;
  tempRange?: string;
  connection?: string;
  applicableMedia?: string[];
  mediaApplications?: string;
  mediaApplicationsEn?: string;
  description?: string;
  standardsText?: string;
  currentCategory?: ValveCategory;
  currentSystemGroup?: SystemGroup;
}

export interface SmartCategorizationResult {
  suggestedCategory: ValveCategory;
  suggestedCategoryLabel: string;
  suggestedCategoryLabelEn: string;
  suggestedSystemGroup: SystemGroup;
  suggestedSystemGroupLabel: string;
  confidence: number; // 0 - 100
  engineeringRationale: string;
  detectedSignals: {
    pressureRatingCategory: string;
    primaryMediaCategory: string;
    metallurgyProfile: string;
    temperatureProfile: string;
    connectionType: string;
  };
  keyDrivers: string[];
  alternativeSuggestions: Array<{
    category: ValveCategory;
    systemGroup: SystemGroup;
    label: string;
    confidence: number;
    reason: string;
  }>;
}

const SYSTEM_GROUP_LABELS: Record<SystemGroup, { vi: string; en: string }> = {
  all: { vi: 'Tất Cả Hệ Thống', en: 'All Systems' },
  water: { vi: 'Water (Cấp Thoát Nước & Xử Lý Nước)', en: 'Water Supply & Wastewater Treatment' },
  firefighting: { vi: 'Fire Fighting (Hệ PCCC Cứu Hỏa UL/FM)', en: 'Fire Protection (UL/FM Standards)' },
  steam: { vi: 'Steam (Hệ Hơi Nóng & Lò Hơi Áp Lực)', en: 'Steam & High-Pressure Boilers' },
  hvac: { vi: 'HVAC (Chiller & Điều Hòa Trung Tâm)', en: 'HVAC & Chiller Plant Systems' },
  oilgas: { vi: 'Oil & Gas (Dầu Khí & Hóa Chất Hóa Dầu)', en: 'Oil, Gas & Petrochemical' },
  gas_cryogenic: { vi: 'Gas & Cryogenic (Khí Hóa Lỏng / Âm Sâu / LNG)', en: 'Cryogenic & Industrial Gases' },
  instrument: { vi: 'Instrument (Đo Lường & Tự Động Hóa)', en: 'Instrumentation & Process Control' },
};

export function analyzeSmartCategorization(
  input: SmartCategorizationInput,
  categoryCatalog: CategoryItem[] = DEFAULT_CATEGORIES
): SmartCategorizationResult {
  const normName = (input.name || '').toLowerCase();
  const normNameEn = (input.nameEn || '').toLowerCase();
  const normMaterial = (input.material || '').toLowerCase();
  const normPressure = (input.pressure || '').toLowerCase();
  const normTemp = (input.tempRange || '').toLowerCase();
  const normConn = (input.connection || '').toLowerCase();
  const normDesc = (input.description || '').toLowerCase();
  const normStd = (input.standardsText || '').toLowerCase();
  
  const allMedia = [
    ...(input.applicableMedia || []),
    input.mediaApplications || '',
    input.mediaApplicationsEn || ''
  ].join(' ').toLowerCase();

  const combinedText = `${normName} ${normNameEn} ${normMaterial} ${normPressure} ${normTemp} ${normConn} ${normDesc} ${normStd} ${allMedia}`;

  // 1. Scan Pressure Specs
  let pressureRatingCategory = 'Standard Industrial (PN16 / Class 150)';
  let isHighPressure = false;
  let isFirePressureRating = false;

  if (normPressure.includes('class 2500') || normPressure.includes('class 1500') || normPressure.includes('pn100') || normPressure.includes('pn160')) {
    pressureRatingCategory = 'Ultra High Pressure (Class 1500-2500 / PN100+)';
    isHighPressure = true;
  } else if (normPressure.includes('class 900') || normPressure.includes('class 600') || normPressure.includes('pn63') || normPressure.includes('pn64')) {
    pressureRatingCategory = 'High Pressure (Class 600-900 / PN63)';
    isHighPressure = true;
  } else if (normPressure.includes('class 300') || normPressure.includes('pn40') || normPressure.includes('pn25')) {
    pressureRatingCategory = 'Medium-High Pressure (Class 300 / PN25-PN40)';
  } else if (normPressure.includes('300 psi') || normPressure.includes('175 psi') || normPressure.includes('250 psi') || normStd.includes('ul') || normStd.includes('fm')) {
    pressureRatingCategory = 'PCCC Fire Rated (175 - 300 PSI UL/FM)';
    isFirePressureRating = true;
  } else if (normPressure.includes('pn10') || normPressure.includes('pn16')) {
    pressureRatingCategory = 'Nominal Water / HVAC Pressure (PN10 - PN16)';
  }

  // 2. Scan Metallurgy Profile
  let metallurgyProfile = 'General Metallurgy';
  let isStainless = false;
  let isCastSteel = false;
  let isDuctileIron = false;
  let isBronze = false;

  if (normMaterial.includes('316') || normMaterial.includes('cf8m') || normMaterial.includes('inox') || normMaterial.includes('stainless')) {
    metallurgyProfile = 'Austenitic Stainless Steel (CF8M / SS316)';
    isStainless = true;
  } else if (normMaterial.includes('304') || normMaterial.includes('cf8')) {
    metallurgyProfile = 'Stainless Steel (CF8 / SS304)';
    isStainless = true;
  } else if (normMaterial.includes('wcb') || normMaterial.includes('a105') || normMaterial.includes('thép đúc') || normMaterial.includes('cast steel') || normMaterial.includes('thép rèn')) {
    metallurgyProfile = 'Carbon Cast/Forged Steel (WCB / A105)';
    isCastSteel = true;
  } else if (normMaterial.includes('gang cầu') || normMaterial.includes('ggg50') || normMaterial.includes('ductile') || normMaterial.includes('a536') || normMaterial.includes('qt450')) {
    metallurgyProfile = 'Ductile Iron (GGG50 / ASTM A536)';
    isDuctileIron = true;
  } else if (normMaterial.includes('gang xám') || normMaterial.includes('gg25') || normMaterial.includes('cast iron')) {
    metallurgyProfile = 'Cast Iron (GG25 / FC200)';
  } else if (normMaterial.includes('bronze') || normMaterial.includes('đồng') || normMaterial.includes('b62') || normMaterial.includes('brass')) {
    metallurgyProfile = 'Copper Alloy / Marine Bronze (C95800 / B62)';
    isBronze = true;
  }

  // 3. Scan Media & Temperature Profile
  let primaryMediaCategory = 'General Fluids';
  let temperatureProfile = 'Ambient (-10°C to +80°C)';
  let isSteam = false;
  let isFire = false;
  let isWater = false;
  let isHvac = false;
  let isOilGas = false;
  let isCryo = false;
  let isViscousSlurry = false;
  let isInstrument = false;

  if (combinedText.includes('hơi nóng') || combinedText.includes('steam') || combinedText.includes('lò hơi') || combinedText.includes('boiler') || combinedText.includes('ngưng tụ') || combinedText.includes('condensate')) {
    primaryMediaCategory = 'Steam & High Temperature Vapor';
    isSteam = true;
  } else if (combinedText.includes('pccc') || combinedText.includes('chữa cháy') || combinedText.includes('cứu hỏa') || combinedText.includes('sprinkler') || combinedText.includes('foam') || normStd.includes('ul') || normStd.includes('fm')) {
    primaryMediaCategory = 'Fire Protection Water / Foam (UL/FM)';
    isFire = true;
  } else if (combinedText.includes('chiller') || combinedText.includes('nước lạnh') || combinedText.includes('hvac') || combinedText.includes('điều hòa') || combinedText.includes('fcu') || combinedText.includes('ahu')) {
    primaryMediaCategory = 'Chilled Water & HVAC Closed Circuit';
    isHvac = true;
  } else if (combinedText.includes('dầu khí') || combinedText.includes('xăng dầu') || combinedText.includes('hydrocarbon') || combinedText.includes('hóa chất') || combinedText.includes('petroleum') || combinedText.includes('nace')) {
    primaryMediaCategory = 'Hydrocarbons & Petrochemical Fluids';
    isOilGas = true;
  } else if (combinedText.includes('lng') || combinedText.includes('cryogenic') || combinedText.includes('âm sâu') || combinedText.includes('-196') || combinedText.includes('nitơ lỏng')) {
    primaryMediaCategory = 'Cryogenic Liquefied Gases (LNG / LOX)';
    isCryo = true;
  } else if (combinedText.includes('bùn') || combinedText.includes('bột giấy') || combinedText.includes('slurry') || combinedText.includes('pulp') || combinedText.includes('chất rắn lơ lửng')) {
    primaryMediaCategory = 'High Solid Content / Slurry & Pulp';
    isViscousSlurry = true;
  } else if (combinedText.includes('nước sạch') || combinedText.includes('cấp thoát nước') || combinedText.includes('nước thải') || combinedText.includes('potable water')) {
    primaryMediaCategory = 'Municipal Clean / Wastewater';
    isWater = true;
  }

  if (normTemp.includes('-196') || normTemp.includes('-200') || normTemp.includes('cryo')) {
    temperatureProfile = 'Ultra Cryogenic (-196°C to +80°C)';
  } else if (normTemp.includes('400') || normTemp.includes('425') || normTemp.includes('450') || normTemp.includes('500') || normTemp.includes('550')) {
    temperatureProfile = 'Extreme Thermal Heat (+350°C to +550°C)';
  } else if (normTemp.includes('180') || normTemp.includes('200') || normTemp.includes('250') || normTemp.includes('300')) {
    temperatureProfile = 'High Temperature Steam (+180°C to +300°C)';
  } else if (normTemp.includes('-20') || normTemp.includes('-40') || normTemp.includes('-50')) {
    temperatureProfile = 'Sub-Zero Low Temperature (-50°C to +120°C)';
  }

  // 4. Detailed Valve Mechanical Classification
  const keyDrivers: string[] = [];
  let suggestedCat: ValveCategory = 'ball';
  let suggestedSys: SystemGroup = 'water';
  let confidence = 85;

  // Pattern detection by priority:
  if (normName.includes('dao') || normNameEn.includes('knife') || isViscousSlurry || normDesc.includes('cổng dao')) {
    suggestedCat = 'knife_gate';
    suggestedSys = 'water';
    confidence = 96;
    keyDrivers.push('Nhận diện lưỡi dao cắt bùn / slurry / bột giấy với kết cấu chống kẹt');
    keyDrivers.push(`Môi chất ${primaryMediaCategory} yêu cầu van cổng dao chuyên dụng`);
  } else if (normName.includes('cân bằng') || normNameEn.includes('balancing') || normName.includes('picv')) {
    suggestedCat = 'balancing';
    suggestedSys = 'hvac';
    confidence = 97;
    keyDrivers.push('Dòng van hiệu chỉnh lưu lượng tĩnh/động chuyên cho hệ Chiller & HVAC');
    keyDrivers.push('Đặc tuyến đo áp chênh lệch Kvs chuẩn xác');
  } else if (normName.includes('an toàn') || normNameEn.includes('safety') || normName.includes('xả áp') || normDesc.includes('van an toàn')) {
    suggestedCat = 'safety_valve';
    suggestedSys = isSteam ? 'steam' : (isOilGas ? 'oilgas' : 'steam');
    confidence = 98;
    keyDrivers.push('Cơ chế lò xo tự động xả quá áp bảo vệ an toàn đường ống');
    keyDrivers.push(`Áp suất làm việc ${normPressure || 'chuẩn'} cùng tiêu chuẩn an toàn ASME/API`);
  } else if (normName.includes('giảm áp') || normNameEn.includes('reducing') || normName.includes('prv')) {
    suggestedCat = 'prv';
    suggestedSys = isSteam ? 'steam' : (isFire ? 'firefighting' : 'water');
    confidence = 96;
    keyDrivers.push('Van điều áp thủy lực / pilot hạ áp suất đầu ra cố định');
  } else if (normName.includes('cầu') || normNameEn.includes('globe') || normName.includes('bellows') || normDesc.includes('van cầu')) {
    suggestedCat = 'globe';
    suggestedSys = isSteam ? 'steam' : (isOilGas ? 'oilgas' : 'steam');
    confidence = 95;
    keyDrivers.push('Cấu tạo hình cầu điều tiết dòng chảy và đóng ngắt áp suất cao');
    if (isSteam) keyDrivers.push('Khả năng chịu nhiệt độ hơi nóng cao (>200°C) tối ưu');
  } else if (normName.includes('bướm') || normNameEn.includes('butterfly')) {
    suggestedCat = 'butterfly';
    if (isFire || isFirePressureRating) {
      suggestedSys = 'firefighting';
      confidence = 96;
      keyDrivers.push('Van bướm kèm công tắc giám sát tín hiệu PCCC UL/FM');
    } else if (isHvac) {
      suggestedSys = 'hvac';
      confidence = 94;
      keyDrivers.push('Van bướm đệm cao su EPDM đóng kín Bubble-Tight cho hệ Chiller');
    } else {
      suggestedSys = 'water';
      confidence = 92;
      keyDrivers.push('Van bướm thân gang/inox điều tiết và ngắt dòng nước sạch / nước làm mát');
    }
  } else if (normName.includes('một chiều') || normNameEn.includes('check') || normName.includes('lá lật') || normName.includes('bướm 2 cánh')) {
    suggestedCat = 'check';
    suggestedSys = isFire ? 'firefighting' : (isSteam ? 'steam' : (isHvac ? 'hvac' : 'water'));
    confidence = 94;
    keyDrivers.push('Chức năng tự động ngăn dòng chảy ngược chống va đập búa nước');
  } else if (normName.includes('lọc y') || normName.includes('strainer') || normName.includes('lọc rọ')) {
    suggestedCat = 'strainer';
    suggestedSys = isSteam ? 'steam' : (isHvac ? 'hvac' : 'water');
    confidence = 95;
    keyDrivers.push('Lưới lọc inox 304/316 giữ cặn bảo vệ máy bơm và đồng hồ');
  } else if (normName.includes('cổng đệm mềm') || normName.includes('resilient') || (normName.includes('cổng') && isDuctileIron && isWater)) {
    suggestedCat = 'resilient_gate';
    suggestedSys = 'water';
    confidence = 94;
    keyDrivers.push('Van cổng nêm bọc cao su EPDM chuyên dụng nước sạch, không tắc kẹt rãnh đáy');
  } else if (normName.includes('cổng') || normName.includes('gate') || normName.includes('ty nổi') || normName.includes('os&y')) {
    suggestedCat = 'gate';
    suggestedSys = (isFire || isFirePressureRating) ? 'firefighting' : (isOilGas ? 'oilgas' : 'water');
    confidence = 93;
    keyDrivers.push('Cơ cấu cửa van nâng hạ toàn phần, giảm thiểu tổn thất áp suất');
  } else if (normName.includes('khớp nối mềm') || normName.includes('flexible joint') || normName.includes('chống rung inox')) {
    suggestedCat = 'flexible_joint';
    suggestedSys = isHvac ? 'hvac' : 'water';
    confidence = 96;
    keyDrivers.push('Ruột gà inox bện lưới triệt tiêu rung động đầu đẩy máy bơm');
  } else if (normName.includes('cao su giảm chấn') || normName.includes('rubber joint')) {
    suggestedCat = 'rubber_joint';
    suggestedSys = 'water';
    confidence = 96;
    keyDrivers.push('Cầu cao su giãn nở bù trừ nhiệt và chống rung ồn đường ống');
  } else if (normName.includes('giãn nở kim loại') || normName.includes('expansion joint')) {
    suggestedCat = 'expansion_joint';
    suggestedSys = isSteam ? 'steam' : 'hvac';
    confidence = 95;
    keyDrivers.push('Khớp giãn nở kim loại 2 lớp chịu nhiệt độ và co ngót hơi nóng');
  } else if (normName.includes('xả khí') || normName.includes('air vent')) {
    suggestedCat = 'auto_air_vent';
    suggestedSys = 'water';
    confidence = 95;
    keyDrivers.push('Phao nổi xả túi khí tự động chống hiện tượng túi khí gây cản trở dòng chảy');
  } else if (normName.includes('rọ bơm') || normName.includes('foot valve') || normName.includes('luppe')) {
    suggestedCat = 'foot_valve';
    suggestedSys = 'water';
    confidence = 96;
    keyDrivers.push('Van hút một chiều đáy giếng kèm lưới lọc rác giữ mồi bơm');
  } else if (normName.includes('điện từ') || normNameEn.includes('solenoid')) {
    suggestedCat = 'solenoid';
    suggestedSys = isSteam ? 'steam' : 'water';
    confidence = 95;
    keyDrivers.push('Cuộn hút từ trường tác động đóng mở siêu nhanh trong mili-giây');
  } else if (normName.includes('tự động hóa') || normName.includes('actuator') || normName.includes('khí nén') || normName.includes('điều khiển điện')) {
    suggestedCat = 'actuator';
    suggestedSys = 'instrument';
    confidence = 94;
    keyDrivers.push('Đầu điều khiển khí nén/điện điều khiển vị trí tuyến tính hoặc On/Off');
  } else if (normName.includes('đo lường') || normName.includes('instrument') || normName.includes('công tắc dòng chảy')) {
    suggestedCat = 'instrument';
    suggestedSys = 'instrument';
    confidence = 94;
    keyDrivers.push('Thiết bị đo lường cảm biến, công tắc áp suất / dòng chảy tự động hóa');
  } else if (normName.includes('thủy lực') || normName.includes('water control') || normName.includes('phao')) {
    suggestedCat = 'water_control';
    suggestedSys = 'water';
    confidence = 93;
    keyDrivers.push('Van điều khiển thủy lực dạng màng đa chức năng cho mạng cấp nước');
  } else {
    // Default to Ball valve or infer from media & material
    suggestedCat = 'ball';
    if (isOilGas || isHighPressure) {
      suggestedSys = 'oilgas';
      confidence = 91;
      keyDrivers.push(`Vật liệu ${metallurgyProfile} và cấp áp ${pressureRatingCategory} đặc thù ngành Dầu Khí & Hóa Chất`);
    } else if (isSteam) {
      suggestedSys = 'steam';
      suggestedCat = 'globe';
      confidence = 88;
      keyDrivers.push(`Môi chất ${primaryMediaCategory} yêu cầu van cầu hơi chuyên dụng`);
    } else if (isCryo) {
      suggestedSys = 'gas_cryogenic';
      confidence = 92;
      keyDrivers.push(`Nhiệt độ âm sâu ${temperatureProfile} phù hợp hệ thống khí hóa lỏng`);
    } else {
      suggestedSys = 'water';
      confidence = 86;
      keyDrivers.push(`Cấp áp suất ${pressureRatingCategory} và môi chất ${primaryMediaCategory}`);
    }
  }

  // Refine system group based on media & fire tags
  if (isFire || isFirePressureRating) {
    if (suggestedCat === 'butterfly' || suggestedCat === 'gate' || suggestedCat === 'check' || suggestedCat === 'prv') {
      suggestedSys = 'firefighting';
      keyDrivers.push('Tiêu chuẩn phòng cháy chữa cháy UL/FM hoặc áp suất 175-300 PSI định hướng hệ PCCC');
    }
  }

  // Find labels from catalog
  const matchedCat = categoryCatalog.find((c) => c.value === suggestedCat);
  const suggestedCategoryLabel = matchedCat?.label || `${suggestedCat.toUpperCase()} Valve`;
  const suggestedCategoryLabelEn = matchedCat?.labelEn || `${suggestedCat.toUpperCase()} Valve`;
  const suggestedSystemGroupLabel = SYSTEM_GROUP_LABELS[suggestedSys]?.vi || suggestedSys;

  // Engineering rationale text
  const engineeringRationale = [
    `Hệ thống AI đã quét toàn diện cấu hình sản phẩm:`,
    `• Cấp áp suất: ${pressureRatingCategory} (Áp danh định: ${input.pressure || 'Tiêu chuẩn'})`,
    `• Vật liệu cấu tạo: ${metallurgyProfile} (Thân: ${input.material || 'Hợp kim'})`,
    `• Môi chất & nhiệt độ: ${primaryMediaCategory} (${temperatureProfile})`,
    `Kết luận: Khuyến nghị phân loại vào danh mục "${suggestedCategoryLabel}" thuộc nhóm hệ thống "${suggestedSystemGroupLabel}" với độ tin cậy cơ khí ${confidence}%.`,
  ].join('\n');

  // Alternative suggestions
  const alternatives: Array<{
    category: ValveCategory;
    systemGroup: SystemGroup;
    label: string;
    confidence: number;
    reason: string;
  }> = [];

  if (suggestedCat !== 'ball') {
    alternatives.push({
      category: 'ball',
      systemGroup: isOilGas ? 'oilgas' : 'water',
      label: 'Ball valves (Van bi inox/thép)',
      confidence: Math.max(50, confidence - 22),
      reason: 'Phù hợp nếu ứng dụng yêu cầu đóng ngắt góc 90 độ nhanh và lưu lượng thẳng',
    });
  }

  if (suggestedCat !== 'butterfly') {
    alternatives.push({
      category: 'butterfly',
      systemGroup: isFire ? 'firefighting' : (isHvac ? 'hvac' : 'water'),
      label: 'Butterfly valve (Van bướm)',
      confidence: Math.max(45, confidence - 25),
      reason: 'Lựa chọn tiết kiệm trọng lượng và diện tích cho đường kính lớn từ DN50 đến DN600',
    });
  }

  if (suggestedCat !== 'gate' && suggestedCat !== 'resilient_gate') {
    alternatives.push({
      category: isDuctileIron ? 'resilient_gate' : 'gate',
      systemGroup: isFire ? 'firefighting' : 'water',
      label: isDuctileIron ? 'Resilient gate valves (Van cổng đệm mềm)' : 'Gate valve (Van cửa ty nổi)',
      confidence: Math.max(40, confidence - 28),
      reason: 'Phù hợp cho các tuyến ống dẫn chính cần giảm thiểu triệt để tổn thất áp',
    });
  }

  return {
    suggestedCategory: suggestedCat,
    suggestedCategoryLabel,
    suggestedCategoryLabelEn,
    suggestedSystemGroup: suggestedSys,
    suggestedSystemGroupLabel,
    confidence,
    engineeringRationale,
    detectedSignals: {
      pressureRatingCategory,
      primaryMediaCategory,
      metallurgyProfile,
      temperatureProfile,
      connectionType: normConn || 'Flanged / Wafer standard',
    },
    keyDrivers,
    alternativeSuggestions: alternatives.slice(0, 2),
  };
}
