import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Risikoklassifisering, Aksjonspunkt } from '@fpsak-frontend/types';

import kontrollresultatKode from './kodeverk/kontrollresultatKode';
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

interface OwnProps {
  behandlingId?: number;
  behandlingVersjon?: number;
  aksjonspunkt?: Aksjonspunkt;
  risikoklassifisering?: Risikoklassifisering;
  isPanelOpen: boolean;
  readOnly: boolean;
  submitAksjonspunkt: (aksjonspunkt: Aksjonspunkt) => void;
  toggleRiskPanel: () => void;
}

/**
 * RisikoklassifiseringSakIndex
 *
 * Har ansvar for å vise risikoklassifisering for valgt behandling
 * Viser en av tre komponenter avhengig av: Om ingen klassifisering er utført,
 * om klassifisering er utført og ingen faresignaler er funnet og om klassifisering er utført og faresignaler er funnet
 */
const RisikoklassifiseringSakIndex: FunctionComponent<OwnProps> = ({
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

export default RisikoklassifiseringSakIndex;
