interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-border p-6 shadow-lg ${className}`}>
      {children}
    </div>
  )
}
