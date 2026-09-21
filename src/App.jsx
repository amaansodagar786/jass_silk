import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import useSmoothScroll from "./Components/SmoothScroll/useSmoothScroll";

import ScrollToTop from "./Components/GoToTop/ScrollToTop";
import Home from "./Pages/Home/Home";
import Nav from "./Components/Navbar/Nav";
import Footer from "./Components/Footer/Footer";
import BackToTop from "./Components/BackToTop/BackToTop";
import ProductPage from "./Pages/Products/ProductPage";
import NewProductPage from "./Pages/NewProductPage/NewProductPage";
import CustomCursor from "./Components/CustomCursor/CustomCursor";





function App() {
  useSmoothScroll();
  return (
    <Router>
      <ScrollToTop />
      <CustomCursor />
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/product" element={<ProductPage />} /> */}
          <Route path="/product/:id" element={<ProductPage />} />
          {/* <Route path="/newproduct" element={<NewProductPage />} /> */}
          <Route path="/product-v2/:id" element={<NewProductPage />} />

        </Routes>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;