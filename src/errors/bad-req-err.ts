import http2 from 'http2';

export default class BadReqError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_BAD_REQUEST;
  }
}
