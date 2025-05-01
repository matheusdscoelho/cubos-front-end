export type MovieFilters = {
  search?: string;
  durationMin?: string;
  durationMax?: string;
  dateStart?: string;
  dateEnd?: string;
  minBudget?: string;
  maxBudget?: string;
  page?: number;
  limit?: number;
};

export type Movie = {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  budget: number;
  image: string;
};
