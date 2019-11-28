import innsynBehandlingApi from './innsynBehandlingApi';

const resolveProsessAksjonspunkter = (behandlingIdentifier, params) => (dispatch) => dispatch(
  innsynBehandlingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params, { keepData: true }),
);

export default resolveProsessAksjonspunkter;
