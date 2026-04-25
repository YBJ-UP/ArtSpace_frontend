'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function FeedPage() {
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeed = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/obras/feed');
      const data = Array.isArray(response.data) ? response.data : response.data.obras ?? [];
      setObras(data);
    } catch {
      setError('No se pudo cargar el feed. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeed(); }, []);

  const getImageUrl = (url: string) => {
    if (!url) return 'https://placehold.co/800x600?text=Sin+Imagen';
    if (url.startsWith('http')) return url;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://artspacebackend-production.up.railway.app';
    return `${base}${url.startsWith('/') ? url : '/' + url}`;
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border rounded-xl overflow-hidden shadow-sm animate-pulse">
            <div className="flex items-center p-4 gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-20" />
              </div>
            </div>
            <div className="w-full h-72 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={fetchFeed}
          className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Tu Feed</h1>

      {obras.length === 0 ? (
        <div className="bg-white rounded-2xl border shadow-sm py-16 text-center text-gray-400">
          <p className="text-4xl mb-3">🎨</p>
          <p className="font-medium mb-2">Aún no hay obras para mostrar</p>
          <p className="text-sm mb-6">Sigue a otros artistas para ver sus publicaciones aquí</p>
          <Link
            href="/explorar"
            className="inline-block bg-black text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition"
          >
            Explorar artistas
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {obras.map((obra) => (
            <div key={obra.id_obra} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              {/* Encabezado */}
              <div className="flex items-center p-4 border-b gap-3">
                <Link href={`/usuario/${obra.id_usuario}`}>
                  <img
                    src={getImageUrl(obra.autor_avatar)}
                    alt={obra.autor}
                    className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition shrink-0"
                  />
                </Link>
                <div>
                  <Link href={`/usuario/${obra.id_usuario}`} className="font-bold text-sm hover:underline">
                    {obra.autor}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {obra.fecha_publicacion
                      ? new Date(obra.fecha_publicacion).toLocaleDateString('es-MX', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })
                      : ''}
                  </p>
                </div>
              </div>

              {/* Imagen */}
              <Link href={`/obras/${obra.id_obra}`}>
                <img
                  src={getImageUrl(obra.imagen || obra.archivo)}
                  alt={obra.titulo}
                  className="w-full max-h-[600px] object-cover hover:opacity-95 transition"
                />
              </Link>

              {/* Pie */}
              <div className="p-4">
                <Link href={`/obras/${obra.id_obra}`}>
                  <h2 className="text-lg font-bold mb-1 hover:underline">{obra.titulo}</h2>
                </Link>
                {obra.descripcion && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{obra.descripcion}</p>
                )}
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>❤️ {Number(obra.likes_total ?? obra.likes ?? 0)}</span>
                  <span>💬 {Number(obra.comentarios_total ?? obra.comentarios ?? 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
