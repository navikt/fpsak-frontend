import ErrorEventType from './errorEventType';
import ErrorMessage from './ErrorMessage';

const TIMEOUT_MESSAGE_CODE = 'Rest.ErrorMessage.GatewayTimeoutOrNotFound';

const findContextPath = (location) => location.split('/')[1].toUpperCase();

class RestGatewayTimeoutOrNotFoundFormatter {
  type = ErrorEventType.REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND;

  isOfType = (type) => type === this.type;

  format = (errorData) => ErrorMessage.withMessageCode(TIMEOUT_MESSAGE_CODE, {
    contextPath: errorData.location ? findContextPath(errorData.location) : '',
    location: errorData.location,
  });
}

export default RestGatewayTimeoutOrNotFoundFormatter;
