import { createSelector } from 'reselect';

import { BehandlingspunktProperties } from '@fpsak-frontend/behandling-felles';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const hasNonDefaultBehandlingspunkt = (builderData, bpLength) => bpLength > 0;

/**
 * Rekkefølgen i listene under bestemmer behandlingspunkt-rekkefølgen i GUI.
 * @see BehandlingspunktProperties.Builder for mer informasjon.
 */
const innsynBuilders = [
  new BehandlingspunktProperties.Builder(bpc.BEHANDLE_INNSYN, 'Innsyn')
    .withAksjonspunktCodes(ac.VURDER_INNSYN),
  new BehandlingspunktProperties.Builder(bpc.VEDTAK, 'Vedtak')
    .withAksjonspunktCodes(
      ac.FORESLA_VEDTAK, ac.FATTER_VEDTAK, ac.FORESLA_VEDTAK_MANUELT, ac.VEDTAK_UTEN_TOTRINNSKONTROLL, ac.VURDERE_ANNEN_YTELSE,
      ac.VURDERE_DOKUMENT, ac.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST, ac.KONTROLL_AV_MAUNELT_OPPRETTET_REVURDERINGSBEHANDLING,
    )
    .withVisibilityWhen(hasNonDefaultBehandlingspunkt),
];

const createInnsynStegProps = (builderData) => innsynBuilders.reduce((currentFbs, fb) => {
  const res = fb.build(builderData, currentFbs.length);
  return res.isVisible ? currentFbs.concat([res]) : currentFbs;
}, []);

const finnInnsynSteg = createSelector(
  [(ownProps) => ownProps.behandling,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.vilkar,
    (ownProps) => ownProps.innsyn],
  (behandling, aksjonspunkter, vilkar, innsyn) => {
    if (!behandling.type) {
      return undefined;
    }

    const builderData = {
      behandlingType: behandling.type,
      aksjonspunkter,
      vilkar,
      innsynResultatType: innsyn.innsynResultatType,
    };

    return createInnsynStegProps(builderData);
  },
);

export default finnInnsynSteg;
