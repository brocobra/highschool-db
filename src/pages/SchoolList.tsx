import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import FadeIn from '../components/ui/FadeIn'
import Card from '../components/ui/Card'
import DevBadge from '../components/ui/DevBadge'
import { useSchools } from '../hooks/useData'

export default function SchoolList() {
  const { schools, loading } = useSchools()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'public' | 'private',
    gender: 'all' as 'all' | 'mixed' | 'male' | 'female',
    category: 'all' as 'all' | 'regular' | 'commercial' | 'industrial' | 'agricultural' | 'special',
    area: 'all' as string,
    yearRatio: 'all' as string,
    minDeviation: 75,
  })

  const areas = useMemo(() => {
    const citySet = new Set<string>()
    schools.forEach(s => {
      const m = s.address.match(/^(.+?[市区町村])/)
      if (m) citySet.add(m[1])
    })
    return ['all', ...Array.from(citySet).sort()]
  }, [schools])

  const yearRatios = useMemo(() => {
    const ratioSet = new Set<string>()
    schools.forEach(s => {
      s.courses.forEach(c => {
        if (c.selection_criteria?.year_ratio) ratioSet.add(c.selection_criteria.year_ratio)
      })
    })
    return ['all', ...Array.from(ratioSet).sort()]
  }, [schools])

  const getSchoolCategory = (courseNames: string[]) => {
    const all = courseNames.join('・')
    if (courseNames.length === 1 && courseNames[0] === '普通科') return 'regular'
    if (/商業|ビジネス|流通|会計/.test(all)) return 'commercial'
    if (/工業|機械|電気|電子|建築|土木|情報技術/.test(all)) return 'industrial'
    if (/農業|生物|園芸|森林|食品/.test(all)) return 'agricultural'
    return 'special'
  }

  const categoryLabels: Record<string, string> = {
    all: 'すべて',
    regular: '普通',
    commercial: '商業',
    industrial: '工業',
    agricultural: '農業',
    special: '総合・特色',
  }

  const filteredSchools = useMemo(() => {
    return schools
      .map(school => ({
        ...school,
        uniqueCourses: school.courses.filter((c, i, arr) =>
          arr.findIndex(x => x.name === c.name && x.deviation_score.hokushin === c.deviation_score.hokushin) === i
        )
      }))
      .filter(school => {
        if (filters.type !== 'all' && school.type !== filters.type) return false
        if (filters.gender !== 'all' && school.gender !== filters.gender) return false
        if (filters.category !== 'all') {
          const courseNames = school.uniqueCourses.map(c => c.name)
          if (getSchoolCategory(courseNames) !== filters.category) return false
        }
        if (filters.area !== 'all') {
          if (!school.address.startsWith(filters.area)) return false
        }
        if (filters.yearRatio !== 'all') {
          const hasRatio = school.uniqueCourses.some(c => c.selection_criteria?.year_ratio === filters.yearRatio)
          if (!hasRatio) return false
        }
        if (searchQuery && !school.name.includes(searchQuery) && !school.short_name?.includes(searchQuery)) {
          return false
        }
        const maxDeviation = Math.max(...school.uniqueCourses.map(c => c.deviation_score.hokushin))
        if (filters.minDeviation < 75 && maxDeviation > filters.minDeviation) return false
        return true
      })
      .sort((a, b) => {
        const maxA = Math.max(...a.uniqueCourses.map(c => c.deviation_score.hokushin))
        const maxB = Math.max(...b.uniqueCourses.map(c => c.deviation_score.hokushin))
        return maxB - maxA
      })
  }, [schools, filters, searchQuery])

  return (
    <div className="pt-24 pb-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-8">
            埼玉県 高校一覧
          </h1>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.1}>
          <Card className="mb-8">
            <div className="space-y-6">
              {/* Type Filter */}
              <div>
                <label className="font-sans text-sm font-medium text-slate-label mb-3 block">
                  設立
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'public', 'private'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters(f => ({ ...f, type }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.type === type
                          ? 'bg-purple text-white'
                          : 'bg-surface text-slate-body hover:bg-border'
                      }`}
                    >
                      {type === 'all' ? 'すべて' : type === 'public' ? '公立' : '私立'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="font-sans text-sm font-medium text-slate-label mb-3 block">
                  男女
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'mixed', 'male', 'female'] as const).map(gender => (
                    <button
                      key={gender}
                      onClick={() => setFilters(f => ({ ...f, gender }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.gender === gender
                          ? 'bg-purple text-white'
                          : 'bg-surface text-slate-body hover:bg-border'
                      }`}
                    >
                      {gender === 'all' ? 'すべて' : gender === 'male' ? '男子' : gender === 'female' ? '女子' : '共学'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="font-sans text-sm font-medium text-slate-label mb-3 block">
                  学科系
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'regular', 'commercial', 'industrial', 'agricultural', 'special'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters(f => ({ ...f, category: cat }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.category === cat
                          ? 'bg-purple text-white'
                          : 'bg-surface text-slate-body hover:bg-border'
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Filter */}
              <div>
                <label className="font-sans text-sm font-medium text-slate-label mb-3 block">
                  地域
                </label>
                <select
                  value={filters.area}
                  onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-border text-sm font-sans text-navy bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                >
                  {areas.map(area => (
                    <option key={area} value={area}>
                      {area === 'all' ? 'すべて' : area}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Ratio Filter */}
              <div>
                <label className="font-sans text-sm font-medium text-slate-label mb-3 block">
                  内申比率
                </label>
                <div className="flex flex-wrap gap-2">
                  {yearRatios.map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setFilters(f => ({ ...f, yearRatio: ratio }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filters.yearRatio === ratio
                          ? 'bg-purple text-white'
                          : 'bg-surface text-slate-body hover:bg-border'
                      }`}
                    >
                      {ratio === 'all' ? 'すべて' : ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deviation Filter */}
              <div>
                <label className="font-sans text-sm font-medium text-slate-label mb-3 block">
                  偏差値上限: {filters.minDeviation === 75 ? 'すべて' : filters.minDeviation}
                </label>
                <input
                  type="range"
                  min="0"
                  max="75"
                  value={filters.minDeviation}
                  onChange={e => setFilters(f => ({ ...f, minDeviation: Number(e.target.value) }))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-purple"
                />
                <div className="flex justify-between text-xs text-slate-body mt-1">
                  <span>0</span>
                  <span>すべて</span>
                </div>
              </div>

              {/* Results count */}
              <p className="font-sans text-sm text-slate-body">
                {filteredSchools.length}校が見つかりました
              </p>
            </div>
          </Card>
        </FadeIn>

        {/* School Grid */}
        {loading ? (
          <p className="font-sans text-slate-body text-center py-12">読み込み中...</p>
        ) : filteredSchools.length === 0 ? (
          <Card>
            <p className="font-sans text-slate-body text-center py-12">
              条件に一致する高校が見つかりませんでした
            </p>
          </Card>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school, index) => (
              <FadeIn key={school.id} delay={Math.min(index * 0.03, 0.3)}>
                <Link to={`/saitama/highschool/${school.id}`}>
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
                    <div className="mb-4">
                      <h3 className="font-display text-xl font-semibold text-navy mb-1">
                        {school.name}
                      </h3>
                      {school.short_name && (
                        <p className="font-sans text-sm text-slate-body">{school.short_name}</p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        school.type === 'public' ? 'bg-purple-surface text-purple' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {school.type === 'public' ? '公立' : '私立'}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                        {school.gender === 'male' ? '男子' : school.gender === 'female' ? '女子' : '共学'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {school.uniqueCourses.map((course, ci) => (
                        <div key={`${course.name}-${ci}`} className="flex items-center gap-1">
                          <span className="font-sans text-xs text-slate-body">{course.name}:</span>
                          <DevBadge score={course.deviation_score.hokushin} />
                        </div>
                      ))}
                    </div>

                    <p className="font-sans text-sm text-slate-body">
                      📍 {school.address}
                    </p>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
