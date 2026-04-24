'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

export default function EditarPerfilPage() {
  const [nombre, setNombre] = useState('');
  const [biografia, setBiografia] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);
  const router = useRouter();

  useEffect(() => {
    api.get('/usuarios/me').then((res) => {
      setNombre(res.data.nombre);
      setBiografia(res.data.biografia || '');
      setPreview(res.data.avatar || null);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setGuardando(true);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('biografia', biografia);
    if (avatar) formData.append('avatar', avatar);

    try {
      await api.put('/usuarios/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExito(true);
      setTimeout(() => router.push('/perfil'), 1200);
    } catch (error) {
      console.error('Error al actualizar perfil', error);
      alert('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="bg-white rounded-2xl p-8 border space-y-4">
          <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto" />
          <div className="h-5 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/perfil" className="text-gray-400 hover:text-gray-700 transition text-sm">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar perfil</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={preview || 'https://placehold.co/150x150?text=U'}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-100"
              />
              <label
                htmlFor="avatar-input"
                className="absolute bottom-0 right-0 bg-black text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-gray-800 transition"
              >
                Cambiar
              </label>
            </div>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setAvatar(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            <p className="text-xs text-gray-400">JPG, PNG o WEBP · Máx. 5MB</p>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              required
              placeholder="Tu nombre artístico"
            />
          </div>

          {/* Biografía */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Biografía</label>
            <textarea
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 px-4 py-2.5 rounded-xl text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              placeholder="Cuéntanos sobre ti y tu arte..."
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{biografia.length}/300</p>
          </div>

          {/* Botón guardar */}
          <button
            type="submit"
            disabled={guardando || exito}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
              exito
                ? 'bg-green-500 text-white'
                : 'bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {exito ? '✓ Guardado' : guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}
