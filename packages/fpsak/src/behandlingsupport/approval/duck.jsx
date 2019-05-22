import fpsakApi from 'data/fpsakApi';
import { getTotrinnskontrollArsaker } from 'behandling/duck';

/* Action creators */
export const approve = (erTilbakekreving, params) => dispatch => (erTilbakekreving
    ? dispatch(fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT_FPTILBAKE.makeRestApiRequest()(params))
    : dispatch(fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.makeRestApiRequest()(params)));

export const resetApproval = erTilbakekreving => dispatch => (erTilbakekreving
  ? dispatch(fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT_FPTILBAKE.resetRestApi())
  : dispatch(fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.resetRestApi()));


/* Selectors */
export const getApproveFinished = fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT.getRestApiFinished();
export const getApproveFinishedTilbakekreving = fpsakApi.SAVE_TOTRINNSAKSJONSPUNKT_FPTILBAKE.getRestApiFinished();

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

export const getTotrinnsaksjonspunktContextTypes = (state) => {
  const aksjonspunkter = getTotrinnskontrollArsaker(state);
  return aksjonspunkter.map(({ kontekst }) => kontekst).filter(onlyUnique);
};
