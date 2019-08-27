import ErrorEventType from './errorEventType';
import ErrorMessage from './ErrorMessage';

const TIMEOUT_MESSAGE_CODE = 'Rest.ErrorMessage.Timeout';

class RestTimeoutFormatter {
  type = ErrorEventType.POLLING_TIMEOUT;

  isOfType = (type) => type === this.type;

  format = (errorData) => ErrorMessage.withMessageCode(TIMEOUT_MESSAGE_CODE, errorData);
}

export default RestTimeoutFormatter;
