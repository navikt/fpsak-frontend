import React from 'react';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

const history = [{
  behandlingId: 999951,
  type: {
    kode: 'NYE_REGOPPLYSNINGER',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  },
  aktoer: {
    kode: 'VL',
    kodeverk: 'HISTORIKK_AKTOER',
  },
  kjoenn: {
    kode: '-',
    kodeverk: 'BRUKER_KJOENN',
  },
  opprettetAv: 'Srvengangsstonad',
  opprettetTidspunkt: '2019-09-19T12:16:14.499',
  dokumentLinks: [],
  historikkinnslagDeler: [
    {
      begrunnelse: {
        kode: 'SAKSBEH_START_PA_NYTT',
        kodeverk: 'HISTORIKK_BEGRUNNELSE_TYPE',
      },
      begrunnelseFritekst: null,
      hendelse: {
        navn: {
          kode: 'NYE_REGOPPLYSNINGER',
          kodeverk: 'HISTORIKKINNSLAG_TYPE',
        },
        verdi: null,
      },
      opplysninger: null,
      soeknadsperiode: null,
      skjermlenke: null,
      aarsak: null,
      tema: null,
      gjeldendeFra: null,
      resultat: null,
      endredeFelter: null,
      aksjonspunkter: null,
    },
  ],
},
{
  behandlingId: null,
  type: {
    kode: 'INNSYN_OPPR',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  },
  aktoer: {
    kode: 'SBH',
    kodeverk: 'HISTORIKK_AKTOER',
  },
  kjoenn: {
    kode: '-',
    kodeverk: 'BRUKER_KJOENN',
  },
  opprettetAv: 'Z991110',
  opprettetTidspunkt: '2019-09-18T15:25:31.291',
  dokumentLinks: [],
  historikkinnslagDeler: [
    {
      begrunnelse: null,
      begrunnelseFritekst: 'Krav om innsyn mottatt 18.09.2019',
      hendelse: {
        navn: {
          kode: 'INNSYN_OPPR',
          kodeverk: 'HISTORIKKINNSLAG_TYPE',
        },
        verdi: null,
      },
      opplysninger: null,
      soeknadsperiode: null,
      skjermlenke: null,
      aarsak: null,
      tema: null,
      gjeldendeFra: null,
      resultat: null,
      endredeFelter: null,
      aksjonspunkter: null,
    },
  ],
},
{
  behandlingId: 999952,
  type: {
    kode: 'BEH_STARTET',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  },
  aktoer: {
    kode: 'SOKER',
    kodeverk: 'HISTORIKK_AKTOER',
  },
  kjoenn: {
    kode: 'K',
    kodeverk: 'BRUKER_KJOENN',
  },
  opprettetAv: 'Srvengangsstonad',
  opprettetTidspunkt: '2019-09-18T13:12:48.874',
  dokumentLinks: [
    {
      tag: 'Søknad',
      url: 'http://127.0.0.1:8080/fpsak/api/dokument/hent-dokument?journalpostId=453471722&dokumentId=470153809',
      journalpostId: '453471722',
      dokumentId: '470153809',
      utgått: false,
    },
  ],
  historikkinnslagDeler: [
    {
      begrunnelse: null,
      begrunnelseFritekst: null,
      hendelse: {
        navn: {
          kode: 'BEH_STARTET',
          kodeverk: 'HISTORIKKINNSLAG_TYPE',
        },
        verdi: null,
      },
      opplysninger: null,
      soeknadsperiode: null,
      skjermlenke: null,
      aarsak: null,
      tema: null,
      gjeldendeFra: null,
      resultat: null,
      endredeFelter: null,
      aksjonspunkter: null,
    },
  ],
}];

const alleKodeverk = {
  [kodeverkTyper.HISTORIKKINNSLAG_TYPE]: [{
    kode: 'INNSYN_OPPR',
    navn: 'Innsynsbehandling opprettet',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  }, {
    kode: 'BEH_VENT',
    navn: 'Behandling på vent',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  }, {
    kode: 'BEH_STARTET',
    navn: 'Behandling startet',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  }, {
    kode: 'TILBAKEKREVING_OPPR',
    navn: 'Tilbakekreving opprettet',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  }],
  [kodeverkTyper.HISTORIKK_AKTOER]: [{
    kode: 'VL',
    navn: 'Vedtaksløsningen',
    kodeverk: 'HISTORIKK_AKTOER',
  }, {
    kode: 'SBH',
    navn: 'Saksbehandler',
    kodeverk: 'HISTORIKK_AKTOER',
  }, {
    kode: 'SOKER',
    navn: 'Søker',
    kodeverk: 'HISTORIKK_AKTOER',
  }],
  [kodeverkTyper.HISTORIKKINNSLAG_TYPE]: [{
    kode: 'NYE_REGOPPLYSNINGER',
    navn: 'Nye registeropplysninger',
    kodeverk: 'HISTORIKKINNSLAG_TYPE',
  }],
  [kodeverkTyper.HISTORIKK_BEGRUNNELSE_TYPE]: [{
    kode: 'SAKSBEH_START_PA_NYTT',
    navn: 'Saksbehandling starter på nytt',
    kodeverk: 'HISTORIKK_BEGRUNNELSE_TYPE',
  }],
  [kodeverkTyper.VENT_AARSAK]: [{
    kode: 'VENT_PÅ_BRUKERTILBAKEMELDING',
    navn: 'Venter på tilbakemelding fra bruker',
    kodeverk: 'VENT_AARSAK',
  }],
};

export default {
  title: 'sak/sak-historikk',
  component: HistorikkSakIndex,
};

export const visHistorikk = () => (
  <div style={{
    width: '600px', backgroundColor: 'white', padding: '30px',
  }}
  >
    {history.map((h) => (
      <HistorikkSakIndex
        key={h.behandlingId}
        historieInnslag={h}
        selectedBehandlingId="1"
        saksnummer={2}
        location={{
          pathname: 'historikk',
        }}
        alleKodeverk={alleKodeverk}
      />
    ))}
  </div>
);
