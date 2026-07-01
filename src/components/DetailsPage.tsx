import React, { useState } from "react";
import { Star, ShieldCheck, Download, Headphones, CheckCircle2, ShoppingCart, HelpCircle, ChevronLeft, ArrowRight, Fullscreen } from "lucide-react";
import { Template } from "../types";
import { REVIEWS } from "../data/templates";

interface DetailsPageProps {
  template: Template;
  setCurrentTab: (tab: string) => void;
  addToCart: (template: Template) => void;
}

export default function DetailsPage({ template, setCurrentTab, addToCart }: DetailsPageProps) {
  const [activeImage, setActiveImage] = useState(template.image);
  const [addedToCartMessage, setAddedToCartMessage] = useState(false);

  const handleAddToCart = () => {
    addToCart(template);
    setAddedToCartMessage(true);
    setTimeout(() => {
      setAddedToCartMessage(false);
    }, 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20" dir="rtl">
      {/* Top Breadcrumb Navigation */}
      <section className="bg-white border-b border-slate-100 py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
          <button onClick={() => setCurrentTab("landing")} className="hover:text-blue-600 transition-colors">
            الرئيسية
          </button>
          <ChevronLeft className="w-3.5 h-3.5" />
          <button onClick={() => setCurrentTab("gallery")} className="hover:text-blue-600 transition-colors">
            القوالب
          </button>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-blue-600 font-bold">{template.title}</span>
        </div>
      </section>

      {/* Main product presentation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Previews and Bento Thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-slate-150 bg-white shadow-md relative group">
            <img
              src={activeImage}
              alt={template.title}
              className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-102"
            />
            {/* Live Preview Button */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`هذه معاينة تجريبية حية لقالب: ${template.title}`);
              }}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2.5 rounded-xl font-bold text-xs text-blue-700 flex items-center gap-2 shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              <Fullscreen className="w-4 h-4" />
              <span>معاينة حية</span>
            </a>
          </div>

          {/* Sub Previews Carousel Carousel/grid */}
          {template.images && template.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {template.images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`rounded-xl overflow-hidden border-2 cursor-pointer aspect-[16/10] bg-white transition-colors duration-200 ${
                    activeImage === imgUrl ? "border-blue-600" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={imgUrl} alt="تفاصيل القالب" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Key purchase card and Details */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-lg shadow-slate-100/50 space-y-6">
            <div className="flex justify-between items-start">
              {template.isBestSeller ? (
                <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                  الأكثر مبيعاً
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100">
                  تصميم مميز
                </span>
              )}

              <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span>{template.rating} ({template.reviewsCount} تقييم)</span>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
                {template.title}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-blue-600">${template.price}</span>
              {template.originalPrice && (
                <>
                  <span className="text-slate-400 text-sm sm:text-base line-through font-medium">
                    ${template.originalPrice}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-100">
                    خصم {Math.round(((template.originalPrice - template.price) / template.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* High level features check list */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              {template.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA action keys */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white hover:bg-blue-500 py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-100 active:scale-98 transition-all duration-200 flex justify-center items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>شراء القالب الآن</span>
              </button>

              {addedToCartMessage && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold p-3 rounded-xl text-center border border-emerald-100 animate-fade-in flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تمت إضافة القالب إلى سلة المشتريات بنجاح!</span>
                </div>
              )}
            </div>

            {/* Security and quality indicators */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 text-center text-slate-500">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold">دفع آمن 100%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Download className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold">تحميل فوري</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Headphones className="w-5 h-5 text-slate-400" />
                <span className="text-[10px] font-bold">دعم وتحديثات</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed bento specification below */}
      {template.longFeatures && template.longFeatures.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 border-r-4 border-blue-600 pr-3">
            مميزات ومواصفات القالب التفصيلية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {template.longFeatures.map((spec, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-150 hover:shadow-md transition-all duration-200 text-right space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-base">{spec.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Feedback block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 border-r-4 border-blue-600 pr-3">
          تقييمات وآراء العملاء المشترين
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* overall scores block */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-150 text-center flex flex-col items-center justify-center space-y-3">
            <span className="text-5xl font-extrabold text-blue-600">{template.rating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-slate-500 text-xs font-semibold">
              بناءً على {template.reviewsCount} تقييم حقيقي وموثق
            </p>
          </div>

          {/* list of customer feedbacks */}
          <div className="lg:col-span-8 space-y-4">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-white p-5 rounded-2xl border border-slate-150 text-right space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-950 text-sm sm:text-base">{review.userName}</span>
                  <span className="text-slate-400 text-xs">{review.date}</span>
                </div>
                <div className="flex text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
