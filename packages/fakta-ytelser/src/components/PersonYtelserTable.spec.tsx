import React from 'react';
import { expect } from 'chai';
import { Normaltekst } from 'nav-frontend-typografi';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { PersonYtelserTable } from './PersonYtelserTable';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-ytelser';

describe('<PersonYtelserTable>', () => {
  const ytelser = [{
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
  }];

  const relatertYtelseTypes = [
    { kode: 'ENSLIG_FORSØRGER', navn: 'Enslig forsørger', kodeverk: 'RELATERT_YTELSE_TYPE' },
    { kode: 'SYKEPENGER', navn: 'Sykepenger', kodeverk: 'RELATERT_YTELSE_TYPE' },
    { kode: 'SVANGERSKAPSPENGER', navn: 'Svangerskapspenger', kodeverk: 'RELATERT_YTELSE_TYPE' },
    { kode: 'FORELDREPENGER', navn: 'Foreldrepenger', kodeverk: 'RELATERT_YTELSE_TYPE' },
    { kode: 'ENGANGSSTØNAD', navn: 'Engangsstønad', kodeverk: 'RELATERT_YTELSE_TYPE' },
    { kode: 'ARBEIDSAVKLARINGSPENGER', navn: 'Arbeidsavklaringspenger', kodeverk: 'RELATERT_YTELSE_TYPE' },
    { kode: 'DAGPENGER', navn: 'Dagpenger', kodeverk: 'RELATERT_YTELSE_TYPE' },
  ];

  const relatertYtelseStatus = [
    { kode: 'OPPR', navn: 'Opprettet', kodeverk: 'FAGSAK_STATUS' },
    { kode: 'UBEH', navn: 'Under behandling', kodeverk: 'FAGSAK_STATUS' },
    { kode: 'LOP', navn: 'Løpende', kodeverk: 'FAGSAK_STATUS' },
    { kode: 'AVSLU', navn: 'Avsluttet', kodeverk: 'FAGSAK_STATUS' },
    { kode: 'ÅPEN_SAK', navn: 'Åpen sak', kodeverk: 'RELATERT_YTELSE_TILSTAND' },
    { kode: 'LØPENDE_VEDTAK', navn: 'Løpende vedtak', kodeverk: 'RELATERT_YTELSE_TILSTAND' },
    { kode: 'LUKKET_SAK', navn: 'Lukket sak', kodeverk: 'RELATERT_YTELSE_TILSTAND' },
  ];

  it('skal sjekke at viser alle ytelser', () => {
    const wrapper = shallowWithIntl(<PersonYtelserTable
      intl={intlMock}
      ytelser={ytelser}
      relatertYtelseTyper={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows).to.have.length(4);
  });

  it('skal sjekke visning av ikke eksisterende ytelse', () => {
    const wrapper = shallowWithIntl(<PersonYtelserTable
      intl={intlMock}
      ytelser={ytelser}
      relatertYtelseTyper={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows.find('Normaltekst').first().childAt(0).text()).to.equal('Foreldrepenger');
    expect(rows.find('Normaltekst').at(1).childAt(0).text()).to.equal('Ingen');
  });

  it('skal sjekke at viser ytelse informasjon', () => {
    const wrapper = shallowWithIntl(<PersonYtelserTable
      intl={intlMock}
      ytelser={ytelser}
      relatertYtelseTyper={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows.length).to.equal(4);
    expect(rows.at(2).find(Normaltekst).at(0).childAt(0)
      .text()).to.equal('Sykepenger');
    expect(rows.at(2).find(Normaltekst).at(1).childAt(0)
      .text()).to.equal('27.05.2018 - ');
    expect(rows.at(2).find(Normaltekst).at(2).childAt(0)
      .text()).to.equal('Løpende vedtak');
    expect(rows.at(2).find(Normaltekst).at(3).childAt(0)
      .text()).to.equal('1312880731100');
  });

  it('skal sjekke at ytelse navn ikke vises hvis det ligger mer enn en ytelse av samme type', () => {
    const wrapper = shallowWithIntl(<PersonYtelserTable
      intl={intlMock}
      ytelser={ytelser}
      relatertYtelseTyper={relatertYtelseTypes}
      relatertYtelseStatus={relatertYtelseStatus}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows.length).to.equal(4);
    expect(rows.at(3).find(Normaltekst).at(0).childAt(0)
      .text()).to.equal('27.12.2017 - 27.09.2017');
    expect(rows.at(3).find(Normaltekst).at(1).childAt(0)
      .text()).to.equal('Lukket sak');
    expect(rows.at(3).find(Normaltekst).at(2).childAt(0)
      .text()).to.equal('1312880731101');
  });
});
