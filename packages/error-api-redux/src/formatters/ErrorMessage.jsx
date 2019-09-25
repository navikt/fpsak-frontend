class ErrorMessage {
  static withMessage(message, type) {
    const errorMessage = new ErrorMessage();
    errorMessage.text = message;
    if (type !== undefined) {
      errorMessage.type = type;
    }
    return errorMessage;
  }

  static withMessageCode(messageCode, params, type) {
    const errorMessage = new ErrorMessage();
    errorMessage.code = messageCode;
    errorMessage.params = params;
    if (type !== undefined) {
      errorMessage.type = type;
    }
    return errorMessage;
  }
}

export default ErrorMessage;
