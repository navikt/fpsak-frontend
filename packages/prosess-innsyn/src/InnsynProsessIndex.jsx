import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import InnsynForm from './components/InnsynForm';
import messages from '../i18n/nb_NO.json';
import innsynBehandlingPropType from './propTypes/innsynBehandlingPropType';
import innsynAksjonspunkterPropType from './propTypes/innsynAksjonspunkterPropType';
import innsynPropType from './propTypes/innsynPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const InnsynProsessIndex = ({
  behandling,
  innsyn,
  alleDokumenter,
  saksnummer,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <InnsynForm
      saksNr={saksnummer}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingPaaVent={behandling.behandlingPaaVent}
      innsynMottattDato={innsyn ? innsyn.innsynMottattDato : undefined}
      innsynDokumenter={innsyn ? innsyn.dokumenter : undefined}
      innsynResultatType={innsyn ? innsyn.innsynResultatType : undefined}
      vedtaksdokumentasjon={innsyn ? innsyn.vedtaksdokumentasjon : undefined}
      alleDokumenter={alleDokumenter}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
    />
  </RawIntlProvider>
);

InnsynProsessIndex.propTypes = {
  behandling: innsynBehandlingPropType.isRequired,
  innsyn: innsynPropType,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksnummer: PropTypes.number.isRequired,
  aksjonspunkter: PropTypes.arrayOf(innsynAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

InnsynProsessIndex.defaultProps = {
  innsyn: {},
};

export default InnsynProsessIndex;
