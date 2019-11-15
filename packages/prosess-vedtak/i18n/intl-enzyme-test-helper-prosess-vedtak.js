import { shallowWithIntl as globalShallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import messages from './nb_NO.json';

const shallowWithIntl = (node) => globalShallowWithIntl(node, null, messages);

export default shallowWithIntl;
