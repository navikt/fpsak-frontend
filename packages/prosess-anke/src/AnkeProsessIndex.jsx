import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandleAnkeForm from './components/BehandleAnkeForm';
import messages from '../i18n/nb_NO.json';
import ankeResultatBehandlingPropType from './propTypes/ankeResultatBehandlingPropType';
import ankeResultatAksjonspunkterPropType from './propTypes/ankeResultatAksjonspunkterPropType';
import ankeVurderingPropType from './propTypes/ankeVurderingPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const AnkeProsessIndex = ({
  behandling,
  ankeVurdering,
  behandlinger,
  aksjonspunkter,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  saveAnke,
  previewCallback,
  previewVedtakCallback,
}) => (
  <RawIntlProvider value={intl}>
    <BehandleAnkeForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      sprakkode={behandling.sprakkode}
      ankeVurderingResultat={ankeVurdering ? ankeVurdering.ankeVurderingResultat : {}}
      behandlinger={behandlinger}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      saveAnke={saveAnke}
      previewCallback={previewCallback}
      previewVedtakCallback={previewVedtakCallback}
    />
  </RawIntlProvider>
);

AnkeProsessIndex.propTypes = {
  behandling: ankeResultatBehandlingPropType.isRequired,
  ankeVurdering: ankeVurderingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(ankeResultatAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  saveAnke: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  behandlinger: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    opprettet: PropTypes.string,
    type: PropTypes.shape({
      kode: PropTypes.string,
    }),
    status: PropTypes.shape({
      kode: PropTypes.string,
    }),
  })).isRequired,
};

export default AnkeProsessIndex;
