import { Link } from 'react-router-dom'
import { Calendar, BookOpen, Calculator, Users, Clock, CheckCircle } from 'lucide-react'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'
import { useExamSystem } from '../hooks/useData'

const steps = [
  { period: '中学2年 夏', title: '模試で現在地を知る', desc: '北辰テストなどの模試を受けて、今の偏差値を把握。志望校の偏差値と比較して、どれくらい頑張る必要があるか見える化する。', icon: BookOpen },
  { period: '中学2年 秋', title: '志望校リストを作る', desc: '行きたい学校、行けそうな学校を3〜5校リストアップ。文化祭やオープンスクールに足を運ぶ。', icon: Users },
  { period: '中学2年 冬', title: '内申点を確認する', desc: '2年時の評定を確認。3年時の評定が一番重要だが、2年時の内申も選抜に影響する学校がある。', icon: Calculator },
  { period: '中学3年 春', title: '進路面談', desc: '学校の先生と志望校の相談。先生からの推薦やアドバイスを受ける。', icon: Users },
  { period: '中学3年 夏', title: '夏期講習 + 志望校絞り込み', desc: '最後の長期休み。苦手科目を集中的に対策。オープンスクールに参加して学校の雰囲気を確認。', icon: BookOpen },
  { period: '中学3年 秋', title: '出願準備', desc: '募集要項を確認。調査書の準備。特色選抜を受ける場合は、実技や作文の対策も。', icon: CheckCircle },
  { period: '中学3年 1月下旬', title: '出願', desc: '志望校に願書を提出。埼玉県は全県1区制なので、県内どこでも出願可能。', icon: Calendar },
  { period: '中学3年 2月下旬', title: '入試本番', desc: '学力検査（5教科500点）→ 面接 → 特色選抜（該当校のみ）。', icon: Clock },
]

const faqs = [
  {
    q: 'いつから受験勉強を始めるべき？',
    a: '中学2年の夏には現在の学力を把握し、中学3年の夏までに志望校に向けた対策を始めるのが一般的。ただし、内申点は2年時から影響するので、日々の授業も大切。'
  },
  {
    q: '埼玉県は学区がないって本当？',
    a: '本当。平成16年度から全県1区制になり、埼玉県内のどの公立高校でも出願可能。自宅から遠い学校でも受けられる。'
  },
  {
    q: '内申点って何？いつから関係する？',
    a: '内申点は中学の評定（5段階）の合計。9教科×5 = 最大45点。2年と3年の評定が使われ、3年次を重視する学校が多い。学校によって「1:1:1」「1:1:2」「1:1:3」の比率が違う。'
  },
  {
    q: '特色選抜と共通選抜、どっちを受ける？',
    a: '両方受けられる学校は多い。特色選抜は先に合格が決まるので、合格すれば安心。ただし、特色選抜の内容（実技・作文）は学校により異なるので、事前に確認を。'
  },
  {
    q: '面接は全員あるの？',
    a: '令和9年度から全受検生が面接を実施。個人面接または集団面接。基礎点は30点で、学校により1倍（30点）または2倍（60点）になる。'
  },
  {
    q: '私立も受けたほうがいい？',
    a: '公立の合格発表（3月5日）の前に、私立の合格が決まっていれば安心材料になる。併願優遇制度を活用するのも手。ただし、受験料やスケジュールの調整が必要。'
  },
]

export default function ExamFlow() {
  const { exam, loading } = useExamSystem()

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <FadeIn>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-navy text-center mb-4">
            埼玉県の高校受験
          </h1>
          <p className="font-sans text-slate-body text-lg text-center mb-2">
            いつから何をすればいい？
          </p>
          <p className="font-sans text-slate-body text-sm text-center mb-12">
            埼玉県教育委員会「令和9年度実施基本方針」に基づく
          </p>
        </FadeIn>

        {/* Timeline */}
        <div className="space-y-6 mb-16">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <Card>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-purple-surface flex items-center justify-center">
                      <step.icon className="text-purple" size={20} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-medium text-purple mb-1">{step.period}</p>
                    <h3 className="font-display text-lg font-semibold text-navy mb-2">{step.title}</h3>
                    <p className="font-sans text-sm text-slate-body leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Exam System Details */}
        {!loading && exam && (
          <>
            <FadeIn>
              <h2 className="font-display text-2xl font-bold text-navy mb-8">
                令和9年度 入試スケジュール
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Card className="mb-12">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="font-sans text-sm font-medium text-slate-label text-left py-3 px-4">日程</th>
                        <th className="font-sans text-sm font-medium text-slate-label text-left py-3 px-4">内容</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="font-sans text-navy py-3 px-4 text-sm tabular-nums">1月26日〜2月9日</td>
                        <td className="font-sans text-navy py-3 px-4 text-sm">出願期間</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="font-sans text-navy py-3 px-4 text-sm tabular-nums">2月12・15・16日</td>
                        <td className="font-sans text-navy py-3 px-4 text-sm">調査書等提出</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="font-sans text-navy py-3 px-4 text-sm tabular-nums">2月17・18日</td>
                        <td className="font-sans text-navy py-3 px-4 text-sm">志望変更期間</td>
                      </tr>
                      <tr className="border-b border-border bg-purple-surface/30">
                        <td className="font-sans text-navy font-medium py-3 px-4 text-sm tabular-nums">2月25日</td>
                        <td className="font-sans text-navy font-medium py-3 px-4 text-sm">学力検査（5教科・500点）</td>
                      </tr>
                      <tr className="border-b border-border bg-purple-surface/30">
                        <td className="font-sans text-navy font-medium py-3 px-4 text-sm tabular-nums">2月26日</td>
                        <td className="font-sans text-navy font-medium py-3 px-4 text-sm">面接（全受検生）</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="font-sans text-navy py-3 px-4 text-sm tabular-nums">3月1日</td>
                        <td className="font-sans text-navy py-3 px-4 text-sm">特色選抜の実技検査・作文（該当校のみ）</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="font-sans text-navy py-3 px-4 text-sm tabular-nums">3月2日</td>
                        <td className="font-sans text-navy py-3 px-4 text-sm">追検査</td>
                      </tr>
                      <tr>
                        <td className="font-sans text-navy font-medium py-3 px-4 text-sm tabular-nums">3月5日</td>
                        <td className="font-sans text-navy font-medium py-3 px-4 text-sm">合格発表</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="font-sans text-xs text-slate-body mt-4">
                  出典: {exam.source}
                </p>
              </Card>
            </FadeIn>

            {/* Scoring Breakdown */}
            <FadeIn>
              <h2 className="font-display text-2xl font-bold text-navy mb-8">
                配点の仕組み
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="grid gap-6 md:grid-cols-3 mb-12">
                <Card className="text-center">
                  <p className="font-display text-3xl font-bold text-purple tabular-nums">500</p>
                  <p className="font-sans text-sm text-slate-body mt-1">学力検査（5教科）</p>
                  <p className="font-sans text-xs text-slate-body mt-2">国・社・数・理・英 各100点</p>
                </Card>
                <Card className="text-center">
                  <p className="font-display text-3xl font-bold text-blue-500 tabular-nums">135〜225</p>
                  <p className="font-sans text-sm text-slate-body mt-1">内申点（換算後）</p>
                  <p className="font-sans text-xs text-slate-body mt-2">元は45点満点、比率で換算</p>
                </Card>
                <Card className="text-center">
                  <p className="font-display text-3xl font-bold text-green-500 tabular-nums">30 or 60</p>
                  <p className="font-sans text-sm text-slate-body mt-1">面接点</p>
                  <p className="font-sans text-xs text-slate-body mt-2">学校により1倍 or 2倍</p>
                </Card>
              </div>
            </FadeIn>

            {/* Naishin Ratio */}
            <FadeIn delay={0.15}>
              <Card className="mb-12">
                <h3 className="font-display text-lg font-bold text-navy mb-4">内申比率のしくみ</h3>
                <p className="font-sans text-sm text-slate-body mb-4">
                  学校により、中学2年と3年の内申をどう扱うか異なる。3年次を重視する学校が多い。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-navy bg-surface px-3 py-1 rounded tabular-nums">1 : 1 : 1</span>
                    <span className="font-sans text-sm text-slate-body">2年=1倍、3年前期=1倍、3年後期=1倍 → 最大135点</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-navy bg-surface px-3 py-1 rounded tabular-nums">1 : 1 : 2</span>
                    <span className="font-sans text-sm text-slate-body">2年=1倍、3年前期=1倍、3年後期=2倍 → 最大180点</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-medium text-navy bg-surface px-3 py-1 rounded tabular-nums">1 : 1 : 3</span>
                    <span className="font-sans text-sm text-slate-body">2年=1倍、3年前期=1倍、3年後期=3倍 → 最大225点</span>
                  </div>
                </div>
                <p className="font-sans text-xs text-slate-body mt-4">
                  各校の内申比率は<a href="/highschool-db/#/saitama" className="text-purple hover:text-purple-hover">高校一覧</a>のフィルターで絞り込み可能。
                </p>
              </Card>
            </FadeIn>
          </>
        )}

        {/* FAQ */}
        <FadeIn>
          <h2 className="font-display text-2xl font-bold text-navy mb-8">
            よくある質問
          </h2>
        </FadeIn>

        <div className="space-y-4 mb-16">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <Card>
                <h3 className="font-sans text-base font-semibold text-navy mb-2">{faq.q}</h3>
                <p className="font-sans text-sm text-slate-body leading-relaxed">{faq.a}</p>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Tools */}
        <FadeIn>
          <h2 className="font-display text-2xl font-bold text-navy mb-8 text-center">
            ツールを試す
          </h2>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <FadeIn delay={0.1}>
            <Link to="/saitama/calculator">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer text-center h-full">
                <Calculator className="mx-auto mb-3 text-purple" size={28} />
                <h3 className="font-display text-base font-semibold text-navy mb-1">内申計算機</h3>
                <p className="font-sans text-xs text-slate-body">評定入力で内申点を自動計算</p>
              </Card>
            </Link>
          </FadeIn>
          <FadeIn delay={0.15}>
            <Link to="/saitama">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer text-center h-full">
                <BookOpen className="mx-auto mb-3 text-purple" size={28} />
                <h3 className="font-display text-base font-semibold text-navy mb-1">高校一覧</h3>
                <p className="font-sans text-xs text-slate-body">偏差値・内申比率で絞り込み</p>
              </Card>
            </Link>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Link to="/saitama/exam-system">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer text-center h-full">
                <Calendar className="mx-auto mb-3 text-purple" size={28} />
                <h3 className="font-display text-base font-semibold text-navy mb-1">入試制度詳細</h3>
                <p className="font-sans text-xs text-slate-body">制度の全文を見る</p>
              </Card>
            </Link>
          </FadeIn>
        </div>

        {/* Source */}
        <FadeIn>
          <Card className="bg-white">
            <p className="font-sans text-xs text-slate-body">
              このページの情報源: 埼玉県教育委員会「令和9年度公立高等学校入学者選抜実施基本方針」（令和6年9月26日公表）。
              最新情報は<a href="https://www.pref.saitama.lg.jp/a0201/koukounyuushi.html" target="_blank" rel="noopener noreferrer" className="text-purple hover:text-purple-hover">埼玉県教育委員会の公式サイト</a>で必ず確認してください。
            </p>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
