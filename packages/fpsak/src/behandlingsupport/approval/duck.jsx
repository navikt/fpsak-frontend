import fpsakApi from 'data/fpsakApi';
import { getTotrinnskontrollArsaker } from 'behandlingFpsak/behandlingSelectors';

/* Action creators */
export const approve = fpsakApi.SAVE_AKSJONSPUNKT.makeRestApiRequest();

export const resetApproval = fpsakApi.SAVE_AKSJONSPUNKT.resetRestApi();


/* Selectors */
export const getApproveFinished = fpsakApi.SAVE_AKSJONSPUNKT.getRestApiFinished();

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

export const getTotrinnsaksjonspunktContextTypes = (state) => {
  const aksjonspunkter = getTotrinnskontrollArsaker(state);
  return aksjonspunkter.map(({ kontekst }) => kontekst).filter(onlyUnique);
};
