import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { WHATSAPP } from '../lib/constants'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#sobre-mi', label: 'Sobre Mí' },
  { href: '#metodo', label: 'Método' },
  { href: '#resenas', label: 'Reseñas' },
  { href: '#planes', label: 'Planes' },
  { href: '#faq', label: 'FAQ' },
]

export default function BarraDeNavegacion() {
  const { firebaseUser, isAdmin, logout } = useAuth()
  const isAuth = !!firebaseUser
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find(e => e.isIntersecting)
        if (visible) setActiveSection(visible.target.id)
      },
      { threshold: 0.35, rootMargin: '-60px 0px 0px 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
    {menuOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setMenuOpen(false)}
      />
    )}
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-zinc-950/96 backdrop-blur-md border-b border-zinc-900 shadow-xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-cyan-900 border border-cyan-700 flex items-center justify-center group-hover:border-cyan-500 transition-colors shadow-sm shadow-cyan-950">
            <span className="text-xs font-black text-white">MM</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-black text-white uppercase tracking-wider text-sm leading-tight">Mateo Monente</p>
            <p className="text-cyan-600 text-[10px] tracking-[0.2em] uppercase leading-tight">Personal Trainer</p>
          </div>
        </a>

        {/* Center nav links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={`text-xs uppercase tracking-widest font-semibold transition-colors ${
                activeSection === href.slice(1)
                  ? 'text-white border-b border-cyan-600 pb-0.5'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {label}
            </a>
          ))}
          {isAuth && !isAdmin && (
            <Link
              to="/perfil"
              className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Mi perfil
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-cyan-500 hover:text-cyan-400 text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Mis clientes
            </Link>
          )}
        </div>

        {/* Auth actions + hamburger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isAuth && !isAdmin && (
            <Link
              to="/perfil"
              className="md:hidden text-zinc-400 hover:text-white text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Mi perfil
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="md:hidden text-cyan-500 hover:text-cyan-400 text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Admin
            </Link>
          )}

          {/* Auth button — desktop only */}
          <div className="hidden md:block">
            {isAuth ? (
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors border border-zinc-800 hover:border-red-900/60 rounded-lg px-3 py-2"
              >
                Salir
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-white uppercase tracking-widest transition-all border border-zinc-700 hover:border-cyan-700 hover:text-cyan-400 rounded-lg px-4 py-2"
              >
                Ingresar
              </button>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            {menuOpen ? (
              /* ✕ icon */
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              /* ☰ icon */
              <>
                <span className="w-5 h-px bg-zinc-400" />
                <span className="w-5 h-px bg-zinc-400" />
                <span className="w-5 h-px bg-zinc-400" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="border-t border-zinc-900 px-6 pb-4 flex flex-col">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-zinc-300 hover:text-white text-sm uppercase tracking-widest font-semibold py-3.5 border-b border-zinc-900 transition-colors"
            >
              {label}
            </a>
          ))}

          {isAuth && !isAdmin && (
            <Link
              to="/perfil"
              onClick={() => setMenuOpen(false)}
              className="text-zinc-300 hover:text-white text-sm uppercase tracking-widest font-semibold py-3.5 border-b border-zinc-900 transition-colors"
            >
              Mi perfil
            </Link>
          )}

          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-green-400 hover:text-green-300 text-sm uppercase tracking-widest font-semibold py-3.5 border-b border-zinc-900 transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>

          <div className="pt-4">
            {isAuth ? (
              <button
                onClick={() => { handleLogout(); setMenuOpen(false) }}
                className="w-full text-xs font-bold text-zinc-500 hover:text-red-400 uppercase tracking-widest transition-colors border border-zinc-800 hover:border-red-900/60 rounded-lg px-3 py-3"
              >
                Salir
              </button>
            ) : (
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false) }}
                className="w-full text-xs font-bold text-white uppercase tracking-widest transition-all border border-zinc-700 hover:border-cyan-700 hover:text-cyan-400 rounded-lg px-4 py-3"
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}
