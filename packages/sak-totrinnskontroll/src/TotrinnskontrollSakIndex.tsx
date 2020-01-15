import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import ApprovalPanel from './components/ApprovalPanel';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const TotrinnskontrollSakIndex = ({
  behandlingId,
  behandlingVersjon,
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
}: TotrinnskontrollSakIndexProps) => (
  <RawIntlProvider value={intl}>
    <ApprovalPanel
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
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
    />
  </RawIntlProvider>
);

export interface TotrinnskontrollAksjonspunkter {
  aksjonspunktKode: string;
  opptjeningAktiviteter: any[];
  beregningDto: BeregningDto;
  besluttersBegrunnelse: string;
  totrinnskontrollGodkjent: boolean;
  vurderPaNyttArsaker: VurderPaNyttArsaker[];
  uttakPerioder: any[];
  arbeidforholdDtos: any[];
  skjermlenkeType: string;
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkter[];
}

export interface BeregningDto {
  fastsattVarigEndringNaering: boolean;
  faktaOmBeregningTilfeller: { kode: string }[];
}

export interface VurderPaNyttArsaker {
  kode: string;
  navn: string;
}

export interface SkjemalenkeTyper {
  kode: string;
  navn: string;
}

export interface BehandlingStatusType {
  kode: string;
}

export interface KlageVuderingResultat {
  klageVurdering: string;
}

export interface BehandlingKlageVurdering {
  klageVurdering: string;
  klageVurderingOmgjoer: string;
  klageVurderingResultatNFP: KlageVuderingResultat;
  klageVurderingResultatNK: KlageVuderingResultat;
}

interface TotrinnskontrollSakIndexProps {
  behandlingId: number;
  behandlingVersjon: number;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollAksjonspunkter[];
  totrinnskontrollReadOnlySkjermlenkeContext: TotrinnskontrollAksjonspunkter[];
  behandlingStatus: BehandlingStatusType;
  toTrinnsBehandling: boolean;
  location: object;
  skjemalenkeTyper: SkjemalenkeTyper[];
  isForeldrepengerFagsak: boolean;
  behandlingKlageVurdering?: BehandlingKlageVurdering;
  alleKodeverk: object;
  erBehandlingEtterKlage: boolean;
  readOnly: boolean;
  onSubmit: () => void;
  forhandsvisVedtaksbrev: () => void;
  disableGodkjennKnapp: boolean;
}

export default TotrinnskontrollSakIndex;
