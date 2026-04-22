import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Bienvenido a ArtSpace</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Descubre, comparte y conecta a través del arte. Únete a nuestra comunidad de artistas y amantes de la creatividad.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Iniciar Sesión
        </Link>
        <Link 
          href="/registro" 
          className="bg-white text-black border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Registrarse
        </Link>
      </div>

      {}
    </div>
  );
}