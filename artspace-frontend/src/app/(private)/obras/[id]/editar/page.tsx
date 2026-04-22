'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api';

export default function EditarObraPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos actuales de la obra
  useEffect(() => {
    const fetchObra = async () => {
      try {
        const res = await api.get(`/obras/${id}`);
        setTitulo(res.data.titulo);
        setDescripcion(res.data.descripcion);
        setPreview(res.data.imagen); // Imagen actual
      } catch (error) {
        console.error('Error al cargar la obra', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchObra();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (imagen) formData.append('imagen', imagen); // Solo si sube una nueva

    try {
      await api.put(`/obras/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Obra actualizada con éxito');
      router.push(`/obras/${id}`);
    } catch (error) {
      alert('Error al actualizar la obra');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10">Cargando datos...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-6">Editar Obra</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium mb-2">Imagen actual (Sube una nueva para cambiarla)</label>
            <div className="mb-4 relative group">
              <img src={preview || ''} alt="Preview" className="w-full max-h-96 object-cover rounded-lg border" />
            </div>
            <input 
              type="file" accept="image/jpeg, image/png, image/webp"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImagen(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Título</label>
            <input 
              type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 w-full border p-2 rounded-lg" required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea 
              value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 w-full border p-2 rounded-lg h-32" required
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white font-bold py-3 rounded-lg">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}