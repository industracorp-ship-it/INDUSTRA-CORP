import { ProjectRecord, ProjectIndustry, ProjectSuppliedValve } from '../types/valve';

/**
 * Intelligent AI Project Article & Dossier Generator
 * Automatically analyzes project name from customer orders or admin input,
 * synthesizes engineering scope, identifies industry sector, investor profile,
 * selects appropriate valve packages from authorized partner brands (UTD, VYC, Shield, JMV, JC, Tyco),
 * and drafts a professional technical case study ready for live publication.
 */

interface SynthesizeProjectParams {
  projectName: string;
  customerCompany?: string;
  contactPerson?: string;
  location?: string;
  orderNotes?: string;
  selectedValvesSummary?: string[];
  year?: number;
}

export function synthesizeProjectFromOrder(params: SynthesizeProjectParams): ProjectRecord {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const rawName = params.projectName.trim();
  const nameLower = rawName.toLowerCase();

  // 1. Sector Detection based on project keywords
  let industry: ProjectIndustry = 'hvac_bldg';
  let industryLabel = 'Tòa nhà thương mại & Cơ điện M&E';
  let industryLabelEn = 'Commercial Building & MEP';
  let defaultBrands: string[] = ['Johnson Controls', 'Shield Valve UK', 'UTD'];

  if (nameLower.includes('dầu') || nameLower.includes('khí') || nameLower.includes('oil') || nameLower.includes('gas') || nameLower.includes('lng') || nameLower.includes('lọc')) {
    industry = 'oil_gas';
    industryLabel = 'Dầu khí & Hóa chất công nghiệp';
    industryLabelEn = 'Oil, Gas & Petrochemicals';
    defaultBrands = ['UTD', 'JMV-Korea', 'VYC-Spain'];
  } else if (nameLower.includes('nhiệt điện') || nameLower.includes('thủy điện') || nameLower.includes('điện') || nameLower.includes('power') || nameLower.includes('năng lượng') || nameLower.includes('solar') || nameLower.includes('wind')) {
    industry = 'power_energy';
    industryLabel = 'Nhiệt điện & Năng lượng tái tạo';
    industryLabelEn = 'Power Generation & Renewable Energy';
    defaultBrands = ['VYC-Spain', 'UTD', 'JMV-Korea'];
  } else if (nameLower.includes('pccc') || nameLower.includes('cháy') || nameLower.includes('cứu hỏa') || nameLower.includes('fire') || nameLower.includes('sprinkler')) {
    industry = 'fire_protection';
    industryLabel = 'Phòng cháy chữa cháy (PCCC UL/FM)';
    industryLabelEn = 'Fire Protection & UL/FM Safety';
    defaultBrands = ['Tyco', 'Shield Valve UK', 'UTD'];
  } else if (nameLower.includes('sữa') || nameLower.includes('bia') || nameLower.includes('thực phẩm') || nameLower.includes('dược') || nameLower.includes('f&b') || nameLower.includes('food') || nameLower.includes('pharma')) {
    industry = 'fnb_pharma';
    industryLabel = 'Thực phẩm, Đồ uống & Dược phẩm';
    industryLabelEn = 'Food, Beverage & Pharmaceutical';
    defaultBrands = ['UTD', 'VYC-Spain'];
  } else if (nameLower.includes('nước') || nameLower.includes('water') || nameLower.includes('thải') || nameLower.includes('xử lý')) {
    industry = 'water_utility';
    industryLabel = 'Cấp thoát nước & Xử lý nước thải';
    industryLabelEn = 'Water Supply & Wastewater Treatment';
    defaultBrands = ['Shield Valve UK', 'UTD'];
  } else if (nameLower.includes('thép') || nameLower.includes('xi măng') || nameLower.includes('gang') || nameLower.includes('nhà máy') || nameLower.includes('xưởng') || nameLower.includes('khu công nghiệp')) {
    industry = 'heavy_industry';
    industryLabel = 'Công nghiệp nặng & Luyện kim chế tạo';
    industryLabelEn = 'Heavy Industry & Manufacturing';
    defaultBrands = ['UTD', 'VYC-Spain', 'Shield Valve UK'];
  }

  // 2. Synthesize Investor & Contractor
  const investor = params.customerCompany && params.customerCompany.trim().length > 3
    ? params.customerCompany.trim()
    : (nameLower.includes('vin') ? 'Tập đoàn Vingroup'
      : nameLower.includes('lotte') ? 'Tập đoàn Lotte Properties'
      : nameLower.includes('sun') ? 'Tập đoàn Sun Group'
      : nameLower.includes('hòa phát') ? 'Tập đoàn Hòa Phát'
      : nameLower.includes('petro') || nameLower.includes('pvn') ? 'Tập đoàn Dầu khí Việt Nam (PetroVietnam)'
      : nameLower.includes('evn') ? 'Tập đoàn Điện lực Việt Nam (EVN)'
      : `Ban Quản Lý Dự Án ${rawName}`);

  const contractor = params.customerCompany ? `${params.customerCompany} / Tổng thầu EPC` : 'Liên danh Tổng thầu Xây Lắp Cơ Điện & M&E EPC';
  const location = params.location && params.location.trim().length > 2
    ? params.location.trim()
    : 'Khu Công Nghiệp Trọng Điểm, Việt Nam';

  // 3. Synthesize Valve Bills of Materials
  const suppliedValves: ProjectSuppliedValve[] = [];
  if (industry === 'oil_gas') {
    suppliedValves.push({
      brand: 'UTD',
      valveType: 'Van bi thép đúc A216 WCB / Inox 316 API 6D Class 300/600',
      quantity: '350 bộ',
      specs: 'DN50 - DN250, Fire-safe API 607, bệ kim loại tôi cứng Stellite'
    });
    suppliedValves.push({
      brand: 'VYC-Spain',
      valveType: 'Van an toàn hơi nóng xả áp Full Lift Model 096 Tây Ban Nha',
      quantity: '60 bộ',
      specs: 'DN50xDN80 đến DN100xDN150, PN40, Chứng chỉ CE/TUV'
    });
    suppliedValves.push({
      brand: 'JMV-Korea',
      valveType: 'Van rèn áp lực cao A105N/F316L Class 800 hàn đối đầu BW',
      quantity: '180 bộ',
      specs: 'DN15 - DN80, Tiêu chuẩn API 602'
    });
  } else if (industry === 'fire_protection') {
    suppliedValves.push({
      brand: 'Tyco',
      valveType: 'Van tràn ngập Deluge DV-5A & Van báo động Sprinkler Alarm Valve',
      quantity: '45 cụm',
      specs: 'DN100 - DN200, Tiêu chuẩn UL Listed / FM Approved'
    });
    suppliedValves.push({
      brand: 'Shield Valve UK',
      valveType: 'Van cổng tín hiệu OS&Y & Van bướm PCCC kèm công tắc giám sát',
      quantity: '380 bộ',
      specs: 'DN65 - DN250, Áp lực 300 PSI, Chuẩn NFPA 13'
    });
    suppliedValves.push({
      brand: 'UTD',
      valveType: 'Van một chiều lá lật giảm chấn chống búa nước',
      quantity: '75 bộ',
      specs: 'DN100 - DN300, PN16, Đệm cao su EPDM'
    });
  } else if (industry === 'hvac_bldg') {
    suppliedValves.push({
      brand: 'Johnson Controls',
      valveType: 'Van điều khiển cân bằng chênh áp độc lập PICV & Động cơ Actuator Modbus',
      quantity: '420 bộ',
      specs: 'DN32 - DN150, Điều khiển tuyến tính 0-10VDC'
    });
    suppliedValves.push({
      brand: 'Shield Valve UK',
      valveType: 'Van bướm tay gạt / tay quay gioăng cao su EPDM đạt chuẩn WRAS',
      quantity: '850 bộ',
      specs: 'DN50 - DN350, PN16 Wafer/Lug type'
    });
    suppliedValves.push({
      brand: 'UTD',
      valveType: 'Y lọc rác gang cầu và van một chiều cánh bướm lò xo kép',
      quantity: '260 bộ',
      specs: 'DN65 - DN300, Lưới lọc Inox 304'
    });
  } else {
    suppliedValves.push({
      brand: 'UTD',
      valveType: 'Van bi & van bướm công nghiệp đa dụng UTD Heavy Duty',
      quantity: '500 bộ',
      specs: 'DN25 - DN300, PN16/PN25, ISO 5208 Rate A'
    });
    suppliedValves.push({
      brand: defaultBrands[0],
      valveType: 'Van công nghệ chuyên dụng nhập khẩu chính hãng',
      quantity: '120 bộ',
      specs: 'Đầy đủ CO/CQ và Mill Test Certificate 3.1'
    });
  }

  // 4. Contract Value Synthesizer
  const randomVal = (Math.floor(Math.random() * 25) + 8).toFixed(1);
  const contractValueVnd = `${randomVal} Tỷ VNĐ`;

  const projectYear = params.year || currentYear;
  const isOngoing = projectYear >= currentYear;
  const completionDate = isOngoing
    ? `Tháng ${currentMonth < 10 ? '0' + currentMonth : currentMonth}/${currentYear} (Hiện tại - Đang thi công & Cấp hàng)`
    : `Năm ${projectYear}`;

  // 5. Synthesize Detailed Technical Case Study Article
  const articleVi = `Công trình "${rawName}" là một trong những dự án quy mô trọng điểm được tiếp nhận vào hệ thống hồ sơ kỹ thuật của UTD & Industracorp trong giai đoạn ${projectYear}.
Dưới sự giám sát kỹ thuật của chủ đầu tư ${investor} và tổng thầu ${contractor}, hệ thống đường ống và điều khiển dòng chảy đòi hỏi các giải pháp van cơ điện đạt độ tin cậy tuyệt đối:
1. Đảm bảo 100% các dòng van cung cấp từ UTD và đối tác ủy quyền (${defaultBrands.join(', ')}) đạt chứng chỉ xuất xứ CO/CQ, Mill Test Report 3.1 và thử áp lực thủy tĩnh không rò rỉ (Zero Leakage ISO 5208 Rate A).
2. Tối ưu hóa tổn thất áp suất trên đường ống, nâng cao hiệu suất năng lượng và kéo dài tuổi thọ vận hành thiết bị trên 15 năm.
3. Cung ứng đúng tiến độ công trình, có chuyên gia kỹ thuật hỗ trợ giám sát lắp đặt và nghiệm thu tại công trường ${location}.
Hiện tại hồ sơ dự án đã được tự động lưu trữ và đồng bộ vào cơ sở dữ liệu năng lực nhà thầu quốc gia.`;

  const articleEn = `The project "${rawName}" represents a premier engineering reference incorporated into the UTD & Industracorp portfolio for ${projectYear}.
Under the project execution by ${investor} and EPC partner ${contractor}, the piping flow control package mandated strict certifications:
1. Turnkey supply of verified valves from authorized brands (${defaultBrands.join(', ')}) with full Mill Test 3.1 certificates, hydro testing and zero bubble-tight leakage.
2. Minimized head loss and optimized thermal efficiency engineered for a service lifespan exceeding 15 years.
3. Prompt on-site engineering dispatch and commissioning support at ${location}.
This project dossier is automatically synced into the enterprise track record database.`;

  return {
    id: `proj-auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: rawName,
    nameEn: `${rawName} (Engineered Valve Supply)`,
    year: projectYear,
    completionDate,
    isOngoing,
    industry,
    industryLabel,
    industryLabelEn,
    clientInvestor: investor,
    clientInvestorEn: investor,
    epcContractor: contractor,
    location,
    contractValueVnd,
    brandsUsed: defaultBrands,
    suppliedValves,
    summary: `Cung cấp trọn gói thiết bị van công nghiệp, PCCC và hệ thống điều khiển tự động cho ${rawName}. Tổng giá trị gói thầu ${contractValueVnd}.`,
    summaryEn: `Engineered supply of industrial valves, HVAC controls, and certified fire protection package for ${rawName}. Total contract scale ${contractValueVnd}.`,
    articleContent: articleVi,
    articleContentEn: articleEn,
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    orderReference: params.orderNotes || `Đơn hàng tự động ${new Date().toLocaleDateString('vi-VN')}`,
    createdAt: new Date().toISOString()
  };
}
