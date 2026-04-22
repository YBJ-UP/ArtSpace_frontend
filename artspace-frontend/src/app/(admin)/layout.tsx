'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Asumimos que guardaste el string completo del usuario al hacer login
    const userString = localStorage.getItem('user'); 
    
    if (!token || !userString) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (user.rol !== 'admin') {
        router.push('/feed'); // Expulsar al feed si no es admin
      } else {
        setIsAuthorized(true);
      }
    } catch (e) {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthorized) return null;

  const menuItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Gestión de Usuarios', href: '/admin/usuarios' },
    { name: 'Gestión de Obras', href: '/admin/obras' },
    { name: 'Categorías', href: '/admin/categorias' },
    { name: 'Comentarios', href: '/admin/comentarios' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar de Administración */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">ArtSpace Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                pathname === item.href ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/feed" className="block text-center text-sm text-gray-400 hover:text-white transition">
            ← Volver a la App
          </Link>
        </div>
      </aside>

      {/* Contenido Principal Admin */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}