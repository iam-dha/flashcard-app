export interface WSGameDataTypes {
  word: string;
  definition: string;
}

export interface WSGameSessionTypes {
  _id?: string
  score: number;
  duration: number;
  scrambledWords: string[];
  correctWords: string[];
  playAt: string;
}

export interface GetWSGameHistoryParams {
  page?: number;
  limit?: number;
  sortBy?: "playAt" | "score" | "duration";
  sortOrder?: "asc" | "desc";
}

export interface MCQGameDataTypes {
  question: string;
  answer: string;
  answerList: string[];
}