import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import ApprovalPanel from './components/ApprovalPanel';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const TotrinnskontrollSakIndex = ({
  behandlingId,
  behandlingVersjon,
  behandlingsresultat,
  totrinnskontrollSkjermlenkeContext,
  totrinnskontrollReadOnlySkjermlenkeContext,
  behandlingStatus,
  location,
  readOnly,
  onSubmit,
  forhandsvisVedtaksbrev,
  toTrinnsBehandling,
  skjemalenkeTyper,
  isForeldrepengerFagsak,
  behandlingKlageVurdering,
  alleKodeverk,
  erBehandlingEtterKlage,
  disableGodkjennKnapp,
  erTilbakekreving,
  createLocationForSkjermlenke,
}) => (
  <RawIntlProvider value={intl}>
    <ApprovalPanel
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      behandlingsresultat={behandlingsresultat}
      totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
      totrinnskontrollReadOnlySkjermlenkeContext={totrinnskontrollReadOnlySkjermlenkeContext}
      behandlingStatus={behandlingStatus}
      location={location}
      readOnly={readOnly}
      onSubmit={onSubmit}
      forhandsvisVedtaksbrev={forhandsvisVedtaksbrev}
      toTrinnsBehandling={toTrinnsBehandling}
      skjemalenkeTyper={skjemalenkeTyper}
      isForeldrepengerFagsak={isForeldrepengerFagsak}
      behandlingKlageVurdering={behandlingKlageVurdering}
      alleKodeverk={alleKodeverk}
      erBehandlingEtterKlage={erBehandlingEtterKlage}
      disableGodkjennKnapp={disableGodkjennKnapp}
      erTilbakekreving={erTilbakekreving}
      createLocationForSkjermlenke={createLocationForSkjermlenke}
    />
  </RawIntlProvider>
);

TotrinnskontrollSakIndex.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingsresultat: PropTypes.shape(),
  totrinnskontrollSkjermlenkeContext: PropTypes.arrayOf(PropTypes.shape()),
  totrinnskontrollReadOnlySkjermlenkeContext: PropTypes.arrayOf(PropTypes.shape()),
  behandlingStatus: PropTypes.shape().isRequired,
  toTrinnsBehandling: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  skjemalenkeTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isForeldrepengerFagsak: PropTypes.bool.isRequired,
  behandlingKlageVurdering: PropTypes.shape({
    klageVurdering: PropTypes.string,
    klageVurderingOmgjoer: PropTypes.string,
    klageVurderingResultatNFP: PropTypes.shape(),
    klageVurderingResultatNK: PropTypes.shape(),
  }),
  alleKodeverk: PropTypes.shape().isRequired,
  erBehandlingEtterKlage: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  forhandsvisVedtaksbrev: PropTypes.func.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
  disableGodkjennKnapp: PropTypes.bool.isRequired,
  erTilbakekreving: PropTypes.bool,
};

TotrinnskontrollSakIndex.defaultProps = {
  behandlingsresultat: undefined,
  behandlingKlageVurdering: undefined,
  erTilbakekreving: false,
};

export default TotrinnskontrollSakIndex;
