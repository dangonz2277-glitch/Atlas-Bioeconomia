/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import TopNavBar from "@/src/components/layout/TopNavBar";
import Footer from "@/src/components/layout/Footer";
import Home from "@/src/pages/Home";
import Explorador from "@/src/pages/Explorador";
import Catalogo from "@/src/pages/Catalogo";
import Recursos from "@/src/pages/Recursos";
import Nosotros from "@/src/pages/Nosotros";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const isExplorador = location.pathname === "/explorador";

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorador" element={<Explorador />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/nosotros" element={<Nosotros />} />
        </Routes>
      </div>
      {!isExplorador && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

