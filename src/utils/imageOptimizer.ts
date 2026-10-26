import { ValveImageVariants } from '../types/valve';

export interface OptimizedImageSet {
  thumbnail: string; // WebP thumbnail ~180px
  medium: string;    // WebP display ~640px
  high: string;      // WebP high-resolution ~1280px
  format: 'image/webp' | 'image/jpeg';
  thumbnailKb: number;
  mediumKb: number;
  highKb: number;
  variants: ValveImageVariants;
}

export interface WebPOptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 - 1.0, default 0.82
  format?: 'image/webp' | 'image/jpeg';
}

export interface WebPOptimizeResult {
  dataUrl: string;
  format: 'image/webp' | 'image/jpeg';
  originalFormat: string;
  originalKb: number;
  optimizedKb: number;
  savedPercent: number;
  originalDimensions: { width: number; height: number };
  optimizedDimensions: { width: number; height: number };
  statusText: string;
}

/**
 * Renders an image element to canvas with target dimensions and converts
 * to WebP (falling back to JPEG if browser doesn't support WebP export)
 */
function renderVariantToDataUrl(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
  quality: number
): { dataUrl: string; kb: number; format: 'image/webp' | 'image/jpeg' } {
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  // Calculate aspect-ratio preserved dimensions
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { dataUrl: img.src, kb: Math.round(img.src.length / 1024), format: 'image/jpeg' };
  }

  // Draw clean white background for non-alpha rendering
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // Try WebP first (preferred for 30-40% smaller byte size than JPEG)
  let format: 'image/webp' | 'image/jpeg' = 'image/webp';
  let dataUrl = canvas.toDataURL('image/webp', quality);
  if (!dataUrl.startsWith('data:image/webp')) {
    format = 'image/jpeg';
    dataUrl = canvas.toDataURL('image/jpeg', quality);
  }

  const kb = Math.round((dataUrl.length * (3 / 4)) / 1024);
  return { dataUrl, kb, format };
}

/**
 * Automated Image Optimization Pipeline:
 * Generates WebP Thumbnail (180px), Medium (640px), and High-Resolution (1280px)
 */
export async function processMultiResolutionImagePipeline(
  source: File | string
): Promise<OptimizedImageSet> {
  return new Promise((resolve) => {
    const loadImage = (srcUrl: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onerror = () => {
        const fallback = srcUrl || '/uploads/studio_ball_valve.jpg';
        resolve({
          thumbnail: fallback,
          medium: fallback,
          high: fallback,
          format: 'image/jpeg',
          thumbnailKb: 20,
          mediumKb: 50,
          highKb: 90,
          variants: { thumbnail: fallback, medium: fallback, high: fallback }
        });
      };
      img.onload = () => {
        // 1. Thumbnail: 180x135 max, quality 0.65 (fast catalog previews & grids)
        const thumbResult = renderVariantToDataUrl(img, 180, 135, 0.65);

        // 2. Medium: 640x480 max, quality 0.80 (standard product cards)
        const medResult = renderVariantToDataUrl(img, 640, 480, 0.80);

        // 3. High: 1280x960 max, quality 0.90 (lightbox zoom & engineering spec review)
        const highResult = renderVariantToDataUrl(img, 1280, 960, 0.90);

        resolve({
          thumbnail: thumbResult.dataUrl,
          medium: medResult.dataUrl,
          high: highResult.dataUrl,
          format: thumbResult.format,
          thumbnailKb: thumbResult.kb,
          mediumKb: medResult.kb,
          highKb: highResult.kb,
          variants: {
            thumbnail: thumbResult.dataUrl,
            medium: medResult.dataUrl,
            high: highResult.dataUrl
          }
        });
      };
      img.src = srcUrl;
    };

    if (typeof source === 'string') {
      loadImage(source);
    } else {
      const reader = new FileReader();
      reader.onerror = () => loadImage('/uploads/studio_ball_valve.jpg');
      reader.onload = (e) => loadImage((e.target?.result as string) || '');
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Automatic WebP Converter & Dimension Optimizer:
 * Automatically converts image files (PNG, JPG, JPEG, GIF, BMP) or Data URLs to WebP format,
 * downscales image dimensions to optimal resolution (preserving aspect ratio), and applies
 * Google PageSpeed/Lighthouse compliant WebP compression to drastically improve hosting load times.
 */
export async function convertToWebPAndOptimize(
  source: File | string,
  options?: WebPOptimizeOptions
): Promise<WebPOptimizeResult> {
  const maxWidth = options?.maxWidth || 1280;
  const maxHeight = options?.maxHeight || 960;
  const quality = options?.quality !== undefined ? options?.quality : 0.82;

  return new Promise((resolve) => {
    let originalFormat = 'image/png';
    let originalBytes = 100 * 1024;

    if (source instanceof File) {
      originalFormat = source.type || 'image/png';
      originalBytes = source.size;
    }

    const processImg = (srcUrl: string) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onerror = () => {
        resolve({
          dataUrl: srcUrl,
          format: 'image/jpeg',
          originalFormat,
          originalKb: Math.round(originalBytes / 1024),
          optimizedKb: Math.round(originalBytes / 1024),
          savedPercent: 0,
          originalDimensions: { width: 800, height: 600 },
          optimizedDimensions: { width: 800, height: 600 },
          statusText: 'Không thể giải mã ảnh, giữ nguyên định dạng ban đầu.'
        });
      };

      img.onload = () => {
        const origW = img.naturalWidth || img.width || 800;
        const origH = img.naturalHeight || img.height || 600;

        let targetW = origW;
        let targetH = origH;

        // Downscale while preserving aspect ratio
        if (targetW > maxWidth || targetH > maxHeight) {
          const ratio = Math.min(maxWidth / targetW, maxHeight / targetH);
          targetW = Math.max(1, Math.round(targetW * ratio));
          targetH = Math.max(1, Math.round(targetH * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            dataUrl: srcUrl,
            format: 'image/jpeg',
            originalFormat,
            originalKb: Math.round(originalBytes / 1024),
            optimizedKb: Math.round(originalBytes / 1024),
            savedPercent: 0,
            originalDimensions: { width: origW, height: origH },
            optimizedDimensions: { width: targetW, height: targetH },
            statusText: 'Canvas context không khả dụng.'
          });
          return;
        }

        // Enable high-quality smoothing for crystal clear valve details
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw crisp background if transparent
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Convert to WebP format
        let format: 'image/webp' | 'image/jpeg' = 'image/webp';
        let webpDataUrl = canvas.toDataURL('image/webp', quality);
        if (!webpDataUrl.startsWith('data:image/webp')) {
          format = 'image/jpeg';
          webpDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // Calculate size in KB
        const optimizedBytes = Math.round((webpDataUrl.length * (3 / 4)));
        const originalKb = Math.max(1, Math.round(originalBytes / 1024));
        const optimizedKb = Math.max(1, Math.round(optimizedBytes / 1024));
        const savedPercent = originalKb > optimizedKb 
          ? Math.round(((originalKb - optimizedKb) / originalKb) * 100)
          : 0;

        const formatLabel = format === 'image/webp' ? 'WebP' : 'JPEG';
        const statusText = `✓ Đã tự động chuyển đổi sang ${formatLabel}: ${originalKb} KB ➔ ${optimizedKb} KB (tiết kiệm ${savedPercent}% dung lượng hosting, độ phân giải ${targetW}x${targetH}px)`;

        resolve({
          dataUrl: webpDataUrl,
          format,
          originalFormat,
          originalKb,
          optimizedKb,
          savedPercent,
          originalDimensions: { width: origW, height: origH },
          optimizedDimensions: { width: targetW, height: targetH },
          statusText
        });
      };

      img.src = srcUrl;
    };

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = (e.target?.result as string) || '';
        processImg(result);
      };
      reader.onerror = () => {
        processImg('/uploads/studio_ball_valve.jpg');
      };
      reader.readAsDataURL(source);
    } else {
      if (source.startsWith('data:')) {
        // Approximate byte size of data URL
        originalBytes = Math.round(source.length * (3 / 4));
        const match = source.match(/^data:([^;]+);/);
        if (match) originalFormat = match[1];
      }
      processImg(source);
    }
  });
}

/**
 * Helper to compress and optimize uploaded images so they fit comfortably
 * inside browser storage and IndexedDB without quota overflow, using WebP as default.
 */
export async function optimizeImageFile(file: File, maxWidth = 800, maxHeight = 600, quality = 0.80): Promise<string> {
  const result = await convertToWebPAndOptimize(file, { maxWidth, maxHeight, quality });
  return result.dataUrl;
}

/**
 * Bakes AI studio enhancements (lighting, background, perspective framing) directly
 * into a persistent 4:3 canvas image and exports in WebP format so the outside website
 * displays the exact enhanced image with lightning-fast hosting page loads.
 */
export async function bakeStudioEnhancement(
  sourceUrl: string,
  mode: 'studio' | 'clean_bg' | 'metallic' | 'perspective',
  quality = 0.88
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => {
      resolve(sourceUrl);
    };
    img.onload = () => {
      const targetWidth = 800;
      const targetHeight = 600; // Standard 4:3 Studio Canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(sourceUrl);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Draw Studio Background
      if (mode === 'clean_bg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else if (mode === 'metallic') {
        const grad = ctx.createRadialGradient(
          targetWidth / 2,
          targetHeight / 2,
          50,
          targetWidth / 2,
          targetHeight / 2,
          targetWidth / 1.4
        );
        grad.addColorStop(0, '#1E293B');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else {
        // 'studio' & 'perspective'
        const grad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
        grad.addColorStop(0, '#0F172A');
        grad.addColorStop(0.5, '#1E293B');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // 2. Set Canvas Studio Lighting Filter
      if (mode === 'studio') {
        ctx.filter = 'brightness(1.08) contrast(1.15) saturate(1.05)';
      } else if (mode === 'clean_bg') {
        ctx.filter = 'brightness(1.05) contrast(1.10)';
      } else if (mode === 'metallic') {
        ctx.filter = 'brightness(1.16) contrast(1.24) saturate(1.12)';
      } else if (mode === 'perspective') {
        ctx.filter = 'brightness(1.04) contrast(1.08)';
      }

      // 3. Compute fitting dimensions with padding
      const paddingScale = mode === 'perspective' ? 0.78 : (mode === 'clean_bg' ? 0.85 : 0.86);
      const maxWidth = targetWidth * paddingScale;
      const maxHeight = targetHeight * paddingScale;

      let drawW = img.width;
      let drawH = img.height;

      const scale = Math.min(maxWidth / drawW, maxHeight / drawH);
      drawW = drawW * scale;
      drawH = drawH * scale;

      const drawX = (targetWidth - drawW) / 2;
      const drawY = (targetHeight - drawH) / 2;

      // 4. Subtle Drop Shadow for 3D realism
      if (mode !== 'clean_bg') {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Reset shadows
      ctx.shadowColor = 'transparent';

      try {
        // Try WebP first for ~30-40% smaller payload on hosting
        let resultUrl = canvas.toDataURL('image/webp', quality);
        if (!resultUrl.startsWith('data:image/webp')) {
          resultUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(resultUrl);
      } catch {
        resolve(sourceUrl);
      }
    };
    img.src = sourceUrl;
  });
}
