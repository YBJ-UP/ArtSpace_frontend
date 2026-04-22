'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';

export default function PerfilUsuarioPage() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState<any>(null);
  const [obras, setObras] = useState<any[]>([]);
  const [siguiendo, setSiguiendo] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDatos = async () => {
    try {
      const resPerfil = await api.get(`/perfil/${id}`);
      setPerfil(resPerfil.data);
      setSiguiendo(resPerfil.data.siguiendo); // El backend debe indicar si ya lo sigues

      const resObras = await api.get(`/obras/usuario/${id}`);
      setObras(resObras.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDatos(); }, [id]);

  const handleFollow = async () => {
    try {
      await api.post(`/seguidores/${id}`);
      setSiguiendo(!siguiendo);
      // Opcional: Recargar para actualizar contador de seguidores
      const res = await api.get(`/perfil/${id}`);
      setPerfil(res.data);
    } catch (error) {
      console.error('Error al seguir/dejar de seguir', error);
    }
  };

  if (loading) return <div className="text-center py-10">Cargando perfil...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row items-center gap-6">
        <img src={perfil.avatar || 'https://via.placeholder.com/150'} className="w-32 h-32 rounded-full object-cover" />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold">{perfil.nombre}</h1>
          <p className="text-gray-700 mt-2">{perfil.biografia || 'Sin biografía.'}</p>
          <div className="flex gap-6 mt-4 justify-center md:justify-start">
            <span><strong>{obras.length}</strong> Obras</span>
            <span><strong>{perfil.seguidores}</strong> Seguidores</span>
            <span><strong>{perfil.seguidos}</strong> Seguidos</span>
          </div>
        </div>
        <button 
          onClick={handleFollow}
          className={`px-8 py-2 rounded-lg font-bold transition ${
            siguiendo ? 'bg-gray-200 text-black hover:bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {siguiendo ? 'Siguiendo' : 'Seguir'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {obras.map((obra) => (
          <Link href={`/obras/${obra.id_obra}`} key={obra.id_obra} className="rounded-xl overflow-hidden border group">
            <img src={obra.imagen} className="w-full h-64 object-cover group-hover:scale-105 transition" />
          </Link>
        ))}
      </div>
    </div>
  );
}