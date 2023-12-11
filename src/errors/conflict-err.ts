import http2 from "http2";

export class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_CONFLICT;
  }
}
