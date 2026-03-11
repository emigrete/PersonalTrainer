import { useNavigate } from 'react-router-dom'
import { WHATSAPP } from '../lib/constants'

const BADGE_STYLES = {
  red:   'bg-red-700 shadow-red-950/60',
  amber: 'bg-amber-600 shadow-amber-950/60',
}

function CardBadge({ badge, badgeColor }) {
  if (!badge) return null
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
      <span
        className={`text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg ${
          BADGE_STYLES[badgeColor] ?? 'bg-zinc-700'
        }`}
      >
        {badge}
      </span>
    </div>
  )
}

function CardContent({ name, price, period, pricePerMonth, savings, featured, features, cta, isLoggedIn, handleCTA }) {
  return (
    <>
      {/* Plan name */}
      <p className={`text-xs font-black uppercase tracking-[0.35em] mb-4 ${featured ? 'text-cyan-400' : 'text-zinc-500'}`}>
        {name}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-zinc-400 text-lg font-bold">$</span>
        <span className="text-5xl font-black text-white leading-none tabular-nums">{price}</span>
        <span className="text-zinc-500 text-sm ml-1">/ {period}</span>
      </div>

      {pricePerMonth && (
        <div className="mt-1.5 mb-0">
          <span className={`text-sm font-semibold ${featured ? 'text-cyan-400' : 'text-zinc-400'}`}>
            ${pricePerMonth}/mes
          </span>
          {savings && (
            <span className={`text-xs ml-2 ${featured ? 'text-cyan-600' : 'text-zinc-600'}`}>
              · Ahorrás ${savings}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className={`my-5 h-px ${featured ? 'bg-cyan-800/40' : 'bg-zinc-800'}`} />

      {/* Features */}
      <ul className="space-y-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span className={`mt-0.5 flex-shrink-0 font-black text-sm ${featured ? 'text-cyan-400' : 'text-cyan-700'}`}>
              ✓
            </span>
            <span className="text-zinc-300 text-sm leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={handleCTA}
        className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all cursor-pointer ${
          featured
            ? 'bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white shadow-lg shadow-cyan-950/50 hover:-translate-y-0.5'
            : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:-translate-y-0.5 hover:border-zinc-600'
        }`}
      >
        {isLoggedIn ? cta : 'Empezar →'}
      </button>

      {!isLoggedIn && (
        <p className="text-zinc-700 text-[10px] text-center mt-2.5 uppercase tracking-wider">
          Se requiere cuenta gratuita
        </p>
      )}
    </>
  )
}

export default function PricingCard({
  name, price, period, pricePerMonth,
  featured, badge, badgeColor, savings,
  features, cta, isLoggedIn,
}) {
  const navigate = useNavigate()

  const handleCTA = () => {
    if (isLoggedIn) {
      const text = encodeURIComponent(`Hola Mateo! Me interesa el plan *${name}* ($${price}/${period}). ¿Podemos coordinar el inicio?`)
      window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank', 'noopener,noreferrer')
    } else {
      navigate('/login?next=/#planes')
    }
  }

  const contentProps = { name, price, period, pricePerMonth, savings, featured, features, cta, isLoggedIn, handleCTA }

  /* ── Featured card: spinning gradient border ── */
  if (featured) {
    return (
      <div className="relative pt-5">
        <CardBadge badge={badge} badgeColor={badgeColor} />
        {/* Outer wrapper: clips the spinning gradient to act as border */}
        <div className="relative rounded-2xl p-[1.5px] overflow-hidden glow-pulse">
          {/* Spinning conic-gradient — cyan tones */}
          <div
            className="spin-gradient absolute"
            style={{
              inset: '-100%',
              background: 'conic-gradient(from 0deg, #0e7490 0%, #22d3ee 20%, #0e7490 40%, #083344 65%, #06b6d4 82%, #0e7490 100%)',
            }}
          />
          {/* Card body */}
          <div className="relative rounded-[14px] bg-[#020c14] p-7 flex flex-col h-full">
            <CardContent {...contentProps} />
          </div>
        </div>
      </div>
    )
  }

  /* ── Regular card ── */
  return (
    <div className="relative pt-5">
      <CardBadge badge={badge} badgeColor={badgeColor} />
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 flex flex-col h-full hover:border-zinc-700 transition-colors duration-300">
        <CardContent {...contentProps} />
      </div>
    </div>
  )
}
