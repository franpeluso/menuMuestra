import { MenuItem } from '@/data/mockMenu';

export default function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="py-4 border-b border-stone-300/60 flex justify-between items-start gap-4">
      <div className="space-y-1 max-w-2xl">
        <h3 className="font-bold text-stone-900 text-lg tracking-tight">
          {item.name}
        </h3>
        <p className="text-sm text-stone-600 font-normal leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="text-right shrink-0">
        <span className="font-bold text-[#8B262A] text-lg">
          ${item.price.toLocaleString('es-AR')}
        </span>
      </div>
    </div>
  );
}