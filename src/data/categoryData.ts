import { CategoryItem } from '../types/valve';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { value: 'knife_gate', label: 'Knife gate valve (Van cổng dao)', labelEn: 'Knife Gate Valve', systemGroup: 'water' },
  { value: 'ball', label: 'Ball valves (Van bi)', labelEn: 'Ball Valves', systemGroup: 'oilgas' },
  { value: 'check', label: 'Check Valves (Van một chiều)', labelEn: 'Check Valves', systemGroup: 'water' },
  { value: 'instrument', label: 'Instrument (Van & thiết bị đo lường)', labelEn: 'Instrumentation & Switches', systemGroup: 'instrument' },
  { value: 'strainer', label: 'Strainers (Lọc Y / Lọc rọ)', labelEn: 'Strainers', systemGroup: 'water' },
  { value: 'solenoid', label: 'Solenoid valves (Van điện từ)', labelEn: 'Solenoid Valves', systemGroup: 'steam' },
  { value: 'resilient_gate', label: 'Resilient seat gate valves (Van cổng đệm mềm)', labelEn: 'Resilient Seat Gate', systemGroup: 'water' },
  { value: 'foot_valve', label: 'Foot valve (Rọ bơm / Luppe)', labelEn: 'Foot Valve', systemGroup: 'water' },
  { value: 'gate', label: 'Gate valve (Van cửa / Van cổng ty nổi)', labelEn: 'Gate Valve', systemGroup: 'firefighting' },
  { value: 'water_control', label: 'Water Control Valve (Van điều khiển thủy lực & đồng hồ)', labelEn: 'Water Control Valve', systemGroup: 'water' },
  { value: 'auto_air_vent', label: 'Auto Air Vent valve (Van xả khí tự động)', labelEn: 'Auto Air Vent Valve', systemGroup: 'water' },
  { value: 'actuator', label: 'Actuators – instruments (Van điều khiển khí nén/điện)', labelEn: 'Pneumatic Actuated Valves', systemGroup: 'instrument' },
  { value: 'flexible_joint', label: 'Flexible Joint (Khớp nối mềm inox chống rung)', labelEn: 'Flexible Joint', systemGroup: 'water' },
  { value: 'globe', label: 'Globe Valves (Van cầu hơi Bellows Seal)', labelEn: 'Globe Valves', systemGroup: 'steam' },
  { value: 'rubber_joint', label: 'Rubber joints (Khớp nối cao su giảm chấn)', labelEn: 'Rubber Joint', systemGroup: 'water' },
  { value: 'expansion_joint', label: 'Expansion Joint (Khớp giãn nở kim loại 2 lớp)', labelEn: 'Expansion Joint', systemGroup: 'steam' },
  { value: 'prv', label: 'Pressure Reducing valve (Van giảm áp màng pilot)', labelEn: 'Pressure Reducing Valve', systemGroup: 'steam' },
  { value: 'balancing', label: 'Balancing valves (Van cân bằng cơ học & PICV)', labelEn: 'Balancing Valve', systemGroup: 'hvac' },
  { value: 'butterfly', label: 'Butterfly valve (Van bướm & van bướm hiệu suất cao)', labelEn: 'Butterfly Valve', systemGroup: 'water' },
  { value: 'safety_valve', label: 'Safety valve (Van an toàn lò hơi)', labelEn: 'Safety Valve', systemGroup: 'steam' },
];

const CATEGORIES_STORAGE_KEY = 'utd_industracorp_categories_v1';

export function loadCategoriesFromStorage(): CategoryItem[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_CATEGORIES;
}

export function saveCategoriesToStorage(cats: CategoryItem[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
  } catch {
    // ignore
  }
}

export interface AuthorizedBrand {
  id: string;
  name: string;
  origin: string;
  originEn: string;
  flag: string;
  tagline: string;
  taglineEn: string;
  specialty: string;
  specialtyEn: string;
  badge: string;
  badgeEn: string;
  accentColor: string;
}

export const AUTHORIZED_BRANDS: AuthorizedBrand[] = [
  {
    id: 'utd',
    name: 'UTD Valves (Brand USA)',
    origin: 'Nhãn hiệu USA • Xuất xứ: Thailand, Taiwan, China',
    originEn: 'USA Brand • Origin: Thailand, Taiwan, China',
    flag: '🇺🇸',
    tagline: 'Van công nghiệp thương hiệu Mỹ - Xuất xứ Thái Lan, Đài Loan, Trung Quốc',
    taglineEn: 'American Brand Industrial Valves - Manufactured in Thailand, Taiwan, China',
    specialty: 'Van Bi, Van Bướm, Van Cổng, Van Cân Bằng, Van Cầu, Van 1 Chiều, Khớp Nối',
    specialtyEn: 'Ball, Butterfly, Gate, Balancing, Globe, Check Valves, Flexible Joints',
    badge: 'Brand USA • OEM Global',
    badgeEn: 'Brand USA • Global OEM',
    accentColor: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'jmv',
    name: 'JMV-Korea',
    origin: 'Hàn Quốc (South Korea)',
    originEn: 'South Korea (KS / JIS Standards)',
    flag: '🇰🇷',
    tagline: 'Van công nghiệp & hàng hải tiêu chuẩn KS/JIS Hàn Quốc',
    taglineEn: 'Industrial & Marine Valves certified to KS/JIS standards',
    specialty: 'Van Gang Cầu, Van Thép Đúc WCB, Van Hơi Nóng, Van 1 Chiều',
    specialtyEn: 'Ductile Iron Valves, Cast Steel WCB, Steam Valves, Check Valves',
    badge: 'Nhập Khẩu Hàn Quốc',
    badgeEn: 'Imported from South Korea',
    accentColor: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'johnson',
    name: 'Johnson Controls',
    origin: 'Mỹ (USA / Global)',
    originEn: 'USA / Global BMS & Controls',
    flag: '🇺🇸',
    tagline: 'Hệ thống van điều khiển HVAC, Chiller & BMS tòa nhà',
    taglineEn: 'Commercial HVAC, Chiller & Building Management Valve Systems',
    specialty: 'Van Cân Bằng PICV, Van Điều Khiển Tuyến Tính 2 Ngả / 3 Ngả VG Series',
    specialtyEn: 'Pressure Independent Control Valves (PICV), 2-Way/3-Way Modulating Valves',
    badge: 'Tiêu Chuẩn Mỹ',
    badgeEn: 'USA Standard',
    accentColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'tyco',
    name: 'Tyco',
    origin: 'Mỹ (USA)',
    originEn: 'USA (Fire Protection)',
    flag: '🇺🇸',
    tagline: 'Thiết bị & van báo động PCCC tiêu chuẩn UL / FM khắt khe',
    taglineEn: 'Stringent UL/FM Certified Fire Fighting & Alarm Systems',
    specialty: 'Van Báo Động Báo Cháy Alarm Check, Deluge Valve, Cụm Van PCCC',
    specialtyEn: 'Alarm Check Valves, Deluge Valves, Pre-Action Systems, Fire Risers',
    badge: 'UL / FM Approved',
    badgeEn: 'UL / FM Approved',
    accentColor: 'from-red-500 to-rose-600',
  },
  {
    id: 'shield',
    name: 'Shield Valve UK',
    origin: 'Vương Quốc Anh (United Kingdom)',
    originEn: 'United Kingdom (British Standard)',
    flag: '🇬🇧',
    tagline: 'Van PCCC & cơ điện HVAC tiêu chuẩn British Standard',
    taglineEn: 'British Standard compliant Fire Protection & MEP Valves',
    specialty: 'Van Cổng Ty Nổi OS&Y, Van Bướm Tín Hiệu Điện, Rọ Bơm Chân Hút',
    specialtyEn: 'OS&Y Rising Stem Gate Valves, Supervisory Butterfly Valves, Foot Valves',
    badge: 'British Standard',
    badgeEn: 'British Standard',
    accentColor: 'from-sky-500 to-blue-700',
  },
  {
    id: 'vyc',
    name: 'VYC-Spain',
    origin: 'Tây Ban Nha (Spain)',
    originEn: 'Spain (European Union)',
    flag: '🇪🇸',
    tagline: 'Van an toàn & giải pháp hơi nóng áp lực cao Châu Âu',
    taglineEn: 'European High-Pressure Safety Valves & Steam Solutions',
    specialty: 'Van An Toàn Nồi Hơi Full Lift, Bẫy Hơi Đồng Tiền, Van Xả Đáy',
    specialtyEn: 'Full Lift Boiler Safety Valves, Thermodynamic Traps, Blowdown Valves',
    badge: 'Made in Spain (EU)',
    badgeEn: 'Made in Spain (EU)',
    accentColor: 'from-amber-600 to-red-600',
  },
];
