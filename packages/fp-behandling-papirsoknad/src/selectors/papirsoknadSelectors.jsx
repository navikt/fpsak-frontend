import { omit } from '@fpsak-frontend/utils';
import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';

import { getSelectedBehandlingId } from '../duckPapirsoknad';
import papirsoknadApi from '../data/papirsoknadApi';

const commonBehandlingSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, papirsoknadApi);

const papirsoknadBehandlingSelectors = {
  ...omit(commonBehandlingSelectors, 'getSelectedBehandling'),
};

export default papirsoknadBehandlingSelectors;
