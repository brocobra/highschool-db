import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'トップ' },
    { path: '/saitama', label: '高校一覧' },
    { path: '/saitama/calculator', label: '内申計算機' },
    { path: '/saitama/exam-system', label: '入試制度' },
    { path: '/saitama/exam-flow', label: '受験の流れ' },
    { path: '/saitama/budget', label: '学費目安' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-display font-bold text-xl text-navy">
            高校受験DB
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-sans text-sm transition-colors hover:text-purple ${
                  location.pathname === item.path ? 'text-purple font-semibold' : 'text-slate-body'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-surface"
            aria-label="メニュー"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-3">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block font-sans text-sm py-2 transition-colors ${
                  location.pathname === item.path ? 'text-purple font-semibold' : 'text-slate-body'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
