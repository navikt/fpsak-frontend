import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import kontrollresultatKode from './kodeverk/kontrollresultatKode';
import risikoklassifiseringAksjonspunktPropType from './propTypes/risikoklassifiseringAksjonspunktPropType';
import risikoklassifiseringPropType from './propTypes/risikoklassifiseringPropType';
import ManglendeKlassifiseringPanel from './components/ManglendeKlassifiseringPanel';
import IngenRisikoPanel from './components/IngenRisikoPanel';
import HoyRisikoTittel from './components/HoyRisikoTittel';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const harResultatkode = (risikoklassifisering, resultatkode) => {
  if (!risikoklassifisering || !risikoklassifisering.kontrollresultat) {
    return false;
  }
  return risikoklassifisering.kontrollresultat.kode === resultatkode;
};

/**
 * RisikoklassifiseringSakIndex
 *
 * Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */
const RisikoklassifiseringSakIndex = ({
  behandlingId,
  behandlingVersjon,
  aksjonspunkt,
  risikoklassifisering,
  isPanelOpen,
  readOnly,
  submitAksjonspunkt,
  toggleRiskPanel,
}) => {
  const harIkkeHoyRisikoklassifisering = harResultatkode(risikoklassifisering, kontrollresultatKode.IKKE_HOY);
  const harHoyRisikoklassifisering = harResultatkode(risikoklassifisering, kontrollresultatKode.HOY);
  return (
    <RawIntlProvider value={intl}>
      { harIkkeHoyRisikoklassifisering && (
        <IngenRisikoPanel />
      )}
      { harHoyRisikoklassifisering && (
        <HoyRisikoTittel
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          risikoklassifisering={risikoklassifisering}
          aksjonspunkt={aksjonspunkt}
          readOnly={readOnly}
          isRiskPanelOpen={isPanelOpen}
          submitCallback={submitAksjonspunkt}
          toggleRiskPanel={toggleRiskPanel}
        />
      )}
      {(!harIkkeHoyRisikoklassifisering && !harHoyRisikoklassifisering) && (
        <ManglendeKlassifiseringPanel />
      )}
    </RawIntlProvider>
  );
};

RisikoklassifiseringSakIndex.propTypes = {
  behandlingId: PropTypes.number,
  behandlingVersjon: PropTypes.number,
  aksjonspunkt: risikoklassifiseringAksjonspunktPropType,
  risikoklassifisering: risikoklassifiseringPropType,
  isPanelOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitAksjonspunkt: PropTypes.func.isRequired,
  toggleRiskPanel: PropTypes.func.isRequired,
};

RisikoklassifiseringSakIndex.defaultProps = {
  behandlingId: undefined,
  behandlingVersjon: undefined,
  aksjonspunkt: undefined,
  risikoklassifisering: undefined,
};

export default RisikoklassifiseringSakIndex;
