import React from "react";
import { motion } from "motion/react";
import { Compass, Sparkles, TrendingUp, ShieldAlert, Cpu, ArrowLeft, ArrowRight, Zap, CheckCircle2, Headphones, Star } from "lucide-react";
import { Template } from "../types";
import { STATS, TEMPLATES } from "../data/templates";

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedTemplate: (template: Template) => void;
}

export default function LandingPage({ setCurrentTab, setSelectedTemplate }: LandingPageProps) {
  // Get 3 outstanding templates for the landing featured section
  const featuredTemplates = TEMPLATES.filter(t => t.isBestSeller || t.isNew).slice(0, 3);

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentTab("details");
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle Decorative Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Right Column: Hero texts */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-right"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-xs font-semibold border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>أفضل منصة لقوالب صفحات الهبوط في العالم العربي</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              حوّل زوارك إلى عملاء مع{" "}
              <span className="text-blue-600 bg-gradient-to-l from-blue-700 to-blue-500 bg-clip-text text-transparent">أفضل صفحات الهبوط</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              اكتشف مجموعة مختارة من القوالب عالية التحويل والمصممة بعناية لمساعدتك في بناء حضور رقمي قوي وبدء مبيعاتك في دقائق معدودة، بدون تعقيد برمي.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setCurrentTab("gallery")}
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-100 transition-all duration-200 flex items-center gap-2"
              >
                <span>تصفح القوالب</span>
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => handleTemplateClick(TEMPLATES[0])}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-base transition-all duration-200"
              >
                شاهد العرض المباشر
              </button>
            </div>

            {/* Micro Rating Indicator */}
            <div className="flex items-center gap-3 pt-6 text-slate-500 text-sm">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span>مقيّم بـ <strong>4.9/5</strong> من قبل أكثر من 2,500 رائد أعمال عربي</span>
            </div>
          </motion.div>

          {/* Left Column: Premium visual preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:mr-8"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2.5 transition-transform duration-500 hover:rotate-1">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_0NabqnR5yH_BZFhlIj6mHBe3PbsX2G_grAczs2fzm5gSAHbv9Ph81lN25vbojkP0w2nckZ9RxTdBJ8PoJ8rQH71arsHbRTiYWe2MiY-zgZJOzXpWSUEHmAEhnwJzHAhMBX0VWONq0EFvIofCikVdpRPtweX4_PVklSHwjhBPurtKRLtQcQSj8qcAod_ySM5mj3TIUHjxPt9yHu0xoVX9bJdFthFaC2MU_GdoaRRcpRkLZ-YURO-fRyvWeCobSxx7aNYSRbrchBES"
                alt="لوحة تحكم إحصائيات قالب نيكسوس"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>

            {/* floating badge on top right */}
            <div className="absolute -top-6 -right-6 bg-white border border-slate-100 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-medium">معدل التحويل</div>
                <div className="text-sm font-bold text-slate-900">+45% زيادة</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Bento Grid feel */}
      <section className="bg-white border-y border-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right p-4 rounded-2xl hover:bg-slate-50/50 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0">
                {stat.value}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{stat.label}</h4>
                <p className="text-xs text-slate-400 mt-0.5">ضمان جودة معتمدة</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Templates Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div className="space-y-2 text-right">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">القوالب المميزة الأكثر مبيعاً</h2>
            <p className="text-slate-500 text-sm sm:text-base">اختر من بين التصاميم الفريدة ذات المبيعات القياسية لهذا الشهر</p>
          </div>
          <button
            onClick={() => setCurrentTab("gallery")}
            className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1.5 transition-colors duration-200 shrink-0 self-end"
          >
            <span>عرض جميع القوالب</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTemplates.map((template) => (
            <div 
              key={template.id}
              className="group bg-white rounded-2xl border border-slate-150 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Image wrap with badges */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img 
                  src={template.image} 
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {template.isBestSeller && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    الأكثر مبيعاً
                  </span>
                )}
                {template.isNew && (
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    جديد
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow text-right">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {template.title}
                  </h3>
                  <span className="font-extrabold text-lg text-blue-600 shrink-0">${template.price}</span>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {template.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleTemplateClick(template)}
                    className="w-full py-3 rounded-xl border border-blue-200 text-blue-700 font-bold text-sm bg-white hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <span>معاينة القالب وتفاصيله</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us segment */}
      <section className="bg-white border-y border-slate-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">لماذا يختارنا المحترفون؟</h2>
            <p className="text-slate-500 text-sm sm:text-base">
              نقوم بمراجعة وفحص الأكواد البرمجية والتصاميم بصرامة لضمان تقديم حلول رقمية استثنائية ترقى لتوقعاتك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Speed card */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-all duration-200">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">سرعة البرق</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                قوالبنا مُحسنة تقنياً لتعمل بأقصى سرعة ممكنة، مما يقلل من معدل الارتداد ويحسن مؤشرات محركات البحث والـ SEO بشكل فوري.
              </p>
            </div>

            {/* Conversion card */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-all duration-200">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">معدلات تحويل فائقة</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                كل بكسل في تصاميمنا مدروس بعناية لتوجيه الزائر نحو الهدف النهائي وزيادة مبيعاتك واشتراكات عملائك بشكل آلي.
              </p>
            </div>

            {/* Support card */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-all duration-200">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">دعم فني مستمر</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                فريقنا المتخصص متواجد دائمًا لمساعدتك في أي استفسار تقني أو تعديل ترغب في إجرائه على قالبك لتعمل براحة بال تامة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white rounded-3xl overflow-hidden p-10 sm:p-16 text-center shadow-xl shadow-slate-200">
          {/* subtle pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">ابدأ مبيعاتك وأطلق حضورك الرقمي الآن!</h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              احصل على رخصة مدى الحياة لأفضل قوالب الهبوط العربية المصممة بأعلى معايير الويب العالمية، وقم بربطها بقاعدة بياناتك المفضلة.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setCurrentTab("gallery")}
                className="px-8 py-4 bg-white text-blue-900 hover:bg-slate-100 active:scale-95 font-bold text-base rounded-xl transition-all duration-200 shadow-md"
              >
                تصفح معرض القوالب الكامل
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
