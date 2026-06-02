import { Link } from 'react-router-dom'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'

export default function Disclaimer() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link to="/" className="font-sans text-slate-body hover:text-purple">トップ</Link></li>
              <li className="text-slate-body">/</li>
              <li className="font-sans text-navy font-medium">免責事項</li>
            </ol>
          </nav>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-display text-3xl font-bold text-navy mb-8">免責事項</h1>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="space-y-6">
            <Card>
              <h2 className="font-sans text-lg font-semibold text-navy mb-3">データの正確性</h2>
              <p className="font-sans text-sm text-slate-body">
                当サイトに掲載している情報（偏差値・倍率・学費・入試制度等）は、
                各学校の公式資料・埼玉県教育委員会の公表データ等を基に作成していますが、
                内容の正確性・完全性を保証するものではありません。
              </p>
              <p className="font-sans text-sm text-slate-body mt-2">
                学校の募集要項・学費等は年度により変更される場合があります。
                最新かつ正確な情報は、必ず各学校の公式サイトまたは埼玉県教育委員会の
                発表資料でご確認ください。
              </p>
            </Card>

            <Card>
              <h2 className="font-sans text-lg font-semibold text-navy mb-3">損害赔偿</h2>
              <p className="font-sans text-sm text-slate-body">
                当サイトの情報を利用することで生じた損害について、
                運営者は一切の責任を負いません。自己責任にてご利用ください。
              </p>
            </Card>

            <Card>
              <h2 className="font-sans text-lg font-semibold text-navy mb-3">著作権</h2>
              <p className="font-sans text-sm text-slate-body">
                当サイトのコンテンツ（文章・デザイン・プログラム）の著作権は運営者に帰属します。
                ただし、学校名・偏差値・倍率等の事実データは各学校・埼玉県教育委員会に帰属します。
              </p>
              <p className="font-sans text-sm text-slate-body mt-2">
                過去問・PDF等の著作物の転載は行っていません。
                各学校の公式サイトへのリンクを提供しています。
              </p>
            </Card>

            <Card>
              <h2 className="font-sans text-lg font-semibold text-navy mb-3">リンク</h2>
              <p className="font-sans text-sm text-slate-body">
                当サイトから外部サイトへのリンクは便利のために設置しています。
                リンク先のサイトの内容について、運営者は責任を負いません。
              </p>
            </Card>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
