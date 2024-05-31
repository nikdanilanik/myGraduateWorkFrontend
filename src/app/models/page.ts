export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
  sort: any;
  numberOfElements: number;
  first: boolean;
}
