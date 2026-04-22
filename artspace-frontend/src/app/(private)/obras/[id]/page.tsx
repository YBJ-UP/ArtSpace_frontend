'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

export default function DetalleObraPage() {
  const params = useParams();
  const idObra = params.id;

  const [obra, setObra] = useState<any>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        // Obtenemos los detalles de la obra que ya incluyen los comentarios
        const resObra = await api.get(`/obras/${idObra}`);
        setObra(resObra.data);
        setComentarios(resObra.data.comentarios || []);
      } catch (error) {
        console.error('Error al cargar la obra', error);
      } finally {
        setLoading(false);
      }
    };

    if (idObra) fetchDetalles();
  }, [idObra]);

  const handleLike = async () => {
    try {
      // Endpoint para dar/quitar like
      const res = await api.post(`/obras/${idObra}/likes`);
      // Actualizamos el contador de likes localmente (asumiendo que el backend devuelve un mensaje de éxito)
      setObra({ 
        ...obra, 
        likes: res.data.mensaje.includes('agregado') ? obra.likes + 1 : Math.max(0, obra.likes - 1) 
      });
    } catch (error) {
      console.error('Error al dar like', error);
    }
  };

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      await api.post(`/obras/${idObra}/comentarios`, { contenido: nuevoComentario });
      setNuevoComentario('');
      // Recargar obra para obtener los nuevos comentarios
      const resObra = await api.get(`/obras/${idObra}`);
      setComentarios(resObra.data.comentarios || []);
    } catch (error) {
      console.error('Error al publicar comentario', error);
    }
  };

  if (loading) return <div className="text-center py-10">Cargando obra...</div>;
  if (!obra) return <div className="text-center py-10">Obra no encontrada</div>;

  const getImageUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/800x600?text=Sin+Imagen';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://artspacebackend-production.up.railway.app';
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Imagen en grande */}
        <div className="bg-gray-100 flex justify-center">
          <img 
            src={getImageUrl(obra.imagen || obra.archivo)} 
            alt={obra.titulo} 
            className="max-h-[70vh] object-contain w-full"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{obra.titulo}</h1>
              <p className="text-gray-600 mt-1">
                Por <Link href={`/usuario/${obra.id_usuario}`} className="font-bold text-black hover:underline">{obra.autor}</Link> • {obra.categoria}
              </p>
            </div>
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-semibold transition"
            >
              ❤️ <span>{obra.likes} Likes</span>
            </button>
          </div>

          <p className="text-gray-800 whitespace-pre-wrap mb-8">{obra.descripcion}</p>

          <hr className="mb-8" />

          {/* Sección de Comentarios */}
          <div>
            <h3 className="text-xl font-bold mb-4">Comentarios ({comentarios.length})</h3>
            
            <form onSubmit={handleComentar} className="mb-6 flex gap-2">
              <input 
                type="text" 
                placeholder="Escribe un comentario..." 
                className="flex-1 border border-gray-300 p-2 rounded-lg"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg font-bold">
                Publicar
              </button>
            </form>

            <div className="space-y-4">
              {comentarios.map((comentario: any) => (
                <div key={comentario.id_comentario} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-sm">{comentario.autor}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comentario.fecha_comentario).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comentario.contenido}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}