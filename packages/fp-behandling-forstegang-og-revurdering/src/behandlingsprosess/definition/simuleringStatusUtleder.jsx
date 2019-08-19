import vut from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

const getStatusFromSimulering = ({ simuleringResultat }) => {
  if (simuleringResultat) {
    return vut.OPPFYLT;
  }
  return vut.IKKE_VURDERT;
};

export default getStatusFromSimulering;
