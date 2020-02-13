import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import FatterVedtakApprovalModal from './components/modal/FatterVedtakApprovalModal';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const FatterVedtakApprovalModalSakIndex = ({
  showModal,
  closeEvent,
  allAksjonspunktApproved,
  fagsakYtelseType,
  erGodkjenningFerdig,
  erKlageWithKA,
  behandlingsresultat,
  behandlingId,
  behandlingStatusKode,
  behandlingTypeKode,
  harSammeResultatSomOriginalBehandling,
}) => (
  <RawIntlProvider value={intl}>
    <FatterVedtakApprovalModal
      showModal={showModal}
      closeEvent={closeEvent}
      allAksjonspunktApproved={allAksjonspunktApproved}
      fagsakYtelseType={fagsakYtelseType}
      erGodkjenningFerdig={erGodkjenningFerdig}
      erKlageWithKA={erKlageWithKA}
      behandlingsresultat={behandlingsresultat}
      behandlingId={behandlingId}
      behandlingStatusKode={behandlingStatusKode}
      behandlingTypeKode={behandlingTypeKode}
      harSammeResultatSomOriginalBehandling={harSammeResultatSomOriginalBehandling}
    />
  </RawIntlProvider>
);

FatterVedtakApprovalModalSakIndex.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeEvent: PropTypes.func.isRequired,
  allAksjonspunktApproved: PropTypes.bool.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  erGodkjenningFerdig: PropTypes.bool.isRequired,
  erKlageWithKA: PropTypes.bool,
  behandlingsresultat: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
  harSammeResultatSomOriginalBehandling: PropTypes.bool,
};

FatterVedtakApprovalModalSakIndex.defaultProps = {
  erKlageWithKA: undefined,
  harSammeResultatSomOriginalBehandling: false,
};

export default FatterVedtakApprovalModalSakIndex;
