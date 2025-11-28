import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import { HomePage } from "../pages/Home/HomePage";
import { ProductsPage } from "../pages/Products/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetail/ProductDetailPage";
import { CartPage } from "../pages/Cart/CartPage";
import { CheckoutPage } from "../pages/Checkout/CheckoutPage";
import { AdminPage } from "../pages/Admin/AdminPage";
import { RegisterPage } from "../pages/Auth/RegisterPage";
import { LoginPage } from "../pages/Auth/LoginPage";
import { ContactPage } from "../pages/Contact/ContactPage";
import { SellerPage } from "../pages/Admin/SellerPage";
import { AboutUsPage } from "../pages/About/AboutUsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/detalle/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/nosotros" element={<AboutUsPage />} />
        <Route path="/vendedor" element={<SellerPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}