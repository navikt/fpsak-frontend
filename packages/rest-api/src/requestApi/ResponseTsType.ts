export interface SuccessResponse {
  data: any;
  status: number;
  headers: {
    location?: string;
  };
}
export interface ErrorResponse {
  response: {
    data: any;
    status: number;
    statusText?: string;
  };
}

export type Response = SuccessResponse | ErrorResponse
