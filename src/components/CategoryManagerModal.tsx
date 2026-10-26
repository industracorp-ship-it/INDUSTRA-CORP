import React, { useState } from 'react';
import { 
  X, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  RotateCcw, 
  Layers, 
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CategoryItem, SystemGroup, ValveProduct, SupportedLanguage } from '../types/valve';
import { DEFAULT_CATEGORIES } from '../data/categoryData';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onUpdateCategories: (newCategories: CategoryItem[]) => void;
  products: ValveProduct[];
  lang?: SupportedLanguage;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUpdateCategories,
  products,
  lang = 'vi',
}) => {
  if (!isOpen) return null;

  const [list, setList] = useState<CategoryItem[]>(categories);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editLabelEn, setEditLabelEn] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatLabelEn, setNewCatLabelEn] = useState('');
  const [newCatGroup, setNewCatGroup] = useState<SystemGroup>('water');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...list];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setList(updated);
    onUpdateCategories(updated);
    showNotification(lang === 'vi' ? `Đã di chuyển danh mục lên vị trí ${index}` : `Moved category up to position ${index}`);
  };

  const handleMoveDown = (index: number) => {
    if (index === list.length - 1) return;
    const updated = [...list];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setList(updated);
    onUpdateCategories(updated);
    showNotification(lang === 'vi' ? `Đã di chuyển danh mục xuống vị trí ${index + 2}` : `Moved category down to position ${index + 2}`);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditLabel(list[index].label);
    setEditLabelEn(list[index].labelEn);
  };

  const handleSaveEdit = (index: number) => {
    if (!editLabel.trim()) return;
    const updated = [...list];
    updated[index] = {
      ...updated[index],
      label: editLabel.trim(),
      labelEn: editLabelEn.trim() || editLabel.trim(),
    };
    setList(updated);
    onUpdateCategories(updated);
    setEditingIndex(null);
    showNotification(lang === 'vi' ? 'Đã cập nhật tên danh mục thành công!' : 'Category updated successfully!');
  };

  const handleDeleteCategory = (index: number) => {
    const cat = list[index];
    const count = products.filter(p => p.category === cat.value).length;
    if (count > 0) {
      if (!confirm(lang === 'vi' ? `Danh mục "${cat.label}" hiện đang có ${count} sản phẩm liên kết. Bạn có chắc chắn muốn xóa khỏi danh sách phân loại?` : `Category "${cat.labelEn || cat.label}" has ${count} associated products. Confirm removal?`)) {
        return;
      }
    } else {
      if (!confirm(lang === 'vi' ? `Bạn có chắc muốn xóa danh mục "${cat.label}"?` : `Are you sure you want to delete category "${cat.labelEn || cat.label}"?`)) {
        return;
      }
    }

    const updated = list.filter((_, idx) => idx !== index);
    setList(updated);
    onUpdateCategories(updated);
    showNotification(lang === 'vi' ? `Đã xóa danh mục "${cat.label}"` : `Deleted category "${cat.labelEn || cat.label}"`);
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCatCode.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    if (!cleanCode || !newCatLabel.trim()) {
      alert(lang === 'vi' ? 'Vui lòng nhập mã danh mục và tên danh mục!' : 'Please enter category code and label!');
      return;
    }

    if (list.some(c => c.value === cleanCode)) {
      alert(lang === 'vi' ? `Mã danh mục "${cleanCode}" đã tồn tại! Vui lòng chọn mã khác.` : `Category code "${cleanCode}" already exists!`);
      return;
    }

    const newCategory: CategoryItem = {
      value: cleanCode,
      label: newCatLabel.trim(),
      labelEn: newCatLabelEn.trim() || newCatLabel.trim(),
      systemGroup: newCatGroup,
      isCustom: true,
    };

    const updated = [...list, newCategory];
    setList(updated);
    onUpdateCategories(updated);
    setIsAddingNew(false);
    setNewCatCode('');
    setNewCatLabel('');
    setNewCatLabelEn('');
    showNotification(lang === 'vi' ? `Đã thêm danh mục mới: ${newCategory.label}` : `Added new category: ${newCategory.labelEn}`);
  };

  const handleResetDefault = () => {
    if (confirm(lang === 'vi' ? 'Khôi phục danh mục về thứ tự 20 nhóm van catalogue chuẩn ban đầu?' : 'Reset categories to default 20 groups?')) {
      setList(DEFAULT_CATEGORIES);
      onUpdateCategories(DEFAULT_CATEGORIES);
      showNotification(lang === 'vi' ? 'Đã khôi phục danh mục về mặc định' : 'Reset categories to default');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-slate-900 border border-amber-500/60 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{lang === 'vi' ? 'QUẢN LÝ DANH MỤC HÀNG HÓA & SẮP XẾP THỨ TỰ' : 'MANAGE PRODUCT CATEGORIES & SORT ORDER'}</span>
                <span className="text-[10px] font-mono bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                  ADMIN CMS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'vi' 
                  ? 'Admin toàn quyền thêm, đổi tên, xóa và sắp xếp thứ tự ưu tiên hiển thị trên toàn bộ website' 
                  : 'Full control to create, rename, delete and reorder categories across the entire website'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-emerald-950/90 border-b border-emerald-500 text-emerald-200 px-6 py-2.5 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Top Action Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold">
                {lang === 'vi' ? 'Tổng số danh mục: ' : 'Total categories: '}<strong className="text-amber-400 font-mono">{list.length}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingNew ? (lang === 'vi' ? 'Đóng Form' : 'Close Form') : (lang === 'vi' ? 'Thêm Danh Mục Mới' : 'Add New Category')}</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefault}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700"
                title={lang === 'vi' ? 'Khôi phục thứ tự chuẩn 20 nhóm catalogue' : 'Reset to default 20 catalogue groups'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? 'Mặc Định' : 'Default'}</span>
              </button>
            </div>
          </div>

          {/* Form Add New Category */}
          {isAddingNew && (
            <form onSubmit={handleAddNewCategory} className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-3 animate-fade-in">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'vi' ? 'Thêm Nhóm Van Mới Vào Hệ Thống:' : 'Add New Valve Category to System:'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{lang === 'vi' ? 'Mã Danh Mục (Slug key, vd: diaphragm_valve):' : 'Category Key (e.g. diaphragm_valve):'}</label>
                  <input
                    type="text"
                    required
                    placeholder="diaphragm_valve"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{lang === 'vi' ? 'Thuộc Hệ Thống Ứng Dụng:' : 'System Application Group:'}</label>
                  <select
                    value={newCatGroup}
                    onChange={(e) => setNewCatGroup(e.target.value as SystemGroup)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="water">Water System</option>
                    <option value="steam">Steam Valve</option>
                    <option value="firefighting">Fire Fighting</option>
                    <option value="hvac">HVAC Valve</option>
                    <option value="oilgas">Oil & Gas</option>
                    <option value="gas_cryogenic">Gas & Cryogenic</option>
                    <option value="instrument">Instrumentation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{lang === 'vi' ? 'Tên Danh Mục (Tiếng Việt):' : 'Vietnamese Name:'}</label>
                  <input
                    type="text"
                    required
                    placeholder="Van Màng Chống Ăn Mòn"
                    value={newCatLabel}
                    onChange={(e) => setNewCatLabel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">{lang === 'vi' ? 'Tên Tiếng Anh (English Name):' : 'English Name:'}</label>
                  <input
                    type="text"
                    placeholder="Diaphragm Valve"
                    value={newCatLabelEn}
                    onChange={(e) => setNewCatLabelEn(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                >
                  {lang === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
                >
                  {lang === 'vi' ? 'Lưu Danh Mục Mới' : 'Save New Category'}
                </button>
              </div>
            </form>
          )}

          {/* Categories List */}
          <div className="space-y-1.5">
            {list.map((item, idx) => {
              const productCount = products.filter(p => p.category === item.value).length;
              const isEditing = editingIndex === idx;

              return (
                <div
                  key={item.value}
                  className={`bg-slate-950 border rounded-xl p-3 flex items-center justify-between gap-3 transition-colors ${
                    isEditing ? 'border-amber-500 bg-slate-900' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Left: Reorder buttons & index */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-amber-400 text-xs">
                      {idx + 1}
                    </span>

                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        className={`p-1 rounded transition-colors ${
                          idx === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title={lang === 'vi' ? 'Di chuyển lên trên' : 'Move up'}
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === list.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        className={`p-1 rounded transition-colors ${
                          idx === list.length - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                        title={lang === 'vi' ? 'Di chuyển xuống dưới' : 'Move down'}
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle: Content or Edit Mode */}
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-2 py-1">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">{lang === 'vi' ? 'Tên tiếng Việt:' : 'Vietnamese name:'}</label>
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">{lang === 'vi' ? 'Tên tiếng Anh:' : 'English name:'}</label>
                          <input
                            type="text"
                            value={editLabelEn}
                            onChange={(e) => setEditLabelEn(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-white text-xs sm:text-sm">
                            {lang === 'vi' ? item.label : item.labelEn}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {item.value}
                          </span>
                          {item.isCustom && (
                            <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded font-bold uppercase">
                              {lang === 'vi' ? 'Tùy Chỉnh' : 'Custom'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {lang === 'vi' ? item.labelEn : item.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Badge count & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-amber-400"
                      title={lang === 'vi' ? 'Số lượng sản phẩm trong danh mục' : 'Product count in category'}
                    >
                      {productCount} {lang === 'vi' ? 'van' : 'valves'}
                    </span>

                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(idx)}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                        title={lang === 'vi' ? 'Lưu thay đổi' : 'Save changes'}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(idx)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800"
                        title={lang === 'vi' ? 'Chỉnh sửa tên danh mục' : 'Edit category name'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(idx)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800"
                      title={lang === 'vi' ? 'Xóa danh mục' : 'Delete category'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <p className="text-slate-400 text-[11px] italic">
            {lang === 'vi' 
              ? '* Mọi thay đổi thứ tự và danh mục được tự động lưu vĩnh viễn vào hệ thống LocalStorage.' 
              : '* Category reordering and additions are automatically persisted to storage.'}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider shadow"
          >
            {lang === 'vi' ? 'Đóng & Áp Dụng' : 'Close & Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};
