import React, { FunctionComponent, useCallback } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Kodeverk } from '@fpsak-frontend/types';

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
  lagNyBehandling: (push, saksnummer, behandlingId, behandlingVersjon, isTilbakekreving, data) => void;
  push: () => void;
  menyKodeverk: {};
  opprettNyForstegangsBehandlingEnabled: boolean;
  opprettRevurderingEnabled: boolean;
  kanTilbakekrevingOpprettes: boolean;
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
  push,
  menyKodeverk,
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

    lagNyBehandling(push, saksnummer, behandlingId, behandlingVersjon, isTilbakekreving, data);

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
        menyKodeverk={menyKodeverk}
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
