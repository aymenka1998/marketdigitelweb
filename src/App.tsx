import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import LandingPage from "./components/LandingPage";
import GalleryPage from "./components/GalleryPage";
import DetailsPage from "./components/DetailsPage";
import CheckoutPage from "./components/CheckoutPage";
import ProfilePage from "./components/ProfilePage";
import { Template, CartItem } from "./types";
import { TEMPLATES } from "./data/templates";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("landing");
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orderSavedCounter, setOrderSavedCounter] = useState(0);

  // Scroll to top on page / tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTab, selectedTemplate]);

  // Load favorites and cart from local storage on mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("LP_FAVORITES") || "[]");
    setFavorites(savedFavorites);

    const savedCart = JSON.parse(localStorage.getItem("LP_CART") || "[]");
    setCart(savedCart);
  }, []);

  // Save favorites to storage
  const toggleFavorite = (id: string) => {
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter(favId => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("LP_FAVORITES", JSON.stringify(updated));
  };

  // Add template item to shopping cart
  const addToCart = (template: Template) => {
    setCart(prev => {
      const exists = prev.find(item => item.template.id === template.id);
      let updated: CartItem[];
      if (exists) {
        updated = prev.map(item => 
          item.template.id === template.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prev, { template, quantity: 1 }];
      }
      localStorage.setItem("LP_CART", JSON.stringify(updated));
      return updated;
    });
  };

  const triggerOrderSaved = () => {
    setOrderSavedCounter(prev => prev + 1);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none overflow-x-hidden antialiased">
      {/* Top Main Navigation */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        cartCount={cartCount} 
      />

      {/* Primary tabs body router */}
      <main className="flex-grow pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab + (currentTab === "details" ? selectedTemplate.id : "")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {currentTab === "landing" && (
              <LandingPage 
                setCurrentTab={setCurrentTab} 
                setSelectedTemplate={setSelectedTemplate} 
              />
            )}
            
            {currentTab === "gallery" && (
              <GalleryPage 
                setCurrentTab={setCurrentTab} 
                setSelectedTemplate={setSelectedTemplate} 
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            )}

            {currentTab === "details" && (
              <DetailsPage 
                template={selectedTemplate} 
                setCurrentTab={setCurrentTab} 
                addToCart={addToCart} 
              />
            )}

            {currentTab === "checkout" && (
              <CheckoutPage 
                cart={cart} 
                setCart={setCart}
                setCurrentTab={setCurrentTab} 
                triggerOrderSaved={triggerOrderSaved}
              />
            )}

            {currentTab === "profile" && (
              <ProfilePage 
                setCurrentTab={setCurrentTab} 
                setSelectedTemplate={setSelectedTemplate} 
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                orderSavedCounter={orderSavedCounter}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer block */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Mobile Sticky Bottom navigation */}
      <BottomNav 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        cartCount={cartCount} 
        favoritesCount={favorites.length}
      />
    </div>
  );
}
