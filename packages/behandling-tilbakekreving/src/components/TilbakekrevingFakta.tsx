import React, {
  FunctionComponent, useMemo, useCallback, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { aksjonspunktPropType, navAnsattPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  DataFetcherBehandling, behandlingPropType, fagsakInfoPropType, FagsakInfo, Behandling, Aksjonspunkt, FaktaPanel, erReadOnly,
  getAlleMerknaderFraBeslutter, Kodeverk, NavAnsatt, BehandlingDataCache,
} from '@fpsak-frontend/behandling-felles';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';

import tilbakekrevingApi from '../data/tilbakekrevingBehandlingApi';

const feilutbetalingData = [tilbakekrevingApi.FEILUTBETALING_FAKTA, tilbakekrevingApi.FEILUTBETALING_AARSAK];

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  kodeverk: {[key: string]: [Kodeverk]};
  navAnsatt: NavAnsatt;
  hasFetchError: boolean;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
}

const getBekreftFaktaCallback = (dispatch, fagsak, behandling, oppdaterProsessStegIUrl) => (aksjonspunkter) => {
  const model = aksjonspunkter.map((ap) => ({
    '@type': ap.kode,
    ...ap,
  }));

  const params = {
    saksnummer: fagsak.saksnummer,
    behandlingId: behandling.id,
    behandlingVersjon: behandling.versjon,
    bekreftedeAksjonspunktDtoer: model,
  };

  return dispatch(tilbakekrevingApi.SAVE_AKSJONSPUNKT.makeRestApiRequest()(params, { keepData: true }))
    .then(() => oppdaterProsessStegIUrl('default'));
};

const TilbakekrevingFakta: FunctionComponent<OwnProps> = ({
  behandling,
  fagsak,
  aksjonspunkter,
  kodeverk,
  navAnsatt,
  hasFetchError,
  oppdaterProsessStegIUrl,
}) => {
  const intl = useIntl();
  const apForPanel = useMemo(() => aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING),
    [aksjonspunkter]);
  const harApneAksjonspunkter = apForPanel.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses);
  const readOnly = erReadOnly(behandling, apForPanel, [], navAnsatt, fagsak, hasFetchError);

  const dispatch = useDispatch();
  const bekreftCallback = useCallback(getBekreftFaktaCallback(dispatch, fagsak, behandling, oppdaterProsessStegIUrl), [behandling.versjon]);

  const cache = new BehandlingDataCache();
  cache.setVersion(behandling.versjon);

  return (
    <FaktaPanel paneler={[{
      tekst: intl.formatMessage({ id: 'TilbakekrevingFakta.FaktaFeilutbetaling' }),
      erAktiv: true,
      harAksjonspunkt: harApneAksjonspunkter,
    }]}
    >
      <DataFetcherBehandling
        behandlingDataCache={cache}
        behandlingVersjon={behandling.versjon}
        endpoints={feilutbetalingData}
        render={(dataProps) => {
          if (dataProps.feilutbetalingFakta) {
            return (
              <FeilutbetalingFaktaIndex
                aksjonspunkter={apForPanel}
                submitCallback={bekreftCallback}
                readOnly={readOnly}
                alleMerknaderFraBeslutter={getAlleMerknaderFraBeslutter(behandling, aksjonspunkter)}
                alleKodeverk={kodeverk}
                behandling={behandling}
                feilutbetalingFakta={dataProps.feilutbetalingFakta}
                feilutbetalingAarsak={dataProps.feilutbetalingAarsak.find((a) => a.ytelseType.kode === fagsak.fagsakYtelseType.kode)}
                hasOpenAksjonspunkter={harApneAksjonspunkter}
                submittable={apForPanel.some((ap) => !isAksjonspunktOpen(ap.status.kode) || ap.kanLoses)}
              />
            );
          }
          return null;
        }}
      />
    </FaktaPanel>
  );
};

TilbakekrevingFakta.propTypes = {
  fagsak: fagsakInfoPropType.isRequired,
  behandling: behandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  kodeverk: PropTypes.shape({}).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  hasFetchError: PropTypes.bool.isRequired,
  oppdaterProsessStegIUrl: PropTypes.func.isRequired,
};

export default TilbakekrevingFakta;
