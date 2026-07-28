export default class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Не авторизован") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Доступ запрещён") {
    return new ApiError(403, message);
  }

  static notFound(message = "Не найдено") {
    return new ApiError(404, message);
  }

  static internal(message = "Внутренняя ошибка сервера") {
    return new ApiError(500, message);
  }
}
