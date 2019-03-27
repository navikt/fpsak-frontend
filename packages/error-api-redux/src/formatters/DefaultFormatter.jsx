import ErrorMessage from './ErrorMessage';

class DefaultFormatter {
  isOfType = () => true

  format = (errorData) => {
    if (typeof errorData === 'string') {
      return ErrorMessage.withMessage(errorData);
    }

    if (errorData.feilmelding) {
      return ErrorMessage.withMessage(errorData.feilmelding);
    }
    if (errorData.message) {
      return ErrorMessage.withMessage(errorData.message);
    }
    return undefined;
  };
}

export default DefaultFormatter;
