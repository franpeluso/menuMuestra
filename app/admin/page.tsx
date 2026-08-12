// app/admin/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Pencil, Trash2, LogOut, Package, CheckCircle, XCircle, WheatOff } from 'lucide-react';

// Interfaz propia para asegurar que coincida con Supabase y evitar choques de tipos
interface MenuItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  category: string;
  subcategory: string;
  is_gluten_free?: boolean;
  is_available?: boolean;
  created_at?: string;
}

export default function AdminPanelPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el manejo de los formularios (Modales)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'cafeteria',
    subcategory: '',
    is_gluten_free: false,
    is_available: true,
  });

  // 1. Cargar TODOS los productos
  const fetchAllItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      if (data) setMenuItems(data);
    } catch (err: any) {
      console.error('Error al cargar menú:', err);
      setError('Error al cargar el menú: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, []);

  // 0. VERIFICAR SESIÓN Y CARGAR DATOS AL MONTAR EL COMPONENTE
  useEffect(() => {
  let isMounted = true;

  const loadData = async () => {
    // Comentamos la autenticación un segundo para probar si trae los datos de una
    if (isMounted) {
      await fetchAllItems();
    }
  };

  loadData();

  return () => {
    isMounted = false;
  };
}, [fetchAllItems]);

  // 2. Manejo del Cierre de Sesión
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // 3. Manejo de Formularios (Abrir/Cerrar Modal)
  const openModalForCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'cafeteria',
      subcategory: '',
      is_gluten_free: false,
      is_available: true,
    });
    setIsModalOpen(true);
  };

  const openModalForEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      subcategory: item.subcategory || '',
      is_gluten_free: item.is_gluten_free ?? false,
      is_available: item.is_available ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 4. Enviar Formulario (Crear o Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    const priceNumber = parseFloat(formData.price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      setError('Por favor ingrese un precio válido.');
      setFormLoading(false);
      return;
    }

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: priceNumber,
      category: formData.category,
      subcategory: formData.subcategory,
      is_gluten_free: formData.is_gluten_free,
      is_available: formData.is_available,
    };

    try {
      if (editingItem) {
        const { error: updateError } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('menu_items')
          .insert([itemData]);

        if (insertError) throw insertError;
      }

      closeModal();
      await fetchAllItems();
    } catch (err: any) {
      setError('Error al guardar el producto: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // 5. Eliminar un producto (DELETE)
  const handleDeleteItem = async (id: string | number, name: string) => {
    if (!confirm(`¿Está seguro que desea eliminar definitivamente el plato "${name}"?`)) {
      return;
    }

    try {
      setFormLoading(true);
      const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchAllItems();
    } catch (err: any) {
      setError('Error al eliminar el producto: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased">
      
      {/* HEADER DEL PANEL */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#031130] text-[#F3F7FE] border-b border-[#185DF1]/20 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <span className="text-2xl font-black tracking-tight flex items-center">
               grow<span className="text-[#185DF1] underline decoration-4 underline-offset-4">be</span>
             </span>
            <div className="h-6 w-[1px] bg-[#F3F7FE]/20"></div>
            <h1 className="text-sm font-bold uppercase tracking-widest text-[#185DF1]">Admin Menu QR</h1>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Suscripción Activa
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <section className="pt-28 pb-16 px-6 max-w-7xl mx-auto w-full">
        
        {/* Título y Botón Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 border-b border-stone-200 pb-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#185DF1]">Gestión de Menú QR</p>
            <h2 className="text-4xl font-black text-stone-950 tracking-tight uppercase">Panel de Control</h2>
          </div>
          <button
            onClick={openModalForCreate}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#8B262A] hover:bg-[#8B262A]/90 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Agregar Nuevo Plato
          </button>
        </div>

        {/* Manejo de errores */}
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-xl flex items-center gap-3 text-sm font-medium mb-6">
                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                <p>{error}</p>
            </div>
        )}

        {/* TABLA DE PRODUCTOS */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-600">
                <Loader2 className="w-10 h-10 animate-spin text-[#8B262A]" />
                <p className="text-xs font-bold uppercase tracking-widest">Cargando productos...</p>
            </div>
        ) : (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-stone-100 border-b border-stone-200">
                        <tr>
                            <th className="text-left p-5 text-xs font-bold uppercase tracking-widest text-stone-700 min-w-[200px]">Producto</th>
                            <th className="text-left p-5 text-xs font-bold uppercase tracking-widest text-stone-700">Categoría</th>
                            <th className="text-left p-5 text-xs font-bold uppercase tracking-widest text-stone-700">Subcategoría</th>
                            <th className="text-left p-5 text-xs font-bold uppercase tracking-widest text-stone-700">Precio (ARS)</th>
                            <th className="text-center p-5 text-xs font-bold uppercase tracking-widest text-stone-700">Sin TACC</th>
                            <th className="text-center p-5 text-xs font-bold uppercase tracking-widest text-stone-700">Estado</th>
                            <th className="text-center p-5 text-xs font-bold uppercase tracking-widest text-stone-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {menuItems.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-16 text-stone-500 italic">
                                    No hay productos cargados en el menú. ¡Agrega el primero!
                                </td>
                            </tr>
                        ) : (
                            menuItems.map((item) => (
                                <tr key={item.id} className={`hover:bg-stone-50 transition-colors ${item.is_available === false ? 'opacity-60 bg-stone-50/50' : ''}`}>
                                    
                                    {/* Producto */}
                                    <td className="p-5">
                                        <div className="space-y-0.5">
                                            <p className="font-bold text-base text-stone-950">{item.name}</p>
                                            <p className="text-xs text-stone-600 leading-relaxed max-w-sm line-clamp-1">{item.description}</p>
                                        </div>
                                    </td>

                                    {/* Categoría */}
                                    <td className="p-5 capitalize text-stone-700">{item.category}</td>
                                    
                                    {/* Subcategoría */}
                                    <td className="p-5 font-medium text-stone-800">{item.subcategory}</td>

                                    {/* Precio */}
                                    <td className="p-5 font-black text-lg text-stone-950">
                                        ${item.price?.toLocaleString('es-AR')}
                                    </td>

                                    {/* Sin TACC */}
                                    <td className="p-5 text-center">
                                        {item.is_gluten_free ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold" title="Apto Celíacos">
                                                <WheatOff className="w-3.5 h-3.5 text-amber-600" />
                                                Sin TACC
                                            </span>
                                        ) : (
                                            <span className="text-stone-400 text-xs">-</span>
                                        )}
                                    </td>

                                    {/* Estado */}
                                    <td className="p-5 text-center">
                                        {item.is_available !== false ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 text-xs font-semibold">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Disponible
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-800 border border-red-200 text-xs font-semibold">
                                                <XCircle className="w-3.5 h-3.5" />
                                                Pausado
                                            </span>
                                        )}
                                    </td>

                                    {/* Acciones */}
                                    <td className="p-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openModalForEdit(item)}
                                                className="p-2 rounded-lg bg-white border border-stone-200 text-stone-600 hover:border-[#185DF1] hover:text-[#185DF1] hover:bg-[#185DF1]/5 transition-colors"
                                                title="Editar producto"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id, item.name)}
                                                disabled={formLoading}
                                                className="p-2 rounded-lg bg-white border border-stone-200 text-stone-600 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                title="Eliminar producto"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </section>

      {/* MODAL DE FORMULARIO (Crear/Editar) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#031130]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl w-full max-w-2xl p-8 sm:p-10 my-8 space-y-8">
            
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-6">
                <div className="space-y-1">
                    <Package className="w-7 h-7 text-[#8B262A]" />
                    <h3 className="text-3xl font-black text-stone-950 tracking-tight uppercase pt-2">
                        {editingItem ? `Editar plato` : `Nuevo plato`}
                    </h3>
                    <p className="text-stone-600 text-sm font-serif italic">
                        {editingItem ? `Complete los campos para actualizar "${editingItem.name}"` : `Complete los datos del nuevo integrante de la carta`}
                    </p>
                </div>
                <button onClick={closeModal} className="p-2 rounded-lg text-stone-500 hover:bg-stone-100">
                    <XCircle className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nombre */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Nombre del Plato</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm" placeholder="ej. Milanesa con Fritas" />
              </div>

              {/* Categoría */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Categoría Principal</label>
                <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm bg-white capitalize">
                    <option value="cafeteria">Cafetería</option>
                    <option value="platos_principales">Platos Principales</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="postres">Postres</option>
                </select>
              </div>

              {/* Subcategoría */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Subcategoría</label>
                <input type="text" name="subcategory" value={formData.subcategory} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm" placeholder="ej. Minutas, Cervezas, Tortas" />
              </div>

              {/* Precio */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Precio (ARS)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-bold text-lg" placeholder="0.00" />
              </div>

              {/* Checkboxes de Estado */}
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" name="is_gluten_free" checked={formData.is_gluten_free} onChange={handleInputChange} className="w-5 h-5 accent-[#8B262A] rounded border-stone-300" id="is_gluten_free" />
                <label htmlFor="is_gluten_free" className="text-sm font-semibold text-stone-800">¿Es apto celíacos (Sin TACC)?</label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" name="is_available" checked={formData.is_available} onChange={handleInputChange} className="w-5 h-5 accent-[#8B262A] rounded border-stone-300" id="is_available" />
                <label htmlFor="is_available" className="text-sm font-semibold text-stone-800">¿Producto disponible?</label>
              </div>

              {/* Descripción */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-700">Descripción / Ingredientes (Opcional)</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm" placeholder="ej. Con queso cheddar, bacon crocante y huevo frito. Acompañada de fritas." />
              </div>

              {/* Botones */}
              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-6 border-t border-stone-200 mt-4">
                <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs uppercase tracking-widest"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={formLoading}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#8B262A] hover:bg-[#8B262A]/90 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all disabled:opacity-60"
                >
                    {formLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        editingItem ? 'Actualizar Plato' : 'Crear Plato'
                    )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </main>
  );
}