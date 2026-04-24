'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategorias = async () => {
    try {
      const res = await api.get('/categorias'); // Asumiendo endpoint público de categorías
      setCategorias(res.data);
    } catch (error) {
      console.error("Error cargando categorías", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategorias(); }, []);

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaCategoria.trim()) return;

    try {
      await api.post('/admin/categorias', { nombre: nuevaCategoria });
      setNuevaCategoria('');
      fetchCategorias();
    } catch (error) {
      alert("Error al agregar categoría");
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría? Podría afectar a las obras vinculadas.')) return;

    try {
      await api.delete(`/admin/categorias/${id}`);
      fetchCategorias();
    } catch (error) {
      alert("Error al eliminar categoría");
    }
  };

  if (loading) return <div>Cargando categorías...</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Gestión de Categorías</h1>
      
      {/* Formulario para agregar */}
      <form onSubmit={handleAgregar} className="mb-8 flex gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <input 
          type="text" 
          placeholder="Nombre de la nueva categoría" 
          value={nuevaCategoria}
          onChange={(e) => setNuevaCategoria(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
        />
        <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-bold">
          Agregar
        </button>
      </form>

      {/* Lista de categorías */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <ul className="divide-y">
          {categorias.map((cat) => (
            <li key={cat.id_categoria} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <span className="font-medium text-lg">{cat.nombre}</span>
              <button 
                onClick={() => handleEliminar(cat.id_categoria)}
                className="text-red-600 hover:text-red-800 font-semibold text-sm"
              >
                Eliminar
              </button>
            </li>
          ))}
          {categorias.length === 0 && (
            <li className="p-4 text-center text-gray-500">No hay categorías.</li>
          )}
        </ul>
      </div>
    </div>
  );
}