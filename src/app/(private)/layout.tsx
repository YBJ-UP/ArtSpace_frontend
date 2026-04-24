'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verificamos si existe el token en el navegador
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login'); // Expulsar si no hay token
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Evitamos renderizar la página privada si aún no verificamos la sesión
  if (!isAuthorized) return null; 

  const navLinks = [
    { name: 'Feed', href: '/feed' },
    { name: 'Explorar', href: '/explorar' },
    { name: 'Publicar Obra', href: '/obras/nueva' },
    { name: 'Mi Perfil', href: '/perfil' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de Navegación (Navbar) */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/feed" className="text-2xl font-bold text-black">ArtSpace</Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === link.href 
                        ? 'border-black text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal de cada página privada */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}