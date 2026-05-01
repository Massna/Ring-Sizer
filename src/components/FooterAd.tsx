import AdIframe from './AdIframe'

const AD_KEY = '397c3686d98bdbd9a1c597b017b80792'
const AD_WIDTH = 300
const AD_HEIGHT = 250

interface FooterAdProps {
  className?: string
}

export default function FooterAd({ className = '' }: FooterAdProps) {
  return (
    <AdIframe
      adKey={AD_KEY}
      width={AD_WIDTH}
      height={AD_HEIGHT}
      className={className}
    />
  )
}
