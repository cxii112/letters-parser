export interface Word {
  word: string,
  senses: Sense[]
}

export interface Sense {
  guideWord?: string,
  wordClass?: string,
  description: string
}

