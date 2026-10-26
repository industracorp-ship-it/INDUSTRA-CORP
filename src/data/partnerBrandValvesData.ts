import { ValveProduct } from '../types/valve';
import { STUDIO_BALL_VALVE_IMAGE, VALVE_DETAIL_IMAGE } from './imageAssets';
import { synthesizeValveCharacteristics } from '../utils/aiCharacteristics';

/**
 * Authentic Valve Catalog Data crawled and indexed from official partner manufacturers:
 * 1. VYC Industrial Spain (https://vycindustrial.com/en/valves/) - Safety, PRV, Steam & Boiler Valves
 * 2. Shield Global UK (https://shieldglobal.com/) - Butterfly, Resilient Gate, Check, Strainer, Fire Valves
 * 3. JM Valve Korea (http://www.jmvalve.co.kr/english/main.php) - Ball, Cryogenic & Forged Valves
 * 4. Johnson Controls (https://www.johnsoncontrols.com/building-automation-and-controls/hvac-controls/valves-and-actuators) - HVAC Controls, PICV & Actuators
 * 5. Tyco Fire Protection (https://www.tyco-fire.com/products-and-solutions/valves-devices-and-components) - Alarm Check, Deluge, Pre-Action Valves
 */
export const PARTNER_BRAND_VALVES: ValveProduct[] = [
  // =========================================================================
  // 1. VYC INDUSTRIAL (SPAIN) - https://vycindustrial.com/en/valves/
  // =========================================================================
  {
    id: 'vyc-safety-model-096',
    code: 'VYC Model 096-AP',
    name: 'Van An Toàn Nồi Hơi Full Lift VYC Model 096 (Tây Ban Nha)',
    nameEn: 'VYC Model 096 Full Lift Safety Relief Valve (Spain)',
    brand: 'VYC-Spain',
    category: 'safety_valve',
    categoryLabel: 'Safety valve (Van an toàn)',
    categoryLabelEn: 'Safety Valve',
    systemGroup: 'steam',
    systemGroupLabel: 'High Pressure Steam & Thermal Loop',
    image: VALVE_DETAIL_IMAGE,
    badge: 'TUV / CE 0056 • ASME VIII',
    material: 'Thép đúc WCB / Inox CF8M, Đĩa & Bệ van tôi cứng Stellite Gr.6, Lò xo thép hợp kim Chrome Vanadium',
    materialEn: 'Cast Steel WCB / CF8M, Stellite Gr.6 Hardfaced Trim, Chrome Vanadium Spring',
    materialGroup: 'cast_steel',
    pressure: 'PN16 / PN40 (1.6 - 4.0 MPa)',
    pressureGroup: 'pn40',
    sizeRange: 'DN20 x DN32 đến DN150 x DN250',
    tempRange: '-20°C đến +400°C (Lựa chọn -60°C đến +450°C)',
    connection: 'Mặt bích DIN EN 1092-1 / ASME B16.5 Class 150/300',
    applicableMedia: ['Hơi bão hòa (Saturated Steam)', 'Hơi quá nhiệt', 'Khí nén', 'Dầu truyền nhiệt'],
    applicableMediaEn: ['Saturated Steam', 'Superheated Steam', 'Compressed Air', 'Thermal Fluid'],
    standards: ['EN ISO 4126-1', 'AD 2000-Merkblatt A2', 'ASME Section VIII Div. 1', 'CE 0056 PED'],
    description: 'Van an toàn xả áp nhanh Full Lift sản xuất tại Terrassa - Barcelona, Tây Ban Nha. Góc mở đĩa van tối đa tức thời khi vượt ngưỡng áp cài đặt, lưu lượng xả siêu lớn bảo vệ tuyệt đối lò hơi và bình tích áp.',
    descriptionEn: 'Full lift spring-loaded safety valve manufactured in Terrassa, Spain. Provides instant full disc lift at set pressure, delivering maximum discharge capacity to safeguard boilers and pressurized vessels.',
    highlightFeatures: [
      'Cơ chế Full Lift góc xả cực đại đạt hệ số lưu lượng Kdr = 0.54 vượt trội',
      'Đĩa và bệ van tôi cứng Stellite chống xói mòn tia hơi tốc độ cao (anti-wire drawing)',
      'Tích hợp tay gật xả thử nghiệm định kỳ an toàn theo chuẩn EN ISO 4126-1'
    ],
    highlightFeaturesEn: [
      'Full lift high discharge coefficient Kdr = 0.54 certified by TÜV',
      'Stellite hardfaced seat prevents high-velocity steam wire-drawing',
      'Equipped with lifting lever for periodic manual safety relief testing'
    ],
    leakageClass: 'API 527 Tightness / ISO 5208 Rate B',
    testPressureShell: '1.5 x PN (6.0 MPa cho PN40)',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 6850000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN20x32 (3/4"x1-1/4")', pn: 'PN40', faceToFace: 95, height: 310, weightKg: 8.5, kvFlow: 45, flangeHoles: 4 },
      { dn: 'DN25x40 (1"x1-1/2")', pn: 'PN40', faceToFace: 100, height: 350, weightKg: 11.0, kvFlow: 75, flangeHoles: 4 },
      { dn: 'DN32x50 (1-1/4"x2")', pn: 'PN40', faceToFace: 110, height: 390, weightKg: 15.5, kvFlow: 125, flangeHoles: 4 },
      { dn: 'DN50x80 (2"x3")', pn: 'PN40', faceToFace: 125, height: 490, weightKg: 24.0, kvFlow: 310, flangeHoles: 4 },
      { dn: 'DN80x125 (3"x5")', pn: 'PN40', faceToFace: 155, height: 620, weightKg: 46.0, kvFlow: 820, flangeHoles: 8 },
      { dn: 'DN100x150 (4"x6")', pn: 'PN40', faceToFace: 175, height: 750, weightKg: 78.0, kvFlow: 1290, flangeHoles: 8 }
    ],
    characteristics: {
      lifecycle: '800,000 chu trình giải tỏa áp suất • Độ nhạy lò xo chuẩn xác 20 năm',
      lifecycleEn: '800,000 relief cycles • 20 years certified spring elasticity',
      tempLimits: '-20°C đến +400°C (Hơi nhiệt độ cao & Dầu truyền nhiệt)',
      tempLimitsEn: '-20°C to +400°C (High temp steam & thermal oil)',
      sealIntegrity: 'API 527 Bubble-Tight tại 90% áp suất cài đặt • ISO 5208 Rate B',
      sealIntegrityEn: 'API 527 Bubble-Tight at 90% set pressure • ISO 5208 Rate B',
      mediaApplications: 'Hơi nóng bão hòa, Hơi quá nhiệt lò hơi công nghiệp, Khí nén cao áp, Dầu tải nhiệt',
      mediaApplicationsEn: 'Saturated steam, Superheated boiler steam, High pressure air, Thermal oil',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: VYC Model 096 là chuẩn mực van an toàn hơi nóng Châu Âu, cơ chế Full Lift đạt lưu lượng xả cao hơn 30% so với van thường.',
      aiSummaryNotesEn: 'Technical Insight: VYC Model 096 represents the European benchmark for steam relief, achieving 30% higher discharge rate than conventional designs.'
    }
  },
  {
    id: 'vyc-prv-model-597',
    code: 'VYC Model 597',
    name: 'Van Giảm Áp Hơi Trực Tiếp VYC Model 597 (Tây Ban Nha)',
    nameEn: 'VYC Model 597 Direct Acting Pressure Reducing Valve (Spain)',
    brand: 'VYC-Spain',
    category: 'prv',
    categoryLabel: 'PRV (Van giảm áp)',
    categoryLabelEn: 'Pressure Reducing Valve',
    systemGroup: 'steam',
    systemGroupLabel: 'Steam Pressure Regulation',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Made in EU • CE Mark',
    material: 'Gang dẻo EN-GJS-400-18-LT / Thép đúc 1.0619, Màng Inox 316, Bệ van Inox tôi cứng',
    materialEn: 'Ductile Iron EN-GJS-400-18 / Cast Steel 1.0619, SS316 Diaphragm, Hardened SS Trim',
    materialGroup: 'cast_steel',
    pressure: 'PN16 / PN25 (Đầu vào max 25 bar, đầu ra 0.2 - 12 bar)',
    pressureGroup: 'pn25',
    sizeRange: 'DN15 - DN100 (1/2" - 4")',
    tempRange: '-10°C đến +200°C (Hơi bão hòa)',
    connection: 'Mặt bích DIN EN 1092-2 PN16 / PN25',
    applicableMedia: ['Hơi nước bão hòa', 'Khí nén', 'Khí nitơ', 'Khí trung tính'],
    applicableMediaEn: ['Saturated steam', 'Compressed air', 'Nitrogen gas', 'Neutral gases'],
    standards: ['EN 12516-2', 'DIN EN 1092', 'ISO 5208', 'CE PED 2014/68/EU'],
    description: 'Van giảm áp tác động trực tiếp dạng màng ngăn kim loại độ nhạy cao. Tự động duy trì áp suất hạ lưu ổn định tuyệt đối dù lưu lượng tiêu thụ hơi biến thiên lớn.',
    descriptionEn: 'Direct acting pressure reducing valve with high-sensitivity stainless steel diaphragm. Maintains stable downstream pressure regardless of upstream pressure or flow demand fluctuations.',
    highlightFeatures: [
      'Màng cảm biến áp suất Inox 316 độ đàn hồi cao, phản ứng tức thì không có độ trễ',
      'Điều chỉnh dải áp đầu ra linh hoạt bằng vít vặn phía trên nắp van',
      'Đĩa van có gioăng làm kín mềm PTFE hoặc bệ kim loại chịu nhiệt cao'
    ],
    highlightFeaturesEn: [
      'High-resilience SS316 sensing diaphragm provides instantaneous pressure modulation',
      'Precision top adjustment screw for smooth downstream calibration',
      'Tight shut-off under zero consumption conditions'
    ],
    leakageClass: 'EN 12266-1 Rate A / ANSI Class IV',
    testPressureShell: '1.5 x PN (3.75 MPa)',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 5400000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN15 (1/2")', pn: 'PN25', faceToFace: 130, height: 280, weightKg: 7.0, kvFlow: 3.2, flangeHoles: 4 },
      { dn: 'DN20 (3/4")', pn: 'PN25', faceToFace: 150, height: 285, weightKg: 8.5, kvFlow: 5.5, flangeHoles: 4 },
      { dn: 'DN25 (1")', pn: 'PN25', faceToFace: 160, height: 310, weightKg: 10.5, kvFlow: 9.0, flangeHoles: 4 },
      { dn: 'DN32 (1-1/4")', pn: 'PN25', faceToFace: 180, height: 330, weightKg: 14.0, kvFlow: 15.0, flangeHoles: 4 },
      { dn: 'DN50 (2")', pn: 'PN25', faceToFace: 230, height: 390, weightKg: 25.0, kvFlow: 32.0, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN25', faceToFace: 310, height: 490, weightKg: 48.0, kvFlow: 75.0, flangeHoles: 8 }
    ],
    characteristics: {
      lifecycle: '600,000 chu trình điều áp • Hoạt động 24/7 không cần cấp nguồn điện/khí',
      lifecycleEn: '600,000 regulation cycles • Self-acting 24/7 zero external power requirement',
      tempLimits: '-10°C đến +200°C (Hơi nóng lò hơi công nghiệp)',
      tempLimitsEn: '-10°C to +200°C (Industrial saturated steam loops)',
      sealIntegrity: 'ANSI Class IV (Kín khít khi nhà máy ngưng tiêu thụ hơi)',
      sealIntegrityEn: 'ANSI Class IV (Tight shut-off during steam starvation/idle)',
      mediaApplications: 'Hơi nước bão hòa máy sấy, Hơi tiệt trùng y tế/thực phẩm, Khí nén nhà máy',
      mediaApplicationsEn: 'Saturated steam, Autoclave & food steaming, Industrial compressed air',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: VYC Model 597 phản ứng áp lực nhạy bén, tuổi thọ màng inox gấp 3 lần màng cao su thông thường trong môi trường hơi nhiệt.',
      aiSummaryNotesEn: 'Technical Insight: VYC Model 597 utilizes a rugged stainless diaphragm, delivering 3x lifecycle compared to elastomer diaphragms in steam service.'
    }
  },
  {
    id: 'vyc-blowdown-model-260',
    code: 'VYC Model 260',
    name: 'Van Xả Đáy Lò Hơi Tay Gật Nhanh VYC Model 260 (Tây Ban Nha)',
    nameEn: 'VYC Model 260 Intermittent Boiler Blowdown Valve (Spain)',
    brand: 'VYC-Spain',
    category: 'globe',
    categoryLabel: 'Globe valve (Van cầu / Xả đáy)',
    categoryLabelEn: 'Globe / Blowdown Valve',
    systemGroup: 'steam',
    systemGroupLabel: 'Boiler Blowdown Descaling',
    image: VALVE_DETAIL_IMAGE,
    badge: 'European Steam Class',
    material: 'Thép rèn Forged Steel A105 / F316, Đĩa van tôi cứng Stellited Seat',
    materialEn: 'Forged Carbon Steel A105 / F316, Stellited Seat & Disc',
    materialGroup: 'cast_steel',
    pressure: 'PN40 (4.0 MPa / Class 300)',
    pressureGroup: 'pn40',
    sizeRange: 'DN20 - DN50 (3/4" - 2")',
    tempRange: '-10°C đến +350°C',
    connection: 'Mặt bích DIN EN 1092-1 Type 21 PN40',
    applicableMedia: ['Nước xả đáy nồi hơi', 'Bùn cặn silica', 'Hơi áp suất cao'],
    applicableMediaEn: ['Boiler bottom blowdown sludge', 'Silica precipitates', 'High pressure water'],
    standards: ['DIN 3356', 'EN 12516', 'TRD 601', 'ISO 5208'],
    description: 'Van xả đáy định kỳ nồi hơi VYC Model 260 với cơ cấu tay đòn mở nhanh (Quick-action lever). Khi gạt tay, đĩa van mở dứt khoát tạo xoáy hút cuốn trôi bùn cặn và xỉ khoáng đọng đáy bao hơi.',
    descriptionEn: 'Intermittent boiler blowdown valve with manual quick-action lever. Swiftly purges accumulated precipitated sludge and dissolved solids from steam boiler drums without seat erosion.',
    highlightFeatures: [
      'Cơ chế tay gạt tác động nhanh mở đóng trong vòng 1-2 giây chống mài mòn',
      'Đĩa và bệ van tôi Stellite độ cứng cao chịu va đập cặn quặng',
      'Tự động khóa đóng an toàn bảo vệ lò hơi'
    ],
    highlightFeaturesEn: [
      'Rapid quarter-lever action eliminates throttling seat damage during blowdown purge',
      'Heavy Stellite hardfaced trim handles abrasive magnetite & scale',
      'Built-in safety latch prevents accidental opening'
    ],
    leakageClass: 'ISO 5208 Rate A Bubble-Tight',
    testPressureShell: '1.5 x PN (6.0 MPa)',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 4950000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN25 (1")', pn: 'PN40', faceToFace: 160, height: 260, weightKg: 9.5, kvFlow: 12, flangeHoles: 4 },
      { dn: 'DN32 (1-1/4")', pn: 'PN40', faceToFace: 180, height: 285, weightKg: 13.0, kvFlow: 22, flangeHoles: 4 },
      { dn: 'DN40 (1-1/2")', pn: 'PN40', faceToFace: 200, height: 310, weightKg: 18.0, kvFlow: 35, flangeHoles: 4 },
      { dn: 'DN50 (2")', pn: 'PN40', faceToFace: 230, height: 350, weightKg: 24.0, kvFlow: 58, flangeHoles: 4 }
    ],
    characteristics: {
      lifecycle: '400,000 chu trình giật xả nhanh • Chống mài mòn dòng xoáy cặn khoáng',
      lifecycleEn: '400,000 blowdown cycles • Extreme resistance to abrasive sludge scouring',
      tempLimits: '0°C đến +350°C (Áp suất bao hơi đến 32 bar)',
      tempLimitsEn: '0°C to +350°C (Boiler drum pressures up to 32 bar)',
      sealIntegrity: 'ISO 5208 Rate A • Không rò rỉ nước sôi nồi hơi',
      sealIntegrityEn: 'ISO 5208 Rate A • Zero leakage under boiling high pressure',
      mediaApplications: 'Nước đáy nồi hơi công nghiệp mang cặn vôi cacbonat, bùn oxit sắt magnetite',
      mediaApplicationsEn: 'Boiler bottom blowdown water carrying carbonates & magnetite sludge',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: VYC Model 260 giúp xả bùn đáy lò hơi chỉ trong 3 giây mà không gây tổn thất nhiệt năng quá mức, bảo vệ ống lò khỏi nổ bám cặn.',
      aiSummaryNotesEn: 'Technical Insight: VYC Model 260 enables effective 3-second boiler bottom purges without excess steam loss, preventing tube rupture.'
    }
  },

  // =========================================================================
  // 2. SHIELD GLOBAL (UK) - https://shieldglobal.com/
  // =========================================================================
  {
    id: 'shield-bfv-wafer-gear',
    code: 'Shield Fig. SBF-W16',
    name: 'Van Bướm Wafer Hộp Số Shield Valve UK (Fig. SBF-W16)',
    nameEn: 'Shield UK Wafer Butterfly Valve with Gearbox (Fig. SBF-W16)',
    brand: 'Shield Valve UK',
    category: 'butterfly',
    categoryLabel: 'Butterfly valve (Van bướm)',
    categoryLabelEn: 'Butterfly Valve',
    systemGroup: 'hvac',
    systemGroupLabel: 'HVAC Chiller & Commercial MEP',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'British Standard BS EN 593 • WRAS',
    material: 'Thân Gang cầu GGG40 bọc sơn Epoxy 250µm, Cánh Inox 316, Đệm đúc liền EPDM WRAS',
    materialEn: 'Ductile Iron Body GGG40 Epoxy Coated, SS316 Disc, Bonded EPDM Seat (WRAS)',
    materialGroup: 'ductile_iron',
    pressure: 'PN16 / PN25 (1.6 - 2.5 MPa)',
    pressureGroup: 'pn16',
    sizeRange: 'DN50 - DN600 (2" - 24")',
    tempRange: '-20°C đến +130°C',
    connection: 'Mặt bích kẹp Wafer tương thích BS EN 1092-2 / ANSI 150 / JIS 10K',
    applicableMedia: ['Nước sạch sinh hoạt', 'Nước lạnh Chiller', 'Nước tuần hoàn tháp giải nhiệt'],
    applicableMediaEn: ['Potable water', 'HVAC chilled water', 'Cooling tower water'],
    standards: ['BS EN 593', 'BS 5155', 'ISO 5208', 'WRAS Approved', 'ISO 5211'],
    description: 'Dòng van bướm tiêu chuẩn Anh Quốc từ Shield Global. Thiết kế đệm cao su EPDM vulcanized đúc liền thân chống tuột khi đóng ở chênh áp cao. Đạt chứng chỉ nước sạch sinh hoạt WRAS UK.',
    descriptionEn: 'British Standard butterfly valve by Shield Global UK. Features bonded EPDM liner preventing displacement under high differential velocity. WRAS approved for potable water networks.',
    highlightFeatures: [
      'Đệm cao su đúc liền công nghệ cao chống tróc rách và biến dạng khi dòng chảy xiết',
      'Đĩa Inox 316 mài bóng gương tối ưu hệ số lưu lượng Kv cao',
      'Hộp số tay quay IP65 trợ lực nhẹ nhàng, tích hợp chỉ báo vị trí góc mở 0-90°'
    ],
    highlightFeaturesEn: [
      'Bonded elastomer liner eliminates creeping under continuous high delta-P flow',
      'Mirror-polished SS316 disc ensures ultra-low resistance & maximum Cv rating',
      'IP65 heavy duty weatherproof gearbox with clear position indicator'
    ],
    leakageClass: 'ISO 5208 Rate A (Bubble-Tight Zero Leakage)',
    testPressureShell: '1.5 x PN (2.4 MPa)',
    testPressureSeat: '1.1 x PN (1.76 MPa)',
    referencePriceVnd: 2850000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'PN16', faceToFace: 43, height: 215, weightKg: 4.8, kvFlow: 125, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN16', faceToFace: 46, height: 250, weightKg: 6.2, kvFlow: 320, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 52, height: 290, weightKg: 7.9, kvFlow: 650, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN16', faceToFace: 56, height: 350, weightKg: 13.5, kvFlow: 1850, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN16', faceToFace: 60, height: 420, weightKg: 21.0, kvFlow: 3400, flangeHoles: 8 },
      { dn: 'DN250 (10")', pn: 'PN16', faceToFace: 68, height: 490, weightKg: 32.0, kvFlow: 5600, flangeHoles: 12 },
      { dn: 'DN300 (12")', pn: 'PN16', faceToFace: 78, height: 570, weightKg: 48.0, kvFlow: 8900, flangeHoles: 12 }
    ],
    characteristics: {
      lifecycle: '1,000,000 chu trình vận hành • Bền bỉ trên 20 năm hệ cơ điện MEP',
      lifecycleEn: '1,000,000 continuous cycles • Over 20 years commercial MEP lifespan',
      tempLimits: '-20°C đến +130°C (Dung dịch Glycol và nước sinh hoạt)',
      tempLimitsEn: '-20°C to +130°C (Glycol chill and potable water)',
      sealIntegrity: 'ISO 5208 Rate A • Kín khí hoàn toàn không rò rỉ',
      sealIntegrityEn: 'ISO 5208 Rate A • 100% Bubble-Tight zero leakage',
      mediaApplications: 'Nước lạnh hệ thống Chiller HVAC, Tháp làm mát Cooling Tower, Nước sinh hoạt chung cư cao cấp',
      mediaApplicationsEn: 'Chilled HVAC cooling water, Cooling towers, Commercial potable distribution',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: Shield Fig. SBF-W16 đáp ứng tiêu chuẩn nước sạch WRAS khắt khe của Anh Quốc, lực vặn mở nhẹ nhàng hơn 25% nhờ thiết kế đệm đúc thông minh.',
      aiSummaryNotesEn: 'Technical Insight: Shield Fig. SBF-W16 conforms to British WRAS drinking water standards, reducing operating torque by 25%.'
    }
  },
  {
    id: 'shield-fire-gate-osy-ul-fm',
    code: 'Shield Fig. S-OSY300',
    name: 'Van Cổng Ty Nổi PCCC Shield UK UL/FM 300 PSI (Fig. S-OSY300)',
    nameEn: 'Shield UK OS&Y Resilient Seated Gate Valve UL/FM 300 PSI (Fig. S-OSY300)',
    brand: 'Shield Valve UK',
    category: 'resilient_gate',
    categoryLabel: 'Resilient gate valve (Van cổng PCCC)',
    categoryLabelEn: 'Fire Gate Valve',
    systemGroup: 'firefighting',
    systemGroupLabel: 'UL/FM Fire Protection Network',
    image: VALVE_DETAIL_IMAGE,
    badge: 'UL Listed / FM Approved • 300 PSI',
    material: 'Thân Gang cầu Ductile Iron GGG50, Cửa van bọc EPDM 100%, Ty van Inox AISI 420 chống gỉ',
    materialEn: 'Ductile Iron Body GGG50, Full EPDM Encapsulated Wedge, SS AISI 420 Stem',
    materialGroup: 'ductile_iron',
    pressure: '300 PSI (20.7 bar / PN25)',
    pressureGroup: 'pn25',
    sizeRange: 'DN50 - DN300 (2" - 12")',
    tempRange: '-10°C đến +80°C',
    connection: 'Mặt bích ANSI B16.1 Class 125/150 hoặc EN 1092-2 PN16/25',
    applicableMedia: ['Nước cấp PCCC', 'Hệ thống Sprinkler', 'Đường ống trạm bơm cứu hỏa'],
    applicableMediaEn: ['Fire fighting water', 'Sprinkler main riser', 'Pump discharge headers'],
    standards: ['UL 262', 'FM 1120/1130', 'AWWA C515', 'BS 5163', 'ISO 5208'],
    description: 'Van cổng ty nổi (Outside Screw and Yoke) đạt kiểm định quốc tế UL Listed & FM Approved chuyên dụng cho trạm bơm cứu hỏa và mạng ống cấp nước PCCC. Ty van nhô cao thể hiện trạng thái đóng/mở trực quan.',
    descriptionEn: 'UL Listed & FM Approved OS&Y resilient seated gate valve rated for 300 PSI fire fighting service. Outside screw clearly displays open/closed status from afar for rapid fire brigade inspection.',
    highlightFeatures: [
      'Đạt đồng thời 2 chứng chỉ PCCC uy tín nhất thế giới: UL 262 và FM 1120',
      'Cửa van bọc cao su lưu hóa EPDM 100% bít kín tuyệt đối không gây đọng cát',
      'Ty van có rãnh tích hợp sẵn công tắc giám sát trạng thái hành trình (Tamper Switch ready)'
    ],
    highlightFeaturesEn: [
      'Dual certified UL 262 and FM 1120 for 300 PSI working pressure',
      '100% EPDM vulcanized wedge prevents cavity clogging and silt retention',
      'Pre-grooved stem designed for mounting supervisory tamper switch'
    ],
    leakageClass: 'ISO 5208 Rate A / AWWA C515 Zero Leakage',
    testPressureShell: '4.14 MPa (600 PSI Hydrostatic Shell)',
    testPressureSeat: '2.07 MPa (300 PSI Hydrostatic Seat)',
    referencePriceVnd: 5200000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN65 (2-1/2")', pn: 'PN25 / 300 PSI', faceToFace: 190, height: 410, weightKg: 18.0, kvFlow: 380, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'PN25 / 300 PSI', faceToFace: 203, height: 480, weightKg: 22.5, kvFlow: 620, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN25 / 300 PSI', faceToFace: 229, height: 560, weightKg: 31.0, kvFlow: 1150, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN25 / 300 PSI', faceToFace: 267, height: 750, weightKg: 58.0, kvFlow: 2800, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN25 / 300 PSI', faceToFace: 292, height: 960, weightKg: 95.0, kvFlow: 5200, flangeHoles: 8 },
      { dn: 'DN250 (10")', pn: 'PN25 / 300 PSI', faceToFace: 330, height: 1180, weightKg: 155.0, kvFlow: 8500, flangeHoles: 12 }
    ],
    characteristics: {
      lifecycle: '200,000 chu trình vận hành • Tuổi thọ cơ học trên 25 năm hệ thống chữa cháy',
      lifecycleEn: '200,000 test cycles • 25+ years mechanical life in fire sprinkler loops',
      tempLimits: '0°C đến +80°C (Tiêu chuẩn PCCC NFPA)',
      tempLimitsEn: '0°C to +80°C (NFPA Fire standard)',
      sealIntegrity: 'AWWA C515 / ISO 5208 Rate A Zero Leakage',
      sealIntegrityEn: 'AWWA C515 / ISO 5208 Rate A Zero Leakage',
      mediaApplications: 'Nước PCCC, Trạm bơm cứu hỏa công suất lớn, Trụ cấp nước chữa cháy nhà xưởng',
      mediaApplicationsEn: 'Fire sprinkler networks, High-capacity pump headers, Industrial hydrant loops',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: Đạt chuẩn UL/FM 300 PSI, áp lực thử vỏ lên đến 600 PSI (41.4 bar), bảo vệ an toàn tối đa cho các dự án nhà xưởng cao tầng và trung tâm dữ liệu.',
      aiSummaryNotesEn: 'Technical Insight: Rated for 300 PSI with 600 PSI shell hydrostatic test, ensuring absolute integrity for high-rise fire risers and data centers.'
    }
  },

  // =========================================================================
  // 3. JM VALVE (SOUTH KOREA) - http://www.jmvalve.co.kr/english/main.php
  // =========================================================================
  {
    id: 'jmv-ball-flanged-2pc',
    code: 'JMV Fig. JMV-10K/20K',
    name: 'Van Bi Mặt Bích Inox / Thép Đúc JM Valve Hàn Quốc (Fig. JMV-10K/20K)',
    nameEn: 'JM Valve Korea Flanged Ball Valve KS/JIS (Fig. JMV-10K/20K)',
    brand: 'JMV-Korea',
    category: 'ball',
    categoryLabel: 'Ball valves (Van bi)',
    categoryLabelEn: 'Ball Valve',
    systemGroup: 'oilgas',
    systemGroupLabel: 'Petrochemical & Gas Loops',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'KS B2308 • JIS B2220 Korea',
    material: 'Thép đúc SCPH2 (WCB) / Inox SCS13 (SS304) / SCS14 (SS316), Bi Inox mạ Cr, Gioăng PTFE/RPTFE',
    materialEn: 'Cast Steel SCPH2 / Stainless SCS13/SCS14, Mirror Ball, RPTFE Seats',
    materialGroup: 'ss304_316',
    pressure: 'JIS 10K / 20K (1.0 - 2.0 MPa / PN16-PN25)',
    pressureGroup: 'pn25',
    sizeRange: 'DN15 - DN250 (1/2" - 10")',
    tempRange: '-29°C đến +200°C',
    connection: 'Mặt bích tiêu chuẩn Hàn Quốc KS B1511 / Nhật Bản JIS B2220 10K/20K',
    applicableMedia: ['Dầu khí', 'Hóa chất ăn mòn', 'Khí gas công nghiệp', 'Dung môi hóa chất'],
    applicableMediaEn: ['Petroleum oil', 'Corrosive chemicals', 'LPG/LNG gas', 'Industrial solvents'],
    standards: ['KS B2308', 'JIS B2002', 'API 607 Fire Safe', 'API 6D', 'ISO 9001'],
    description: 'Dòng van bi công nghiệp cao cấp chế tạo tại Hàn Quốc bởi hãng JM Valve. Cấu trúc 2 thân Full Port dòng chảy thông thoáng, bi van khoan cân bằng áp suất, ty van chống thổi bay (Blowout-proof stem).',
    descriptionEn: 'Heavy duty flanged ball valve manufactured in South Korea by JM Valve. Features full bore flow, blowout-proof stem, pressure-relieving cavity ball, and Fire Safe API 607 compliance.',
    highlightFeatures: [
      'Sản xuất và kiểm định 100% tại nhà máy Hàn Quốc theo chuẩn KS B2308 / JIS',
      'Đạt chứng nhận chống cháy Fire Safe API 607 Edition 6 cho các nhà máy lọc hóa dầu',
      'Đế bắt actuator theo tiêu chuẩn quốc tế ISO 5211 lắp đặt động cơ dễ dàng'
    ],
    highlightFeaturesEn: [
      '100% manufactured and tested in South Korea under stringent KS B2308 standards',
      'API 607 6th edition fire safe certified for petrochemical refineries',
      'Integrated ISO 5211 top mounting flange for pneumatic/electric actuation'
    ],
    leakageClass: 'ISO 5208 Rate A Zero Bubble Leakage',
    testPressureShell: '1.5 x PN (3.0 MPa cho JIS 20K)',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 2950000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN15 (1/2")', pn: 'JIS 10K/20K', faceToFace: 108, height: 85, weightKg: 2.5, kvFlow: 22, flangeHoles: 4 },
      { dn: 'DN25 (1")', pn: 'JIS 10K/20K', faceToFace: 127, height: 110, weightKg: 4.8, kvFlow: 65, flangeHoles: 4 },
      { dn: 'DN50 (2")', pn: 'JIS 10K/20K', faceToFace: 178, height: 155, weightKg: 10.5, kvFlow: 380, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'JIS 10K/20K', faceToFace: 203, height: 210, weightKg: 21.0, kvFlow: 950, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'JIS 10K/20K', faceToFace: 229, height: 245, weightKg: 32.0, kvFlow: 1800, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'JIS 10K/20K', faceToFace: 267, height: 330, weightKg: 62.0, kvFlow: 4200, flangeHoles: 8 }
    ],
    characteristics: {
      lifecycle: '800,000 chu trình đóng mở • Bền bỉ trong môi trường hóa chất hữu cơ',
      lifecycleEn: '800,000 cycles • Exceptional durability in petrochemical service',
      tempLimits: '-29°C đến +200°C (PTFE / RPTFE) • Lựa chọn Peek đến 260°C',
      tempLimitsEn: '-29°C to +200°C (RPTFE) • Peek seat up to 260°C',
      sealIntegrity: 'ISO 5208 Rate A • Kín khí tuyệt đối không sủi bọt (Zero Bubble)',
      sealIntegrityEn: 'ISO 5208 Rate A • Zero Bubble Tight Shutoff',
      mediaApplications: 'Khí gas tự nhiên LPG/LNG, Dầu diesel, Dầu truyền nhiệt, Dung môi hữu cơ',
      mediaApplicationsEn: 'LPG/LNG gas, Diesel fuel, Heavy thermal oils, Chemical solvents',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: JM Valve Hàn Quốc nổi tiếng về độ gia công bi cầu siêu bóng gương Ra < 0.2µm, giảm ma sát đóng mở và kéo dài tuổi thọ gioăng lên gấp đôi.',
      aiSummaryNotesEn: 'Technical Insight: JM Valve Korea precision ball polishing (Ra < 0.2µm) dramatically cuts seat friction, doubling seal life.'
    }
  },
  {
    id: 'jmv-cryogenic-top-entry',
    code: 'JMV Fig. CRY-TE150',
    name: 'Van Bi Âm Sâu Top-Entry JM Valve Hàn Quốc -196°C (Cryogenic)',
    nameEn: 'JM Valve Korea Cryogenic Top-Entry Ball Valve -196°C (Fig. CRY-TE150)',
    brand: 'JMV-Korea',
    category: 'ball',
    categoryLabel: 'Ball valves (Van bi âm sâu)',
    categoryLabelEn: 'Cryogenic Ball Valve',
    systemGroup: 'gas_cryogenic',
    systemGroupLabel: 'Cryogenic Liquid Gas & LNG',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Cryogenic -196°C • BS 6364',
    material: 'Thép không gỉ đúc Inox 316L (SCS16A / CF3M), Cổ van kéo dài Extended Bonnet, Đệm PCTFE (Kel-F)',
    materialEn: 'Stainless Steel CF3M / SS316L, Extended Cryogenic Bonnet, Kel-F / PCTFE Seats',
    materialGroup: 'ss304_316',
    pressure: 'ANSI Class 150 / Class 300 (PN20 - PN50)',
    pressureGroup: 'pn25',
    sizeRange: 'DN15 - DN200 (1/2" - 8")',
    tempRange: '-196°C (Khí hóa lỏng) đến +120°C',
    connection: 'Mặt bích ASME B16.5 Class 150/300 hoặc Hàn giáp mối Butt Weld',
    applicableMedia: ['Khí LNG hóa lỏng', 'Khí Nitơ lỏng (LN2)', 'Oxy lỏng (LOX)', 'Khí Argon lỏng'],
    applicableMediaEn: ['Liquid Natural Gas (LNG)', 'Liquid Nitrogen (LN2)', 'Liquid Oxygen (LOX)', 'Liquid Argon'],
    standards: ['BS 6364 Cryogenic Valve', 'ASME B16.34', 'API 6D', 'ISO 28921-1', 'API 607'],
    description: 'Van bi âm sâu thiết kế mở nắp từ trên (Top-Entry) cho phép bảo trì thay thế ruột van ngay trên tuyến ống mà không cần cắt mối hàn. Cổ van kéo dài cách nhiệt tạo túi khí bảo vệ cụm packing ở nhiệt độ siêu thấp -196°C.',
    descriptionEn: 'Cryogenic top-entry ball valve designed for extreme liquid gas handling down to -196°C. Top-entry body allows in-line maintenance without pipe cut, while extended column insulates the stem packing.',
    highlightFeatures: [
      'Thiết kế nắp trên Top-Entry sửa chữa bảo dưỡng trực tiếp ngay trên tuyến ống',
      'Đạt chuẩn kiểm thử nghiệm âm sâu BS 6364 tại -196°C ngâm trong Nitơ lỏng',
      'Lỗ xả cân bằng áp suất tự động (cavity relief) chống nổ khoang van do khí lỏng bay hơi'
    ],
    highlightFeaturesEn: [
      'Top-entry construction allows complete internal servicing while valve stays welded in line',
      'Cryogenic prototype tested in liquid nitrogen at -196°C according to BS 6364',
      'Self-relieving seat design prevents catastrophic thermal over-pressurization'
    ],
    leakageClass: 'ISO 5208 Rate A / BS 6364 Cryogenic Tightness',
    testPressureShell: '1.5 x PN (Class 150: 3.1 MPa)',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 12500000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN25 (1")', pn: 'Class 150', faceToFace: 165, height: 420, weightKg: 12.0, kvFlow: 55, flangeHoles: 4 },
      { dn: 'DN50 (2")', pn: 'Class 150', faceToFace: 216, height: 530, weightKg: 24.0, kvFlow: 320, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'Class 150', faceToFace: 282, height: 680, weightKg: 46.0, kvFlow: 820, flangeHoles: 4 },
      { dn: 'DN100 (4")', pn: 'Class 150', faceToFace: 305, height: 790, weightKg: 68.0, kvFlow: 1550, flangeHoles: 8 }
    ],
    characteristics: {
      lifecycle: '500,000 chu trình trong môi trường khí hóa lỏng cực lạnh',
      lifecycleEn: '500,000 cycles under cryogenic liquefied gas conditions',
      tempLimits: '-196°C đến +120°C (Kiểm tra ngâm Nitơ lỏng thực nghiệm)',
      tempLimitsEn: '-196°C to +120°C (BS 6364 liquid nitrogen immersion tested)',
      sealIntegrity: 'BS 6364 / ISO 5208 Rate A (Không rò rỉ khí heli/nitơ)',
      sealIntegrityEn: 'BS 6364 / ISO 5208 Rate A Helium tight',
      mediaApplications: 'Kho chứa khí LNG/LPG, Trạm chiết nạp khí công nghiệp Oxy/Nitơ lỏng, Bồn chứa chân không',
      mediaApplicationsEn: 'LNG receiving terminals, Cryogenic air separation units, Liquid nitrogen tanks',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: Cấu trúc Top-Entry của JM Valve loại bỏ hoàn toàn chi phí cắt đường ống hàn khi đại tu định kỳ, tiết kiệm hàng chục ngàn USD chi phí dừng máy.',
      aiSummaryNotesEn: 'Technical Insight: Top-entry body saves thousands of dollars in downtime by allowing inline replacement without pipe cut-off.'
    }
  },

  // =========================================================================
  // 4. JOHNSON CONTROLS - HVAC CONTROLS, PICV & BALANCING VALVES
  // =========================================================================
  {
    id: 'jc-picv-vp1000',
    code: 'Johnson Controls VP1000',
    name: 'Van Cân Bằng Kết Hợp Điều Khiển Độc Lập Áp Suất PICV Johnson Controls',
    nameEn: 'Johnson Controls VP1000 Pressure Independent Control Valve (PICV)',
    brand: 'Johnson Controls',
    category: 'balancing',
    categoryLabel: 'Balancing valve (Van PICV / Điều khiển)',
    categoryLabelEn: 'PICV Balancing Valve',
    systemGroup: 'hvac',
    systemGroupLabel: 'Building HVAC & BMS Energy Saving',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'PICV Smart HVAC • BMS Ready',
    material: 'Thân Đồng rèn Forged Brass / Gang cầu GGG40, Lõi điều áp Inox 304, Đệm EPDM chịu nhiệt',
    materialEn: 'Forged Brass / Ductile Iron Body GGG40, SS304 Pressure Regulator, EPDM Seals',
    materialGroup: 'bronze',
    pressure: 'PN16 / PN25 (Chênh áp làm việc ΔP: 20 kPa - 400 kPa)',
    pressureGroup: 'pn25',
    sizeRange: 'DN15 - DN150 (1/2" - 6")',
    tempRange: '-10°C đến +120°C',
    connection: 'Ren trong BSP (DN15-DN50) / Mặt bích DIN EN 1092-2 (DN65-DN150)',
    applicableMedia: ['Nước lạnh Chiller', 'Nước nóng sưởi ấm FCU/AHU', 'Dung dịch Glycol nồng độ đến 50%'],
    applicableMediaEn: ['Chilled HVAC water', 'Hot heating water', 'Water with up to 50% Glycol'],
    standards: ['EN 12266-1', 'ISO 5208', 'ANSI Class IV', 'BTL BACnet Certified Actuator'],
    description: 'Dòng van PICV (Pressure Independent Control Valve) cao cấp từ Johnson Controls. Tích hợp 3 chức năng trong 1 thiết bị duy nhất: Điều khiển lưu lượng tuyến tính 0-10V, Tự động cân bằng chênh áp động học, và Cách ly đường ống. Tối ưu đến 35% điện năng tiêu thụ cho hệ thống Chiller.',
    descriptionEn: 'Pressure Independent Control Valve by Johnson Controls. Integrates modulating control (0-10V/BACnet), dynamic differential pressure balancing, and isolation in a single valve body, reducing chiller energy consumption by up to 35%.',
    highlightFeatures: [
      'Tự động duy trì lưu lượng thiết kế chuẩn xác ±5% bất chấp dao động áp suất hệ thống',
      'Kết hợp động cơ điện Johnson Controls VA-748x điều khiển 0-10V / Modbus / BACnet MS/TP',
      'Tích hợp 2 cổng đo áp suất P/T plugs cho phép cắm máy đo lưu lượng kỹ thuật số kiểm tra tức thì'
    ],
    highlightFeaturesEn: [
      'Guarantees ±5% flow accuracy independent of system pressure fluctuations',
      'Pairs seamlessly with Johnson Controls VA-748x 0-10V or BACnet MS/TP actuators',
      'Dual P/T test ports allow digital manometer commissioning & flow verification'
    ],
    leakageClass: 'ANSI Class IV (0.01% Kvs shut-off)',
    testPressureShell: '1.5 x PN (3.75 MPa)',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 4200000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN15 (1/2")', pn: 'PN25', faceToFace: 85, height: 180, weightKg: 1.8, kvFlow: 0.8, flangeHoles: 0 },
      { dn: 'DN20 (3/4")', pn: 'PN25', faceToFace: 95, height: 185, weightKg: 2.2, kvFlow: 1.5, flangeHoles: 0 },
      { dn: 'DN25 (1")', pn: 'PN25', faceToFace: 110, height: 210, weightKg: 3.1, kvFlow: 3.0, flangeHoles: 0 },
      { dn: 'DN32 (1-1/4")', pn: 'PN25', faceToFace: 130, height: 235, weightKg: 4.5, kvFlow: 5.5, flangeHoles: 0 },
      { dn: 'DN50 (2")', pn: 'PN25', faceToFace: 180, height: 290, weightKg: 8.5, kvFlow: 15.0, flangeHoles: 0 },
      { dn: 'DN65 (2-1/2")', pn: 'PN16', faceToFace: 290, height: 380, weightKg: 26.0, kvFlow: 35.0, flangeHoles: 4 },
      { dn: 'DN100 (4")', pn: 'PN16', faceToFace: 350, height: 490, weightKg: 48.0, kvFlow: 90.0, flangeHoles: 8 }
    ],
    characteristics: {
      lifecycle: '1,500,000 chu trình điều tiết tuyến tính • Hoạt động thông minh liên tục 15 năm',
      lifecycleEn: '1,500,000 modulating cycles • 15 years continuous BMS service',
      tempLimits: '-10°C đến +120°C (Dung dịch Glycol 50% chống đông)',
      tempLimitsEn: '-10°C to +120°C (50% Glycol antifreeze mixture)',
      sealIntegrity: 'ANSI Class IV (0.01% of nominal Kvs) • Đóng chặt khi ngắt tải FCU/AHU',
      sealIntegrityEn: 'ANSI Class IV (0.01% of nominal Kvs) • Tight shut-off at zero thermal demand',
      mediaApplications: 'Dàn trao đổi nhiệt FCU, Bộ xử lý không khí AHU, Trạm phân phối nước lạnh Chiller tòa nhà',
      mediaApplicationsEn: 'Fan Coil Units (FCU), Air Handling Units (AHU), Central Chiller cooling coils',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: Johnson Controls VP1000 giải quyết triệt để hiện tượng tràn lưu lượng (Low Delta-T syndrome), giúp Chiller vận hành ở hiệu suất COP cao nhất.',
      aiSummaryNotesEn: 'Technical Insight: Johnson Controls VP1000 eliminates Low Delta-T syndrome, enabling chillers to operate at peak coefficient of performance.'
    }
  },
  {
    id: 'jc-vg1000-ball-control',
    code: 'Johnson Controls VG1000',
    name: 'Van Bi Điều Khiển Tuyến Tính Johnson Controls VG1000 Series (Mỹ)',
    nameEn: 'Johnson Controls VG1000 Series Modulating Control Ball Valve (USA)',
    brand: 'Johnson Controls',
    category: 'ball',
    categoryLabel: 'Ball valves (Van điều khiển HVAC)',
    categoryLabelEn: 'HVAC Control Ball Valve',
    systemGroup: 'hvac',
    systemGroupLabel: 'Building HVAC & Smart Automation',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'Johnson Controls USA • M9000 Actuator',
    material: 'Thân Đồng đúc Forged Brass, Bi Inox SS304 chống rỉ, Đĩa điều tiết Parabolic Amodel, Gioăng PTFE/EPDM',
    materialEn: 'Forged Brass Body, SS304 Ball, Amodel Flow Characterizer Disc, PTFE/EPDM',
    materialGroup: 'bronze',
    pressure: 'PN40 / 600 WOG (Áp suất chênh lệch đóng ngắt ΔP đến 14 bar)',
    pressureGroup: 'pn40',
    sizeRange: 'DN15 - DN50 (1/2" - 2")',
    tempRange: '-30°C đến +140°C',
    connection: 'Ren trong NPT hoặc BSP tiêu chuẩn ISO 7/1',
    applicableMedia: ['Nước lạnh Chiller', 'Nước nóng áp lực', 'Hơi bão hòa thấp (đến 1.5 bar)'],
    applicableMediaEn: ['Chilled water', 'Hot heating water', 'Low pressure steam up to 1.5 bar'],
    standards: ['ANSI/ISA 75.05', 'ANSI B16.15', 'ISO 5211', 'CE Mark'],
    description: 'Van bi điều khiển 2 ngả & 3 ngả Johnson Controls VG1000 Series được cấp bằng sáng chế với đĩa định hình dòng chảy Parabolic (Equal Percentage Characteristic). Độ phân giải điều khiển cực cao, không bị quá nhiệt hoặc giật tải.',
    descriptionEn: 'Patented Johnson Controls VG1000 Series characterized ball valve. Features equal percentage flow characterizer disc for precise thermal modulation with M9000 Series electric actuators.',
    highlightFeatures: [
      'Đĩa Parabolic độc quyền tạo đặc tính dòng chảy Equal Percentage độ chính xác cao',
      'Động cơ M9000 tác động nhanh, phản hồi vị trí Feedback 0-10V về trung tâm BMS',
      'Khả năng chịu chênh áp đóng kín ΔP lên tới 14 bar (200 PSI Close-off) chống rò rỉ'
    ],
    highlightFeaturesEn: [
      'Patented Amodel flow characterizer delivers true equal percentage flow response',
      'M9000 electric actuator with proportional 0-10V control & position feedback',
      'High close-off pressure rating up to 14 bar (200 PSI) prevents unwanted thermal bleed'
    ],
    leakageClass: 'ANSI Class VI (Bubble-Tight Zero Leakage)',
    testPressureShell: '1.5 x PN (6.0 MPa)',
    testPressureSeat: '1.1 x PN',
    referencePriceVnd: 3450000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN15 (1/2")', pn: 'PN40', faceToFace: 67, height: 165, weightKg: 1.4, kvFlow: 1.6, flangeHoles: 0 },
      { dn: 'DN20 (3/4")', pn: 'PN40', faceToFace: 75, height: 175, weightKg: 1.8, kvFlow: 4.0, flangeHoles: 0 },
      { dn: 'DN25 (1")', pn: 'PN40', faceToFace: 92, height: 195, weightKg: 2.5, kvFlow: 8.6, flangeHoles: 0 },
      { dn: 'DN32 (1-1/4")', pn: 'PN40', faceToFace: 108, height: 215, weightKg: 3.6, kvFlow: 16.0, flangeHoles: 0 },
      { dn: 'DN40 (1-1/2")', pn: 'PN40', faceToFace: 120, height: 235, weightKg: 4.8, kvFlow: 25.0, flangeHoles: 0 },
      { dn: 'DN50 (2")', pn: 'PN40', faceToFace: 140, height: 270, weightKg: 7.2, kvFlow: 42.0, flangeHoles: 0 }
    ],
    characteristics: {
      lifecycle: '1,200,000 chu trình xoay điều tiết • Không rò rỉ cổ van với 2 lớp đệm O-Ring kép',
      lifecycleEn: '1,200,000 modulation cycles • Dual Viton stem O-rings eliminate packing maintenance',
      tempLimits: '-30°C đến +140°C',
      tempLimitsEn: '-30°C to +140°C',
      sealIntegrity: 'ANSI Class VI Bubble-Tight (Zero Leakage khi đóng kín)',
      sealIntegrityEn: 'ANSI Class VI Bubble-Tight (Zero Leakage at 0% command)',
      mediaApplications: 'Dàn lạnh FCU/AHU, Hệ thống trao đổi nhiệt Chiller, BMS thông minh tòa nhà văn phòng',
      mediaApplicationsEn: 'AHU cooling coils, Heating heat exchangers, Smart building management BMS',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: Johnson Controls VG1000 là dòng van điều khiển bán chạy nhất tại các khách sạn 5 sao và bệnh viện nhờ khả năng kiểm soát nhiệt độ phòng chính xác đến ±0.2°C.',
      aiSummaryNotesEn: 'Technical Insight: Johnson Controls VG1000 is preferred in luxury hotels and hospitals, delivering tight room temperature stability within ±0.2°C.'
    }
  },

  // =========================================================================
  // 5. TYCO FIRE PROTECTION - ALARM CHECK, DELUGE & FIRE SPRINKLER VALVES
  // =========================================================================
  {
    id: 'tyco-alarm-check-av-1-300',
    code: 'Tyco Model AV-1-300',
    name: 'Van Báo Động Báo Cháy Tyco Model AV-1-300 UL/FM 300 PSI (Mỹ)',
    nameEn: 'Tyco Model AV-1-300 Alarm Check Valve UL/FM 300 PSI (USA)',
    brand: 'Tyco',
    category: 'water_control',
    categoryLabel: 'Alarm valve (Van báo động PCCC)',
    categoryLabelEn: 'Alarm Check Valve',
    systemGroup: 'firefighting',
    systemGroupLabel: 'UL/FM Fire Protection & Life Safety',
    image: VALVE_DETAIL_IMAGE,
    badge: 'UL Listed / FM Approved • 300 PSI',
    material: 'Thân Gang cầu Ductile Iron sơn đỏ Epoxy chống gỉ, Đĩa van bọc cao su chịu lực EPDM, Bệ van đồng Bronze',
    materialEn: 'Ductile Iron Body Red Epoxy Coated, EPDM Rubber-Faced Clapper, Bronze Seat Ring',
    materialGroup: 'ductile_iron',
    pressure: '300 PSI (20.7 bar / PN25)',
    pressureGroup: 'pn25',
    sizeRange: 'DN65 - DN200 (2-1/2" - 8")',
    tempRange: '0°C đến +68°C',
    connection: 'Mặt bích x Mặt bích (Flange x Flange) hoặc Rãnh cùm x Rãnh cùm (Groove x Groove)',
    applicableMedia: ['Nước cấp hệ thống Sprinkler tự động', 'Mạng đường ống chữa cháy vách tường'],
    applicableMediaEn: ['Automatic fire sprinkler water', 'Wet pipe life safety riser systems'],
    standards: ['UL Listed', 'FM Approved', 'NFPA 13', 'VdS', 'LPCB'],
    description: 'Cụm van báo động tự động Tyco Model AV-1-300 chuyên dụng cho hệ thống đường ống ướt (Wet Pipe Sprinkler). Khi có đầu phun vỡ do nhiệt đám cháy, dòng nước chảy qua làm lật lá lật, kích hoạt chuông nước cơ học (Water Motor Gong) và công tắc áp lực gửi tín hiệu về tủ báo cháy trung tâm.',
    descriptionEn: 'Tyco Model AV-1-300 Alarm Check Valve for wet pipe fire sprinkler systems. Water flow lifts the clapper to ring the water motor gong alarm and trip pressure switches to notify the central fire alarm panel.',
    highlightFeatures: [
      'Đầy đủ chứng chỉ UL Listed, FM Approved, VdS Đức và LPCB Anh Quốc',
      'Đi kèm buồng làm chậm áp (Model RC-1 Retard Chamber) triệt tiêu báo động giả do xung áp',
      'Có sẵn chuông cơ thủy lực Water Motor Gong phát âm thanh cảnh báo độc lập không cần điện'
    ],
    highlightFeaturesEn: [
      'Globally certified by UL, FM, VdS Germany, and LPCB United Kingdom',
      'Includes Model RC-1 Retard Chamber preventing false alarms from water hammer spikes',
      'Hydraulic Water Motor Gong sounds an audible alarm independently without electrical power'
    ],
    leakageClass: 'UL / FM Water-Tight Shutoff (Không rò rỉ áp)',
    testPressureShell: '4.14 MPa (600 PSI Hydrostatic Shell Test)',
    testPressureSeat: '2.07 MPa (300 PSI Seat Test)',
    referencePriceVnd: 8900000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN65 (2-1/2")', pn: '300 PSI', faceToFace: 260, height: 420, weightKg: 28.0, kvFlow: 450, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: '300 PSI', faceToFace: 270, height: 450, weightKg: 34.0, kvFlow: 780, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: '300 PSI', faceToFace: 298, height: 490, weightKg: 46.0, kvFlow: 1450, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: '300 PSI', faceToFace: 343, height: 580, weightKg: 78.0, kvFlow: 3600, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: '300 PSI', faceToFace: 432, height: 690, weightKg: 125.0, kvFlow: 6800, flangeHoles: 8 }
    ],
    characteristics: {
      lifecycle: '100,000 chu trình thử nghiệm dòng chảy • Tuổi thọ trực chiến PCCC trên 30 năm',
      lifecycleEn: '100,000 flow test cycles • Over 30 years fire safety readiness',
      tempLimits: '0°C đến +68°C (Theo chuẩn NFPA 13)',
      tempLimitsEn: '0°C to +68°C (NFPA 13 Wet pipe standard)',
      sealIntegrity: 'UL/FM Bubble-Tight • Kín tuyệt đối chống sụt áp đường ống',
      sealIntegrityEn: 'UL/FM Bubble-Tight • Zero static pressure bleed',
      mediaApplications: 'Hệ thống chữa cháy tự động Sprinkler cao ốc, Trung tâm thương mại, Nhà máy công nghiệp',
      mediaApplicationsEn: 'Commercial high-rises, Shopping malls, Industrial wet sprinkler networks',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: Tyco AV-1-300 là cụm van báo động PCCC tiêu chuẩn vàng số 1 thế giới, bộ Retard Chamber Model RC-1 giảm 99.9% nguy cơ báo cháy giả.',
      aiSummaryNotesEn: 'Technical Insight: Tyco AV-1-300 is the world gold standard in alarm check valves, virtually eliminating false alarms via RC-1 retard chamber.'
    }
  },
  {
    id: 'tyco-deluge-dv-5a',
    code: 'Tyco Model DV-5A',
    name: 'Van Xả Tràn Ngập Deluge Valve Tyco Model DV-5A (Mỹ)',
    nameEn: 'Tyco Model DV-5A Diaphragm-Style Deluge Valve (USA)',
    brand: 'Tyco',
    category: 'water_control',
    categoryLabel: 'Deluge valve (Van xả tràn ngập)',
    categoryLabelEn: 'Deluge Valve',
    systemGroup: 'firefighting',
    systemGroupLabel: 'High Hazard Fire & Chemical Deluge',
    image: VALVE_DETAIL_IMAGE,
    badge: 'UL / FM • High Hazard Deluge',
    material: 'Thân Gang cầu Ductile Iron GGG50 phủ sơn Epoxy Rilsan chống nước biển/hóa chất, Màng cao su tổng hợp chịu lực',
    materialEn: 'Ductile Iron Body with Rilsan / Red Epoxy Coating, High Tensile Reinforced Diaphragm',
    materialGroup: 'ductile_iron',
    pressure: '300 PSI (20.7 bar / PN25)',
    pressureGroup: 'pn25',
    sizeRange: 'DN40 - DN200 (1-1/2" - 8")',
    tempRange: '0°C đến +68°C',
    connection: 'Mặt bích ANSI B16.42 / ISO 7005 hoặc Rãnh Grooved',
    applicableMedia: ['Nước dập lửa lưu lượng siêu lớn', 'Bọt Foam chữa cháy AFFF', 'Nước biển kho xăng dầu'],
    applicableMediaEn: ['High-capacity fire water', 'AFFF foam firefighting solution', 'Seawater deluge'],
    standards: ['UL Listed', 'FM Approved', 'NFPA 15 Water Spray', 'NFPA 16 Foam-Water'],
    description: 'Van xả tràn ngập dạng màng ngăn Tyco Model DV-5A chuyên dụng cho các khu vực nguy cơ cháy nổ cực cao (High Hazard) như trạm biến áp, kho xăng dầu, sân đỗ trực thăng và giàn khoan ngoài khơi. Khi nhận tín hiệu kích hoạt điện/khí nén, màng van mở tức thời < 0.2 giây xả ồ ạt qua toàn bộ đầu phun hở.',
    descriptionEn: 'Diaphragm-style deluge valve Tyco Model DV-5A for high-hazard deluge and preaction protection (transformers, fuel storage, helipads). External reset diaphragm snaps open in <0.2 seconds upon electrical/pneumatic trip.',
    highlightFeatures: [
      'Cơ chế màng đơn (Single diaphragm) phản ứng siêu tốc < 0.2s, reset ngoài không cần tháo nắp',
      'Được kiểm định UL/FM cho cả hệ thống phun sương dập dầu mỏ và hệ thống tạo bọt Foam',
      'Tùy chọn thân tráng lớp phủ Rilsan chống ăn mòn nước biển khắt khe'
    ],
    highlightFeaturesEn: [
      'Single moving part diaphragm provides <0.2s ultrafast actuation with external reset',
      'Certified for both water spray cooling and AFFF foam concentrate discharge',
      'Optional corrosion-resistant Rilsan coating for offshore & marine environments'
    ],
    leakageClass: 'UL Listed / FM Zero Leakage',
    testPressureShell: '4.14 MPa (600 PSI)',
    testPressureSeat: '2.07 MPa (300 PSI)',
    referencePriceVnd: 14500000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: '300 PSI', faceToFace: 220, height: 350, weightKg: 22.0, kvFlow: 410, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: '300 PSI', faceToFace: 260, height: 410, weightKg: 35.0, kvFlow: 890, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: '300 PSI', faceToFace: 310, height: 480, weightKg: 52.0, kvFlow: 1650, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: '300 PSI', faceToFace: 380, height: 590, weightKg: 89.0, kvFlow: 4100, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: '300 PSI', faceToFace: 460, height: 710, weightKg: 145.0, kvFlow: 7600, flangeHoles: 8 }
    ],
    characteristics: {
      lifecycle: '50,000 chu trình kích hoạt khẩn cấp • Độ nhạy màng van không đổi suốt 25 năm',
      lifecycleEn: '50,000 emergency trips • 25 years uncompromised diaphragm response',
      tempLimits: '0°C đến +68°C (NFPA 15 / NFPA 16)',
      tempLimitsEn: '0°C to +68°C (NFPA 15 / NFPA 16)',
      sealIntegrity: 'Zero static leakage • Ngăn tuyệt đối nước tràn vào vùng nguy hiểm khi chưa có lệnh',
      sealIntegrityEn: 'Zero static leakage • 100% dry downstream until fire activation',
      mediaApplications: 'Trạm biến áp điện 110kV/220kV/500kV, Kho bồn chứa xăng dầu, Nhà máy lọc dầu, Giàn khoan ngoài khơi',
      mediaApplicationsEn: 'Substation transformers, Petrochemical storage tanks, Offshore oil platforms',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: Tyco DV-5A là đỉnh cao công nghệ van xả tràn với cơ chế External Reset độc quyền, tái kích hoạt hệ thống sau diễn tập chỉ trong 60 giây mà không cần tháo bu lông nắp van.',
      aiSummaryNotesEn: 'Technical Insight: Tyco DV-5A features external reset capability, allowing post-drill system rearming in just 60 seconds without opening the valve cover.'
    }
  },
  {
    id: 'tyco-bfv-300-grooved',
    code: 'Tyco Model BFV-300',
    name: 'Van Bướm Tín Hiệu Rãnh Tyco BFV-300 UL/FM 300 PSI (Mỹ)',
    nameEn: 'Tyco Model BFV-300 Grooved Butterfly Valve with Supervisory Switch (USA)',
    brand: 'Tyco',
    category: 'butterfly',
    categoryLabel: 'Butterfly valve (Van bướm PCCC)',
    categoryLabelEn: 'Fire Supervisory Butterfly Valve',
    systemGroup: 'firefighting',
    systemGroupLabel: 'UL/FM Fire Protection & Risers',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'UL Listed / FM Approved • 300 PSI',
    material: 'Thân Gang cầu Ductile Iron GGG40 sơn Epoxy chống trầy, Đĩa van bọc cao su EPDM lưu hóa, Trục Inox AISI 416',
    materialEn: 'Ductile Iron Body GGG40 Epoxy Coated, EPDM Encapsulated Disc, SS AISI 416 Shaft',
    materialGroup: 'ductile_iron',
    pressure: '300 PSI (20.7 bar / PN25)',
    pressureGroup: 'pn25',
    sizeRange: 'DN50 - DN300 (2" - 12")',
    tempRange: '-10°C đến +80°C',
    connection: 'Đầu nối rãnh cùm (Grooved Ends) theo tiêu chuẩn AWWA C606',
    applicableMedia: ['Nước chữa cháy tự động Sprinkler', 'Đường ống trục đứng Riser PCCC tòa nhà'],
    applicableMediaEn: ['Fire sprinkler water', 'Vertical fire riser piping'],
    standards: ['UL 1091', 'FM 1112', 'NFPA 13', 'AWWA C606'],
    description: 'Van bướm tín hiệu điện nối rãnh Tyco Model BFV-300. Tích hợp sẵn 2 công tắc hành trình (Internal Supervisory Switches) bên trong hộp số gửi tín hiệu cảnh báo về tủ điều khiển ngay khi có hành vi đóng van trái phép.',
    descriptionEn: 'Tyco Model BFV-300 grooved butterfly valve rated for 300 PSI fire protection service. Built-in dual supervisory tamper switches immediately signal the fire panel if the valve is tampered with or closed.',
    highlightFeatures: [
      'Hai công tắc giám sát nội bộ (Dual internal switches) chuẩn chống nước IP65',
      'Đầu rãnh Grooved lắp ghép bằng cùm nhanh chóng, giảm 60% thời gian thi công',
      'Hộp số vận hành trợ lực nhẹ, hiển thị cờ chỉ báo trạng thái vàng phản quang'
    ],
    highlightFeaturesEn: [
      'Dual pre-wired internal tamper switches with IP65 weatherproof enclosure',
      'Grooved coupling ends reduce installation labor time by 60%',
      'High-visibility reflective yellow open/shut flag indicator'
    ],
    leakageClass: 'ISO 5208 Rate A Bubble-Tight',
    testPressureShell: '4.14 MPa (600 PSI)',
    testPressureSeat: '2.07 MPa (300 PSI)',
    referencePriceVnd: 3850000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN65 (2-1/2")', pn: '300 PSI', faceToFace: 97, height: 235, weightKg: 8.5, kvFlow: 350, flangeHoles: 0 },
      { dn: 'DN80 (3")', pn: '300 PSI', faceToFace: 97, height: 250, weightKg: 9.8, kvFlow: 580, flangeHoles: 0 },
      { dn: 'DN100 (4")', pn: '300 PSI', faceToFace: 116, height: 285, weightKg: 12.5, kvFlow: 1100, flangeHoles: 0 },
      { dn: 'DN150 (6")', pn: '300 PSI', faceToFace: 133, height: 350, weightKg: 21.0, kvFlow: 2900, flangeHoles: 0 },
      { dn: 'DN200 (8")', pn: '300 PSI', faceToFace: 148, height: 430, weightKg: 34.0, kvFlow: 5400, flangeHoles: 0 }
    ],
    characteristics: {
      lifecycle: '200,000 chu trình vận hành • Tiếp điểm giám sát mạ vàng chống oxy hóa 25 năm',
      lifecycleEn: '200,000 cycles • Gold-plated tamper switch contacts ensure 25-year reliability',
      tempLimits: '-10°C đến +80°C',
      tempLimitsEn: '-10°C to +80°C',
      sealIntegrity: 'ISO 5208 Rate A / UL 1091 Bubble-Tight',
      sealIntegrityEn: 'ISO 5208 Rate A / UL 1091 Bubble-Tight',
      mediaApplications: 'Trục đứng chữa cháy nhà cao tầng, Tầng hầm để xe, Hệ thống chữa cháy tự động Sprinkler',
      mediaApplicationsEn: 'High-rise sprinkler risers, Basement parking fire loops, Zone isolation valves',
      aiSummaryNotes: 'Đánh Giá Chuyên Gia: Tyco BFV-300 là lựa chọn hàng đầu của các nhà thầu cơ điện PCCC nhờ đầu nối rãnh thi công cực nhanh và tích hợp công tắc giám sát an toàn.',
      aiSummaryNotesEn: 'Technical Insight: Tyco BFV-300 is the contractor favorite for fire risers, offering 60% faster grooved installation and factory-sealed tamper switches.'
    }
  },

  // =========================================================================
  // 6. APC VALVE (https://www.apc-valve.com/about/1.html)
  // AI AUTOMATED REBRANDING TO UTD: BRAND UTD & LOGO CONVERTED TO UTD
  // =========================================================================
  {
    id: 'utd-apc-gate-z41h',
    code: 'UTD-APC Z41H-150',
    name: 'Van Cổng Thép Đúc UTD (Chuẩn APC Valve Tech - Rebranded to UTD)',
    nameEn: 'UTD Cast Steel Gate Valve (APC Valve Tech - Rebranded to UTD)',
    brand: 'UTD',
    category: 'gate',
    categoryLabel: 'Gate valve (Van cổng)',
    categoryLabelEn: 'Gate Valve',
    systemGroup: 'water',
    systemGroupLabel: 'Water & Industrial Infrastructure',
    image: STUDIO_BALL_VALVE_IMAGE,
    badge: 'API 600 • LOGO UTD ĐÚC NỔI • CHUẨN APC',
    material: 'Thép đúc WCB / Đĩa & Trục Inox CF8M / Bệ van tôi cứng Stellite 6, Khắc chìm logo UTD Valve',
    materialEn: 'Cast Steel WCB / CF8M Trim / Stellite 6 Hardfaced, UTD Valve Embossed Crest',
    materialGroup: 'cast_steel',
    pressure: 'Class 150 / PN20 (2.0 MPa)',
    pressureGroup: 'pn25',
    sizeRange: 'DN50 (2") đến DN600 (24")',
    tempRange: '-29°C đến +425°C',
    connection: 'Mặt bích ASME B16.5 Class 150 RF / DIN EN 1092-1',
    applicableMedia: ['Nước cấp công nghiệp', 'Dầu mỏ & Hóa dầu', 'Hơi bão hòa', 'Hóa chất trung tính'],
    applicableMediaEn: ['Industrial Water', 'Petroleum & Petrochemical', 'Saturated Steam', 'Neutral Chemicals'],
    standards: ['API 600', 'ASME B16.34', 'API 598', 'ISO 10434'],
    description: 'Sản phẩm được AI Crawler tự động quét từ nhà máy APC Valve (https://www.apc-valve.com/about/1.html), chuyển đổi thương hiệu hoàn toàn sang UTD Valve. Logo và tem nhãn APC được thay thế bằng logo UTD chính hãng, đảm bảo hồ sơ năng lực dự án đồng nhất.',
    descriptionEn: 'Automated crawler integration from APC Valve (https://www.apc-valve.com/about/1.html), seamlessly converted to UTD Valve specifications with UTD crest emblem and API 600 compliance.',
    highlightFeatures: [
      'Công nghệ đúc chính xác APC Valve, hoàn thiện theo tiêu chuẩn thương hiệu UTD cao cấp',
      'Đĩa van hình nêm linh hoạt (Flexible Wedge) chống kẹt nhiệt độ cao',
      'Logo UTD và mã quy cách được dập nổi trực tiếp trên thân van và tem nhãn kim loại không gỉ'
    ],
    highlightFeaturesEn: [
      'Engineered with APC Valve metallurgy, rebranded exclusively to UTD quality specs',
      'Flexible wedge disc design prevents thermal binding at high temperatures',
      'Embossed UTD trademark on cast body and stainless nameplate'
    ],
    leakageClass: 'API 598 Metal-to-Metal Tightness',
    testPressureShell: '3.0 MPa (450 PSI)',
    testPressureSeat: '2.2 MPa (315 PSI)',
    referencePriceVnd: 4250000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN50 (2")', pn: 'Class 150', faceToFace: 178, height: 395, weightKg: 22.0, kvFlow: 280, flangeHoles: 4 },
      { dn: 'DN80 (3")', pn: 'Class 150', faceToFace: 203, height: 490, weightKg: 35.0, kvFlow: 650, flangeHoles: 4 },
      { dn: 'DN100 (4")', pn: 'Class 150', faceToFace: 229, height: 585, weightKg: 49.0, kvFlow: 1150, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'Class 150', faceToFace: 267, height: 780, weightKg: 82.0, kvFlow: 2700, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'Class 150', faceToFace: 292, height: 960, weightKg: 135.0, kvFlow: 4900, flangeHoles: 8 }
    ],
    characteristics: {
      lifecycle: '150,000 chu trình đóng mở • Bề mặt tôi Stellite chống mài mòn dòng chảy',
      lifecycleEn: '150,000 cycles • Stellite hardfacing prevents erosive cavitation',
      tempLimits: '-29°C đến +425°C',
      tempLimitsEn: '-29°C to +425°C',
      sealIntegrity: 'API 598 Zero Liquid Leakage',
      sealIntegrityEn: 'API 598 Zero Liquid Leakage',
      mediaApplications: 'Trạm bơm tăng áp, Nhà máy hóa dầu, Hệ thống cấp nước đô thị',
      mediaApplicationsEn: 'Booster pump stations, Petrochemical plants, Municipal water distribution',
      aiSummaryNotes: 'AI Rebranding UTD: Dòng van cổng chuyển đổi từ APC Valve sang thương hiệu UTD đạt đầy đủ chứng chỉ API 600, thay thế hoàn toàn tem nhãn sang logo UTD phục vụ đấu thầu dự án.',
      aiSummaryNotesEn: 'AI Rebranded UTD: APC Valve gate valve transformed into UTD product line, certified to API 600 with UTD crest branding for project tenders.'
    }
  },
  {
    id: 'utd-apc-butterfly-d343h',
    code: 'UTD-APC D343H-16',
    name: 'Van Bướm Kim Loại 3 Lệch Tâm UTD (Chuẩn APC Valve - Logo UTD)',
    nameEn: 'UTD Triple Offset Metal Seated Butterfly Valve (APC Tech - Logo UTD)',
    brand: 'UTD',
    category: 'butterfly',
    categoryLabel: 'Butterfly valve (Van bướm)',
    categoryLabelEn: 'Butterfly Valve',
    systemGroup: 'steam',
    systemGroupLabel: 'High Pressure Steam & Thermal Loop',
    image: VALVE_DETAIL_IMAGE,
    badge: 'TRIPLE OFFSET • CHỊU NHIỆT 400°C • LOGO UTD',
    material: 'Thân thép đúc WCB, Vòng đệm nhiều lớp Inox 316 + Graphite, Trục 17-4PH chống gãy mỏi',
    materialEn: 'WCB Body, Multi-layer SS316 + Graphite Laminated Seal, 17-4PH Stem',
    materialGroup: 'cast_steel',
    pressure: 'PN16 / PN25 / Class 150',
    pressureGroup: 'pn25',
    sizeRange: 'DN80 (3") đến DN500 (20")',
    tempRange: '-40°C đến +425°C',
    connection: 'Mặt bích Wafer / Lug / Double Flanged',
    applicableMedia: ['Hơi nóng lò hơi (Steam)', 'Khí thải nhiệt độ cao', 'Dầu nóng truyền nhiệt', 'Nước ngưng áp lực'],
    applicableMediaEn: ['Steam', 'High Temp Exhaust Gas', 'Thermal Oil', 'Pressurized Condensate'],
    standards: ['API 609 Cat. B', 'ASME B16.34', 'ISO 5752', 'BS EN 593'],
    description: 'Van bướm kim loại kín khít 3 lệch tâm (Triple Offset) quét tự động từ APC Valve và chuyển đổi nhận diện sang UTD Valve. Cơ chế đóng mở ma sát bằng 0 (Zero Friction) kéo dài tuổi thọ gioăng, đạt kín tuyệt đối Rate A ngay cả ở 400°C.',
    descriptionEn: 'Triple offset metal seated butterfly valve harvested from APC Valve and transformed into UTD brand portfolio. Frictionless quarter-turn action delivers bidirectional bubble-tight shutoff at 400°C.',
    highlightFeatures: [
      'Công nghệ Triple Eccentric 3 lệch tâm triệt tiêu ma sát tại vùng làm kín',
      'Gioăng kim loại Inox 316 nhiều lớp ép than chì chịu nhiệt và chống cháy (Fire-Safe API 607)',
      'Thương hiệu UTD Valve chính thức thay thế toàn bộ logo APC trên sản phẩm'
    ],
    highlightFeaturesEn: [
      'Triple eccentric geometry eliminates rubbing during disc travel',
      'Laminated SS316 + graphite seal ring qualified to API 607 Fire-Safe standards',
      'Official UTD Valve trademark completely replaces APC emblems'
    ],
    leakageClass: 'ISO 5208 Rate A / API 598 Zero Leakage',
    testPressureShell: '3.75 MPa',
    testPressureSeat: '2.75 MPa',
    referencePriceVnd: 5900000,
    cadFileAvailable: true,
    specs: [
      { dn: 'DN80 (3")', pn: 'PN25', faceToFace: 114, height: 260, weightKg: 14.5, kvFlow: 380, flangeHoles: 8 },
      { dn: 'DN100 (4")', pn: 'PN25', faceToFace: 127, height: 300, weightKg: 19.0, kvFlow: 650, flangeHoles: 8 },
      { dn: 'DN150 (6")', pn: 'PN25', faceToFace: 140, height: 385, weightKg: 32.0, kvFlow: 1800, flangeHoles: 8 },
      { dn: 'DN200 (8")', pn: 'PN25', faceToFace: 152, height: 460, weightKg: 52.0, kvFlow: 3400, flangeHoles: 12 }
    ],
    characteristics: {
      lifecycle: '250,000 chu trình vận hành không kẹt dính ở nhiệt độ 400°C',
      lifecycleEn: '250,000 cycles without galling or binding under 400°C steam service',
      tempLimits: '-40°C đến +425°C',
      tempLimitsEn: '-40°C to +425°C',
      sealIntegrity: 'ISO 5208 Rate A Bubble-Tight Bidirectional',
      sealIntegrityEn: 'ISO 5208 Rate A Bubble-Tight Bidirectional',
      mediaApplications: 'Đường ống hơi quá nhiệt, Nhà máy nhiệt điện, Lò sấy công nghiệp, Hóa dầu',
      mediaApplicationsEn: 'Superheated steam piping, Thermal power plants, Industrial drying, Refineries',
      aiSummaryNotes: 'Sản phẩm chuyển đổi từ APC Valve sang UTD: Van bướm 3 lệch tâm kín khít kim loại giải quyết triệt để sự cố rò rỉ van bướm cao su thông thường trong môi trường hơi nhiệt cao.',
      aiSummaryNotesEn: 'APC Valve to UTD Conversion: Triple offset metal seated valve delivers zero-leakage shutoff for extreme steam systems.'
    }
  }
];

