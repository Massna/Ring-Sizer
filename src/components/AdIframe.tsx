import { useMemo } from 'react'

interface AdIframeProps {
  adKey: string
  width: number
  height: number
  className?: string
}

export default function AdIframe({
  adKey,
  width,
  height,
  className = '',
}: AdIframeProps) {
  const srcDoc = useMemo(() => {
    const atOptions = {
      key: adKey,
      format: 'iframe',
      height,
      width,
      params: {},
    }

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
body { margin: 0; padding: 0; overflow: hidden; }
</style>
</head>
<body>
<script>
window.atOptions = ${JSON.stringify(atOptions)};
</script>
<script async data-cfasync="false" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
</body>
</html>`
  }, [adKey, width, height])

  return (
    <iframe
      title={`ad-${adKey}`}
      width={width}
      height={height}
      style={{ border: 'none', display: 'block' }}
      srcDoc={srcDoc}
      className={className}
    />
  )
}
