import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'
import DevBadge from '../components/ui/DevBadge'
import { useSchools } from '../hooks/useData'

const subjects = [
  { id: 'kokugo', name: '国語' },
  { id: 'shakai', name: '社会' },
  { id: 'suugaku', name: '数学' },
  { id: 'rika', name: '理科' },
  { id: 'eigo', name: '英語' },
  { id: 'ongaku', name: '音楽' },
  { id: 'bijutsu', name: '美術' },
  { id: 'hoken', name: '保健体育' },
  { id: 'gijutsu', name: '技術家庭' },
]

type Tier = 'safe' | 'borderline' | 'reach'

interface MatchResult {
  id: string
  name: string
  shortName: string
  type: 'public' | 'private'
  gender: 'mixed' | 'male' | 'female'
  address: string
  courseName: string
  schoolDev: number
  tier: Tier
  reportWeight: number
}

export default function Calculator() {
  const { schools } = useSchools()
  const [scores, setScores] = useState<Record<string, number>>({})
  const [deviation, setDeviation] = useState(50)

  const totalReport = Object.values(scores).reduce((sum, s) => sum + s, 0)
  const filledSubjects = Object.keys(scores).length
  const hasInput = filledSubjects >= 5

  const handleScore = (id: string, score: number) => {
    setScores(prev => ({ ...prev, [id]: score }))
  }

  const matches = useMemo(() => {
    if (!hasInput) return { safe: [], borderline: [], reach: [] }

    const results: MatchResult[] = []

    for (const school of schools) {
      for (const course of school.courses) {
        const dev = course.deviation_score.hokushin
        if (dev === 0) continue
        if (!course.selection_criteria) continue

        const diff = deviation - dev
        const reportPoints = course.selection_criteria.first_selection.report_points
        const academicPoints = course.selection_criteria.first_selection.academic_points
        const totalPoints = reportPoints + academicPoints + course.selection_criteria.first_selection.interview_points
        const reportWeight = reportPoints / totalPoints

        // Base tier from deviation
        let tier: Tier
        if (diff >= 3) tier = 'safe'
        else if (diff >= -3) tier = 'borderline'
        else if (diff >= -6) tier = 'reach'
        else continue

        // Downgrade if report card is weak relative to the school's weight
        const reportRatio = totalReport / 45
        if (reportWeight > 0.3 && reportRatio < 0.7) {
          if (tier === 'safe') tier = 'borderline'
          else if (tier === 'borderline') tier = 'reach'
          else continue
        }

        results.push({
          id: school.id,
          name: school.name,
          shortName: school.short_name || school.name,
          type: school.type,
          gender: school.gender,
          address: school.address,
          courseName: course.name,
          schoolDev: dev,
          tier,
          reportWeight: Math.round(reportWeight * 100),
        })
      }
    }

    // Deduplicate: keep highest tier per school
    const best = new Map<string, MatchResult>()
    for (const m of results) {
      const existing = best.get(m.id)
      if (!existing || tierOrder(m.tier) < tierOrder(existing.tier)) {
        best.set(m.id, m)
      }
    }

    const sorted = [...best.values()].sort((a, b) => b.schoolDev - a.schoolDev)
    return {
      safe: sorted.filter(m => m.tier === 'safe'),
      borderline: sorted.filter(m => m.tier === 'borderline'),
      reach: sorted.filter(m => m.tier === 'reach'),
    }
  }, [schools, scores, deviation, hasInput])

  // Feedback hints
  const hints = useMemo(() => {
    if (!hasInput) return []
    const result: string[] = []

    const nearBorderline = schools
      .flatMap(s => s.courses.map(c => ({ school: s, course: c })))
      .filter(({ course }) => course.deviation_score.hokushin > 0)
      .filter(({ course }) => deviation - course.deviation_score.hokushin >= -7 && deviation - course.deviation_score.hokushin < -5)
      .sort((a, b) => b.course.deviation_score.hokushin - a.course.deviation_score.hokushin)
      .slice(0, 3)

    if (nearBorderline.length > 0) {
      const names = nearBorderline.map(({ school }) => school.short_name || school.name).join('、')
      result.push(`偏差値あと${Math.abs(deviation - nearBorderline[0].course.deviation_score.hokushin) + 5}で${names}が挑戦圏に追加`)
    }

    const nearSafe = schools
      .flatMap(s => s.courses.map(c => ({ school: s, course: c })))
      .filter(({ course }) => course.deviation_score.hokushin > 0)
      .filter(({ course }) => deviation - course.deviation_score.hokushin >= 0 && deviation - course.deviation_score.hokushin < 3)
      .sort((a, b) => b.course.deviation_score.hokushin - a.course.deviation_score.hokushin)
      .slice(0, 3)

    if (nearSafe.length > 0) {
      const names = nearSafe.map(({ school }) => school.short_name || school.name).join('、')
      result.push(`偏差値あと${3 - (deviation - nearSafe[0].course.deviation_score.hokushin)}で${names}が安全圏に`)
    }

    if (totalReport < 35 && filledSubjects === 9) {
      result.push(`内申あと${35 - totalReport}点でマッチング結果が改善する可能性あり`)
    }

    return result
  }, [schools, scores, deviation, hasInput, totalReport, filledSubjects])

  const totalCount = matches.safe.length + matches.borderline.length + matches.reach.length

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-2 text-center">
            志望校サーチ
          </h1>
          <p className="font-sans text-slate-body text-center mb-8">
            内申点と偏差値を入力すると、受験できそうな学校をリアルタイムで表示
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <FadeIn delay={0.1}>
              <Card className="sticky top-20">
                <h2 className="font-display text-lg font-bold text-navy mb-4">成績入力</h2>

                {/* Deviation slider */}
                <div className="mb-6">
                  <label className="font-sans text-sm font-medium text-slate-label mb-2 block">
                    偏差値: <span className="text-navy font-bold tabular-nums">{deviation}</span>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="76"
                    value={deviation}
                    onChange={e => setDeviation(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-purple"
                  />
                  <div className="flex justify-between text-xs text-slate-body mt-1">
                    <span>30</span>
                    <span>50</span>
                    <span>76</span>
                  </div>
                </div>

                {/* Subject scores */}
                <div className="space-y-3">
                  {subjects.map(subject => (
                    <div key={subject.id} className="flex items-center justify-between gap-2">
                      <span className="font-sans text-xs font-medium text-slate-label w-14 shrink-0">
                        {subject.name}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(score => (
                          <button
                            key={score}
                            onClick={() => handleScore(subject.id, score)}
                            className={`w-9 h-9 rounded text-sm font-medium transition-all ${
                              scores[subject.id] === score
                                ? 'bg-purple text-white shadow scale-105'
                                : 'bg-surface text-slate-body hover:bg-border'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-sm text-slate-label">内申合計</span>
                    <span className="font-display text-xl font-bold text-purple tabular-nums">
                      {totalReport} <span className="text-sm text-slate-body">/ 45</span>
                    </span>
                  </div>
                  {!hasInput && (
                    <p className="font-sans text-xs text-slate-label mt-2">
                      5教科以上入力すると結果が表示されます
                    </p>
                  )}
                </div>
              </Card>
            </FadeIn>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!hasInput ? (
              <FadeIn delay={0.2}>
                <Card className="text-center py-16">
                  <p className="font-sans text-slate-body text-lg mb-2">📝</p>
                  <p className="font-sans text-slate-body">
                    左のフォームに成績を入力してください
                  </p>
                </Card>
              </FadeIn>
            ) : (
              <div className="space-y-8">
                {/* Summary */}
                <FadeIn delay={0.1}>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="font-sans text-sm text-slate-label">
                      {totalCount}校がマッチ（偏差値{deviation} / 内申{totalReport}点）
                    </span>
                  </div>
                </FadeIn>

                {/* Hints */}
                {hints.length > 0 && (
                  <FadeIn delay={0.15}>
                    <Card className="bg-purple-surface border-purple/20">
                      <ul className="space-y-1">
                        {hints.map((hint, i) => (
                          <li key={i} className="font-sans text-sm text-navy">{hint}</li>
                        ))}
                      </ul>
                    </Card>
                  </FadeIn>
                )}

                {/* Safe */}
                {matches.safe.length > 0 && (
                  <TierSection title="安全圏" count={matches.safe.length} color="green" items={matches.safe} deviation={deviation} />
                )}

                {/* Borderline */}
                {matches.borderline.length > 0 && (
                  <TierSection title="ボーダー" count={matches.borderline.length} color="yellow" items={matches.borderline} deviation={deviation} />
                )}

                {/* Reach */}
                {matches.reach.length > 0 && (
                  <TierSection title="挑戦" count={matches.reach.length} color="red" items={matches.reach} deviation={deviation} />
                )}

                {totalCount === 0 && (
                  <FadeIn>
                    <Card className="text-center py-12">
                      <p className="font-sans text-slate-body">
                        条件に合う学校が見つかりません。偏差値を上げてみてください。
                      </p>
                    </Card>
                  </FadeIn>
                )}

                {/* Disclaimer */}
                <FadeIn>
                  <p className="font-sans text-xs text-slate-label text-center">
                    この結果は目安です。実際の合格判定は各校の選抜方法により異なります。
                  </p>
                </FadeIn>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function tierOrder(t: Tier): number {
  return t === 'safe' ? 0 : t === 'borderline' ? 1 : 2
}

function TierSection({ title, count, color, items, deviation }: {
  title: string
  count: number
  color: 'green' | 'yellow' | 'red'
  items: MatchResult[]
  deviation: number
}) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? items : items.slice(0, 6)

  const colorMap = {
    green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    red: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  }
  const c = colorMap[color]

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
        <h3 className="font-sans text-sm font-semibold text-navy">{title}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.badge}`}>{count}校</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shown.map(m => (
          <Link key={`${m.id}-${m.courseName}`} to={`/saitama/highschool/${m.id}`}>
            <div className={`rounded-lg border ${c.border} ${c.bg} p-3 hover:shadow-md transition-shadow`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-sans text-sm font-semibold text-navy truncate">{m.shortName}</p>
                  <p className="font-sans text-xs text-slate-body">{m.courseName}</p>
                </div>
                <DevBadge score={m.schoolDev} />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  m.type === 'public' ? 'bg-purple-surface text-purple' : 'bg-orange-50 text-orange-600'
                }`}>
                  {m.type === 'public' ? '公立' : '私立'}
                </span>
                <span className="font-sans text-[10px] text-slate-label">
                  差{deviation - m.schoolDev >= 0 ? '+' : ''}{deviation - m.schoolDev}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {items.length > 6 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="font-sans text-sm text-purple hover:text-purple-hover mt-2 block mx-auto"
        >
          すべて表示（あと{items.length - 6}校）
        </button>
      )}
    </div>
  )
}
