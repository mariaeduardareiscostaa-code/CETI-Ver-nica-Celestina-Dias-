/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Values from './components/Values';
import Info from './components/Info';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-emerald-50/20 flex flex-col font-sans scroll-smooth">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Values />
        <Info />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
