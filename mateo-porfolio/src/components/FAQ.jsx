import { useState } from 'react'
import { useInView } from '../hooks/useInView'

const FAQS = [
  {
    q: '¿Las clases son presenciales o virtuales?',
    a: 'Ofrezco ambas modalidades. Las sesiones presenciales se realizan en Buenos Aires. Las virtuales incluyen rutinas en video, seguimiento por WhatsApp y videollamadas de control, por lo que podés entrenar desde cualquier lugar.',
  },
  {
    q: '¿Cuándo se ven los primeros resultados?',
    a: 'Los primeros cambios —más energía, mejor técnica y mayor fuerza— se sienten en las primeras 3 a 4 semanas. Los resultados estéticos y de rendimiento más notorios suelen verse a partir del segundo mes, siempre dependiendo de la constancia y el plan nutricional.',
  },
  {
    q: '¿Se necesita experiencia previa para empezar?',
    a: 'No. Los planes se diseñan desde cero para cada persona. Si nunca entrenaste, empezamos gradualmente para que tu cuerpo se adapte de forma segura y progresiva.',
  },
  {
    q: '¿Puedo cancelar o pausar el plan?',
    a: 'Sí. Los planes mensuales se pueden no renovar en cualquier momento. Para planes semestrales y anuales, podés pausar hasta 30 días ante imprevistos; coordinamos directamente por WhatsApp.',
  },
  {
    q: '¿Cómo funciona el soporte por WhatsApp?',
    a: 'Tenés acceso directo a mi número para consultar dudas sobre rutinas, técnica o ajustes del plan. Respondo en el mismo día (de lunes a sábado). Para los planes semestral y anual el soporte es prioritario.',
  },
  {
    q: '¿El plan incluye nutrición?',
    a: 'El enfoque principal es el entrenamiento. Sin embargo, doy orientación general sobre hábitos alimenticios alineados con tu objetivo. Para una planificación nutricional detallada, te recomiendo trabajar con un nutricionista, con quien puedo coordinar si lo necesitás.',
  },
]

function FAQItem({ q, a, isOpen, onToggle, delay, inView }) {
  return (
    <div
      className={`border border-zinc-800 rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? 'border-cyan-900/60' : 'hover:border-zinc-700'} ${inView ? 'anim-fade-up' : 'opacity-0'}`}
      style={{ animationDelay: inView ? delay : undefined }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-white font-semibold text-sm leading-snug">{q}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`flex-shrink-0 text-cyan-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M3 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="px-5 pb-5 text-zinc-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [ref, inView] = useInView(0.1)

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i))

  return (
    <section id="faq" className="bg-zinc-950 py-28 border-t border-zinc-900/60">
      <div className="max-w-3xl mx-auto px-6" ref={ref}>

        {/* Header */}
        <div className={inView ? 'anim-fade-up' : 'opacity-0'}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-px bg-cyan-600" />
            <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">Preguntas frecuentes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-12">
            Tus dudas,<br />
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              resueltas
            </span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
              delay={`${0.1 + i * 0.08}s`}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
