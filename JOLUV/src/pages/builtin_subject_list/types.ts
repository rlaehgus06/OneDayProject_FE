export interface Subject {
  id: number;
  name: string;
  credit: number;
  grade: string;
  category: string;
  needsRetake: boolean;
}

export type SortType = 'name' | 'grade' | 'credit';
export type Semester = '1학기' | '2학기' | '계절학기';