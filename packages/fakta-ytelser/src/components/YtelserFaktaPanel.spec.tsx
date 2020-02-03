import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import YtelserFaktaPanel from './YtelserFaktaPanel';
import PersonYtelserTable from './PersonYtelserTable';

describe('<YtelserFaktaPanel>', () => {
  it('skal vise tabell kun for søker', () => {
    const inntektArbeidYtelse = {
      relatertTilgrensendeYtelserForSoker: [{
        relatertYtelseType: 'FORELDREPENGER',
        tilgrensendeYtelserListe: [],
      }, {
        relatertYtelseType: 'ENGANGSSTØNAD',
        tilgrensendeYtelserListe: [],
      }, {
        relatertYtelseType: 'SYKEPENGER',
        tilgrensendeYtelserListe: [{
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2018-05-27',
          periodeTilDato: '',
          status: 'LØPENDE_VEDTAK',
          saksNummer: '1312880731100',
        }, {
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2017-12-27',
          periodeTilDato: '2017-09-27',
          status: 'LUKKET_SAK',
          saksNummer: '1312880731101',
        }],
      }],
    };

    const wrapper = shallow(<YtelserFaktaPanel
      inntektArbeidYtelse={inntektArbeidYtelse}
      relatertYtelseTyper={[]}
      relatertYtelseStatus={[]}
    />);
    const table = wrapper.find(PersonYtelserTable);
    expect(table).to.have.length(1);
  });

  it('skal vise tabell for søker og annen part', () => {
    const inntektArbeidYtelse = {
      relatertTilgrensendeYtelserForSoker: [{
        relatertYtelseType: 'FORELDREPENGER',
        tilgrensendeYtelserListe: [],
      }, {
        relatertYtelseType: 'ENGANGSSTØNAD',
        tilgrensendeYtelserListe: [],
      }, {
        relatertYtelseType: 'SYKEPENGER',
        tilgrensendeYtelserListe: [{
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2018-05-27',
          periodeTilDato: '',
          status: 'LØPENDE_VEDTAK',
          saksNummer: '1312880731100',
        }, {
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2017-12-27',
          periodeTilDato: '2017-09-27',
          status: 'LUKKET_SAK',
          saksNummer: '1312880731101',
        }],
      }],
      relatertTilgrensendeYtelserForAnnenForelder: [{
        relatertYtelseType: 'FORELDREPENGER',
        tilgrensendeYtelserListe: [],
      }, {
        relatertYtelseType: 'ENGANGSSTØNAD',
        tilgrensendeYtelserListe: [],
      }, {
        relatertYtelseType: 'SYKEPENGER',
        tilgrensendeYtelserListe: [{
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2018-05-27',
          periodeTilDato: '',
          status: 'LØPENDE_VEDTAK',
          saksNummer: '1312880731100',
        }, {
          relatertYtelseType: 'SYKEPENGER',
          periodeFraDato: '2017-12-27',
          periodeTilDato: '2017-09-27',
          status: 'LUKKET_SAK',
          saksNummer: '1312880731101',
        }],
      }],
    };

    const wrapper = shallow(<YtelserFaktaPanel
      inntektArbeidYtelse={inntektArbeidYtelse}
      relatertYtelseTyper={[]}
      relatertYtelseStatus={[]}
    />);
    const table = wrapper.find(PersonYtelserTable);
    expect(table).to.have.length(2);
  });
});
