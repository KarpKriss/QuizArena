import approvedRegistry from './approved_registry.json'
import polskaQuestionBank from './polska_approved_current_97.json'
import type { QuestionLookupResult, QuestionMode, QuestionRecord } from './types'

export type { QuestionLookupResult } from './types'

type ImportedQuestion = {
  id: string
  category: string
  mode: QuestionMode
  difficulty: string | null
  question: string
  approval_status: string
  content_validation_status: string
  answer_data: null
}

type ImportedBank = {
  questions: ImportedQuestion[]
}

type RegistryBank = {
  category: string
  prefix: string
  exact_question_text_in_package: boolean
  composition: Record<QuestionMode, number>
}

const importedBanks: ImportedBank[] = [polskaQuestionBank as unknown as ImportedBank]

const toQuestionRecord = (record: ImportedQuestion): QuestionRecord => ({
  id: record.id,
  category: record.category,
  mode: record.mode,
  difficulty: record.difficulty,
  question: record.question,
  answerType: null,
  acceptedAnswers: [],
  rejectedAnswers: [],
  targetAnswer: null,
  tolerance: null,
  unit: null,
  source: null,
  sourceDate: null,
  aliases: [],
  verificationRules: [],
  notes: null,
  approvalStatus: record.approval_status,
  contentValidationStatus: record.content_validation_status,
})

export const importedQuestions = importedBanks.flatMap((bank) => bank.questions.map(toQuestionRecord))
export const questionsById = new Map(importedQuestions.map((question) => [question.id, question]))

const modeCode: Record<QuestionMode, string> = {
  Ruletka: 'RR',
  Gladiatorzy: 'GL',
  Duo: 'DUO',
  Licytacja: 'LIC',
  Sojusz: 'SOJ',
  Target: 'TAR',
}

const modeByCode = new Map(Object.entries(modeCode).map(([mode, code]) => [code, mode as QuestionMode]))
const registryBanks = approvedRegistry.banks as RegistryBank[]

const normalizeId = (id: string) => id.trim().toUpperCase()

const isPendingSourceTransfer = (id: string) => {
  const match = /^([A-Z]{3})-([A-Z]+)-(\d{2})$/.exec(id)
  if (!match) return undefined

  const [, prefix, code, ordinal] = match
  const bank = registryBanks.find((entry) => entry.prefix === prefix && !entry.exact_question_text_in_package)
  const mode = modeByCode.get(code)
  if (!bank || !mode || Number(ordinal) < 1 || Number(ordinal) > bank.composition[mode]) return undefined

  return { id, category: bank.category, status: 'pending-source-transfer' as const }
}

export const lookupQuestion = (rawId: string): QuestionLookupResult => {
  const id = normalizeId(rawId)
  const question = questionsById.get(id)
  if (question) return { status: 'found', question }

  return isPendingSourceTransfer(id) ?? { status: 'not-found' }
}
