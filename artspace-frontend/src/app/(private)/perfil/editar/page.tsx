'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function EditarPerfilPage() {
  const [nombre, setNombre] = useState('');
  const [biografia, setBiografia] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cargamos los datos actuales para precargar el formulario
    api.get('/perfil').then((res) => {
      setNombre(res.data.nombre);
      setBiografia(res.data.biografia || '');
      setPreview(res.data.avatar);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('biografia', biografia);
    if (avatar) formData.append('avatar', avatar);

    try {
      await api.put('/perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Perfil actualizado');
      router.push('/perfil');
    } catch (error) {
      console.error('Error al actualizar perfil', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-bold mb-6">Editar Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-4">
            <img 
              src={preview || 'https://via.placeholder.com/150'} 
              className="w-32 h-32 rounded-full object-cover border mb-2"
              alt="Avatar preview"
            />
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if(e.target.files?.[0]) {
                  setAvatar(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Biografía</label>
            <textarea 
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              className="w-full border p-2 rounded-lg h-24"
              placeholder="Cuéntanos sobre ti..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}