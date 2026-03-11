import { useState, useEffect } from 'react'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'
import BarraDeNavegacion from '../components/BarraDeNavegacion'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Reviews from '../components/Reviews'
import PricingCard from '../components/PricingCard'
import Footer from '../components/Footer'
import VideoHighlights from '../components/VideoHighlights'
import FAQ from '../components/FAQ'
import { WHATSAPP } from '../lib/constants'

/* ── Ticker items ── */
const TICKER = [
  'Rendimiento', 'Disciplina', 'Constancia', 'Fuerza',
  'Resultados', 'Rugby', 'Superación', 'Dedicación',
  'Entrenamiento', 'Metodología', 'Hindu Club', 'Alto rendimiento',
]

/* ── Planes ── */
const PLANS = [
  {
    name: 'Mensual',
    price: '60.000',
    period: 'mes',
    pricePerMonth: null,
    featured: false,
    badge: null,
    badgeColor: null,
    savings: null,
    features: [
      'Programa de entrenamiento personalizado',
      'Seguimiento semanal de progreso',
      'Acceso a rutinas y videos online',
      'Soporte por WhatsApp',
      'Ajuste de plan mensual',
    ],
    cta: 'Empezar ahora',
  },
  {
    name: 'Semestral',
    price: '330.000',
    period: '6 meses',
    pricePerMonth: '55.000',
    featured: false,
    badge: 'Más popular',
    badgeColor: 'amber',
    savings: '30.000',
    features: [
      'Programa de entrenamiento personalizado',
      'Seguimiento semanal de progreso',
      'Acceso a rutinas y videos online',
      'Soporte por WhatsApp',
      'Ajuste de plan mensual',
      'Evaluación física al inicio y al cierre',
    ],
    cta: 'Empezar ahora',
  },
  {
    name: 'Anual',
    price: '600.000',
    period: 'año',
    pricePerMonth: '50.000',
    featured: true,
    badge: '2 meses gratis',
    badgeColor: 'red',
    savings: '120.000',
    features: [
      'Programa de entrenamiento personalizado',
      'Seguimiento semanal de progreso',
      'Acceso a rutinas y videos online',
      'Soporte por WhatsApp',
      'Ajuste de plan mensual',
      'Evaluación física cada 3 meses',
      'Prioridad en consultas y turnos',
    ],
    cta: 'Activar plan anual',
  },
]

/* ── About stats ── */
const ABOUT_STATS = [
  { value: '10+',  label: 'Años de experiencia' },
  { value: '100+', label: 'Clientes activos' },
  { value: 'Hindu', label: 'Rugby Club' },
  { value: '4.9★', label: 'Valoración promedio' },
]

/* ── Animated stat number (avoids hooks inside .map()) ── */
function StatNumber({ value, active }) {
  const display = useCountUp(value, 1400, active)
  return <p className="text-2xl font-black text-white leading-none mb-1">{display}</p>
}

/* ── Section label component ── */
function SectionLabel({ text }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-px bg-cyan-600" />
      <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">{text}</span>
    </div>
  )
}

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [aboutRef, aboutInView] = useInView(0.1)
  const [pricingRef, pricingInView] = useInView(0.05)

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('mateo_auth') === 'true')
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <BarraDeNavegacion />

      {/* ── 1. HERO ── */}
      <Hero />

      {/* ── TICKER STRIP ── */}
      <div className="border-y border-zinc-800/70 py-3 overflow-hidden bg-zinc-950 relative select-none">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="flex whitespace-nowrap animate-marquee">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-5 mx-4">
              <span className="text-zinc-700 text-[11px] font-black uppercase tracking-[0.25em]">{item}</span>
              <span className="text-cyan-900 text-xs">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── 2. SOBRE MATEO ── */}
      <section id="sobre-mi" className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={aboutRef} className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Photo column */}
            <div className={`relative ${aboutInView ? 'anim-fade-left' : 'opacity-0'}`}>
              {/* Decorative glow behind photo */}
              <div className="absolute -inset-4 bg-cyan-900/10 rounded-3xl blur-2xl pointer-events-none" />

              <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                {/* Real photo — add file to /public/mateo.jpg */}
                <img
                  src="/mateo.jpg"
                  alt="Mateo Monente — Personal Trainer"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                {/* Placeholder shown when no photo */}
                <div className="absolute inset-0 hero-grid opacity-40" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-700 via-cyan-500 to-cyan-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                </div>
                {/* Hindu colors corner */}
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-red-700" />
                </div>
                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950/70 to-transparent" />
              </div>
            </div>

            {/* Text column */}
            <div className={aboutInView ? 'anim-fade-right' : 'opacity-0'} style={{ animationDelay: '0.15s' }}>
              <SectionLabel text="Sobre Mateo" />
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-6">
                De la cancha<br />
                <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  al gym
                </span>
              </h2>

              <p className="text-zinc-300 leading-relaxed mb-4">
                Soy <span className="text-white font-bold">Mateo Monente</span>, coach en centro
                de alto rendimiento y jugador del plantel superior en{' '}
                <span className="text-cyan-400 font-bold">Hindú Club</span>.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-4">
                El rugby me enseñó esfuerzo, compromiso y trabajo en equipo.
                Todo eso lo aplico en mis entrenamientos: sin excusas, sin atajos.
              </p>
              <p className="text-zinc-500 leading-relaxed mb-10">
                Acompaño a personas a superar sus límites con planes personalizados,
                seguimiento constante y la motivación que da saber que el proceso funciona.
              </p>

              {/* Why me */}
              <div className="border-t border-zinc-800 pt-8">
                <p className="text-zinc-500 text-xs uppercase tracking-widest mb-5 font-semibold">¿Por qué elegirme?</p>
                <ul className="space-y-3">
                  {[
                    'Planes totalmente adaptados a tus objetivos y disponibilidad',
                    'Seguimiento integral: físico, técnico y motivacional',
                    'Clases dinámicas con metodología de alto rendimiento',
                    'Experiencia real en competición y entrenamiento de élite',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-cyan-500 font-black text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-zinc-300 text-sm leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-3 mt-10">
                {ABOUT_STATS.map((s) => (
                  <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-cyan-900/60 transition-colors">
                    <StatNumber value={s.value} active={aboutInView} />
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. VIDEO HIGHLIGHTS ── */}
      <div className="border-t border-zinc-900/60">
        <VideoHighlights />
      </div>

      {/* ── 4. MÉTODO ── */}
      <div className="border-t border-zinc-900/60">
        <HowItWorks />
      </div>

      {/* ── CTA STRIP ── */}
      <div className="border-y border-cyan-900/40 bg-gradient-to-r from-cyan-950/40 via-zinc-950 to-zinc-950 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-black text-xl uppercase tracking-tight">¿Listo para dar el primer paso?</p>
            <p className="text-zinc-500 text-sm mt-1">Sin contratos. Sin letras chicas. Solo resultados.</p>
          </div>
          <a href="#planes" className="flex-shrink-0 inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-sm px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-950/60">
            Ver planes →
          </a>
        </div>
      </div>

      {/* ── 5. PLANES Y PRECIOS ── */}
      <section id="planes" className="bg-zinc-950 py-28 border-t border-zinc-900/60" ref={pricingRef}>
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className={`mb-16 ${pricingInView ? 'anim-fade-up' : 'opacity-0'}`}>
            <SectionLabel text="Invertí en vos" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">
                  Planes y precios
                </h2>
                <p className="text-zinc-500 mt-4 text-base max-w-lg">
                  Sin contratos, sin letras chicas. Elegí el plan que se adapta a tu objetivo
                  y coordinamos el inicio directo con Mateo.
                </p>
              </div>
              {/* Highlight pill */}
              <div className="flex-shrink-0 flex items-center gap-2 bg-cyan-950/50 border border-cyan-900/50 rounded-xl px-5 py-3">
                <span className="text-cyan-400 text-lg">★</span>
                <div>
                  <p className="text-cyan-400 font-bold text-sm leading-tight">Plan anual: 2 meses gratis</p>
                  <p className="text-cyan-700 text-xs">Pagás 10, entrenás 12</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3-column card grid */}
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={pricingInView ? 'anim-fade-up' : 'opacity-0'}
                style={{ animationDelay: pricingInView ? `${0.15 + i * 0.15}s` : undefined }}
              >
                <PricingCard {...plan} isLoggedIn={isLoggedIn} />
              </div>
            ))}
          </div>

          <p className="text-zinc-700 text-xs mt-8 uppercase tracking-wider">
            Precios en pesos argentinos · Pagos coordinados directamente con Mateo
          </p>
        </div>
      </section>

      {/* ── 6. RESEÑAS ── */}
      <Reviews />

      {/* ── 7. FAQ ── */}
      <FAQ />

      {/* ── CLOSING CTA ── */}
      <section className="bg-zinc-950 border-t border-zinc-900/60 py-28 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-5 justify-center">
            <div className="w-10 h-px bg-cyan-600" />
            <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">Empezá hoy</span>
            <div className="w-10 h-px bg-cyan-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
            Transformá tu<br />
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">entrenamiento</span>
          </h2>
          <p className="text-zinc-400 text-base mb-10 max-w-md mx-auto">
            Coordinamos el inicio directamente. El primer paso es el más importante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#planes" className="inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-950/60 hover:-translate-y-0.5">
              Ver planes
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-cyan-700 text-zinc-300 hover:text-cyan-300 font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5"
            >
              Escribime por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── FLOATING WHATSAPP FAB ── */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribime por WhatsApp"
          className="fab-pulse flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/30 hover:scale-110 transition-transform duration-200"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        {/* Tooltip — desktop only */}
        <span className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Escribime por WhatsApp
        </span>
      </div>
    </div>
  )
}
