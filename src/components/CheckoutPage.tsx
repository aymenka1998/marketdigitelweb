import React, { useState, useEffect } from "react";
import { Lock, CreditCard, ShieldCheck, ShoppingCart, Trash2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Template, CartItem, Order } from "../types";
import { TEMPLATES } from "../data/templates";
import { db } from "../lib/supabase";

interface CheckoutPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setCurrentTab: (tab: string) => void;
  triggerOrderSaved: () => void;
}

export default function CheckoutPage({ cart, setCart, setCurrentTab, triggerOrderSaved }: CheckoutPageProps) {
  // Personal inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Coupon promo state
  const [coupon, setCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal e.g. 0.3 for 30%
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Loading/Purchase states
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState("");

  // Fallback to default template if cart is empty, to match the layout perfectly
  const effectiveCart: CartItem[] = cart.length > 0 ? cart : [
    { template: TEMPLATES[0], quantity: 1 } // Fallback to "Nexus Corporate"
  ];

  // Calculations
  const subtotal = effectiveCart.reduce((sum, item) => sum + (item.template.price * item.quantity), 0);
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal - discountAmount;

  // Format credit card spaced every 4 characters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    let formattedValue = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += " ";
      formattedValue += value[i];
    }
    setCardNumber(formattedValue.substring(0, 19));
  };

  // Format expiry date with slash MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      setExpiry(value.substring(0, 2) + "/" + value.substring(2, 4));
    } else {
      setExpiry(value);
    }
  };

  // Handle promo code submissions
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    const code = coupon.trim().toUpperCase();
    
    if (code === "LP30" || code === "SUPABASE") {
      setAppliedDiscount(0.3); // 30% discount
      setCouponSuccess("تم تطبيق كود الخصم بنجاح! خصم بقيمة 30%");
    } else if (code === "FREE") {
      setAppliedDiscount(1.0); // 100% discount
      setCouponSuccess("تم تطبيق كود الخصم التجريبي بنجاح! السعر الآن مجاني 100%");
    } else {
      setCouponError("كود الخصم غير صحيح أو منتهي الصلاحية.");
    }
  };

  // Trigger Purchase order completion
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      alert("الرجاء إدخال الاسم والبريد الإلكتروني لإتمام الشراء.");
      return;
    }

    setIsProcessing(true);

    // Simulate micro-interaction timeout
    setTimeout(async () => {
      const orderId = "ORD-" + Math.floor(Math.random() * 90000 + 10000);
      
      const orderDetails: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customerName: fullName,
        customerEmail: email,
        items: effectiveCart.map(item => ({
          templateId: item.template.id,
          title: item.template.title,
          price: item.template.price
        })),
        total: total,
        paymentStatus: "paid"
      };

      try {
        // Save to Database (handles Supabase/Local storage gracefully)
        await db.saveOrder(orderDetails);
        setNewOrderId(orderId);
        setPurchaseSuccess(true);
        setIsProcessing(false);
        setCart([]); // Clear real cart if any
        triggerOrderSaved(); // Reload profile logs
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
      }
    }, 2000);
  };

  const handleRemoveFromCart = (templateId: string) => {
    if (cart.length > 0) {
      setCart(prev => prev.filter(item => item.template.id !== templateId));
    }
  };

  if (purchaseSuccess) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 px-4 text-center" dir="rtl">
        <div className="max-w-xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-150 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">شكراً لك! تم الشراء بنجاح</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            تمت معالجة دفعتك بنجاح. رقم الطلب الخاص بك هو <strong className="text-blue-600">{newOrderId}</strong>. تم تسجيل طلبك في نظام قاعدة البيانات.
          </p>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-right space-y-3">
            <h4 className="font-bold text-slate-800 text-sm">الملفات الجاهزة للتحميل:</h4>
            {effectiveCart.map(item => (
              <div key={item.template.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-150">
                <span className="text-xs sm:text-sm text-slate-800 font-semibold">{item.template.title} (الملف المصدري الكامل)</span>
                <a
                  href={`#download-${item.template.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`جاري تحميل كود ومكونات القالب: ${item.template.title}.zip (حجم الملف: 4.8MB)`);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  تحميل ZIP
                </a>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setCurrentTab("profile")}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-colors"
            >
              عرض سجل مشترياتي وقاعدة البيانات
            </button>
            <button
              onClick={() => setCurrentTab("gallery")}
              className="px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-colors"
            >
              استمرار التصفح
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Payment Form */}
        <div className="lg:col-span-7">
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-150 shadow-lg shadow-slate-100/50 space-y-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900 border-r-4 border-blue-600 pr-3">تفاصيل الدفع الإلكتروني</h1>
            
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-bold text-xs sm:text-sm">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-right text-sm font-medium"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-bold text-xs sm:text-sm">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-left text-sm font-medium"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                <label className="text-slate-600 font-bold text-xs sm:text-sm">رقم بطاقة الدفع (Credit Card)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full p-3 pl-12 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-left text-sm font-medium"
                    dir="ltr"
                  />
                  <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-bold text-xs sm:text-sm">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-center text-sm font-medium"
                    dir="ltr"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-600 font-bold text-xs sm:text-sm">رمز التحقق (CVV)</label>
                  <input
                    type="password"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                    placeholder="***"
                    maxLength={4}
                    className="p-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-center text-sm font-medium"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-base transition-all duration-300 active:scale-98 shadow-md hover:shadow-lg disabled:opacity-80 flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  <span>{isProcessing ? "جاري معالجة الدفعة البرمجية..." : "إتمام عملية الشراء الآمن"}</span>
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 pt-4 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>مدفوعاتك مشفرة بالكامل وآمنة بنسبة 100% وفق بروتوكولات حماية عالية.</span>
              </p>
            </form>
          </section>
        </div>

        {/* Right Column: Order Summary & Discount Codes */}
        <div className="lg:col-span-5 space-y-6">
          <aside className="bg-slate-100 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-200 pb-4">ملخص طلبك</h2>
            
            {/* List Items */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {effectiveCart.map(item => (
                <div key={item.template.id} className="flex gap-4 bg-white p-3 rounded-xl border border-slate-200 relative">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={item.template.image} alt={item.template.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between text-right flex-grow">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{item.template.title}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">ترخيص تجاري ومدى الحياة</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-blue-600 font-bold">${item.template.price}</span>
                      {cart.length > 0 && (
                        <button
                          onClick={() => handleRemoveFromCart(item.template.id)}
                          className="text-red-500 hover:text-red-600 p-1 rounded-lg transition-colors"
                          title="حذف من السلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Promo Form */}
            <form onSubmit={handleApplyCoupon} className="pt-4 border-t border-slate-200 space-y-2">
              <label className="text-slate-600 font-bold text-xs">هل لديك كود خصم؟</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="أدخل كود الخصم (مثل LP30)"
                  className="flex-grow p-2.5 border border-slate-250 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs text-right"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  تطبيق
                </button>
              </div>
              {couponError && (
                <div className="text-red-500 text-[10px] font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{couponError}</span>
                </div>
              )}
              {couponSuccess && (
                <div className="text-emerald-600 text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{couponSuccess}</span>
                </div>
              )}
            </form>

            {/* Recalculated values */}
            <div className="space-y-3 border-t border-slate-200 pt-6 text-sm text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>خصم مطبق ({appliedDiscount * 100}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>الضرائب والرسوم</span>
                <span>$0.00</span>
              </div>
              
              <div className="flex justify-between text-blue-900 text-lg font-extrabold pt-4 border-t border-slate-200">
                <span>الإجمالي النهائي</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Money back badge */}
            <div className="p-4 bg-slate-200/50 rounded-xl border border-slate-200 flex gap-3 text-right">
              <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">ضمان ذهبي لاسترداد الأموال</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed mt-0.5">
                  استمتع بضمان استرداد كامل للمبلغ المدفوع لمدة 14 يومًا إذا لم يكن المنتج مناسبًا لمتطلبات مشروعك.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
