import React from 'react';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

const alleKodeverk = require('../mocks/alleKodeverk.json'); // eslint-disable-line

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
