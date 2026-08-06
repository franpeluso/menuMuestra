'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#8B262A] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-left font-black tracking-widest text-xl leading-none uppercase">
            Nombre
            <span className="block text-[10px] font-normal tracking-wider opacity-80">
              Cafeteria
            </span>
          </div>
        </div>

        {/* Links Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider uppercase">
          <a href="#nosotros" className="hover:opacity-80 transition-opacity">NOSOTROS</a>
          <a href="#carta" className="hover:opacity-80 transition-opacity border-b-2 border-white pb-1">CARTA</a>
          <a href="#contacto" className="hover:opacity-80 transition-opacity">CONTACTO</a>
          
          <a
            href="https://wa.me/123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-5 py-2.5 bg-white text-[#8B262A] rounded-md font-extrabold text-xs tracking-wider uppercase hover:bg-zinc-100 transition-colors shadow"
          >
            RESERVAR MESA
          </a>
        </nav>

        {/* Menú Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-white"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Menú desplegable Mobile */}
      {isOpen && (
        <div className="lg:hidden bg-[#721f22] px-6 py-6 space-y-4 text-xs font-bold tracking-wider uppercase">
          <a href="#nosotros" className="block text-white" onClick={() => setIsOpen(false)}>NOSOTROS</a>
          <a href="#carta" className="block text-white" onClick={() => setIsOpen(false)}>CARTA</a>
          <a href="#contacto" className="block text-white" onClick={() => setIsOpen(false)}>CONTACTO</a>
          <a
            href="https://wa.me/123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3 bg-white text-[#8B262A] rounded font-extrabold"
          >
            RESERVAR MESA
          </a>
        </div>
      )}
    </header>
  );
}