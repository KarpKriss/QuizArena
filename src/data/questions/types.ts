export const questionModes = ['Ruletka', 'Gladiatorzy', 'Duo', 'Licytacja', 'Sojusz', 'Target'] as const

export type QuestionMode = typeof questionModes[number]

export type AcceptedAnswer = {
  canonical: string
  aliases?: string[]
}

export type QuestionRecord = {
  id: string
  category: string
  mode: QuestionMode
  difficulty: string | null
  question: string
  answerType: string | null
  acceptedAnswers: AcceptedAnswer[]
  rejectedAnswers: string[]
  targetAnswer: number | null
  tolerance: number | null
  unit: string | null
  source: string | null
  sourceDate: string | null
  aliases: string[]
  verificationRules: string[]
  notes: string | null
  approvalStatus: string
  contentValidationStatus: string
}

export type PendingSourceTransfer = {
  id: string
  category: string
  status: 'pending-source-transfer'
}

export type QuestionLookupResult =
  | { status: 'found'; question: QuestionRecord }
  | PendingSourceTransfer
  | { status: 'not-found' }
