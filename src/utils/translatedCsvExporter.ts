import { ValveProduct, SupportedLanguage } from '../types/valve';
import { getLocalizedProduct, translateTechString } from './engineeringTranslator';
import { portalStorage } from '../services/portalStorage';

export type ExportLanguageTarget = 'en' | 'zh' | 'bilingual_en' | 'bilingual_zh' | 'multilingual_all';

export interface CsvExportOptions {
  targetLang: ExportLanguageTarget;
  exchangeRateUsd?: number; // e.g. 25450 VND/USD
  includeSpecsSummary?: boolean;
  categoriesFilter?: string[]; // Optional filter
}

export interface CsvExportResult {
  fileName: string;
  csvContent: string;
  totalProducts: number;
  targetLang: ExportLanguageTarget;
  fileSizeKb: number;
}

/**
 * Helper to escape CSV cell contents safely according to RFC 4180
 */
function escapeCsvCell(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  // If it contains quotes, commas, newlines, or semicolons, wrap in quotes and escape internal quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Format a number as clean USD currency
 */
function formatUsdPrice(vndAmount: number, rate = 25450): string {
  if (!vndAmount || isNaN(vndAmount)) return '0.00';
  const usd = vndAmount / rate;
  return usd.toFixed(2);
}

/**
 * Automates the translation and CSV compilation of the entire product catalog
 * into professional English (EN), Chinese (ZH), or Multilingual Master matrices.
 */
export function generateTranslatedCatalogCsv(
  products: ValveProduct[],
  options: CsvExportOptions
): CsvExportResult {
  const {
    targetLang = 'en',
    exchangeRateUsd = 25450,
    includeSpecsSummary = true,
    categoriesFilter = []
  } = options;

  // Filter products if a subset was requested
  const filteredProducts = categoriesFilter.length > 0
    ? products.filter(p => categoriesFilter.includes(p.category))
    : products;

  const dateStr = new Date().toISOString().split('T')[0];
  let headers: string[] = [];
  const rows: string[] = [];
  let fileName = '';

  if (targetLang === 'en') {
    fileName = `UTD_Valves_Catalog_EN_Export_${dateStr}.csv`;
    headers = [
      'Model_Code',
      'Product_Name_EN',
      'Category_EN',
      'System_Group_EN',
      'Body_Material_EN',
      'Pressure_Rating',
      'Size_Range',
      'Working_Temperature',
      'End_Connection_EN',
      'Applicable_Media_EN',
      'Design_Standards',
      'Leakage_Class',
      'Shell_Test_Pressure',
      'Seat_Test_Pressure',
      'Key_Features_EN',
      'Technical_Description_EN',
      'Unit_Price_USD',
      'Reference_Price_VND',
      'Available_Sizes_Specs',
      'Flow_Kv_Range',
      'Brand_Manufacturer',
      'Warranty_CO_CQ'
    ];

    filteredProducts.forEach((p) => {
      const loc = getLocalizedProduct(p, 'en');
      const usdPrice = formatUsdPrice(p.referencePriceVnd, exchangeRateUsd);
      const mediaStr = (loc.applicableMedia || []).join('; ');
      const featuresStr = (loc.highlightFeatures || []).join('; ');
      const standardsStr = (p.standards || []).join('; ');
      
      const specsDnList = p.specs && p.specs.length > 0 
        ? p.specs.map(s => s.dn).join(', ')
        : p.sizeRange;
      
      const kvList = p.specs && p.specs.length > 0 && p.specs.some(s => s.kvFlow > 0)
        ? `Kvs ${Math.min(...p.specs.map(s => s.kvFlow))} - ${Math.max(...p.specs.map(s => s.kvFlow))} m3/h`
        : 'Engineered as per spec';

      rows.push([
        escapeCsvCell(p.code),
        escapeCsvCell(loc.name),
        escapeCsvCell(loc.categoryLabel),
        escapeCsvCell(loc.systemGroupLabel),
        escapeCsvCell(loc.material),
        escapeCsvCell(p.pressure),
        escapeCsvCell(p.sizeRange),
        escapeCsvCell(p.tempRange),
        escapeCsvCell(loc.connection),
        escapeCsvCell(mediaStr),
        escapeCsvCell(standardsStr),
        escapeCsvCell(loc.leakageClass || 'ISO 5208 Rate A Bubble-Tight'),
        escapeCsvCell(p.testPressureShell || '1.5 x PN'),
        escapeCsvCell(p.testPressureSeat || '1.1 x PN'),
        escapeCsvCell(featuresStr),
        escapeCsvCell(loc.description),
        escapeCsvCell(`$${usdPrice}`),
        escapeCsvCell(p.referencePriceVnd.toLocaleString('vi-VN')),
        escapeCsvCell(specsDnList),
        escapeCsvCell(kvList),
        escapeCsvCell(p.brand || 'UTD Industrial Valves (Industracorp)'),
        escapeCsvCell('18 Months Factory Warranty / Full Mill Test 3.1 & CO/CQ')
      ].join(','));
    });

  } else if (targetLang === 'zh') {
    fileName = `UTD_Valves_Catalog_ZH_Export_${dateStr}.csv`;
    headers = [
      '产品型号_Model',
      '产品名称_Name_ZH',
      '阀门类别_Category_ZH',
      '系统应用_System_ZH',
      '阀体材质_Material_ZH',
      '公称压力_Pressure',
      '公称通径_Size_Range',
      '工作温度_Temp_Range',
      '连接方式_Connection_ZH',
      '适用介质_Media_ZH',
      '执行标准_Standards',
      '泄漏等级_Leakage_Class',
      '壳体试验压力_Shell_Test',
      '密封试验压力_Seat_Test',
      '核心特性_Features_ZH',
      '技术说明_Description_ZH',
      '美金参考单价_USD',
      '越盾参考单价_VND',
      '供货规格清单_Specs',
      '流量系数_Kv',
      '制造商品牌_Brand',
      '质量与质保_Warranty'
    ];

    filteredProducts.forEach((p) => {
      const loc = getLocalizedProduct(p, 'zh');
      const usdPrice = formatUsdPrice(p.referencePriceVnd, exchangeRateUsd);
      const mediaStr = (loc.applicableMedia || []).join('; ');
      const featuresStr = (loc.highlightFeatures || []).join('; ');
      const standardsStr = (p.standards || []).join('; ');

      const specsDnList = p.specs && p.specs.length > 0 
        ? p.specs.map(s => s.dn).join(', ')
        : p.sizeRange;

      const kvList = p.specs && p.specs.length > 0 && p.specs.some(s => s.kvFlow > 0)
        ? `Kv ${Math.min(...p.specs.map(s => s.kvFlow))} - ${Math.max(...p.specs.map(s => s.kvFlow))} m³/h`
        : '按工程技术规格定制';

      rows.push([
        escapeCsvCell(p.code),
        escapeCsvCell(loc.name),
        escapeCsvCell(loc.categoryLabel),
        escapeCsvCell(loc.systemGroupLabel),
        escapeCsvCell(loc.material),
        escapeCsvCell(p.pressure),
        escapeCsvCell(p.sizeRange),
        escapeCsvCell(p.tempRange),
        escapeCsvCell(loc.connection),
        escapeCsvCell(mediaStr),
        escapeCsvCell(standardsStr),
        escapeCsvCell(loc.leakageClass || 'ISO 5208 Rate A (气泡级零泄漏)'),
        escapeCsvCell(p.testPressureShell || '1.5 x PN'),
        escapeCsvCell(p.testPressureSeat || '1.1 x PN'),
        escapeCsvCell(featuresStr),
        escapeCsvCell(loc.description),
        escapeCsvCell(`$${usdPrice}`),
        escapeCsvCell(p.referencePriceVnd.toLocaleString('vi-VN')),
        escapeCsvCell(specsDnList),
        escapeCsvCell(kvList),
        escapeCsvCell(p.brand || 'UTD 工业阀门 (Industracorp Vietnam)'),
        escapeCsvCell('出厂质保18个月 / 附带 Mill Test 3.1 & 原产地证明 CO/CQ')
      ].join(','));
    });

  } else if (targetLang === 'bilingual_en') {
    fileName = `UTD_Valves_Bilingual_VI_EN_${dateStr}.csv`;
    headers = [
      'Model_Code',
      'Name_VI',
      'Name_EN',
      'Category_VI',
      'Category_EN',
      'Material_VI',
      'Material_EN',
      'Pressure_Rating',
      'Size_Range',
      'Temperature_Range',
      'Connection_VI',
      'Connection_EN',
      'Media_VI',
      'Media_EN',
      'Standards',
      'Leakage_Class',
      'Features_VI',
      'Features_EN',
      'Description_VI',
      'Description_EN',
      'Price_USD',
      'Price_VND',
      'Brand'
    ];

    filteredProducts.forEach((p) => {
      const en = getLocalizedProduct(p, 'en');
      const usdPrice = formatUsdPrice(p.referencePriceVnd, exchangeRateUsd);

      rows.push([
        escapeCsvCell(p.code),
        escapeCsvCell(p.name),
        escapeCsvCell(en.name),
        escapeCsvCell(p.categoryLabel),
        escapeCsvCell(en.categoryLabel),
        escapeCsvCell(p.material),
        escapeCsvCell(en.material),
        escapeCsvCell(p.pressure),
        escapeCsvCell(p.sizeRange),
        escapeCsvCell(p.tempRange),
        escapeCsvCell(p.connection),
        escapeCsvCell(en.connection),
        escapeCsvCell(p.applicableMedia.join('; ')),
        escapeCsvCell(en.applicableMedia.join('; ')),
        escapeCsvCell(p.standards.join('; ')),
        escapeCsvCell(p.leakageClass),
        escapeCsvCell(p.highlightFeatures.join('; ')),
        escapeCsvCell(en.highlightFeatures.join('; ')),
        escapeCsvCell(p.description),
        escapeCsvCell(en.description),
        escapeCsvCell(`$${usdPrice}`),
        escapeCsvCell(p.referencePriceVnd.toLocaleString('vi-VN')),
        escapeCsvCell(p.brand || 'UTD Industrial Valves')
      ].join(','));
    });

  } else if (targetLang === 'bilingual_zh') {
    fileName = `UTD_Valves_Bilingual_VI_ZH_${dateStr}.csv`;
    headers = [
      'Model_Code',
      'Name_VI',
      'Name_ZH_中文',
      'Category_VI',
      'Category_ZH_中文',
      'Material_VI',
      'Material_ZH_中文',
      'Pressure_Rating',
      'Size_Range',
      'Temperature_Range',
      'Connection_VI',
      'Connection_ZH_中文',
      'Media_VI',
      'Media_ZH_中文',
      'Standards',
      'Leakage_Class',
      'Features_VI',
      'Features_ZH_中文',
      'Description_VI',
      'Description_ZH_中文',
      'Price_USD',
      'Price_VND',
      'Brand'
    ];

    filteredProducts.forEach((p) => {
      const zh = getLocalizedProduct(p, 'zh');
      const usdPrice = formatUsdPrice(p.referencePriceVnd, exchangeRateUsd);

      rows.push([
        escapeCsvCell(p.code),
        escapeCsvCell(p.name),
        escapeCsvCell(zh.name),
        escapeCsvCell(p.categoryLabel),
        escapeCsvCell(zh.categoryLabel),
        escapeCsvCell(p.material),
        escapeCsvCell(zh.material),
        escapeCsvCell(p.pressure),
        escapeCsvCell(p.sizeRange),
        escapeCsvCell(p.tempRange),
        escapeCsvCell(p.connection),
        escapeCsvCell(zh.connection),
        escapeCsvCell(p.applicableMedia.join('; ')),
        escapeCsvCell(zh.applicableMedia.join('; ')),
        escapeCsvCell(p.standards.join('; ')),
        escapeCsvCell(p.leakageClass),
        escapeCsvCell(p.highlightFeatures.join('; ')),
        escapeCsvCell(zh.highlightFeatures.join('; ')),
        escapeCsvCell(p.description),
        escapeCsvCell(zh.description),
        escapeCsvCell(`$${usdPrice}`),
        escapeCsvCell(p.referencePriceVnd.toLocaleString('vi-VN')),
        escapeCsvCell(p.brand || 'UTD Industrial Valves')
      ].join(','));
    });

  } else {
    // Trilingual Master Matrix: VI - EN - ZH
    fileName = `UTD_Valves_Master_Matrix_VI_EN_ZH_${dateStr}.csv`;
    headers = [
      'Model_Code',
      'Name_VI',
      'Name_EN',
      'Name_ZH_中文',
      'Category_VI',
      'Category_EN',
      'Category_ZH',
      'Material_VI',
      'Material_EN',
      'Material_ZH',
      'Pressure_Rating',
      'Size_Range',
      'Connection_EN',
      'Connection_ZH',
      'Media_EN',
      'Media_ZH',
      'Standards',
      'Price_USD',
      'Price_VND',
      'Brand_Manufacturer'
    ];

    filteredProducts.forEach((p) => {
      const en = getLocalizedProduct(p, 'en');
      const zh = getLocalizedProduct(p, 'zh');
      const usdPrice = formatUsdPrice(p.referencePriceVnd, exchangeRateUsd);

      rows.push([
        escapeCsvCell(p.code),
        escapeCsvCell(p.name),
        escapeCsvCell(en.name),
        escapeCsvCell(zh.name),
        escapeCsvCell(p.categoryLabel),
        escapeCsvCell(en.categoryLabel),
        escapeCsvCell(zh.categoryLabel),
        escapeCsvCell(p.material),
        escapeCsvCell(en.material),
        escapeCsvCell(zh.material),
        escapeCsvCell(p.pressure),
        escapeCsvCell(p.sizeRange),
        escapeCsvCell(en.connection),
        escapeCsvCell(zh.connection),
        escapeCsvCell(en.applicableMedia.join('; ')),
        escapeCsvCell(zh.applicableMedia.join('; ')),
        escapeCsvCell(p.standards.join('; ')),
        escapeCsvCell(`$${usdPrice}`),
        escapeCsvCell(p.referencePriceVnd.toLocaleString('vi-VN')),
        escapeCsvCell(p.brand || 'UTD Industrial Valves')
      ].join(','));
    });
  }

  // Prepend \uFEFF UTF-8 BOM so Microsoft Excel and international systems display Vietnamese and Chinese characters crisply
  const fullCsv = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
  const fileSizeKb = Math.round((new Blob([fullCsv]).size) / 1024);

  return {
    fileName,
    csvContent: fullCsv,
    totalProducts: filteredProducts.length,
    targetLang,
    fileSizeKb
  };
}

/**
 * Triggers direct browser download of the translated CSV file and logs audit record
 */
export function downloadTranslatedCatalogCsv(
  products: ValveProduct[],
  options: CsvExportOptions
): CsvExportResult {
  const result = generateTranslatedCatalogCsv(products, options);
  
  const blob = new Blob([result.csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Automatic Audit Logging
  const langLabel = 
    options.targetLang === 'en' ? 'Tiếng Anh (EN - International Export)' :
    options.targetLang === 'zh' ? 'Tiếng Trung (ZH - 中文外贸出口)' :
    options.targetLang === 'bilingual_en' ? 'Song Ngữ Việt - Anh (VI - EN)' :
    options.targetLang === 'bilingual_zh' ? 'Song Ngữ Việt - Trung (VI - ZH)' : 'Tam Ngữ Tổng Hợp (VI - EN - ZH)';

  portalStorage.addAuditLog(
    'Admin (Xuất Khẩu)',
    'EXPORT_CATALOG_TRANSLATED_CSV',
    `Đã tự động xuất toàn bộ ${result.totalProducts} sản phẩm danh mục sang file CSV đã dịch [${langLabel}] (File: ${result.fileName}, Dung lượng: ${result.fileSizeKb} KB)`,
    'SUCCESS',
    'PRODUCT',
    'ALL_CATALOG',
    'INFO',
    {
      fileName: result.fileName,
      totalProducts: result.totalProducts,
      targetLang: options.targetLang,
      exchangeRateUsd: options.exchangeRateUsd || 25450,
      fileSizeKb: result.fileSizeKb
    }
  );

  return result;
}
