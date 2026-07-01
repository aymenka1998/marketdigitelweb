import React from "react";
import { ShoppingCart, Menu, ShoppingBag, User, Compass, HelpCircle } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
}

export default function Navbar({ currentTab, setCurrentTab, cartCount }: NavbarProps) {
  return (
    <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center" dir="rtl">
        {/* Right side: Menu Button on Mobile and Brand Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span 
              onClick={() => setCurrentTab("landing")}
              className="text-xl sm:text-2xl font-bold bg-gradient-to-l from-blue-900 to-blue-700 bg-clip-text text-transparent cursor-pointer"
            >
              LPTemplateHub
            </span>
          </div>
          
          {/* Desktop Navigation links */}
          <nav className="hidden md:flex gap-6 mr-8">
            <button
              onClick={() => setCurrentTab("landing")}
              className={`font-medium text-sm transition-colors duration-200 ${
                currentTab === "landing" ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setCurrentTab("gallery")}
              className={`font-medium text-sm transition-colors duration-200 ${
                currentTab === "gallery" ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              تصفح القوالب
            </button>
            <button
              onClick={() => setCurrentTab("profile")}
              className={`font-medium text-sm transition-colors duration-200 ${
                currentTab === "profile" ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              قاعدة البيانات وسجلات الشراء
            </button>
          </nav>
        </div>

        {/* Left side: Cart and user account details */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentTab("checkout")}
            className="relative p-2.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
            aria-label="سلة المشتريات"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab("profile")}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
              currentTab === "profile" 
                ? "bg-blue-50 border-blue-200 text-blue-700" 
                : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>حسابي</span>
          </button>
        </div>
      </div>
    </header>
  );
}
