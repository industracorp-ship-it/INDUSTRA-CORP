/**
 * High-Precision Engineering Unit Converter Utility for Valve Specialists & Field Engineers
 * Covers Flow Coefficients (Kv / Cv), Operating Pressure (bar, psi, kPa, MPa), and Temperature (°C, °F, K)
 */

export interface FlowConversionResult {
  kv: number;       // m3/h at deltaP = 1 bar (Water 20°C)
  cv: number;       // US GPM at deltaP = 1 psi (Water 60°F)
  qM3PerHour: number; // Volumetric flow at standard deltaP
  qGpm: number;
}

export interface PressureConversionResult {
  bar: number;
  psi: number;
  kpa: number;
  mpa: number;
  kgfCm2: number;
  standardRating: string;
}

export interface TemperatureConversionResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
  recommendedTrim: string;
}

/**
 * Standard Flow Coefficient Constants (DIN EN 60534-2-1 / ISA 75.01.01)
 * Cv = 1.15607 * Kv
 * Kv = 0.86500 * Cv
 */
const KV_TO_CV_FACTOR = 1.15607;

export function convertFlow(value: number, fromUnit: 'kv' | 'cv', deltaPBar: number = 1): FlowConversionResult {
  const val = Math.max(0, Number(value) || 0);
  const dp = Math.max(0.01, Number(deltaPBar) || 1);

  let kv: number;
  let cv: number;

  if (fromUnit === 'kv') {
    kv = val;
    cv = Number((val * KV_TO_CV_FACTOR).toFixed(2));
  } else {
    cv = val;
    kv = Number((val / KV_TO_CV_FACTOR).toFixed(2));
  }

  // Flow rate Q = Kv * sqrt(DeltaP / SG) where SG=1 for water
  const qM3PerHour = Number((kv * Math.sqrt(dp)).toFixed(2));
  const qGpm = Number((cv * Math.sqrt(dp * 14.5038)).toFixed(2));

  return {
    kv,
    cv,
    qM3PerHour,
    qGpm
  };
}

/**
 * Pressure conversion across bar, psi, kPa, MPa, kgf/cm2
 */
export function convertPressure(value: number, fromUnit: 'bar' | 'psi' | 'kpa' | 'mpa'): PressureConversionResult {
  const val = Number(value) || 0;
  let bar = 0;

  switch (fromUnit) {
    case 'bar':
      bar = val;
      break;
    case 'psi':
      bar = val / 14.50377;
      break;
    case 'kpa':
      bar = val / 100;
      break;
    case 'mpa':
      bar = val * 10;
      break;
  }

  const psi = Number((bar * 14.50377).toFixed(2));
  const kpa = Number((bar * 100).toFixed(1));
  const mpa = Number((bar * 0.1).toFixed(3));
  const kgfCm2 = Number((bar * 1.01972).toFixed(2));

  let standardRating = 'Áp lực thông thường';
  if (bar <= 10) standardRating = 'PN10 / Class 75';
  else if (bar <= 16) standardRating = 'PN16 / 232 PSI (Standard HVAC/Water)';
  else if (bar <= 20) standardRating = 'Class 150 (ANSI 150) / 285 PSI';
  else if (bar <= 25) standardRating = 'PN25 / 362 PSI';
  else if (bar <= 40) standardRating = 'PN40 / Class 300 (Hơi nóng & Dầu khí)';
  else if (bar <= 100) standardRating = 'Class 600 (High Pressure API 6D)';
  else standardRating = 'Class 900 - 2500 (Extreme High Pressure)';

  return {
    bar: Number(bar.toFixed(2)),
    psi,
    kpa,
    mpa,
    kgfCm2,
    standardRating
  };
}

/**
 * Temperature conversion across Celsius, Fahrenheit, Kelvin
 */
export function convertTemperature(value: number, fromUnit: 'c' | 'f' | 'k'): TemperatureConversionResult {
  const val = Number(value) || 0;
  let c = 0;

  switch (fromUnit) {
    case 'c':
      c = val;
      break;
    case 'f':
      c = (val - 32) / 1.8;
      break;
    case 'k':
      c = val - 273.15;
      break;
  }

  const fahrenheit = Number((c * 1.8 + 32).toFixed(1));
  const kelvin = Number((c + 273.15).toFixed(1));
  const celsius = Number(c.toFixed(1));

  let recommendedTrim = 'Gioăng cao su NBR/EPDM (-20°C đến +120°C)';
  if (c < -50) recommendedTrim = 'Vật liệu Cryogenic âm sâu (Inox 316/CF8M + PTFE kéo dài ty van)';
  else if (c < 0) recommendedTrim = 'Hệ thống lạnh Chiller (-20°C đến 0°C, EPDM/Inox)';
  else if (c > 350) recommendedTrim = 'Nhiệt độ siêu cao: Thép đúc WCB/Stellite + Gioăng kim loại Inconel (Zero Leak)';
  else if (c > 200) recommendedTrim = 'Hơi nóng Steam (200°C - 350°C): Thép đúc WCB + Đệm làm kín Graphite / Bellows Seal';
  else if (c > 120) recommendedTrim = 'Nhiệt độ trung bình (120°C - 200°C): PTFE / R-PTFE gia cường sợi thủy tinh';

  return {
    celsius,
    fahrenheit,
    kelvin,
    recommendedTrim
  };
}

/**
 * Nominal Diameter Conversion (DN mm <-> Inches)
 */
export const DN_INCH_MAP: { dn: string; inch: string; mm: number }[] = [
  { dn: 'DN15', inch: '1/2"', mm: 15 },
  { dn: 'DN20', inch: '3/4"', mm: 20 },
  { dn: 'DN25', inch: '1"', mm: 25 },
  { dn: 'DN32', inch: '1-1/4"', mm: 32 },
  { dn: 'DN40', inch: '1-1/2"', mm: 40 },
  { dn: 'DN50', inch: '2"', mm: 50 },
  { dn: 'DN65', inch: '2-1/2"', mm: 65 },
  { dn: 'DN80', inch: '3"', mm: 80 },
  { dn: 'DN100', inch: '4"', mm: 100 },
  { dn: 'DN125', inch: '5"', mm: 125 },
  { dn: 'DN150', inch: '6"', mm: 150 },
  { dn: 'DN200', inch: '8"', mm: 200 },
  { dn: 'DN250', inch: '10"', mm: 250 },
  { dn: 'DN300', inch: '12"', mm: 300 },
  { dn: 'DN350', inch: '14"', mm: 350 },
  { dn: 'DN400', inch: '16"', mm: 400 },
  { dn: 'DN500', inch: '20"', mm: 500 },
  { dn: 'DN600', inch: '24"', mm: 600 }
];
