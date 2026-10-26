import { ValveProduct, CategoryItem, CompanyContactInfo } from '../types/valve';
import { VALVES_DATA } from '../data/valvesData';
import { DEFAULT_CATEGORIES } from '../data/categoryData';
import { synthesizeValveCharacteristics } from './aiCharacteristics';
import { resolveProductImageUrl } from '../data/imageAssets';

const DB_NAME = 'industracorp_db_v1';
const STORE_NAME = 'catalog_store';
const PRODUCTS_KEY = 'valves_products_list';
const CATEGORIES_KEY = 'valves_categories_list';
const CONTACT_KEY = 'company_contact_info';
const META_KEY = 'storage_metadata';
const LOCALSTORAGE_BACKUP_KEY = 'industracorp_valves_catalog_v2';
const LOCALSTORAGE_CATEGORIES_KEY = 'utd_industracorp_categories_v1';

/**
 * Normalizes product image paths and ensures valid URLs
 */
function normalizeProductRecord(p: ValveProduct): ValveProduct {
  const mainImg = resolveProductImageUrl(p.image);
  const imagesList = p.images && p.images.length > 0
    ? p.images.map(img => resolveProductImageUrl(img))
    : [mainImg];
  return {
    ...p,
    image: mainImg,
    images: imagesList,
    brand: p.brand || 'UTD',
    characteristics: p.characteristics || synthesizeValveCharacteristics(p),
  };
}

/**
 * Ensures loaded catalog has full brand coverage and AI characteristics
 */
function ensureCatalogCompleteness(loaded: ValveProduct[]): ValveProduct[] {
  if (!Array.isArray(loaded) || loaded.length === 0) return VALVES_DATA.map(normalizeProductRecord);

  const existingIds = new Set(loaded.map(p => p.id));
  const enriched = loaded.map(normalizeProductRecord);

  const missing = VALVES_DATA.filter(p => !existingIds.has(p.id)).map(normalizeProductRecord);
  if (missing.length > 0) {
    const combined = [...enriched, ...missing];
    putToIDB(PRODUCTS_KEY, combined).catch(() => {});
    try {
      localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, JSON.stringify(createSafeLocalStoragePayload(combined)));
    } catch {}
    return combined;
  }

  return enriched;
}

// Open or initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// Low-level get from IndexedDB
async function getFromIDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result as T || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn('IndexedDB read warning:', err);
    return null;
  }
}

// Low-level put into IndexedDB
async function putToIDB<T>(key: string, value: T): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.error('IndexedDB write error:', err);
    return false;
  }
}

/**
 * Load products with multi-tier recovery:
 * 1. Read from IndexedDB (unlimited quota, safe from browser limits)
 * 2. If empty, read from LocalStorage
 * 3. If empty, fallback to VALVES_DATA default and seed storage
 * NEVER overwrites user data when IndexedDB or LocalStorage already contains products!
 */
export async function loadProductsFromStorage(): Promise<ValveProduct[]> {
  try {
    // 1. Try IndexedDB
    const fromIDB = await getFromIDB<ValveProduct[]>(PRODUCTS_KEY);
    if (fromIDB && Array.isArray(fromIDB) && fromIDB.length > 0) {
      const completeList = ensureCatalogCompleteness(fromIDB);
      // Also update LocalStorage backup if possible
      try {
        const safeForLocal = createSafeLocalStoragePayload(completeList);
        localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, JSON.stringify(safeForLocal));
      } catch {
        // ignore
      }
      return completeList;
    }

    // 2. Try LocalStorage
    const rawLocal = localStorage.getItem(LOCALSTORAGE_BACKUP_KEY);
    if (rawLocal) {
      const parsed = JSON.parse(rawLocal);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const completeList = ensureCatalogCompleteness(parsed);
        // Migrate to IndexedDB
        await putToIDB(PRODUCTS_KEY, completeList);
        return completeList;
      }
    }
  } catch (err) {
    console.warn('Error reading from storage:', err);
  }

  // 3. Try independent remote database from hosting server (/data/products.json or /api/products.php)
  try {
    const remoteRes = await fetch(`/data/products.json?t=${Date.now()}`, {
      cache: 'no-cache',
      signal: AbortSignal.timeout(3000)
    });
    if (remoteRes.ok) {
      const remoteData = await remoteRes.json();
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        const completeList = ensureCatalogCompleteness(remoteData);
        await saveProductsToStorage(completeList);
        return completeList;
      }
    }
  } catch {
    // Offline / fallback to seed
  }

  // 4. Fallback: only if completely empty and server unreachable
  const initial = VALVES_DATA;
  await saveProductsToStorage(initial);
  return initial;
}

/**
 * Synchronously load initial products for immediate first-render without flicker
 */
export function loadProductsSyncFallback(): ValveProduct[] {
  try {
    const raw = localStorage.getItem(LOCALSTORAGE_BACKUP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return ensureCatalogCompleteness(parsed);
      }
    }
  } catch {
    // ignore
  }
  return VALVES_DATA;
}

/**
 * Helper to ensure LocalStorage payload never exceeds 5MB quota even with base64 images
 */
function createSafeLocalStoragePayload(products: ValveProduct[]): ValveProduct[] {
  return products.map(p => {
    // If image is a huge data URL (> 80KB), keep a safe URL in localStorage
    // while IndexedDB keeps the full high-res data URL!
    if (p.image && p.image.startsWith('data:') && p.image.length > 80000) {
      return {
        ...p,
        image: '/uploads/studio_ball_valve.jpg',
      };
    }
    return normalizeProductRecord(p);
  });
}

/**
 * Save products with dual persistence into IndexedDB AND LocalStorage.
 * Never allows products to be wiped silently.
 */
export async function saveProductsToStorage(products: ValveProduct[]): Promise<boolean> {
  if (!products || !Array.isArray(products) || products.length === 0) {
    console.error('Safety guard: Refusing to save empty or invalid products list to storage.');
    return false;
  }

  const meta = {
    lastSaved: new Date().toISOString(),
    productCount: products.length,
    status: 'Lưu trữ an toàn vĩnh viễn (IndexedDB + LocalStorage)',
  };

  // 1. Save full products array to IndexedDB (unlimited quota, full base64 images preserved)
  let idbSuccess = false;
  try {
    idbSuccess = await putToIDB(PRODUCTS_KEY, products);
    await putToIDB(META_KEY, meta);
  } catch (e) {
    console.warn('IDB write failed:', e);
  }

  // 2. Save backup to LocalStorage with safe quota handling
  try {
    localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, JSON.stringify(products));
    localStorage.setItem('industracorp_storage_meta', JSON.stringify(meta));
  } catch (quotaErr) {
    console.warn('LocalStorage quota warning - saving optimized payload:', quotaErr);
    try {
      const safePayload = createSafeLocalStoragePayload(products);
      localStorage.setItem(LOCALSTORAGE_BACKUP_KEY, JSON.stringify(safePayload));
      localStorage.setItem('industracorp_storage_meta', JSON.stringify(meta));
    } catch (e2) {
      console.warn('LocalStorage backup failed completely (IndexedDB is source of truth):', e2);
    }
  }

  return idbSuccess;
}

/**
 * Export complete system database as downloadable JSON file for hosting
 */
export function exportHostingSyncPackage(
  products: ValveProduct[],
  categories: CategoryItem[],
  contactInfo: CompanyContactInfo
): void {
  const syncPayload = {
    meta: {
      generator: 'Industracorp Data Storage & Hosting Sync Center',
      version: '2026.3.0',
      exportedAt: new Date().toISOString(),
      productCount: products.length,
      categoryCount: categories.length,
      note: 'Tệp tin đồng bộ dữ liệu chính thức dùng để upload lên hệ thống hoặc hosting industracorp.com',
    },
    contactInfo,
    categories,
    products,
  };

  const jsonStr = JSON.stringify(syncPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `industracorp_hosting_sync_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export products as clean TypeScript code for src/data/valvesData.ts
 * so admin can directly paste or overwrite into their repo when deploying!
 */
export function exportValvesAsTypeScriptCode(products: ValveProduct[]): void {
  const tsContent = `import { ValveProduct } from '../types/valve';

/**
 * BẢNG DỮ LIỆU ĐỒNG BỘ CHÍNH THỨC INDUSTRACORP
 * Xuất bản ngày: ${new Date().toLocaleString('vi-VN')}
 * Tổng số sản phẩm: ${products.length} dòng van
 */
export const HERO_PIPELINE_IMAGE = 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=2000&q=80';

export const VALVES_DATA: ValveProduct[] = ${JSON.stringify(products, null, 2)};
`;

  const blob = new Blob([tsContent], { type: 'text/typescript;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'valvesData.ts';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import a full database package from uploaded JSON
 */
export async function importHostingSyncPackage(
  jsonText: string
): Promise<{
  success: boolean;
  products?: ValveProduct[];
  categories?: CategoryItem[];
  contactInfo?: CompanyContactInfo;
  error?: string;
}> {
  try {
    const parsed = JSON.parse(jsonText);

    let productsToLoad: ValveProduct[] = [];
    let categoriesToLoad: CategoryItem[] | undefined;
    let contactInfoToLoad: CompanyContactInfo | undefined;

    // Support both wrapper format and pure array format
    if (Array.isArray(parsed)) {
      productsToLoad = parsed;
    } else if (parsed && Array.isArray(parsed.products)) {
      productsToLoad = parsed.products;
      if (Array.isArray(parsed.categories)) {
        categoriesToLoad = parsed.categories;
      }
      if (parsed.contactInfo && typeof parsed.contactInfo === 'object') {
        contactInfoToLoad = parsed.contactInfo;
      }
    } else {
      return { success: false, error: 'Định dạng file JSON không chứa mảng danh mục sản phẩm hợp lệ!' };
    }

    if (productsToLoad.length === 0) {
      return { success: false, error: 'File rỗng, không tìm thấy sản phẩm nào để đồng bộ!' };
    }

    // Persist immediately to IndexedDB and LocalStorage
    await saveProductsToStorage(productsToLoad);

    if (categoriesToLoad) {
      localStorage.setItem(LOCALSTORAGE_CATEGORIES_KEY, JSON.stringify(categoriesToLoad));
      await putToIDB(CATEGORIES_KEY, categoriesToLoad);
    }

    if (contactInfoToLoad) {
      localStorage.setItem('industracorp_contact_info', JSON.stringify(contactInfoToLoad));
      await putToIDB(CONTACT_KEY, contactInfoToLoad);
    }

    return {
      success: true,
      products: productsToLoad,
      categories: categoriesToLoad,
      contactInfo: contactInfoToLoad,
    };
  } catch (err: any) {
    return { success: false, error: 'Lỗi cú pháp file JSON: ' + (err.message || String(err)) };
  }
}
