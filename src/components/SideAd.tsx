import { useEffect, useRef } from 'react'

interface SideAdProps {
  className?: string
}

export default function SideAd({ className = '' }: SideAdProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const win = window as any
    const prevAtOptions = win.atOptions

    win.atOptions = {
      key: '92bab807f48e4872f2e5127761fc18fb',
      format: 'iframe',
      height: 600,
      width: 160,
      params: {},
    }

    const configScript = document.createElement('script')
    configScript.textContent = `atOptions = ${JSON.stringify(win.atOptions)};`
    container.appendChild(configScript)

    const invokeScript = document.createElement('script')
    invokeScript.src =
      'https://www.highperformanceformat.com/92bab807f48e4872f2e5127761fc18fb/invoke.js'
    invokeScript.async = true
    container.appendChild(invokeScript)

    return () => {
      if (prevAtOptions !== undefined) {
        win.atOptions = prevAtOptions
      } else {
        delete win.atOptions
      }

      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className={`w-[160px] h-[600px] ${className}`} />
  )
}
