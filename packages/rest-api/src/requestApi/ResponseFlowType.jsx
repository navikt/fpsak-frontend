export type SuccessResponse = {
  data: any,
  status: string,
  headers: {
    location: string,
  }
}
export type ErrorResponse = {
  response: {
    data: any
  }
}

export type Response = SuccessResponse | ErrorResponse
