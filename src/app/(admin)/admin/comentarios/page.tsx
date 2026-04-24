'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function AdminComentariosPage() {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComentarios = async () => {
    try {
      const res = await api.get('/admin/comentarios');
      setComentarios(res.data);
    } catch (error) {
      console.error("Error cargando comentarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComentarios(); }, []);

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar este comentario permanentemente?')) return;

    try {
      await api.delete(`/admin/comentarios/${id}`);
      fetchComentarios();
    } catch (error) {
      alert("Error al eliminar comentario");
    }
  };

  if (loading) return <div>Cargando comentarios...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Moderación de Comentarios</h1>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700 w-1/4">Autor</th>
              <th className="p-4 font-semibold text-gray-700 w-1/2">Comentario</th>
              <th className="p-4 font-semibold text-gray-700">Obra ID</th>
              <th className="p-4 font-semibold text-gray-700 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {comentarios.map((comentario) => (
              <tr key={comentario.id_comentario} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-sm">{comentario.autor}</td>
                <td className="p-4 text-gray-800 text-sm">{comentario.contenido}</td>
                <td className="p-4 text-gray-500 text-sm">#{comentario.id_obra}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleEliminar(comentario.id_comentario)}
                    className="text-red-600 hover:text-red-800 font-semibold text-sm bg-red-50 px-3 py-1 rounded border border-red-200"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {comentarios.length === 0 && (
               <tr><td colSpan={4} className="p-4 text-center text-gray-500">No hay comentarios para moderar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}