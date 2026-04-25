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
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comentando, setComentando] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<any>(null);
  const [respondiendoA, setRespondiendoA] = useState<number | null>(null);
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setUsuarioActual(JSON.parse(user));
  }, []);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const resObra = await api.get(`/obras/${idObra}`);
        setObra(resObra.data);
        setComentarios(resObra.data.comentarios || []);
        setLiked(resObra.data.usuario_ya_dio_like ?? false);
      } catch (error) {
        console.error('Error al cargar la obra', error);
      } finally {
        setLoading(false);
      }
    };
    if (idObra) fetchDetalles();
  }, [idObra]);

  const handleLike = async () => {
    const nuevoLiked = !liked;
    const nuevoContador = (obra?.likes ?? 0) + (nuevoLiked ? 1 : -1);

    // Optimistic update: actualiza UI antes de esperar al servidor
    setLiked(nuevoLiked);
    setObra((prev: any) => ({ ...prev, likes: Math.max(0, nuevoContador) }));

    try {
      if (nuevoLiked) {
        await api.post(`/obras/${idObra}/likes`);
      } else {
        await api.delete(`/obras/${idObra}/likes`);
      }
    } catch {
      // Revertir si falla
      setLiked(liked);
      setObra((prev: any) => ({ ...prev, likes: obra?.likes }));
    }
  };

  const handleComentar = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setComentando(true);
    try {
      await api.post(`/obras/${idObra}/comentarios`, { contenido: nuevoComentario });
      setNuevoComentario('');
      const resObra = await api.get(`/obras/${idObra}`);
      setComentarios(resObra.data.comentarios || []);
    } catch (error) {
      console.error('Error al publicar comentario', error);
    } finally {
      setComentando(false);
    }
  };

  const handleEliminarComentario = async (idComentario: number) => {
    if (!confirm('¿Eliminar este comentario?')) return;
    try {
      await api.delete(`/comentarios/${idComentario}`);
      setComentarios((prev) => prev.filter((c) => c.id_comentario !== idComentario));
    } catch (error) {
      console.error('Error al eliminar comentario', error);
    }
  };

  const handleResponder = async (idComentario: number) => {
    if (!textoRespuesta.trim()) return;
    setEnviandoRespuesta(true);
    try {
      await api.post(`/obras/${idObra}/comentarios/${idComentario}/respuestas`, { contenido: textoRespuesta });
      setTextoRespuesta('');
      setRespondiendoA(null);
      const resObra = await api.get(`/obras/${idObra}`);
      setComentarios(resObra.data.comentarios || []);
    } catch (error) {
      console.error('Error al responder comentario', error);
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const esDelUsuario = (idUsuarioRecurso: any) =>
    Number(usuarioActual?.id_usuario) === Number(idUsuarioRecurso);

  const getImageUrl = (url: string) => {
    if (!url) return 'https://placehold.co/800x600?text=Sin+Imagen';
    if (url.startsWith('http')) return url;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://artspacebackend-production.up.railway.app';
    return `${base}${url.startsWith('/') ? url : '/' + url}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4 animate-pulse space-y-4">
        <div className="h-96 bg-gray-200 rounded-xl" />
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  if (!obra) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-gray-500">
        <p className="text-5xl mb-4">🖼️</p>
        <p className="text-xl font-semibold">Obra no encontrada</p>
      </div>
    );
  }

  const esAutor = usuarioActual?.id_usuario === obra.id_usuario;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        {/* Imagen principal */}
        <div className="bg-gray-950 flex justify-center max-h-[75vh] overflow-hidden">
          <img
            src={getImageUrl(obra.imagen || obra.archivo)}
            alt={obra.titulo}
            className="max-h-[75vh] object-contain w-full"
          />
        </div>

        <div className="p-6 md:p-8">

          {/* Encabezado: título, autor, acciones */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{obra.titulo}</h1>
              <p className="text-gray-500 text-sm">
                Por{' '}
                <Link href={`/usuario/${obra.id_usuario}`} className="font-semibold text-gray-800 hover:underline">
                  {obra.autor}
                </Link>
                {obra.categoria && (
                  <>
                    {' '}·{' '}
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{obra.categoria}</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {esAutor && (
                <Link
                  href={`/obras/${obra.id_obra}/editar`}
                  className="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Editar
                </Link>
              )}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition border ${
                  liked
                    ? 'bg-rose-50 border-rose-300 text-rose-600 hover:bg-rose-100'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {liked ? '❤️' : '🤍'}
                <span>{obra.likes}</span>
              </button>
            </div>
          </div>

          {/* Descripción */}
          {obra.descripcion && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">{obra.descripcion}</p>
          )}

          <hr className="border-gray-100 mb-8" />

          {/* Sección de comentarios */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-5">
              Comentarios <span className="text-gray-400 font-normal">({comentarios.length})</span>
            </h3>

            {/* Formulario nuevo comentario */}
            <form onSubmit={handleComentar} className="flex gap-3 mb-8">
              <input
                type="text"
                placeholder="Escribe un comentario..."
                className="flex-1 border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                disabled={comentando}
              />
              <button
                type="submit"
                disabled={comentando || !nuevoComentario.trim()}
                className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {comentando ? '...' : 'Publicar'}
              </button>
            </form>

            {/* Lista de comentarios */}
            {comentarios.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-3xl mb-2">💬</p>
                <p className="text-sm">Sé el primero en comentar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comentarios.map((comentario: any) => (
                  <div key={comentario.id_comentario} className="bg-gray-50 rounded-xl p-4">
                    {/* Comentario principal */}
                    <div className="group flex gap-3">
                      <img
                        src={comentario.autor_avatar || 'https://placehold.co/40x40?text=U'}
                        alt={comentario.autor}
                        className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-semibold text-sm text-gray-900">{comentario.autor}</span>
                          <span className="text-xs text-gray-400 shrink-0">
                            {new Date(comentario.fecha).toLocaleDateString('es-MX', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{comentario.contenido}</p>
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={() => {
                              setRespondiendoA(respondiendoA === comentario.id_comentario ? null : comentario.id_comentario);
                              setTextoRespuesta('');
                            }}
                            className="text-xs text-gray-400 hover:text-gray-700 transition"
                          >
                            Responder
                          </button>
                          {esDelUsuario(comentario.id_usuario) && (
                            <button
                              onClick={() => handleEliminarComentario(comentario.id_comentario)}
                              className="text-xs text-gray-400 hover:text-rose-500 transition"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Respuestas existentes */}
                    {comentario.respuestas?.length > 0 && (
                      <div className="ml-12 mt-3 space-y-3">
                        {comentario.respuestas.map((respuesta: any) => (
                          <div key={respuesta.id_respuesta} className="flex gap-2">
                            <img
                              src={respuesta.avatar || 'https://placehold.co/32x32?text=U'}
                              alt={respuesta.autor}
                              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-xs text-gray-900">{respuesta.autor} </span>
                              <span className="text-xs text-gray-700">{respuesta.contenido}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input de respuesta */}
                    {respondiendoA === comentario.id_comentario && (
                      <div className="ml-12 mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Escribe una respuesta..."
                          className="flex-1 border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                          value={textoRespuesta}
                          onChange={(e) => setTextoRespuesta(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleResponder(comentario.id_comentario)}
                          autoFocus
                          disabled={enviandoRespuesta}
                        />
                        <button
                          onClick={() => handleResponder(comentario.id_comentario)}
                          disabled={enviandoRespuesta || !textoRespuesta.trim()}
                          className="bg-black text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition disabled:opacity-40"
                        >
                          {enviandoRespuesta ? '...' : 'Enviar'}
                        </button>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
