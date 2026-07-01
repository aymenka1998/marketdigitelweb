import React, { useState, useEffect } from "react";
import { Database, ShieldCheck, Key, Copy, Check, FileText, Download, Heart, Compass, AlertCircle, RefreshCw } from "lucide-react";
import { Template, Order, SupabaseConfig } from "../types";
import { db, getSupabaseSetupSQL, isSupabaseConnected } from "../lib/supabase";
import { TEMPLATES } from "../data/templates";

interface ProfilePageProps {
  setCurrentTab: (tab: string) => void;
  setSelectedTemplate: (template: Template) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  orderSavedCounter: number; // to trigger reload
}

export default function ProfilePage({ setCurrentTab, setSelectedTemplate, favorites, toggleFavorite, orderSavedCounter }: ProfilePageProps) {
  const [activeSubTab, setActiveSubTab] = useState<"database" | "orders" | "favorites">("database");
  
  // Supabase states
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connected" | "error">("disconnected");
  const [copiedSql, setCopiedSql] = useState(false);

  // Orders log
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Reload credentials from storage
  useEffect(() => {
    const savedUrl = localStorage.getItem("LP_SUPABASE_URL") || "";
    const savedKey = localStorage.getItem("LP_SUPABASE_ANON_KEY") || "";
    setSupabaseUrl(savedUrl);
    setSupabaseKey(savedKey);
    
    if (savedUrl && savedKey) {
      setConnectionStatus(isSupabaseConnected() ? "connected" : "error");
    } else {
      setConnectionStatus("disconnected");
    }
  }, []);

  // Reload orders on change or mount
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoadingOrders(true);
      const data = await db.getOrders();
      setOrders(data);
      setIsLoadingOrders(false);
    };
    loadOrders();
  }, [orderSavedCounter]);

  const handleSaveConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      localStorage.removeItem("LP_SUPABASE_URL");
      localStorage.removeItem("LP_SUPABASE_ANON_KEY");
      setConnectionStatus("disconnected");
      alert("تم إزالة بيانات الاتصال بسوبابيس. سيعود التطبيق للعمل في الوضع التجريبي المحلي.");
      return;
    }

    localStorage.setItem("LP_SUPABASE_URL", supabaseUrl.trim());
    localStorage.setItem("LP_SUPABASE_ANON_KEY", supabaseKey.trim());
    
    // Test check
    const connected = isSupabaseConnected();
    if (connected) {
      setConnectionStatus("connected");
      alert("تهانينا! تم اختبار وحفظ الاتصال بقاعدة بيانات Supabase بنجاح.");
    } else {
      setConnectionStatus("error");
      alert("فشل الاتصال. يرجى التحقق من صحة الرابط ومفتاح Anon API Key وإعادة المحاولة.");
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(getSupabaseSetupSQL());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const favoriteTemplates = TEMPLATES.filter(t => favorites.includes(t.id));

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20" dir="rtl">
      {/* Upper header */}
      <section className="bg-gradient-to-l from-slate-900 to-blue-900 py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold">لوحة التحكم السحابية وإدارة الحساب</h1>
            <p className="text-slate-300 text-xs sm:text-sm">قم بربط Supabase، تتبع سجلات مشترياتك، وحمل ملفات قوالبك مباشرة.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl text-xs font-bold backdrop-blur">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>الحالة: {connectionStatus === "connected" ? "متصل بـ Supabase" : "وضع التجربة المحلي (Sandbox)"}</span>
          </div>
        </div>
      </section>

      {/* Tabs navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveSubTab("database")}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeSubTab === "database"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            ربط قاعدة بيانات Supabase
          </button>
          
          <button
            onClick={() => setActiveSubTab("orders")}
            className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === "orders"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>سجل الطلبات والتحميل</span>
            {orders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold flex items-center justify-center">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("favorites")}
            className={`pb-4 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeSubTab === "favorites"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>المفضلة</span>
            {favorites.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Dynamic Tab Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Tab 1: Database Setup */}
        {activeSubTab === "database" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Supabase details form */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-md space-y-6">
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg">بيانات اتصال سوبابيس (Supabase)</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  أدخل بيانات مشروعك في Supabase لحفظ المبيعات والطلبات والمراجعات في السحابة الخاصة بك مباشرة بدلاً من الذاكرة المحلية المؤقتة.
                </p>
              </div>

              <form onSubmit={handleSaveConnection} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-bold text-xs sm:text-sm">رابط المشروع (Supabase Project URL)</label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project-id.supabase.co"
                    className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-left text-xs sm:text-sm font-medium"
                    dir="ltr"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 font-bold text-xs sm:text-sm">مفتاح Anon API Key</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full p-3 pl-10 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-left text-xs font-medium"
                      dir="ltr"
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-md flex-grow"
                  >
                    اختبار وحفظ بيانات الاتصال
                  </button>
                  
                  {supabaseUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setSupabaseUrl("");
                        setSupabaseKey("");
                        localStorage.removeItem("LP_SUPABASE_URL");
                        localStorage.removeItem("LP_SUPABASE_ANON_KEY");
                        setConnectionStatus("disconnected");
                      }}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-colors"
                    >
                      إلغاء الربط
                    </button>
                  )}
                </div>
              </form>

              {/* Status Indicators */}
              <div className="p-4 rounded-xl border flex gap-3 text-right text-xs">
                {connectionStatus === "connected" ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-emerald-900">الاتصال نشط بقاعدتك السحابية</h4>
                      <p className="text-slate-500 mt-1">يتم حفظ ومزامنة جميع المعاملات الجديدة على السحابة بنجاح.</p>
                    </div>
                  </>
                ) : connectionStatus === "error" ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-900">فشل في تأسيس الاتصال</h4>
                      <p className="text-slate-500 mt-1">يرجى التأكد من الروابط المدخلة وجداول SQL المنشأة في حسابك.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-blue-900">وضع المحاكاة الفورية المدمجة (Local Sandbox)</h4>
                      <p className="text-slate-500 mt-1">
                        يعمل التطبيق بذاكرة المتصفح المحلية لتجربة جميع ميزات الشراء والمراجعات والتحميل. بياناتك آمنة ومحفوظة.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SQL schema code helper */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-md space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">مخطط جداول قاعدة البيانات (SQL Schema)</h3>
                  <p className="text-slate-500 text-xs">انسخ الأكواد التالية والصقها في نافذة Supabase SQL Editor لتأسيس الجداول في ثوانٍ.</p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>نسخ الكود</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-900 text-slate-200 p-4 text-[11px] font-mono leading-relaxed h-[320px] overflow-y-auto" dir="ltr">
                <pre>{getSupabaseSetupSQL()}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & Downloads list */}
        {activeSubTab === "orders" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-md space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg border-r-4 border-blue-600 pr-3">سجل عمليات الشراء والتحميل الفوري</h3>
            
            {isLoadingOrders ? (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
                <p className="text-xs font-semibold">جاري تحميل سجلاتك بقاعدة البيانات...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-4">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold">لا يوجد مشتريات مسجلة حتى الآن</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  قم بإضافة القوالب إلى سلة المشتريات وإجراء عملية شراء تجريبية أو حقيقية لتظهر ملفات التحميل الخاصة بك هنا.
                </p>
                <button
                  onClick={() => setCurrentTab("gallery")}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 transition-colors"
                >
                  تصفح معرض القوالب وشراء قالب
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200/50 pb-3">
                      <div className="flex gap-4 items-center">
                        <span className="text-xs text-slate-400">رقم الطلب: <strong className="text-slate-800 font-bold">{order.id}</strong></span>
                        <span className="text-xs text-slate-400">التاريخ: <strong className="text-slate-700 font-bold">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</strong></span>
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold rounded-full">
                        مكتمل ومدفوع
                      </span>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-150">
                          <div className="text-right">
                            <span className="text-xs sm:text-sm text-slate-800 font-bold block">{item.title}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">رخصة تجارية مدى الحياة</span>
                          </div>
                          
                          <button
                            onClick={() => alert(`جاري تحميل الملف المصدري للقالب: ${item.title}.zip (حجم الملف: 4.8MB)`)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تحميل ZIP</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Favorites list */}
        {activeSubTab === "favorites" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-md space-y-6">
            <h3 className="font-extrabold text-slate-900 text-lg border-r-4 border-blue-600 pr-3">مجموعتك المفضلة والمحفوظات</h3>

            {favoriteTemplates.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-4">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-bold">لا توجد قوالب محفوظة حالياً</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  تصفح معرض القوالب واضغط على أيقونة القلب على القوالب لحفظها والرجوع إليها ومراجعتها لاحقاً.
                </p>
                <button
                  onClick={() => setCurrentTab("gallery")}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 transition-colors"
                >
                  اكتشف القوالب واحفظ مفضلاتك
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteTemplates.map((template) => (
                  <div key={template.id} className="border border-slate-150 rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all flex flex-col h-full">
                    <img src={template.image} alt={template.title} className="w-full aspect-video object-cover" />
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-tight line-clamp-1">{template.title}</h4>
                        <span className="font-extrabold text-blue-600 text-sm sm:text-base shrink-0">${template.price}</span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{template.description}</p>
                      
                      <div className="mt-auto flex gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedTemplate(template);
                            setCurrentTab("details");
                          }}
                          className="flex-grow py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          معاينة وتفاصيل
                        </button>
                        <button
                          onClick={() => toggleFavorite(template.id)}
                          className="px-3 py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors"
                          title="إزالة من المفضلة"
                        >
                          إزالة
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
