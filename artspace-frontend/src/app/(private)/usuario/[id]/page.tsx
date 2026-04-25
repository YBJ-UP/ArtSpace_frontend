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
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [esMiPerfil, setEsMiPerfil] = useState(false);

  const fetchDatos = async () => {
    try {
      const userLocal = localStorage.getItem('user');
      const miId = userLocal ? JSON.parse(userLocal).id_usuario : null;
      setEsMiPerfil(String(miId) === String(id));

      const [resPerfil, resObras] = await Promise.all([
        api.get(`/usuarios/${id}`),
        api.get(`/obras/usuario/${id}`),
      ]);
      setPerfil(resPerfil.data);
      setSiguiendo(resPerfil.data.siguiendo ?? false);
      setObras(resObras.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDatos(); }, [id]);

  const handleFollow = async () => {
    setLoadingFollow(true);
    try {
      if (siguiendo) {
        await api.delete(`/usuarios/${id}/seguir`);
        setSiguiendo(false);
      } else {
        await api.post(`/usuarios/${id}/seguir`);
        setSiguiendo(true);
      }
      const res = await api.get(`/usuarios/${id}`);
      setPerfil(res.data);
    } catch (error) {
      console.error('Error al seguir/dejar de seguir', error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const getImageUrl = (obra: any) => {
    const url = obra?.imagen || obra?.archivo || obra?.url_imagen || obra?.imagen_url;
    if (!url) return 'https://placehold.co/400x400?text=Sin+Imagen';
    if (url.startsWith('http')) return url;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://artspacebackend-production.up.railway.app';
    return `${base}${url.startsWith('/') ? url : '/' + url}`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 animate-pulse space-y-6">
        <div className="bg-white rounded-2xl p-8 flex gap-6 border shadow-sm">
          <div className="w-28 h-28 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-7 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-72" />
            <div className="flex gap-6 mt-4">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-56 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-gray-500">
        <p className="text-5xl mb-4">👤</p>
        <p className="text-xl font-semibold">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">

      {/* Tarjeta de perfil */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={perfil.avatar || 'https://placehold.co/150x150?text=U'}
          alt={perfil.nombre}
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-100 shrink-0"
        />

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">{perfil.nombre}</h1>
          <p className="text-gray-500 mt-1 text-sm leading-relaxed max-w-md">
            {perfil.biografia || 'Este artista aún no tiene biografía.'}
          </p>

          <div className="flex gap-6 mt-4 justify-center sm:justify-start text-sm">
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">{obras.length}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Obras</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">{perfil.seguidores ?? 0}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Seguidores</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">{perfil.seguidos ?? 0}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide">Siguiendo</p>
            </div>
          </div>
        </div>

        {esMiPerfil ? (
          <Link
            href="/perfil/editar"
            className="px-6 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition shrink-0"
          >
            Editar perfil
          </Link>
        ) : (
          <button
            onClick={handleFollow}
            disabled={loadingFollow}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition shrink-0 disabled:opacity-60 ${
              siguiendo
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {loadingFollow ? '...' : siguiendo ? 'Siguiendo ✓' : 'Seguir'}
          </button>
        )}
      </div>

      {/* Galería de obras */}
      {obras.length === 0 ? (
        <div className="bg-white rounded-2xl border shadow-sm py-16 text-center text-gray-400">
          <p className="text-4xl mb-3">🎨</p>
          <p className="font-medium">Este artista aún no ha publicado obras</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {obras.map((obra) => (
            <Link
              href={`/obras/${obra.id_obra}`}
              key={obra.id_obra}
              className="group relative rounded-xl overflow-hidden border bg-gray-100 aspect-square"
            >
              <img
                src={getImageUrl(obra)}
                alt={obra.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 flex items-end p-3">
                <p className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition duration-300 truncate">
                  {obra.titulo}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
