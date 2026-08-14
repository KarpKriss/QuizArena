import type { QuestionRecord } from './types'

export type VerificationResult =
  | { status: 'correct' }
  | { status: 'incorrect' }
  | { status: 'exact-target' }
  | { status: 'within-target-tolerance' }
  | { status: 'missing-answer-key' }

export const normalizeAnswer = (answer: string) => answer
  .trim()
  .toLocaleLowerCase('pl-PL')
  .replace(/\s+/g, ' ')
  .replace(/\.$/, '')

export const verifyTextAnswer = (answer: string, question: QuestionRecord): VerificationResult => {
  if (question.acceptedAnswers.length === 0) return { status: 'missing-answer-key' }

  const normalizedAnswer = normalizeAnswer(answer)
  const accepted = question.acceptedAnswers.some(({ canonical, aliases = [] }) =>
    [canonical, ...aliases].some((value) => normalizeAnswer(value) === normalizedAnswer),
  )

  return accepted ? { status: 'correct' } : { status: 'incorrect' }
}

export const verifyTargetAnswer = (answer: string, question: QuestionRecord): VerificationResult => {
  if (question.targetAnswer == null || question.tolerance == null) return { status: 'missing-answer-key' }

  const numericAnswer = Number(answer.trim())
  if (!Number.isFinite(numericAnswer)) return { status: 'incorrect' }
  if (numericAnswer === question.targetAnswer) return { status: 'exact-target' }

  return Math.abs(numericAnswer - question.targetAnswer) <= question.tolerance
    ? { status: 'within-target-tolerance' }
    : { status: 'incorrect' }
}

export const verifyQuestionAnswer = (answer: string, question: QuestionRecord): VerificationResult => (
  question.mode === 'Target'
    ? verifyTargetAnswer(answer, question)
    : verifyTextAnswer(answer, question)
)
