import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import useSmoothScroll from "./Components/SmoothScroll/useSmoothScroll";

import ScrollToTop from "./Components/GoToTop/ScrollToTop";
import Home from "./Pages/Home/Home";
import Nav from "./Components/Navbar/Nav";
import Footer from "./Components/Footer/Footer";
import BackToTop from "./Components/BackToTop/BackToTop";
import ProductPage from "./Pages/Products/ProductPage";





function App() {
  useSmoothScroll();
  return (
    <Router>
      <ScrollToTop />
      <div>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductPage />} />

        </Routes>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;