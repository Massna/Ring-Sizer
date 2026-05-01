import { useEffect, useRef } from 'react'

const AD_KEY = '397c3686d98bdbd9a1c597b017b80792'
const AD_WIDTH = 300
const AD_HEIGHT = 250

interface FooterAdProps {
  className?: string
}

export default function FooterAd({ className = '' }: FooterAdProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (container.childNodes.length > 0) return

    const atOptions = {
      key: AD_KEY,
      format: 'iframe',
      height: AD_HEIGHT,
      width: AD_WIDTH,
      params: {},
    }

    const script = document.createElement('script')
    script.textContent = `(function(){
      window.atOptions = ${JSON.stringify(atOptions)};
      var s = document.createElement('script');
      s.src = 'https://www.highperformanceformat.com/${AD_KEY}/invoke.js';
      s.async = true;
      s.setAttribute('data-cfasync', 'false');
      document.currentScript.parentNode.appendChild(s);
    })();`
    container.appendChild(script)

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: AD_WIDTH, height: AD_HEIGHT }}
      className={className}
    />
  )
}
