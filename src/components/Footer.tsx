import React, { useState } from "react";
import { Mail, Globe, CheckCircle2 } from "lucide-react";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 w-full pt-16 pb-24 md:pb-12 border-t border-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Col 1: About */}
        <div className="space-y-4">
          <div className="font-bold text-2xl text-white">LPTemplateHub</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            الوجهة الأولى لأفضل قوالب المواقع وصفحات الهبوط في العالم العربي. نساعدك على إطلاق فكرتك الريادية واستهداف عملائك بسرعة واحترافية متناهية.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-200">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-200">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white text-base">استكشف القوالب</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={() => setCurrentTab("gallery")} className="text-slate-400 hover:text-blue-400 transition-colors">
                تصفح جميع القوالب
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab("gallery")} className="text-slate-400 hover:text-blue-400 transition-colors">
                قوالب ساس (SaaS)
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentTab("gallery")} className="text-slate-400 hover:text-blue-400 transition-colors">
                متاجر إلكترونية
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white text-base">الدعم والمساعدة</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                مركز المساعدة الفنية
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                شروط وأحكام الخدمة
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                سياسة خصوصية البيانات
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white text-base">اشترك في النشرة البريدية</h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            كن أول من يعلم بالقوالب الجديدة المضافة، والعروض الحصرية التي تصل إلى 50%.
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                className="flex-grow px-4 py-2 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-right"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-medium text-sm rounded-xl transition-all duration-200"
              >
                اشترك
              </button>
            </div>
            {subscribed && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>شكرًا لك! تم تسجيل بريدك بنجاح.</span>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        © 2026 LPTemplateHub. جميع الحقوق محفوظة. تم التطوير بمهارة وعناية فائقة.
      </div>
    </footer>
  );
}
