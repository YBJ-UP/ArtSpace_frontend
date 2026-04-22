import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-purple-100">
      {/* Hero Section con gradiente artístico */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
          {/* Círculos decorativos de fondo para el look "cool" */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900">
            ArtSpace
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Donde el <span className="text-indigo-600 font-semibold italic">arte</span> encuentra su 
            <span className="text-purple-600 font-semibold"> comunidad</span>. Crea, comparte y conecta con artistas de todo el mundo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/registro" 
              className="px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-purple-200"
            >
              Comienza a crear
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-white text-black border-2 border-black rounded-full font-bold text-lg hover:bg-gray-50 transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Sección de "Socializar + Arte" */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Exhibe tu Obra</h3>
            <p className="text-gray-600">Sube tus creaciones en alta calidad y construye tu portafolio digital en segundos.</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-purple-100 transition-all">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Conecta y Comenta</h3>
            <p className="text-gray-600">Interactúa con otros artistas, deja comentarios y forma parte de la conversación.</p>
          </div>

          <div className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all border-2 border-transparent hover:border-blue-50">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Crece tu Red</h3>
            <p className="text-gray-600">Sigue a tus artistas favoritos y mantente al tanto de las nuevas tendencias en tu feed.</p>
          </div>
        </div>
      </section>

      {/* Pie de página minimalista */}
      <footer className="py-10 border-t border-gray-100 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} ArtSpace. Todos los derechos reservados.
      </footer>
    </div>
  );
}