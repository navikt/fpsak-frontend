class ErrorMessage {
  static withMessage(message) {
    const errorMessage = new ErrorMessage();
    errorMessage.text = message;
    return errorMessage;
  }

  static withMessageCode(messageCode, params) {
    const errorMessage = new ErrorMessage();
    errorMessage.code = messageCode;
    errorMessage.params = params;
    return errorMessage;
  }
}

export default ErrorMessage;
