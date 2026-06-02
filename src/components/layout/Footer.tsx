import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="font-sans text-sm">
            © 2026 埼玉県高校受験DB
          </p>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/" className="font-sans text-sm hover:text-purple-light transition-colors">
              トップ
            </Link>
            <Link to="/saitama" className="font-sans text-sm hover:text-purple-light transition-colors">
              高校一覧
            </Link>
            <Link to="/saitama/calculator" className="font-sans text-sm hover:text-purple-light transition-colors">
              内申計算機
            </Link>
            <Link to="/saitama/exam-system" className="font-sans text-sm hover:text-purple-light transition-colors">
              入試制度
            </Link>
            <Link to="/saitama/budget" className="font-sans text-sm hover:text-purple-light transition-colors">
              学費目安
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/about" className="font-sans text-sm hover:text-purple-light transition-colors">
              運営者情報
            </Link>
            <Link to="/privacy" className="font-sans text-sm hover:text-purple-light transition-colors">
              プライバシーポリシー
            </Link>
            <Link to="/disclaimer" className="font-sans text-sm hover:text-purple-light transition-colors">
              免責事項
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
