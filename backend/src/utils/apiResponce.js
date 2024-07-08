class apiResponce {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;
    this.data = datathis;
    this.message = message;
    this.success = statusCode<400
  }
}
