import ErrorMessage from './ErrorMessage';
import Formatter from './Formatter';

interface ErrorData {
  feilmelding?: string;
  message?: string;
  type?: any;
}

class DefaultFormatter implements Formatter<ErrorData | string> {
  isOfType = () => true

  format = (errorData: ErrorData | string) => {
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
