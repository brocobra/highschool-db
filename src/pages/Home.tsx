import { Link } from 'react-router-dom'
import { Search, GraduationCap, TrendingUp, Calculator } from 'lucide-react'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'
import DevBadge from '../components/ui/DevBadge'
import { useSchools } from '../hooks/useData'

export default function Home() {
  const { schools, loading } = useSchools()

  const topSchools = schools
    .filter(s => s.courses.length > 0)
    .map(s => ({
      ...s,
      uniqueCourses: s.courses.filter((c, i, arr) =>
        arr.findIndex(x => x.name === c.name && x.deviation_score.hokushin === c.deviation_score.hokushin) === i
      )
    }))
    .sort((a, b) => {
      const maxA = Math.max(...a.uniqueCourses.map(c => c.deviation_score.hokushin))
      const maxB = Math.max(...b.uniqueCourses.map(c => c.deviation_score.hokushin))
      return maxB - maxA
    })
    .slice(0, 6)

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-surface to-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-navy text-center mb-6">
              埼玉県の高校受験、もっとシンプルに。
            </h1>
            <p className="font-sans text-slate-body text-lg md:text-xl text-center mb-12 max-w-2xl mx-auto">
              177校のデータ、偏差値、倍率、入試制度を一目で確認
            </p>
            <div className="max-w-xl mx-auto">
              <Link
                to="/saitama"
                className="flex items-center w-full px-6 py-4 bg-white border border-border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
              >
                <Search className="text-slate-body mr-3" size={20} />
                <span className="font-sans text-slate-label">高校名で検索...</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '177', label: '掲載高校数', icon: GraduationCap },
              { value: '3年分', label: '倍率データ', icon: TrendingUp },
              { value: '無料', label: '内申計算機', icon: Calculator },
            ].map((stat, index) => (
              <FadeIn key={stat.label} delay={index * 0.1}>
                <Card className="text-center">
                  <stat.icon className="mx-auto mb-4 text-purple" size={32} />
                  <div className="font-display text-4xl font-bold text-navy tabular-nums mb-2">{stat.value}</div>
                  <div className="font-sans text-slate-body">{stat.label}</div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Schools */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy text-center mb-12">
              人気の高校
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="font-sans text-slate-body text-center col-span-full">読み込み中...</p>
            ) : (
              topSchools.map((school, index) => (
                <FadeIn key={school.id} delay={index * 0.05}>
                  <Link to={`/saitama/highschool/${school.id}`}>
                    <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-navy mb-1">{school.name}</h3>
                          {school.short_name && (
                            <p className="font-sans text-sm text-slate-body">{school.short_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          school.type === 'public' ? 'bg-purple-surface text-purple' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {school.type === 'public' ? '公立' : '私立'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                          {school.gender === 'male' ? '男子' : school.gender === 'female' ? '女子' : '男女'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {school.uniqueCourses.slice(0, 3).map((course, ci) => (
                          <DevBadge key={`${course.name}-${ci}`} score={course.deviation_score.hokushin} />
                        ))}
                      </div>
                    </Card>
                  </Link>
                </FadeIn>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-navy text-center mb-12">
              使い方
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '高校一覧', desc: '偏差値・学科から探す', link: '/saitama', icon: '🔍' },
              { title: '内申計算機', desc: '内申点を計算する', link: '/saitama/calculator', icon: '🧮' },
              { title: '入試制度', desc: '埼玉県の入試情報', link: '/saitama/exam-system', icon: '📚' },
              { title: '学費目安', desc: '私立高校の学費一覧', link: '/saitama/budget', icon: '💰' },
            ].map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.1}>
                <Link to={item.link}>
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full text-center">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="font-display text-lg font-semibold text-navy mb-2">{item.title}</h3>
                    <p className="font-sans text-sm text-slate-body">{item.desc}</p>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
