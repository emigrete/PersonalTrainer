const STEPS = [
  {
    num: '01',
    title: 'Evaluación inicial',
    desc: 'Analizamos tu condición física actual, historial deportivo, objetivos y disponibilidad horaria para entender desde dónde partimos.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 7v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Plan personalizado',
    desc: 'Diseñamos un programa específico para vos: ejercicios, cargas, tiempos y progresiones adaptadas a tu cuerpo y estilo de vida.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 11h8M7 7h5M7 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Entrenamiento y seguimiento',
    desc: 'Sesiones guiadas, videos explicativos y check-ins semanales para ajustar el plan y mantener la motivación alta.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 14l4-4 4 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18 16.5v1.5l1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Resultados reales',
    desc: 'Medición del progreso cada 3 meses. Resultados concretos, medibles y sostenibles en el tiempo. Sin vueltas.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3l2.5 5 5.5.8-4 3.9.9 5.5L11 16l-4.9 2.2.9-5.5L3 8.8l5.5-.8L11 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

import { useInView } from '../hooks/useInView'

export default function HowItWorks() {
  const [ref, inView] = useInView(0.1)

  return (
    <section id="metodo" className="bg-zinc-950 py-28" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-16 max-w-xl ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-px bg-cyan-600" />
            <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">El método</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            Cómo funciona
          </h2>
          <p className="text-zinc-500 mt-4 text-base leading-relaxed">
            Un proceso estructurado y probado, con la seriedad del deporte de alto rendimiento.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`group relative ${inView ? 'anim-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: inView ? `${0.15 + i * 0.12}s` : undefined }}
            >
              {/* Connector — desktop only */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-9 left-[calc(100%+10px)] right-0 w-5 h-px bg-gradient-to-r from-zinc-700 to-transparent z-10" />
              )}

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col group-hover:border-cyan-900 group-hover:bg-zinc-900/80 transition-all duration-300">

                {/* Top row: number + icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-5xl font-black leading-none text-zinc-800 group-hover:text-cyan-950 transition-colors select-none">
                    {step.num}
                  </span>
                  <span className="text-cyan-600 group-hover:text-cyan-500 transition-colors">
                    {step.icon}
                  </span>
                </div>

                <h3 className="text-white font-bold text-base uppercase tracking-wide leading-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed flex-1">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
