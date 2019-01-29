import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isInnvilget, isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import featureToggle from 'app/featureToggle';

export const hasSimuleringOn = ({ featureToggles }) => featureToggles[featureToggle.SIMULER_OPPDRAG];
export const getStatusFromSimulering = ({ resultatstruktur, behandlingsresultat }) => {
  if (isInnvilget(behandlingsresultat.type.kode) || isAvslag(behandlingsresultat.type.kode)) {
    return vut.OPPFYLT;
  }
  if (resultatstruktur) {
    return vut.OPPFYLT;
  }
  return vut.IKKE_VURDERT;
};
