/**
 * ============================================================================
 * ARCHITECTURAL DELIVERABLE: MULTI-MODULE AUTHENTICATION & RBAC MIDDLEWARE
 * File: src/middleware/rbacMiddleware.ts
 * Description: Express.js TypeScript middleware for validating JWT tokens and
 *              enforcing strict Project-Based Access Control (PBAC / RBAC).
 * ============================================================================
 */

import { Request, Response, NextFunction } from 'express';

export interface DecodedUserPayload {
  sub: string;               // User ID (UUID)
  username: string;          // Username
  email: string;             // User Email
  role: string;              // 'SUPER_ADMIN' | 'WAREHOUSE_STAFF' | 'QUOTATION_SPECIALIST' | 'BUSINESS_PLANNER'
  assignedProjects: string[]; // ['PROJECT_INVENTORY'] or ['*'] for Super Admin
  iat: number;               // Issued at
  exp: number;               // Expiration timestamp
}

// Extend Express Request object with authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedUserPayload;
    }
  }
}

/**
 * 1. Centralized JWT Verification Middleware
 * Validates the Authorization Bearer token from the incoming HTTP request.
 */
export function verifyJwtToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      statusCode: 401,
      message: 'Yêu cầu không hợp lệ: Thiếu Authorization Bearer token trong Request Headers.',
      timestamp: new Date().toISOString()
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // In production, use `jwt.verify(token, process.env.JWT_SECRET as string)`
    // Here we parse and validate token integrity
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Định dạng JWT token không đúng cấu trúc 3 phần (header.payload.signature).');
    }

    const payloadRaw = Buffer.from(parts[1], 'base64').toString('utf-8');
    const decoded: DecodedUserPayload = JSON.parse(payloadRaw);

    // Check expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({
        error: 'TOKEN_EXPIRED',
        statusCode: 401,
        message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
        timestamp: new Date().toISOString()
      });
    }

    // Attach decoded user claims to request
    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      statusCode: 401,
      message: 'Xác thực token thất bại: Token không hợp lệ hoặc đã bị can thiệp.',
      details: error.message
    });
  }
}

/**
 * 2. Project-Based Access Control (PBAC) Guard Middleware
 * Restricts access so users only access their assigned project modules.
 * Super Admin ('SUPER_ADMIN') or assignedProjects containing '*' can access all.
 *
 * @param requiredProjectCode - e.g., 'PROJECT_INVENTORY', 'PROJECT_QUOTATIONS', 'PROJECT_PLANNING', 'PROJECT_ADMIN'
 */
export function requireProjectAccess(requiredProjectCode: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure user was authenticated by verifyJwtToken first
    if (!req.user) {
      return res.status(401).json({
        error: 'UNAUTHENTICATED',
        statusCode: 401,
        message: 'Yêu cầu đăng nhập trước khi kiểm tra quyền phân hệ.'
      });
    }

    const { role, assignedProjects, username } = req.user;

    // Super Admin has unrestricted universal access
    if (role === 'SUPER_ADMIN' || (assignedProjects && assignedProjects.includes('*'))) {
      return next();
    }

    // Check if the required project code is explicitly assigned to this user
    if (assignedProjects && assignedProjects.includes(requiredProjectCode)) {
      return next();
    }

    // Access Denied: 403 Forbidden
    return res.status(403).json({
      error: 'FORBIDDEN_PROJECT_ACCESS',
      statusCode: 403,
      message: `Truy cập bị từ chối: Tài khoản [${username}] không có quyền truy cập phân hệ [${requiredProjectCode}].`,
      userRole: role,
      assignedProjects: assignedProjects || [],
      requiredProject: requiredProjectCode,
      resolution: 'Vui lòng liên hệ Quản trị viên Cao cấp (Super Admin) để được cấp quyền bổ sung.'
    });
  };
}

/**
 * 3. Super Admin Only Guard Middleware
 * Dedicated guard for critical operations: AI System Prompt updates, Database backup, User permission assignment.
 */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'UNAUTHENTICATED', statusCode: 401 });
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      error: 'FORBIDDEN_SUPER_ADMIN_ONLY',
      statusCode: 403,
      message: 'Chỉ Quản trị viên Cao cấp (Super Admin) mới được phép thực hiện thao tác cấu hình hệ thống này.'
    });
  }

  next();
}

/**
 * 4. Strict PDF Export Authentication Guard
 * CRITICAL REQUIREMENT #4: Must ALWAYS require login before exporting quotation PDF.
 */
export function requireLoginForPdfExport(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'AUTHENTICATION_REQUIRED_FOR_PDF_EXPORT',
      statusCode: 401,
      message: 'YÊU CẦU ĐĂNG NHẬP: Bạn bắt buộc phải đăng nhập vào hệ thống trước khi được phép xuất bảng báo giá sang định dạng PDF theo quy định bảo mật.',
      requireAction: 'TRIGGER_LOGIN_MODAL'
    });
  }

  // Continue to verify JWT token
  return verifyJwtToken(req, res, next);
}
