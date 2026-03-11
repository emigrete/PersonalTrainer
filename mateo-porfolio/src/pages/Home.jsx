import BarraDeNavegacion from '../components/BarraDeNavegacion'
import PricingCard from '../components/PricingCard'

const PLANS = [
  {
    name: 'Mensual',
    price: '60.000',
    period: 'mes',
    pricePerMonth: null,
    featured: false,
    badge: null,
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
    name: 'Anual',
    price: '600.000',
    period: 'año',
    pricePerMonth: '50.000',
    featured: true,
    badge: '2 meses gratis',
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
    cta: 'Mejor opción',
  },
]

const STATS = [
  { value: '10+', label: 'Años de exp.' },
  { value: '100+', label: 'Clientes' },
  { value: 'Hindu', label: 'Rugby Club' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <BarraDeNavegacion />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-600 to-transparent" />

        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
          <span className="inline-block text-green-500 text-xs font-bold uppercase tracking-[0.3em] mb-6 border border-green-800/60 rounded-full px-4 py-1.5 bg-green-950/40">
            Personal Trainer · Buenos Aires
          </span>

          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight mb-6">
            Entrenamiento
            <span className="block text-green-500 mt-1">sin límites</span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed">
            Planes personalizados para que alcances tus objetivos.
            Metodología de alto rendimiento, disciplina de cancha.
          </p>

          <a
            href="#pricing"
            className="inline-block mt-8 bg-green-700 hover:bg-green-600 text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-colors shadow-lg shadow-green-950/50"
          >
            Ver planes
          </a>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 md:gap-10 mt-16 flex-wrap">
            {STATS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 md:gap-10">
                <div className="text-center">
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-zinc-600 text-xs uppercase tracking-widest mt-1">{s.label}</p>
                </div>
                {i < STATS.length - 1 && (
                  <div className="w-px h-8 bg-zinc-800 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <p className="text-green-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">
            Invertí en vos
          </p>
          <h2 className="text-4xl font-black uppercase tracking-tight">
            Planes y precios
          </h2>
          <p className="text-zinc-500 mt-3 text-sm">
            Elegí el plan que mejor se adapta a tus objetivos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {PLANS.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        <p className="text-center text-zinc-700 text-xs mt-10 uppercase tracking-wider">
          Precios en pesos argentinos
        </p>
      </section>

      {/* About strip */}
      <section className="border-t border-zinc-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-4">Sobre Mateo</p>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Formado en las canchas del{' '}
            <span className="text-green-500 font-bold">Hindu Club</span>, Mateo trae
            la mentalidad del rugby de alto rendimiento al entrenamiento personal.
            Disciplina, constancia y resultados reales.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-700" />
        </div>
        <p className="text-zinc-700 text-xs uppercase tracking-widest mt-2">
          © {new Date().getFullYear()} Mateo Monente · Personal Trainer
        </p>
      </footer>
    </div>
  )
}
