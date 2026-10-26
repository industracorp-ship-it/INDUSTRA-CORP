import { ValveProduct, ValveCharacteristics, SupportedLanguage } from '../types/valve';
import { translateTechString, getLocalizedProduct, getLocalizedCharacteristics } from '../utils/engineeringTranslator';

/**
 * Interface representing translation progress notification
 */
export interface TranslationProgressEvent {
  isTranslating: boolean;
  current: number;
  total: number;
  targetLang: SupportedLanguage;
  lastTranslatedName?: string;
}

type ProgressListener = (event: TranslationProgressEvent) => void;

class CatalogTranslationService {
  private cache: Map<string, ValveProduct> = new Map();
  private listeners: Set<ProgressListener> = new Set();
  private isTranslating = false;

  constructor() {
    this.hydrateFromStorage();
  }

  /**
   * Subscribe to translation progress events
   */
  public onProgress(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: TranslationProgressEvent): void {
    this.listeners.forEach((fn) => {
      try {
        fn(event);
      } catch (err) {
        console.warn('Translation progress listener error:', err);
      }
    });
  }

  private getCacheKey(productId: string, lang: SupportedLanguage): string {
    return `${productId}__${lang}`;
  }

  private hydrateFromStorage(): void {
    try {
      const stored = localStorage.getItem('utd_catalog_translation_cache_v2');
      if (stored) {
        const parsed: Record<string, ValveProduct> = JSON.parse(stored);
        for (const [k, v] of Object.entries(parsed)) {
          this.cache.set(k, v);
        }
      }
    } catch {
      // Fallback silent
    }
  }

  private persistToStorage(): void {
    try {
      const obj: Record<string, ValveProduct> = {};
      this.cache.forEach((v, k) => {
        obj[k] = v;
      });
      localStorage.setItem('utd_catalog_translation_cache_v2', JSON.stringify(obj));
    } catch {
      // Ignore quota errors
    }
  }

  /**
   * Translate a single product accurately into target language
   */
  public translateProduct(product: ValveProduct, targetLang: SupportedLanguage): ValveProduct {
    if (targetLang === 'vi') {
      return product;
    }

    const cacheKey = this.getCacheKey(product.id, targetLang);
    // If customized by admin, re-evaluate to ensure latest edits are preserved
    if (this.cache.has(cacheKey) && !product.isCustomized) {
      return this.cache.get(cacheKey)!;
    }

    // Deep translate product attributes
    const localized = getLocalizedProduct(product, targetLang);

    // Ensure connection and badge are explicitly translated
    const translatedConnection = translateTechString(product.connection, undefined, targetLang);
    const translatedBadge = product.badge
      ? translateTechString(product.badge, undefined, targetLang)
      : product.badge;

    const result: ValveProduct = {
      ...localized,
      connection: translatedConnection || product.connection,
      badge: translatedBadge || product.badge,
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  /**
   * Automatically triggers AI-based re-translation of the entire product catalog
   * when site language toggles.
   */
  public async translateCatalog(
    products: ValveProduct[],
    targetLang: SupportedLanguage
  ): Promise<ValveProduct[]> {
    if (!products || products.length === 0) return [];
    if (targetLang === 'vi') {
      return products;
    }

    this.isTranslating = true;
    this.notify({
      isTranslating: true,
      current: 0,
      total: products.length,
      targetLang,
    });

    const translatedList: ValveProduct[] = [];

    // Process all products
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const translated = this.translateProduct(p, targetLang);
      translatedList.push(translated);

      // Emit intermittent progress for smooth UI feedback
      if ((i + 1) % 5 === 0 || i === products.length - 1) {
        this.notify({
          isTranslating: i < products.length - 1,
          current: i + 1,
          total: products.length,
          targetLang,
          lastTranslatedName: translated.name,
        });
      }
    }

    this.persistToStorage();
    this.isTranslating = false;

    this.notify({
      isTranslating: false,
      current: products.length,
      total: products.length,
      targetLang,
    });

    return translatedList;
  }

  /**
   * Clear cached translations (e.g. after catalog reset or bulk edit)
   */
  public clearCache(): void {
    this.cache.clear();
    try {
      localStorage.removeItem('utd_catalog_translation_cache_v2');
    } catch {
      // silent
    }
  }
}

export const catalogTranslationService = new CatalogTranslationService();
