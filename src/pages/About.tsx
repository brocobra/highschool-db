import { Link } from 'react-router-dom'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'

export default function About() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link to="/" className="font-sans text-slate-body hover:text-purple">トップ</Link></li>
              <li className="text-slate-body">/</li>
              <li className="font-sans text-navy font-medium">運営者情報</li>
            </ol>
          </nav>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-display text-3xl font-bold text-navy mb-8">運営者情報</h1>
        </FadeIn>

        <FadeIn delay={0.15}>
          <Card>
            <dl className="space-y-4 font-sans text-sm">
              <div>
                <dt className="font-semibold text-slate-label mb-1">サイト名</dt>
                <dd className="text-navy">高校受験DB</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-label mb-1">運営者</dt>
                <dd className="text-navy">個人運営</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-label mb-1">サイトの目的</dt>
                <dd className="text-slate-body">
                  埼玉県の高校受験に必要な情報（偏差値・倍率・入試制度・学費）を一箇所にまとめ、
                  受験生と保護者の学校選びを支援する。
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-label mb-1">連絡先</dt>
                <dd className="text-slate-body">お問い合わせはサイト内のお問い合わせフォームよりお願いいたします。</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-label mb-1">広告掲載</dt>
                <dd className="text-slate-body">
                  Google AdSenseによる広告を掲載しています。広告の内容はGoogleにより配信されます。
                </dd>
              </div>
            </dl>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
