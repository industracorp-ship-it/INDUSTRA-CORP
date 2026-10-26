import { ProjectRecord } from '../types/valve';

/**
 * Danh mục Dự Án Đã Thực Hiện (Từ 2009 Đến Hiện Tại)
 * Đã xóa toàn bộ theo yêu cầu của Quản trị viên (Admin).
 * Admin sẽ bổ sung dự án mới sau thông qua giao diện CMS / Admin Studio.
 */
export const SEED_PROJECTS: ProjectRecord[] = [];

export const PROJECTS_STORAGE_KEY = 'industracorp_projects_history_v2';
export const DELETED_PROJECTS_KEY = 'industracorp_deleted_project_ids_v2';

/**
 * Returns set of permanently deleted project IDs blacklisted by Admin
 */
export function getDeletedProjectIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(DELETED_PROJECTS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr);
      }
    }
  } catch (e) {
    console.warn('Error reading deleted project IDs:', e);
  }
  return new Set();
}

/**
 * Permanently blacklists a project ID when Admin deletes it.
 * Ensures the project can NEVER be resurrected or auto-restored!
 */
export function markProjectDeleted(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedProjectIds();
    set.add(id);
    localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error('Error recording deleted project ID:', e);
  }
}

/**
 * Loads projects from persistent storage.
 * CRITICAL RULE:
 * Once Admin deletes or edits projects, storage is the single source of truth.
 * Deleted projects are NEVER automatically restored or merged back from SEED_PROJECTS!
 */
export function loadProjectsFromStorage(): ProjectRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    // Clear old v1 storage if present to guarantee clean slate for all existing visitors/admins
    if (localStorage.getItem('industracorp_projects_history_v1') !== null) {
      localStorage.removeItem('industracorp_projects_history_v1');
    }

    const deletedIds = getDeletedProjectIds();
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    
    // If storage has already been initialized (even if empty array []), return user-managed list
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter(p => !deletedIds.has(p.id)).sort((a, b) => (b.year || 0) - (a.year || 0));
      }
    }

    // First-time initialization: Empty list ready for Admin additions
    const initial: ProjectRecord[] = [];
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch (err) {
    console.warn('Error reading projects from storage:', err);
  }
  return [];
}

/**
 * Saves projects to persistent storage.
 */
export function saveProjectsToStorage(projects: ProjectRecord[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const deletedIds = getDeletedProjectIds();
    const cleanProjects = projects.filter(p => !deletedIds.has(p.id));
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(cleanProjects));
    return true;
  } catch (err) {
    console.error('Error saving projects to storage:', err);
    return false;
  }
}

/**
 * Clear all projects completely from storage.
 */
export function clearAllProjects(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify([]));
    localStorage.removeItem('industracorp_projects_history_v1');
  } catch (err) {
    console.error('Error clearing projects from storage:', err);
  }
}
