import { useState } from 'react'
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

export default function Calculator() {
  const { schools } = useSchools()
  const [scores, setScores] = useState<Record<string, number>>({})
  const [selectedSchool, setSelectedSchool] = useState<string>('')

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

  const handleScoreChange = (subjectId: string, score: number) => {
    setScores(prev => ({ ...prev, [subjectId]: score }))
  }

  const getScoreButtons = (subjectId: string) => {
    return [1, 2, 3, 4, 5].map(score => (
      <button
        key={score}
        onClick={() => handleScoreChange(subjectId, score)}
        className={`w-12 h-12 rounded-lg font-medium transition-all ${
          scores[subjectId] === score
            ? 'bg-purple text-white shadow-lg scale-105'
            : 'bg-surface text-slate-body hover:bg-border'
        }`}
      >
        {score}
      </button>
    ))
  }

  const calculateResult = () => {
    if (!selectedSchool) return null

    const school = schools.find(s => s.id === selectedSchool)
    if (!school) return null

    const course = school.courses[0]
    const criteria = course?.selection_criteria

    if (!criteria) return null

    // Convert report points (assuming max 45 points * multiplier)
    const reportMultiplier = criteria.first_selection.report_points / 45
    const convertedReport = totalScore * reportMultiplier

    const academic = criteria.first_selection.academic_points
    const interview = criteria.first_selection.interview_points
    const total = academic + convertedReport + interview

    return {
      academic,
      report: convertedReport,
      interview,
      total,
      criteria,
    }
  }

  const result = calculateResult()

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-8 text-center">
            内申点計算機
          </h1>
          <p className="font-sans text-slate-body text-center mb-8">
            9教科の成績を入力してください（各教科1〜5点）
          </p>
        </FadeIn>

        {/* Subject Scores */}
        <FadeIn delay={0.1}>
          <Card className="mb-8">
            <h2 className="font-display text-xl font-bold text-navy mb-6">成績入力</h2>
            <div className="space-y-4">
              {subjects.map(subject => (
                <div key={subject.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="font-sans text-sm font-medium text-slate-label w-20">
                    {subject.name}
                  </span>
                  <div className="flex gap-2">
                    {getScoreButtons(subject.id)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Display */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-sans text-lg font-medium text-slate-label">合計</span>
                <span className="font-display text-3xl font-bold text-purple tabular-nums">
                  {totalScore} <span className="text-xl text-slate-body">/ 45</span>
                </span>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* School Selection */}
        <FadeIn delay={0.2}>
          <Card className="mb-8">
            <h2 className="font-display text-xl font-bold text-navy mb-4">高校を選択</h2>
            <select
              value={selectedSchool}
              onChange={e => setSelectedSchool(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-border rounded-lg font-sans text-navy focus:outline-none focus:ring-2 focus:ring-purple"
            >
              <option value="">-- 高校を選択してください --</option>
              {schools
                .filter(s => s.courses.length > 0 && s.courses[0].selection_criteria)
                .sort((a, b) => {
                  const maxA = Math.max(...a.courses.map(c => c.deviation_score.hokushin))
                  const maxB = Math.max(...b.courses.map(c => c.deviation_score.hokushin))
                  return maxB - maxA
                })
                .map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
            </select>

            {selectedSchool && (
              <div className="mt-4 p-4 bg-purple-surface rounded-lg">
                {(() => {
                  const school = schools.find(s => s.id === selectedSchool)
                  const course = school?.courses[0]
                  return (
                    <>
                      <p className="font-display font-semibold text-navy">{school?.name}</p>
                      <p className="font-sans text-sm text-slate-body">{course?.name}</p>
                      <DevBadge score={course?.deviation_score.hokushin || 0} className="mt-2" />
                    </>
                  )
                })()}
              </div>
            )}
          </Card>
        </FadeIn>

        {/* Results */}
        {result && (
          <FadeIn delay={0.3}>
            <Card>
              <h2 className="font-display text-xl font-bold text-navy mb-6">想定総合点</h2>
              <div className="space-y-4">
                <ResultRow label="学力検査" value={result.academic} color="purple" />
                <ResultRow label="内申点換算" value={Math.round(result.report)} color="blue" />
                {result.interview > 0 && (
                  <ResultRow label="面接" value={result.interview} color="green" />
                )}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-navy">総合点</span>
                    <span className="font-display text-3xl font-bold text-purple tabular-nums">
                      {result.total}
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-sans text-xs text-slate-body mt-6">
                ※これはあくまで目安です。実際の入試結果は異なる場合があります。
              </p>
            </Card>
          </FadeIn>
        )}
      </div>
    </div>
  )
}

function ResultRow({ label, value, color }: { label: string; value: number; color: string }) {
  const colorClasses = {
    purple: 'text-purple',
    blue: 'text-blue-500',
    green: 'text-green-500',
  }

  return (
    <div className="flex items-center justify-between py-2">
      <span className="font-sans text-slate-body">{label}</span>
      <span className={`font-display text-xl font-semibold tabular-nums ${colorClasses[color as keyof typeof colorClasses]}`}>
        {value}点
      </span>
    </div>
  )
}
