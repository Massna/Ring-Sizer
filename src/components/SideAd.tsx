import AdIframe from './AdIframe'

const AD_KEY = '92bab807f48e4872f2e5127761fc18fb'
const AD_WIDTH = 160
const AD_HEIGHT = 600

interface SideAdProps {
  className?: string
}

export default function SideAd({ className = '' }: SideAdProps) {
  return (
    <AdIframe
      adKey={AD_KEY}
      width={AD_WIDTH}
      height={AD_HEIGHT}
      className={className}
    />
  )
}
