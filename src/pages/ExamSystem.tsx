import { useState } from 'react'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'
import { useExamSystem } from '../hooks/useData'

export default function ExamSystem() {
  const { exam, loading } = useExamSystem()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-slate-body text-center py-12">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!exam) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <p className="font-sans text-slate-body text-center py-12">
              データの読み込みに失敗しました
            </p>
          </Card>
        </div>
      </div>
    )
  }

  const faqs = [
    {
      q: '学力検査の科目と配点は？',
      a: `5教科（国語、社会、数学、理科、英語）で各教科${exam.system_overview.academic_test.score_per_subject}点、計${exam.system_overview.academic_test.total_score}点満点です。`,
    },
    {
      q: '内申点の換算方法は？',
      a: `内申点は3年分の成績を使用し、各学年の比重は${exam.report_card.year_ratios.map(r => r.ratio).join('、')}などのパターンがあります。最大${exam.report_card.year_ratios[0].max_score}点（15×3）までです。`,
    },
    {
      q: '面接はありますか？',
      a: exam.interview.all_students
        ? 'はい、全員が面接を受けます。'
        : '一部の高校で面接があります。',
    },
    {
      q: '出願の時期は？',
      a: '通常1月中に出願を行います。詳しい日程は以下のスケジュールを確認してください。',
    },
  ]

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4 text-center">
            {exam.title}
          </h1>
          <p className="font-sans text-slate-body text-center mb-8">
            {exam.prefecture} / {exam.year}年度
          </p>
          {exam.source_url && (
            <a
              href={exam.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-purple hover:text-purple-hover text-sm text-center block mb-8"
            >
              公式情報ソース →
            </a>
          )}
        </FadeIn>

        {/* Timeline */}
        <FadeIn delay={0.1}>
          <Card className="mb-8">
            <h2 className="font-display text-xl font-bold text-navy mb-6">入試スケジュール</h2>
            <div className="space-y-4">
              {Object.entries(exam.schedule).map(([key, value]) => {
                const date = Array.isArray(value) ? value[0] : value
                const desc = Array.isArray(value) ? value[1] : null
                return (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="font-sans text-sm font-medium text-slate-label w-24 flex-shrink-0">
                      {key}:
                    </span>
                    <div>
                      <span className="font-sans text-navy">{date}</span>
                      {desc && <p className="font-sans text-xs text-slate-body mt-1">{desc}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </FadeIn>

        {/* Academic Test */}
        <FadeIn delay={0.2}>
          <Card className="mb-8">
            <h2 className="font-display text-xl font-bold text-navy mb-4">学力検査</h2>
            <div className="space-y-3">
              <div>
                <p className="font-sans text-sm text-slate-body mb-2">教科</p>
                <div className="flex flex-wrap gap-2">
                  {exam.system_overview.academic_test.subjects.map(subject => (
                    <span
                      key={subject}
                      className="inline-flex items-center px-3 py-1 bg-purple-surface text-purple rounded-lg text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-sans text-sm text-slate-body mb-1">配点</p>
                <p className="font-sans text-navy tabular-nums">
                  各教科{exam.system_overview.academic_test.score_per_subject}点 / 計{exam.system_overview.academic_test.total_score}点
                </p>
              </div>
              {exam.system_overview.academic_test.note && (
                <p className="font-sans text-xs text-slate-body">
                  {exam.system_overview.academic_test.note}
                </p>
              )}
            </div>
          </Card>
        </FadeIn>

        {/* Report Card */}
        <FadeIn delay={0.3}>
          <Card className="mb-8">
            <h2 className="font-display text-xl font-bold text-navy mb-4">内申点</h2>
            <div className="space-y-3">
              <p className="font-sans text-slate-body text-sm">
                {exam.report_card.description}
              </p>
              <div>
                <p className="font-sans text-sm text-slate-body mb-2">内申比率（3年間）</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {exam.report_card.year_ratios.map((ratio, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center px-4 py-3 bg-surface rounded-lg"
                    >
                      <span className="font-display text-lg font-semibold text-purple tabular-nums">
                        {ratio.ratio}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {exam.report_card.conversions && exam.report_card.conversions.length > 0 && (
                <div>
                  <p className="font-sans text-sm text-slate-body mb-2">換算係数</p>
                  <div className="flex flex-wrap gap-2">
                    {exam.report_card.conversions.map((conv, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm"
                      >
                        ×{conv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {exam.report_card.note && (
                <p className="font-sans text-xs text-slate-body">
                  {exam.report_card.note}
                </p>
              )}
            </div>
          </Card>
        </FadeIn>

        {/* Interview */}
        <FadeIn delay={0.4}>
          <Card className="mb-8">
            <h2 className="font-display text-xl font-bold text-navy mb-4">面接</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm text-slate-body">対象:</span>
                <span className="font-sans text-navy">
                  {exam.interview.all_students ? '全員' : '一部の高校'}
                </span>
              </div>
              {exam.interview.types && exam.interview.types.length > 0 && (
                <div>
                  <p className="font-sans text-sm text-slate-body mb-2">面接種別</p>
                  <div className="flex flex-wrap gap-2">
                    {exam.interview.types.map((type, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-sans text-sm text-slate-body">基礎点:</span>
                <span className="font-sans text-navy tabular-nums">{exam.interview.base_score}点</span>
              </div>
              {exam.interview.multipliers && exam.interview.multipliers.length > 0 && (
                <div>
                  <p className="font-sans text-sm text-slate-body mb-2">評価段階</p>
                  <div className="space-y-1">
                    {exam.interview.multipliers.map((mult, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-sans text-slate-body">段階{index + 1}</span>
                        <span className="font-sans text-navy tabular-nums">
                          {mult.multiplier}点 〜 {mult.max_score}点
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {exam.interview.note && (
                <p className="font-sans text-xs text-slate-body">
                  {exam.interview.note}
                </p>
              )}
            </div>
          </Card>
        </FadeIn>

        {/* FAQ */}
        <FadeIn delay={0.5}>
          <Card>
            <h2 className="font-display text-xl font-bold text-navy mb-6">よくある質問</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border last:border-b-0 pb-3 last:pb-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="font-sans font-medium text-navy">{faq.q}</span>
                    <span className="text-purple text-xl font-light">
                      {openFaq === index ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === index && (
                    <p className="font-sans text-slate-body text-sm mt-3 pl-4 border-l-2 border-purple">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
