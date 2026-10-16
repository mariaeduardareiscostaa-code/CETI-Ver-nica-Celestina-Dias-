/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BullyingBanner from './components/BullyingBanner';
import SchoolGallery from './components/SchoolGallery';
import Values from './components/Values';
import Info from './components/Info';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BullyingReportPage from './components/BullyingReportPage';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'bullying' | 'admin'>(() => {
    if (window.location.hash === '#denuncia-bullying') return 'bullying';
    if (window.location.hash === '#admin') return 'admin';
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#denuncia-bullying') {
        setCurrentView('bullying');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#admin') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openBullyingReport = () => {
    window.location.hash = '#denuncia-bullying';
    setCurrentView('bullying');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdminLogin = () => {
    window.location.hash = '#admin';
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'bullying') {
    return <BullyingReportPage onBackToHome={backToHome} />;
  }

  if (currentView === 'admin') {
    return <AdminPanel onBackToHome={backToHome} />;
  }

  return (
    <div className="min-h-screen bg-emerald-50/20 flex flex-col font-sans scroll-smooth">
      <Navbar onOpenBullyingReport={openBullyingReport} onOpenAdminLogin={openAdminLogin} />
      <main className="flex-grow">
        <Hero onOpenBullyingReport={openBullyingReport} />
        <BullyingBanner onOpenBullyingReport={openBullyingReport} />
        <SchoolGallery />
        <Values />
        <Info />
        <Contact />
      </main>
      <Footer onOpenBullyingReport={openBullyingReport} onOpenAdminLogin={openAdminLogin} />
    </div>
  );
}
