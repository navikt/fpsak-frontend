import { getCommonBehandlingSelectors } from '@fpsak-frontend/fp-behandling-felles';

import forstegangOgRevBehandlingApi from '../data/fpsakBehandlingApi';
import { getSelectedBehandlingId } from '../duck';

const commonBehandlingSelectors = getCommonBehandlingSelectors(getSelectedBehandlingId, forstegangOgRevBehandlingApi);

export default commonBehandlingSelectors;
