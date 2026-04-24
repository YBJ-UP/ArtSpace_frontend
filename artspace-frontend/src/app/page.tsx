import Link from 'next/link';
import styles from './page.module.css';
export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Burbujas de fondo */}
      <div className={`${styles.bubble} ${styles.bubblePurple}`}></div>
      <div className={`${styles.bubble} ${styles.bubbleCyan}`}></div>
      <div className={`${styles.bubble} ${styles.bubbleBlue}`}></div>
      <div className={`${styles.bubble} ${styles.bubblePink}`}></div>

      {/* Contenido Frontend */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-7xl mx-auto px-6 py-20 w-full">
        
        <div className={`${styles.glassHero} p-12 md:p-20 text-center w-full mb-12`}>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
            ArtSpace
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-10 max-w-3xl mx-auto leading-relaxed">
            Donde el arte encuentra su comunidad. Crea tu portafolio, descubre nuevas tendencias y conecta con artistas de todo el mundo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/registro" className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg w-full sm:w-auto">
              Comienza a crear
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white/80 text-gray-900 border border-white rounded-2xl font-bold text-lg w-full sm:w-auto">
              Iniciar sesión
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full">
          <div className={`${styles.glassFeature} p-8`}>
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-2xl font-black mb-2">Exhibe tu Obra</h3>
            <p className="font-medium">Sube tus creaciones en alta calidad y construye tu portafolio digital en segundos.</p>
          </div>
          <div className={`${styles.glassFeature} p-8`}>
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-2xl font-black mb-2">Conecta</h3>
            <p className="font-medium">Interactúa con otros artistas, deja comentarios y forma parte de la conversación.</p>
          </div>
          <div className={`${styles.glassFeature} p-8`}>
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-black mb-2">Crece tu Red</h3>
            <p className="font-medium">Sigue a tus artistas favoritos y mantente al tanto de las nuevas tendencias en tu feed.</p>
          </div>
        </div>
      </div>

      <footer className={`${styles.glassFooter} relative z-10 py-6 text-center font-medium text-sm`}>
        &copy; {new Date().getFullYear()} ArtSpace. Todos los derechos reservados.
      </footer>
    </div>
  );
}