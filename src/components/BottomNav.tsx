import React from "react";
import { Compass, Heart, ShoppingBag, User } from "lucide-react";

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  favoritesCount: number;
}

export default function BottomNav({ currentTab, setCurrentTab, cartCount, favoritesCount }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full md:hidden z-50 bg-white border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-4 py-2 flex justify-around items-center h-16">
      {/* Explore */}
      <button
        onClick={() => setCurrentTab("gallery")}
        className={`flex flex-col items-center justify-center transition-colors ${
          currentTab === "gallery" ? "text-blue-600" : "text-slate-400"
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">استكشف</span>
      </button>

      {/* Favorites / Saved */}
      <button
        onClick={() => {
          setCurrentTab("profile");
          // Optionally auto-scroll or activate secondary favorites sub-tab inside profile
        }}
        className={`flex flex-col items-center justify-center transition-colors relative ${
          currentTab === "profile" ? "text-blue-600" : "text-slate-400"
        }`}
      >
        <Heart className="w-5 h-5" />
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
        <span className="text-[10px] font-medium mt-1">المحفوظة</span>
      </button>

      {/* Cart inside prominent container */}
      <button
        onClick={() => setCurrentTab("checkout")}
        className={`flex flex-col items-center justify-center relative px-5 py-2 rounded-2xl transition-all ${
          currentTab === "checkout" 
            ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && currentTab !== "checkout" && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold mt-0.5">السلة</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => setCurrentTab("profile")}
        className={`flex flex-col items-center justify-center transition-colors ${
          currentTab === "profile" ? "text-blue-600" : "text-slate-400"
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-1">الملف</span>
      </button>
    </nav>
  );
}
