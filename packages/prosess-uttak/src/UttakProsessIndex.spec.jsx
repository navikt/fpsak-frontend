import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import UttakPanel from './components/UttakPanel';
import UttakProsessIndex from './UttakProsessIndex';

describe('<UttakProsessIndex>', () => {
  const fagsak = {
    saksnummer: 123,
    ytelseType: {
      kode: fagsakYtelseType.FORELDREPENGER,
    },
  };

  const uttaksresultatPerioder = {
    perioderSøker: [
      {
        fom: '2019-10-05',
        tom: '2019-10-25',
        aktiviteter: [
          {
            stønadskontoType: {
              kode: 'FORELDREPENGER_FØR_FØDSEL',
              kodeverk: 'STOENADSKONTOTYPE',
            },
            prosentArbeid: 0,
            arbeidsforholdId: null,
            eksternArbeidsforholdId: null,
            arbeidsgiver: {
              identifikator: '910909088',
              aktørId: null,
              fødselsdato: null,
              navn: 'BEDRIFT AS',
              virksomhet: true,
            },
            utbetalingsgrad: 100,
            uttakArbeidType: {
              kode: 'ORDINÆRT_ARBEID',
              kodeverk: 'UTTAK_ARBEID_TYPE',
            },
            gradering: false,
            trekkdagerDesimaler: 15,
            trekkdager: null,
          },
        ],
        periodeResultatType: {
          kode: 'INNVILGET',
          kodeverk: 'PERIODE_RESULTAT_TYPE',
        },
        begrunnelse: null,
        periodeResultatÅrsak: {
          kode: '2006',
          navn: '§14-10: Innvilget foreldrepenger før fødsel',
          kodeverk: 'INNVILGET_AARSAK',
          gyldigFom: '2000-01-01',
          gyldigTom: '9999-12-31',
        },
        manuellBehandlingÅrsak: {
          kode: '-',
          kodeverk: 'MANUELL_BEHANDLING_AARSAK',
        },
        graderingAvslagÅrsak: {
          kode: '-',
          navn: 'Ikke definert',
          kodeverk: 'GRADERING_AVSLAG_AARSAK',
          gyldigFom: '2000-01-01',
          gyldigTom: '9999-12-31',
        },
        flerbarnsdager: false,
        samtidigUttak: false,
        samtidigUttaksprosent: null,
        graderingInnvilget: false,
        periodeType: {
          kode: 'FORELDREPENGER_FØR_FØDSEL',
          kodeverk: 'UTTAK_PERIODE_TYPE',
        },
        utsettelseType: {
          kode: '-',
          kodeverk: 'UTTAK_UTSETTELSE_TYPE',
        },
        oppholdÅrsak: {
          kode: '-',
          kodeverk: 'OPPHOLD_AARSAK_TYPE',
        },
        gradertAktivitet: null,
        periodeResultatÅrsakLovhjemmel: {
          fagsakYtelseType: {
            FP: {
              lovreferanse: '14-10',
            },
          },
        },
        graderingsAvslagÅrsakLovhjemmel: null,
      },
    ],
    perioderAnnenpart: [],
    annenForelderHarRett: true,
    aleneomsorg: false,
  };

  const behandling = {
    id: 1,
    versjon: 1,
    sprakkode: {
      kode: 'NO',
    },
    type: {
      kode: '1',
      kodeverk: '1',
    },
    behandlingsresultat: {
      skjaeringstidspunktForeldrepenger: '2019-01-01',
    },
    status: {
      kode: '1',
      kodeverk: '1',
    },
  };

  const aksjonspunkter = [{
    definisjon: {
      kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
    },
    status: {
      kode: '1',
      kodeverk: '1',
    },
  }];

  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<UttakProsessIndex
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      submitCallback={sinon.spy()}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen
      uttakStonadskontoer={{}}
      soknad={{}}
      familiehendelse={{}}
      uttaksresultatPerioder={uttaksresultatPerioder}
      personopplysninger={{}}
      alleKodeverk={{}}
      employeeHasAccess
      tempUpdateStonadskontoer={sinon.spy()}
      uttakPeriodeGrense={{}}
      ytelsefordeling={{}}
    />);
    expect(wrapper.find(UttakPanel)).has.length(1);
  });
});
