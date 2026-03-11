import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'

const STATS = [
  { value: '10+', label: 'Años de exp.' },
  { value: '100+', label: 'Clientes' },
  { value: 'Hindu', label: 'Rugby Club' },
  { value: '100%', label: 'Personalizado' },
]

function StatNumber({ value, active }) {
  const display = useCountUp(value, 1400, active)
  return <p className="text-4xl font-black text-white leading-none tabular-nums">{display}</p>
}

export default function Hero() {
  const [statsRef, statsInView] = useInView(0.3)

  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Background video ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src="/hero-bg.mp4"
      />

      {/* Video dark overlay — keeps text legible */}
      <div className="absolute inset-0 bg-zinc-950/72 z-10" />

      {/* Grid pattern over video */}
      <div className="absolute inset-0 hero-grid z-10" />

      {/* Cyan glow — top left (animated) */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-700/18 rounded-full blur-3xl pointer-events-none float-slow z-20" />
      {/* Cyan glow — center right (animated, offset phase) */}
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-cyan-900/12 rounded-full blur-3xl pointer-events-none float-slow z-20" style={{ animationDelay: '-4s' }} />
      {/* Subtle warm accent — bottom */}
      <div className="absolute bottom-10 left-1/3 w-56 h-56 bg-cyan-950/30 rounded-full blur-3xl pointer-events-none float-slow z-20" style={{ animationDelay: '-2s' }} />

      {/* Vertical accent line — right edge */}
      <div className="absolute top-0 right-24 w-px h-full bg-gradient-to-b from-transparent via-cyan-800/30 to-transparent hidden lg:block z-20" />

      {/* Corner bracket — top left */}
      <div className="absolute top-20 left-6 hidden lg:block z-20">
        <div className="w-6 h-px bg-cyan-700/50" />
        <div className="w-px h-6 bg-cyan-700/50 mt-0" />
      </div>
      <div className="absolute bottom-20 right-28 hidden lg:block z-20">
        <div className="w-6 h-px bg-cyan-700/30 ml-auto" />
        <div className="w-px h-6 bg-cyan-700/30 ml-auto" />
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 py-36 w-full">
        <div className="max-w-3xl">

          {/* Available status badge */}
          <div className="inline-flex items-center gap-2.5 bg-zinc-900/70 backdrop-blur-sm border border-zinc-800 rounded-full px-4 py-2 mb-8 anim-fade-up" style={{ animationDelay: '0.1s' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-zinc-300 text-xs font-semibold uppercase tracking-widest">Aceptando nuevos clientes</span>
          </div>

          {/* Label */}
          <div className="flex items-center gap-3 mb-8 anim-fade-up" style={{ animationDelay: '0.25s' }}>
            <div className="w-10 h-px bg-cyan-600" />
            <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">
              Personal Trainer · Buenos Aires
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tight mb-8 anim-fade-up" style={{ animationDelay: '0.4s' }}>
            <span className="text-white block">Entrenamiento</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              sin límites
            </span>
          </h1>

          {/* Sub */}
          <p className="text-zinc-300 text-lg md:text-xl max-w-xl leading-relaxed mb-12 anim-fade-up" style={{ animationDelay: '0.55s' }}>
            Metodología de alto rendimiento con la disciplina del rugby de élite.
            Planes personalizados para que alcancés tus objetivos reales.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-20 anim-fade-up" style={{ animationDelay: '0.7s' }}>
            <a
              href="#planes"
              className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-950/60 hover:shadow-cyan-900/60 hover:-translate-y-0.5"
            >
              Ver planes
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-cyan-200">
                <path d="M1 7h12M8 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="#metodo"
              className="inline-flex items-center gap-2 border border-zinc-700 hover:border-cyan-700 text-zinc-300 hover:text-cyan-300 font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 backdrop-blur-sm bg-zinc-950/30"
            >
              Cómo funciona
            </a>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 gap-5 sm:flex sm:items-center sm:gap-0 sm:flex-wrap anim-fade-up" style={{ animationDelay: '0.85s' }}>
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <div className="sm:pr-8">
                  <StatNumber value={stat.value} active={statsInView} />
                  <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mt-1.5">{stat.label}</p>
                </div>
                {i < STATS.length - 1 && (
                  <div className="hidden sm:flex w-px h-10 bg-zinc-700 sm:mr-8 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
        <span className="text-zinc-600 text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="bounce-slow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-cyan-700">
            <path d="M3 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-30" />
    </section>
  )
}
