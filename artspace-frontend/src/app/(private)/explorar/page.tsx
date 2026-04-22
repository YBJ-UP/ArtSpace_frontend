'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';

export default function ExplorarPage() {
  const [obras, setObras] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');

  const cargarObras = async () => {
    const res = await api.get(`/obras?busqueda=${busqueda}&categoria=${categoria}`);
    setObras(res.data);
  };

  useEffect(() => { cargarObras(); }, [categoria]);

  // Asegura que las imágenes relativas apunten al backend o muestra una imagen por defecto
  const getImageUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/400?text=Sin+Imagen';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'https://artspacebackend-production.up.railway.app';
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Explorar Arte</h1>
        <div className="flex w-full md:w-auto gap-2">
          <input 
            type="text" 
            placeholder="Buscar obra o artista..." 
            className="border p-2 rounded-lg flex-1 md:w-64"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button onClick={cargarObras} className="bg-black text-white px-4 rounded-lg">Buscar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {obras.map((obra: any) => (
          <Link href={`/obras/${obra.id_obra}`} key={obra.id_obra} className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition">
            <img src={getImageUrl(obra.imagen || obra.archivo)} className="w-full h-48 object-cover rounded-md mb-2" alt={obra.titulo} />
            <h3 className="font-bold truncate">{obra.titulo}</h3>
            <p className="text-sm text-gray-500">Por {obra.autor}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}