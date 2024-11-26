import { CODE_400 } from '../utils/constants'

class ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  type?: boolean;

  constructor(statusCode: number, data: T, message: string, type: boolean) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.type = type;

    statusCode < CODE_400;
  }
}

export default ApiResponse;

