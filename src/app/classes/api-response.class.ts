export class ApiResponse<T> {
  code: string;
  message: string;
  data: T;

  constructor(code: string, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}
