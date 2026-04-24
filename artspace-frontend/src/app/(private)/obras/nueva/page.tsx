'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function NuevaObraPage() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    api.get('/obras/categorias').then((res) => {
      setCategorias(res.data);
    }).catch(() => {});
  }, []);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!imagen) {
      setError('Por favor, selecciona una imagen.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('imagen', imagen);
    if (subcategoriaSeleccionada) {
      formData.append('subcategorias', JSON.stringify([parseInt(subcategoriaSeleccionada)]));
    }

    try {
      await api.post('/obras', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/feed');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocurrió un error al subir la obra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-6">Publicar Nueva Obra</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la obra
            </label>
            {preview ? (
              <div className="mb-4 relative group">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full max-h-96 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => { setImagen(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImagenChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">JPG, PNG o WEBP · Máx 5MB</p>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 p-2 rounded-lg"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              className="mt-1 w-full border border-gray-300 p-2 rounded-lg h-32"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          {/* Categorías */}
          {categorias.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={subcategoriaSeleccionada}
                onChange={(e) => setSubcategoriaSeleccionada(e.target.value)}
              >
                <option value="">Sin categoría</option>
                {categorias.map((cat) => (
                  <optgroup key={cat.id_categoria} label={cat.nombre}>
                    {cat.subcategorias?.map((sub: any) => (
                      <option key={sub.id_subcategoria} value={sub.id_subcategoria}>
                        {sub.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg text-white transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {loading ? 'Subiendo obra...' : 'Publicar Obra'}
          </button>
        </form>
      </div>
    </div>
  );
}
