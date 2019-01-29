import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isInnvilget, isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import featureToggle from 'app/featureToggle';

export const hasSimuleringOn = ({ featureToggles }) => featureToggles[featureToggle.SIMULER_OPPDRAG];
export const getStatusFromSimulering = ({ resultatstruktur, behandlingsresultat }) => {
  const behandlingsprosessErGjennomført = isInnvilget(behandlingsresultat.type.kode) || isAvslag(behandlingsresultat.type.kode);
  if (behandlingsprosessErGjennomført) {
    return vut.OPPFYLT;
  }
  if (resultatstruktur && !behandlingsprosessErGjennomført) {
    return vut.OPPFYLT;
  }
  return vut.IKKE_VURDERT;
};
