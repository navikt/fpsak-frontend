import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import featureToggle from 'app/featureToggle';

export const hasSimuleringOn = ({ featureToggles }) => featureToggles[featureToggle.SIMULER_OPPDRAG];
export const getStatusFromSimulering = ({ simuleringResultat }) => {
  if (simuleringResultat) {
    return vut.OPPFYLT;
  }
  return vut.IKKE_VURDERT;
};
