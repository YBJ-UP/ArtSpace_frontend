'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/admin/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCambiarRol = async (id: number, rolActual: string) => {
    const nuevoRol = rolActual === 'admin' ? 'usuario' : 'admin';
    if (!confirm(`¿Estás seguro de cambiar el rol a ${nuevoRol}?`)) return;

    try {
      await api.put(`/admin/usuarios/${id}/rol`, { rol: nuevoRol });
      fetchUsuarios(); // Recargar la lista
    } catch (error) {
      alert("Error al cambiar rol");
    }
  };

  const handleCambiarEstado = async (id: number, activoActual: boolean) => {
    const nuevoEstado = !activoActual;
    const accion = nuevoEstado ? 'reactivar' : 'desactivar';
    if (!confirm(`¿Estás seguro de ${accion} esta cuenta?`)) return;

    try {
      await api.put(`/admin/usuarios/${id}/estado`, { activo: nuevoEstado });
      fetchUsuarios();
    } catch (error) {
      alert("Error al cambiar estado");
    }
  };

  if (loading) return <div>Cargando lista de usuarios...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-700">ID</th>
              <th className="p-4 font-semibold text-gray-700">Nombre</th>
              <th className="p-4 font-semibold text-gray-700">Correo</th>
              <th className="p-4 font-semibold text-gray-700">Rol</th>
              <th className="p-4 font-semibold text-gray-700">Estado</th>
              <th className="p-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id_usuario} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-600">{user.id_usuario}</td>
                <td className="p-4 font-medium">{user.nombre}</td>
                <td className="p-4 text-gray-600">{user.correo}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.rol}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button 
                    onClick={() => handleCambiarRol(user.id_usuario, user.rol)}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100 transition"
                  >
                    Cambiar Rol
                  </button>
                  <button 
                    onClick={() => handleCambiarEstado(user.id_usuario, user.activo)}
                    className={`text-xs px-3 py-1 rounded border transition ${
                      user.activo 
                        ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                        : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                    }`}
                  >
                    {user.activo ? 'Desactivar' : 'Reactivar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}