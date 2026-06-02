import { Link } from 'react-router-dom'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'

export default function Privacy() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link to="/" className="font-sans text-slate-body hover:text-purple">トップ</Link></li>
              <li className="text-slate-body">/</li>
              <li className="font-sans text-navy font-medium">プライバシーポリシー</li>
            </ol>
          </nav>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-display text-3xl font-bold text-navy mb-8">プライバシーポリシー</h1>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="space-y-6">
            <Card>
              <h2 className="font-sans text-lg font-semibold text-navy mb-3">アクセス解析ツール</h2>
              <p className="font-sans text-sm text-slate-body">
                当サイトでは、Google Analytics を使用してアクセス解析を行っています。
                Google Analytics はトラフィックデータの収集のために Cookie を使用します。
                このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
              </p>
              <p className="font-sans text-xs text-slate-label mt-3">
                Cookie を無効にすることで、データ収集を拒否できます。
                詳細は
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple hover:text-purple-hover underline">
                  Google プライバシーポリシー
                </a>
                を参照してください。
              </p>
            </Card>

            <Card>
              <h2 className="font-sans text-lg font-semibold text-navy mb-3">広告配信</h2>
              <p className="font-sans text-sm text-slate-body">
                当サイトは Google AdSense を使用して広告を配信しています。
                Google AdSense では、ユーザーの興味に応じた広告を表示するため、Cookie や
                サードパーティの広告配信サービスを利用することがあります。
              </p>
              <p className="font-sans text-xs text-slate-label mt-3">
                広告のパーソナライズを無効にする場合は
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-purple hover:text-purple-hover underline">
                  Google 広告設定
                </a>
                から変更できます。
              </p>
            </Card>

            <Card>
              <h2 className="font-sans text-lg font-semibold text-navy mb-3">個人情報の取り扱い</h2>
              <p className="font-sans text-sm text-slate-body">
                当サイトでは、ユーザーの個人情報（氏名・住所・電話番号・メールアドレス等）を
                入力・送信するフォームは設置していません。内申計算機の入力データは
                ブラウザ内でのみ処理され、サーバーに送信されることはありません。
              </p>
            </Card>

            <Card>
              <h2 className="font-sans text-lg font-semibold text-navy mb-3">ポリシーの変更</h2>
              <p className="font-sans text-sm text-slate-body">
                当ポリシーの内容は予告なく変更される場合があります。
                最新の内容は本ページをご確認ください。
              </p>
            </Card>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
