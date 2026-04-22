'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    usuarios: 0,
    obras: 0,
    comentarios: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        // El backend devuelve estadísticas agregadas
        setStats(res.data);
      } catch (error) {
        console.error("Error cargando dashboard admin", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Cargando panel...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Resumen General</h1>
      
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Total Usuarios</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.usuarios}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Obras Publicadas</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.obras}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-purple-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">Comentarios</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{stats.comentarios}</p>
        </div>
      </div>

      {/* Accesos rápidos */}
      <h2 className="text-xl font-bold mb-4">Accesos Rápidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/usuarios" className="bg-white p-4 text-center rounded-lg border hover:bg-gray-50 transition font-semibold text-blue-600">
          Gestionar Usuarios
        </Link>
        <Link href="/admin/obras" className="bg-white p-4 text-center rounded-lg border hover:bg-gray-50 transition font-semibold text-green-600">
          Moderar Obras
        </Link>
        <Link href="/admin/categorias" className="bg-white p-4 text-center rounded-lg border hover:bg-gray-50 transition font-semibold text-orange-600">
          Ajustar Categorías
        </Link>
        <Link href="/admin/comentarios" className="bg-white p-4 text-center rounded-lg border hover:bg-gray-50 transition font-semibold text-purple-600">
          Revisar Comentarios
        </Link>
      </div>
    </div>
  );
}