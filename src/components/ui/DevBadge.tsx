interface DevBadgeProps {
  score: number
  className?: string
}

export default function DevBadge({ score, className = '' }: DevBadgeProps) {
  const getVariant = () => {
    if (score < 40) return 'bg-dev-1/10 text-dev-1'
    if (score < 50) return 'bg-dev-2/10 text-dev-2'
    if (score < 55) return 'bg-dev-3/10 text-dev-3'
    if (score < 60) return 'bg-dev-4/10 text-dev-4'
    return 'bg-dev-5/10 text-dev-5'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold tabular-nums ${getVariant()} ${className}`}>
      {score}
    </span>
  )
}
