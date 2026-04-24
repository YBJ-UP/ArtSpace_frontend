'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

export default function RegistroPage() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/registro', { nombre, correo, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      router.push('/feed');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Elementos artísticos de fondo INTENSOS para el registro */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
      
      <div className="relative z-10 w-full max-w-lg p-6">
        {/* Tarjeta de cristal (Glassmorphism) igual que en el login */}
        <div className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[2.5rem] p-10">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Crea tu espacio</h2>
            <p className="text-gray-700 mt-2 font-medium">Forma parte de la comunidad de artistas</p>
          </div>

          {error && <p className="text-red-600 text-sm font-bold text-center mb-6 bg-red-100 py-3 rounded-xl border border-red-200">{error}</p>}

          <form onSubmit={handleRegistro} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1 ml-1">¿Cómo te llamas?</label>
              <input 
                type="text" 
                className="w-full px-5 py-3 rounded-2xl border border-white bg-white/70 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none shadow-sm"
                placeholder="Nombre artístico o real"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1 ml-1">Correo electrónico</label>
              <input 
                type="email" 
                className="w-full px-5 py-3 rounded-2xl border border-white bg-white/70 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none shadow-sm"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1 ml-1">Contraseña</label>
              <input 
                type="password" 
                className="w-full px-5 py-3 rounded-2xl border border-white bg-white/70 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all outline-none shadow-sm"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-4 mt-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transform hover:-translate-y-1 transition-all shadow-xl shadow-gray-900/20"
            >
              Empezar mi viaje
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-700 font-medium">
            ¿Ya eres miembro? <Link href="/login" className="text-blue-700 font-black hover:underline">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}