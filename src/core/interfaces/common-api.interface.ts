export interface IQueryErrorResponse {
  type: string;
  status: number;
  title: string;
  detail: string;
  instance: string;
}

export interface ICommandErrorResponse {
  type: string;
  status: number;
  title: string;
  detail: string;
  instance: string;
  errors: {
    detail: string;
    pointer: string;
    type: string;
  }[];
}

export interface IPaginatedQueryResponse<T> {
  data: T[];
  metadata: {
    nextCursor?: string;
    pageSize: number;
    totalHits: number;
  };
}
