export interface PromiseError {
  error: {
    code: number;
    message: string;
    details?: any;
  };
}
