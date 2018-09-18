import { getRestApiFinished, makeRestApiRequest, resetRestApi } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';
import { getTotrinnskontrollArsaker } from 'behandling/behandlingSelectors';

/* Action creators */
export const approve = makeRestApiRequest(FpsakApi.SAVE_AKSJONSPUNKT);

export const resetApproval = resetRestApi(FpsakApi.SAVE_AKSJONSPUNKT);


/* Selectors */
export const getApproveFinished = getRestApiFinished(FpsakApi.SAVE_AKSJONSPUNKT);

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

export const getTotrinnsaksjonspunktContextTypes = (state) => {
  const aksjonspunkter = getTotrinnskontrollArsaker(state);
  return aksjonspunkter.map(({ kontekst }) => kontekst).filter(onlyUnique);
};
