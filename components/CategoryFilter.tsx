'use client';

import { MAIN_CATEGORIES } from '@/data/mockMenu';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="py-6 flex justify-center sticky top-20 bg-[#fbf4eb]/90 backdrop-blur-md z-30">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-3xl px-4">
        {MAIN_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-3 rounded text-xs font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-[#8B262A] text-white shadow-md scale-105'
                  : 'bg-[#f0e5d8] text-stone-700 hover:bg-[#e4d7c7] border border-stone-300/60'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}