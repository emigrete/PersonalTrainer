const REVIEWS = [
  {
    name: 'Facundo R.',
    role: 'Deportista amateur',
    initials: 'FR',
    avatarClass: 'bg-cyan-900 border-cyan-800',
    rating: 5,
    text: 'Entrené con Mateo 6 meses y los resultados superaron mis expectativas. La metodología es seria, el seguimiento constante y los resultados son reales. Lo recomiendo sin dudas.',
  },
  {
    name: 'Santiago M.',
    role: 'Ex jugador de rugby',
    initials: 'SM',
    avatarClass: 'bg-zinc-700 border-zinc-600',
    rating: 5,
    text: 'Cuando dejé el rugby necesitaba mantener el nivel físico. Mateo armó un plan perfecto para mi transición al gym. Entiende el mundo del deporte como pocos entrenadores.',
  },
  {
    name: 'Valentina G.',
    role: 'Corredora recreativa',
    initials: 'VG',
    avatarClass: 'bg-cyan-800 border-cyan-700',
    rating: 5,
    text: 'Empecé de cero y en cuatro meses ya estoy corriendo 10k. El seguimiento semanal hace toda la diferencia. Muy profesional y siempre disponible para responder dudas.',
  },
  {
    name: 'Tomás B.',
    role: 'Estudiante universitario',
    initials: 'TB',
    avatarClass: 'bg-zinc-800 border-zinc-700',
    rating: 5,
    text: 'Con poco tiempo libre y el plan de Mateo pude transformar mi físico sin morir en el intento. La organización del plan es impecable y los ajustes semanales marcan la diferencia.',
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-cyan-500 text-sm">★</span>
      ))}
    </div>
  )
}

import { useInView } from '../hooks/useInView'

export default function Reviews() {
  const [ref, inView] = useInView(0.1)

  return (
    <section id="resenas" className="bg-zinc-950 py-28 border-t border-zinc-900/60" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6 ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-cyan-600" />
              <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">Lo que dicen</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
              Reseñas
            </h2>
            <p className="text-zinc-500 mt-4 text-base">
              Resultados reales de personas reales.
            </p>
          </div>

          {/* Aggregate badge */}
          <div className="flex-shrink-0">
            <div className="inline-flex flex-col items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4">
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-cyan-500 text-lg">★</span>
                ))}
              </div>
              <span className="text-white font-black text-2xl leading-none">5.0</span>
              <span className="text-zinc-600 text-xs mt-1 uppercase tracking-wider">+50 reseñas</span>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {REVIEWS.map((review, i) => (
            <div
              key={review.name}
              className={`group bg-zinc-900 border border-zinc-800 rounded-2xl p-7 flex flex-col gap-5 hover:border-cyan-900/60 transition-colors duration-300 ${inView ? 'anim-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: inView ? `${0.15 + i * 0.12}s` : undefined }}
            >
              <Stars count={review.rating} />

              <p className="text-zinc-200 text-sm leading-relaxed flex-1">
                «{review.text}»
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${review.avatarClass}`}>
                  <span className="text-xs font-black text-white">{review.initials}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{review.name}</p>
                  <p className="text-zinc-600 text-xs uppercase tracking-wider mt-0.5">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#"
            className="text-zinc-500 hover:text-cyan-400 text-sm font-semibold uppercase tracking-widest transition-colors"
          >
            Ver todas las reseñas →
          </a>
        </div>
      </div>
    </section>
  )
}
