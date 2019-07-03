import { getFaktaRedux } from '@fpsak-frontend/fp-behandling-felles';
import { reducerRegistry } from '@fpsak-frontend/fp-felles';

const reducerName = 'ankeFakta';
const faktaRedux = getFaktaRedux(reducerName);
reducerRegistry.register(reducerName, faktaRedux.reducer);

export const { resetFakta, setOpenInfoPanels } = faktaRedux.actionCreators;
export const { getOpenInfoPanels } = faktaRedux.selectors;
