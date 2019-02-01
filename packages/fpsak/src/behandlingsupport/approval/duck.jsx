import fpsakApi from 'data/fpsakApi';
import { getTotrinnskontrollArsaker } from 'behandling/duck';

/* Action creators */
export const approve = fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.makeRestApiRequest();

export const resetApproval = fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.resetRestApi();


/* Selectors */
export const getApproveFinished = fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.getRestApiFinished();

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

export const getTotrinnsaksjonspunktContextTypes = (state) => {
  const aksjonspunkter = getTotrinnskontrollArsaker(state);
  return aksjonspunkter.map(({ kontekst }) => kontekst).filter(onlyUnique);
};
