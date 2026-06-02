import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'
import { useSchools } from '../hooks/useData'

type SortKey = 'threeYearTotal' | 'year1' | 'annual_total' | 'tuition_monthly' | 'name'
type SortDir = 'asc' | 'desc'

const YEN = (n: number) => `¥${n.toLocaleString()}`
const WAN = (n: number) => `${(n / 10000).toFixed(0)}万円`

function calcYears(c: { initial_total: number; annual_total: number; uniform_estimate: number; ict_device_estimate: number }) {
  const year1 = c.initial_total + c.annual_total + c.uniform_estimate + c.ict_device_estimate
  const year2 = c.annual_total
  const year3 = c.annual_total
  return { year1, year2, year3, threeYearTotal: year1 + year2 + year3 }
}

export default function BudgetPage() {
  const { schools, loading } = useSchools()
  const [sortKey, setSortKey] = useState<SortKey>('threeYearTotal')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [genderFilter, setGenderFilter] = useState<'all' | 'mixed' | 'male' | 'female'>('all')

  const privateSchools = useMemo(() => {
    return schools
      .filter(s => s.type === 'private' && s.private_data?.cost_details)
      .filter(s => s.private_data!.cost_details.annual_total > 0)
      .filter(s => genderFilter === 'all' || s.gender === genderFilter)
      .map(s => {
        const cost = s.private_data!.cost_details
        const years = calcYears(cost)
        return { ...s, cost, ...years }
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortKey === 'name') {
          cmp = a.name.localeCompare(b.name, 'ja')
        } else if (sortKey === 'tuition_monthly') {
          cmp = a.cost.tuition_monthly - b.cost.tuition_monthly
        } else if (sortKey === 'annual_total') {
          cmp = a.cost.annual_total - b.cost.annual_total
        } else {
          cmp = a[sortKey] - b[sortKey]
        }
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [schools, sortKey, sortDir, genderFilter])

  const pendingCount = useMemo(() => {
    return schools.filter(s => s.type === 'private' && s.private_data?.cost_details && s.private_data.cost_details.annual_total === 0).length
  }, [schools])

  const stats = useMemo(() => {
    if (privateSchools.length === 0) return null
    const totals = privateSchools.map(s => s.threeYearTotal)
    const annuals = privateSchools.map(s => s.cost.annual_total)
    return {
      threeMin: Math.min(...totals),
      threeMax: Math.max(...totals),
      threeAvg: Math.round(totals.reduce((a, b) => a + b, 0) / totals.length),
      annualMin: Math.min(...annuals),
      annualMax: Math.max(...annuals),
      count: privateSchools.length,
    }
  }, [privateSchools])

  const maxTotal = useMemo(() => Math.max(...privateSchools.map(s => s.threeYearTotal)), [privateSchools])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-slate-300 ml-1">↕</span>
    return <span className="text-purple ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link to="/" className="font-sans text-slate-body hover:text-purple">トップ</Link></li>
              <li className="text-slate-body">/</li>
              <li><Link to="/saitama" className="font-sans text-slate-body hover:text-purple">埼玉県</Link></li>
              <li className="text-slate-body">/</li>
              <li className="font-sans text-navy font-medium">学費目安</li>
            </ol>
          </nav>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-2">
            私立高校 学費目安
          </h1>
          <p className="font-sans text-slate-body mb-8">
            埼玉県内私立高校の3年間総額（授業料・施設費・入学金・制服・ICT端末）を目安で表示。
            各校の詳細は学校名をクリック。
          </p>
        </FadeIn>

        {/* Public school note */}
        <FadeIn delay={0.15}>
          <Card className="mb-8 bg-purple-surface border-purple/20">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏫</span>
              <div>
                <h2 className="font-sans text-lg font-semibold text-navy mb-1">公立高校は授業料無償</h2>
                <p className="font-sans text-sm text-slate-body">
                  埼玉県の公立高校（県立・市立）は授業料無償化の対象。
                  年額約12万円の就学支援金（私立も対象）が別途支給されます。
                </p>
                <p className="font-sans text-xs text-slate-label mt-2">
                  出典: 埼玉県「公立高等学校の授業料の無償化」(
                  <a href="https://www.pref.saitama.lg.jp/a0701/koukou-mushouka.html" target="_blank" rel="noopener noreferrer" className="text-purple hover:text-purple-hover underline">
                    公式ページ
                  </a>
                  )
                </p>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Summary stats */}
        {stats && (
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center">
                <p className="font-sans text-sm text-slate-label mb-1">3年間総額</p>
                <p className="font-display text-2xl font-bold text-navy tabular-nums">
                  {WAN(stats.threeMin)} 〜 {WAN(stats.threeMax)}
                </p>
                <p className="font-sans text-xs text-slate-body mt-1">
                  平均: {WAN(stats.threeAvg)}（{stats.count}校）
                </p>
              </Card>
              <Card className="text-center">
                <p className="font-sans text-sm text-slate-label mb-1">年間学費（2〜3年目）</p>
                <p className="font-display text-2xl font-bold text-navy tabular-nums">
                  {YEN(stats.annualMin)} 〜 {YEN(stats.annualMax)}
                </p>
                <p className="font-sans text-xs text-slate-body mt-1">
                  授業料+施設費の年間合計
                </p>
              </Card>
              <Card className="text-center">
                <p className="font-sans text-sm text-slate-label mb-1">就学支援金</p>
                <p className="font-display text-2xl font-bold text-navy tabular-nums">
                  年額最大 ¥120,000
                </p>
                <p className="font-sans text-xs text-slate-body mt-1">
                  所得制限あり・3年で最大36万円支給
                </p>
              </Card>
            </div>
          </FadeIn>
        )}

        {/* Filter */}
        <FadeIn delay={0.25}>
          <Card className="mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="font-sans text-sm font-medium text-slate-label">男女</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'mixed', 'male', 'female'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      genderFilter === g
                        ? 'bg-purple text-white'
                        : 'bg-surface text-slate-body hover:bg-border'
                    }`}
                  >
                    {g === 'all' ? 'すべて' : g === 'male' ? '男子' : g === 'female' ? '女子' : '共学'}
                  </button>
                ))}
              </div>
              {pendingCount > 0 && (
                <span className="font-sans text-xs text-slate-label ml-auto">
                  ※ {pendingCount}校は調査中のため非表示
                </span>
              )}
            </div>
          </Card>
        </FadeIn>

        {/* Table */}
        <FadeIn delay={0.3}>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface border-b border-border">
                    <th
                      className="font-sans text-sm font-medium text-slate-label text-left py-3 px-4 cursor-pointer hover:text-purple whitespace-nowrap"
                      onClick={() => handleSort('name')}
                    >
                      学校名 <SortIcon col="name" />
                    </th>
                    <th className="font-sans text-sm font-medium text-slate-label text-center py-3 px-2 whitespace-nowrap">男女</th>
                    <th
                      className="font-sans text-sm font-medium text-slate-label text-right py-3 px-3 cursor-pointer hover:text-purple whitespace-nowrap"
                      onClick={() => handleSort('tuition_monthly')}
                    >
                      月額 <SortIcon col="tuition_monthly" />
                    </th>
                    <th
                      className="font-sans text-sm font-medium text-slate-label text-right py-3 px-3 cursor-pointer hover:text-purple whitespace-nowrap"
                      onClick={() => handleSort('year1')}
                    >
                      1年目 <SortIcon col="year1" />
                    </th>
                    <th
                      className="font-sans text-sm font-medium text-slate-label text-right py-3 px-3 whitespace-nowrap"
                    >
                      2年目
                    </th>
                    <th
                      className="font-sans text-sm font-medium text-slate-label text-right py-3 px-3 whitespace-nowrap"
                    >
                      3年目
                    </th>
                    <th
                      className="font-sans text-sm font-medium text-slate-label text-right py-3 px-4 cursor-pointer hover:text-purple whitespace-nowrap"
                      onClick={() => handleSort('threeYearTotal')}
                    >
                      3年総額 <SortIcon col="threeYearTotal" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="font-sans text-slate-body text-center py-12">読み込み中...</td>
                    </tr>
                  ) : privateSchools.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="font-sans text-slate-body text-center py-12">データがありません</td>
                    </tr>
                  ) : (
                    privateSchools.map(school => (
                      <tr
                        key={school.id}
                        className="border-b border-border last:border-b-0 hover:bg-surface/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <Link
                            to={`/saitama/highschool/${school.id}`}
                            className="font-sans text-navy hover:text-purple font-medium"
                          >
                            {school.short_name || school.name}
                          </Link>
                          <p className="font-sans text-xs text-slate-body">{school.address}</p>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            school.gender === 'male' ? 'bg-blue-50 text-blue-600'
                            : school.gender === 'female' ? 'bg-pink-50 text-pink-600'
                            : 'bg-green-50 text-green-600'
                          }`}>
                            {school.gender === 'male' ? '男子' : school.gender === 'female' ? '女子' : '共学'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="font-sans text-sm text-navy tabular-nums">{YEN(school.cost.tuition_monthly)}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="font-sans text-sm font-semibold text-navy tabular-nums">{WAN(school.year1)}</span>
                          <p className="font-sans text-[10px] text-slate-label">初期+年間+制服+ICT</p>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="font-sans text-sm text-navy tabular-nums">{WAN(school.year2)}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="font-sans text-sm text-navy tabular-nums">{WAN(school.year3)}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-sans text-base font-bold text-navy tabular-nums">{WAN(school.threeYearTotal)}</span>
                          <div className="mt-1 w-full bg-border rounded-full h-1.5">
                            <div
                              className="bg-purple h-1.5 rounded-full"
                              style={{ width: `${(school.threeYearTotal / maxTotal) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </FadeIn>

        {/* Evidence / Disclaimer */}
        <FadeIn delay={0.35}>
          <div className="mt-8 space-y-4">
            <Card>
              <h3 className="font-sans text-sm font-semibold text-navy mb-3">データについて</h3>
              <ul className="font-sans text-xs text-slate-body space-y-2">
                <li>
                  <strong className="text-slate-label">出典:</strong> 各学校の公式パンフレット・入学案内資料（2025〜2026年度版）
                </li>
                <li>
                  <strong className="text-slate-label">1年目:</strong> 入学金 + 年間学費（授業料+施設費）+ 制服代 + ICT端末代。教科書・通学費・積立金等は別途。
                </li>
                <li>
                  <strong className="text-slate-label">2〜3年目:</strong> 年間学費（授業料+施設費）。修学旅行代・積立金等は別途。
                </li>
                <li>
                  <strong className="text-slate-label">注意:</strong> 金額は目安です。年度により変更される場合があります。
                </li>
                <li>
                  <strong className="text-slate-label">就学支援金:</strong> 私立高校は年額最大12万円が支給。3年で最大36万円。詳細は
                  <a
                    href="https://www.pref.saitama.lg.jp/a0701/shuugaku-shienkin.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple hover:text-purple-hover underline"
                  >
                    埼玉県就学支援ページ
                  </a>
                  を参照。
                </li>
              </ul>
            </Card>

            {/* Hidden costs guide */}
            <Card>
              <h3 className="font-display text-lg font-bold text-navy mb-4">学費に含まれない「かくれコスト」</h3>
              <p className="font-sans text-sm text-slate-body mb-6">
                上記の3年総額は授業料・施設費・入学金・制服・ICT端末の目安。実際の支出はこれより多くなります。以下は学校のパンフレットに載りにくい費用のまとめ。
              </p>

              {/* Fixed hidden costs */}
              <div className="mb-6">
                <h4 className="font-sans text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-surface text-purple text-xs font-bold">1</span>
                  毎月〜年間でじわじわ効く「固定の隠れコスト」
                </h4>
                <div className="space-y-4 pl-8">
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">ICT関連費（端末＋通信＋保守）</p>
                    <p className="font-sans text-xs text-slate-body mt-1">
                      端末本体は入学時に支払っても、通信費や破損時の修理費が毎月の積立金から徴収されるケースが多い（月3,000〜5,000円）。3年で10〜18万円。
                    </p>
                    <p className="font-sans text-[10px] text-slate-label mt-1">
                      出典: 文部科学省「GIGAスクール構想」(
                      <a href="https://www.mext.go.jp/a_menu/other/index_00001.htm" target="_blank" rel="noopener noreferrer" className="text-purple hover:text-purple-hover underline">
                        公式
                      </a>
                      ) に基づく各校の端末運用方針による
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">積立金（修学旅行・進路合宿・海外研修）</p>
                    <p className="font-sans text-xs text-slate-body mt-1">
                      国内修学旅行で10〜15万円、海外研修が必須の学校では年間15万円前後の積立が数年間続く。トータルで50万円近く追加されることも。
                    </p>
                    <p className="font-sans text-[10px] text-slate-label mt-1">
                      出典: 各学校の募集要項・積立金案内に基づく。金額は学校・コースにより大きく異なる
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">保護者会・後援会・振興会費</p>
                    <p className="font-sans text-xs text-slate-body mt-1">
                      「任意」と書いてあっても、進路用コピー代やクラス活動費として実質的に毎月徴収される。年間2〜5万円程度。
                    </p>
                  </div>
                </div>
              </div>

              {/* Variable costs */}
              <div className="mb-6">
                <h4 className="font-sans text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">2</span>
                  人によって変わる「変動コスト」
                </h4>
                <div className="space-y-4 pl-8">
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">講習費（放課後・長期休暇）</p>
                    <p className="font-sans text-xs text-slate-body mt-1">
                      授業一環の講習は学費内だが、受験対策講習（夏期・冬期）は1講座数千円〜数万円。高3になると年間10〜20万円が相場。
                    </p>
                    <p className="font-sans text-[10px] text-slate-label mt-1">
                      出典: 埼玉県私立中学高等学校会 各校の講習案内に基づく
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">部活動費（遠征・合宿）</p>
                    <p className="font-sans text-xs text-slate-body mt-1">
                      運動部の遠征や合宿で毎月数万円かかることも。ユニフォーム代や遠征の交通費は見積もりから漏れやすい。
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">学食代</p>
                    <p className="font-sans text-xs text-slate-body mt-1">
                      お弁当を持たせない場合、学食で毎日昼食をとると1日500円として月1万円（年間約10万円）。
                    </p>
                  </div>
                </div>
              </div>

              {/* Spot costs */}
              <div>
                <h4 className="font-sans text-sm font-semibold text-navy mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-50 text-orange-600 text-xs font-bold">3</span>
                  一撃で家計を揺らす「スポット費用」
                </h4>
                <div className="space-y-4 pl-8">
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">寄付金</p>
                    <p className="font-sans text-xs text-slate-body mt-1">
                      募集要項に「1口5万円以上、2口以上お願い」とある場合、3年間で最低10〜20万円を見込む必要がある。上記学費一覧の寄付金欄を参照。
                    </p>
                    <p className="font-sans text-[10px] text-slate-label mt-1">
                      出典: 埼玉県私学救援協力会 各校の募集要項による。寄付金は学校法人により「任意」または「お願い」の場合が多いが、実質的に期待される金額が記載されている
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">電子辞書・ソフトウェアライセンス</p>
                    <p className="font-sans text-xs text-slate-body mt-1">
                      授業で必須のアプリやライセンスが学年ごとに更新料を求められることがある。入学時にまとめて購入する学校もあれば、年額課金の学校も。
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-sans text-xs text-slate-label">
                  上記の金額は一般的な目安。学校やコース、個人の選択により大きく変わります。詳細は各学校のオープンスクールや問い合わせで確認してください。
                </p>
              </div>
            </Card>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
