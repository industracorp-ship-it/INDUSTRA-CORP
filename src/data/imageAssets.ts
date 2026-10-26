/**
 * Centralized Image Asset & Cloud Storage URL Resolver
 * Supports:
 * 1. Absolute Cloud URLs (S3, Cloudinary, Supabase Storage, CDN)
 * 2. Absolute Hosting Domain URLs (https://www.industracorp.com/uploads/...)
 * 3. Static public uploads (/uploads/...)
 * 4. Automatic sanitization against localhost / temporary blob URLs
 * 5. Graceful SVG fallback ensuring zero broken image icons
 */

export const CDN_BASE_URL: string = (() => {
  if (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.includes('localhost')) {
    return window.location.origin;
  }
  return (import.meta as any).env?.VITE_CDN_BASE_URL || 'https://www.industracorp.com';
})();

export const HERO_PIPELINE_IMAGE = '/uploads/hero_pipeline.jpg';
export const STUDIO_BALL_VALVE_IMAGE = '/uploads/studio_ball_valve.jpg';
export const VALVE_DETAIL_IMAGE = '/uploads/valve_detail.jpg';
export const PROJECT_HVAC_CHILLER_IMAGE = '/uploads/project_hvac_chiller.jpg';
export const PROJECT_REFINERY_PLANT_IMAGE = '/uploads/project_refinery_plant.jpg';
export const DEFAULT_VALVE_FALLBACK_IMAGE = '/uploads/valve_placeholder.svg';

/**
 * Resolves any image URL to a reliable absolute or root-public URL.
 * Automatically migrates legacy development /src/assets/ paths to persistent /uploads/ paths.
 * Cleanses temporary blob: or localhost: URLs to prevent broken image references on hosting.
 */
export function resolveProductImageUrl(url?: string | null, forceAbsolute = false): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return forceAbsolute ? `${CDN_BASE_URL}${DEFAULT_VALVE_FALLBACK_IMAGE}` : DEFAULT_VALVE_FALLBACK_IMAGE;
  }

  const trimmed = url.trim();

  // Guard: Never allow temporary blob: or localhost URLs on production hosting
  if (trimmed.startsWith('blob:') || trimmed.includes('localhost:') || trimmed.includes('127.0.0.1')) {
    // If it was an upload, try extracting filename or fallback safely
    const match = trimmed.match(/\/([^\/?#]+\.(?:jpg|jpeg|png|webp|svg))/i);
    if (match && match[1]) {
      const safePath = `/uploads/${match[1]}`;
      return forceAbsolute ? `${CDN_BASE_URL}${safePath}` : safePath;
    }
    return forceAbsolute ? `${CDN_BASE_URL}${DEFAULT_VALVE_FALLBACK_IMAGE}` : DEFAULT_VALVE_FALLBACK_IMAGE;
  }

  // Base64 Data URL (e.g. from canvas or image optimizer)
  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // If already absolute HTTP(S) URL (e.g. S3 / Cloudinary / Supabase / External CDN)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Convert legacy development /src/assets/images/ paths to persistent /uploads/ paths
  let cleanPath = trimmed;
  if (cleanPath.startsWith('/src/assets/images/')) {
    cleanPath = `/uploads/${cleanPath.replace('/src/assets/images/', '')}`;
  } else if (cleanPath.startsWith('src/assets/images/')) {
    cleanPath = `/uploads/${cleanPath.replace('src/assets/images/', '')}`;
  } else if (cleanPath.startsWith('uploads/')) {
    cleanPath = `/${cleanPath}`;
  } else if (cleanPath.startsWith('images/')) {
    cleanPath = `/${cleanPath}`;
  } else if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }

  if (forceAbsolute) {
    return `${CDN_BASE_URL}${cleanPath}`;
  }

  return cleanPath;
}

/**
 * Explicitly generates an absolute URL with full HTTPS domain for external exports,
 * XML sitemaps, OpenGraph metadata, and API payloads.
 */
export function toAbsoluteImageUrl(url?: string | null): string {
  return resolveProductImageUrl(url, true);
}
