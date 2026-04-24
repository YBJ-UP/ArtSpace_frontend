'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

export default function EditarObraPage() {
  const { id } = useParams();
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  useEffect(() => {
    const fetchObra = async () => {
      try {
        const res = await api.get(`/obras/${id}`);
        setTitulo(res.data.titulo);
        setDescripcion(res.data.descripcion);
        setPreview(res.data.imagen || res.data.archivo || null);
      } catch (error) {
        console.error('Error al cargar la obra', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchObra();
  }, [id]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setGuardando(true);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen);

    try {
      await api.put(`/obras/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push(`/obras/${id}`);
    } catch (error) {
      alert('Error al actualizar la obra. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      await api.delete(`/obras/${id}`);
      router.push('/perfil');
    } catch (error) {
      alert('No se pudo eliminar la obra. Intenta de nuevo.');
      setEliminando(false);
      setConfirmarEliminar(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-40" />
        <div className="bg-white rounded-2xl p-8 border space-y-4">
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-5 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/obras/${id}`} className="text-gray-400 hover:text-gray-700 transition text-sm">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar obra</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Imagen
            </label>
            {preview && (
              <div className="mb-3 rounded-xl overflow-hidden border bg-gray-50 max-h-72 flex justify-center">
                <img src={preview} alt="Preview" className="max-h-72 object-contain" />
              </div>
            )}
            <label
              htmlFor="imagen-input"
              className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl text-sm text-gray-500 cursor-pointer transition"
            >
              📎 {imagen ? imagen.name : 'Subir nueva imagen (opcional)'}
            </label>
            <input
              id="imagen-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImagen(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

        {/* Zona de peligro */}
        <div className="border-t border-gray-100 pt-6">
          {!confirmarEliminar ? (
            <button
              onClick={() => setConfirmarEliminar(true)}
              className="w-full py-3 rounded-xl font-semibold text-sm border border-red-200 text-red-500 hover:bg-red-50 transition"
            >
              Eliminar obra
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
              <p className="text-sm text-red-700 font-medium text-center">
                ¿Estás segura? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmarEliminar(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminar}
                  disabled={eliminando}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                >
                  {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
