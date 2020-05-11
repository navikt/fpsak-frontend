import React, { FunctionComponent, useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Kodeverk, KodeverkMedNavn } from '@fpsak-frontend/types';

import NyBehandlingModal from './components/NyBehandlingModal';

import messages from '../i18n/nb_NO.json';

const TILBAKEKREVING_BEHANDLINGSTYPER = [BehandlingType.TILBAKEKREVING, BehandlingType.TILBAKEKREVING_REVURDERING];


const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

export const skalViseIMeny = (erKoet, ikkeVisOpprettNyBehandling) => !erKoet && !ikkeVisOpprettNyBehandling.isEnabled;

export const getMenytekst = () => intl.formatMessage({ id: 'MenyNyBehandlingIndex.NyForstegangsbehandling' });

interface OwnProps {
  ytelseType: Kodeverk;
  saksnummer: number;
  behandlingId?: number;
  behandlingVersjon?: number;
  behandlingType?: Kodeverk;
  lagNyBehandling: (saksnummer, behandlingId, behandlingVersjon, isTilbakekreving, data) => void;
  behandlingstyper: KodeverkMedNavn[];
  tilbakekrevingRevurderingArsaker: KodeverkMedNavn[];
  revurderingArsaker: KodeverkMedNavn[];
  opprettNyForstegangsBehandlingEnabled: boolean;
  opprettRevurderingEnabled: boolean;
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  uuidForSistLukkede?: string;
  erTilbakekrevingAktivert: boolean;
  sjekkOmTilbakekrevingKanOpprettes: (params: {
    saksnummer: number;
    uuid: string;
  }) => void;
  sjekkOmTilbakekrevingRevurderingKanOpprettes: (params: {
    behandlingId: number;
  }) => void;
  lukkModal: () => void;
}

const MenyNyBehandlingIndex: FunctionComponent<OwnProps> = ({
  ytelseType,
  saksnummer,
  behandlingId,
  behandlingVersjon,
  behandlingType,
  lagNyBehandling,
  behandlingstyper,
  tilbakekrevingRevurderingArsaker,
  revurderingArsaker,
  opprettNyForstegangsBehandlingEnabled,
  opprettRevurderingEnabled,
  kanTilbakekrevingOpprettes,
  uuidForSistLukkede,
  erTilbakekrevingAktivert,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  lukkModal,
}) => {
  const submit = useCallback((formValues) => {
    const isTilbakekreving = TILBAKEKREVING_BEHANDLINGSTYPER.includes(formValues.behandlingType);
    const tilbakekrevingBehandlingId = behandlingId && isTilbakekreving ? { behandlingId } : {};
    const data = {
      saksnummer: saksnummer.toString(),
      ...tilbakekrevingBehandlingId,
      ...formValues,
    };

    lagNyBehandling(saksnummer, behandlingId, behandlingVersjon, isTilbakekreving, data);

    lukkModal();
  }, [behandlingId, behandlingVersjon]);
  return (
    <RawIntlProvider value={intl}>
      <NyBehandlingModal
        ytelseType={ytelseType}
        saksnummer={saksnummer}
        cancelEvent={lukkModal}
        submitCallback={submit}
        hasEnabledCreateNewBehandling={opprettNyForstegangsBehandlingEnabled}
        hasEnabledCreateRevurdering={opprettRevurderingEnabled}
        behandlingstyper={behandlingstyper}
        tilbakekrevingRevurderingArsaker={tilbakekrevingRevurderingArsaker}
        revurderingArsaker={revurderingArsaker}
        kanTilbakekrevingOpprettes={kanTilbakekrevingOpprettes}
        behandlingType={behandlingType}
        behandlingId={behandlingId}
        uuidForSistLukkede={uuidForSistLukkede}
        erTilbakekrevingAktivert={erTilbakekrevingAktivert}
        sjekkOmTilbakekrevingKanOpprettes={sjekkOmTilbakekrevingKanOpprettes}
        sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkOmTilbakekrevingRevurderingKanOpprettes}
      />
    </RawIntlProvider>
  );
};

export default MenyNyBehandlingIndex;
