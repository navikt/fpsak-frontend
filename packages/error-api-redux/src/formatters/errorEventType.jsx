/**
 * ErrorEventType
 *
 * Dette er eventer som skal spesialformateres. Eventene her speiler eventene i eventType i rest-api.
 */
const ErrorEventType = {
  POLLING_TIMEOUT: 'POLLING_TIMEOUT',
  POLLING_HALTED_OR_DELAYED: 'POLLING_HALTED_OR_DELAYED',
  REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND: 'REQUEST_GATEWAY_TIMEOUT_OR_NOT_FOUND',
};

export default ErrorEventType;
