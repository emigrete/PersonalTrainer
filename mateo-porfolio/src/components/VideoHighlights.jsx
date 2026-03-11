import { useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

function VideoCard({ src, label, index }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-cyan-900/60 transition-colors duration-300">
      {/* Number label */}
      <div className="absolute top-4 left-4 z-20">
        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest bg-zinc-950/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-zinc-800">
          0{index}
        </span>
      </div>

      {/* Video */}
      <div className="aspect-video w-full relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={src}
          loop
          playsInline
          onEnded={() => setPlaying(false)}
        />

        {/* Dark overlay when paused */}
        {!playing && (
          <div className="absolute inset-0 bg-zinc-950/40" />
        )}

        {/* Play / Pause button */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pausar video' : 'Reproducir video'}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          <div className={`w-16 h-16 rounded-full bg-cyan-600/90 backdrop-blur flex items-center justify-center transition-transform hover:scale-105 ${!playing ? 'play-pulse' : ''}`}>
            {playing ? (
              /* Pause icon */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                <rect x="4" y="3" width="4" height="14" rx="1.5" fill="currentColor"/>
                <rect x="12" y="3" width="4" height="14" rx="1.5" fill="currentColor"/>
              </svg>
            ) : (
              /* Play icon */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white ml-1">
                <path d="M5 3.5l12 6.5-12 6.5V3.5z" fill="currentColor"/>
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Label */}
      <div className="px-5 py-4 flex items-center justify-between">
        <p className="text-white font-bold text-sm uppercase tracking-wide">{label}</p>
        <span className="text-cyan-600">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </div>
  )
}

export default function VideoHighlights() {
  const [ref, inView] = useInView(0.1)

  return (
    <section className="bg-zinc-950 py-28 border-t border-zinc-900/60" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className={`mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 ${inView ? 'anim-fade-left' : 'opacity-0'}`}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-cyan-600" />
              <span className="text-cyan-500 text-xs font-bold uppercase tracking-[0.35em]">En acción</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
              Mirá cómo<br />
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                entrenamos
              </span>
            </h2>
            <p className="text-zinc-500 mt-4 text-base max-w-md">
              Metodología real, resultados concretos. Así se ve el trabajo de alto rendimiento.
            </p>
          </div>

          {/* Decorative accent */}
          <div className="flex-shrink-0 hidden md:block">
            <div className="flex flex-col gap-1.5">
              <div className="w-24 h-px bg-gradient-to-r from-cyan-800 to-transparent" />
              <div className="w-16 h-px bg-gradient-to-r from-cyan-900 to-transparent" />
              <div className="w-8 h-px bg-gradient-to-r from-cyan-950 to-transparent" />
            </div>
          </div>
        </div>

        {/* Video grid */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className={inView ? 'anim-fade-up' : 'opacity-0'} style={{ animationDelay: inView ? '0.2s' : undefined }}>
            <VideoCard src="/Mateo2.mp4" label="Entrenamiento funcional" index={1} />
          </div>
          <div className={inView ? 'anim-fade-up' : 'opacity-0'} style={{ animationDelay: inView ? '0.35s' : undefined }}>
            <VideoCard src="/Mateo3.mp4" label="Sesión de alta intensidad" index={2} />
          </div>
        </div>

        <p className="text-zinc-700 text-xs mt-5 uppercase tracking-wider">
          Sesiones reales · Sin edición · Sin filtros
        </p>
      </div>
    </section>
  )
}
