import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import Messages from './components/Messages';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const MeldingerSakIndex = ({
  submitCallback,
  recipients,
  templates,
  sprakKode,
  previewCallback,
  behandlingId,
  behandlingVersjon,
  isKontrollerRevurderingApOpen,
  revurderingVarslingArsak,
}) => (
  <RawIntlProvider value={intl}>
    <Messages
      submitCallback={submitCallback}
      recipients={recipients}
      templates={templates}
      sprakKode={sprakKode}
      previewCallback={previewCallback}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      isKontrollerRevurderingApOpen={isKontrollerRevurderingApOpen}
      revurderingVarslingArsak={revurderingVarslingArsak}
    />
  </RawIntlProvider>
);

MeldingerSakIndex.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  recipients: PropTypes.arrayOf(PropTypes.string).isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
    tilgjengelig: PropTypes.bool.isRequired,
  })),
  sprakKode: PropTypes.shape().isRequired,
  previewCallback: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  isKontrollerRevurderingApOpen: PropTypes.bool,
  revurderingVarslingArsak: PropTypes.arrayOf(kodeverkObjektPropType).isRequired,
};

MeldingerSakIndex.defaultProps = {
  isKontrollerRevurderingApOpen: false,
  templates: [],
};

export default MeldingerSakIndex;
