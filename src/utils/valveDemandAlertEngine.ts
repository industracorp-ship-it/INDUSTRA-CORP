import { ValveProduct } from '../types/valve';

export interface HighDemandAlertItem {
  id: string;
  valveId: string;
  valveCode: string;
  valveNameVi: string;
  valveNameEn: string;
  category: string;
  queryCount: number;
  trendingRate: string; // e.g. "+168%"
  searchTerms: string[];
  urgency: 'critical' | 'high' | 'warning';
  alertTitleVi: string;
  alertTitleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  actionLabelVi: string;
  actionLabelEn: string;
  isCatalogPrioritized: boolean;
  prioritizedDate?: string;
  lastTriggered: string;
  status: 'active' | 'prioritized' | 'dismissed';
}

const STORAGE_DEMAND_ALERTS_KEY = 'utd_high_demand_valve_alerts_v1';
const STORAGE_QUERY_STATS_KEY = 'utd_valve_query_stats_v1';

export const INITIAL_HIGH_DEMAND_ALERTS: HighDemandAlertItem[] = [
  {
    id: 'alert-picv-smart',
    valveId: 'utd-blv-fig-bv101-static',
    valveCode: 'Fig. BV101DF / PICV-SMART',
    valveNameVi: 'Van Cân Bằng Cơ & Động Học PICV UTD Có Test Port',
    valveNameEn: 'UTD Dynamic PICV Balancing Valve with Test Ports',
    category: 'balancing',
    queryCount: 54,
    trendingRate: '+178%',
    searchTerms: ['picv', 'van cân bằng', 'dynamic balancing', 'hvac chiller', 'bv101df'],
    urgency: 'critical',
    alertTitleVi: '🔥 Cảnh Báo Nhu Cầu Cao Đột Biến: Van Cân Bằng PICV HVAC',
    alertTitleEn: '🔥 High-Demand Surge: Dynamic PICV Balancing Valves',
    descriptionVi: 'Hệ thống ghi nhận 54 lượt tìm kiếm và tra cứu thông số kỹ thuật van PICV trong 24h qua (+178%). Các tổng thầu MEP đang chuẩn bị đấu thầu gói Chiller giải nhiệt trung tâm.',
    descriptionEn: 'Recorded 54 queries for PICV valves in the last 24h (+178%). MEP contractors are actively querying dynamic balancing flow specs for central chiller bids.',
    actionLabelVi: 'Ưu Tiên Ghim Đầu Danh Mục',
    actionLabelEn: 'Prioritize in Catalog',
    isCatalogPrioritized: false,
    lastTriggered: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'alert-hp-butterfly',
    valveId: 'utd-hpbv-fig-h401',
    valveCode: 'Fig. H401 / H401P Series',
    valveNameVi: 'Van Bướm Hiệu Suất Cao Triple-Offset UTD (Fig. H401)',
    valveNameEn: 'UTD High Performance Triple Offset Butterfly Valve',
    category: 'butterfly',
    queryCount: 42,
    trendingRate: '+142%',
    searchTerms: ['van bướm hiệu năng cao', 'high performance butterfly', 'triple offset', 'h401', 'chịu nhiệt hơi'],
    urgency: 'high',
    alertTitleVi: '⚡ Cảnh Báo Truy Vấn Liên Tục: Van Bướm Triple-Offset',
    alertTitleEn: '⚡ Frequent Query Alert: High-Performance Butterfly Valves',
    descriptionVi: 'Ghi nhận 42 lượt tra cứu tải CAD và thông số áp lực Class 150/300 của van bướm Triple-Offset. Đề xuất ưu tiên hiển thị vị trí nổi bật (Featured Badge).',
    descriptionEn: 'Recorded 42 queries for Class 150/300 Triple Offset butterfly valves. Recommend prioritizing display at top of catalog with VIP badge.',
    actionLabelVi: 'Ghim Nổi Bật & Tăng Tồn Kho',
    actionLabelEn: 'Pin as Featured Valve',
    isCatalogPrioritized: false,
    lastTriggered: new Date().toISOString(),
    status: 'active'
  }
];

/**
 * Retrieve active high demand alerts from localStorage
 */
export function getHighDemandAlerts(): HighDemandAlertItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_DEMAND_ALERTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load high demand alerts:', err);
  }
  // Initialize default alerts
  try {
    localStorage.setItem(STORAGE_DEMAND_ALERTS_KEY, JSON.stringify(INITIAL_HIGH_DEMAND_ALERTS));
  } catch (e) {
    // ignore
  }
  return INITIAL_HIGH_DEMAND_ALERTS;
}

/**
 * Save alerts to storage and dispatch event
 */
export function saveHighDemandAlerts(alerts: HighDemandAlertItem[]): void {
  try {
    localStorage.setItem(STORAGE_DEMAND_ALERTS_KEY, JSON.stringify(alerts));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('utd_demand_alerts_updated', { detail: { alerts } }));
  } catch (err) {
    console.warn('Failed to save high demand alerts:', err);
  }
}

/**
 * Record a search query to update demand counters
 */
export function recordValveQuery(query: string): HighDemandAlertItem | null {
  const clean = (query || '').trim().toLowerCase();
  if (clean.length < 2) return null;

  try {
    const alerts = getHighDemandAlerts();
    let triggeredAlert: HighDemandAlertItem | null = null;

    const updated = alerts.map(alert => {
      const isMatched = alert.searchTerms.some(term => clean.includes(term.toLowerCase()) || term.toLowerCase().includes(clean));
      if (isMatched) {
        triggeredAlert = {
          ...alert,
          queryCount: alert.queryCount + 1,
          lastTriggered: new Date().toISOString(),
          status: alert.status === 'dismissed' ? 'active' : alert.status
        };
        return triggeredAlert;
      }
      return alert;
    });

    if (triggeredAlert) {
      saveHighDemandAlerts(updated);
      return triggeredAlert;
    }
  } catch (err) {
    console.warn('Query recording error:', err);
  }
  return null;
}

/**
 * Prioritize valve in catalog (pins the product to the top of product lists)
 */
export function prioritizeValveInCatalog(
  alertId: string, 
  currentValves: ValveProduct[]
): { updatedValves: ValveProduct[]; updatedAlert: HighDemandAlertItem | null } {
  const alerts = getHighDemandAlerts();
  let updatedAlert: HighDemandAlertItem | null = null;

  const newAlerts = alerts.map(a => {
    if (a.id === alertId) {
      updatedAlert = {
        ...a,
        isCatalogPrioritized: true,
        prioritizedDate: new Date().toISOString(),
        status: 'prioritized' as const
      };
      return updatedAlert;
    }
    return a;
  });

  saveHighDemandAlerts(newAlerts);

  if (!updatedAlert) {
    return { updatedValves: currentValves, updatedAlert: null };
  }

  const targetValveId = (updatedAlert as HighDemandAlertItem).valveId;
  const targetCode = (updatedAlert as HighDemandAlertItem).valveCode;

  // Move the prioritized valve to the beginning of the array and set isPriority / isFeatured
  const targetIndex = currentValves.findIndex(v => v.id === targetValveId || v.code === targetCode);
  let updatedValves = [...currentValves];

  if (targetIndex > -1) {
    const [targetItem] = updatedValves.splice(targetIndex, 1);
    const modifiedTarget: ValveProduct = {
      ...targetItem,
      badge: targetItem.badge ? `★ Ưu Tiên Nhu Cầu Cao • ${targetItem.badge}` : '★ Ưu Tiên Nhu Cầu Cao (High Demand)',
      isPinned: true
    };
    updatedValves.unshift(modifiedTarget);
  }

  return { updatedValves, updatedAlert };
}

/**
 * Dismiss a demand alert notification
 */
export function dismissDemandAlert(alertId: string): void {
  const alerts = getHighDemandAlerts();
  const updated = alerts.map(a => a.id === alertId ? { ...a, status: 'dismissed' as const } : a);
  saveHighDemandAlerts(updated);
}

/**
 * Reset all demand alerts to initial active state
 */
export function resetDemandAlerts(): HighDemandAlertItem[] {
  saveHighDemandAlerts(INITIAL_HIGH_DEMAND_ALERTS);
  return INITIAL_HIGH_DEMAND_ALERTS;
}
