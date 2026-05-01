interface AdContainerProps {
  containerId?: string
  className?: string
}

export default function AdContainer({
  containerId = 'container-32d6b114e43f968c75084eb22df14ef7',
  className = '',
}: AdContainerProps) {
  return <div id={containerId} className={className} />
}
