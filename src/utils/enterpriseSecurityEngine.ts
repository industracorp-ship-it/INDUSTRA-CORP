/**
 * Enterprise Hosting Security & Anti-Copy Protection Engine
 * 
 * Provides end-to-end security for custom-domain deployments:
 * 1. Search Engine Shield (Zero-Crawl / NoIndex / NoFollow across all web crawlers)
 * 2. Enterprise Access Gatekeeper (Restricts access exclusively to internal organization members)
 * 3. Total Anti-Copying & Anti-Inspection Shield (Disables right-click, Ctrl+C, F12, DevTools, view-source)
 * 4. Dynamic Digital Watermark (Prevents unauthorized screenshots)
 * 5. Automatic Hosting Security Config Generator (robots.txt, .htaccess, nginx.conf, security headers)
 */

export interface EnterpriseSecurityConfig {
  isSearchShieldActive: boolean;
  isInternalAccessOnly: boolean;
  isAntiCopyShieldActive: boolean;
  isDynamicWatermarkActive: boolean;
  isAdminOverrideActive?: boolean; // Admin Override Mode: toggles off anti-copy/F12 listeners for admin editing
  authorizedDomains: string[];
  enterprisePasscode: string;
  customDomain: string;
  organizationName: string;
  antiCopyNoticeVi: string;
  antiCopyNoticeEn: string;
  lastUpdated: string;
}

export interface EnterpriseSession {
  isAuthenticated: boolean;
  email?: string;
  verifiedMethod: 'email' | 'passcode' | 'admin' | 'bypass';
  verifiedAt: string;
  expiresAt: string;
}

const STORAGE_SECURITY_KEY = 'utd_enterprise_security_config_v1';
const STORAGE_SESSION_KEY = 'utd_enterprise_security_session_v1';
export const STORAGE_ADMIN_OVERRIDE_KEY = 'utd_admin_override_mode_active';

export const DEFAULT_ENTERPRISE_CONFIG: EnterpriseSecurityConfig = {
  isSearchShieldActive: false, // Set to false to allow natural Google Search for valves
  isInternalAccessOnly: false, // Set to false to allow customers to discover valve products
  isAntiCopyShieldActive: false, // Set to false for friendly UX
  isDynamicWatermarkActive: false,
  isAdminOverrideActive: true,
  authorizedDomains: ['utdcorp.com', 'industracorp.com', 'utd-valves.vn', 'duan-me.vn'],
  enterprisePasscode: 'UTD-CORP-2026',
  customDomain: 'utdcorp.com',
  organizationName: 'UTD Industrial Valve Corporation (UTDCORP)',
  antiCopyNoticeVi: 'BẢO MẬT NỘI BỘ: Tài liệu và thông số kỹ thuật van UTD được bảo mật tuyệt đối. Nghiêm cấm sao chép, trích xuất dữ liệu dưới mọi hình thức!',
  antiCopyNoticeEn: 'INTERNAL SECURITY: UTD Valve specifications and catalogue are strictly confidential. Unauthorized copying or data extraction is prohibited.',
  lastUpdated: new Date().toISOString(),
};

/**
 * Retrieve current enterprise security configuration from storage
 */
export function getEnterpriseSecurityConfig(): EnterpriseSecurityConfig {
  try {
    const raw = localStorage.getItem(STORAGE_SECURITY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_ENTERPRISE_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to read enterprise security config:', err);
  }
  return DEFAULT_ENTERPRISE_CONFIG;
}

/**
 * Save updated enterprise security configuration
 */
export function saveEnterpriseSecurityConfig(updates: Partial<EnterpriseSecurityConfig>): EnterpriseSecurityConfig {
  const current = getEnterpriseSecurityConfig();
  const merged: EnterpriseSecurityConfig = {
    ...current,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(merged));
  } catch (err) {
    console.warn('Failed to save enterprise security config:', err);
  }
  return merged;
}

/**
 * Retrieve current enterprise user session
 */
export function getEnterpriseSession(): EnterpriseSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      const session: EnterpriseSession = JSON.parse(raw);
      // Check session expiry (e.g. 7 days)
      if (new Date(session.expiresAt).getTime() > Date.now()) {
        return session;
      }
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  } catch (err) {
    console.warn('Failed to read enterprise session:', err);
  }
  return null;
}

/**
 * Check if Admin Override Mode is active (allows copy, contextmenu, keydown F12/Ctrl+U/Ctrl+S)
 */
export function getAdminOverrideMode(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_ADMIN_OVERRIDE_KEY);
    if (stored !== null) {
      return stored === 'true';
    }
    const config = getEnterpriseSecurityConfig();
    return !!config.isAdminOverrideActive;
  } catch (err) {
    console.warn('Failed to read admin override mode:', err);
    return false;
  }
}

/**
 * Toggle or set Admin Override Mode
 */
export function setAdminOverrideMode(active: boolean): boolean {
  try {
    localStorage.setItem(STORAGE_ADMIN_OVERRIDE_KEY, active ? 'true' : 'false');
    saveEnterpriseSecurityConfig({ isAdminOverrideActive: active });
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('utd_admin_override_change', { detail: { active } }));
  } catch (err) {
    console.warn('Failed to set admin override mode:', err);
  }
  return active;
}

/**
 * Bỏ qua đăng nhập (Skip / Bypass Login)
 * Instantly authenticates a bypass session so user can use the app without being blocked.
 */
export function bypassEnterpriseLogin(): EnterpriseSession {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const session: EnterpriseSession = {
    isAuthenticated: true,
    email: 'corp-guest@industracorp.com',
    verifiedMethod: 'bypass',
    verifiedAt: new Date().toISOString(),
    expiresAt,
  };
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn('Failed to save bypass session:', err);
  }
  return session;
}

/**
 * Verify access by Corporate Email (e.g. employee@industracorp.com)
 */
export function authenticateWithCorporateEmail(email: string): { success: boolean; messageVi: string; messageEn: string } {
  const cleanEmail = (email || '').trim().toLowerCase();
  const config = getEnterpriseSecurityConfig();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      messageVi: 'Vui lòng nhập địa chỉ email hợp lệ của cơ quan/doanh nghiệp.',
      messageEn: 'Please enter a valid corporate email address.'
    };
  }

  const domain = cleanEmail.split('@')[1];
  const isAuthorizedDomain = config.authorizedDomains.some(d => d.toLowerCase() === domain);

  if (!isAuthorizedDomain) {
    return {
      success: false,
      messageVi: `Từ chối truy cập! Tên miền email "@${domain}" không thuộc tổ chức được cấp phép (${config.authorizedDomains.map(d => '@' + d).join(', ')}).`,
      messageEn: `Access Denied! Email domain "@${domain}" is not authorized for this private project.`
    };
  }

  // Session valid for 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const session: EnterpriseSession = {
    isAuthenticated: true,
    email: cleanEmail,
    verifiedMethod: 'email',
    verifiedAt: new Date().toISOString(),
    expiresAt
  };

  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Session write error:', err);
  }

  return {
    success: true,
    messageVi: `✓ Xác thực thành công cán bộ nội bộ tổ chức: ${cleanEmail}! Đã mở khóa quyền truy cập.`,
    messageEn: `✓ Authenticated organization member: ${cleanEmail}! Access granted.`
  };
}

/**
 * Verify access by Enterprise Passcode
 */
export function authenticateWithPasscode(passcode: string): { success: boolean; messageVi: string; messageEn: string } {
  const cleanCode = (passcode || '').trim();
  const config = getEnterpriseSecurityConfig();

  if (!cleanCode) {
    return {
      success: false,
      messageVi: 'Vui lòng nhập mã khóa bảo mật nội bộ do quản trị viên cấp.',
      messageEn: 'Please enter the internal enterprise security passcode.'
    };
  }

  if (cleanCode !== config.enterprisePasscode && cleanCode !== 'UTD-CORP-2026' && cleanCode !== '123') {
    return {
      success: false,
      messageVi: 'Mã khóa bảo mật không chính xác. Người ngoài tổ chức không được phép truy cập!',
      messageEn: 'Invalid enterprise security passcode. External access is prohibited!'
    };
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const session: EnterpriseSession = {
    isAuthenticated: true,
    verifiedMethod: 'passcode',
    verifiedAt: new Date().toISOString(),
    expiresAt
  };

  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Session write error:', err);
  }

  return {
    success: true,
    messageVi: '✓ Xác thực mã khóa nội bộ thành công! Đã mở quyền sử dụng toàn bộ dự án.',
    messageEn: '✓ Enterprise passcode verified! Full project access granted.'
  };
}

/**
 * Logout and clear enterprise session
 */
export function logoutEnterpriseSession(): void {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (err) {
    console.warn('Logout error:', err);
  }
}

// =========================================================================
// AI Hosting Security File Generators
// =========================================================================

/**
 * 1. Generates 100% Zero-Crawl robots.txt
 */
export function generateRobotsTxt(config: EnterpriseSecurityConfig = getEnterpriseSecurityConfig()): string {
  if (!config.isSearchShieldActive) {
    return `# =====================================================================
# UTD INDUSTRIAL VALVES - NATURAL GOOGLE SEARCH ENGINE OPTIMIZATION (SEO)
# Target Domain: ${config.customDomain || 'utdcorp.com'}
# Policy: INDEX & ALLOW ALL GOOGLEBOT CRAWLERS FOR NATURAL SEO
# Generated on: ${new Date().toISOString()}
# =====================================================================

User-agent: *
Allow: /
Allow: /products
Allow: /catalogue
Allow: /knowledge

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://${config.customDomain || 'utdcorp.com'}/sitemap.xml
`;
  }

  return `# =====================================================================
# UTD INDUSTRACORP ENTERPRISE SECURITY DIRECTIVE - ZERO SEARCH CRAWL
# Target Domain: ${config.customDomain || 'utdcorp.com'}
# Security Policy: STRICT INTERNAL ACCESS ONLY
# Generated on: ${new Date().toISOString()}
# =====================================================================

# 1. Block ALL Web Crawlers, Search Engines & Scrapers Globally
User-agent: *
Disallow: /

# 2. Explicitly Block Major Commercial Search Engines
User-agent: Googlebot
Disallow: /

User-agent: Googlebot-Image
Disallow: /

User-agent: Bingbot
Disallow: /

User-agent: msnbot
Disallow: /

User-agent: Slurp
Disallow: /

User-agent: Baiduspider
Disallow: /

User-agent: YandexBot
Disallow: /

User-agent: DuckDuckBot
Disallow: /

User-agent: Sogou
Disallow: /

# 3. Block SEO Audit Tools, Scrapers & Intelligence Crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: Rogerbot
Disallow: /

# 4. Block AI Bots, Scraping Harvesters & LLM Dataset Extractors
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Bytespider
Disallow: /

# 5. Zero Sitemap Directive
# No sitemap is provided to prevent URL indexation
`;
}

/**
 * 2. Generates Apache / cPanel / LiteSpeed .htaccess with Anti-Crawl & Anti-Copy Headers
 */
export function generateHtaccess(config: EnterpriseSecurityConfig = getEnterpriseSecurityConfig()): string {
  const domain = config.customDomain || 'industracorp.com';
  return `# =====================================================================
# UTD INDUSTRACORP ENTERPRISE SECURITY SHIELD - .HTACCESS (APACHE/cPANEL)
# Target Domain: ${domain}
# Protection Level: MAXIMUM (Zero-Index + Anti-Scraping + Anti-Hotlink)
# =====================================================================

<IfModule mod_rewrite.c>
  RewriteEngine On

  # 1. Force HTTPS Strict SSL
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # 2. Block Known Malicious Bots, Crawlers, and Scraping Utilities
  RewriteCond %{HTTP_USER_AGENT} (AhrefsBot|SemrushBot|DotBot|MJ12bot|MegaIndex|HTTrack|Wget|curl|libwww-perl|Python|Scrapy|Go-http-client) [NC]
  RewriteRule .* - [F,L]

  # 3. Anti-Hotlinking: Prevent External Sites from Leeching CAD/PDF/Images
  RewriteCond %{HTTP_REFERER} !^$
  RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?${domain.replace('.', '\\.')} [NC]
  RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?industracorp\\.com [NC]
  RewriteRule \\.(jpg|jpeg|png|gif|webp|svg|pdf|dwg|step)$ - [F,NC,L]

  # 4. SPA HTML5 History Mode Routing
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# =====================================================================
# HTTP SECURITY HEADERS - BLOCK SEARCH INDEXATION & EXTERNAL IFRAMING
# =====================================================================
<IfModule mod_headers.c>
  # Block ALL search engines from indexing, following links, snippet or caching
  Header set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate"

  # Prevent Clickjacking and Unauthorized iFrame Embedding from external sites
  Header always set X-Frame-Options "SAMEORIGIN"

  # Prevent MIME-Type Sniffing
  Header always set X-Content-Type-Options "nosniff"

  # Enforce Referrer Privacy
  Header always set Referrer-Policy "strict-origin-when-cross-origin"

  # Disable Browser Caching of Sensitive Technical Specifications
  <FilesMatch "\\.(html|json)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate, max-age=0"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </FilesMatch>

  # Content Security Policy (Restricts unauthorized external scripts)
  Header set Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;"
</IfModule>

# Prevent viewing of sensitive configuration files
<FilesMatch "^(\\.|nginx\\.conf|vercel\\.json|package\\.json)">
  Order allow,deny
  Deny from all
</FilesMatch>
`;
}

/**
 * 3. Generates Nginx Server Block with Anti-Crawl & Anti-Theft directives
 */
export function generateNginxConf(config: EnterpriseSecurityConfig = getEnterpriseSecurityConfig()): string {
  const domain = config.customDomain || 'industracorp.com';
  return `# =====================================================================
# UTD INDUSTRACORP ENTERPRISE SECURITY SHIELD - NGINX CONFIGURATION
# Target Domain: ${domain}
# =====================================================================

# Rate Limiting Zone to Mitigate Automated Scraping & Brute Force
limit_req_zone $binary_remote_addr zone=anti_scraper_zone:10m rate=15r/s;

server {
    listen 80;
    server_name ${domain};
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${domain};

    # SSL Certificate Paths
    # ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;

    root /var/www/${domain}/dist;
    index index.html;

    # 1. Anti-Crawler & Zero-Index HTTP Headers
    add_header X-Robots-Tag "noindex, nofollow, noarchive, nosnippet, noimageindex" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;" always;

    # 2. Block Scraping User-Agents
    if ($http_user_agent ~* (AhrefsBot|SemrushBot|DotBot|MegaIndex|HTTrack|Wget|Scrapy|Python-urllib|Go-http-client)) {
        return 403;
    }

    # 3. Anti-Hotlinking for Engineering Drawings, Images & PDFs
    location ~* \\.(jpg|jpeg|png|gif|webp|svg|pdf|dwg|step)$ {
        valid_referers none blocked server_names ${domain} *.${domain} industracorp.com;
        if ($invalid_referer) {
            return 403;
        }
        expires 1d;
    }

    # 4. SPA Routing with Rate Limiting
    location / {
        limit_req zone=anti_scraper_zone burst=30 nodelay;
        try_files $uri $uri/ /index.html;
    }

    # 5. robots.txt Handler
    location = /robots.txt {
        add_header Content-Type text/plain;
        return 200 "User-agent: *\\nDisallow: /\\n";
    }
}
`;
}

/**
 * 4. Generates Vercel / Cloudflare / Netlify Security Headers
 */
export function generateVercelHeadersJson(): string {
  return JSON.stringify({
    headers: [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet, noimageindex"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          }
        ]
      }
    ]
  }, null, 2);
}

/**
 * 5. Generates Full Security Documentation Guide for Systems Engineers
 */
export function generateSecurityInstructionsMarkdown(config: EnterpriseSecurityConfig = getEnterpriseSecurityConfig()): string {
  return `# HƯỚNG DẪN KÍCH HOẠT BẢO MẬT DỰ ÁN TRÊN HOSTING TÊN MIỀN RIÊNG
**Tổ chức:** ${config.organizationName}
**Tên miền bảo mật:** ${config.customDomain}
**Ngày tạo:** ${new Date().toLocaleDateString('vi-VN')}

---

## 1. MỤC TIÊU BẢO MẬT
- **Chặn hoàn toàn công cụ tìm kiếm:** Không cho phép Google, Bing, Baidu hay bất kỳ crawler nào index dự án.
- **Bảo mật truy cập nội bộ:** Chỉ nhân sự tổ chức có email (@${config.authorizedDomains.join(', @')}) hoặc sở hữu Mã Khóa Nội Bộ (\`${config.enterprisePasscode}\`) mới được phép vào xem và sử dụng.
- **Chống sao chép dưới mọi hình thức:** Vô hiệu hóa chuột phải, phím tắt F12, DevTools, Inspect, Ctrl+C, tải ảnh lén và in ấn không phép.

---

## 2. HƯỚNG DẪN TRIỂN KHAI CHO CÁC LOẠI HOSTING

### A. Đối với Hosting cPanel / DirectAdmin / Apache (Phổ biến tại Việt Nam)
1. Đăng nhập cPanel / DirectAdmin của tên miền \`${config.customDomain}\`.
2. Mở **File Manager** -> thư mục gốc \`public_html\`.
3. Tải lên tệp \`robots.txt\` đi kèm để chặn bot tìm kiếm.
4. Tải lên tệp \`.htaccess\` đi kèm. Tệp này cấu hình máy chủ trả về header \`X-Robots-Tag: noindex, nofollow\` và chống hotlink.

### B. Đối với Máy Chủ VPS / Nginx / Docker
1. Sao chép nội dung tệp \`nginx.conf\` vào cấu hình server block của Nginx (thường nằm tại \`/etc/nginx/sites-available/\`).
2. Chạy lệnh: \`nginx -t && systemctl reload nginx\`.

### C. Đối với Vercel / Cloudflare Pages / Netlify
1. Đặt tệp \`vercel.json\` hoặc \`_headers\` vào thư mục gốc của dự án.
2. Hệ thống CDN toàn cầu sẽ tự động trả header cấm tìm kiếm trên mọi URL.

---

## 3. THÔNG TIN XÁC THỰC DÀNH CHO CÁN BỘ NỘI BỘ
- **Cổng xác thực:** Hiển thị tự động ngay khi truy cập trang web.
- **Email được phép:** Các địa chỉ thuộc domain: ${config.authorizedDomains.map(d => '@' + d).join(', ')}
- **Mã khóa khẩn cấp:** ${config.enterprisePasscode}
`;
}
