import { Link, useParams } from 'react-router-dom'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'
import DevBadge from '../components/ui/DevBadge'
import { useSchools, useRatios } from '../hooks/useData'
import type { RatioEntry, RatioYear } from '../types'

export default function SchoolDetail() {
  const { id } = useParams<{ id: string }>()
  const { schools } = useSchools()
  const { ratios } = useRatios()

  const school = schools.find(s => s.id === id)

  const uniqueCourses = school
    ? school.courses.filter((c, i, arr) =>
        arr.findIndex(x => x.name === c.name && x.deviation_score.hokushin === c.deviation_score.hokushin) === i
      )
    : []

  if (!school) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <p className="font-sans text-slate-body text-center py-12">
              高校が見つかりませんでした
            </p>
            <Link to="/saitama" className="font-sans text-purple hover:text-purple-hover text-center block">
              一覧に戻る
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const schoolRatios = ratios.flatMap((year: RatioYear) =>
    year.data.filter((r: RatioEntry) => r.school_id === id)
  )

  const getSelectionBars = (criteria: any) => {
    const first = criteria.first_selection
    const second = criteria.second_selection
    const total = first.academic_points + first.report_points + first.interview_points

    return (
      <div className="space-y-4">
        {/* First Selection */}
        <div>
          <p className="font-sans text-sm font-medium text-slate-label mb-2">第1次選抜</p>
          <div className="space-y-2">
            <ProgressBar label="学力検査" value={first.academic_points} total={total} color="bg-purple" />
            <ProgressBar label="内申点" value={first.report_points} total={total} color="bg-blue-500" />
            {first.interview_points > 0 && (
              <ProgressBar label="面接" value={first.interview_points} total={total} color="bg-green-500" />
            )}
          </div>
          <p className="font-sans text-xs text-slate-body mt-2">
            総合点: <span className="tabular-nums">{total}</span>
          </p>
        </div>

        {/* Second Selection */}
        <div>
          <p className="font-sans text-sm font-medium text-slate-label mb-2">第2次選抜</p>
          <div className="space-y-2">
            <ProgressBar label="学力検査" value={second.academic_points} total={total} color="bg-purple" />
            <ProgressBar label="内申点" value={second.report_points} total={total} color="bg-blue-500" />
            {second.interview_points > 0 && (
              <ProgressBar label="面接" value={second.interview_points} total={total} color="bg-green-500" />
            )}
          </div>
          <p className="font-sans text-xs text-slate-body mt-2">
            総合点: <span className="tabular-nums">{total}</span>
          </p>
        </div>

        <p className="font-sans text-xs text-slate-body">
          内申比率: {criteria.year_ratio}
        </p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <FadeIn>
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link to="/" className="font-sans text-slate-body hover:text-purple">トップ</Link></li>
              <li className="text-slate-body">/</li>
              <li><Link to="/saitama" className="font-sans text-slate-body hover:text-purple">埼玉県</Link></li>
              <li className="text-slate-body">/</li>
              <li className="font-sans text-navy font-medium">{school.name}</li>
            </ol>
          </nav>
        </FadeIn>

        {/* School Header */}
        <FadeIn delay={0.1}>
          <Card className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
              {school.name}
            </h1>
            {school.short_name && (
              <p className="font-sans text-xl text-slate-body mb-4">{school.short_name}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                school.type === 'public' ? 'bg-purple-surface text-purple' : 'bg-orange-50 text-orange-600'
              }`}>
                {school.type === 'public' ? '公立' : '私立'}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                {school.gender === 'male' ? '男子' : school.gender === 'female' ? '女子' : '共学'}
              </span>
            </div>
            <p className="font-sans text-slate-body">
              📍 {school.address}
            </p>
            {school.url && (
              <a
                href={school.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-purple hover:text-purple-hover text-sm inline-block mt-2"
              >
                公式サイト →
              </a>
            )}
          </Card>
        </FadeIn>

        {/* Courses Table */}
        <FadeIn delay={0.2}>
          <Card className="mb-8">
            <h2 className="font-display text-xl font-bold text-navy mb-4">学科</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="font-sans text-sm font-medium text-slate-label text-left py-3 px-4">学科</th>
                    <th className="font-sans text-sm font-medium text-slate-label text-center py-3 px-4">偏差値</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueCourses.map((course, index) => (
                    <tr key={`${course.name}-${index}`} className={index === uniqueCourses.length - 1 ? '' : 'border-b border-border'}>
                      <td className="font-sans text-navy py-3 px-4">{course.name}</td>
                      <td className="py-3 px-4 text-center">
                        <DevBadge score={course.deviation_score.hokushin} />
                        {course.deviation_score.note && (
                          <p className="font-sans text-xs text-slate-body mt-1">{course.deviation_score.note}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </FadeIn>

        {/* Selection Criteria */}
        {uniqueCourses.some(c => c.selection_criteria) && (
          <FadeIn delay={0.3}>
            <Card className="mb-8">
              <h2 className="font-display text-xl font-bold text-navy mb-4">選抜基準</h2>
              <div className="space-y-6">
                {uniqueCourses
                  .filter((c: any) => c.selection_criteria)
                  .map((course: any, ci: number) => (
                    <div key={`${course.name}-${ci}`} className="border-b border-border pb-6 last:pb-0 last:border-b-0">
                      <h3 className="font-sans text-lg font-semibold text-navy mb-4">{course.name}</h3>
                      {getSelectionBars(course.selection_criteria)}
                    </div>
                  ))}
              </div>
            </Card>
          </FadeIn>
        )}

        {/* Cost Details (Private only) */}
        {school.type === 'private' && school.private_data?.cost_details && school.private_data.cost_details.annual_total > 0 && (() => {
          const c = school.private_data.cost_details
          const year1 = c.initial_total + c.annual_total + c.uniform_estimate + c.ict_device_estimate
          const year2 = c.annual_total
          const year3 = c.annual_total
          const total = year1 + year2 + year3
          const maxBar = total
          return (
          <FadeIn delay={0.35}>
            <Card className="mb-8">
              <h2 className="font-display text-xl font-bold text-navy mb-4">学費目安</h2>
              <div className="space-y-6">
                {/* 3-year breakdown bars */}
                <div className="space-y-4">
                  <h3 className="font-sans text-sm font-semibold text-slate-label">3年間費用の内訳</h3>
                  {[
                    { label: '1年目', value: year1, detail: `入学金${(c.initial_total/10000).toFixed(0)}万 + 学費${(c.annual_total/10000).toFixed(0)}万 + 制服${(c.uniform_estimate/10000).toFixed(0)}万 + ICT${(c.ict_device_estimate/10000).toFixed(0)}万`, color: 'bg-purple' },
                    { label: '2年目', value: year2, detail: `学費（授業料+施設費）`, color: 'bg-blue-500' },
                    { label: '3年目', value: year3, detail: `学費（授業料+施設費）`, color: 'bg-green-500' },
                  ].map(row => (
                    <div key={row.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-sans text-sm font-medium text-navy">{row.label}</span>
                        <span className="font-sans text-sm font-semibold text-navy tabular-nums">¥{row.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-3">
                        <div className={`${row.color} h-3 rounded-full transition-all duration-500`} style={{ width: `${(row.value / maxBar) * 100}%` }} />
                      </div>
                      <p className="font-sans text-[10px] text-slate-label mt-1">{row.detail}</p>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-base font-bold text-navy">3年間総額</span>
                      <span className="font-display text-xl font-bold text-navy tabular-nums">¥{total.toLocaleString()}</span>
                    </div>
                    {c.donation_status !== 'なし' && c.donation_status !== '調査中' && (
                      <p className="font-sans text-xs text-orange-600 mt-2">
                        ⚠ 寄付金: {c.donation_status}（上記総額に含まず）
                      </p>
                    )}
                  </div>
                </div>

                {/* Monthly fee reference */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="font-sans text-xs text-slate-label">月額授業料</p>
                    <p className="font-sans text-sm font-semibold text-navy tabular-nums">¥{c.tuition_monthly.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-slate-label">施設費（年額）</p>
                    <p className="font-sans text-sm text-navy tabular-nums">¥{c.facility_fee_annual.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs text-slate-label">就学支援金</p>
                    <p className="font-sans text-sm text-green-600 tabular-nums">-¥120,000/年</p>
                  </div>
                </div>

                {c.note && (
                  <p className="font-sans text-xs text-slate-body pt-2 border-t border-border">{c.note}</p>
                )}
                <p className="font-sans text-xs text-slate-label">
                  出典: 学校公式パンフレット・入学案内資料。金額は目安です。正確な金額は学校へお問い合わせください。
                </p>
              </div>
            </Card>
          </FadeIn>
          )
        })()}

        {/* Ratio History */}
        {schoolRatios.length > 0 && (
          <FadeIn delay={0.4}>
            <Card>
              <h2 className="font-display text-xl font-bold text-navy mb-4">倍率推移</h2>
              <div className="space-y-4">
                {ratios.map((year: RatioYear) => {
                  const yearData = year.data.filter((r: RatioEntry) => r.school_id === id)
                  if (yearData.length === 0) return null
                  return (
                    <div key={year.year}>
                      <p className="font-sans text-sm font-medium text-slate-label mb-2">{year.year}年度</p>
                      <div className="flex flex-wrap gap-2">
                        {yearData.map((entry: RatioEntry, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-surface rounded-lg text-sm"
                          >
                            <span className="font-sans text-slate-body mr-1">{entry.course}:</span>
                            <span className="font-sans font-semibold text-navy tabular-nums">{entry.ratio.toFixed(1)}</span>
                            <span className="font-sans text-slate-body text-xs ml-0.5">倍</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </FadeIn>
        )}
      </div>
    </div>
  )
}

function ProgressBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = (value / total) * 100

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-sans text-xs text-slate-body">{label}</span>
        <span className="font-sans text-xs text-slate-body tabular-nums">{value}点</span>
      </div>
      <div className="w-full bg-border rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
