/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SchoolInfoBanner from './components/SchoolInfoBanner';
import BullyingBanner from './components/BullyingBanner';
import LibraryBanner from './components/LibraryBanner';
import SchoolGallery from './components/SchoolGallery';
import Values from './components/Values';
import Info from './components/Info';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BullyingReportPage from './components/BullyingReportPage';
import DigitalLibraryPage from './components/DigitalLibraryPage';
import SchoolInfoPage from './components/SchoolInfoPage';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'bullying' | 'admin' | 'biblioteca' | 'escola'>(() => {
    if (window.location.hash === '#denuncia-bullying') return 'bullying';
    if (window.location.hash === '#admin') return 'admin';
    if (window.location.hash === '#biblioteca') return 'biblioteca';
    if (window.location.hash === '#horarios-escola' || window.location.hash === '#escola') return 'escola';
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
      } else if (window.location.hash === '#biblioteca') {
        setCurrentView('biblioteca');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (window.location.hash === '#horarios-escola' || window.location.hash === '#escola') {
        setCurrentView('escola');
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

  const openLibrary = () => {
    window.location.hash = '#biblioteca';
    setCurrentView('biblioteca');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSchoolInfo = () => {
    window.location.hash = '#horarios-escola';
    setCurrentView('escola');
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

  if (currentView === 'biblioteca') {
    return <DigitalLibraryPage onBackToHome={backToHome} onOpenAdminLogin={openAdminLogin} />;
  }

  if (currentView === 'escola') {
    return (
      <SchoolInfoPage 
        onBackToHome={backToHome}
        onOpenLibrary={openLibrary}
        onOpenBullyingReport={openBullyingReport}
        onOpenAdminLogin={openAdminLogin}
      />
    );
  }

  if (currentView === 'admin') {
    return <AdminPanel onBackToHome={backToHome} />;
  }

  return (
    <div className="min-h-screen bg-emerald-50/20 flex flex-col font-sans scroll-smooth">
      <Navbar 
        onOpenBullyingReport={openBullyingReport} 
        onOpenAdminLogin={openAdminLogin}
        onOpenLibrary={openLibrary}
        onOpenSchoolInfo={openSchoolInfo}
        onBackToHome={backToHome}
      />
      <main className="flex-grow">
        <Hero 
          onOpenBullyingReport={openBullyingReport}
          onOpenLibrary={openLibrary}
          onOpenSchoolInfo={openSchoolInfo}
        />
        <SchoolInfoBanner onOpenSchoolInfo={openSchoolInfo} />
        <BullyingBanner onOpenBullyingReport={openBullyingReport} />
        <LibraryBanner onOpenLibrary={openLibrary} />
        <SchoolGallery />
        <Values />
        <Info />
        <Contact />
      </main>
      <Footer 
        onOpenBullyingReport={openBullyingReport} 
        onOpenAdminLogin={openAdminLogin}
        onOpenLibrary={openLibrary}
        onOpenSchoolInfo={openSchoolInfo}
      />
    </div>
  );
}
