'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import api from '@/services/api';
import Link from 'next/link';

const PAGE_SIZE = 20;

export default function ExplorarPage() {
  const [obras, setObras] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api.get('/obras/categorias').then((res) => {
      setCategorias(res.data);
    }).catch(() => {});
  }, []);

  const cargarObras = useCallback(async (nuevaBusqueda: string, nuevaCategoria: string, nuevaPagina: number, acumular: boolean) => {
    if (nuevaPagina === 1) setLoadingInit(true);
    else setLoadingMore(true);
    setError('');

    try {
      const res = await api.get('/obras', {
        params: {
          busqueda: nuevaBusqueda || undefined,
          categoria: nuevaCategoria || undefined,
          page: nuevaPagina,
          limit: PAGE_SIZE,
        },
      });
      const data: any[] = Array.isArray(res.data) ? res.data : res.data.obras ?? [];
      setObras((prev) => acumular ? [...prev, ...data] : data);
      setHasMore(data.length === PAGE_SIZE);
    } catch {
      setError('No se pudieron cargar las obras. Intenta de nuevo.');
    } finally {
      setLoadingInit(false);
      setLoadingMore(false);
    }
  }, []);

  // Carga inicial y cuando cambia categoría
  useEffect(() => {
    setPage(1);
    cargarObras(busqueda, categoria, 1, false);
  }, [categoria]);

  // Debounce para búsqueda en tiempo real
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      cargarObras(busqueda, categoria, 1, false);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [busqueda]);

  const cargarMas = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    cargarObras(busqueda, categoria, nextPage, true);
  };

  const getImageUrl = (url: string) => {
    if (!url) return 'https://placehold.co/400x400?text=Sin+Imagen';
    if (url.startsWith('http')) return url;
    const base = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://artspacebackend-production.up.railway.app';
    return `${base}${url.startsWith('/') ? url : '/' + url}`;
  };

  const opcionesCategorias = categorias.flatMap((cat) =>
    (cat.subcategorias ?? []).map((sub: any) => ({
      value: String(sub.id_subcategoria),
      label: `${cat.nombre} — ${sub.nombre}`,
    }))
  );

  return (
    <div className="py-6">
      {/* Cabecera con búsqueda y filtros */}
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Explorar Arte</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar obra o artista..."
            className="border border-gray-300 p-2.5 rounded-lg flex-1"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {opcionesCategorias.length > 0 && (
            <select
              className="border border-gray-300 p-2.5 rounded-lg sm:w-56"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {opcionesCategorias.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => cargarObras(busqueda, categoria, 1, false)}
            className="text-sm font-semibold underline ml-4"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Skeleton de carga inicial */}
      {loadingInit ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-3 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-md mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : obras.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No se encontraron obras</p>
          {(busqueda || categoria) && (
            <button
              onClick={() => { setBusqueda(''); setCategoria(''); }}
              className="mt-4 text-sm text-black underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {obras.map((obra: any) => (
              <Link
                href={`/obras/${obra.id_obra}`}
                key={obra.id_obra}
                className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition"
              >
                <img
                  src={getImageUrl(obra.imagen || obra.archivo)}
                  className="w-full h-48 object-cover rounded-md mb-2"
                  alt={obra.titulo}
                />
                <h3 className="font-bold truncate">{obra.titulo}</h3>
                <p className="text-sm text-gray-500">Por {obra.autor}</p>
              </Link>
            ))}
          </div>

          {/* Botón cargar más */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={cargarMas}
                disabled={loadingMore}
                className={`px-8 py-3 rounded-xl font-semibold text-sm border transition ${
                  loadingMore
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {loadingMore ? 'Cargando...' : 'Cargar más'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
