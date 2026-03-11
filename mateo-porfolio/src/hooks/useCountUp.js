import { useEffect, useRef, useState } from 'react'

/**
 * Animates a numeric value from 0 to the parsed number with ease-out-cubic.
 * @param {string|number} rawValue  e.g. "10+", "100+", "4.9★", "Hindu"
 * @param {number}        duration  ms (default 1400)
 * @param {boolean}       active    start only when true (tie to inView)
 * @returns {string}  display string (animated while counting, full value when done)
 */
export function useCountUp(rawValue, duration = 1400, active = true) {
  const str = String(rawValue)

  // Parse numeric prefix + suffix  e.g. "10+" → { num: 10, suffix: "+" }
  const match = str.match(/^(\d+(?:\.\d+)?)(.*)$/)
  const num = match ? parseFloat(match[1]) : null
  const suffix = match ? match[2] : ''

  const [display, setDisplay] = useState(num !== null ? `0${suffix}` : str)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!active || num === null) {
      setDisplay(str)
      return
    }

    let start = null
    const isFloat = str.includes('.')

    const step = (timestamp) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = num * eased
      const formatted = isFloat ? current.toFixed(1) : Math.floor(current)
      setDisplay(`${formatted}${suffix}`)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(str)
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, str, num, suffix, duration])

  return display
}
