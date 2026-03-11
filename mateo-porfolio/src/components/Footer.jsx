import { WHATSAPP, INSTAGRAM_URL } from '../lib/constants'

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#sobre-mi', label: 'Sobre Mí' },
  { href: '#metodo', label: 'Método' },
  { href: '#resenas', label: 'Reseñas' },
  { href: '#planes', label: 'Planes' },
  { href: '#faq', label: 'FAQ' },
]

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-black text-white">MM</span>
            </div>
            <div>
              <p className="font-black text-white uppercase tracking-wider text-sm leading-tight">Mateo Monente</p>
              <p className="text-zinc-600 text-xs uppercase tracking-widest mt-0.5">Personal Trainer</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-zinc-600 hover:text-zinc-300 text-xs uppercase tracking-widest transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Social + Hindu */}
          <div className="flex flex-col items-center md:items-end gap-3">
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg border border-zinc-800 hover:border-cyan-700 text-zinc-600 hover:text-cyan-400 flex items-center justify-center transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg border border-zinc-800 hover:border-green-700 text-zinc-600 hover:text-green-400 flex items-center justify-center transition-colors duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>

            {/* Hindu colors */}
            <div className="flex items-center gap-2.5">
              <span className="text-zinc-700 text-xs uppercase tracking-wider">Hindu Rugby Club</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-green-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Mateo Monente · Todos los derechos reservados
          </p>
          <p className="text-zinc-800 text-xs">Buenos Aires, Argentina</p>
        </div>
      </div>
    </footer>
  )
}
