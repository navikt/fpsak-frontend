import { dateFormat, timeFormat } from '@fpsak-frontend/utils';

import ErrorEventType from './errorEventType';
import ErrorMessage from './ErrorMessage';
import Formatter from './Formatter';

const HALTED_PROCESS_TASK_MESSAGE_CODE = 'Rest.ErrorMessage.General';
const DELAYED_PROCESS_TASK_MESSAGE_CODE = 'Rest.ErrorMessage.DownTime';

interface ErrorData {
   message: string;
   status: string;
   eta: string;
}

class RestHaltedOrDelayedFormatter implements Formatter<ErrorData> {
  type = ErrorEventType.POLLING_HALTED_OR_DELAYED;

  isOfType = (type: string) => type === this.type;

  format = (errorData: ErrorData) => {
    const { message, status, eta } = errorData;
    if (status === 'HALTED') {
      return ErrorMessage.withMessageCode(HALTED_PROCESS_TASK_MESSAGE_CODE, { errorDetails: message });
    } if (status === 'DELAYED') {
      return ErrorMessage.withMessageCode(DELAYED_PROCESS_TASK_MESSAGE_CODE, { date: dateFormat(eta), time: timeFormat(eta), message });
    }
    return undefined;
  };
}

export default RestHaltedOrDelayedFormatter;
