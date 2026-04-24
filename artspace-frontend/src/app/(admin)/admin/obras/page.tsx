'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function AdminObrasPage() {
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchObras = async () => {
    try {
      // Endpoint que devuelve todas las obras para el administrador
      const res = await api.get('/admin/obras');
      setObras(res.data);
    } catch (error) {
      console.error("Error cargando obras", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchObras(); }, []);

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta obra permanentemente?')) return;

    try {
      await api.delete(`/admin/obras/${id}`);
      fetchObras(); // Recargar la tabla
    } catch (error) {
      alert("Error al eliminar la obra");
    }
  };

  if (loading) return <div>Cargando obras...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Moderación de Obras</h1>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">ID</th>
              <th className="p-4 font-semibold text-gray-700">Miniatura</th>
              <th className="p-4 font-semibold text-gray-700">Título</th>
              <th className="p-4 font-semibold text-gray-700">Autor</th>
              <th className="p-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obras.map((obra) => (
              <tr key={obra.id_obra} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-600">{obra.id_obra}</td>
                <td className="p-4">
                  <img src={obra.imagen} alt={obra.titulo} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-4 font-medium">{obra.titulo}</td>
                <td className="p-4 text-gray-600">{obra.autor}</td>
                <td className="p-4">
                  <button 
                    onClick={() => handleEliminar(obra.id_obra)}
                    className="bg-red-50 text-red-600 px-3 py-1 rounded border border-red-200 hover:bg-red-100 transition text-sm font-semibold"
                  >
                    Eliminar Obra
                  </button>
                </td>
              </tr>
            ))}
            {obras.length === 0 && (
               <tr><td colSpan={5} className="p-4 text-center text-gray-500">No hay obras registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}