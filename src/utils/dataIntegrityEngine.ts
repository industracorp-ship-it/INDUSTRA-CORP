import { ValveProduct } from '../types/valve';

export interface DataIntegrityError {
  id: string;
  rowNumber: number;
  productCode: string;
  productName: string;
  errorType: 'DUPLICATE_CODE' | 'INVALID_PRICE' | 'MISSING_REQUIRED_FIELD' | 'INVALID_FORMAT';
  errorTypeVi: string;
  severity: 'CRITICAL' | 'WARNING';
  details: string;
  recommendedFix: string;
}

export interface ValidationResult {
  isValid: boolean;
  totalRows: number;
  validRowsCount: number;
  errorCount: number;
  errors: DataIntegrityError[];
  validProducts: ValveProduct[];
}

/**
 * Parses CSV text into array of generic key-value objects
 */
export function parseCsvToObjects(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Determine delimiter (comma or semicolon)
  const headerLine = lines[0];
  const delimiter = headerLine.includes(';') ? ';' : ',';

  // Parse header
  const headers = splitCsvLine(headerLine, delimiter).map(h => h.trim().toLowerCase());

  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = splitCsvLine(lines[i], delimiter);
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = rawCols[idx] !== undefined ? rawCols[idx].trim() : '';
    });
    records.push(rowObj);
  }

  return records;
}

function splitCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(current.replace(/^"|"$/g, '').trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.replace(/^"|"$/g, '').trim());
  return result;
}

/**
 * Validates data integrity of incoming valve products (JSON or parsed CSV)
 */
export function validateValveBatchData(
  rawItems: any[],
  existingCatalog: ValveProduct[]
): ValidationResult {
  const errors: DataIntegrityError[] = [];
  const validProducts: ValveProduct[] = [];
  const seenCodesInBatch = new Map<string, number>(); // code -> first row index seen

  const existingCodesSet = new Set(existingCatalog.map(p => p.code.trim().toUpperCase()));

  rawItems.forEach((item, index) => {
    const rowNum = index + 1;
    let hasCriticalError = false;

    // Resolve code
    const rawCode = (item.code || item['mã sản phẩm'] || item['mã sp'] || item.id || '').toString().trim();
    // Resolve name
    const rawName = (item.name || item['tên dòng van'] || item['tên sản phẩm'] || item.nameEn || '').toString().trim();
    // Resolve price
    const rawPrice = item.referencePriceVnd ?? item['giá tham khảo'] ?? item['giá'] ?? item.price;

    // 1. CHECK REQUIRED FIELDS
    if (!rawCode) {
      errors.push({
        id: `err-${rowNum}-code-missing`,
        rowNumber: rowNum,
        productCode: 'N/A',
        productName: rawName || 'Chưa đặt tên',
        errorType: 'MISSING_REQUIRED_FIELD',
        errorTypeVi: 'Thiếu Mã Sản Phẩm Bắt Buộc',
        severity: 'CRITICAL',
        details: `Dòng ${rowNum} không chứa trường mã sản phẩm (code). Đây là khóa chính bắt buộc.`,
        recommendedFix: 'Bổ sung mã định danh duy nhất (Ví dụ: UTD-BV-01, APC-GT-100).'
      });
      hasCriticalError = true;
    }

    if (!rawName) {
      errors.push({
        id: `err-${rowNum}-name-missing`,
        rowNumber: rowNum,
        productCode: rawCode || `ROW-${rowNum}`,
        productName: 'Trống tên',
        errorType: 'MISSING_REQUIRED_FIELD',
        errorTypeVi: 'Thiếu Tên Sản Phẩm',
        severity: 'CRITICAL',
        details: `Dòng ${rowNum} thiếu tên sản phẩm (name).`,
        recommendedFix: 'Điền tên mô tả kỹ thuật của dòng van (Ví dụ: Van Bi Inox 316 Mặt Bích PN16).'
      });
      hasCriticalError = true;
    }

    // 2. CHECK DUPLICATE PRODUCT CODES
    if (rawCode) {
      const normalizedCode = rawCode.toUpperCase();
      if (seenCodesInBatch.has(normalizedCode)) {
        const prevRow = seenCodesInBatch.get(normalizedCode)!;
        errors.push({
          id: `err-${rowNum}-code-dup-batch`,
          rowNumber: rowNum,
          productCode: rawCode,
          productName: rawName,
          errorType: 'DUPLICATE_CODE',
          errorTypeVi: 'Trùng Lặp Mã Sản Phẩm Trong File',
          severity: 'CRITICAL',
          details: `Mã [${rawCode}] bị trùng lặp với dòng #${prevRow} trong cùng file tải lên.`,
          recommendedFix: 'Đổi mã sản phẩm hoặc gộp các biến thể kích thước vào cùng một mã van.'
        });
        hasCriticalError = true;
      } else {
        seenCodesInBatch.set(normalizedCode, rowNum);
      }

      // Check if duplicate with existing products in catalog
      if (existingCodesSet.has(normalizedCode)) {
        errors.push({
          id: `err-${rowNum}-code-dup-exist`,
          rowNumber: rowNum,
          productCode: rawCode,
          productName: rawName,
          errorType: 'DUPLICATE_CODE',
          errorTypeVi: 'Trùng Mã Với Sản Phẩm Hiện Có (Cảnh báo ghi đè)',
          severity: 'WARNING',
          details: `Mã [${rawCode}] đã tồn tại trong cơ sở dữ liệu valve hiện tại. Nếu tiếp tục, dữ liệu cũ sẽ bị ghi đè.`,
          recommendedFix: 'Kiểm tra nếu muốn cập nhật thông số thì giữ nguyên, nếu tạo mới hãy đổi hậu tố mã.'
        });
      }
    }

    // 3. CHECK PRICE FORMATTING
    if (rawPrice !== undefined && rawPrice !== null && rawPrice !== '') {
      let parsedPrice: number;
      if (typeof rawPrice === 'number') {
        parsedPrice = rawPrice;
      } else {
        const cleanPriceStr = rawPrice.toString().replace(/[^0-9.-]/g, '').trim();
        parsedPrice = parseFloat(cleanPriceStr);
      }

      if (isNaN(parsedPrice)) {
        errors.push({
          id: `err-${rowNum}-price-nan`,
          rowNumber: rowNum,
          productCode: rawCode || `ROW-${rowNum}`,
          productName: rawName,
          errorType: 'INVALID_PRICE',
          errorTypeVi: 'Sai Định Dạng Giá Thành',
          severity: 'CRITICAL',
          details: `Giá trị [${rawPrice}] không thể chuyển đổi thành số hợp lệ.`,
          recommendedFix: 'Nhập giá số nguyên dương (VNĐ), không nhập ký tự chữ hoặc đơn vị tiền tệ lạ.'
        });
        hasCriticalError = true;
      } else if (parsedPrice < 0) {
        errors.push({
          id: `err-${rowNum}-price-neg`,
          rowNumber: rowNum,
          productCode: rawCode || `ROW-${rowNum}`,
          productName: rawName,
          errorType: 'INVALID_PRICE',
          errorTypeVi: 'Giá Thành Số Âm',
          severity: 'CRITICAL',
          details: `Giá thành không được là số âm: ${parsedPrice} VNĐ.`,
          recommendedFix: 'Điều chỉnh lại giá thành về số dương lớn hơn hoặc bằng 0.'
        });
        hasCriticalError = true;
      } else if (parsedPrice > 5000000000) {
        errors.push({
          id: `err-${rowNum}-price-high`,
          rowNumber: rowNum,
          productCode: rawCode || `ROW-${rowNum}`,
          productName: rawName,
          errorType: 'INVALID_PRICE',
          errorTypeVi: 'Giá Thành Bất Thường (> 5 tỷ VNĐ)',
          severity: 'WARNING',
          details: `Giá ${new Intl.NumberFormat('vi-VN').format(parsedPrice)} VNĐ có vẻ quá cao, vui lòng kiểm tra xem có bị thừa số 0.`,
          recommendedFix: 'Xác nhận lại đơn vị VNĐ.'
        });
      }
    }

    // If no critical errors, build clean product
    if (!hasCriticalError) {
      const cleanProd: ValveProduct = {
        id: item.id || `valve-${Date.now()}-${index}`,
        code: rawCode,
        name: rawName,
        nameEn: item.nameEn || item['tên tiếng anh'] || rawName,
        brand: item.brand || item['thương hiệu'] || 'UTD',
        category: item.category || 'ball_valve',
        categoryLabel: item.categoryLabel || item['phân nhóm'] || 'Van Công Nghiệp UTD',
        categoryLabelEn: item.categoryLabelEn || 'Industrial Valves',
        systemGroup: item.systemGroup || 'water',
        systemGroupLabel: item.systemGroupLabel || 'Water / General Loop',
        image: item.image || item['ảnh'] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        badge: item.badge || 'TIÊU CHUẨN UTD',
        material: item.material || item['vật liệu'] || 'Inox 304 / Gang dẻo GGG50',
        materialEn: item.materialEn || 'CF8 / Ductile Iron',
        materialGroup: item.materialGroup || 'stainless_steel',
        pressure: item.pressure || item['áp suất'] || 'PN16',
        pressureGroup: item.pressureGroup || 'pn16',
        sizeRange: item.sizeRange || item['kích thước'] || 'DN15 - DN300',
        tempRange: item.tempRange || item['nhiệt độ'] || '-10°C đến 180°C',
        connection: item.connection || item['kết nối'] || 'Mặt bích DIN / JIS',
        applicableMedia: Array.isArray(item.applicableMedia) ? item.applicableMedia : ['Nước', 'Dầu', 'Khí'],
        applicableMediaEn: Array.isArray(item.applicableMediaEn) ? item.applicableMediaEn : ['Water', 'Oil', 'Air'],
        standards: Array.isArray(item.standards) ? item.standards : ['DIN EN 558', 'ISO 5208'],
        description: item.description || `Dòng van ${rawName} thương hiệu UTD chính hãng.`,
        descriptionEn: item.descriptionEn || `UTD valve series ${rawCode}.`,
        highlightFeatures: Array.isArray(item.highlightFeatures) ? item.highlightFeatures : ['Tiêu chuẩn chất lượng cao', 'Bảo hành 24 tháng'],
        highlightFeaturesEn: Array.isArray(item.highlightFeaturesEn) ? item.highlightFeaturesEn : ['High quality', '24 months warranty'],
        leakageClass: item.leakageClass || 'ISO 5208 Rate A',
        testPressureShell: item.testPressureShell || '1.5 x PN',
        testPressureSeat: item.testPressureSeat || '1.1 x PN',
        referencePriceVnd: typeof rawPrice === 'number' ? rawPrice : (parseFloat(rawPrice) || 1250000),
        cadFileAvailable: Boolean(item.cadFileAvailable ?? true),
        specs: Array.isArray(item.specs) ? item.specs : []
      };
      validProducts.push(cleanProd);
    }
  });

  return {
    isValid: errors.filter(e => e.severity === 'CRITICAL').length === 0,
    totalRows: rawItems.length,
    validRowsCount: validProducts.length,
    errorCount: errors.length,
    errors,
    validProducts
  };
}
