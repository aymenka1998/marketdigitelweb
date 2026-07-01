import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Search, Compass, Sparkles, Star, Tag, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Template } from "../types";
import { TEMPLATES, CATEGORIES } from "../data/templates";

interface GalleryPageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedTemplate: (template: Template) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

export default function GalleryPage({ setCurrentTab, setSelectedTemplate, favorites, toggleFavorite }: GalleryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter templates based on search query and category
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesSearch = 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "الكل" || template.category.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Paginate filtered templates
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTemplates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTemplates, currentPage]);

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage) || 1;

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentTab("details");
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20" dir="rtl">
      {/* Hero Header with Search Bar inside */}
      <section className="bg-gradient-to-l from-blue-900 to-blue-800 py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl font-extrabold"
          >
            تصفح أفضل قوالب المواقع
          </motion.h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
            ابدأ مشروعك القادم اليوم مع قوالب احترافية فائقة السرعة ومتوافقة مع سوبابيس (Supabase) وقابلة للتعديل بالكامل.
          </p>

          {/* Search bar inside */}
          <div className="relative max-w-2xl mx-auto mt-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page
              }}
              placeholder="ابحث عن قالب..."
              className="w-full bg-white text-slate-800 h-14 pr-12 pl-24 rounded-full border-none shadow-xl focus:ring-4 focus:ring-blue-500/30 transition-all font-medium text-sm text-right"
            />
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <button className="absolute left-1.5 top-1.5 bg-blue-600 hover:bg-blue-500 text-white h-11 px-6 rounded-full font-bold text-xs transition-colors active:scale-95">
              بحث
            </button>
          </div>
        </div>
      </section>

      {/* Categories Sticky/Scroll Header */}
      <section className="sticky top-[73px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 px-5 py-2 rounded-full font-bold text-xs transition-all duration-200 active:scale-95 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-150 p-8 space-y-4">
            <Compass className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">لم يتم العثور على قوالب تطابق بحثك</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              جرب تغيير كلمات البحث أو اختر تصنيفاً آخر لتصفح التشكيلات المتاحة.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("الكل");
              }}
              className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 transition-colors"
            >
              عرض جميع القوالب
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedTemplates.map((template) => {
                const isFavorite = favorites.includes(template.id);
                return (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group bg-white rounded-2xl border border-slate-150 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
                  >
                    {/* Image block */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img
                        src={template.image}
                        alt={template.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Top labels */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                        {template.isBestSeller && (
                          <span className="bg-blue-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            الأكثر مبيعاً
                          </span>
                        )}
                        {template.isNew && (
                          <span className="bg-emerald-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            جديد
                          </span>
                        )}
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(template.id);
                        }}
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur hover:bg-white flex items-center justify-center text-red-500 shadow-md transition-all duration-200 active:scale-90"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? "fill-current text-red-500" : "text-slate-400"}`} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex flex-col flex-grow text-right">
                      {/* category badge */}
                      <div className="text-[10px] text-blue-600 font-bold mb-1 flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{template.category}</span>
                      </div>

                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
                          {template.title}
                        </h3>
                        <span className="font-extrabold text-base text-blue-600 shrink-0">${template.price}</span>
                      </div>

                      <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2">
                        {template.description}
                      </p>

                      <div className="mt-auto">
                        <button
                          onClick={() => handleTemplateClick(template)}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                        >
                          <span>عرض التفاصيل</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm transition-all ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
