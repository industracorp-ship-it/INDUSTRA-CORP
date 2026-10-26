export interface CatalogAuditItem {
  page: number;
  originalText: string;
  errorType: 'Chính tả (Spelling)' | 'Thông số kỹ thuật (Technical Spec)' | 'Thuật ngữ tiêu chuẩn (Standard Terminology)';
  correctedText: string;
  explanation: string;
  severity: 'Cao (Critical)' | 'Trung bình (Warning)' | 'Thẩm mỹ (Typo)';
}

export const CATALOG_AUDIT_REPORT: CatalogAuditItem[] = [
  {
    page: 10,
    originalText: 'EXPAINSION JOINT (tiêu đề trang 10, 133, 134, 135)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'EXPANSION JOINT (Khớp giãn nở nhiệt kim loại)',
    explanation: 'Thừa chữ "i" trong từ Expansion. Cần chuẩn hóa trên toàn bộ mục lục và bản vẽ kỹ thuật.',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 27,
    originalText: 'ONE PICE BALL VALVE (tiêu đề trang 27)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'ONE PIECE BALL VALVE (Van bi 1 thân đúc liền)',
    explanation: 'Thiếu chữ "e" trong chữ "Piece". Trang 28 ghi đúng là "One Piece", trang 27 bị sai.',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 22,
    originalText: 'AUTO AIR ALVES (thanh tab bên phải trang 22)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'AUTO AIR VALVES (Van xả khí tự động)',
    explanation: 'Thiếu chữ "V" trong chữ Valves (in thành "ALVES").',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 125,
    originalText: 'SÀETY VALVES (thanh tab bên trái trang 125)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'SAFETY VALVES (Van an toàn)',
    explanation: 'Lỗi gõ phím tiếng Việt dính dấu huyền "À" thay cho chữ "F" (SÀETY -> SAFETY).',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 12,
    originalText: 'ORTHER (tiêu đề tab trang 12)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'OTHER / ACCESSORIES (Phụ kiện & Thiết bị khác)',
    explanation: 'Viết sai chính tả chữ "OTHER" thành "ORTHER".',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 236,
    originalText: 'EXPLOPDED VIEW & TECHINCAL DATA (trang 236)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'EXPLODED VIEW & TECHNICAL DATA',
    explanation: 'Lỗi gõ thừa chữ "P" (Explopded) và đảo chữ "in" (Techincal).',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 148,
    originalText: 'Non Asbestor (mục gioăng) & Exhaust Vave',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'Non-Asbestos & Exhaust Valve',
    explanation: 'Sai chữ "Asbestor" thành "Asbestos" và "Vave" thành "Valve".',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 84,
    originalText: 'Suitable For Installation In Orizontal And Vertical',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'Suitable For Installation In Horizontal And Vertical',
    explanation: 'Thiếu chữ "H" trong từ "Horizontal" (bị in thành "Orizontal" ở trang 84 và 86).',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 94,
    originalText: 'Theard ends: NPT/BS21 (trang 94)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'Threaded ends: NPT / BS21',
    explanation: 'Viết sai chính tả "Theard" thành "Threaded".',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 20,
    originalText: 'Bolted Bonnect, Direct type (trang 20)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'Bolted Bonnet, Direct Acting type',
    explanation: 'Sai chính tả chữ "Bonnect" thừa chữ c.',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 149,
    originalText: 'Caculater: Lift Height + Leght from pump... (trang 149)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'Calculation: Static Head Lift + Pipe Run Length...',
    explanation: 'Viết sai chữ "Caculater" và "Leght" trong sơ đồ hệ thống bơm thu hồi nước ngưng.',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 134,
    originalText: 'feature of goo performance for keep temp-erature (trang 134, 135)',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'High thermal retention performance and minimal medium stagnation',
    explanation: 'Lỗi in ấn mất chữ d "goo performance" -> "good performance".',
    severity: 'Thẩm mỹ (Typo)'
  },
  {
    page: 5,
    originalText: 'Pressure Class 150LB tương đương 20 Bar (ở một số bảng)',
    errorType: 'Thông số kỹ thuật (Technical Spec)',
    correctedText: 'Class 150LB tương đương PN20 (Áp suất thử vỏ 29.3 Bar, làm việc tối đa ~19.6 Bar tại 38°C)',
    explanation: 'Chuẩn ASME B16.34 quy định rõ Class 150 thép WCB ở nhiệt độ phòng có áp suất làm việc tối đa là 285 psi (~19.6 bar). Quy đổi thành PN25 là sai lệch dung sai an toàn.',
    severity: 'Cao (Critical)'
  },
  {
    page: 111,
    originalText: 'Van cầu Fig. 301DF ghi dải nhiệt độ -29°C ~ +350°C với đĩa gang/inox và gioăng Graphite',
    errorType: 'Thông số kỹ thuật (Technical Spec)',
    correctedText: 'Khuyến cáo: Đối với thân Gang cầu (EN-GJS-500-7), nhiệt độ tối đa theo EN 12516 là 300°C (trên 300°C phải chuyển sang Thép WCB hoặc GS-C25)',
    explanation: 'Gang dẻo khi vận hành trên 300°C liên tục sẽ bị hiện tượng biến tính vi cấu trúc ferit/pearlit làm suy giảm giới hạn chảy.',
    severity: 'Cao (Critical)'
  },
  {
    page: 78,
    originalText: 'Đệm van một chiều Fig. 400DNW ghi NBR: -10~80°C, EPDM: -10~110°C nhưng bảng trên ghi PN16 232 PSI',
    errorType: 'Thông số kỹ thuật (Technical Spec)',
    correctedText: 'Áp suất 1.6 MPa (PN16) = 232.06 PSI (Chính xác). Tuy nhiên nếu dùng gioăng EPDM cho nước nóng trên 90°C thì áp lực làm việc cần hạ xuống (Derating factor 0.85).',
    explanation: 'Cao su EPDM ở 110°C chịu áp 16 Bar liên tục dễ bị chai cứng sau 12 tháng nếu không có hệ số an toàn.',
    severity: 'Trung bình (Warning)'
  },
  {
    page: 177,
    originalText: 'High Performance Butterfly: ghi "cryigenic, vapor, chlorine gas, high vancuum"',
    errorType: 'Chính tả (Spelling)',
    correctedText: 'Cryogenic, Steam Vapor, Chlorine Gas, High Vacuum',
    explanation: 'Sai chính tả 2 từ "cryigenic" -> "cryogenic" và "vancuum" -> "vacuum".',
    severity: 'Thẩm mỹ (Typo)'
  }
];
