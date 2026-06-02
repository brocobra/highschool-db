export interface DeviationScore {
  hokushin: number
  note?: string
}

export interface SelectionRound {
  academic_points: number
  report_points: number
  interview_points: number
  special_test_points: number
}

export interface SelectionCriteria {
  year_ratio: string
  first_selection: SelectionRound
  second_selection: SelectionRound
}

export interface Course {
  name: string
  tags?: string[]
  deviation_score: DeviationScore
  selection_criteria?: SelectionCriteria
}

export interface CostDetails {
  initial_total: number
  annual_total: number
  tuition_monthly: number
  facility_fee_annual: number
  donation_status: string
  uniform_estimate: number
  ict_device_estimate: number
  note?: string
  source?: string
}

export interface PrivateData {
  cost_details: CostDetails
}

export interface School {
  id: string
  name: string
  short_name?: string
  type: 'public' | 'private'
  category: 'prefectural' | 'municipal' | 'private'
  gender: 'mixed' | 'male' | 'female'
  address: string
  postal_code?: string
  url?: string
  courses: Course[]
  status: 'active' | 'closing' | 'new'
  private_data?: PrivateData
}

export interface RatioEntry {
  school_id: string
  course: string
  ratio: number
}

export interface RatioYear {
  year: number
  description: string
  source?: string
  data: RatioEntry[]
}

export interface ExamSystem {
  prefecture: string
  year: number
  title: string
  source: string
  source_url: string
  system_overview: {
    district: string
    selection_types: string[]
    academic_test: {
      subjects: string[]
      score_per_subject: number
      total_score: number
      note: string
    }
  }
  schedule: Record<string, string | string[]>
  report_card: {
    description: string
    year_ratios: { ratio: string; max_score: number }[]
    conversions: number[]
    note: string
  }
  interview: {
    all_students: boolean
    types: string[]
    base_score: number
    multipliers: { multiplier: number; max_score: number }[]
    note: string
  }
}
