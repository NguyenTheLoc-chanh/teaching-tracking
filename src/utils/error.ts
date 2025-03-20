/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthError } from "next-auth";

export class CustomAuthError extends AuthError {
  static type: string;

  constructor(message?: any) {
    super();

    this.type = message;
  }
}

export class InvalidUserNameError extends AuthError {
           name = "InvalidUserNameError";
    static type = "Tên đăng nhập không tồn tại!"
}
export class InvalidPasswordError extends AuthError {
  name = "InvalidPasswordError";
  static type = "Mật khẩu không chính xác!"
}
export class InactiveAccountError extends AuthError {
    name = "InactiveAccountError";
    static type = "Tài khoản chưa được kích hoạt!"
}