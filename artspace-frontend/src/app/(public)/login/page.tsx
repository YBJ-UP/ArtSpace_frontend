'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { correo, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      router.push(response.data.usuario.rol === 'admin' ? '/admin' : '/feed');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Elementos artísticos de fondo MUCHO más intensos */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Tarjeta con mayor transparencia para que el color del fondo traspase */}
        <div className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tight text-gray-900">Hola de nuevo</h2>
            <p className="text-gray-700 mt-2 font-medium">Ingresa a tu espacio creativo en ArtSpace</p>
          </div>
          
          {error && <p className="text-red-600 text-sm font-bold text-center mb-6 bg-red-100 py-3 rounded-xl border border-red-200">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1 ml-1">Correo electrónico</label>
              <input 
                type="email" 
                className="w-full px-5 py-3 rounded-2xl border border-white bg-white/70 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all outline-none shadow-sm"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1 ml-1">Contraseña</label>
              <input 
                type="password" 
                className="w-full px-5 py-3 rounded-2xl border border-white bg-white/70 text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all outline-none shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-4 mt-2 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transform hover:-translate-y-1 transition-all shadow-xl shadow-gray-900/20"
            >
              Entrar a mi cuenta
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-700 font-medium">
            ¿Aún no tienes cuenta? <Link href="/registro" className="text-purple-700 font-black hover:underline">Únete a la comunidad</Link>
          </p>
        </div>
      </div>
    </div>
  );
}