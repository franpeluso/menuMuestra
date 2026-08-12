'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import MenuItemCard from '@/components/MenuItemCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { MAIN_CATEGORIES, MenuItem } from '@/data/mockMenu';
import { supabase } from '@/lib/supabase';
import { MapPin, Clock, Phone, Loader2 } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('cafeteria');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const categoryHeaderRef = useRef<HTMLDivElement>(null);

  // 1. Obtener datos desde Supabase
  useEffect(() => {
    async function fetchMenuItems() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true);

        if (error) throw error;
        if (data) setMenuItems(data);
      } catch (err) {
        console.error('Error al obtener el menú desde Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenuItems();
  }, []);

  // 2. Cambio de categoría con scroll suave asegurando espacio para el header fijo
  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryHeaderRef.current) {
      categoryHeaderRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 3. Filtrar ítems por la categoría seleccionada
  const categoryItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  // 4. Agrupar ítems por Subcategoría
  const groupedItems = categoryItems.reduce<Record<string, MenuItem[]>>(
    (acc, item) => {
      if (!acc[item.subcategory]) {
        acc[item.subcategory] = [];
      }
      acc[item.subcategory].push(item);
      return acc;
    },
    {}
  );

  const currentCategoryName =
    MAIN_CATEGORIES.find((c) => c.id === selectedCategory)?.name || '';

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* --- SECCIÓN CARTA --- */}
      <section id="carta" className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 scroll-mt-28">
        <div className="text-center space-y-2 mb-4">
          <p className="italic text-stone-600 font-serif text-lg">
            Descubrí nuestros sabores
          </p>
          <h2 className="text-5xl font-black text-stone-900 tracking-wider uppercase">
            CARTA
          </h2>
          <div className="w-12 h-1 bg-[#8B262A] mx-auto mt-2"></div>
        </div>

        {/* Botones de Categorías Principales */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Título Principal de Sección con un scroll-mt más alto para evitar que el header lo tape */}
        <div ref={categoryHeaderRef} className="mt-6 mb-10 text-center scroll-mt-36">
          <h3 className="text-3xl font-black text-[#8B262A] tracking-wider uppercase">
            {currentCategoryName}
          </h3>
        </div>

        {/* Carga o Renderizado de Subcategorías y sus productos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#8B262A]" />
            <p className="text-xs font-bold uppercase tracking-widest">Cargando menú...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.keys(groupedItems).length === 0 ? (
              <p className="text-center text-stone-500 italic py-10">
                No hay productos disponibles en esta categoría.
              </p>
            ) : (
              Object.entries(groupedItems).map(([subcat, items]) => (
                <div key={subcat} className="space-y-4">
                  {/* Título de la Subcategoría */}
                  <div className="flex items-center gap-3 my-6">
                    <span className="px-3 py-1 bg-[#8B262A]/10 text-[#8B262A] border border-[#8B262A]/30 rounded-full text-xs font-black uppercase tracking-widest">
                      {subcat}
                    </span>
                    <div className="h-[1px] bg-stone-300/80 flex-1"></div>
                  </div>

                  {/* Lista de platos bajo esta subcategoría */}
                  <div className="space-y-1">
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* --- SECCIÓN NOSOTROS --- */}
      <section id="nosotros" className="pt-16 pb-6 px-4 max-w-3xl mx-auto text-center space-y-4 scroll-mt-28">
        <span className="text-xs font-bold text-[#8B262A] tracking-widest uppercase bg-red-100 px-3 py-1 rounded-full">
          Bienvenidos
        </span>
        <h1 className="pt-10 text-4xl sm:text-5xl font-black text-stone-900 tracking-wider uppercase">
          Nuestra Historia
        </h1>
        <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-serif italic">
          Un espacio pensado para disfrutar de la buena gastronomía, un ambiente cálido y momentos inolvidables.
        </p>
      </section>

      {/* --- SECCIÓN CONTACTO --- */}
      <section id="contacto" className="bg-[#f0e5d8] py-16 px-4 border-t border-stone-300/60 scroll-mt-28 mt-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-[#8B262A] tracking-wider uppercase">
              UBICACIÓN Y CONTACTO
            </h2>
            <p className="text-stone-600 text-sm font-serif italic">
              Te esperamos para compartir una experiencia única
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-800">
            <div className="bg-white p-6 rounded-xl border border-stone-200 text-center space-y-3 shadow-sm">
              <div className="w-10 h-10 bg-[#8B262A] text-white rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold uppercase text-xs tracking-wider">Dirección</h4>
              <p className="text-xs text-stone-600">Av. Principal 1234, Ciudad</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 text-center space-y-3 shadow-sm">
              <div className="w-10 h-10 bg-[#8B262A] text-white rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold uppercase text-xs tracking-wider">Horarios</h4>
              <p className="text-xs text-stone-600">Mié a Dom: 19:00 a 02:00 hs</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 text-center space-y-3 shadow-sm">
              <div className="w-10 h-10 bg-[#8B262A] text-white rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold uppercase text-xs tracking-wider">Reservas</h4>
              <p className="text-xs text-stone-600">+54 11 1234-5678</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}