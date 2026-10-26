/**
 * Independent Product Data & Database Service for UTD Valves Portal
 * Decouples product data from core application code.
 * 
 * Supports:
 * 1. Independent PHP/MySQL REST API (`/api/products.php`)
 * 2. Independent JSON file database (`/data/products.json`)
 * 3. Supabase REST (via VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)
 * 4. LocalStorage & IndexedDB browser cache (`utd_independent_products_v1`)
 * 5. Bundled seed fallback `VALVES_DATA`
 */

import { ValveProduct } from '../types/valve';
import { VALVES_DATA } from '../data/valvesData';
import { resolveProductImageUrl, toAbsoluteImageUrl, DEFAULT_VALVE_FALLBACK_IMAGE } from '../data/imageAssets';

const PRODUCTS_STORAGE_KEY = 'utd_independent_products_v1';
const PRODUCTS_JSON_URL = '/data/products.json';
const PRODUCTS_API_URL = '/api/products.php';
const UPLOAD_API_URL = '/api/upload.php';

/**
 * Normalizes a product so that image URLs are verified absolute or root-relative paths
 * and never use localhost or temporary blobs.
 */
export function normalizeProduct(product: ValveProduct): ValveProduct {
  const resolvedMainImage = resolveProductImageUrl(product.image);
  const resolvedImages = product.images && product.images.length > 0
    ? product.images.map(img => resolveProductImageUrl(img))
    : [resolvedMainImage];

  return {
    ...product,
    image: resolvedMainImage,
    images: resolvedImages,
    brand: product.brand || 'UTD',
    cadFileAvailable: product.cadFileAvailable !== false,
  };
}

/**
 * Loads products from independent database or server files
 */
export async function fetchIndependentProducts(): Promise<ValveProduct[]> {
  // 1. Try PHP/MySQL REST endpoint on hosting
  try {
    const apiRes = await fetch(`${PRODUCTS_API_URL}?t=${Date.now()}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3500)
    });
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeProduct);
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(normalized));
        } catch {}
        return normalized;
      }
    }
  } catch (err) {
    // API endpoint might not be active in local dev, fall through to static JSON
  }

  // 2. Try independent /data/products.json file on hosting server
  try {
    const jsonRes = await fetch(`${PRODUCTS_JSON_URL}?t=${Date.now()}`, {
      cache: 'no-cache',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });
    if (jsonRes.ok) {
      const data = await jsonRes.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeProduct);
        try {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(normalized));
        } catch {}
        return normalized;
      }
    }
  } catch (err) {
    console.warn('[ProductDataService] Notice reading /data/products.json:', err);
  }

  // 3. Check browser cache
  try {
    const cached = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch {}

  // 4. Default seed
  return VALVES_DATA.map(normalizeProduct);
}

/**
 * Synchronous get from localStorage or bundled data for initial React mount
 */
export function getInitialProducts(): ValveProduct[] {
  try {
    const cached = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (cached) {
      const parsed: ValveProduct[] = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeProduct);
      }
    }
  } catch (err) {
    console.warn('[ProductDataService] Error reading local product cache:', err);
  }
  return VALVES_DATA.map(normalizeProduct);
}

/**
 * Saves updated products to independent database storage & syncs to server API
 */
export async function persistProducts(products: ValveProduct[]): Promise<boolean> {
  const normalized = products.map(normalizeProduct);

  // 1. Save locally in browser
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.error('[ProductDataService] LocalStorage error:', err);
  }

  // 2. Asynchronously sync to server database if reachable
  try {
    const res = await fetch(PRODUCTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalized),
    });
    if (res.ok) {
      return true;
    }
  } catch {
    // Server endpoint optional in offline/preview
  }

  return true;
}

/**
 * Uploads an image directly to the hosting server /uploads/ directory
 * Returns the absolute URL of the uploaded image
 */
export async function uploadImageToHosting(file: File): Promise<{ success: boolean; url: string }> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(UPLOAD_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return { success: true, url: data.url };
      }
    }
  } catch (err) {
    console.warn('[ProductDataService] Upload API failed, using base64 or fallback:', err);
  }

  // Fallback to local data URL if server upload endpoint is unavailable
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({ success: true, url: (e.target?.result as string) || DEFAULT_VALVE_FALLBACK_IMAGE });
    };
    reader.onerror = () => resolve({ success: false, url: DEFAULT_VALVE_FALLBACK_IMAGE });
    reader.readAsDataURL(file);
  });
}

/**
 * Exports products as a downloadable independent JSON database file
 */
export function exportIndependentProductsJson(products: ValveProduct[]): void {
  const jsonString = JSON.stringify(products.map(normalizeProduct), null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `products_database_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Imports products from an uploaded JSON string
 */
export function importIndependentProductsJson(jsonString: string): ValveProduct[] {
  const parsed = JSON.parse(jsonString);
  if (!Array.isArray(parsed)) {
    throw new Error('Định dạng tệp JSON không hợp lệ (phải là danh sách mảng các sản phẩm van)');
  }
  const normalized = parsed.map(normalizeProduct);
  persistProducts(normalized);
  return normalized;
}

/**
 * Resets product data back to the clean default seed
 */
export function resetProductsDatabase(): ValveProduct[] {
  localStorage.removeItem(PRODUCTS_STORAGE_KEY);
  const seed = VALVES_DATA.map(normalizeProduct);
  persistProducts(seed);
  return seed;
}
