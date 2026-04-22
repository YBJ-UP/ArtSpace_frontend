'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function NuevaObraPage() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      // Crear una URL temporal para mostrar la vista previa
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

    try {
      // El Content-Type "multipart/form-data" es crucial aquí
      await api.post('/obras', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Obra publicada exitosamente');
      router.push('/feed'); // Redirigir al feed tras publicar
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
          {/* Subida de Imagen y Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de la obra</label>
            {preview ? (
              <div className="mb-4 relative group">
                <img src={preview} alt="Vista previa" className="w-full max-h-96 object-cover rounded-lg border" />
                <button 
                  type="button"
                  onClick={() => { setImagen(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImagenChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">Formatos permitidos: JPG, PNG, WEBP. Máx 5MB.</p>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea 
              className="mt-1 w-full border border-gray-300 p-2 rounded-lg h-32"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

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