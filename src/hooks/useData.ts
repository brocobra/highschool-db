import { useState, useEffect } from 'react'
import type { School, RatioYear, ExamSystem } from '../types'

const BASE = import.meta.env.BASE_URL

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${BASE}data/schools.json`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load schools')
        return res.json()
      })
      .then((data: School[]) => {
        setSchools(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { schools, loading, error }
}

export function useRatios() {
  const [ratios, setRatios] = useState<RatioYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${BASE}data/ratios.json`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load ratios')
        return res.json()
      })
      .then((data: RatioYear[]) => {
        setRatios(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { ratios, loading, error }
}

export function useExamSystem() {
  const [exam, setExam] = useState<ExamSystem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${BASE}data/exam-system.json`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load exam system')
        return res.json()
      })
      .then((data: ExamSystem) => {
        setExam(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { exam, loading, error }
}

export function useSchool(id: string, schools: School[]) {
  return schools.find(s => s.id === id) || null
}
