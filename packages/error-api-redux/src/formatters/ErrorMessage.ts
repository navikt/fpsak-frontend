class ErrorMessage {
  text: string

  code: string

  params: any

  static withMessage(message: string) {
    const errorMessage = new ErrorMessage();
    errorMessage.text = message;
    return errorMessage;
  }

  static withMessageCode(messageCode: string, params: any) {
    const errorMessage = new ErrorMessage();
    errorMessage.code = messageCode;
    errorMessage.params = params;
    return errorMessage;
  }
}

export default ErrorMessage;
