'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Definición simple de tipo para evitar errores
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  is_available: boolean;
};

export default function AdminPanelPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Carga de datos optimizada
  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error cargando:', error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }, []);

  // 2. Efecto único de inicio
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 3. Función de borrado con refresco automático
  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      // Recargamos la lista inmediatamente
      await fetchItems();
    }
  };

  // 4. Función de estado (Toggle)
  const handleToggleAvailability = async (item: MenuItem) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id);
    
    if (error) {
      alert('Error al actualizar');
    } else {
      await fetchItems();
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando menú...</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Producto</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.name}</td>
                <td className="p-4">${item.price}</td>
                <td className="p-4">
                  <button 
                    onClick={() => handleToggleAvailability(item)}
                    className={`px-3 py-1 rounded text-sm ${item.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {item.is_available ? 'Disponible' : 'Pausado'}
                  </button>
                </td>
                <td className="p-4">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline font-bold"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}