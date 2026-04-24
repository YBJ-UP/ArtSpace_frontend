'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function FeedPage() {
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await api.get('/obras/feed');
        setObras(response.data);
      } catch (err) {
        setError('No se pudo cargar el feed. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) return <div className="text-center py-10">Cargando feed...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Tu Feed</h1>
      
      {obras.length === 0 ? (
        <div className="text-center text-gray-500 bg-white p-10 rounded-xl shadow-sm">
          <p>Aún no hay obras para mostrar.</p>
          <p className="mt-2 text-sm">Empieza a seguir a otros artistas en la pestaña "Explorar".</p>
        </div>
      ) : (
        <div className="space-y-8">
          {obras.map((obra) => (
            <div key={obra.id_obra} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              {/* Encabezado del post */}
              <div className="flex items-center p-4 border-b">
                <img 
                  src={obra.autor_avatar || 'https://via.placeholder.com/40'} 
                  alt={obra.autor} 
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div>
                  <Link href={`/usuario/${obra.id_usuario}`} className="font-bold hover:underline">
                    {obra.autor}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {new Date(obra.fecha_publicacion).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {/* Imagen de la obra */}
              <Link href={`/obras/${obra.id_obra}`}>
                <img 
                  src={obra.imagen} 
                  alt={obra.titulo} 
                  className="w-full h-auto max-h-[600px] object-cover hover:opacity-95 transition"
                />
              </Link>

              {/* Pie del post */}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{obra.titulo}</h2>
                <p className="text-gray-700 mb-4">{obra.descripcion}</p>
                <div className="flex gap-4 text-sm font-semibold text-gray-600">
                  <span>❤️ {obra.likes} Likes</span>
                  <span>💬 {obra.comentarios} Comentarios</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}