/**
 * Professional Vietnamese Document Export Engine (Word & Excel)
 * Ensures standard Vietnamese typography ('Times New Roman', 'Arial', 'Calibri')
 * and UTF-8 Byte Order Mark (BOM \uFEFF) to guarantee 100% font fidelity
 * without encoding or diacritic corruption on Windows & Mac Microsoft Office.
 */

import { ValveProduct, RfqItem, RfqFormData } from '../types/valve';

/**
 * Prepend UTF-8 BOM for clean Vietnamese diacritics in Microsoft Office
 */
const UTF8_BOM = '\uFEFF';

export interface QuotationExportData {
  quoteNumber: string;
  date: string;
  customerName: string;
  companyName: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  projectName?: string;
  deliveryLocation?: string;
  items: Array<{
    itemIndex: number;
    code: string;
    name: string;
    sizeDn: string;
    pressure: string;
    material: string;
    origin: string;
    quantity: number;
    unitPriceVnd: number;
    discountPercent: number;
    finalPriceVnd: number;
    totalAmountVnd: number;
  }>;
  subTotalVnd: number;
  discountRatePercent: number;
  discountVnd: number;
  taxableAmountVnd: number;
  vatRatePercent: number;
  vatAmountVnd: number;
  totalVnd: number;
  notes?: string;
}

const formatCurrencyVn = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' VNĐ';
};

/**
 * Export Quotation or Specifications to Microsoft Word (.doc) with standard Vietnamese typography
 */
export function exportQuotationToWord(data: QuotationExportData, filename?: string): void {
  const safeFilename = filename || `Bao_Gia_${data.quoteNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.doc`;

  const wordHtmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>BẢNG BÁO GIÁ KỸ THUẬT CÔNG NGHIỆP UTD - ${data.quoteNumber}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4 Portrait */
      margin: 42.5pt 42.5pt 42.5pt 42.5pt;
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Times New Roman', Times, 'DejaVu Serif', serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4 {
      font-family: 'Times New Roman', Times, serif;
      color: #0f172a;
      margin-top: 6pt;
      margin-bottom: 4pt;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16pt;
      border-bottom: 2pt solid #0284c7;
      padding-bottom: 8pt;
    }
    .header-table td {
      vertical-align: top;
      font-size: 10pt;
    }
    .company-title {
      font-size: 13pt;
      font-weight: bold;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
    }
    .doc-title {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      color: #0f172a;
      text-transform: uppercase;
      margin-top: 14pt;
      margin-bottom: 4pt;
    }
    .doc-subtitle {
      text-align: center;
      font-size: 10.5pt;
      font-style: italic;
      color: #475569;
      margin-bottom: 14pt;
    }
    .info-box {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14pt;
      background-color: #f8fafc;
      border: 1pt solid #cbd5e1;
    }
    .info-box td {
      padding: 5pt 8pt;
      font-size: 10.5pt;
      border: 0.5pt solid #e2e8f0;
    }
    .info-box .label {
      font-weight: bold;
      color: #334155;
      width: 25%;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8pt;
      margin-bottom: 14pt;
    }
    .data-table th {
      background-color: #0f172a;
      color: #ffffff;
      font-size: 9.5pt;
      font-weight: bold;
      padding: 6pt 4pt;
      text-align: center;
      border: 1pt solid #0f172a;
    }
    .data-table td {
      padding: 5pt 4pt;
      font-size: 9.5pt;
      border: 0.5pt solid #cbd5e1;
    }
    .total-table {
      width: 45%;
      margin-left: auto;
      border-collapse: collapse;
      margin-top: 6pt;
      margin-bottom: 16pt;
    }
    .total-table td {
      padding: 4pt 6pt;
      font-size: 10pt;
    }
    .total-table .grand-total {
      font-weight: bold;
      font-size: 11pt;
      color: #b45309;
      border-top: 1.5pt solid #0f172a;
    }
    .signatures {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24pt;
    }
    .signatures td {
      text-align: center;
      vertical-align: top;
      font-size: 10pt;
      width: 50%;
    }
  </style>
</head>
<body>
  <div class="Section1">
    <!-- Header -->
    <table class="header-table">
      <tr>
        <td style="width: 60%;">
          <div class="company-title">CÔNG TY CỔ PHẦN INDUSTRACORP VIỆT NAM</div>
          <div style="font-weight: bold; color: #0284c7;">NHÀ PHÂN PHỐI ĐỘC QUYỀN VAN CÔNG NGHIỆP & PCCC UTD</div>
          <div>Địa chỉ: Tòa nhà Indochina Park Tower, Số 4 Nguyễn Đình Chiểu, P. Đa Kao, Quận 1, TP. Hồ Chí Minh</div>
          <div>Hotline kỹ thuật 24/7: 0932.790.928 | Email: trong.luu@industracorp.com - info@industracorp.com</div>
          <div>Website chính thức: https://www.industracorp.com</div>
        </td>
        <td style="width: 40%; text-align: right;">
          <div style="font-size: 11pt; font-weight: bold; color: #0f172a;">SỐ BÁO GIÁ: ${data.quoteNumber}</div>
          <div>Ngày ban hành: ${data.date}</div>
          <div>Hiệu lực báo giá: 30 ngày</div>
          <div style="color: #059669; font-weight: bold; font-size: 9.5pt; margin-top: 4pt;">CHỨNG CHỈ: CO/CQ, ISO 9001, CE, UL/FM</div>
        </td>
      </tr>
    </table>

    <!-- Title -->
    <div class="doc-title">BẢNG BÁO GIÁ KỸ THUẬT & THƯƠNG MẠI</div>
    <div class="doc-subtitle">Kính gửi Quý Khách Hàng / Quý Đối Tác Dự Án</div>

    <!-- Customer Information -->
    <table class="info-box">
      <tr>
        <td class="label">Đơn vị nhận báo giá:</td>
        <td colspan="3"><strong>${data.companyName}</strong></td>
      </tr>
      <tr>
        <td class="label">Người đại diện liên hệ:</td>
        <td>${data.customerName}</td>
        <td class="label">Mã số thuế (MST):</td>
        <td><strong>${data.taxCode || 'Theo hợp đồng'}</strong></td>
      </tr>
      <tr>
        <td class="label">Số điện thoại:</td>
        <td>${data.phone || '0932790928'}</td>
        <td class="label">Email nhận file:</td>
        <td>${data.email || 'N/A'}</td>
      </tr>
      <tr>
        <td class="label">Tên dự án / Công trình:</td>
        <td><strong>${data.projectName || 'Dự án công nghiệp'}</strong></td>
        <td class="label">Địa điểm giao hàng:</td>
        <td>${data.deliveryLocation || 'Kho bên mua hoặc công trình'}</td>
      </tr>
    </table>

    <!-- Items Table -->
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 4%;">STT</th>
          <th style="width: 14%;">Mã Sản Phẩm</th>
          <th style="width: 26%;">Tên Thiết Bị / Dòng Van UTD</th>
          <th style="width: 10%;">Kích Thước</th>
          <th style="width: 8%;">Áp Lực</th>
          <th style="width: 12%;">Vật Liệu</th>
          <th style="width: 6%;">SL</th>
          <th style="width: 10%;">Đơn Giá (VNĐ)</th>
          <th style="width: 10%;">Thành Tiền (VNĐ)</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map((it) => `
        <tr>
          <td style="text-align: center;">${it.itemIndex}</td>
          <td style="font-weight: bold; color: #0369a1;">${it.code}</td>
          <td><strong>${it.name}</strong><br><span style="font-size: 8pt; color: #64748b;">Xuất xứ: ${it.origin}</span></td>
          <td style="text-align: center; font-weight: bold;">${it.sizeDn}</td>
          <td style="text-align: center;">${it.pressure}</td>
          <td>${it.material}</td>
          <td style="text-align: center; font-weight: bold;">${it.quantity}</td>
          <td style="text-align: right;">${formatCurrencyVn(it.finalPriceVnd)}</td>
          <td style="text-align: right; font-weight: bold;">${formatCurrencyVn(it.totalAmountVnd)}</td>
        </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Financial Totals -->
    <table class="total-table">
      <tr>
        <td>Cộng tiền hàng trước thuế:</td>
        <td style="text-align: right; font-weight: bold;">${formatCurrencyVn(data.subTotalVnd)}</td>
      </tr>
      ${data.discountVnd > 0 ? `
      <tr>
        <td style="color: #059669;">Chiết khấu dự án (${data.discountRatePercent}%):</td>
        <td style="text-align: right; font-weight: bold; color: #059669;">-${formatCurrencyVn(data.discountVnd)}</td>
      </tr>
      <tr>
        <td>Giá trị sau chiết khấu:</td>
        <td style="text-align: right; font-weight: bold;">${formatCurrencyVn(data.taxableAmountVnd)}</td>
      </tr>
      ` : ''}
      <tr>
        <td>Thuế GTGT (VAT ${data.vatRatePercent}%):</td>
        <td style="text-align: right;">${formatCurrencyVn(data.vatAmountVnd)}</td>
      </tr>
      <tr class="grand-total">
        <td>TỔNG THANH TOÁN:</td>
        <td style="text-align: right; font-size: 12pt;">${formatCurrencyVn(data.totalVnd)}</td>
      </tr>
    </table>

    <!-- Terms & Signatures -->
    <div style="font-size: 9.5pt; color: #334155; margin-top: 10pt; border-top: 1pt solid #cbd5e1; padding-top: 6pt;">
      <strong>ĐIỀU KHOẢN THƯƠNG MẠI & CHẤT LƯỢNG:</strong>
      <ol style="margin-top: 3pt; padding-left: 14pt;">
        <li>Bảo hành chính hãng 24 tháng theo tiêu chuẩn nhà sản xuất UTD. Cung cấp đầy đủ CO/CQ, Mill Test Certificate.</li>
        <li>Thời gian giao hàng: Có sẵn tại kho Hồ Chí Minh / Hà Nội (giao ngay trong 24h) hoặc 2-4 tuần với quy cách đặc thù.</li>
        <li>Phương thức thanh toán: Tạm ứng 30% khi ký kết, 70% còn lại trước khi bàn giao đầy đủ chứng từ nghiệm thu.</li>
      </ol>
    </div>

    <table class="signatures">
      <tr>
        <td>
          <strong>ĐẠI DIỆN BÊN MUA</strong><br>
          <span style="font-size: 9pt; color: #64748b;">(Ký, ghi rõ họ tên và đóng dấu)</span>
          <br><br><br><br>
          <strong>${data.customerName || 'Đại Diện Doanh Nghiệp'}</strong>
        </td>
        <td>
          <strong>CÔNG TY CỔ PHẦN INDUSTRACORP</strong><br>
          <span style="font-size: 9pt; color: #64748b;">Phụ Trách Ban Dự Án & Quản Trị Viên Kỹ Thuật</span>
          <br><br><br><br>
          <strong style="color: #0369a1;">TRỌNG LƯU</strong><br>
          <span style="font-size: 9pt; color: #059669;">(Đã ký duyệt điện tử & xác nhận hệ thống)</span>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

  const blob = new Blob([UTF8_BOM + wordHtmlContent], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export Quotation to Microsoft Excel (.xls) with standard Vietnamese typography
 */
export function exportQuotationToExcel(data: QuotationExportData, filename?: string): void {
  const safeFilename = filename || `Bang_Bao_Gia_${data.quoteNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.xls`;

  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Báo Giá UTD</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body, table, td, th {
      font-family: 'Times New Roman', Times, Arial, sans-serif;
      font-size: 11pt;
    }
    .title {
      font-size: 15pt;
      font-weight: bold;
      color: #0369a1;
      text-align: center;
    }
    .company {
      font-size: 12pt;
      font-weight: bold;
      color: #0f172a;
    }
    .th-col {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
      border: 1px solid #000000;
    }
    .cell {
      border: 0.5px solid #cccccc;
      padding: 4px;
    }
    .num {
      text-align: right;
      mso-number-format: "#,##0";
    }
    .bold {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <table>
    <tr>
      <td colspan="9" class="company">CÔNG TY CỔ PHẦN INDUSTRACORP VIỆT NAM - HỆ THỐNG VAN UTD</td>
    </tr>
    <tr>
      <td colspan="9">Hotline: 0932.790.928 | Email: trong.luu@industracorp.com - info@industracorp.com</td>
    </tr>
    <tr>
      <td colspan="9" class="title">BẢNG BÁO GIÁ THIẾT BỊ VAN CÔNG NGHIỆP & PCCC (${data.quoteNumber})</td>
    </tr>
    <tr>
      <td colspan="9" style="text-align: center; font-style: italic;">Ngày báo giá: ${data.date} | Dự án: ${data.projectName || 'Công nghiệp'}</td>
    </tr>
    <tr><td colspan="9"></td></tr>
    <tr>
      <td colspan="2" class="bold">Khách hàng / Doanh nghiệp:</td>
      <td colspan="3">${data.companyName}</td>
      <td class="bold">Mã số thuế:</td>
      <td colspan="3">${data.taxCode || 'Theo hợp đồng'}</td>
    </tr>
    <tr>
      <td colspan="2" class="bold">Người liên hệ:</td>
      <td colspan="3">${data.customerName} - ${data.phone || ''}</td>
      <td class="bold">Địa chỉ giao hàng:</td>
      <td colspan="3">${data.deliveryLocation || 'Kho bên mua'}</td>
    </tr>
    <tr><td colspan="9"></td></tr>
    <tr>
      <th class="th-col">STT</th>
      <th class="th-col">Mã Sản Phẩm</th>
      <th class="th-col">Tên Thiết Bị / Chủng Loại Van</th>
      <th class="th-col">Kích Cỡ</th>
      <th class="th-col">Cấp Áp Lực</th>
      <th class="th-col">Vật Liệu Thân</th>
      <th class="th-col">Số Lượng</th>
      <th class="th-col">Đơn Giá (VNĐ)</th>
      <th class="th-col">Thành Tiền (VNĐ)</th>
    </tr>
    ${data.items.map((it) => `
    <tr>
      <td class="cell" style="text-align: center;">${it.itemIndex}</td>
      <td class="cell bold" style="color: #0369a1;">${it.code}</td>
      <td class="cell bold">${it.name}</td>
      <td class="cell" style="text-align: center;">${it.sizeDn}</td>
      <td class="cell" style="text-align: center;">${it.pressure}</td>
      <td class="cell">${it.material}</td>
      <td class="cell num bold">${it.quantity}</td>
      <td class="cell num">${it.finalPriceVnd}</td>
      <td class="cell num bold">${it.totalAmountVnd}</td>
    </tr>
    `).join('')}
    <tr><td colspan="9"></td></tr>
    <tr>
      <td colspan="7" style="text-align: right;" class="bold">Cộng tiền hàng trước thuế:</td>
      <td colspan="2" class="num bold">${data.subTotalVnd}</td>
    </tr>
    ${data.discountVnd > 0 ? `
    <tr>
      <td colspan="7" style="text-align: right; color: #059669;" class="bold">Chiết khấu ưu đãi (${data.discountRatePercent}%):</td>
      <td colspan="2" class="num bold" style="color: #059669;">-${data.discountVnd}</td>
    </tr>
    <tr>
      <td colspan="7" style="text-align: right;" class="bold">Giá trị sau chiết khấu:</td>
      <td colspan="2" class="num bold">${data.taxableAmountVnd}</td>
    </tr>
    ` : ''}
    <tr>
      <td colspan="7" style="text-align: right;">Thuế VAT (${data.vatRatePercent}%):</td>
      <td colspan="2" class="num">${data.vatAmountVnd}</td>
    </tr>
    <tr style="background-color: #fef3c7;">
      <td colspan="7" style="text-align: right; font-size: 12pt;" class="bold">TỔNG CỘNG THANH TOÁN (VNĐ):</td>
      <td colspan="2" class="num bold" style="font-size: 12pt; color: #b45309;">${data.totalVnd}</td>
    </tr>
  </table>
</body>
</html>
`;

  const blob = new Blob([UTF8_BOM + excelHtml], {
    type: 'application/vnd.ms-excel;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export full Valve Catalog database to Excel (.xls) with standard Vietnamese typography
 */
export function exportCatalogToExcel(products: ValveProduct[], filename = 'Danh_Muc_Van_UTD.xls'): void {
  const excelHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <style>
    body, table, td, th {
      font-family: 'Times New Roman', Arial, sans-serif;
      font-size: 11pt;
    }
    .th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: bold;
      text-align: center;
      border: 1px solid #334155;
      padding: 6px;
    }
    .td {
      border: 0.5px solid #cbd5e1;
      padding: 5px;
    }
    .num {
      text-align: right;
      mso-number-format: "#,##0";
    }
  </style>
</head>
<body>
  <table>
    <tr>
      <td colspan="10" style="font-size: 16pt; font-weight: bold; color: #0284c7; text-align: center;">
        DANH MỤC SẢN PHẨM VAN CÔNG NGHIỆP & PCCC UTD - INDUSTRACORP
      </td>
    </tr>
    <tr>
      <td colspan="10" style="text-align: center; font-style: italic;">
        Tổng số: ${products.length} sản phẩm • Xuất ngày: ${new Date().toLocaleDateString('vi-VN')}
      </td>
    </tr>
    <tr><td colspan="10"></td></tr>
    <tr>
      <th class="th">STT</th>
      <th class="th">Mã Sản Phẩm</th>
      <th class="th">Tên Dòng Van (Tiếng Việt)</th>
      <th class="th">Phân Nhóm</th>
      <th class="th">Thương Hiệu</th>
      <th class="th">Vật Liệu Thân</th>
      <th class="th">Cấp Áp Lực</th>
      <th class="th">Dải Kích Cỡ</th>
      <th class="th">Nhiệt Độ Hoạt Động</th>
      <th class="th">Giá Tham Khảo (VNĐ)</th>
    </tr>
    ${products.map((p, idx) => `
    <tr>
      <td class="td" style="text-align: center;">${idx + 1}</td>
      <td class="td" style="font-weight: bold; color: #0284c7;">${p.code}</td>
      <td class="td" style="font-weight: bold;">${p.name}</td>
      <td class="td">${p.categoryLabel || p.category}</td>
      <td class="td">${p.brand || 'UTD'}</td>
      <td class="td">${p.material}</td>
      <td class="td" style="text-align: center;">${p.pressure}</td>
      <td class="td" style="text-align: center;">${p.sizeRange}</td>
      <td class="td">${p.tempRange}</td>
      <td class="td num" style="font-weight: bold;">${p.referencePriceVnd || 0}</td>
    </tr>
    `).join('')}
  </table>
</body>
</html>
`;

  const blob = new Blob([UTF8_BOM + excelHtml], {
    type: 'application/vnd.ms-excel;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
