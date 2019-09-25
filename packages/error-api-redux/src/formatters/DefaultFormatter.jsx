import ErrorMessage from './ErrorMessage';

class DefaultFormatter {
  isOfType = () => true

  format = (errorData) => {
    if (typeof errorData === 'string') {
      return ErrorMessage.withMessage(errorData);
    }

    if (errorData.feilmelding) {
      return ErrorMessage.withMessage(errorData.feilmelding, errorData.type);
    }
    if (errorData.message) {
      return ErrorMessage.withMessage(errorData.message, errorData.type);
    }
    return undefined;
  };
}

export default DefaultFormatter;
