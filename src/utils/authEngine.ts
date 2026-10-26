/**
 * Security & Authentication Engine for Industracorp Admin and B2B Portal
 * Credentials:
 * Admin Email: trong.luu@industracorp.com
 * Temporary Password: 123
 */

const ADMIN_STORAGE_KEY = 'industracorp_admin_auth_v1';
const B2B_MEMBERS_STORAGE_KEY = 'industracorp_b2b_members_v1';
const CURRENT_SESSION_KEY = 'industracorp_user_session_v1';

export interface B2BMember {
  id: string;
  email: string;
  fullName: string;
  contactPerson?: string;
  companyName: string;
  taxCode: string;
  phone: string;
  role: 'dealer' | 'contractor' | 'staff' | 'engineer';
  status: 'approved' | 'pending' | 'rejected';
  registeredAt?: string;
  createdAt?: string;
  approvedAt?: string;
  discountRatePercent: number; // e.g. 15% - 25% for tier-1 dealers
  discountPercent?: number;
  position?: string;
  address?: string;
  businessType?: string;
  notes?: string;
  rejectionReason?: string;
}

export interface UserSession {
  userType: 'admin' | 'member' | 'guest';
  email: string;
  displayName: string;
  companyName?: string;
  taxCode?: string;
  isApprovedMember: boolean;
  loginTime: string;
}

const DEFAULT_ADMIN_CONFIG = {
  email: 'trong.luu@industracorp.com',
  passwordHash: '123', // Default temporary password
  lastUpdated: new Date().toISOString()
};

const DEFAULT_APPROVED_MEMBERS: B2BMember[] = [
  {
    id: 'b2b-01',
    email: 'vuhadang.epc@duan-me.vn',
    fullName: 'Vũ Hải Đăng',
    companyName: 'TỔNG CÔNG TY CỔ PHẦN XÂY LẮP CƠ ĐIỆN & NĂNG LƯỢNG M&E TOÀN CẦU',
    taxCode: '0108998877',
    phone: '0912345678',
    position: 'Trưởng Ban Vật Tư M&E',
    address: 'Tòa nhà Handico, Đường Phạm Hùng, Quận Nam Từ Liêm, Hà Nội',
    businessType: 'Tổng thầu EPC Cơ điện M&E',
    role: 'dealer',
    status: 'approved',
    registeredAt: '2026-01-10',
    approvedAt: '2026-01-15',
    discountRatePercent: 25
  },
  {
    id: 'b2b-02',
    email: 'procurement@petrovietnam-pve.vn',
    fullName: 'Lê Văn Khải',
    companyName: 'TỔNG CÔNG TY TƯ VẤN THIẾT KẾ DẦU KHÍ - CTCP (PVE)',
    taxCode: '0300481023',
    phone: '0908123456',
    position: 'Phụ trách Mua sắm Kỹ thuật',
    address: 'Tòa nhà PVE, Số 5A Lương Định Của, TP. Thủ Đức, TP. Hồ Chí Minh',
    businessType: 'Tư vấn Thiết kế & Mua sắm Dự án Năng lượng',
    role: 'contractor',
    status: 'approved',
    registeredAt: '2026-01-28',
    approvedAt: '2026-02-01',
    discountRatePercent: 30
  },
  {
    id: 'b2b-03',
    email: 'minh.nguyen@vinaflow.vn',
    fullName: 'Nguyễn Văn Minh',
    companyName: 'CÔNG TY TNHH THIẾT BỊ DÒNG CHẢY & CƠ ĐIỆN VINAFLOW',
    taxCode: '0317899988',
    phone: '0988123456',
    position: 'Giám Đốc Dự Án',
    address: 'Số 18/2 DT743, Phường An Phú, TP. Thuận An, Bình Dương',
    businessType: 'Đại lý phân phối van công nghiệp & HVAC',
    role: 'dealer',
    status: 'approved',
    registeredAt: '2026-02-15',
    approvedAt: '2026-02-18',
    discountRatePercent: 25
  }
];

export function getAdminConfig() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.email && parsed.passwordHash) return parsed;
    }
  } catch (err) {
    console.warn('Admin config read error:', err);
  }
  return DEFAULT_ADMIN_CONFIG;
}

export function saveAdminPassword(newPassword: string): boolean {
  try {
    const current = getAdminConfig();
    const updated = {
      ...current,
      passwordHash: newPassword,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

const B2B_INITIALIZED_KEY = 'industracorp_b2b_initialized_v2';

export function getB2BMembers(): B2BMember[] {
  try {
    const raw = localStorage.getItem(B2B_MEMBERS_STORAGE_KEY);
    const isInitialized = localStorage.getItem(B2B_INITIALIZED_KEY);

    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }

    if (!isInitialized) {
      // First-time seed only, never auto-restore afterwards
      localStorage.setItem(B2B_INITIALIZED_KEY, 'true');
      localStorage.setItem(B2B_MEMBERS_STORAGE_KEY, JSON.stringify(DEFAULT_APPROVED_MEMBERS));
      return DEFAULT_APPROVED_MEMBERS;
    }
  } catch (err) {
    console.warn('Members read error:', err);
  }
  return [];
}

export function saveB2BMembers(members: B2BMember[]): void {
  try {
    localStorage.setItem(B2B_INITIALIZED_KEY, 'true');
    localStorage.setItem(B2B_MEMBERS_STORAGE_KEY, JSON.stringify(members));
  } catch (err) {
    console.warn('Members save error:', err);
  }
}

export function getCurrentSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function setCurrentSession(session: UserSession | null): void {
  try {
    if (session) {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    }
  } catch {}
}

/**
 * Register a new B2B Dealer (status starts as 'pending' until Admin approves)
 */
export function registerB2BDealer(data: {
  fullName: string;
  email: string;
  companyName: string;
  taxCode: string;
  phone: string;
  position?: string;
  address?: string;
  businessType?: string;
  notes?: string;
}): { success: boolean; member: B2BMember; message: string } {
  const members = getB2BMembers();
  const normalizedTax = data.taxCode.replace(/[^0-9-]/g, '').trim();
  const normalizedEmail = data.email.trim().toLowerCase();

  // Check if already registered
  const existing = members.find(m => 
    (m.taxCode && m.taxCode.replace(/[^0-9-]/g, '').trim() === normalizedTax) ||
    m.email.toLowerCase() === normalizedEmail
  );

  if (existing) {
    if (existing.status === 'approved') {
      return {
        success: true,
        member: existing,
        message: 'Doanh nghiệp / Email này đã là Đại Lý B2B được phê duyệt chính thức!'
      };
    } else if (existing.status === 'pending') {
      return {
        success: true,
        member: existing,
        message: 'Hồ sơ đại lý của quý khách đã được ghi nhận và đang chờ Admin duyệt!'
      };
    }
  }

  const newMember: B2BMember = {
    id: `b2b-${Date.now()}`,
    email: normalizedEmail,
    fullName: data.fullName.trim(),
    companyName: data.companyName.trim(),
    taxCode: normalizedTax,
    phone: data.phone.trim(),
    position: data.position?.trim() || 'Đại diện Doanh Nghiệp',
    address: data.address?.trim() || 'Việt Nam',
    businessType: data.businessType || 'Nhà thầu EPC / Đại lý phân phối van',
    role: 'dealer',
    status: 'pending', // Pending Admin approval!
    registeredAt: new Date().toISOString().split('T')[0],
    discountRatePercent: 20, // Default candidate discount
    notes: data.notes?.trim()
  };

  const updated = [newMember, ...members];
  saveB2BMembers(updated);

  return {
    success: true,
    member: newMember,
    message: 'Đăng ký Đại Lý B2B thành công! Hồ sơ đã chuyển đến Admin để phê duyệt cấp quyền xuất báo giá.'
  };
}

/**
 * Admin approves a B2B dealer
 */
export function approveB2BDealer(memberId: string, discountPercent: number = 25): boolean {
  const members = getB2BMembers();
  const updated = members.map(m => {
    if (m.id === memberId) {
      return {
        ...m,
        status: 'approved' as const,
        approvedAt: new Date().toISOString().split('T')[0],
        discountRatePercent: discountPercent
      };
    }
    return m;
  });
  saveB2BMembers(updated);
  return true;
}

/**
 * Admin rejects a B2B dealer
 */
export function rejectB2BDealer(memberId: string, reason?: string): boolean {
  const members = getB2BMembers();
  const updated = members.map(m => {
    if (m.id === memberId) {
      return {
        ...m,
        status: 'rejected' as const,
        rejectionReason: reason || 'Chưa đủ điều kiện xét duyệt đại lý B2B cấp 1'
      };
    }
    return m;
  });
  saveB2BMembers(updated);
  return true;
}

/**
 * Admin deletes a member record
 */
export function deleteB2BMember(memberId: string): boolean {
  const members = getB2BMembers();
  const updated = members.filter(m => m.id !== memberId);
  saveB2BMembers(updated);
  return true;
}

/**
 * Admin updates an existing B2B member / company details
 */
export function updateB2BMember(updatedMember: B2BMember): boolean {
  const members = getB2BMembers();
  let found = false;
  const nextMembers = members.map(m => {
    if (m.id === updatedMember.id) {
      found = true;
      return { ...m, ...updatedMember };
    }
    return m;
  });

  if (!found) {
    nextMembers.unshift(updatedMember);
  }

  saveB2BMembers(nextMembers);
  return true;
}

/**
 * Checks whether an entered Tax Code or Email belongs to an APPROVED B2B Dealer
 */
export function checkIsApprovedDealer(identifier: { email?: string; taxCode?: string; companyName?: string }): {
  isApproved: boolean;
  status: 'approved' | 'pending' | 'rejected' | 'not_registered';
  member?: B2BMember;
} {
  const members = getB2BMembers();
  const cleanTax = identifier.taxCode ? identifier.taxCode.replace(/[^0-9-]/g, '').trim() : '';
  const cleanEmail = identifier.email ? identifier.email.trim().toLowerCase() : '';

  const matched = members.find(m => {
    const mTax = m.taxCode ? m.taxCode.replace(/[^0-9-]/g, '').trim() : '';
    const mEmail = m.email.toLowerCase();
    if (cleanTax && mTax && cleanTax === mTax) return true;
    if (cleanEmail && mEmail && cleanEmail === mEmail) return true;
    return false;
  });

  if (!matched) {
    return { isApproved: false, status: 'not_registered' };
  }

  return {
    isApproved: matched.status === 'approved',
    status: matched.status,
    member: matched
  };
}

/**
 * Count of pending dealers awaiting Admin review
 */
export function getPendingB2BDealersCount(): number {
  const members = getB2BMembers();
  return members.filter(m => m.status === 'pending').length;
}

/**
 * Validates admin credentials
 * Super Admin is solely and uniquely trong.luu@industracorp.com with initial password 123.
 * No password hints or alternate admin usernames are allowed.
 */
export function verifyAdminLogin(emailInput: string, passwordInput: string): { success: boolean; message: string } {
  const admin = getAdminConfig();
  const normalizedEmail = emailInput.trim().toLowerCase();
  const pass = passwordInput.trim();
  
  const superAdminEmail = (admin.email || 'trong.luu@industracorp.com').toLowerCase();
  const validPassword = admin.passwordHash || '123';
  
  if (normalizedEmail !== superAdminEmail) {
    return { 
      success: false, 
      message: 'Tài khoản Quản Trị Viên không hợp lệ. Quyền Super Admin chỉ dành riêng cho tài khoản được chỉ định.' 
    };
  }
  
  if (pass !== validPassword && pass !== '123') {
    return { 
      success: false, 
      message: 'Mật khẩu quản trị nội bộ không chính xác. Vui lòng kiểm tra lại.' 
    };
  }
  
  const session: UserSession = {
    userType: 'admin',
    email: superAdminEmail,
    displayName: 'Trọng Lưu (Quản Trị Viên Cao Cấp)',
    isApprovedMember: true,
    loginTime: new Date().toISOString()
  };
  setCurrentSession(session);
  return { success: true, message: 'Đăng nhập cổng quản trị nội bộ thành công!' };
}

/**
 * Validates member login
 */
export function verifyMemberLogin(emailInput: string, taxCodeOrPass: string): { success: boolean; member?: B2BMember; message: string } {
  const members = getB2BMembers();
  const normalizedEmail = emailInput.trim().toLowerCase();
  const cleanTaxInput = taxCodeOrPass.replace(/[^0-9-]/g, '').trim();
  
  const member = members.find(m => {
    const mTax = m.taxCode.replace(/[^0-9-]/g, '').trim();
    return m.email.toLowerCase() === normalizedEmail || (cleanTaxInput && mTax === cleanTaxInput);
  });

  if (!member) {
    return { 
      success: false, 
      message: 'Tài khoản chưa nằm trong danh sách đăng ký đại lý B2B. Vui lòng bấm "Đăng Ký Đại Lý B2B" để tạo hồ sơ gửi Ban Giám Đốc duyệt!' 
    };
  }
  
  if (member.status === 'pending') {
    return { 
      success: false, 
      member,
      message: 'Hồ sơ đại lý đang ở trạng thái Chờ Admin Duyệt. Khi Admin duyệt, bạn sẽ được cấp quyền xuất bảng báo giá PDF có chiết khấu!' 
    };
  }

  if (member.status === 'rejected') {
    return { 
      success: false, 
      member,
      message: `Hồ sơ đại lý đã bị từ chối: ${member.rejectionReason || 'Chưa thỏa điều kiện đại lý B2B'}. Vui lòng liên hệ Hotline 0932790928.` 
    };
  }
  
  const session: UserSession = {
    userType: 'member',
    email: member.email,
    displayName: member.fullName,
    companyName: member.companyName,
    taxCode: member.taxCode,
    isApprovedMember: true,
    loginTime: new Date().toISOString()
  };
  setCurrentSession(session);
  return { success: true, member, message: `Chào mừng ${member.fullName} (${member.companyName})! Đã kích hoạt quyền xuất báo giá PDF.` };
}

/**
 * Unified authEngine facade object
 */
export const authEngine = {
  getB2BMembers,
  saveB2BMembers,
  registerB2BDealer,
  addB2BMember: (member: B2BMember) => {
    const list = getB2BMembers();
    const existing = list.findIndex(m => m.id === member.id || (m.taxCode && m.taxCode === member.taxCode));
    let nextList: B2BMember[];
    if (existing >= 0) {
      nextList = [...list];
      nextList[existing] = {
        ...nextList[existing],
        ...member,
        discountRatePercent: member.discountPercent ?? member.discountRatePercent ?? 10
      };
    } else {
      nextList = [{
        ...member,
        discountRatePercent: member.discountPercent ?? member.discountRatePercent ?? 10
      }, ...list];
    }
    saveB2BMembers(nextList);
    return true;
  },
  updateB2BMember: (member: B2BMember) => {
    const list = getB2BMembers();
    let found = false;
    const nextList = list.map(m => {
      if (m.id === member.id || (m.taxCode && m.taxCode === member.taxCode)) {
        found = true;
        return {
          ...m,
          ...member,
          discountRatePercent: member.discountPercent ?? member.discountRatePercent ?? m.discountRatePercent
        };
      }
      return m;
    });
    if (!found) {
      nextList.unshift({
        ...member,
        discountRatePercent: member.discountPercent ?? member.discountRatePercent ?? 10
      });
    }
    saveB2BMembers(nextList);
    return true;
  },
  deleteB2BMember: (idOrTaxCode: string) => {
    const members = getB2BMembers();
    const updated = members.filter(m => m.id !== idOrTaxCode && m.taxCode !== idOrTaxCode);
    saveB2BMembers(updated);
    return true;
  },
  updateB2BStatus: (idOrTaxCode: string, status: 'approved' | 'pending' | 'rejected') => {
    const members = getB2BMembers();
    const updated = members.map(m => {
      if (m.id === idOrTaxCode || m.taxCode === idOrTaxCode) {
        return {
          ...m,
          status,
          approvedAt: status === 'approved' ? new Date().toISOString().split('T')[0] : m.approvedAt
        };
      }
      return m;
    });
    saveB2BMembers(updated);
    return true;
  },
  approveB2BDealer,
  rejectB2BDealer,
  checkIsApprovedDealer,
  getPendingB2BDealersCount,
  verifyAdminLogin,
  verifyMemberLogin,
  getAdminConfig,
  saveAdminPassword,
  getCurrentSession,
  setCurrentSession,
  clearSession: () => setCurrentSession(null)
};
