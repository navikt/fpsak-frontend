import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

const getAlleMerknaderFraBeslutter = (behandling, aksjonspunkter) => {
  if (behandling.status.kode !== behandlingStatus.BEHANDLING_UTREDES) {
    return [];
  }
  return aksjonspunkter.reduce((obj, ap) => ({
    ...obj,
    [ap.definisjon.kode]: {
      notAccepted: ap.toTrinnsBehandling && ap.toTrinnsBehandlingGodkjent === false,
    },
  }), {});
};

export default getAlleMerknaderFraBeslutter;
